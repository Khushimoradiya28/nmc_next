'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { animateSlide, animateStagger, animateFade } from '@/lib/animations/helpers';
import styles from './YearCalendar.module.css';

/**
 * Academic Year Calendar Section
 * Premium editorial layout showcasing academic calendar highlights,
 * exam schedule, and important dates for the current session.
 * Data can be updated via CMS in the future.
 */

const SEMESTER_DATA = [
  {
    id: 'odd',
    label: 'Odd Semester',
    period: 'June – November',
    exams: [
      'UG Sem 1, 3, 5',
      'PG Sem 1, 3'
    ]
  },
  {
    id: 'even',
    label: 'Even Semester',
    period: 'December – May',
    exams: [
      'UG Sem 2, 4, 6',
      'PG Sem 2, 4'
    ]
  }
];

const KEY_DATES = [
  { month: 'Jun', event: 'New Session Begins' },
  { month: 'Aug', event: 'Independence Day' },
  { month: 'Sep', event: 'Janmashtami' },
  { month: 'Oct', event: 'Navratri Vacation' },
  { month: 'Oct', event: 'Gandhi Jayanti' },
  { month: 'Nov', event: 'Diwali Vacation' },
  { month: 'Jan', event: 'Republic Day' },
  { month: 'Mar', event: 'Annual Exam Begins' },
];

const YearCalendar = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const descRef = useRef(null);
  const semestersRef = useRef(null);
  const timelineRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const scrollOptions = {
      trigger: sectionRef.current,
      start: 'top 80%',
      toggleActions: 'play none none none'
    };

    if (headingRef.current) {
      animateSlide(headingRef.current, {
        direction: 'up',
        distance: 25,
        duration: 0.6,
        scrollOptions
      });
    }

    if (descRef.current) {
      animateSlide(descRef.current, {
        direction: 'up',
        distance: 20,
        duration: 0.6,
        delay: 0.12,
        scrollOptions
      });
    }

    if (semestersRef.current) {
      const cards = semestersRef.current.querySelectorAll('[data-semester]');
      if (cards.length > 0) {
        animateStagger(cards, {
          direction: 'up',
          distance: 25,
          duration: 0.55,
          stagger: 0.12,
          delay: 0.2,
          scrollOptions
        });
      }
    }

    if (timelineRef.current) {
      const items = timelineRef.current.querySelectorAll('[data-date]');
      if (items.length > 0) {
        animateStagger(items, {
          direction: 'up',
          distance: 18,
          duration: 0.45,
          stagger: 0.06,
          delay: 0.35,
          scrollOptions
        });
      }
    }

    if (ctaRef.current) {
      animateFade(ctaRef.current, {
        duration: 0.6,
        delay: 0.6,
        scrollOptions
      });
    }
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="year-calendar-heading">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.labelTag}>
            <span className={styles.labelIcon} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
            <span className={styles.labelText}>Academic Schedule</span>
          </div>
          <h2 ref={headingRef} id="year-calendar-heading" className={styles.heading}>
            Year Calendar
          </h2>
          <p ref={descRef} className={styles.description}>
            The academic year at Nandkunvarba Mahila College follows a semester system affiliated to M K Bhavnagar University, with structured schedules for lectures, examinations, and vacations.
          </p>
        </div>

        {/* Semester Cards */}
        <div ref={semestersRef} className={styles.semesters}>
          {SEMESTER_DATA.map((sem) => (
            <div key={sem.id} className={styles.semesterCard} data-semester>
              <div className={styles.semesterHeader}>
                <span className={styles.semesterBadge}>{sem.label}</span>
                <span className={styles.semesterPeriod}>{sem.period}</span>
              </div>
              <div className={styles.semesterBody}>
                <span className={styles.examLabel}>University Examinations</span>
                <ul className={styles.examList}>
                  {sem.exams.map((exam) => (
                    <li key={exam} className={styles.examItem}>{exam}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Important Dates Timeline */}
        <div className={styles.timelineSection}>
          <h3 className={styles.timelineTitle}>Important Dates</h3>
          <div ref={timelineRef} className={styles.timeline}>
            {KEY_DATES.map((item, index) => (
              <div key={index} className={styles.timelineItem} data-date>
                <span className={styles.timelineMonth}>{item.month}</span>
                <span className={styles.timelineDot} aria-hidden="true" />
                <span className={styles.timelineEvent}>{item.event}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div ref={ctaRef} className={styles.ctaRow}>
          <Link href={ROUTES.DOWNLOADS || '/downloads'} className={styles.ctaLink}>
            Download Full Academic Calendar
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default YearCalendar;
