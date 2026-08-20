'use client';

import React from 'react';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import styles from './page.module.css';

const monthsData = [
  {
    name: 'June 2025',
    events: [
      { text: 'College Reopens', type: 'holiday' }, // Green = holiday/commencement
      { text: 'Admission Process Starts', type: 'event' } // Yellow = event
    ]
  },
  {
    name: 'July 2025',
    events: [
      { text: 'Orientation Programs', type: 'event' },
      { text: 'Fresher\'s Party', type: 'event' }
    ]
  },
  {
    name: 'August 2025',
    events: [
      { text: 'Independence Day', type: 'holiday' },
      { text: 'Sports Team Trials', type: 'event' }
    ]
  },
  {
    name: 'September 2025',
    events: [
      { text: 'Teacher\'s Day Celebration', type: 'event' },
      { text: 'Internal Exams', type: 'exam' } // Red = exam
    ]
  },
  {
    name: 'October 2025',
    events: [
      { text: 'Navratri Garba Stage', type: 'event' },
      { text: 'Diwali Term Break', type: 'holiday' }
    ]
  },
  {
    name: 'November 2025',
    events: [
      { text: 'Cultural Festival Prep', type: 'event' },
      { text: 'NSS Special Camp', type: 'event' }
    ]
  },
  {
    name: 'December 2025',
    events: [
      { text: 'Annual Sports Day', type: 'event' },
      { text: 'Winter Vacation', type: 'holiday' }
    ]
  },
  {
    name: 'January 2026',
    events: [
      { text: 'Republic Day Flagging', type: 'holiday' },
      { text: 'Semester Exams Begin', type: 'exam' }
    ]
  },
  {
    name: 'February 2026',
    events: [
      { text: 'Annual Day Function', type: 'event' },
      { text: 'Main Examination Period', type: 'exam' }
    ]
  },
  {
    name: 'March 2026',
    events: [
      { text: 'Women\'s Day Panel', type: 'event' },
      { text: 'Semester End Exams', type: 'exam' }
    ]
  },
  {
    name: 'April 2026',
    events: [
      { text: 'Result Declaration', type: 'event' },
      { text: 'Summer Break Starts', type: 'holiday' }
    ]
  },
  {
    name: 'May 2026',
    events: [
      { text: 'Annual Alumni Meet', type: 'event' },
      { text: 'Admission Registration', type: 'event' }
    ]
  }
];

export default function YearCalendarPage() {
  return (
    <>
      <Header />
      <main>
        
        <ActivityHero 
          title="Year Calendar 2025-26" 
          subtitle="Annual academic schedules, examination timelines, and holiday rosters"
          bgImage="/assets/home/hero/5.jpg"
          breadcrumbs={[
            { label: 'Activities', link: '/activities' },
            { label: 'Year Calendar' }
          ]}
        />

        {/* Calendar Section */}
        <section className={styles.calendarSection}>
          <div className={styles.container}>
            
            {/* Download PDF ribbon */}
            <div className={styles.downloadRibbon}>
              <div className={styles.legend}>
                <span className={styles.legendItem}><span className={`${styles.dot} ${styles.exam}`}></span>Exam</span>
                <span className={styles.legendItem}><span className={`${styles.dot} ${styles.event}`}></span>Event</span>
                <span className={styles.legendItem}><span className={`${styles.dot} ${styles.holiday}`}></span>Holiday / Open</span>
              </div>
              
              <a 
                href="#download-calendar" 
                onClick={(e) => { e.preventDefault(); alert("Calendar PDF download initiating..."); }} 
                className={styles.downloadBtn}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PDF Calendar
              </a>
            </div>

            {/* Grid */}
            <div className={styles.grid}>
              {monthsData.map((month, idx) => (
                <div key={idx} className={styles.monthCard}>
                  <div className={styles.monthHeader}>
                    <h3>{month.name}</h3>
                  </div>
                  <div className={styles.monthBody}>
                    <ul className={styles.eventList}>
                      {month.events.map((evt, eIdx) => (
                        <li key={eIdx} className={`${styles.eventItem} ${styles[evt.type]}`}>
                          {evt.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
