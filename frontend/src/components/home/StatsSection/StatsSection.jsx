"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './StatsSection.module.css';

export default function StatsSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    let statsTriggered = false;

    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const animateStats = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsTriggered) {
          statsTriggered = true;
          observer.unobserve(entry.target);

          const statCards = sectionRef.current.querySelectorAll('.stat-premium-card');
          statCards.forEach((card, idx) => {
            // Add revealed class for progress bar animation
            card.classList.add(styles.revealed);

            const statNumber = card.querySelector('.stat-premium-number');
            if (!statNumber) return;

            const target = parseInt(statNumber.getAttribute('data-target') || '0', 10);
            const suffix = statNumber.getAttribute('data-suffix') || '';
            const duration = 2200; // ms
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easedProgress = easeOutExpo(progress);
              const currentVal = Math.floor(easedProgress * target);

              statNumber.innerHTML = `${currentVal.toLocaleString()}<span>${suffix}</span>`;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                statNumber.innerHTML = `${target.toLocaleString()}<span>${suffix}</span>`;
              }
            };

            setTimeout(() => {
              requestAnimationFrame(updateCounter);
            }, idx * 100);
          });
        }
      });
    };

    const observer = new IntersectionObserver(animateStats, { threshold: 0.2 });

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <section ref={sectionRef} className={`${styles.statsPremiumSection} stats-premium-section`}>
      <div className={`${styles.container} container`}>
        <div className={`${styles.statsPremiumGrid} stats-premium-grid`}>

          {/* STAT 1: 15+ Years */}
          <div className={`${styles.statPremiumCard} ${styles.statThemeRuby} ${styles.spotlightActive} stat-premium-card stat-theme-ruby spotlight-active`}>
            <div className={`${styles.statCardTop} stat-card-top`}>
              <div className={`${styles.statIconWrap} ${styles.statIconRuby} stat-icon-wrap stat-icon-ruby`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
              </div>
              <span className={`${styles.statSubChip} ${styles.chipRuby} stat-sub-chip chip-ruby`}>Est. 2009</span>
            </div>
            <div className={`${styles.statNumberWrap} stat-number-wrap`}>
              <div className={`${styles.statPremiumNumber} stat-premium-number`} data-target="15" data-suffix="+">0</div>
            </div>
            <div className={`${styles.statPremiumLabel} stat-premium-label`}>Years of Academic Excellence</div>
            <div className={`${styles.statMeterTrack} stat-meter-track`}>
              <div className={`${styles.statMeterFill} ${styles.statFillRuby} stat-meter-fill stat-fill-ruby`}></div>
            </div>
          </div>

          {/* STAT 2: 100% Free Bus */}
          <div className={`${styles.statPremiumCard} ${styles.statThemeGold} ${styles.spotlightActive} stat-premium-card stat-theme-gold spotlight-active`}>
            <div className={`${styles.statCardTop} stat-card-top`}>
              <div className={`${styles.statIconWrap} ${styles.statIconGold} stat-icon-wrap stat-icon-gold`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 5a2 2 0 0 1 2-3h10a2 2 0 0 1 2 3" /><rect x="4" y="5" width="16" height="12" rx="2" /><path d="M4 12h16" /><path d="M12 5v7" /><circle cx="7.5" cy="19.5" r="1.5" /><circle cx="16.5" cy="19.5" r="1.5" /><path d="M4 17h1.5M18.5 17H20" /><path d="M7 8h2M15 8h2" /></svg>
              </div>
              <span className={`${styles.statSubChip} ${styles.chipGold} stat-sub-chip chip-gold`}>100% Free</span>
            </div>
            <div className={`${styles.statNumberWrap} stat-number-wrap`}>
              <div className={`${styles.statPremiumNumber} stat-premium-number`} data-target="100" data-suffix="%">0</div>
            </div>
            <div className={`${styles.statPremiumLabel} stat-premium-label`}>Free Bus Transport Coverage</div>
            <div className={`${styles.statMeterTrack} stat-meter-track`}>
              <div className={`${styles.statMeterFill} ${styles.statFillGold} stat-meter-fill stat-fill-gold`}></div>
            </div>
          </div>

          {/* STAT 3: 12+ Programs */}
          <div className={`${styles.statPremiumCard} ${styles.statThemeCrimson} ${styles.spotlightActive} stat-premium-card stat-theme-crimson spotlight-active`}>
            <div className={`${styles.statCardTop} stat-card-top`}>
              <div className={`${styles.statIconWrap} ${styles.statIconCrimson} stat-icon-wrap stat-icon-crimson`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
              </div>
              <span className={`${styles.statSubChip} ${styles.chipCrimson} stat-sub-chip chip-crimson`}>UG & PG Degrees</span>
            </div>
            <div className={`${styles.statNumberWrap} stat-number-wrap`}>
              <div className={`${styles.statPremiumNumber} stat-premium-number`} data-target="12" data-suffix="+">0</div>
            </div>
            <div className={`${styles.statPremiumLabel} stat-premium-label`}>Degree & Diploma Programs</div>
            <div className={`${styles.statMeterTrack} stat-meter-track`}>
              <div className={`${styles.statMeterFill} ${styles.statFillCrimson} stat-meter-fill stat-fill-crimson`}></div>
            </div>
          </div>

          {/* STAT 4: 5,000+ Students */}
          <div className={`${styles.statPremiumCard} ${styles.statThemeAmber} ${styles.spotlightActive} stat-premium-card stat-theme-amber spotlight-active`}>
            <div className={`${styles.statCardTop} stat-card-top`}>
              <div className={`${styles.statIconWrap} ${styles.statIconAmber} stat-icon-wrap stat-icon-amber`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <span className={`${styles.statSubChip} ${styles.chipAmber} stat-sub-chip chip-amber`}>Alumni Legacy</span>
            </div>
            <div className={`${styles.statNumberWrap} stat-number-wrap`}>
              <div className={`${styles.statPremiumNumber} stat-premium-number`} data-target="5000" data-suffix="+">0</div>
            </div>
            <div className={`${styles.statPremiumLabel} stat-premium-label`}>Total Empowered Students</div>
            <div className={`${styles.statMeterTrack} stat-meter-track`}>
              <div className={`${styles.statMeterFill} ${styles.statFillAmber} stat-meter-fill stat-fill-amber`}></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
