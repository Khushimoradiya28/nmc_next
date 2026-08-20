'use client';

import React from 'react';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import ActivityCard from '@/components/activities/ActivityCard/ActivityCard';
import { getEventsBySubCategory } from '@/data/activitiesData';
import styles from './OrientationDetailTemplate.module.css';

export default function OrientationDetailTemplate({ orientationKey, deptName }) {
  // Fetch specific orientation events
  const events = getEventsBySubCategory('orientation', orientationKey);

  return (
    <>
      <Header />
      <main>
        
        {/* Banner */}
        <ActivityHero 
          title={`${deptName} Orientation`}
          subtitle={`Transition smoothly from school to professional academic milestones at NMC`}
          bgImage="/assets/home/hero/1.jpg"
          breadcrumbs={[
            { label: 'Activities', link: '/activities' },
            { label: 'Orientation Programs', link: '/activities/orientation' },
            { label: `${deptName} Orientation` }
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
                <h3 className={styles.bannerTitle}>{deptName} Orientation Launching Soon</h3>
                <p className={styles.bannerDesc}>
                  Our senior faculty panels are planning motivational, stream-oriented briefings for newly admitted batches. Register below to be notified on terms commencement dates!
                </p>
                
                <div className={styles.countdownGrid}>
                  <div className={styles.countdownItem}>
                    <span className={styles.numVal}>10</span>
                    <span className={styles.lblVal}>Days</span>
                  </div>
                  <div className={styles.countdownItem}>
                    <span className={styles.numVal}>05</span>
                    <span className={styles.lblVal}>Hours</span>
                  </div>
                  <div className={styles.countdownItem}>
                    <span className={styles.numVal}>20</span>
                    <span className={styles.lblVal}>Min</span>
                  </div>
                </div>

                <button className={styles.registerBtn} onClick={() => alert("Registered! We will notify you once orientation dates are finalized.")}>
                  Get Notified
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
