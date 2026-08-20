'use client';

import React, { useState } from 'react';
import styles from './WhyStudyWithUs.module.css';

/* â”€â”€ SVG Icons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const HeartGradIcon = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.18)" />
    <path d="M32 50S14 38 14 26a12 12 0 0 1 18-10.4A12 12 0 0 1 50 26c0 12-18 24-18 24Z" fill="white" opacity="0.95" />
    <path d="M24 24a6 6 0 0 1 8 5.5" stroke="rgba(232,93,117,0.4)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const LightbulbIcon = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.18)" />
    <path d="M32 12a14 14 0 0 1 8 25.5V42H24v-4.5A14 14 0 0 1 32 12Z" fill="white" opacity="0.95" />
    <rect x="27" y="43" width="10" height="4" rx="2" fill="white" opacity="0.8" />
    <rect x="28" y="48" width="8" height="3" rx="1.5" fill="white" opacity="0.55" />
  </svg>
);

const AwardIcon = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.18)" />
    <circle cx="32" cy="26" r="12" fill="white" opacity="0.95" />
    <path d="M22 40l-5 13 15-7 15 7-5-13" fill="white" opacity="0.75" />
    <path d="M28 26l3 3 6-7" stroke="rgba(91,141,239,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AdmissionIcon = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.18)" />
    <rect x="14" y="18" width="36" height="28" rx="4" fill="white" opacity="0.95" />
    <path d="M14 28h36" stroke="rgba(52,199,142,0.35)" strokeWidth="2" />
    <path d="M22 38h10M22 33h20" stroke="rgba(52,199,142,0.45)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="44" cy="38" r="6" fill="rgba(52,199,142,0.9)" />
    <path d="M41.5 38l2 2 3.5-3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Small versions for the front face */
const HeartSmIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="24" cy="24" r="22" fill="rgba(232,93,117,0.10)" />
    <path d="M24 34s-10-6.5-10-13a6 6 0 0 1 10-4.47A6 6 0 0 1 34 21c0 6.5-10 13-10 13Z" fill="#e85d75" opacity="0.85" />
  </svg>
);

const LightbulbSmIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="24" cy="24" r="22" fill="rgba(230,168,23,0.10)" />
    <path d="M24 10a9 9 0 0 1 5 16.48V29h-10v-2.52A9 9 0 0 1 24 10Z" fill="#e6a817" opacity="0.85" />
    <rect x="20" y="30" width="8" height="3" rx="1.5" fill="#e6a817" />
  </svg>
);

const AwardSmIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="24" cy="24" r="22" fill="rgba(91,141,239,0.10)" />
    <circle cx="24" cy="20" r="8" fill="#5b8def" opacity="0.85" />
    <path d="M18 28l-3 8 9-4 9 4-3-8" fill="#5b8def" opacity="0.6" />
    <path d="M21 20l2 2 4-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AdmissionSmIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="24" cy="24" r="22" fill="rgba(52,199,142,0.10)" />
    <rect x="12" y="14" width="24" height="20" rx="3" fill="#34c78e" opacity="0.85" />
    <path d="M12 20h24" stroke="#fff" strokeWidth="1.5" />
    <circle cx="32" cy="28" r="4" fill="#fff" />
    <path d="M30 28l1.5 1.5L34 26" stroke="#34c78e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* â”€â”€ Card Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const CARDS = [
  {
    id: 'card-legacy',
    FrontIcon: HeartSmIcon,
    BackIcon: HeartGradIcon,
    title: 'Why Study With Us?',
    teaser: '9 years of shaping futures.',
    description:
      'From the last 9 years we are in the Education Field and have the honor of shaping thousands of bright futures. Our student-first culture, dedicated mentorship, and holistic approach set us apart.',
    accentColor: '#e85d75',
    backBg: 'linear-gradient(145deg, #c0475b 0%, #e85d75 40%, #f2849a 100%)',
    bgGradient: 'linear-gradient(135deg, #fff0f3 0%, #fce4ec 100%)',
    borderColor: 'rgba(232,93,117,0.12)',
    glowColor: 'rgba(232,93,117,0.20)',
    defaultRotate: '-10deg',
    defaultTranslateY: '15px',
    badgeLabel: '9+ Years',
  },
  {
    id: 'card-techniques',
    FrontIcon: LightbulbSmIcon,
    BackIcon: LightbulbIcon,
    title: 'Special Techniques',
    teaser: 'Visual & innovative teaching.',
    description:
      'We provide special visual teaching techniques and modern pedagogy to help students understand, retain, and grow faster. Blending traditional wisdom with contemporary methods for maximum impact.',
    accentColor: '#e6a817',
    backBg: 'linear-gradient(145deg, #c78c0a 0%, #e6a817 40%, #f5c842 100%)',
    bgGradient: 'linear-gradient(135deg, #fffde6 0%, #fff8cc 100%)',
    borderColor: 'rgba(230,168,23,0.12)',
    glowColor: 'rgba(230,168,23,0.20)',
    defaultRotate: '-3deg',
    defaultTranslateY: '0px',
    badgeLabel: 'Innovative',
  },
  {
    id: 'card-staff',
    FrontIcon: AwardSmIcon,
    BackIcon: AwardIcon,
    title: 'Qualified Staff',
    teaser: 'Expert teachers, real results.',
    description:
      'Our highly qualified teachers from the field deliver the best professional knowledge and industry-relevant insights. Every faculty member brings both academic credentials and real-world expertise.',
    accentColor: '#5b8def',
    backBg: 'linear-gradient(145deg, #3b6fd6 0%, #5b8def 40%, #8ab4f8 100%)',
    bgGradient: 'linear-gradient(135deg, #f0f5ff 0%, #e0eaff 100%)',
    borderColor: 'rgba(91,141,239,0.12)',
    glowColor: 'rgba(91,141,239,0.20)',
    defaultRotate: '3deg',
    defaultTranslateY: '0px',
    badgeLabel: 'Expert',
  },
  {
    id: 'card-admission',
    FrontIcon: AdmissionSmIcon,
    BackIcon: AdmissionIcon,
    title: 'Get Admission',
    teaser: 'Seats filling fast â€” act now.',
    description:
      'Rush before all seats are reserved for the current batch. Limited seats ensure personal attention for every student. Contact us today:\n0278 â€“ 2471813 / 14 / 15 / 16 / 17',
    accentColor: '#34c78e',
    backBg: 'linear-gradient(145deg, #1a9e6a 0%, #34c78e 40%, #6ee7b7 100%)',
    bgGradient: 'linear-gradient(135deg, #f0fdf8 0%, #dcfce7 100%)',
    borderColor: 'rgba(52,199,142,0.12)',
    glowColor: 'rgba(52,199,142,0.20)',
    defaultRotate: '10deg',
    defaultTranslateY: '15px',
    badgeLabel: 'Enroll Now',
  },
];

/* â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export default function WhyStudyWithUs() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className={styles.section} aria-labelledby="why-study-heading">
      {/* Ambient blobs */}
      <div className={styles.blobTopLeft} aria-hidden="true" />
      <div className={styles.blobBottomRight} aria-hidden="true" />

      <div className={`${styles.container} sectionContainer`}>
        {/* Header */}
        <header className={styles.header}>
          <span className={styles.eyebrow}>OUR HIGHLIGHTS</span>
          <h2 id="why-study-heading" className={styles.heading}>
            Why Choose{' '}
            <span className={styles.headingAccent}>Nandkunvarba Mahila College</span>
          </h2>
          <p className={styles.subheading}>
            A legacy of academic excellence, innovation, and student-first values â€” discover why
            thousands of young women trust us with their future.
          </p>
          <div className={styles.decorLine} aria-hidden="true" />
        </header>

        {/* Fan + Flip Card Container */}
        <div className={styles.fanDeck} role="list" aria-label="Reasons to study with us">
          {CARDS.map((card) => {
            const isHovered = hoveredId === card.id;
            const isAnyHovered = hoveredId !== null;

            return (
              /* 1ï¸âƒ£  cardContainer â€” owns perspective + fan rotation + hover elevation */
              <div
                key={card.id}
                id={card.id}
                role="listitem"
                className={`${styles.cardWrapper} ${isHovered ? styles.wrapperHovered : ''} ${
                  isAnyHovered && !isHovered ? styles.wrapperDimmed : ''
                }`}
                style={{
                  '--card-accent': card.accentColor,
                  '--card-bg': card.bgGradient,
                  '--card-border': card.borderColor,
                  '--card-glow': card.glowColor,
                  '--back-bg': card.backBg,
                  '--default-rotate': card.defaultRotate,
                  '--default-translate-y': card.defaultTranslateY,
                }}
                onMouseEnter={() => setHoveredId(card.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(card.id)}
                onBlur={() => setHoveredId(null)}
                tabIndex={0}
                aria-label={`${card.title} â€” hover to learn more`}
              >
                {/* 2ï¸âƒ£  cardInner â€” owns the rotateY(180deg) flip */}
                <div className={`${styles.cardInner} ${isHovered ? styles.cardFlipped : ''}`}>

                  {/* 3ï¸âƒ£  FRONT FACE */}
                  <div className={styles.cardFront} aria-hidden={isHovered}>
                    {/* Top accent bar */}
                    <div className={styles.stripe} aria-hidden="true" />

                    <span className={styles.frontBadge}>{card.badgeLabel}</span>

                    <div className={styles.frontIconWrap} aria-hidden="true">
                      <card.FrontIcon />
                    </div>

                    <h3 className={styles.frontTitle}>{card.title}</h3>
                    <p className={styles.frontTeaser}>{card.teaser}</p>

                    <span className={styles.flipHint} aria-hidden="true">
                      Hover to flip â†»
                    </span>

                    {/* Decorative circle */}
                    <div className={styles.frontCircle} aria-hidden="true" />
                  </div>

                  {/* 4ï¸âƒ£  BACK FACE */}
                  <div className={styles.cardBack} aria-hidden={!isHovered}>
                    <div className={styles.backIconWrap} aria-hidden="true">
                      <card.BackIcon size={72} />
                    </div>

                    <h3 className={styles.backTitle}>{card.title}</h3>
                    <p className={styles.backDesc}>{card.description}</p>

                    <div className={styles.backDivider} aria-hidden="true" />
                    <span className={styles.backTag}>{card.badgeLabel}</span>

                    {/* Decorative rings */}
                    <div className={styles.backRing1} aria-hidden="true" />
                    <div className={styles.backRing2} aria-hidden="true" />
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
