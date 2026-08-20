"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './ActivitiesCenter.module.css';

const milestonesData = [
  { date: "June 15, 2026", event: "New Academic Term Registration & Orientation", type: "academic" },
  { date: "July 01, 2026", event: "Regular Classes Begin (Odd Semesters)", type: "academic" },
  { date: "August 15, 2026", event: "Independence Day Celebrations & NSS Events", type: "event" },
  { date: "September 05, 2026", event: "Teachers' Day & Cultural Assemblies", type: "event" },
  { date: "October 18-28, 2026", event: "Navratri & Diwali Term Vacations", type: "holiday" },
  { date: "November 10, 2026", event: "Internal Assessments & Practical Labs Review", type: "exam" },
  { date: "December 01, 2026", event: "Odd Semester University Examinations", type: "exam" }
];

const shiftsData = [
  { stream: "B.C.A. (Computer Applications)", shift: "Morning Shift", time: "07:30 AM – 12:30 PM", labs: "01:00 PM – 03:00 PM" },
  { stream: "B.B.A. (Business Administration)", shift: "Morning Shift", time: "07:30 AM – 12:30 PM", labs: "No Regular Labs" },
  { stream: "B.Com (Commerce & Banking)", shift: "Morning Shift", time: "08:00 AM – 01:00 PM", labs: "Tally Lab Shifts" },
  { stream: "B.A. (Bachelor of Arts)", shift: "Morning Shift", time: "08:00 AM – 01:00 PM", labs: "No Regular Labs" },
  { stream: "M.S.W. (Master of Social Work)", shift: "Afternoon Shift", time: "12:30 PM – 05:30 PM", labs: "Fieldwork Led" }
];

const examsData = [
  { term: "Internal Exams (All UG/PG)", duration: "October 12 – 16, 2026", type: "Written Test (30 Marks)" },
  { term: "Practical Labs Exams", duration: "November 15 – 20, 2026", type: "Vivad / Project Review" },
  { term: "MKBU University Exam (Odd)", duration: "December 01 – 20, 2026", type: "External Assessment" },
  { term: "Internal Exams (Even)", duration: "March 15 – 20, 2027", type: "Written Test (30 Marks)" },
  { term: "MKBU University Exam (Even)", duration: "April 15 – May 10, 2027", type: "External Assessment" }
];

const holidaysData = [
  { date: "August 15, 2026", label: "Independence Day" },
  { date: "September 04, 2026", label: "Janmashtami Festival" },
  { date: "October 02, 2026", label: "Gandhi Jayanti" },
  { date: "Oct 19 – Nov 03, 2026", label: "Diwali Vacations (15 Days)" },
  { date: "January 26, 2027", label: "Republic Day Celebrations" },
  { date: "March 10, 2027", label: "Holi Festival" }
];

// Interactive Monthly Calendar Dates (August 2026)
const calendarDays = [
  { num: 26, isCurrentMonth: false }, { num: 27, isCurrentMonth: false }, { num: 28, isCurrentMonth: false }, { num: 29, isCurrentMonth: false }, { num: 30, isCurrentMonth: false }, { num: 31, isCurrentMonth: false },
  { num: 1, isCurrentMonth: true }, { num: 2, isCurrentMonth: true }, { num: 3, isCurrentMonth: true }, { num: 4, isCurrentMonth: true }, { num: 5, isCurrentMonth: true }, { num: 6, isCurrentMonth: true }, { num: 7, isCurrentMonth: true },
  { num: 8, isCurrentMonth: true }, { num: 9, isCurrentMonth: true }, { num: 10, isCurrentMonth: true }, { num: 11, isCurrentMonth: true }, { num: 12, isCurrentMonth: true }, { num: 13, isCurrentMonth: true }, { num: 14, isCurrentMonth: true },
  { num: 15, isCurrentMonth: true, isEvent: true, label: "Independence Day & Flag Hoisting" }, { num: 16, isCurrentMonth: true }, { num: 17, isCurrentMonth: true }, { num: 18, isCurrentMonth: true }, { num: 19, isCurrentMonth: true }, { num: 20, isCurrentMonth: true }, { num: 21, isCurrentMonth: true },
  { num: 22, isCurrentMonth: true }, { num: 23, isCurrentMonth: true }, { num: 24, isCurrentMonth: true }, { num: 25, isCurrentMonth: true }, { num: 26, isCurrentMonth: true }, { num: 27, isCurrentMonth: true }, { num: 28, isCurrentMonth: true },
  { num: 29, isCurrentMonth: true }, { num: 30, isCurrentMonth: true }, { num: 31, isCurrentMonth: true }
];

export default function ActivitiesCenter() {
  const [activeTab, setActiveTab] = useState('milestones');
  const [selectedDayEvent, setSelectedDayEvent] = useState({
    date: "August 15, 2026",
    title: "Independence Day & Flag Hoisting",
    details: "Mandatory attendance for all NSS volunteers. Flag hoisting at Shivaji Circle ground starting 08:00 AM."
  });

  const handleDateClick = (day) => {
    if (day.isEvent) {
      setSelectedDayEvent({
        date: `August ${day.num}, 2026`,
        title: day.label,
        details: "Special celebration assemblies scheduled at the Main Auditorium."
      });
    } else {
      setSelectedDayEvent({
        date: `August ${day.num}, 2026`,
        title: "Regular Academic Schedule",
        details: "Regular classes, computer practical labs, and faculty mentoring sessions as per shift."
      });
    }
  };

  return (
    <>
      {/* 1. Hero banner */}
      <section className={styles.heroSection}>
        <div className={styles.heroBgImage}>
          <Image 
            src="/assets/shared/misc/4.jpg" 
            alt="Activities Banner" 
            fill
            priority
            sizes="100vw"
            className={styles.heroBgImg}
          />
        </div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Academic Command Center</h1>
          </div>
        </div>
      </section>

      {/* 2. Command Center Section */}
      <section className={styles.commandSection}>
        <div className={styles.container}>
          
          {/* Quick status download ribbon */}
          <div className={styles.statusRibbon}>
            <div className={styles.ribbonLeft}>
              <span className={styles.statusPulse}></span>
              <span><strong>Academic Session 2026-27 Active</strong> Affiliated to MKBU</span>
            </div>
            <a href="#download" className={styles.downloadLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>Download Full PDF Calendar</span>
            </a>
          </div>

          {/* Switcher Filter Tabs */}
          <div className={styles.tabsBar}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'milestones' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('milestones')}
            >
              Semester Milestones
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'timetable' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('timetable')}
            >
              Daily Shift Timetable
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'exams' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('exams')}
            >
              Exams &amp; Assessments
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'holidays' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('holidays')}
            >
              Holidays &amp; Breaks
            </button>
          </div>

          {/* Main 2-Column Command Center Architecture */}
          <div className={styles.gridContainer}>
            
            {/* Left: Dynamic Interactive Tab Content */}
            <div className={styles.contentCard}>
              
              {activeTab === 'milestones' && (
                <div>
                  <h3 className={styles.cardTitle}>Upcoming Semester Milestones</h3>
                  <div className={styles.milestonesList}>
                    {milestonesData.map((item, idx) => (
                      <div key={idx} className={styles.milestoneItem}>
                        <div className={styles.milestoneMeta}>
                          <span className={styles.milestoneDate}>{item.date}</span>
                          <span className={`${styles.typeBadge} ${styles[item.type]}`}>{item.type}</span>
                        </div>
                        <p className={styles.milestoneText}>{item.event}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'timetable' && (
                <div>
                  <h3 className={styles.cardTitle}>Daily Stream Shift Schedules</h3>
                  <div className={styles.tableResponsive}>
                    <table className={styles.scheduleTable}>
                      <thead>
                        <tr>
                          <th>Academic Stream</th>
                          <th>Lecture Shift</th>
                          <th>Lecture Timing</th>
                          <th>Lab Schedule</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shiftsData.map((item, idx) => (
                          <tr key={idx}>
                            <td><strong>{item.stream}</strong></td>
                            <td><span className={styles.shiftBadge}>{item.shift}</span></td>
                            <td>{item.time}</td>
                            <td style={{ color: 'var(--red-800)', fontWeight: 700 }}>{item.labs}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'exams' && (
                <div>
                  <h3 className={styles.cardTitle}>Exams &amp; Assessments Schedule</h3>
                  <div className={styles.milestonesList}>
                    {examsData.map((item, idx) => (
                      <div key={idx} className={styles.milestoneItem}>
                        <div className={styles.milestoneMeta}>
                          <span className={styles.milestoneDate}>{item.duration}</span>
                          <span className={`${styles.typeBadge} ${styles.exam}`}>{item.type}</span>
                        </div>
                        <p className={styles.milestoneText}>{item.term}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'holidays' && (
                <div>
                  <h3 className={styles.cardTitle}>Academic Holiday Term Lists</h3>
                  <div className={styles.holidaysGrid}>
                    {holidaysData.map((item, idx) => (
                      <div key={idx} className={styles.holidayCard}>
                        <span className={styles.holidayDate}>{item.date}</span>
                        <h4 className={styles.holidayLabel}>{item.label}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right: Interactive Month Calendar Mini-Matrix Widget */}
            <div className={styles.calendarCard}>
              <div className={styles.calendarHeader}>
                <h4>August 2026</h4>
                <div className={styles.calendarNav}>
                  <span>◀</span>
                  <span>▶</span>
                </div>
              </div>

              {/* Days Row */}
              <div className={styles.daysHeader}>
                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              </div>

              {/* Dates Grid */}
              <div className={styles.datesGrid}>
                {calendarDays.map((day, idx) => (
                  <button
                    key={idx}
                    className={`${styles.dateBtn} ${!day.isCurrentMonth ? styles.otherMonth : ''} ${day.isEvent ? styles.eventDay : ''}`}
                    onClick={() => handleDateClick(day)}
                  >
                    {day.num}
                  </button>
                ))}
              </div>

              {/* Selected Event Snapshot */}
              <div className={styles.eventSnapshot}>
                <div className={styles.snapshotHeader}>
                  <span className={styles.snapshotPulse}></span>
                  <strong className={styles.snapshotDate}>{selectedDayEvent.date}</strong>
                </div>
                <h4 className={styles.snapshotTitle}>{selectedDayEvent.title}</h4>
                <p className={styles.snapshotDesc}>{selectedDayEvent.details}</p>
              </div>

            </div>

          </div>

        </div>
      </section>
    </>
  );
}
