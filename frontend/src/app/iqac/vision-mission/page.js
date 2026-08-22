'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import styles from './VisionMission.module.css';

export default function VisionMissionPage() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        
        {/* Fullscreen style Hero Banner with Breadcrumbs inside */}
        <section className="hero-fullscreen" id="home" style={{ minHeight: "35vh", height: "35vh" }}>
          <div className="hero-bg-image">
            <Image 
              src="/assets/banners/vision_mission_banner.jpg" 
              alt="Vision & Mission Banner" 
              fill
              style={{ objectFit: 'cover' }}
              className="hero-bg-img"
              priority
            />
          </div>
          <div className="hero-overlay"></div>
          
          <div className="hero-content container" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", paddingBottom: "45px" }}>
            <h1 className="hero-main-title" style={{ paddingRight: "15px", color: "#fff", margin: "0 0 0.5rem 0", fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              Vision &amp; <em>Mission</em>
            </h1>
            
            {/* Breadcrumb inside Hero Banner */}
            <nav aria-label="breadcrumb">
              <ol style={{ display: "flex", listStyle: "none", padding: 0, margin: 0, gap: "0.5rem", color: "var(--gold-500, #f59e0b)", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                <li><Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Home</Link></li>
                <li style={{ color: "rgba(255,255,255,0.5)" }}>&gt;</li>
                <li><Link href="/iqac" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>IQAC</Link></li>
                <li style={{ color: "rgba(255,255,255,0.5)" }}>&gt;</li>
                <li aria-current="page" style={{ color: "var(--gold-500, #f59e0b)" }}>Vision &amp; Mission</li>
              </ol>
            </nav>
          </div>
        </section>

        {/* Dynamic Dark Luxury Content section */}
        <section className={styles.wrapper}>
          {/* Ambient blur backgrounds */}
          <div className={styles.ambientGlowGold}></div>
          <div className={styles.ambientGlowRed}></div>

          <div className={styles.sectionHeader}>
            <div className={styles.pillBadge}>
              <span className={styles.pillDot}></span>
              Empowering Women Education
            </div>
            <h2 className={styles.heroTitle}>
              Our Vision &amp; Mission
            </h2>
            <p className={styles.heroSubtitle}>
              Guiding principles driving academic excellence and holistic growth.
            </p>
          </div>

          <div className={styles.grid}>
            {/* CARD 1: VISION */}
            <motion.div 
              className={styles.card}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className={styles.cardTop}>
                <div className={`${styles.iconWrapper} ${styles.iconGold}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M3 12h.01M21 12h.01M12 3h.01M12 21h.01M5.6 5.6h.01M18.4 18.4h.01M18.4 5.6h.01M5.6 18.4h.01"/>
                  </svg>
                </div>
                <span className={styles.cardTagGold}>FUTURE GOAL</span>
              </div>
              <h3 className={styles.cardHeading}>Our Vision</h3>
              <p className={styles.cardContent}>
                To foster an institutional culture driven by pedagogical excellence, research integration, and holistic student development — empowering learners for global contribution.
              </p>
              <div className={styles.cardBorderAccentGold}></div>
            </motion.div>

            {/* CARD 2: MISSION */}
            <motion.div 
              className={styles.card}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className={styles.cardTop}>
                <div className={`${styles.iconWrapper} ${styles.iconRed}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="6"/>
                    <circle cx="12" cy="12" r="2"/>
                  </svg>
                </div>
                <span className={styles.cardTagRed}>OUR COMMITMENT</span>
              </div>
              <h3 className={styles.cardHeading}>Our Mission</h3>
              <p className={styles.cardContent}>
                To develop systems for continuous academic and administrative enhancement through student-centric learning, faculty training, and structured feedback mechanisms.
              </p>
              <div className={styles.cardBorderAccentRed}></div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
