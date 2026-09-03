'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CertificateCoursesSection.module.css';
import CourseServices from '@/services/CourseServices';
import ContactServices from '@/services/ContactServices';

const resolveImageUrl = (img) => {
  if (!img) return '';
  const clean = img.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  const backendBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
  const cleanPath = clean.startsWith('/') ? clean : `/${clean}`;
  return `${backendBase}${cleanPath}`;
};

const formatDuration = (val) => {
  if (!val) return '3 Months';
  const str = String(val).trim();
  if (str.toLowerCase().includes('month') || str.toLowerCase().includes('year') || str.toLowerCase().includes('week') || str.toLowerCase().includes('day')) {
    // Capitalize properly e.g. "6 Months"
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return `${str} Months`;
};

const formatFees = (val) => {
  if (!val) return '₹ Fees: Rs. 8,000/Sem.';
  let str = String(val).trim();

  // If user only typed number e.g. "1000" or "8000"
  const isNumberOnly = /^[0-9,.]+$/.test(str);
  if (isNumberOnly) {
    const num = Number(str.replace(/,/g, ''));
    const formattedNum = !isNaN(num) ? num.toLocaleString('en-IN') : str;
    return `₹ Fees: Rs. ${formattedNum}/Sem.`;
  }

  // If user already typed "Fees: Rs. 8,000/Sem." or "Rs. 1000"
  if (!str.startsWith('₹')) {
    if (!str.toLowerCase().includes('fees:')) {
      if (str.toLowerCase().startsWith('rs.') || str.toLowerCase().startsWith('rs')) {
        str = `Fees: ${str}`;
      } else {
        str = `Fees: Rs. ${str}`;
      }
    }
    if (!str.toLowerCase().includes('/sem') && !str.toLowerCase().includes('/year') && !str.toLowerCase().includes('/course')) {
      str = `${str}/Sem.`;
    }
    return `₹ ${str}`;
  }

  return str;
};

const categoryBadgeStyles = [styles.tagRuby, styles.tagGold, styles.tagCyan, styles.tagRose, styles.tagEmerald];

export default function CertificateCoursesSection() {
  const router = useRouter();
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Slider State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slidesToShow, setSlidesToShow] = useState(3);

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [mainCourse, setMainCourse] = useState('B.C.A. (Bachelor of Computer Applications)');
  const [message, setMessage] = useState('');

  // Responsive slidesToShow detection
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSlidesToShow(1);
      } else if (window.innerWidth <= 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch purely dynamic active certificate courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await CourseServices.getAllCourses({ status: 'active', limit: 50 });
        if (res?.data && Array.isArray(res.data)) {
          const formatted = res.data.map((item, idx) => {
            const rawImg = item.imageUrl || item.image_url || item.image || '';
            const highlights = Array.isArray(item.highlights) ? item.highlights : [];
            return {
              id: item._id || item.guid || idx,
              title: item.title || '',
              category: item.category || 'Skill Program',
              badge: item.badge || item.tag || 'Popular',
              description: item.description || '',
              duration: formatDuration(item.duration),
              fees: formatFees(item.fees),
              highlights: highlights,
              image: resolveImageUrl(rawImg),
              slug: item.slug || ''
            };
          });
          setCoursesData(formatted);
        }
      } catch (err) {
        console.error('Error fetching certificate courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const totalCourses = coursesData.length;
  const isSliderActive = totalCourses > 3;
  const maxIndex = Math.max(0, totalCourses - slidesToShow);

  // Auto-looping slider (3.5s) when > 3 cards
  useEffect(() => {
    if (!isSliderActive || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(interval);
  }, [isSliderActive, isPaused, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const openEnrollModal = (courseTitle) => {
    setSelectedCert(courseTitle);
    setIsOpen(true);
  };

  const closeEnrollModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ContactServices.submitInquiry({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        name: `${firstName} ${lastName}`.trim(),
        email: email.trim(),
        phone: phone.trim(),
        course: selectedCert || mainCourse,
        reason: 'Certificate Course Registration',
        teacher: mainCourse,
        message: `Registered for certificate course: ${selectedCert}`,
        source: 'certificate_courses_modal',
      });
    } catch (err) {
      console.error('Registration inquiry error:', err);
    } finally {
      closeEnrollModal();
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setMessage('');
      router.push('/thank-you');
    }
  };

  const degreePrograms = [
    'B.C.A. (Bachelor of Computer Applications)',
    'B.B.A. (Bachelor of Business Administration)',
    'B.Com. (Bachelor of Commerce)',
    'B.A. (Bachelor of Arts)',
    'B.Sc. Home Science',
    'M.Com. (Master of Commerce)',
    'M.S.W. (Master of Social Work)',
    'D.F.D. (Diploma in Fashion Designing)',
    'Other Diploma / Certificate'
  ];

  const renderCard = (course, index) => (
    <div key={course.id} className={`${styles.certCardLuxury} cert-card-luxury`}>
      <div className={`${styles.certCardMedia} cert-card-media`}>
        {course.image ? (
          <Image 
            src={course.image} 
            alt={course.title} 
            width={600} 
            height={400} 
            className={`${styles.certCardImg} cert-card-img`}
            unoptimized={course.image.startsWith('http')}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #8a0000 0%, #b30000 100%)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '1.25rem'
          }}>
            🎓
          </div>
        )}
        <span className={`${styles.certMediaBadge} ${categoryBadgeStyles[index % categoryBadgeStyles.length]} cert-media-badge`}>
          {course.category}
        </span>
        {course.badge && (
          <span className={`${styles.certHighlightPill} cert-highlight-pill`}>
            ★ {course.badge}
          </span>
        )}
      </div>

      <div className={`${styles.certCardBody} cert-card-body`}>
        <h3 className={`${styles.certCardTitle} cert-card-title`}>{course.title}</h3>
        <p className={`${styles.certCardDesc} cert-card-desc`}>{course.description}</p>

        {course.highlights && course.highlights.length > 0 && (
          <ul className={`${styles.certBulletsList} cert-bullets-list`}>
            {course.highlights.slice(0, 3).map((h, idx) => (
              <li key={idx}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        <div className={`${styles.certMetaStrip} cert-meta-strip`}>
          <span className={`${styles.certMetaItem} cert-meta-item`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold-600)" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {course.duration}
          </span>
          <span className={`${styles.certMetaItem} ${styles.certMetaFees} cert-meta-item`}>
            {course.fees}
          </span>
        </div>

        <button
          type="button"
          onClick={() => openEnrollModal(course.title)}
          className={`${styles.certActionBtn} cert-action-btn`}
        >
          <span>Enroll in Course</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <section className={`${styles.sectionPadding} ${styles.certSection} section-padding cert-section`} id="certificates">
      <div className={`${styles.container} container`}>
        <div className={`${styles.sectionHeader} section-header`}>
          <div className={`${styles.sectionSubtitle} section-subtitle`}>Career Acceleration</div>
          <h2 className={`${styles.sectionTitle} section-title`}>Professional <span>Certificate Courses</span></h2>
          <p className={`${styles.sectionDescription} section-description`}>
            Industry-endorsed skill certifications to supercharge your employability alongside your degree curriculum.
          </p>
        </div>

        {coursesData.length === 0 && !loading ? (
          <div className={styles.emptyState}>
            <p>No certificate courses available at the moment.</p>
          </div>
        ) : isSliderActive ? (
          /* Auto-Looping Slider for > 3 Cards */
          <div 
            className={styles.certSliderWrapper}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div 
              className={styles.certCardsTrack}
              style={{
                transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
              }}
            >
              {coursesData.map((course, idx) => (
                <div key={course.id} className={styles.certSlide}>
                  {renderCard(course, idx)}
                </div>
              ))}
            </div>

            {/* Slider Controls */}
            <div className={styles.certSliderControls}>
              <button 
                type="button" 
                className={styles.certArrow} 
                onClick={handlePrev}
                aria-label="Previous Course"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <div className={styles.certDots}>
                {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    className={`${styles.certDot} ${currentIndex === dotIdx ? styles.certDotActive : ''}`}
                    onClick={() => setCurrentIndex(dotIdx)}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>

              <button 
                type="button" 
                className={styles.certArrow} 
                onClick={handleNext}
                aria-label="Next Course"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          /* Standard Grid for <= 3 Cards */
          <div className={`${styles.certGridLuxury} cert-grid-luxury`}>
            {coursesData.map((course, idx) => renderCard(course, idx))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link href="/courses" className={`${styles.btn} ${styles.btnCrimson} btn btn-crimson`}>
            <span>View More</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* REGISTER YOURSELF MODAL FORM */}
      <div className={`${styles.modalBackdrop} ${isOpen ? styles.modalBackdropActive : ''}`} onClick={closeEnrollModal}>
        <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
          <button className={styles.modalClose} onClick={closeEnrollModal}>&times;</button>

          <h3 className={styles.modalTitle}>Register <span>Yourself</span></h3>
          <p className={styles.modalSubtitle}>Please fill the form below.</p>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  placeholder="Your first name here ..."
                  className={styles.formInput}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  placeholder="Your last name here ..."
                  className={styles.formInput}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="email"
                  placeholder="Your email address ..."
                  className={styles.formInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="tel"
                  placeholder="10-digit phone number ..."
                  className={styles.formInput}
                  value={phone}
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[6-9][0-9]{9}"
                  title="Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9"
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  required
                />
              </div>
              <div className={styles.formGroupFull}>
                <select
                  className={styles.formSelect}
                  value={mainCourse}
                  onChange={(e) => setMainCourse(e.target.value)}
                >
                  {degreePrograms.map((degree, idx) => (
                    <option key={idx} value={degree}>{degree}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroupFull}>
                <select
                  className={styles.formSelect}
                  value={selectedCert}
                  onChange={(e) => setSelectedCert(e.target.value)}
                >
                  {coursesData.map((course, idx) => (
                    <option key={idx} value={course.title}>{course.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <textarea
              placeholder="Your message here ..."
              className={styles.formTextarea}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>

            <button type="submit" className={styles.submitBtn}>
              Submit Form
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
