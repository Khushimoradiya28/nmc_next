'use client';

import React from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import ActivityGrid from '@/components/activities/ActivityGrid/ActivityGrid';
import ActivityCard from '@/components/activities/ActivityCard/ActivityCard';
import styles from './ClubDetailTemplate.module.css';

export default function ClubDetailTemplate({ 
  clubName, 
  dept, 
  aboutText, 
  founded = '2015', 
  memberCount = '120+', 
  coordinator = 'Dr. Nehal Shah', 
  galleryImages = [],
  upcomingEvents = []
}) {
  return (
    <>
      <Header />
      <main>
        
        {/* Banner */}
        <ActivityHero 
          title={clubName}
          subtitle={`Department Club of ${dept}`}
          bgImage="/assets/home/hero/4.jpg"
          breadcrumbs={[
            { label: 'Activities', link: '/activities' },
            { label: 'By Club', link: '/activities/by-club' },
            { label: clubName }
          ]}
        />

        {/* About Club Section */}
        <section className={styles.aboutSection}>
          <div className={styles.container}>
            <div className={styles.twoCol}>
              
              <div className={styles.leftCol}>
                <span className={styles.preTitle}>Overview</span>
                <h2 className={styles.sectionTitle}>{clubName} <span>Profile</span></h2>
                <p className={styles.descText}>{aboutText}</p>
                
                {/* Stats list */}
                <div className={styles.statsGrid}>
                  <div className={styles.statBox}>
                    <span className={styles.statVal}>{founded}</span>
                    <span className={styles.statLabel}>Founded Year</span>
                  </div>
                  <div className={styles.statBox}>
                    <span className={styles.statVal}>{memberCount}</span>
                    <span className={styles.statLabel}>Active Members</span>
                  </div>
                  <div className={styles.statBox}>
                    <span className={styles.statVal}>Active</span>
                    <span className={styles.statLabel}>Status</span>
                  </div>
                </div>

                <div className={styles.coordBox}>
                  <strong>Faculty Coordinator: </strong>
                  <span>{coordinator}</span>
                </div>
              </div>

              <div className={styles.rightCol}>
                <div className={styles.imgCard}>
                  <Image 
                    src="/assets/home/hero/1.jpg" 
                    alt={clubName} 
                    width={500} 
                    height={350} 
                    className={styles.aboutImg}
                  />
                  <div className={styles.imgGlow}></div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Gallery Section */}
        {galleryImages.length > 0 && (
          <section className={styles.gallerySection}>
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                  Activities <span>Gallery</span>
                </h2>
              </div>
              <ActivityGrid images={galleryImages} />
            </div>
          </section>
        )}

        {/* Upcoming events section */}
        <section className={styles.eventsSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: '2.5rem' }}>Upcoming <span>Activities</span></h2>
            {upcomingEvents.length > 0 ? (
              <div className={styles.eventGrid}>
                {upcomingEvents.map((event) => (
                  <ActivityCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className={styles.noEventsCard}>
                <span className={styles.noEventsIcon}>📅</span>
                <h3 className={styles.noEventsTitle}>All Scheduled Sessions Completed</h3>
                <p className={styles.noEventsDesc}>
                  Our student panels are presently planning mock workshops, role plays, and guest panels. Stay tuned for upcoming updates!
                </p>
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
