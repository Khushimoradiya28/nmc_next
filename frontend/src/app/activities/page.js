'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import ActivityCard from '@/components/activities/ActivityCard/ActivityCard';
import { activitiesData } from '@/data/activitiesData';
import styles from './page.module.css';

// SVGs for the 6 cards
const Card1Icon = ({ color }) => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const Card2Icon = ({ color }) => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <line x1="9" y1="22" x2="9" y2="16" />
    <line x1="15" y1="22" x2="15" y2="16" />
    <line x1="9" y1="16" x2="15" y2="16" />
    <path d="M8 6h8" />
    <path d="M8 10h8" />
  </svg>
);

const Card3Icon = ({ color }) => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const Card4Icon = ({ color }) => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
    <path d="M12 2a5 5 0 0 1 5 5v2H7V7a5 5 0 0 1 5-5z" />
  </svg>
);

const Card5Icon = ({ color }) => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const Card6Icon = ({ color }) => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <circle cx="12" cy="10" r="2" />
    <path d="M8 2v2" />
    <path d="M16 2v2" />
  </svg>
);

const navItems = [
  {
    title: 'By Club',
    desc: '9 department clubs fostering creativity, critical thinking, and leadership.',
    link: '/activities/by-club',
    accent: '#B00000', // --color-primary
    bg: '#FFF0F0',
    icon: Card1Icon
  },
  {
    title: 'By Department',
    desc: 'Department-wise academic seminars, guest presentations, and co-curricular programs.',
    link: '/activities/by-department',
    accent: '#F4B000', // --color-secondary
    bg: '#FFFBEB',
    icon: Card2Icon
  },
  {
    title: 'Orientation Programs',
    desc: 'Welcome workshops and campus integration assemblies for newly enrolled terms.',
    link: '/activities/orientation',
    accent: '#B00000',
    bg: '#FFF0F0',
    icon: Card3Icon
  },
  {
    title: 'Sports & Fitness',
    desc: 'Intra-college athletics, Kho-Kho matches, Kabaddi trials, and indoor board meets.',
    link: '/activities/sports',
    accent: '#F4B000',
    bg: '#FFFBEB',
    icon: Card4Icon
  },
  {
    title: 'College Events & Cultural',
    desc: 'Traditional Navratri garba, annual day stages, and patriotic flag ceremonies.',
    link: '/activities/college-events',
    accent: '#B00000',
    bg: '#FFF0F0',
    icon: Card5Icon
  },
  {
    title: 'NSS & Social Impact',
    desc: 'Cleanliness drives, environmental tree planting, and blood donation campaigns.',
    link: '/activities/nss',
    accent: '#F4B000',
    bg: '#FFFBEB',
    icon: Card6Icon
  }
];

export default function ActivitiesHub() {
  // Show first 3 activities
  const recentActivities = activitiesData.slice(0, 3);

  return (
    <>
      <Header />
      <main>
        
        {/* Reusable Hero banner */}
        <ActivityHero 
          title="Activities" 
          bgImage="/assets/home/hero/2.jpg"
          breadcrumbs={[{ label: 'Activities' }]}
        />

        {/* 6 navigation nodes */}
        <section className={styles.hubSection}>
          <div className={styles.container}>
            <motion.div 
              className={styles.grid}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.08
                  }
                }
              }}
            >
              {navItems.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      show: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href={item.link} className={styles.navCard} style={{ background: item.bg }}>
                      <div className={styles.cardIcon}>
                        <IconComp color={item.accent} />
                      </div>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardDesc}>{item.desc}</p>
                      <span className={styles.cardArrow} style={{ color: item.accent }}>
                        →
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Recent activities section */}
            <div className={styles.recentHeaderRow}>
              <h2 className={styles.sectionTitle}>Recent <span>Activities</span></h2>
              <Link href="/activities/by-club" className={styles.viewAllBtn}>
                View All Activities
              </Link>
            </div>

            <div className={styles.recentGrid}>
              {recentActivities.map((act) => (
                <ActivityCard key={act.id} event={act} />
              ))}
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
