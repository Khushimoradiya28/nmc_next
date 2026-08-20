"use client";

import React from 'react';
import styles from './VisionMission.module.css';

export default function VisionMission() {
  const visionText = `Our vision is to empower girls through quality education to make them realize their full potential & contribute to transforming societies where gender equality becomes a reality. We aim to develop distinctive, pioneering, educational opportunities including regional and global partnerships that lead to student success, sustainable communities, and differentiation of the institution within the state and nation. We are also committed to cultivate and encourage a challenging, accommodating, student-centered conducive environment that is characterized by academic eminence, inspiring and preparing girls to serve as ethical, enlightened citizens and leaders in an increasingly intricate, multifarious, and global environment.`;
  
  const missionText = `To improve the quality and availability of girls' education. To create a desire and to provide an ambience that encourages the apperception, dissemination, and origination of new ideas and understanding. To stimulate and foster the latent curiosity in every learner. To encourage students to challenge the status quo and to create a spirit of inquiry, to generate free exchange of thoughts and ideas, and to provide the resources to explore. To nurture young minds in an environment that is non-judgmental, unbiased and liberated. To create awareness of the responsibility and accountability that goes hand-in-hand with freedom. To empower learners with effective career planning skills. To advocate diversity through a personalized approach.`;

  return (
    <section className={styles.visionMissionSection} id="vision-mission">
      {/* Ambient glowing mesh background */}
      <div className={styles.vmBgMesh}>
        <div className={`${styles.vmGlowOrb} ${styles.vmGlowOrb1}`}></div>
        <div className={`${styles.vmGlowOrb} ${styles.vmGlowOrb2}`}></div>
        <div className={`${styles.vmGlowOrb} ${styles.vmGlowOrb3}`}></div>
        <div className={styles.vmGridPattern}></div>
      </div>

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.vmHeaderWrap}>
          <div className={styles.vmHeaderPill}>
            <span className={styles.vmHeaderPillDot}></span>
            <span>Guiding Philosophy</span>
          </div>
          <h2 className={styles.vmMainTitle}>Vision &amp; <span>Mission</span></h2>
          <p className={styles.vmMainSubtitle}>
            Fostering intellect, autonomy, and leadership to shape enlightened women leaders for tomorrow's world.
          </p>
        </div>

        {/* Luxury Dual Grid Layout */}
        <div className={styles.vmLuxuryGrid}>
          {/* CARD 1: OUR VISION */}
          <div className={`${styles.vmCardLuxury} ${styles.vmCardVision}`}>
            <div className={styles.vmCardTopBar}>
              <span className={`${styles.vmBadgeTag} ${styles.vmTagSky}`}>Our Vision</span>
              <span className={styles.vmCardNumber}>01</span>
            </div>
            
            <div className={styles.vmCardHeader}>
              <div className={`${styles.vmIconBubble} ${styles.vmIconSky}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <div>
                <h3 className={styles.vmCardTitle}>Empowering Minds</h3>
                <span className={styles.vmCardLead}>Intellectual &amp; Social Development</span>
              </div>
            </div>

            <div className={`${styles.vmQuoteBox} ${styles.vmQuoteSky}`}>
              "Empower girls through quality education to make them realize their full potential &amp; contribute to transforming societies where gender equality becomes a reality."
            </div>

            <p className={styles.vmSimpleText}>
              {visionText}
            </p>

            <div className={styles.vmCardFooter}>
              <div className={styles.vmChips}>
                <span className={styles.vmChip}>EMPOWERMENT</span>
                <span className={styles.vmChip}>GLOBAL VISION</span>
                <span className={styles.vmChip}>GENDER EQUALITY</span>
              </div>
            </div>
          </div>

          {/* CARD 2: OUR MISSION */}
          <div className={`${styles.vmCardLuxury} ${styles.vmCardMission}`}>
            <div className={styles.vmCardTopBar}>
              <span className={`${styles.vmBadgeTag} ${styles.vmTagGold}`}>Our Mission</span>
              <span className={styles.vmCardNumber}>02</span>
            </div>

            <div className={styles.vmCardHeader}>
              <div className={`${styles.vmIconBubble} ${styles.vmIconGold}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="6"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
              <div>
                <h3 className={styles.vmCardTitle}>Action &amp; Growth</h3>
                <span className={styles.vmCardLead}>Holistic Pedagogy &amp; Skills</span>
              </div>
            </div>

            <div className={`${styles.vmQuoteBox} ${styles.vmQuoteGold}`}>
              "To improve the quality and availability of girls' education... to stimulate and foster the latent curiosity in every learner."
            </div>

            <p className={styles.vmSimpleText}>
              {missionText}
            </p>

            <div className={styles.vmCardFooter}>
              <div className={styles.vmChips}>
                <span className={styles.vmChip}>QUALITY EDUCATION</span>
                <span className={styles.vmChip}>CURIOSITY</span>
                <span className={styles.vmChip}>CAREER GROWTH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
