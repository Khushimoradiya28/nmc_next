"use client";

import React, { useState } from 'react';
import styles from './page.module.css';

const PROGRAMS = [
  {
    id: 0,
    tag: 'Faculty Empowerment & Pedagogy',
    code: 'FDP',
    title: 'Faculty Development Programs (FDP)',
    frequency: 'Quarterly Series',
    tagline: 'Enhancing Pedagogical Mastery, Outcome-Based Education (OBE) & Research Rigor',
    desc: 'Our continuous Faculty Development Programs equip academic mentors with modern ICT tools, interdisciplinary research skills, hybrid teaching techniques, and student-centered curriculum delivery.',
    themeClass: styles.eventThemeRuby,
    pillClass: styles.pillRuby,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    modules: [
      'Outcome-Based Education (OBE) & Bloom\'s Taxonomy Mapping',
      'Advanced ICT Integration & Smart Classroom Technologies',
      'UGC-CARE Research Paper Writing & Seed Grant Proposals',
      'Continuous Evaluation, Academic Auditing & Student Mentoring'
    ],
    kpis: [
      { num: '100%', label: 'Faculty Certified' },
      { num: '15+', label: 'Annual Sessions' },
      { num: 'OBE', label: 'Framework Aligned' }
    ]
  },
  {
    id: 1,
    tag: 'Academic Discourse & Research',
    code: 'CONF',
    title: 'National & State Conferences',
    frequency: 'Annual Colloquium',
    tagline: 'Fostering Scholarly Innovation, Peer Reviews & National Academic Dialogues',
    desc: 'Multidisciplinary conferences bringing together esteemed researchers, professors, and university leadership to present peer-reviewed papers and publish conference proceedings.',
    themeClass: styles.eventThemeGold,
    pillClass: styles.pillGold,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    modules: [
      'Interdisciplinary National Seminars across Arts, Commerce & IT',
      'Peer-Reviewed ISBN Conference Proceedings Publications',
      'Keynote Addresses by UGC & University Vice Chancellors',
      'Young Researcher & Faculty Research Paper Awards'
    ],
    kpis: [
      { num: '500+', label: 'Research Delegates' },
      { num: 'ISBN', label: 'Published Volumes' },
      { num: 'National', label: 'Institutional Reach' }
    ]
  },
  {
    id: 2,
    tag: 'Career Readiness & Personality',
    code: 'SKILL',
    title: 'Student Skill Development Workshops',
    frequency: 'Monthly Masterclasses',
    tagline: 'Bridging the Academic-Industry Gap with Practical Experiential Training',
    desc: 'Hands-on skill bootcamps designed to provide women students with employability skills, corporate etiquette, digital fluency, competitive exam guidance, and entrepreneurial confidence.',
    themeClass: styles.eventThemeEmerald,
    pillClass: styles.pillEmerald,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    modules: [
      'Advanced Digital Tools & Computer Programming Labs',
      'Corporate Communication, Public Speaking & Interview Prep',
      'Financial Literacy, Tally Prime & Banking Masterclasses',
      'Women Entrepreneurship Incubation & Startup Mentorship'
    ],
    kpis: [
      { num: '2500+', label: 'Students Upskilled' },
      { num: '100%', label: 'Free Campus Welfare' },
      { num: 'Hands-On', label: 'Practical Labs' }
    ]
  },
  {
    id: 3,
    tag: 'Corporate & Global Interface',
    code: 'TALK',
    title: 'Expert Webinars & Guest Lectures',
    frequency: 'Bi-Weekly Series',
    tagline: 'Connecting Classroom Learning with Real-World Corporate Insights',
    desc: 'Interactive digital and on-campus knowledge sessions delivered by industry leaders, civil servants, legal luminaries, and accomplished alumni achievers.',
    themeClass: styles.eventThemeAzure,
    pillClass: styles.pillAzure,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    ),
    modules: [
      'Industry 4.0 & Emerging Career Opportunities for Women',
      'Legal Rights, Cyber Security & Women Safety Awareness',
      'Civil Services & Competitive Exam Guidance (UPSC/GPSC)',
      'Alumni Leadership Talk Series & Global Career Pathways'
    ],
    kpis: [
      { num: '120+', label: 'Distinguished Speakers' },
      { num: 'Corporate', label: 'Sector Mentors' },
      { num: 'Global', label: 'Career Horizons' }
    ]
  }
];

export default function EventsShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  const current = PROGRAMS[activeTab];

  return (
    <section className={styles.eventsShowcaseSection} id="conferences-and-workshops">
      <div className={styles.container}>
        
        {/* Section Header */}
        <div className={styles.eventsHeaderBlock} data-animate="header">
          <div className={styles.eventsBadge}>
            <span className={styles.eventsBadgeDot}></span>
            <span>Professional Development &amp; Training</span>
          </div>
          <h2 className={styles.eventsMainTitle}>
            Conferences, FDP &amp; <span className={styles.eventsTitleAccent}>Workshops</span>
          </h2>
          <p className={styles.eventsMainSubtitle}>
            An interconnected professional empowerment ecosystem organizing pedagogical, academic, and industrial excellence programs.
          </p>
        </div>

        {/* Interactive Segment Navigation Tabs */}
        <div className={styles.eventsTabBar}>
          {PROGRAMS.map((p, idx) => {
            const isSelected = idx === activeTab;
            return (
              <button
                key={p.id}
                type="button"
                className={`${styles.eventsTabBtn} ${isSelected ? styles.eventsTabBtnActive : ''}`}
                onClick={() => setActiveTab(idx)}
                aria-selected={isSelected}
              >
                <span className={styles.eventsTabIcon}>{p.icon}</span>
                <div className={styles.eventsTabTextWrap}>
                  <span className={styles.eventsTabCode}>{p.code}</span>
                  <span className={styles.eventsTabTitle}>{p.title.split('(')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Out-of-the-Box Bento Showcase Console */}
        <div className={styles.eventsBentoConsole} data-animate="fade-up">
          
          {/* Main Showcase Hero Stage (Left) */}
          <div className={`${styles.eventsStageCard} ${current.themeClass}`}>
            
            {/* Top Meta */}
            <div className={styles.stageTopMeta}>
              <span className={`${styles.stageCategoryPill} ${current.pillClass}`}>
                {current.tag}
              </span>
              <span className={styles.stageFrequencyBadge}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {current.frequency}
              </span>
            </div>

            {/* Title & Tagline */}
            <h3 className={styles.stageTitle}>{current.title}</h3>
            <p className={styles.stageTagline}>{current.tagline}</p>
            <p className={styles.stageDescription}>{current.desc}</p>

            {/* 4 Core Focus Modules */}
            <div className={styles.stageModulesBox}>
              <h4 className={styles.stageModulesHeading}>Key Curriculum &amp; Training Deliverables</h4>
              <div className={styles.stageModulesGrid}>
                {current.modules.map((mod, i) => (
                  <div className={styles.moduleItem} key={i}>
                    <div className={styles.moduleCheckIcon}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>{mod}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 Impact KPIs */}
            <div className={styles.stageKpiRow}>
              {current.kpis.map((kpi, kIdx) => (
                <div className={styles.stageKpiItem} key={kIdx}>
                  <strong className={styles.stageKpiNum}>{kpi.num}</strong>
                  <span className={styles.stageKpiLabel}>{kpi.label}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Quick Select Program Cards (Right) */}
          <div className={styles.eventsSideCards}>
            {PROGRAMS.map((prog, pIdx) => {
              const isCurrent = pIdx === activeTab;
              return (
                <div
                  key={prog.id}
                  className={`${styles.eventsSideCard} ${isCurrent ? styles.eventsSideCardActive : ''}`}
                  onClick={() => setActiveTab(pIdx)}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.sideCardTop}>
                    <span className={styles.sideCardIndex}>0{pIdx + 1}</span>
                    <span className={styles.sideCardFreq}>{prog.frequency}</span>
                  </div>
                  <h4 className={styles.sideCardTitle}>{prog.title}</h4>
                  <p className={styles.sideCardTag}>{prog.tag}</p>
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Highlights & Metrics Bar */}
        <div className={styles.eventsHighlightsStrip}>
          <div className={styles.eventsHighlightItem}>
            <strong>50+</strong>
            <span>FDPs &amp; Workshops Held</span>
          </div>
          <div className={styles.eventsHighlightDivider} />
          <div className={styles.eventsHighlightItem}>
            <strong>120+</strong>
            <span>Distinguished Speakers</span>
          </div>
          <div className={styles.eventsHighlightDivider} />
          <div className={styles.eventsHighlightItem}>
            <strong>2500+</strong>
            <span>Certificates Awarded</span>
          </div>
          <div className={styles.eventsHighlightDivider} />
          <div className={styles.eventsHighlightItem}>
            <strong>100%</strong>
            <span>Free Skill Access</span>
          </div>
        </div>

      </div>
    </section>
  );
}
