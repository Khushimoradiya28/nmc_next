'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import ActivityCard from '@/components/activities/ActivityCard/ActivityCard';
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

const orientEvents = [
  { id: 'mcom-orientation-2025', deptSlug: 'mcom', deptName: 'M.Com Department', title: 'M.Com Department – Orientation Program 2025', shortDescription: 'NANDKUNVARBA MAHILA COLLEGE Departmental Activity – P.G. Center of M.Com organized a comprehensive orientation for new M.Com students covering curriculum, research opportunities, and career paths.', date: '2025-02-28', thumbnail: '/assets/orient/mcom_career.jpg' },
  { id: 'bca-science-center', deptSlug: 'bca', deptName: 'B.C.A. Department', title: 'Regional Science Center Visit – BCA Orientation', shortDescription: 'BCA Sem-3 students visited the Regional Science Center, exploring galleries on mechanics, optics, electronics and interactive science exhibits as part of their orientation activities.', date: '2025-07-15', thumbnail: '/assets/orient/bca_science.jpg' },
  { id: 'ba-orientation-2025', deptSlug: 'ba', deptName: 'B.A. Department', title: 'B.A. Orientation Program 2025', shortDescription: 'Orientation Programme at Nandkuvarba Mahila Arts College held from 03/07/2025 to 05/07/2025. New students were introduced to faculty, departments, and cultural activities.', date: '2025-07-03', thumbnail: '/assets/orient/ba.jpg' },
  { id: 'bcom-orientation-2025', deptSlug: 'bcom', deptName: 'B.Com Department', title: 'Orientation Program 2025 – B.Com Department', shortDescription: 'The Orientation Program "Miracle to Milestone" for B.Com 1st Semester students held from July 3rd to 5th, 2025. A phenomenal success with industry speakers and career guidance.', date: '2025-07-03', thumbnail: '/assets/orient/bcom.jpg' },
  { id: 'bba-orientation-2025', deptSlug: 'bba', deptName: 'B.B.A. Department', title: 'BBA – Orientation Program 2025', shortDescription: 'The Department of Business Administration organized a two-day orientation seminar on 3rd and 4th July 2025 for new BBA students covering management fundamentals and career pathways.', date: '2025-07-03', thumbnail: '/assets/orient/bba.jpg' },
  { id: 'bca-orientation-2025', deptSlug: 'bca', deptName: 'B.C.A. Department', title: 'B.C.A. – Orientation Program 2025', shortDescription: 'Two-day Orientation Program organized by B.C.A. Department on 3rd and 4th July 2025 for new students. Covered programming fundamentals, lab orientation, and technology trends.', date: '2025-07-03', thumbnail: '/assets/orient/bca_science.jpg' },
  { id: 'bba-orientation-2024', deptSlug: 'bba', deptName: 'B.B.A. Department', title: 'Orientation Program – BBA 2024', shortDescription: 'Two-day Orientation Program organized by the B.B.A. Department of Nandakuvarba Mahila B.B.A. College from 3rd July 2024 to 4th July 2024 for incoming students.', date: '2024-07-03', thumbnail: '/assets/orient/bba.jpg' },
  { id: 'mcom-managerial-economics', deptSlug: 'mcom', deptName: 'M.Com Department', title: 'Utility of Managerial Economics – Orientation', shortDescription: 'Second session of M.Com orientation program on "Utility of Managerial Economics". Teachers and students were guided on economic principles and their business applications. Timing: 01:00 PM - 02:00 PM.', date: '2024-07-15', thumbnail: '/assets/orient/mcom_career.jpg' },
  { id: 'mcom-accounting-career', deptSlug: 'mcom', deptName: 'M.Com Department', title: 'Career Opportunities after M.Com in Accounting', shortDescription: 'Orientation session by CA Swapnil Shah, owner of the DARMX Institute, Bhavnagar. Shared vast experience on CA, CFA, financial analysis, and post-M.Com career opportunities.', date: '2024-07-02', thumbnail: '/assets/orient/mcom_career.jpg' },
  { id: 'mcom-banking-insurance', deptSlug: 'mcom', deptName: 'M.Com Department', title: 'Career Opportunities in Banking & Insurance Sector', shortDescription: 'Orientation session by Shobhanaben Patel, Branch Manager, SBI Life, Bhavnagar. Explained banking, insurance career paths, and recruitment processes for M.Com graduates.', date: '2024-07-11', thumbnail: '/assets/orient/mcom_career.jpg' },
  { id: 'msw-orientation-2024', deptSlug: 'msw', deptName: 'M.S.W. Department', title: 'M.S.W. Orientation Program', shortDescription: 'MSW orientation program introducing students to social work fieldwork, NGO partnerships, community development projects, and the Nirman Kendra club activities.', date: '2024-07-08', thumbnail: '/assets/orient/msw.jpg' },
  { id: 'fd-orientation-2024', deptSlug: 'fd', deptName: 'F.D. Department', title: 'F.D. Orientation – Design Studio Welcome', shortDescription: 'Welcome orientation for Fashion Design new students covering design studio tools, fabric knowledge, annual creative fashion runway timelines, and project submission guidelines.', date: '2024-07-05', thumbnail: '/assets/orient/fd.jpg' },
  { id: 'ba-orientation-2024', deptSlug: 'ba', deptName: 'B.A. Department', title: 'B.A. Orientation Program 2024', shortDescription: 'Arts orientation introducing new students to Gujarati, English, Sociology, and Psychology departments. Faculty members, course structure, and elective choices were presented.', date: '2024-07-04', thumbnail: '/assets/orient/ba.jpg' },
  { id: 'bcom-orientation-2024', deptSlug: 'bcom', deptName: 'B.Com Department', title: 'B.Com Orientation Program 2024', shortDescription: 'Commerce orientation covering accounting systems, Tally workshops, CA pathways, and Expert Club activities for B.Com Semester-1 freshers.', date: '2024-07-03', thumbnail: '/assets/orient/bcom.jpg' },
  { id: 'welcome-ceremony-2025', deptSlug: 'ba', deptName: 'All Departments', title: 'NMC Fresher Welcome Ceremony 2025', shortDescription: 'Grand fresher welcome ceremony at Nandkunvarba Mahila College with principal address, cultural performances by seniors, and department introductions for all new students.', date: '2025-07-01', thumbnail: '/assets/orient/welcome.jpg' },
];

export default function OrientationPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => { setCurrentPage(1); }, [selectedTab]);

  const filteredEvents  = selectedTab === 'all' ? orientEvents : orientEvents.filter(e => e.deptSlug === selectedTab);
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
          subtitle="Welcoming new students to the NMC family — department-wise induction programs designed to ease your journey into higher education"
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
                      event={{
                        id: evt.id,
                        title: evt.title,
                        shortDescription: evt.shortDescription,
                        date: evt.date,
                        thumbnail: evt.thumbnail,
                        clubName: evt.deptName,
                        categoryId: 'orientation',
                        subCategoryId: evt.deptSlug,
                      }}
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