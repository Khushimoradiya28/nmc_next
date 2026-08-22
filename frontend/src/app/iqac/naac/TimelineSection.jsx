'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import styles from './page.module.css';

const qualityInitiatives = [
  {
    year: '2024-25',
    title: 'NEP 2020 Full Integration',
    desc: 'Complete transition to outcome-based education with multidisciplinary course frameworks and credit-based elective system.',
    progress: 100,
  },
  {
    year: '2023-24',
    title: 'Digital Infrastructure Upgrade',
    desc: 'Smart classroom deployment, campus-wide WiFi 6, and N-LIST digital library access extended to all departments.',
    progress: 100,
  },
  {
    year: '2022-23',
    title: 'Research Culture Enhancement',
    desc: 'Launch of institutional research cell, UGC-CARE publication incentives, and faculty minor research project grants.',
    progress: 100,
  },
  {
    year: '2021-22',
    title: 'Green Campus & Sustainability',
    desc: 'Solar panel installation, rainwater harvesting, plastic-free campus drive, and environment awareness programs.',
    progress: 100,
  },
];

const cardVariants = {
  hidden: (direction) => ({
    opacity: 0,
    y: 20,
  }),
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

function TimelineItem({ item, idx }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const direction = idx % 2 === 0 ? 'left' : 'right';

  return (
    <motion.div
      ref={ref}
      className={`${styles.timelineItem} ${idx % 2 === 0 ? styles.timelineLeft : styles.timelineRight}`}
      variants={cardVariants}
      custom={direction}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ delay: idx * 0.15 }}
    >
      <div className={styles.timelineNode}>
        <span className={styles.timelineNodeDot}></span>
        <span className={styles.timelineNodeRing}></span>
      </div>
      <div className={styles.timelineCard}>
        <div className={styles.timelineCardHeader}>
          <span className={styles.timelineYear}>{item.year}</span>
          <span className={styles.timelineStep}>Phase {String(idx + 1).padStart(2, '0')}</span>
        </div>
        <h4 className={styles.timelineTitle}>{item.title}</h4>
        <p className={styles.timelineDesc}>{item.desc}</p>
        <div className={styles.timelineProgressWrap}>
          <div className={styles.timelineProgressBar}>
            <motion.div
              className={styles.timelineProgressFill}
              initial={{ width: 0 }}
              animate={isInView ? { width: `${item.progress}%` } : { width: 0 }}
              transition={{ delay: idx * 0.15 + 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            ></motion.div>
          </div>
          <span className={styles.timelineProgressLabel}>Completed</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function TimelineSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className={styles.timelineSection} ref={containerRef}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTag}>
            <span className={styles.tagDot}></span>
            Quality Journey
          </div>
          <h2 className={styles.sectionTitle}>
            Recent Quality <span>Initiatives</span>
          </h2>
          <p className={styles.sectionSubtext}>
            A chronological snapshot of key institutional milestones in our continuous pursuit of academic excellence.
          </p>
        </div>

        <div className={styles.timeline}>
          {/* Background line */}
          <div className={styles.timelineLineBg}></div>
          {/* Animated progress line */}
          <motion.div
            className={styles.timelineLineProgress}
            style={{ height: lineHeight }}
          ></motion.div>

          {qualityInitiatives.map((item, idx) => (
            <TimelineItem item={item} idx={idx} key={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
