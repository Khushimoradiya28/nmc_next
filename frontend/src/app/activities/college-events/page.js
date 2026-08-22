'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';

const CATEGORIES = ['All', 'Cultural', 'National', 'Special'];

const events = [
  {
    id: 1,
    title: 'Annual Day Celebration',
    category: 'Cultural',
    date: 'February 2026',
    desc: 'Grand annual celebration with cultural performances, prize distribution, and alumni felicitation on the main lawn. Students showcase classical dance, music, and theatrical skits to a packed auditorium.',
    image: '/assets/events_gallery/annual_day.jpg',
    highlight: true,
    tag: '🎭 Flagship Event',
    accent: '#B00000',
    accentLight: '#FFF0F0',
    chips: ['🎭 Cultural Performances', '🏆 Prize Distribution', '👩‍🎓 Alumni Felicitation'],
  },
  {
    id: 2,
    title: 'Navratri Celebration',
    category: 'Cultural',
    date: 'October 2025',
    desc: 'Traditional Garba and Dandiya celebration on campus with students, alumni, and faculty in vibrant ethnic attire. Campus transforms into a festive ground with rangoli, diyas, and music.',
    image: '/assets/events_gallery/navratri.jpg',
    highlight: false,
    tag: '🪔 Cultural Festival',
    accent: '#F4B000',
    accentLight: '#FFFBEB',
  },
  {
    id: 3,
    title: "Women's Day Celebration",
    category: 'Special',
    date: 'March 8, 2026',
    desc: 'Celebrating women achievers with inspiring guest lectures, panel discussions, and an award ceremony honoring student milestones and community contributions.',
    image: '/assets/events_gallery/womens_day.jpg',
    highlight: false,
    tag: '💜 Special Day',
    accent: '#7C3AED',
    accentLight: '#F5F3FF',
  },
  {
    id: 4,
    title: 'Republic Day Flag Ceremony',
    category: 'National',
    date: 'January 26, 2026',
    desc: 'Flag hoisting ceremony followed by patriotic songs, NCC student march pasts, and social services recognition for outstanding volunteers.',
    image: '/assets/events_gallery/republic_day.jpg',
    highlight: false,
    tag: '🇮🇳 National Day',
    accent: '#16A34A',
    accentLight: '#F0FDF4',
  },
  {
    id: 5,
    title: 'Independence Day',
    category: 'National',
    date: 'August 15, 2025',
    desc: 'Patriotic celebrations on campus featuring flag hoisting, faculty speeches, and special NSS drill showcases with participation from all departments.',
    image: '/assets/events_gallery/independence_day.jpg',
    highlight: false,
    tag: '🇮🇳 National Day',
    accent: '#EA580C',
    accentLight: '#FFF7ED',
  },
  {
    id: 6,
    title: "Teacher's Day Assemblies",
    category: 'Special',
    date: 'September 5, 2025',
    desc: 'Students coordinate academic sessions, celebrating their teachers with heartfelt stage programs, skits, and handcrafted cards in a day full of appreciation.',
    image: '/assets/events_gallery/teachers_day.jpg',
    highlight: false,
    tag: '🌸 Appreciation Day',
    accent: '#0891B2',
    accentLight: '#ECFEFF',
  },
];

const stats = [
  { value: '20+', label: 'Annual Events' },
  { value: '2000+', label: 'Participants' },
  { value: '6', label: 'Event Types' },
  { value: '100%', label: 'Student-Led' },
];

export default function CollegeEventsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const featured = events.find(e => e.highlight);
  const filtered = activeCategory === 'All'
    ? events.filter(e => !e.highlight)
    : events.filter(e => e.category === activeCategory && !e.highlight);

  return (
    <>
      <Header />
      <main className={styles.mainWrapper}>

        <ActivityHero
          title="College Events"
          bgImage="/assets/events_gallery/annual_day.jpg"
          height="55vh"
          decorative={true}
          breadcrumbs={[
            { label: 'Activities', link: '/activities' },
            { label: 'College Events' }
          ]}
        />

        {/* Stats Strip */}
        <section className={styles.statsStrip}>
          <div className={styles.container}>
            <div className={styles.statsGrid}>
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  className={styles.statItem}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Bento Card */}
        {featured && activeCategory === 'All' && (
          <section className={styles.featuredSection}>
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionPill}>⭐ Highlight</span>
                <h2 className={styles.sectionTitle}>Featured <span>Event</span></h2>
              </div>
              <motion.div
                className={styles.featuredCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className={styles.featuredImgCol}>
                  <img src={featured.image} alt={featured.title} className={styles.featuredImg} />
                  <span className={styles.featuredImgTag}>{featured.tag}</span>
                </div>
                <div className={styles.featuredTextCol}>
                  <div className={styles.featuredMeta}>
                    <span className={styles.featuredDate}>📅 {featured.date}</span>
                    <span className={styles.featuredCatBadge} style={{ background: featured.accentLight, color: featured.accent }}>
                      {featured.category}
                    </span>
                  </div>
                  <h2 className={styles.featuredTitle}>{featured.title}</h2>
                  <p className={styles.featuredDesc}>{featured.desc}</p>
                  {featured.chips && (
                    <div className={styles.chipRow}>
                      {featured.chips.map((chip, i) => (
                        <span key={i} className={styles.chip}>{chip}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Events Grid */}
        <section className={styles.eventsSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionPill}>🗓️ All Events</span>
              <h2 className={styles.sectionTitle}>Campus <span>Calendar</span></h2>
              <p className={styles.sectionSubtitle}>Every celebration that shapes the NMC spirit</p>
            </div>

            {/* Filter Tabs */}
            <div className={styles.filterRow}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                className={styles.eventsGrid}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filtered.length === 0 && (
                  <p className={styles.noResults}>No events in this category.</p>
                )}
                {filtered.map((event, idx) => (
                  <motion.div
                    key={event.id}
                    className={styles.eventCard}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.4 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  >
                    <div className={styles.cardImgWrap}>
                      <img src={event.image} alt={event.title} className={styles.cardImg} />
                      <span className={styles.cardTag}>{event.tag}</span>
                    </div>
                    <div className={styles.cardBody}>
                      <div className={styles.cardMeta}>
                        <span className={styles.cardDate}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          {event.date}
                        </span>
                        <span className={styles.cardCat} style={{ background: event.accentLight, color: event.accent }}>
                          {event.category}
                        </span>
                      </div>
                      <h3 className={styles.cardTitle}>{event.title}</h3>
                      <p className={styles.cardDesc}>{event.desc}</p>
                      <div className={styles.cardAccentBar} style={{ background: `linear-gradient(90deg, ${event.accent}, transparent)` }} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

