"use client";

import React from 'react';
import Image from 'next/image';
import styles from './VirtualTourSection.module.css';

export default function VirtualTourSection() {
  return (
    <section className={`${styles.sectionPadding} ${styles.tourSection} section-padding tour-section`} id="tour">
    <div className={`${styles.container} container`}>
      <div className={`${styles.tourCard} tour-card`}>
        <div>
          <span className={`${styles.tourBadge} tour-badge`}>Interactive Feature</span>
          <h2 className={`${styles.tourTitle} tour-title`}>360° Campus Virtual Tour</h2>
          <p className={`${styles.tourDesc} tour-desc`}>
            Take an immersive 360-degree interactive tour of our campus buildings, computer labs, library, fashion
            design studio, and green sports quadrangle from anywhere in the world!
          </p>

          <button className={`${styles.btn} ${styles.btnCrimson} ${styles.openTourModal} btn btn-crimson open-tour-modal`} style={{fontSize: '1.05rem'}}>
            <span>Launch Interactive 360° Tour</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
          </button>
        </div>

        <div className={`${styles.tourPreviewBox} tour-preview-box`}>
          <Image src="/assets/hero/nmc-collage.jpg" alt="NMC College Collage" width={600} height={400} className={`${styles.tourPreviewImg} tour-preview-img`} />
        </div>
      </div>
    </div>
  </section>
  );
}
