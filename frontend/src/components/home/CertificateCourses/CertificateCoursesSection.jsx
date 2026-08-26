'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CertificateCoursesSection.module.css';

const coursesList = [
  "Tally ERP & GST Accounting",
  "Graphic Design & Photoshop",
  "English & Corporate Soft Skills",
  "Environmental & Mental Health",
  "Computer Skills & MS Office Pro",
  "Digital Marketing & SEO"
];

const degreePrograms = [
  "Bachelor of Business Administration (BBA)",
  "Bachelor of Computer Application (BCA)",
  "Bachelor of Arts (BA)",
  "Bachelor of Commerce (BCom)",
  "Master of Arts (MA)",
  "Master of Commerce (MCom)",
  "Master of Social Work (MSW)",
  "Diploma in Fashion Designing (DFD)"
];

export default function CertificateCoursesSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState('Tally ERP & GST Accounting');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [mainCourse, setMainCourse] = useState('Bachelor of Business Administration (BBA)');
  const [message, setMessage] = useState('');

  const openEnrollModal = (courseName) => {
    // Open the global contact popup form
    window.dispatchEvent(new CustomEvent('openContactPopup'));
  };

  const closeEnrollModal = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submit
    alert(`Registration Successful!\nName: ${firstName} ${lastName}\nCourse: ${selectedCert}\nDegree: ${mainCourse}`);
    closeEnrollModal();
    // Reset form
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <section className={`${styles.sectionPadding} ${styles.certCoursesSection} section-padding cert-courses-section`} id="certificates">
      <div className={`${styles.container} container`}>
        <div className={`${styles.sectionHeader} section-header`}>
          <div className={`${styles.sectionSubtitle} section-subtitle`}>Career Acceleration</div>
          <h2 className={`${styles.sectionTitle} section-title`}>Professional <span>Certificate Courses</span></h2>
          <p className={`${styles.sectionDescription} section-description`}>Industry-endorsed skill certifications to supercharge your employability alongside your degree curriculum.</p>
        </div>

        <div className={`${styles.certSliderWrap} cert-slider-wrap`}>
          <div className={`${styles.certCardsTrack} cert-cards-track`} id="certTrack">

            {/* Course 1: Tally ERP & GST */}
            <div className={`${styles.certCardLuxury} ${styles.spotlightActive} cert-card-luxury spotlight-active`}>
              <div className={`${styles.certCardMedia} cert-card-media`}>
                <Image src="/assets/courses/accounting_course.jpg" alt="Tally ERP & GST Accounting" width={600} height={400} className={`${styles.certCardImg} cert-card-img`} />
                <span className={`${styles.certMediaBadge} ${styles.tagRuby} cert-media-badge tag-ruby`}>Accounting & Finance</span>
                <span className={`${styles.certHighlightPill} cert-highlight-pill`}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> Popular</span>
              </div>
              <div className={`${styles.certCardBody} cert-card-body`}>
                <h3 className={`${styles.certCardTitle} cert-card-title`}>Tally ERP & GST Accounting</h3>
                <p className={`${styles.certCardDesc} cert-card-desc`}>Comprehensive computerized accounting, corporate taxation, and live GST return filing practice.</p>

                <ul className={`${styles.certBulletsList} cert-bullets-list`}>
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>TallyPrime & Inventory Management</span>
                  </li>
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>GST Invoicing, E-Way & Tax Audits</span>
                  </li>
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>Practical Accounting Live Projects</span>
                  </li>
                </ul>

                <div className={`${styles.certMetaStrip} cert-meta-strip`}>
                  <span className={`${styles.certMetaItem} cert-meta-item`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold-600)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    6 Months
                  </span>
                  <span className={`${styles.certMetaItem} cert-meta-item`}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--red-800)' }}>₹</span>
                    Fees: Rs. 8,000/Sem.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => openEnrollModal('Tally ERP & GST Accounting')}
                  className={`${styles.certActionBtn} cert-action-btn`}
                >
                  <span>Enroll in Course</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
            </div>

            {/* Course 2: Graphic Design & Creative Media */}
            <div className={`${styles.certCardLuxury} ${styles.spotlightActive} cert-card-luxury spotlight-active`}>
              <div className={`${styles.certCardMedia} cert-card-media`}>
                <Image src="/assets/courses/design_course.jpg" alt="Graphic Design & Photoshop" width={600} height={400} className={`${styles.certCardImg} cert-card-img`} />
                <span className={`${styles.certMediaBadge} ${styles.tagAzure} cert-media-badge tag-azure`}>Design & Creative</span>
                <span className={`${styles.certHighlightPill} cert-highlight-pill`}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg> High Demand</span>
              </div>
              <div className={`${styles.certCardBody} cert-card-body`}>
                <h3 className={`${styles.certCardTitle} cert-card-title`}>Graphic Design & Photoshop</h3>
                <p className={`${styles.certCardDesc} cert-card-desc`}>Visual brand identity design, photo retouching, digital advertising, and creative vector art.</p>

                <ul className={`${styles.certBulletsList} cert-bullets-list`}>
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>Adobe Photoshop & Illustrator Core</span>
                  </li>
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>Brand Logos, Banners & UI Mockups</span>
                  </li>
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>Personal Design Portfolio Building</span>
                  </li>
                </ul>

                <div className={`${styles.certMetaStrip} cert-meta-strip`}>
                  <span className={`${styles.certMetaItem} cert-meta-item`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold-600)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    6 Months
                  </span>
                  <span className={`${styles.certMetaItem} cert-meta-item`}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--red-800)' }}>₹</span>
                    Fees: Rs. 8,000/Sem.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => openEnrollModal('Graphic Design & Photoshop')}
                  className={`${styles.certActionBtn} cert-action-btn`}
                >
                  <span>Enroll in Course</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
            </div>

            {/* Course 3: English Communication & Soft Skills */}
            <div className={`${styles.certCardLuxury} ${styles.spotlightActive} cert-card-luxury spotlight-active`}>
              <div className={`${styles.certCardMedia} cert-card-media`}>
                <Image src="/assets/courses/soft_skills_course.jpg" alt="English Communication" width={600} height={400} className={`${styles.certCardImg} cert-card-img`} />
                <span className={`${styles.certMediaBadge} ${styles.tagGold} cert-media-badge tag-gold`}>Professional Growth</span>
                <span className={`${styles.certHighlightPill} cert-highlight-pill`}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> Essential</span>
              </div>
              <div className={`${styles.certCardBody} cert-card-body`}>
                <h3 className={`${styles.certCardTitle} cert-card-title`}>English & Corporate Soft Skills</h3>
                <p className={`${styles.certCardDesc} cert-card-desc`}>Public speaking, spoken English fluency, business etiquette, and interview personality mastery.</p>

                <ul className={`${styles.certBulletsList} cert-bullets-list`}>
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>Spoken Fluency & Pronunciation Lab</span>
                  </li>
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>Corporate Email & Resume Writing</span>
                  </li>
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>Mock Interviews & Group Discussions</span>
                  </li>
                </ul>

                <div className={`${styles.certMetaStrip} cert-meta-strip`}>
                  <span className={`${styles.certMetaItem} cert-meta-item`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold-600)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    3 Months
                  </span>
                  <span className={`${styles.certMetaItem} cert-meta-item`}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--red-800)' }}>₹</span>
                    Fees: Rs. 8,000/Sem.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => openEnrollModal('English & Corporate Soft Skills')}
                  className={`${styles.certActionBtn} cert-action-btn`}
                >
                  <span>Enroll in Course</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
            </div>

            {/* Course 4: Environmental & Mental Health */}
            <div className={`${styles.certCardLuxury} ${styles.spotlightActive} cert-card-luxury spotlight-active`}>
              <div className={`${styles.certCardMedia} cert-card-media`}>
                <Image src="/assets/hero/nmc-collage.jpg" alt="Environmental & Mental Health" width={600} height={400} className={`${styles.certCardImg} cert-card-img`} />
                <span className={`${styles.certMediaBadge} ${styles.tagEmerald} cert-media-badge tag-emerald`}>Health & Wellness</span>
                <span className={`${styles.certHighlightPill} cert-highlight-pill`}>🌱 Holistic</span>
              </div>
              <div className={`${styles.certCardBody} cert-card-body`}>
                <h3 className={`${styles.certCardTitle} cert-card-title`}>Environmental & Mental Health</h3>
                <p className={`${styles.certCardDesc} cert-card-desc`}>Holistic wellness coaching, stress reduction methodologies, and environmental sustainability.</p>

                <ul className={`${styles.certBulletsList} cert-bullets-list`}>
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>Mindfulness & Stress Management</span>
                  </li>
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>Ecological Sustainability Principles</span>
                  </li>
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>Community Wellness Counseling</span>
                  </li>
                </ul>

                <div className={`${styles.certMetaStrip} cert-meta-strip`}>
                  <span className={`${styles.certMetaItem} cert-meta-item`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold-600)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    3 Months
                  </span>
                  <span className={`${styles.certMetaItem} cert-meta-item`}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--red-800)' }}>₹</span>
                    Fees: Rs. 8,000/Sem.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => openEnrollModal('Environmental & Mental Health')}
                  className={`${styles.certActionBtn} cert-action-btn`}
                >
                  <span>Enroll in Course</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
            </div>

            {/* Course 5: Basic Computer & MS Office */}
            <div className={`${styles.certCardLuxury} ${styles.spotlightActive} cert-card-luxury spotlight-active`}>
              <div className={`${styles.certCardMedia} cert-card-media`}>
                <Image src="/assets/hero/banner1-800.png" alt="Computer Skills & MS Office" width={600} height={400} className={`${styles.certCardImg} cert-card-img`} />
                <span className={`${styles.certMediaBadge} ${styles.tagPurple} cert-media-badge tag-purple`}>IT & Computing</span>
                <span className={`${styles.certHighlightPill} cert-highlight-pill`}>💻 Foundation</span>
              </div>
              <div className={`${styles.certCardBody} cert-card-body`}>
                <h3 className={`${styles.certCardTitle} cert-card-title`}>Computer Skills & MS Office Pro</h3>
                <p className={`${styles.certCardDesc} cert-card-desc`}>Complete corporate computer proficiency in Microsoft Word, Excel formulas, and PowerPoint slides.</p>

                <ul className={`${styles.certBulletsList} cert-bullets-list`}>
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>Advanced Excel, Pivot & VLOOKUP</span>
                  </li>
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>Executive Presentation Design</span>
                  </li>
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>Cloud Docs & Cyber Literacy</span>
                  </li>
                </ul>

                <div className={`${styles.certMetaStrip} cert-meta-strip`}>
                  <span className={`${styles.certMetaItem} cert-meta-item`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold-600)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    2 Months
                  </span>
                  <span className={`${styles.certMetaItem} cert-meta-item`}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--red-800)' }}>₹</span>
                    Fees: Rs. 8,000/Sem.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => openEnrollModal('Computer Skills & MS Office Pro')}
                  className={`${styles.certActionBtn} cert-action-btn`}
                >
                  <span>Enroll in Course</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
            </div>

            {/* Course 6: Digital Marketing Fundamentals */}
            <div className={`${styles.certCardLuxury} ${styles.spotlightActive} cert-card-luxury spotlight-active`}>
              <div className={`${styles.certCardMedia} cert-card-media`}>
                <Image src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop" alt="Digital Marketing Fundamentals" width={600} height={400} className={`${styles.certCardImg} cert-card-img`} />
                <span className={`${styles.certMediaBadge} ${styles.tagRose} cert-media-badge tag-rose`}>Marketing & Growth</span>
                <span className={`${styles.certHighlightPill} cert-highlight-pill`}>📈 Trending</span>
              </div>
              <div className={`${styles.certCardBody} cert-card-body`}>
                <h3 className={`${styles.certCardTitle} cert-card-title`}>Digital Marketing & SEO</h3>
                <p className={`${styles.certCardDesc} cert-card-desc`}>Social media campaigns, search engine optimization, content strategy, and Google analytics.</p>

                <ul className={`${styles.certBulletsList} cert-bullets-list`}>
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>Google SEO & Keyword Research</span>
                  </li>
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>Instagram & Meta Ads Campaigning</span>
                  </li>
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>Web Traffic & ROI Analytics</span>
                  </li>
                </ul>

                <div className={`${styles.certMetaStrip} cert-meta-strip`}>
                  <span className={`${styles.certMetaItem} cert-meta-item`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold-600)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    4 Months
                  </span>
                  <span className={`${styles.certMetaItem} cert-meta-item`}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--red-800)' }}>₹</span>
                    Fees: Rs. 8,000/Sem.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => openEnrollModal('Digital Marketing & SEO')}
                  className={`${styles.certActionBtn} cert-action-btn`}
                >
                  <span>Enroll in Course</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
            </div>

          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link href="/courses" className={`${styles.btn} ${styles.btnCrimson} btn btn-crimson`}>
            <span>View More</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" /></svg>
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
                  placeholder="Your phone number ..."
                  className={styles.formInput}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  {coursesList.map((course, idx) => (
                    <option key={idx} value={course}>{course}</option>
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
