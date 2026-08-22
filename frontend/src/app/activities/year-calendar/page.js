'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import styles from './page.module.css';

/* ═══════════════════════════════════════════════════
   YEAR CALENDAR DATA - Academic Year 2025-26
   Nandkunvarba Mahila College, Bhavnagar
   Affiliated to Maharaja Krishnakumarsinhji Bhavnagar University
═══════════════════════════════════════════════════ */

const ACADEMIC_YEAR = '2025-26';

const SEASONS_DATA = [
  {
    title: 'Monsoon Term',
    months: ['June', 'July', 'August', 'September'],
    image: '/assets/banners/monsoon_season.jpg',
    desc: 'Term commencement, student registrations, induction drives, and initial internal tests.',
    accent: 'var(--color-primary, #B00000)',
    accentLight: 'var(--color-secondary-light, rgba(244, 176, 0, 0.15))',
  },
  {
    title: 'Winter Term',
    months: ['October', 'November', 'December', 'January'],
    image: '/assets/banners/winter_season.jpg',
    desc: 'Odd semester exams, winter breaks, sports fests, and even semester commencement.',
    accent: 'var(--color-secondary, #F4B000)',
    accentLight: 'rgba(244, 176, 0, 0.08)',
  },
  {
    title: 'Summer Term',
    months: ['February', 'March', 'April', 'May'],
    image: '/assets/banners/summer_season.jpg',
    desc: 'Even semester internal tests, annual fests, final university exams, and summer breaks.',
    accent: 'var(--color-primary, #B00000)',
    accentLight: 'var(--color-secondary-light, rgba(244, 176, 0, 0.15))',
  }
];

const SEMESTER_INFO = [
  {
    id: 'odd',
    label: 'Odd Semester',
    period: 'June 2025 – November 2025',
    description: 'First teaching term covering UG Sem 1, 3, 5 and PG Sem 1, 3',
    highlights: [
      'Admission & Registration',
      'Orientation Programs',
      'Internal Assessment I & II',
      'University Examinations (Oct–Nov)',
    ],
  },
  {
    id: 'even',
    label: 'Even Semester',
    period: 'December 2025 – May 2026',
    description: 'Second teaching term covering UG Sem 2, 4, 6 and PG Sem 2, 4',
    highlights: [
      'Cultural & Annual Day Events',
      'Internal Assessment I & II',
      'University Examinations (Mar–Apr)',
      'Result Declaration & Convocation Prep',
    ],
  },
];

const MONTHS_DATA = [
  {
    month: 'June',
    year: 2025,
    shortMonth: 'Jun',
    events: [
      { text: 'New Academic Session Begins', type: 'academic', date: '16 Jun' },
      { text: 'Admission Process (UG/PG)', type: 'academic', date: '01–30 Jun' },
      { text: 'Faculty Orientation Meeting', type: 'event', date: '14 Jun' },
      { text: 'Fresher\'s Welcome & Induction', type: 'event', date: '25 Jun' },
    ],
  },
  {
    month: 'July',
    year: 2025,
    shortMonth: 'Jul',
    events: [
      { text: 'Miracle to Milestone Orientation', type: 'event', date: '01–03 Jul' },
      { text: 'Library Membership Drive', type: 'academic', date: '07 Jul' },
      { text: 'Guru Purnima Celebration', type: 'holiday', date: '10 Jul' },
      { text: 'Club Registration Opens', type: 'event', date: '15 Jul' },
      { text: 'NSS Enrolment Camp', type: 'event', date: '21 Jul' },
    ],
  },
  {
    month: 'August',
    year: 2025,
    shortMonth: 'Aug',
    events: [
      { text: 'Independence Day Celebration', type: 'holiday', date: '15 Aug' },
      { text: 'Janmashtami', type: 'holiday', date: '16 Aug' },
      { text: 'Internal Assessment – I Begins', type: 'exam', date: '18 Aug' },
      { text: 'Sports Team Trials', type: 'event', date: '22 Aug' },
      { text: 'Raksha Bandhan', type: 'holiday', date: '09 Aug' },
    ],
  },
  {
    month: 'September',
    year: 2025,
    shortMonth: 'Sep',
    events: [
      { text: 'Teacher\'s Day Celebration', type: 'event', date: '05 Sep' },
      { text: 'Hindi Diwas', type: 'event', date: '14 Sep' },
      { text: 'NSS Day Activities', type: 'event', date: '24 Sep' },
      { text: 'Inter-Department Quiz', type: 'event', date: '27 Sep' },
    ],
  },
  {
    month: 'October',
    year: 2025,
    shortMonth: 'Oct',
    events: [
      { text: 'Gandhi Jayanti', type: 'holiday', date: '02 Oct' },
      { text: 'Navratri Vacation', type: 'holiday', date: '02–12 Oct' },
      { text: 'Dussehra', type: 'holiday', date: '12 Oct' },
      { text: 'Internal Assessment – II', type: 'exam', date: '20 Oct' },
      { text: 'Pre-Exam Preparation Week', type: 'academic', date: '27 Oct' },
    ],
  },
  {
    month: 'November',
    year: 2025,
    shortMonth: 'Nov',
    events: [
      { text: 'Diwali Vacation', type: 'holiday', date: '01–08 Nov' },
      { text: 'University Exam Begins (Odd Sem)', type: 'exam', date: '15 Nov' },
      { text: 'Constitution Day', type: 'event', date: '26 Nov' },
      { text: 'NSS 7-Day Special Camp', type: 'event', date: '20–26 Nov' },
    ],
  },
  {
    month: 'December',
    year: 2025,
    shortMonth: 'Dec',
    events: [
      { text: 'University Exam Continues', type: 'exam', date: '01–10 Dec' },
      { text: 'Even Semester Commences', type: 'academic', date: '15 Dec' },
      { text: 'Christmas Celebration', type: 'holiday', date: '25 Dec' },
      { text: 'Annual Sports Day', type: 'event', date: '20 Dec' },
      { text: 'Winter Break', type: 'holiday', date: '26–31 Dec' },
    ],
  },
  {
    month: 'January',
    year: 2026,
    shortMonth: 'Jan',
    events: [
      { text: 'New Year – College Reopens', type: 'academic', date: '02 Jan' },
      { text: 'Republic Day Flag Hoisting', type: 'holiday', date: '26 Jan' },
      { text: 'Youth Festival & Talent Show', type: 'event', date: '12 Jan' },
      { text: 'Internal Assessment – I (Even)', type: 'exam', date: '20 Jan' },
    ],
  },
  {
    month: 'February',
    year: 2026,
    shortMonth: 'Feb',
    events: [
      { text: 'Annual Day & Cultural Fest', type: 'event', date: '14 Feb' },
      { text: 'Maha Shivaratri', type: 'holiday', date: '17 Feb' },
      { text: 'Women\'s Empowerment Seminar', type: 'event', date: '20 Feb' },
      { text: 'Guest Lecture Series', type: 'academic', date: '25 Feb' },
    ],
  },
  {
    month: 'March',
    year: 2026,
    shortMonth: 'Mar',
    events: [
      { text: 'International Women\'s Day', type: 'event', date: '08 Mar' },
      { text: 'Holi Celebration', type: 'holiday', date: '14 Mar' },
      { text: 'Internal Assessment – II (Even)', type: 'exam', date: '16 Mar' },
      { text: 'Pre-Exam Study Leave Begins', type: 'academic', date: '25 Mar' },
      { text: 'University Exams Begin (Even Sem)', type: 'exam', date: '30 Mar' },
    ],
  },
  {
    month: 'April',
    year: 2026,
    shortMonth: 'Apr',
    events: [
      { text: 'University Examinations Continue', type: 'exam', date: '01–20 Apr' },
      { text: 'Ambedkar Jayanti', type: 'holiday', date: '14 Apr' },
      { text: 'Ram Navami', type: 'holiday', date: '05 Apr' },
      { text: 'Result Declaration', type: 'academic', date: '25 Apr' },
      { text: 'Summer Vacation Begins', type: 'holiday', date: '27 Apr' },
    ],
  },
  {
    month: 'May',
    year: 2026,
    shortMonth: 'May',
    events: [
      { text: 'Summer Vacation Continues', type: 'holiday', date: '01–31 May' },
      { text: 'Alumni Meet & Reunion', type: 'event', date: '10 May' },
      { text: 'New Admission Registration', type: 'academic', date: '15 May' },
      { text: 'Faculty Development Program', type: 'academic', date: '20 May' },
    ],
  },
];

const EXAM_SCHEDULE = [
  { name: 'Internal Assessment I (Odd)', period: 'August 2025', type: 'internal' },
  { name: 'Internal Assessment II (Odd)', period: 'October 2025', type: 'internal' },
  { name: 'University Exam – Odd Semester', period: 'Nov – Dec 2025', type: 'university' },
  { name: 'Internal Assessment I (Even)', period: 'January 2026', type: 'internal' },
  { name: 'Internal Assessment II (Even)', period: 'March 2026', type: 'internal' },
  { name: 'University Exam – Even Semester', period: 'Mar – Apr 2026', type: 'university' },
];

const HOLIDAY_LIST = [
  { name: 'Guru Purnima', date: '10 July 2025' },
  { name: 'Raksha Bandhan', date: '09 August 2025' },
  { name: 'Independence Day', date: '15 August 2025' },
  { name: 'Janmashtami', date: '16 August 2025' },
  { name: 'Gandhi Jayanti', date: '02 October 2025' },
  { name: 'Navratri Break', date: '02–12 October 2025' },
  { name: 'Diwali Vacation', date: '01–08 November 2025' },
  { name: 'Christmas', date: '25 December 2025' },
  { name: 'Republic Day', date: '26 January 2026' },
  { name: 'Maha Shivaratri', date: '17 February 2026' },
  { name: 'Holi', date: '14 March 2026' },
  { name: 'Ram Navami', date: '05 April 2026' },
  { name: 'Ambedkar Jayanti', date: '14 April 2026' },
  { name: 'Summer Vacation', date: '27 Apr – 14 Jun 2026' },
];

/* ═══════════════════════════════════════════════════
   ANIMATION VARIANTS
═══════════════════════════════════════════════════ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

/* ═══════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════ */

export default function YearCalendarPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSemester, setActiveSemester] = useState('odd');
  const sectionRefs = useRef({});

  const EVENT_TYPES = [
    { id: 'all', label: 'All Events', icon: '📋' },
    { id: 'academic', label: 'Academic', icon: '📚' },
    { id: 'exam', label: 'Examinations', icon: '📝' },
    { id: 'event', label: 'Events & Activities', icon: '🎪' },
    { id: 'holiday', label: 'Holidays', icon: '🌿' },
  ];

  const filteredMonths = MONTHS_DATA.map(month => ({
    ...month,
    events: activeFilter === 'all' 
      ? month.events 
      : month.events.filter(e => e.type === activeFilter),
  }));

  const totalEvents = MONTHS_DATA.reduce((acc, m) => acc + m.events.length, 0);
  const totalHolidays = HOLIDAY_LIST.length;
  const totalExams = EXAM_SCHEDULE.length;

  return (
    <>
      <Header />
      <main className={styles.mainWrapper}>
        <ActivityHero
          title="Year Calendar 2025-26"
          subtitle="Complete academic schedule, examination timelines, important dates & holiday roster for the current session"
          bgImage="/assets/banners/college_year_calendar_banner.jpg"
          height="45vh"
          decorative={true}
          breadcrumbs={[
            { label: 'Home', link: '/' },
            { label: 'Activities', link: '/activities' },
            { label: 'Year Calendar' },
          ]}
        />


        {/* Tab Controls Navigation */}
        <section className={styles.tabNavbarSection}>
          <div className={styles.container}>
            <div className={styles.tabNavbar}>
              {EVENT_TYPES.map((type) => (
                <button
                  key={type.id}
                  className={`${styles.tabBtn} ${activeFilter === type.id ? styles.activeTabBtn : ''}`}
                  onClick={() => setActiveFilter(type.id)}
                >
                  {type.icon} {type.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── MONTH-BY-MONTH CALENDAR TIMELINE ── */}
        <section className={styles.calendarSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionPill}>🗓️ Schedule</span>
              <h2 className={styles.sectionTitle}>Academic <span>Timeline</span></h2>
              <p className={styles.sectionSubtitle}>
                Complete breakdown of academic events, examinations, and holidays throughout the year
              </p>
            </div>

            {/* Legend */}
            <div className={styles.legendRow}>
              <span className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.legendAcademic}`}></span>Academic
              </span>
              <span className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.legendExam}`}></span>Exam
              </span>
              <span className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.legendEvent}`}></span>Event
              </span>
              <span className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.legendHoliday}`}></span>Holiday
              </span>
            </div>

            {/* Seasons and Timelines */}
            <div className={styles.seasonsContainer}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  {SEASONS_DATA.map((season, sIdx) => {
                    const seasonMonths = filteredMonths
                      .filter(m => season.months.includes(m.month))
                      .filter(m => activeFilter === 'all' || m.events.length > 0);
                    if (seasonMonths.length === 0) return null;

                    return (
                      <div key={sIdx} className={styles.seasonBlock}>
                        <div className={styles.seasonRow}>
                          {/* Season Visual Column (Minimal distinguished card design, no image) */}
                          <div className={styles.seasonVisualCard} style={{ borderLeftColor: season.accent }}>
                            <div className={styles.seasonMeta}>
                              <span className={styles.seasonHeaderBadge} style={{ color: '#ffffff', backgroundColor: season.accent }}>
                                Academic Term
                              </span>
                              <h3 className={styles.seasonHeaderTitle} style={{ color: season.accent }}>{season.title}</h3>
                              <p className={styles.seasonHeaderDesc}>{season.desc}</p>
                            </div>
                            <div className={styles.seasonPillIndicator} style={{ backgroundColor: `${season.accent}08`, borderColor: `${season.accent}15`, color: season.accent }}>
                              <span className={styles.seasonPillDot} style={{ backgroundColor: season.accent }}></span>
                              {season.months.join(' • ')}
                            </div>
                          </div>

                          {/* Months Grid for this season */}
                          <div className={styles.seasonContent}>
                            <div className={styles.seasonMonthsGrid}>
                              {seasonMonths.map((month) => (
                                <motion.div
                                  key={`${month.month}-${activeFilter}`}
                                  initial={{ opacity: 0, y: 20 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.4 }}
                                  className={styles.monthCardWrapper}
                                >
                                  {/* Month Card */}
                                  <motion.div
                                    className={styles.monthCard}
                                    whileHover={{ y: -8 }}
                                    transition={{ duration: 0.25 }}
                                    layout
                                  >
                                    <div className={styles.monthCardHeader} style={{ borderTop: `4px solid ${season.accent}` }}>
                                      <div className={styles.monthCardTitleWrap}>
                                        <span className={styles.monthCardName}>{month.month}</span>
                                        <span className={styles.monthCardYear}>{month.year}</span>
                                      </div>
                                      <span className={styles.monthCardBadge} style={{ color: season.accent, borderColor: `${season.accent}20`, backgroundColor: `${season.accent}10` }}>
                                        {month.events.length} {month.events.length === 1 ? 'Event' : 'Events'}
                                      </span>
                                    </div>
                                    <div className={styles.monthCardBody}>
                                      {month.events.length > 0 ? (
                                        <ul className={styles.eventList}>
                                          {month.events.map((evt, eIdx) => (
                                            <li key={eIdx} className={`${styles.eventItem} ${styles[`eventType_${evt.type}`]}`}>
                                              <span className={`${styles.eventDateBadge} ${styles[`badgeType_${evt.type}`]}`}>
                                                {evt.date}
                                              </span>
                                              <span className={styles.eventText}>{evt.text}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      ) : (
                                        <div className={styles.noEventsPlaceholder}>
                                          <span className={styles.noEventsIcon}>🌱</span>
                                          <span className={styles.noEventsText}>No events scheduled</span>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ── DOWNLOAD CTA ── */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <motion.div
              className={styles.ctaCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className={styles.ctaContent}>
                <h3 className={styles.ctaTitle}>Download Complete Calendar</h3>
                <p className={styles.ctaText}>
                  Get the full academic calendar {ACADEMIC_YEAR} in PDF format for offline access and print
                </p>
              </div>
              <a
                href="#download"
                onClick={(e) => { e.preventDefault(); alert('Calendar PDF download initiating...'); }}
                className={styles.ctaButton}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PDF
              </a>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
