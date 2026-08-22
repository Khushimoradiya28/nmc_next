'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import styles from './CTASection.module.css';

const infoCards = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: 'Call Us Now',
    value: '0278-2471813',
    href: 'tel:02782471813',
    accent: 'red',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    label: 'Office Hours',
    value: 'Mon – Sat  |  8:00 AM – 1:30 PM',
    href: null,
    accent: 'gold',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: 'Find Us Here',
    value: 'Near Shivaji Circle, Bhavnagar',
    href: '/contact#map',
    accent: 'blue',
  },
];

const quickPills = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    text: 'Bhavnagar, Gujarat',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    text: 'nmcbhavnagar@gmail.com',
  },
];

const cardVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  }),
};

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={`${styles.section} section-padding`} id="contact" ref={ref}>
      {/* Immersive background elements (hidden in styles but kept for layout integrity) */}
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />
      <div className={styles.gridOverlay} />

      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          
          {/* ── LEFT: TEXT & CTA ── */}
          <div className={styles.textContent}>
            <div className={styles.watermark}>NMC</div>

            {/* Centered Admissions Badge */}
            <motion.div 
              className={styles.ctaBadge}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block', verticalAlign:'middle', marginRight:'6px', marginTop:'-2px'}}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              Admissions Open 2026-27
            </motion.div>

            <motion.div
              custom={0}
              variants={textVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className={styles.eyebrowWrapper}
            >
              <span className={styles.eyebrowLine} />
              <span className={styles.eyebrow}>Take the next step</span>
            </motion.div>

            <motion.h2 
              className={styles.heading}
              custom={1}
              variants={textVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              Ready to Shape Your Future <br/>
              <span className={styles.headingHighlight}>With Us?</span>
            </motion.h2>

            <motion.p 
              className={styles.subtext}
              custom={2}
              variants={textVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              Our admissions team is here to guide you through course selection, enrollment, and securing your place at NMC. Discover a campus designed for your success.
            </motion.p>

            {/* Urgency text below description */}
            <p className={styles.urgencyText}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block', verticalAlign:'middle', marginRight:'6px', marginTop:'-2px'}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Limited seats available — Apply before September 30, 2026
            </p>

            <motion.div 
              className={styles.pills}
              custom={3}
              variants={textVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              {/* Location Pill */}
              <div className={styles.pill}>
                <span className={styles.pillIcon}>{quickPills[0].icon}</span>
                {quickPills[0].text}
              </div>

              {/* Clickable Email Pill */}
              <a href="mailto:nmcbhavnagar@gmail.com" className={`${styles.pill} ${styles.clickablePill}`}>
                <span className={styles.pillIcon}>{quickPills[1].icon}</span>
                {quickPills[1].text}
              </a>
            </motion.div>
          </div>

          {/* ── RIGHT: GLASS CARDS & BUTTONS ── */}
          <div className={styles.cardsVisual}>
            <div>
              {infoCards.map((card, i) => {
                const cardContent = (
                  <motion.div
                    className={styles.glassCard}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    whileHover={{ y: -6, scale: 1.01, zIndex: 10 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <div className={styles.cardGlow} />
                    <div className={`${styles.iconBox} ${styles[`icon_${card.accent}`]}`}>
                      {card.icon}
                    </div>
                    <div className={styles.cardInfo}>
                      <div className={styles.cardLabel}>{card.label}</div>
                      <div className={styles.cardValue}>{card.value}</div>
                    </div>
                  </motion.div>
                );

                if (i === 0) {
                  return (
                    <a href="tel:02782471813" key={i} className={styles.cardLink}>
                      {cardContent}
                    </a>
                  );
                } else if (i === 2) {
                  return (
                    <Link href="/contact#map" key={i} className={styles.cardLink}>
                      {cardContent}
                    </Link>
                  );
                } else {
                  return (
                    <div key={i} className={styles.cardLink}>
                      {cardContent}
                    </div>
                  );
                }
              })}
            </div>

            {/* Action buttons inside the right column */}
            <motion.div 
              className={styles.actions}
              custom={4}
              variants={textVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              <Link href="/contact" className={styles.primaryBtn}>
                <span className={styles.btnText}>Contact Admissions</span>
                <span className={styles.btnIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </Link>
              <a href="tel:02782471813" className={styles.secondaryBtn}>
                Call Now
              </a>
            </motion.div>

            {/* Decorative abstract elements behind cards */}
            <div className={styles.abstractShape1} />
            <div className={styles.abstractShape2} />
          </div>

        </div>
      </div>
    </section>
  );
}
