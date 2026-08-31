"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';

// Background slider images. Only these change — the rest of the hero stays fixed.
const HERO_SLIDES = [
  '/assets/home/hero/new-banner.png',
  '/assets/activities/activities_banner.jpg',
  '/assets/orient/welcome.jpg',
  '/assets/events_gallery/womens_day.jpg',
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-advance the background image slider
  useEffect(() => {
    if (HERO_SLIDES.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const openApplyModal = (e) => {
    e.preventDefault();
    // Reuse the existing modal popup (PopupForm) via its global event
    window.dispatchEvent(new Event('openContactPopup'));
  };

  return (
    <section className={`${styles.heroFullscreen} hero-fullscreen home-hero-fullscreen`} id="home">
      {/* Background image slider — only the image changes */}
      <div className={`${styles.heroBgImage} hero-bg-image`} style={{ transform: 'scaleX(-1)' }}>
        {HERO_SLIDES.map((src, idx) => (
          <div
            key={src}
            className={`${styles.heroSlide} ${idx === activeSlide ? styles.heroSlideActive : ''}`}
            aria-hidden={idx !== activeSlide}
          >
            <Image
              src={src}
              alt="NMC Campus Life"
              width={1920}
              height={1080}
              priority={idx === 0}
              className={`${styles.heroBgImg} hero-bg-img`}
            />
          </div>
        ))}
      </div>
      <div className={`${styles.heroOverlay} hero-overlay`}></div>
      <div className={`${styles.heroContent} container`}>
        <div className={`${styles.heroTagPill} hero-tag-pill`}>
          <span className={`${styles.heroTagDot} hero-tag-dot`}></span>
          <span>Empowering Women Through Excellence</span>
        </div>
        <h1 className={`${styles.heroMainTitle} hero-main-title`}><em>Innovative learning</em><br /><em>for everyone</em></h1>
        <p className={`${styles.heroSubtitle} hero-subtitle`}>Graduates hold a position related to their degree or<br />career objective.</p>
        <div className={`${styles.heroCtaGroup} hero-cta-group`}>
          <a href="#programs" onClick={openApplyModal} className={`${styles.heroApplyBtn} hero-apply-btn`}>
            <span className={`${styles.heroApplyIcon} hero-apply-icon`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
              </svg>
            </span>
            <span>APPLY NOW</span>
          </a>
          <a href="#tour" className={`${styles.heroTourBtn} ${styles.openTourModal} hero-tour-btn open-tour-modal`}>
            <span className={`${styles.heroTourIcon} hero-tour-icon`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
            </span>
            <span>Virtual Campus Tour</span>
          </a>
        </div>
      </div>

      {/* Floating Hero Feature Badges */}
      <div className={`${styles.heroFloatingBadges} hero-floating-badges`}>
        <div className={`${styles.heroFbadge} ${styles.heroFbadge1} hero-fbadge hero-fbadge-1`}>
          <div className={`${styles.fbadgeIcon} ${styles.fbadgeBus} fbadge-icon fbadge-bus`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="15" rx="2" />
              <circle cx="7.5" cy="15.5" r="1.5" />
              <circle cx="16.5" cy="15.5" r="1.5" />
              <path d="M16 3v4H8V3" />
            </svg>
          </div>
          <div className={`${styles.fbadgeText} fbadge-text`}>
            <strong>100% Free Bus</strong>
            <span>Doorstep Pick & Drop</span>
          </div>
        </div>

        <div className={`${styles.heroFbadge} ${styles.heroFbadge2} hero-fbadge hero-fbadge-2`}>
          <div className={`${styles.fbadgeIcon} ${styles.fbadgeAward} fbadge-icon fbadge-award`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
          </div>
          <div className={`${styles.fbadgeText} fbadge-text`}>
            <strong>MKBU Affiliated</strong>
            <span>A+ Grade Curriculum</span>
          </div>
        </div>
      </div>

      {/* MARQUEE TICKER - Inside hero at bottom */}
      <div className={`${styles.marqueeTicker} marquee-ticker`}>
        <div className={`${styles.marqueeTrack} marquee-track`}>
          <span className={`${styles.marqueeText} marquee-text`}>TRANSFORMING LEARNING FOR A BRIGHT FUTURE</span>
          <span className={`${styles.marqueeDot} marquee-dot`}>•</span>
          <span className={`${styles.marqueeText} marquee-text`}>TRANSFORMING LEARNING FOR A BRIGHT FUTURE</span>
          <span className={`${styles.marqueeDot} marquee-dot`}>•</span>
          <span className={`${styles.marqueeText} marquee-text`}>TRANSFORMING LEARNING FOR A BRIGHT FUTURE</span>
          <span className={`${styles.marqueeDot} marquee-dot`}>•</span>
          <span className={`${styles.marqueeText} marquee-text`}>TRANSFORMING LEARNING FOR A BRIGHT FUTURE</span>
          <span className={`${styles.marqueeDot} marquee-dot`}>•</span>
          <span className={`${styles.marqueeText} marquee-text`}>TRANSFORMING LEARNING FOR A BRIGHT FUTURE</span>
          <span className={`${styles.marqueeDot} marquee-dot`}>•</span>
          <span className={`${styles.marqueeText} marquee-text`}>TRANSFORMING LEARNING FOR A BRIGHT FUTURE</span>
          <span className={`${styles.marqueeDot} marquee-dot`}>•</span>
        </div>
      </div>
    </section>
  );
}
