'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import ActivityGrid from '@/components/activities/ActivityGrid/ActivityGrid';
import { motion } from 'framer-motion';
import styles from './page.module.css';

// SVG Icons for the 4 NSS activities
const HeartIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const SparklesIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  </svg>
);

const TreeIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
    <path d="M12 22v-5M12 17c-2 0-3-1-3-3s1-3 3-3V7a3 3 0 0 1 6 0v7c2 0 3 1 3 3s-1 3-3 3h-6zM3 14c0-2 1-3 3-3s3 1 3 3v3H3v-3z" />
  </svg>
);

const TentIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5">
    <polygon points="12 2 22 22 2 22 12 2" />
    <polyline points="12 2 12 22" />
  </svg>
);

const nssActivities = [
  {
    title: 'Blood Donation Camp',
    desc: 'Annual blood donation drive in collaboration with Bhavnagar Civil Hospital, supporting critical local stocks.',
    icon: HeartIcon
  },
  {
    title: 'Cleanliness Drive (Swachh Bharat)',
    desc: 'Regular campus and adopted adopted community cleanliness drives organized under the national Swachh Bharat Mission.',
    icon: SparklesIcon
  },
  {
    title: 'Tree Plantation Drive',
    desc: 'Planting indigenous saplings on campus ground borders and adopted villages to promote eco-awareness.',
    icon: TreeIcon
  },
  {
    title: 'Special 7-Day Residential Camp',
    desc: 'Annual 7-day immersive camp in adopted regional villages focusing on adult literacy and basic hygiene seminars.',
    icon: TentIcon
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

export default function NssPage() {
  return (
    <>
      <Header />
      <main>
        
        <ActivityHero 
          title="NSS — National Service Scheme" 
          subtitle="Not Me But You"
          bgImage="/assets/home/hero/3.jpg"
          breadcrumbs={[
            { label: 'Activities', link: '/activities' },
            { label: 'NSS' }
          ]}
        />

        {/* Profile Card */}
        <section className={styles.aboutSection}>
          <div className={styles.container}>
            <div className={styles.profileCard}>
              <div className={styles.profileLeft}>
                <span className={styles.badge}>NSS Unit Overview</span>
                <h2 className={styles.sectionTitle}>Shaping Responsible Citizens</h2>
                <p className={styles.aboutText}>
                  The National Service Scheme (NSS) at Nandkunvarba Mahila College channels youthful energy into structured community development. Since its inception, our unit has worked on healthcare support, environment protection, and literacy campaigns.
                </p>
              </div>

              <div className={styles.profileRight}>
                <div className={styles.statsCard}>
                  <div className={styles.statRow}>
                    <strong>Unit Established: </strong>
                    <span>2009</span>
                  </div>
                  <div className={styles.statRow}>
                    <strong>Total Volunteers: </strong>
                    <span>100+ Enrolled</span>
                  </div>
                  <div className={styles.statRow}>
                    <strong>Coordinator: </strong>
                    <span>Dr. Bhavesh Gohil</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Campaigns Grid */}
        <section className={styles.campaignsSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              NSS Campaigns &amp; Initiatives
            </h2>
            
            <div className={styles.grid}>
              {nssActivities.map((act, idx) => {
                const IconComp = act.icon;
                return (
                  <motion.div 
                    key={idx} 
                    className={styles.campaignCard}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.iconBox}>
                      <IconComp />
                    </div>
                    <h3 className={styles.campaignTitle}>{act.title}</h3>
                    <p className={styles.campaignDesc}>{act.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className={styles.gallerySection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: '3rem' }}>
              NSS Outreach <span style={{ color: 'var(--color-secondary, #F4B000)' }}>Gallery</span>
            </h2>
            <ActivityGrid images={galleryImages} />
          </div>
        </section>

        {/* Join CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Become an NSS Volunteer</h2>
              <p className={styles.ctaText}>
                NSS is open to all first and second-year undergraduate terms. Volunteers completing 240 service hours are awarded University Certificates.
              </p>
              <Link href="/contact" className={styles.joinBtn}>
                Register Interest / Join NSS
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
