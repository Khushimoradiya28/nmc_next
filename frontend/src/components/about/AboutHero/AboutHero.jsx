"use client";

import React from 'react';
import Image from 'next/image';
import styles from './AboutHero.module.css';

export default function AboutHero() {
  return (
    <section className={styles.aboutHeroSection} id="home">
      <div className={styles.heroBgImage}>
        <Image 
          src="/assets/shared/misc/6.jpg" 
          alt="About Us Banner" 
          fill
          priority
          sizes="100vw"
          className={styles.heroBgImg}
        />
      </div>
      <div className={styles.heroOverlay}></div>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroMainTitle}>About Us</h1>
        </div>
      </div>
    </section>
  );
}
