'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CollegeOverview.module.css';

const sliderImages = [
  { src: "/assets/hero/nmc-collage.jpg", alt: "NMC Main Campus Building" },
  { src: "/assets/clg-overview/wel-come-to-nmc-copy.webp", alt: "Welcome to NMC" },
  { src: "/assets/gellery/2.jpg", alt: "NMC Event/Activity" },
  { src: "/assets/gellery/5.jpg", alt: "NMC Students" },
  { src: "/assets/gellery/6.jpg", alt: "NMC Campus Life" }
];

export default function CollegeOverview() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={`${styles.sectionPadding} ${styles.aboutPremiumSection} section-padding about-premium-section`} id="overview">
      <div className={`${styles.container} container`}>
        <div className={`${styles.aboutPremiumGrid} about-premium-grid`}>
          {/* Left: Image Composition with Floating Glass Badges */}
          <div className={`${styles.aboutPremiumImgWrap} about-premium-img-wrap`}>
            <div className={`${styles.aboutAmbientGlow} about-ambient-glow`}></div>
            <div className={`${styles.aboutImgFrame} about-img-frame`}>
              <div className={styles.sliderContainer}>
                {sliderImages.map((image, idx) => (
                  <div
                    key={idx}
                    className={`${styles.sliderSlide} ${idx === currentIndex ? styles.activeSlide : ''}`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 600px"
                      className={`${styles.aboutPremiumImg} about-premium-img`}
                      priority={idx === 0}
                    />
                  </div>
                ))}

                {/* Pagination Dots */}
                <div className={styles.sliderPagination}>
                  {sliderImages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`${styles.paginationDot} ${idx === currentIndex ? styles.activeDot : ''}`}
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Highlight Badge 1: 15+ Years */}
            <div className={styles.aboutFbadgeStats}>
              <div className={`${styles.aboutFbadgeIcon} about-fbadge-icon`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
              </div>
              <div className={`${styles.aboutFbadgeText} about-fbadge-text`}>
                <span className={`${styles.aboutFbadgeNum} about-fbadge-num`}>15+</span>
                <span className={`${styles.aboutFbadgeSub} about-fbadge-sub`}>Years of Excellence</span>
              </div>
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
              <Link href="/academic" className={`${styles.btn} ${styles.btnCrimson} ${styles.aboutPremiumBtn} btn btn-crimson about-premium-btn`}>
                <span>Meet Our Teachers</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" />
                </svg>
              </Link>
              <Link href="/activities/by-club" className={`${styles.btn} ${styles.btnOutline} ${styles.aboutSecondaryBtn} btn btn-outline about-secondary-btn`}>
                <span>Explore Programs</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
