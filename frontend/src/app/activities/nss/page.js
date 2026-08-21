'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import ActivityGrid from '@/components/activities/ActivityGrid/ActivityGrid';
import styles from './page.module.css';

// ── NSS Events Data (from actual site) ──
const nssEvents = [
  {
    id: 'soft-skill-seminar-2025',
    title: 'Soft Skill Seminar',
    description: 'Soft Skill Seminar organized by NSS Unit and M.Com Department. Guest speaker session focusing on professional communication, leadership qualities, and personality development for students.',
    organizers: 'NSS Unit and M.Com Department',
    date: '2025-07-26',
    time: '09:00 AM to 12:00 PM',
    status: 'upcoming',
    category: 'seminar',
    image: '/assets/home/hero/1.jpg'
  },
  {
    id: 'soft-skill-seminar-2024',
    title: 'Soft Skill Seminar',
    description: 'A Soft skill seminar was organized by NSS unit of Nandakuvarba Mahila College. In which, Shri D. M. Solanki, Regional Commissioner, Municipalities guided students on essential life skills and career preparedness.',
    organizers: 'NSS Unit',
    date: '2024-07-31',
    time: '08:00 AM to 12:00 PM',
    status: 'past',
    category: 'seminar',
    image: '/assets/home/hero/2.jpg'
  },
  {
    id: 'soft-skill-seminar-2023',
    title: 'Soft Skill Seminar',
    description: 'A Soft skill seminar was organized by NSS unit of Nandakuvarba Mahila College. In which Bhavnagar Municipal Commissioner Shri N.V. Upadhyay (IAS) shared insights on governance and public service.',
    organizers: 'NSS Unit',
    date: '2023-07-22',
    time: 'Full Day',
    status: 'past',
    category: 'seminar',
    image: '/assets/home/hero/3.jpg'
  },
  {
    id: 'matruvandana-2022',
    title: 'Matruvandana Program',
    description: 'On 13th July, 2022, Nandkunvarba Mahila College NSS Unit organized "Matruvandana Program" with the warm wishes of Guru Purnima. Our purpose behind this event was to honor and express gratitude towards mothers and maternal figures.',
    organizers: 'NSS Unit',
    date: '2022-07-13',
    time: 'Full Day',
    status: 'past',
    category: 'cultural',
    image: '/assets/home/hero/4.jpg'
  },
  {
    id: 'softskill-seminar-2022',
    title: 'Soft Skill Seminar',
    description: 'On 15/07/2022, a "Soft-Skill Seminar" was organized in Nandkunvarba Mahila College. This event was whole day long and was held in the Yashwantray Auditorium with expert speakers and interactive sessions.',
    organizers: 'NSS Unit',
    date: '2022-07-15',
    time: 'Full Day',
    status: 'past',
    category: 'seminar',
    image: '/assets/home/hero/5.jpg'
  },
  {
    id: 'matruvandana-2019',
    title: 'Matruvandana Program',
    description: 'On 16th July, 2019, Nandkunvarba Mahila College NSS Unit organized "Matruvandana Program" with the warm wishes of Guru Purnima. A heartfelt celebration honoring motherhood and expressing collective gratitude.',
    organizers: 'NSS Unit',
    date: '2019-07-16',
    time: 'Full Day',
    status: 'past',
    category: 'cultural',
    image: '/assets/home/hero/1.jpg'
  },
  {
    id: 'soft-skill-seminar-2019',
    title: 'Soft Skill Seminar',
    description: 'On 12/07/2019, a "Soft-Skill Seminar" was organized in Nandkunvarba Mahila College. This event was whole day long and was held in the Yashwantray Auditorium featuring industry professionals.',
    organizers: 'NSS Unit',
    date: '2019-07-12',
    time: 'Full Day',
    status: 'past',
    category: 'seminar',
    image: '/assets/home/hero/2.jpg'
  }
];

// ── NSS Core Initiatives ──
const nssInitiatives = [
  {
    title: 'Blood Donation Camp',
    description: 'Annual blood donation drives in collaboration with Bhavnagar Civil Hospital and Red Cross, supporting critical community health infrastructure.',
    icon: 'heart',
    color: '#ef4444'
  },
  {
    title: 'Swachh Bharat Abhiyan',
    description: 'Regular cleanliness campaigns across campus and adopted communities under the national Swachh Bharat Mission.',
    icon: 'sparkles',
    color: '#f59e0b'
  },
  {
    title: 'Tree Plantation Drive',
    description: 'Planting indigenous saplings on campus and in adopted villages to promote environmental awareness and sustainability.',
    icon: 'tree',
    color: '#10b981'
  },
  {
    title: '7-Day Residential Camp',
    description: 'Annual immersive camps in adopted villages focusing on adult literacy, hygiene education, and community welfare programs.',
    icon: 'camp',
    color: '#3b82f6'
  },
  {
    title: 'Soft Skill Development',
    description: 'Regular seminars with government officials and industry experts focusing on communication, leadership, and career readiness.',
    icon: 'star',
    color: '#8b5cf6'
  },
  {
    title: 'Matruvandana Program',
    description: 'Annual celebration honoring motherhood on Guru Purnima, expressing collective gratitude and fostering cultural values.',
    icon: 'flower',
    color: '#ec4899'
  }
];

// ── Stats ──
const nssStats = [
  { label: 'Years Active', value: '15+', icon: 'calendar' },
  { label: 'Volunteers', value: '100+', icon: 'users' },
  { label: 'Events Organized', value: '50+', icon: 'events' },
  { label: 'Lives Impacted', value: '5000+', icon: 'impact' }
];

// ── Gallery ──
const galleryImages = [
  '/assets/home/hero/1.jpg',
  '/assets/home/hero/2.jpg',
  '/assets/home/hero/3.jpg',
  '/assets/home/hero/4.jpg',
  '/assets/home/hero/5.jpg',
  '/assets/home/hero/1.jpg'
];

// ── Icon Components ──
const IconHeart = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const IconSparkles = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  </svg>
);

const IconTree = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 22v-2"/>
    <path d="M7 22v-2"/>
    <path d="M12 22V11"/>
    <path d="M12 11C14.5 11 17 9.5 17 7c0-2-1.5-4-5-4S7 5 7 7c0 2.5 2.5 4 5 4Z"/>
  </svg>
);

const IconCamp = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 20h18"/>
    <path d="M12 4l8 16H4L12 4z"/>
    <path d="M12 4v16"/>
  </svg>
);

const IconStar = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconFlower = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const iconMap = {
  heart: IconHeart,
  sparkles: IconSparkles,
  tree: IconTree,
  camp: IconCamp,
  star: IconStar,
  flower: IconFlower
};

// ── Animation Variants ──
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

export default function NssPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedEvent, setExpandedEvent] = useState(null);

  const filteredEvents = activeFilter === 'all' 
    ? nssEvents 
    : nssEvents.filter(e => e.category === activeFilter);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getYear = (dateStr) => {
    return new Date(dateStr).getFullYear();
  };

  return (
    <>
      <Header />
      <main>
        
        {/* Hero Section */}
        <ActivityHero 
          title="NSS — National Service Scheme" 
          subtitle="Not Me But You"
          bgImage="/assets/home/hero/3.jpg"
          height="50vh"
          decorative={true}
          breadcrumbs={[
            { label: 'Activities', link: '/activities' },
            { label: 'NSS' }
          ]}
        />

        {/* ── About / Profile Section ── */}
        <section className={styles.aboutSection}>
          <div className={styles.container}>
            <motion.div 
              className={styles.aboutGrid}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={staggerContainer}
            >
              {/* Left Content */}
              <motion.div className={styles.aboutContent} variants={fadeInUp} transition={{ duration: 0.6 }}>
                <span className={styles.badge}>NSS Unit</span>
                <h2 className={styles.sectionTitle}>
                  Shaping Responsible <span className={styles.highlight}>Citizens</span>
                </h2>
                <p className={styles.aboutText}>
                  The National Service Scheme (NSS) at Nandkunvarba Mahila College channels youthful energy 
                  into structured community development. Since its inception, our unit has worked tirelessly on 
                  healthcare support, environmental protection, literacy campaigns, and soft skill development 
                  for our students.
                </p>
                <p className={styles.aboutText}>
                  Our motto <strong>&quot;Not Me But You&quot;</strong> reflects the essence of democratic living and 
                  the spirit of selfless service. NSS volunteers actively contribute to nation-building through 
                  community engagement and social welfare initiatives.
                </p>
                <div className={styles.aboutMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Program Officer</span>
                    <span className={styles.metaValue}>Dr. Bhavesh Gohil</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Established</span>
                    <span className={styles.metaValue}>2009</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Affiliated</span>
                    <span className={styles.metaValue}>Gujarat University</span>
                  </div>
                </div>
              </motion.div>

              {/* Right - Stats Cards */}
              <motion.div className={styles.statsGrid} variants={fadeInUp} transition={{ duration: 0.6, delay: 0.2 }}>
                {nssStats.map((stat, idx) => (
                  <motion.div 
                    key={idx} 
                    className={styles.statCard}
                    whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
                    transition={{ duration: 0.25 }}
                  >
                    <span className={styles.statValue}>{stat.value}</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── Core Initiatives Section ── */}
        <section className={styles.initiativesSection}>
          <div className={styles.container}>
            <motion.div 
              className={styles.sectionHeader}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              <span className={styles.badge}>What We Do</span>
              <h2 className={styles.sectionTitle}>
                NSS Campaigns & <span className={styles.highlight}>Initiatives</span>
              </h2>
              <p className={styles.sectionSubtext}>
                Our unit conducts diverse programs fostering social responsibility, community welfare, and personal growth.
              </p>
            </motion.div>

            <motion.div 
              className={styles.initiativesGrid}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={staggerContainer}
            >
              {nssInitiatives.map((item, idx) => {
                const IconComp = iconMap[item.icon];
                return (
                  <motion.div 
                    key={idx} 
                    className={styles.initiativeCard}
                    variants={scaleIn}
                    transition={{ duration: 0.4 }}
                    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
                  >
                    <div className={styles.initiativeIcon} style={{ color: item.color, background: `${item.color}12` }}>
                      <IconComp />
                    </div>
                    <h3 className={styles.initiativeTitle}>{item.title}</h3>
                    <p className={styles.initiativeDesc}>{item.description}</p>
                    <div className={styles.initiativeAccent} style={{ background: item.color }}></div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ── Events Timeline Section ── */}
        <section className={styles.eventsSection}>
          <div className={styles.container}>
            <motion.div 
              className={styles.sectionHeader}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              <span className={styles.badge}>Events & Programs</span>
              <h2 className={styles.sectionTitle}>
                NSS Event <span className={styles.highlight}>Chronicle</span>
              </h2>
              <p className={styles.sectionSubtext}>
                A timeline of impactful events organized by our NSS unit over the years.
              </p>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div 
              className={styles.filterBar}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {[
                { key: 'all', label: 'All Events' },
                { key: 'seminar', label: 'Seminars' },
                { key: 'cultural', label: 'Cultural' }
              ].map(filter => (
                <button
                  key={filter.key}
                  className={`${styles.filterBtn} ${activeFilter === filter.key ? styles.filterActive : ''}`}
                  onClick={() => setActiveFilter(filter.key)}
                >
                  {filter.label}
                </button>
              ))}
            </motion.div>

            {/* Events Grid */}
            <motion.div 
              className={styles.eventsGrid}
              layout
            >
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event, idx) => (
                  <motion.div 
                    key={event.id}
                    className={styles.eventCard}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    whileHover={{ y: -5 }}
                    onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                  >
                    {/* Event Image */}
                    <div className={styles.eventImageWrap}>
                      <Image 
                        src={event.image} 
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className={styles.eventImage}
                      />
                      <div className={styles.eventYear}>{getYear(event.date)}</div>
                      <div className={`${styles.eventStatus} ${event.status === 'upcoming' ? styles.statusUpcoming : styles.statusPast}`}>
                        {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                      </div>
                    </div>

                    {/* Event Content */}
                    <div className={styles.eventContent}>
                      <div className={styles.eventMeta}>
                        <span className={styles.eventDate}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          {formatDate(event.date)}
                        </span>
                        <span className={styles.eventTime}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {event.time}
                        </span>
                      </div>
                      <h3 className={styles.eventTitle}>{event.title}</h3>
                      <p className={styles.eventDesc}>{event.description}</p>
                      <div className={styles.eventFooter}>
                        <span className={styles.eventOrganizer}>
                          <strong>By:</strong> {event.organizers}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* ── Gallery Section ── */}
        <section className={styles.gallerySection}>
          <div className={styles.container}>
            <motion.div 
              className={styles.sectionHeader}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              <span className={styles.badge}>Gallery</span>
              <h2 className={styles.sectionTitle}>
                NSS Outreach <span className={styles.highlight}>Moments</span>
              </h2>
            </motion.div>
            <ActivityGrid images={galleryImages} />
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <motion.div 
              className={styles.ctaCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={scaleIn}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.ctaContent}>
                <h2 className={styles.ctaTitle}>Become an NSS Volunteer</h2>
                <p className={styles.ctaText}>
                  NSS is open to all first and second-year undergraduate students. Volunteers completing 
                  240 service hours are awarded University Certificates recognizing their community contribution.
                </p>
                <div className={styles.ctaButtons}>
                  <Link href="/contact" className={styles.ctaBtnPrimary}>
                    Register Interest
                  </Link>
                  <Link href="/activities" className={styles.ctaBtnSecondary}>
                    Explore Activities
                  </Link>
                </div>
              </div>
              <div className={styles.ctaDecor} aria-hidden="true">
                <div className={styles.ctaCircle1}></div>
                <div className={styles.ctaCircle2}></div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
