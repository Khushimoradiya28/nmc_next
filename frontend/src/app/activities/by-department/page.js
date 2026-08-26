'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import ActivityCard from '@/components/activities/ActivityCard/ActivityCard';
import { getEventsByCategory } from '@/data/activitiesData';
import styles from './page.module.css';

const departments = [
  { id: 'all',   label: 'All Departments' },
  { id: 'ba',    label: 'B.A.' },
  { id: 'bba',   label: 'B.B.A.' },
  { id: 'bca',   label: 'B.C.A.' },
  { id: 'bcom',  label: 'B.Com' },
  { id: 'mcom',  label: 'M.Com' },
  { id: 'msw',   label: 'M.S.W.' },
  { id: 'fd',    label: 'F.D.' },
];

export default function ByDepartmentPage() {
  const [selectedDept, setSelectedDept] = useState('all');
  const [currentPage, setCurrentPage]   = useState(1);
  const ITEMS_PER_PAGE = 9;

  const allDeptEvents = getEventsByCategory('by-department');

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDept]);

  const filteredEvents   = selectedDept === 'all' ? allDeptEvents : allDeptEvents.filter(e => e.subCategoryId === selectedDept);
  const totalPages       = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex       = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents  = filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (pageNo) => {
    if (pageNo >= 1 && pageNo <= totalPages) {
      setCurrentPage(pageNo);
      const feedEl = document.getElementById('dept-feed-section');
      if (feedEl) feedEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Header />
      <main>
        <ActivityHero
          title={<>Activities by <em>Department</em></>}
          bgImage="/assets/banners/banner1.webp"
          breadcrumbs={[
            { label: 'Activities', link: '/activities' },
            { label: 'By Department' }
          ]}
        />

        <section className={styles.feedSection} id="dept-feed-section">
          <div className={styles.container}>

            <span className={styles.preTitle}>Academic Outreach</span>
            <h2 className={styles.sectionTitle}>Departmental <span>Events</span></h2>

            <div className={styles.filterTabs}>
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDept(dept.id)}
                  className={`${styles.tabBtn} ${selectedDept === dept.id ? styles.activeTab : ''}`}
                  style={{ position: 'relative' }}
                >
                  <span className={styles.tabText}>{dept.label}</span>
                  {selectedDept === dept.id && (
                    <motion.span
                      layoutId="deptActiveTabPill"
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
                      basePath="/activities/by-department"
                      disableLink={false}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredEvents.length === 0 && (
              <div className={styles.emptyState}>
                <span style={{ fontSize: '2.5rem' }}>📅</span>
                <h3>No events listed for this department</h3>
                <p>Check back soon for newly scheduled academic activities.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className={styles.paginationContainer}>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={styles.pageBtn}>
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNo) => (
                  <button key={pageNo} onClick={() => handlePageChange(pageNo)} className={`${styles.pageBtn} ${currentPage === pageNo ? styles.activePageBtn : ''}`}>
                    {pageNo}
                  </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={styles.pageBtn}>
                  Next
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