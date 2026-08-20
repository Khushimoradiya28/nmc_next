import React from 'react';
import Image from 'next/image';
import styles from './CollegeOverview.module.css';

export default function CollegeOverview() {
  return (
    <section className={`${styles.sectionPadding} ${styles.aboutPremiumSection} section-padding about-premium-section`} id="overview">
    <div className={`${styles.container} container`}>
      <div className={`${styles.aboutPremiumGrid} about-premium-grid`}>
        {/* Left: Image Composition with Floating Glass Badges */}
        <div className={`${styles.aboutPremiumImgWrap} about-premium-img-wrap`}>
          <div className={`${styles.aboutAmbientGlow} about-ambient-glow`}></div>
          <div className={`${styles.aboutImgFrame} about-img-frame`}>
            <Image src="/assets/hero/nmc-collage.jpg" alt="NMC Main Campus Building" width={600} height={400} className={`${styles.aboutPremiumImg} about-premium-img`} />
            <div className={`${styles.aboutImgTopBadge} about-img-top-badge`}>
              <span className={`${styles.aboutLocationDot} about-location-dot`}></span>
              <span>Main Academic Campus • Bhavnagar</span>
            </div>
          </div>
          
          {/* Floating Highlight Badge 1: 15+ Years */}
          <div className={`${styles.aboutFbadgeStats} about-fbadge-stats`}>
            <div className={`${styles.aboutFbadgeIcon} about-fbadge-icon`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            </div>
            <div className={`${styles.aboutFbadgeText} about-fbadge-text`}>
              <span className={`${styles.aboutFbadgeNum} about-fbadge-num`}>15+</span>
              <span className={`${styles.aboutFbadgeSub} about-fbadge-sub`}>Years of Excellence</span>
            </div>
          </div>

          {/* Floating Highlight Badge 2: MKBU Affiliated */}
          <div className={`${styles.aboutFbadgeAffil} about-fbadge-affil`}>
            <div className={`${styles.aboutFbadgeAffilIcon} about-fbadge-affil-icon`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
            <span>MKBU Affiliated</span>
          </div>
        </div>

        {/* Right: Structured Executive Content */}
        <div className={`${styles.aboutPremiumContent} about-premium-content`}>
          <div className={`${styles.aboutPremiumTag} about-premium-tag`}>
            <span className={`${styles.aboutTagDot} about-tag-dot`}></span>
            <span>About Nandkunvarba Mahila College</span>
          </div>

          <h2 className={`${styles.aboutPremiumTitle} about-premium-title`}>Welcome to <span>Nandkunvarba Mahila College!</span></h2>

          <h3 className={`${styles.aboutPremiumSubtitle} about-premium-subtitle`}>We Are Eager To Give You Best Education.</h3>

          <p className={`${styles.aboutPremiumText} about-premium-text`}>
            Nandkunvarba Mahila college was established in June 2009. It is affiliated to M K Bhavnagar University. Nandkunvarba Mahila College runs various Graduate and Post Graduate courses in the area of Commerce, Arts, Management, Social Work, Computer Application and Fashion Designing. The College also provides various courses for the welfare of women for their development in all terms. College has well Furnished Class Rooms, Practical lab, Huge campus, Auditorium, Fully Furnished Library and many other facilities.
          </p>

          <div className={`${styles.aboutActionsWrap} about-actions-wrap`}>
            <a href="#faculty" className={`${styles.btn} ${styles.btnCrimson} ${styles.aboutPremiumBtn} btn btn-crimson about-premium-btn`}>
              <span>Meet Our Teachers</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" />
              </svg>
            </a>
            <a href="#programs" className={`${styles.btn} ${styles.btnOutline} ${styles.aboutSecondaryBtn} btn btn-outline about-secondary-btn`}>
              <span>Explore Programs</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}
