'use client';

import React from 'react';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import ActivityCard from '@/components/activities/ActivityCard/ActivityCard';
import { getEventsBySubCategory } from '@/data/activitiesData';
import styles from './DeptDetailTemplate.module.css';

export default function DeptDetailTemplate({ deptKey, deptName }) {
  // Fetch department activities
  const events = getEventsBySubCategory('department', deptKey);

  return (
    <>
      <Header />
      <main>
        
        {/* Banner */}
        <ActivityHero 
          title={`Activities of ${deptName}`}
          subtitle={`Explore academic achievements, workshops, and milestones from ${deptName}`}
          bgImage="/assets/home/hero/2.jpg"
          breadcrumbs={[
            { label: 'Activities', link: '/activities' },
            { label: 'By Department', link: '/activities/by-department' },
            { label: deptName }
          ]}
        />

        {/* List Section */}
        <section className={styles.listSection}>
          <div className={styles.container}>
            {events.length > 0 ? (
              <div className={styles.grid}>
                {events.map((event) => (
                  <ActivityCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              /* Fallback count widget */
              <div className={styles.upcomingBanner}>
                <span className={styles.bannerBadge}>Upcoming Event Showcase</span>
                <h3 className={styles.bannerTitle}>{deptName} Activities Coming Soon</h3>
                <p className={styles.bannerDesc}>
                  Our academic committees are currently formulating workshops, guest lectures, and practical role-plays for the upcoming session. Register below to be notified!
                </p>
                
                <div className={styles.countdownGrid}>
                  <div className={styles.countdownItem}>
                    <span className={styles.numVal}>28</span>
                    <span className={styles.lblVal}>Days</span>
                  </div>
                  <div className={styles.countdownItem}>
                    <span className={styles.numVal}>10</span>
                    <span className={styles.lblVal}>Hours</span>
                  </div>
                  <div className={styles.countdownItem}>
                    <span className={styles.numVal}>15</span>
                    <span className={styles.lblVal}>Min</span>
                  </div>
                </div>

                <button className={styles.registerBtn} onClick={() => alert("Registered! We will notify you once new events launch.")}>
                  Get Notified / Register
                </button>
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
