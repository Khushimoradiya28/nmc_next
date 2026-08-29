'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './DignitaryTestimonial.module.css';
import TestimonialServices from '@/services/TestimonialServices';

const getInitials = (name) => {
  if (!name) return 'D';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};

export default function DignitaryTestimonial() {
  const [activeTab, setActiveTab] = useState('dignitary');
  const [dignitaries, setDignitaries] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Slider state for Dignitary & Student
  const [digIndex, setDigIndex] = useState(0);
  const [stuIndex, setStuIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slidesToShow, setSlidesToShow] = useState(3);

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

  // Fetch purely dynamic data from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const [digRes, stuRes] = await Promise.allSettled([
          TestimonialServices.getDignitaryTestimonials(),
          TestimonialServices.getStudentTestimonials()
        ]);

        if (digRes.status === 'fulfilled' && Array.isArray(digRes.value?.data)) {
          const formattedDig = digRes.value.data.map((item, index) => {
            let rawAvatar = (item.avatarUrl || item.avatar || item.image || item.photo || '').trim();
            if (rawAvatar.includes('/assets/')) {
              rawAvatar = '/assets/' + rawAvatar.split('/assets/')[1];
            } else if (rawAvatar.startsWith('blob:')) {
              rawAvatar = '';
            }

            return {
              id: item._id || item.guid || index,
              title: item.title || '',
              quote: item.quote ? (item.quote.startsWith('"') ? item.quote : `"${item.quote}"`) : '',
              authorName: item.authorName || 'Dignitary',
              designationSubtext: item.designationSubtext || '',
              avatarUrl: rawAvatar,
              initials: getInitials(item.authorName || 'Dignitary')
            };
          });
          setDignitaries(formattedDig);
        }

        if (stuRes.status === 'fulfilled' && Array.isArray(stuRes.value?.data)) {
          const avatarColors = [styles.studAvatarRed, styles.studAvatarGold, styles.studAvatarSky];
          const formattedStu = stuRes.value.data.map((item, index) => {
            return {
              id: item._id || item.guid || index,
              rating: item.rating || 5,
              quote: item.quote ? (item.quote.startsWith('"') ? item.quote : `"${item.quote}"`) : '',
              authorName: item.authorName || 'Student',
              designationSubtext: item.designationSubtext || '',
              avatarClass: avatarColors[index % avatarColors.length],
              initials: getInitials(item.authorName || 'Student')
            };
          });
          setStudents(formattedStu);
        }
      } catch (err) {
        console.error('Error loading testimonials from API:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const totalDignitaries = dignitaries.length;
  const isDigSliderActive = totalDignitaries > 3;
  const maxDigIndex = Math.max(0, totalDignitaries - slidesToShow);

  const totalStudents = students.length;
  const isStuSliderActive = totalStudents > 3;
  const maxStuIndex = Math.max(0, totalStudents - slidesToShow);

  // Auto-looping slider for Dignitaries
  useEffect(() => {
    if (!isDigSliderActive || isPaused || activeTab !== 'dignitary') return;

    const interval = setInterval(() => {
      setDigIndex((prev) => (prev >= maxDigIndex ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(interval);
  }, [isDigSliderActive, isPaused, activeTab, maxDigIndex]);

  // Auto-looping slider for Students
  useEffect(() => {
    if (!isStuSliderActive || isPaused || activeTab !== 'student') return;

    const interval = setInterval(() => {
      setStuIndex((prev) => (prev >= maxStuIndex ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(interval);
  }, [isStuSliderActive, isPaused, activeTab, maxStuIndex]);

  // Dignitary Navigation Handlers
  const handleDigPrev = () => {
    setDigIndex((prev) => (prev <= 0 ? maxDigIndex : prev - 1));
  };
  const handleDigNext = () => {
    setDigIndex((prev) => (prev >= maxDigIndex ? 0 : prev + 1));
  };

  // Student Navigation Handlers
  const handleStuPrev = () => {
    setStuIndex((prev) => (prev <= 0 ? maxStuIndex : prev - 1));
  };
  const handleStuNext = () => {
    setStuIndex((prev) => (prev >= maxStuIndex ? 0 : prev + 1));
  };

  // Card Renderers
  const renderDignitaryCard = (dig) => (
    <div key={dig.id} className={`${styles.digiCard} digi-card`}>
      <div className={`${styles.digiCardInner} digi-card-inner`}>
        <div className={`${styles.digiQuoteIcon} digi-quote-icon`}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
        <h3 className={`${styles.digiCardTitle} digi-card-title`}>{dig.title}</h3>
        <p className={`${styles.digiCardText} digi-card-text`}>{dig.quote}</p>
        <div className={`${styles.digiCardAuthor} digi-card-author`}>
          <div className={`${styles.digiAuthorImg} digi-author-img`}>
            {dig.avatarUrl ? (
              <Image 
                src={dig.avatarUrl} 
                alt={dig.authorName} 
                width={600} 
                height={400} 
                unoptimized={dig.avatarUrl.startsWith('http')}
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
                fontSize: '1.1rem',
                fontFamily: 'var(--font-heading)'
              }}>
                {dig.initials}
              </div>
            )}
          </div>
          <div className={`${styles.digiAuthorInfo} digi-author-info`}>
            <h4>{dig.authorName}</h4>
            <span>{dig.designationSubtext}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentCard = (stu) => (
    <div key={stu.id} className={`${styles.studTestiCard} stud-testi-card`}>
      <div className={`${styles.studTestiStars} stud-testi-stars`}>
        {String.fromCharCode(9733).repeat(Math.max(1, Math.min(5, Number(stu.rating) || 5)))}
      </div>
      <p className={`${styles.studTestiQuote} stud-testi-quote`}>{stu.quote}</p>
      <div className={`${styles.studTestiAuthor} stud-testi-author`}>
        <div className={`${styles.studAvatar} ${stu.avatarClass || styles.studAvatarRed} stud-avatar`}>
          {stu.initials}
        </div>
        <div>
          <h4>{stu.authorName}</h4>
          <span>{stu.designationSubtext}</span>
        </div>
      </div>
    </div>
  );

  return (
    <section className={`${styles.sectionPadding} ${styles.digiTestiSection} section-padding digi-testi-section`} id="testimonials">
      <div className={`${styles.container} container`}>
        <div className={`${styles.sectionHeader} section-header`}>
          <div className={`${styles.sectionSubtitle} section-subtitle`}>Testimonials</div>
          <h2 className={`${styles.sectionTitle} section-title`}>What People <span>Say About Us</span></h2>
          <p className={`${styles.sectionDescription} section-description`}>Inspiring words from academic dignitaries, board members, and our empowered
            students.</p>
        </div>

        {/* Tab Buttons */}
        <div className={`${styles.digiTabBar} digi-tab-bar`}>
          <button 
            type="button"
            className={`${styles.digiTab} digi-tab ${activeTab === 'dignitary' ? `${styles.active} active` : ''}`} 
            data-panel="dignitaryPanel"
            onClick={() => {
              setActiveTab('dignitary');
              setDigIndex(0);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            Dignitary Testimonials
          </button>
          <button 
            type="button"
            className={`${styles.digiTab} digi-tab ${activeTab === 'student' ? `${styles.active} active` : ''}`} 
            data-panel="studentsPanel"
            onClick={() => {
              setActiveTab('student');
              setStuIndex(0);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Student Testimonials
          </button>
        </div>

        {/* Panel 1: Dignitary Cards */}
        <div className={`${styles.digiPanel} digi-panel ${activeTab === 'dignitary' ? `${styles.active} active` : ''}`} id="dignitaryPanel">
          {dignitaries.length === 0 && !loading ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>💬</div>
              <p className={styles.emptyText}>No dignitary testimonials available at the moment.</p>
            </div>
          ) : isDigSliderActive ? (
            /* Responsive Auto-Looping Slider for > 3 Cards */
            <div 
              className={styles.sliderWrapper}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div 
                className={styles.sliderTrack}
                style={{
                  transform: `translateX(-${digIndex * (100 / slidesToShow)}%)`,
                }}
              >
                {dignitaries.map((dig) => (
                  <div key={dig.id} className={styles.sliderSlide}>
                    {renderDignitaryCard(dig)}
                  </div>
                ))}
              </div>

              {/* Slider Controls */}
              <div className={styles.sliderControls}>
                <button 
                  type="button" 
                  className={styles.sliderArrow} 
                  onClick={handleDigPrev}
                  aria-label="Previous Testimonial"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                <div className={styles.sliderDots}>
                  {Array.from({ length: maxDigIndex + 1 }).map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      className={`${styles.sliderDot} ${digIndex === dotIdx ? styles.sliderDotActive : ''}`}
                      onClick={() => setDigIndex(dotIdx)}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>

                <button 
                  type="button" 
                  className={styles.sliderArrow} 
                  onClick={handleDigNext}
                  aria-label="Next Testimonial"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            /* Standard Grid for <= 3 Cards */
            <div className={`${styles.digiCardsRow} digi-cards-row`}>
              {dignitaries.map((dig) => renderDignitaryCard(dig))}
            </div>
          )}
        </div>

        {/* Panel 2: Student Cards */}
        <div className={`${styles.digiPanel} digi-panel ${activeTab === 'student' ? `${styles.active} active` : ''}`} id="studentsPanel">
          {students.length === 0 && !loading ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🎓</div>
              <p className={styles.emptyText}>No student testimonials available at the moment.</p>
            </div>
          ) : isStuSliderActive ? (
            /* Responsive Auto-Looping Slider for > 3 Student Cards */
            <div 
              className={styles.sliderWrapper}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div 
                className={styles.sliderTrack}
                style={{
                  transform: `translateX(-${stuIndex * (100 / slidesToShow)}%)`,
                }}
              >
                {students.map((stu) => (
                  <div key={stu.id} className={styles.sliderSlide}>
                    {renderStudentCard(stu)}
                  </div>
                ))}
              </div>

              {/* Slider Controls */}
              <div className={styles.sliderControls}>
                <button 
                  type="button" 
                  className={styles.sliderArrow} 
                  onClick={handleStuPrev}
                  aria-label="Previous Student Testimonial"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                <div className={styles.sliderDots}>
                  {Array.from({ length: maxStuIndex + 1 }).map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      className={`${styles.sliderDot} ${stuIndex === dotIdx ? styles.sliderDotActive : ''}`}
                      onClick={() => setStuIndex(dotIdx)}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>

                <button 
                  type="button" 
                  className={styles.sliderArrow} 
                  onClick={handleStuNext}
                  aria-label="Next Student Testimonial"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            /* Standard Grid for <= 3 Student Cards */
            <div className={`${styles.studTestiGrid} stud-testi-grid`}>
              {students.map((stu) => renderStudentCard(stu))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
