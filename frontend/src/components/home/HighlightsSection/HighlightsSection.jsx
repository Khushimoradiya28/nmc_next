import React from 'react';
import Image from 'next/image';
import styles from './HighlightsSection.module.css';

export default function HighlightsSection() {
  return (
    <section className={`${styles.sectionPadding} ${styles.infoPillarsSection} section-padding info-pillars-section`}>
    <div className={`${styles.container} container`}>
      <div className={`${styles.sectionHeader} section-header`}>
        <div className={`${styles.sectionSubtitle} section-subtitle`}>What Makes Us Different</div>
        <h2 className={`${styles.sectionTitle} section-title`}>Discover Our <span>Academic Pillars</span></h2>
        <p className={`${styles.sectionDescription} section-description`}>10 career-oriented courses, expert faculty mentors, and a transparent admission
          process designed for your success.</p>
      </div>

      <div className={`${styles.infoPillarsGrid} info-pillars-grid`}>

        {/* OUR COURSES CARD */}
        <div className={`${styles.infoPillarCard} ${styles.pillarCourses} info-pillar-card pillar-courses`}>
          <div className={`${styles.pillarIconWrap} ${styles.pillarIconSky} pillar-icon-wrap pillar-icon-sky`}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <h3 className={`${styles.pillarTitle} pillar-title`}>Our Courses</h3>
          <p className={`${styles.pillarDescription} pillar-description`}>
            We offer 10 courses which provides you with the skills, knowledge and experience you need to pursue a career
            within the business, government and not-for-profit sectors...
          </p>
          <ul className={`${styles.pillarFeatures} pillar-features`}>
            <li><span className={`${styles.pillarCheck} pillar-check`}>âœ“</span> Drives economic behavior at both an individual and organizational
              level</li>
            <li><span className={`${styles.pillarCheck} pillar-check`}>âœ“</span> Equips you with the analytical, communication and problem solving
              skills</li>
            <li><span className={`${styles.pillarCheck} pillar-check`}>âœ“</span> Brings education to life through lectures, case studies and
              noteworthy guest speakers</li>
          </ul>
          <div className={`${styles.pillarGlow} ${styles.pillarGlowSky} pillar-glow pillar-glow-sky`}></div>
        </div>

        {/* OUR TEACHERS CARD */}
        <div className={`${styles.infoPillarCard} ${styles.pillarTeachers} info-pillar-card pillar-teachers`}>
          <div className={`${styles.pillarIconWrap} ${styles.pillarIconGold} pillar-icon-wrap pillar-icon-gold`}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3 className={`${styles.pillarTitle} pillar-title`}>Our Teachers</h3>
          <p className={`${styles.pillarDescription} pillar-description`}>
            We have got some best lecturers available in town to help you to polish your skills as much as you can. Our
            lecturers don't just want you to get a degree but they aim to discover your talents and fulfil your
            potential...
          </p>
          <ul className={`${styles.pillarFeatures} pillar-features`}>
            <li><span className={`${styles.pillarCheck} pillar-check`}>âœ“</span> Conveys their insights, understanding and expertise as effectively
              and clearly as possible</li>
            <li><span className={`${styles.pillarCheck} pillar-check`}>âœ“</span> Provides clear and growing appetite for knowledge in their chosen
              disciplines of study</li>
            <li><span className={`${styles.pillarCheck} pillar-check`}>âœ“</span> Keeps updating styles of teaching, types of assessment and learning
              resources</li>
          </ul>
          <div className={`${styles.pillarGlow} ${styles.pillarGlowGold} pillar-glow pillar-glow-gold`}></div>
        </div>

        {/* ADMISSION PROCESS CARD */}
        <div className={`${styles.infoPillarCard} ${styles.pillarAdmission} info-pillar-card pillar-admission`}>
          <div className={`${styles.pillarIconWrap} ${styles.pillarIconRed} pillar-icon-wrap pillar-icon-red`}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>
            </svg>
          </div>
          <h3 className={`${styles.pillarTitle} pillar-title`}>Admission Process</h3>
          <p className={`${styles.pillarDescription} pillar-description`}>
            We accept new admissions for the new batch immediately after the results are declared...
          </p>
          <ul className={`${styles.pillarFeatures} pillar-features`}>
            <li><span className={`${styles.pillarCheck} pillar-check`}>âœ“</span> Simple and Transparent Admission Process</li>
            <li><span className={`${styles.pillarCheck} pillar-check`}>âœ“</span> Evaluating each applicant considering factors like personal
              background, qualities & opportunities available in the niche</li>
            <li><span className={`${styles.pillarCheck} pillar-check`}>âœ“</span> Admission process open â€“ Monday to Sunday 9 AM to 5 PM</li>
          </ul>
          <a href="#contact" className={`${styles.pillarCta} ${styles.btn} ${styles.btnCrimson} pillar-cta btn btn-crimson`}>
            <span>Get Enrolled!</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" />
            </svg>
          </a>
          <div className={`${styles.pillarGlow} ${styles.pillarGlowRed} pillar-glow pillar-glow-red`}></div>
        </div>

      </div>
    </div>
  </section>
  );
}
