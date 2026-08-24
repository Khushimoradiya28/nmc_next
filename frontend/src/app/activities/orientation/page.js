'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import ActivityCard from '@/components/activities/ActivityCard/ActivityCard';
import { getEventsByCategory } from '@/data/activitiesData';
import styles from './page.module.css';

const tabs = [
  { id: 'all',   label: 'All Programs' },
  { id: 'ba',    label: 'B.A.' },
  { id: 'bba',   label: 'B.B.A.' },
  { id: 'bca',   label: 'B.C.A.' },
  { id: 'bcom',  label: 'B.Com' },
  { id: 'mcom',  label: 'M.Com' },
  { id: 'msw',   label: 'M.S.W.' },
  { id: 'fd',    label: 'F.D.' },
];

export default function OrientationPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const allOrientEvents = getEventsByCategory('orientation');

  useEffect(() => { setCurrentPage(1); }, [selectedTab]);

  const filteredEvents  = selectedTab === 'all' ? allOrientEvents : allOrientEvents.filter(e => e.subCategoryId === selectedTab);
  const totalPages      = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex      = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (pageNo) => {
    if (pageNo >= 1 && pageNo <= totalPages) {
      setCurrentPage(pageNo);
      document.getElementById('orient-feed')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Header />
      <main>
        <ActivityHero
          title={<>Orientation <em>Programs</em></>}
          bgImage="/assets/banners/banner1.webp"
          breadcrumbs={[
            { label: 'Activities', link: '/activities' },
            { label: 'Orientation Programs' }
          ]}
        />

        <section className={styles.feedSection} id="orient-feed">
          <div className={styles.container}>

            <span className={styles.preTitle}>Induction Programs</span>
            <h2 className={styles.sectionTitle}>Orientation <span>Events</span></h2>

            <div className={styles.filterTabs}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`${styles.tabBtn} ${selectedTab === tab.id ? styles.activeTab : ''}`}
                  style={{ position: 'relative' }}
                >
                  <span className={styles.tabText}>{tab.label}</span>
                  {selectedTab === tab.id && (
                    <motion.span
                      layoutId="orientActiveTabPill"
                      className={styles.activePill}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className={styles.feedGrid}>
              <AnimatePresence mode="popLayout">
                {paginatedEvents.map((evt) => (
                  <motion.div
                    key={evt.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ActivityCard
                      event={evt}
                      basePath="/activities/orientation"
                      disableLink={false}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredEvents.length === 0 && (
              <div className={styles.emptyState}>
                <span style={{ fontSize: '2.5rem' }}>🎓</span>
                <h3>No orientation events for this department</h3>
                <p>Check back closer to the new academic year for orientation schedules.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className={styles.paginationContainer}>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={styles.pageBtn}>Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => handlePageChange(p)} className={`${styles.pageBtn} ${currentPage === p ? styles.activePageBtn : ''}`}>{p}</button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={styles.pageBtn}>Next</button>
              </div>
            )}

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}