'use client';

import React from 'react';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import { motion } from 'framer-motion';
import styles from './page.module.css';

const events = [
  {
    title: 'Annual Day Celebration',
    category: 'Cultural',
    date: 'February 2026',
    desc: 'Grand annual celebration with cultural performances, prize distribution, and alumni felicitation on the main lawn.',
    bg: '#FFF0F0',
    accent: '#B00000'
  },
  {
    title: 'Navratri Celebration',
    category: 'Cultural',
    date: 'October 2025',
    desc: 'Traditional Garba and Dandiya celebration on campus with students, alumni, and faculty in ethnic attire.',
    bg: '#FFFBEB',
    accent: '#F4B000'
  },
  {
    title: 'Women\'s Day Celebration',
    category: 'Special',
    date: 'March 8, 2026',
    desc: 'Celebrating women achievers with inspiring guest lectures, panels, and an award ceremony honoring student milestones.',
    bg: '#FFF0F0',
    accent: '#B00000'
  },
  {
    title: 'Republic Day Flag Ceremony',
    category: 'National',
    date: 'January 26, 2026',
    desc: 'Flag hoisting ceremony followed by patriotic songs, student march pasts, and social services recognition.',
    bg: '#FFFBEB',
    accent: '#F4B000'
  },
  {
    title: 'Independence Day',
    category: 'National',
    date: 'August 15, 2025',
    desc: 'Patriotic celebrations on campus featuring flag hoisting, faculty speeches, and special NSS drill showcases.',
    bg: '#FFF0F0',
    accent: '#B00000'
  },
  {
    title: 'Teacher\'s Day Assemblies',
    category: 'Special',
    date: 'September 5, 2025',
    desc: 'Students coordinate academic sessions, celebrating their teachers with heartfelt stage programs and cards.',
    bg: '#FFFBEB',
    accent: '#F4B000'
  }
];

export default function CollegeEventsPage() {
  return (
    <>
      <Header />
      <main>
        
        <ActivityHero 
          title="College Events" 
          subtitle="Relive the cultural highlights, national festivals, and annual day celebrations at NMC"
          bgImage="/assets/home/hero/4.jpg"
          breadcrumbs={[
            { label: 'Activities', link: '/activities' },
            { label: 'College Events' }
          ]}
        />

        {/* Timeline List */}
        <section className={styles.timelineSection}>
          <div className={styles.container}>
            <div className={styles.timelineContainer}>
              
              {events.map((event, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div key={idx} className={`${styles.timelineRow} ${isEven ? styles.rowNormal : styles.rowReverse}`}>
                    
                    {/* Left/Right Text Card */}
                    <motion.div 
                      className={styles.contentBlock}
                      style={{ borderLeftColor: event.accent }}
                      initial={{ opacity: 0, x: isEven ? -45 : 45 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className={styles.cardHeader}>
                        <span className={styles.eventDate}>{event.date}</span>
                        <span className={styles.eventCat} style={{ background: event.bg, color: event.accent }}>
                          {event.category}
                        </span>
                      </div>
                      <h3 className={styles.eventTitle}>{event.title}</h3>
                      <p className={styles.eventDesc}>{event.desc}</p>
                    </motion.div>

                    {/* Timeline Dot Node marker */}
                    <div className={styles.timelineNode}>
                      <span className={styles.nodeCircle} style={{ background: event.accent }}></span>
                    </div>

                    {/* Spacer block */}
                    <div className={styles.spacerBlock}></div>

                  </div>
                );
              })}

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
