'use client';

import React from 'react';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import ActivityGrid from '@/components/activities/ActivityGrid/ActivityGrid';
import { motion } from 'framer-motion';
import styles from './page.module.css';

const sportsCategories = [
  { name: 'Kabaddi', img: '/assets/home/hero/1.jpg' },
  { name: 'Kho-Kho', img: '/assets/home/hero/2.jpg' },
  { name: 'Athletics / Track & Field', img: '/assets/home/hero/3.jpg' },
  { name: 'Indoor Games (Chess, Carrom, TT)', img: '/assets/home/hero/4.jpg' },
  { name: 'Cricket', img: '/assets/home/hero/5.jpg' },
  { name: 'Volleyball', img: '/assets/home/hero/1.jpg' }
];

const achievements = [
  {
    title: 'State Level Kabaddi Tournament',
    year: 'Runner Up 2023',
    desc: 'NMC Women\'s Kabaddi team secured second position in the State Inter-College athletics tournament.'
  },
  {
    title: 'District Athletics Championship',
    year: 'Gold Medal 2022',
    desc: 'Outstanding gold run in the women\'s 400m relay sprint, setting a new district collegiate record.'
  },
  {
    title: 'Inter-University Kho-Kho Tournament',
    year: 'Participation 2024',
    desc: 'NMC represented Maharaja Krishnakumarsinhji Bhavnagar University (MKBU) at the national level.'
  }
];

const galleryImages = [
  '/assets/home/hero/1.jpg',
  '/assets/home/hero/2.jpg',
  '/assets/home/hero/3.jpg',
  '/assets/home/hero/4.jpg',
  '/assets/home/hero/5.jpg',
  '/assets/home/hero/1.jpg'
];

export default function SportsPage() {
  return (
    <>
      <Header />
      <main>
        
        <ActivityHero 
          title="Sports Activities" 
          subtitle="Fostering teamwork, discipline, and competitive spirit through college athletics"
          bgImage="/assets/home/hero/1.jpg"
          breadcrumbs={[
            { label: 'Activities', link: '/activities' },
            { label: 'Sports' }
          ]}
        />

        {/* Categories Grid */}
        <section className={styles.sportsSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Sports &amp; Fitness <span>Categories</span></h2>
            
            <div className={styles.grid}>
              {sportsCategories.map((sport, idx) => (
                <motion.div 
                  key={idx} 
                  className={styles.sportCard}
                  style={{ backgroundImage: `url(${sport.img})` }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.gradientOverlay}></div>
                  <div className={styles.sportCardContent}>
                    <h3 className={styles.sportName}>{sport.name}</h3>
                    <span className={styles.viewGalleryText}>View Gallery</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className={styles.achievementsSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle} style={{ textAlign: 'center', marginBottom: '3rem' }}>
              Our Sports <span>Achievements</span>
            </h2>
            
            <div className={styles.achieveGrid}>
              {achievements.map((item, idx) => (
                <div key={idx} className={styles.achieveCard}>
                  <span className={styles.achieveBadge}>🏆 {item.year}</span>
                  <h3 className={styles.achieveCardTitle}>{item.title}</h3>
                  <p className={styles.achieveCardDesc}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sports Gallery */}
        <section className={styles.gallerySection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: '3rem' }}>
              Sports Activities <span style={{ color: 'var(--color-secondary, #F4B000)' }}>Gallery</span>
            </h2>
            <ActivityGrid images={galleryImages} />
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
