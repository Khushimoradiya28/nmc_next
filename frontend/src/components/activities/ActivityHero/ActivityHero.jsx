'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './ActivityHero.module.css';

export default function ActivityHero({ title, subtitle, bgImage = '/assets/home/hero/2.jpg', height = '50vh', breadcrumbs = [], decorative = false }) {
  return (
    <section className={styles.heroSection} style={{ minHeight: height, height }}>
      <div className={styles.heroBgImage}>
        <Image 
          src={bgImage} 
          alt={title} 
          fill
          priority
          sizes="100vw"
          className={styles.heroBgImg}
        />
      </div>
      <div className={styles.heroOverlay}></div>

      {/* Decorative gold accent elements */}
      {decorative && (
        <div className={styles.heroDecorative} aria-hidden="true">
          <div className={styles.decoCircle1}></div>
          <div className={styles.decoCircle2}></div>
          <div className={styles.decoLine}></div>
          <div className={styles.decoGlow}></div>
          <div className={styles.decoDots}>
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
      )}

      <div className={styles.container}>
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className={styles.heroTitle}><em>{title}</em></h1>
          {subtitle && <p className={styles.heroSubtitle}>{subtitle}</p>}
          
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav aria-label="breadcrumb" className={styles.breadcrumbNav}>
              <ol className={styles.breadcrumbList}>
                <li><Link href="/">Home</Link></li>
                {breadcrumbs.map((bc, idx) => (
                  <React.Fragment key={idx}>
                    <li className={styles.separator}>&gt;</li>
                    {bc.link ? (
                      <li><Link href={bc.link}>{bc.label}</Link></li>
                    ) : (
                      <li className={styles.activePage}>{bc.label}</li>
                    )}
                  </React.Fragment>
                ))}
              </ol>
            </nav>
          )}
        </motion.div>
      </div>
    </section>
  );
}
