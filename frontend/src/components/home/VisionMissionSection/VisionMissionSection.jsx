"use client";

import React, { useState } from 'react';
import styles from './VisionMissionSection.module.css';

export default function VisionMissionSection() {
  // Modal State: null | 'vision' | 'mission'
  const [activeModal, setActiveModal] = useState(null);

  const visionText = `Our vision is to empower girls through quality education to make them realize their full potential & contribute to transforming societies where gender equality becomes a reality. We aim to develop distinctive, pioneering, educational opportunities including regional and global partnerships that lead to student success, sustainable communities, and differentiation of the institution within the state and nation. We are also committed to cultivate and encourage a challenging, accommodating, student-centered conducive environment that is characterized by academic eminence, inspiring and preparing girls to serve as ethical, enlightened citizens and leaders in an increasingly intricate, multifarious, and global environment.`;

  const missionPoints = [
    "To improve the quality and availability of girls' education.",
    "To create a desire and to provide an ambience that encourages the apperception, dissemination, and origination of new ideas and understanding.",
    "To stimulate and foster the latent curiosity in every learner.",
    "To encourage students to challenge the status quo and to create a spirit of inquiry, to generate free exchange of thoughts and ideas, and to provide the resources to explore.",
    "To nurture young minds in an environment that is non-judgmental, unbiased and liberated.",
    "To create awareness of the responsibility and accountability that goes hand-in-hand with freedom.",
    "To empower learners with effective career planning skills.",
    "To advocate diversity through a personalized approach."
  ];

  return (
    <section className={styles.sectionContainer}>
      <div className={`${styles.gridWrapper} sectionContainer`}>
        
        {/* 01 OUR VISION CARD */}
        <div className={`${styles.card} ${styles.visionCard}`}>
          <div className={styles.topAccentBar} />
          
          <div className={styles.cardHeader}>
            <span className={styles.stepIndex}>01</span>
            <span className={styles.stepCategory}>OUR FOUNDATION</span>
          </div>

          <div className={styles.titleRow}>
            <div className={`${styles.iconContainer} ${styles.visionIconContainer}`}>
              <svg className={styles.animatedIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <h2 className={styles.cardTitle}>Our Vision</h2>
          </div>

          <p className={styles.visionParagraph}>
            {visionText.substring(0, 220)}...
          </p>

          <button 
            className={`${styles.readMoreBtn} ${styles.visionBtn}`}
            onClick={() => setActiveModal('vision')}
          >
            Read Full Vision &rarr;
          </button>

          <div className={styles.cardFooter}>
            <span className={styles.footerTag}>EST. 2009 • EMPOWERMENT THROUGH EDUCATION</span>
          </div>
        </div>

        {/* 02 OUR MISSION CARD */}
        <div className={`${styles.card} ${styles.missionCard}`}>
          <div className={styles.topAccentBar} />

          <div className={styles.cardHeader}>
            <span className={styles.stepIndex}>02</span>
            <span className={styles.stepCategory}>OUR PURPOSE</span>
          </div>

          <div className={styles.titleRow}>
            <div className={`${styles.iconContainer} ${styles.missionIconContainer}`}>
              <svg className={styles.animatedIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
            </div>
            <h2 className={styles.cardTitle}>Our Mission</h2>
          </div>

          <p className={styles.missionIntro}>
            Our mission is to achieve excellence in women's education through dedicated goals:
          </p>

          <ul className={styles.bulletList}>
            {missionPoints.slice(0, 3).map((point, idx) => (
              <li key={idx} className={styles.bulletItem}>
                <span className={styles.bulletIcon}>◆</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <button 
            className={`${styles.readMoreBtn} ${styles.missionBtn}`}
            onClick={() => setActiveModal('mission')}
          >
            Read All Goals (+5 more) &rarr;
          </button>

          <div className={styles.cardFooter}>
            <span className={styles.footerTag}>EST. 2009 • EMPOWERMENT THROUGH EDUCATION</span>
          </div>
        </div>

      </div>

      {/* ================= MODAL POPUP ================= */}
      {activeModal && (
        <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setActiveModal(null)}>
              &times;
            </button>

            {activeModal === 'vision' ? (
              <div>
                <div className={styles.modalHeader}>
                  <span className={styles.stepIndex}>01 OUR FOUNDATION</span>
                  <h2 className={styles.modalTitle}>Our Vision</h2>
                </div>
                <p className={styles.modalBodyText}>{visionText}</p>
              </div>
            ) : (
              <div>
                <div className={styles.modalHeader}>
                  <span className={styles.stepIndex}>02 OUR PURPOSE</span>
                  <h2 className={styles.modalTitle}>Our Mission</h2>
                </div>
                <p className={styles.missionIntro}>
                  Our mission is to achieve excellence in women's education through the following dedicated goals:
                </p>
                <ul className={styles.modalBulletList}>
                  {missionPoints.map((point, idx) => (
                    <li key={idx} className={styles.bulletItem}>
                      <span className={styles.bulletIcon}>◆</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.modalFooter}>
              <span>EST. 2009 • EMPOWERMENT THROUGH EDUCATION</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
