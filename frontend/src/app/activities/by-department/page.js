'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import ActivityCard from '@/components/activities/ActivityCard/ActivityCard';
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

const deptEvents = [
  { id: 'bcom-guest-lecture-3', deptSlug: 'bcom', deptName: 'B.Com Department', title: 'B.Com Guest Lecture', shortDescription: 'On 12th August 2025, Nandkunwarba Mahila Commerce College organized an insightful guest lecture for B.Com Semester 1 students on key commerce topics.', date: '2025-08-12', thumbnail: '/assets/dept/bcom_lecture.jpg' },
  { id: 'soft-skill-seminar-3', deptSlug: 'mcom', deptName: 'M.Com Department & NSS', title: 'Soft Skill Seminar', shortDescription: 'Soft Skill Seminar organized by NSS Unit and M.Com Department. Timings: 09:00 AM to 12:00 PM. Date: 26 July 2025.', date: '2025-07-26', thumbnail: '/assets/dept/mcom_seminar.jpg' },
  { id: 'bca-photoshop-workshop', deptSlug: 'bca', deptName: 'B.C.A. Department', title: 'BCA Photoshop Workshop', shortDescription: '"PHOTOSHOP TECHNIQUE" IT workshop organized under "TECHNO SPARK" by Nandkunvarba Mahila BCA College.', date: '2025-08-05', thumbnail: '/assets/dept/bca_workshop.jpg' },
  { id: 'mcom-guest-lecture-2', deptSlug: 'mcom', deptName: 'M.Com Department', title: 'M.Com Department - Guest Lecture', shortDescription: 'Department: P.G. Center of M.Com. Guest Lecture by Renuka. Timings: 01:35 PM to 02:30 PM. Date: 22 July 2025.', date: '2025-07-22', thumbnail: '/assets/dept/mcom_seminar.jpg' },
  { id: 'guest-lecture-bba-2', deptSlug: 'bba', deptName: 'B.B.A. Department', title: 'Guest Lecture - BBA', shortDescription: 'Understanding the Law of Diminishing Marginal Utility with Dr. S. D. Shah on 21st July 2025. Audience: FY BBA students.', date: '2025-07-21', thumbnail: '/assets/dept/bba_seminar.jpg' },
  { id: 'guest-lecture-bba-1', deptSlug: 'bba', deptName: 'B.B.A. Department', title: 'Guest Lecture - BBA (HR Expert)', shortDescription: 'Speaker: Mr. Dipal Gohel, Freelance HR Expert at Nandkunvarba Mahila BBA College. Time: 10:30 AM to 11:30 AM. Date: 07 July 2025.', date: '2025-07-07', thumbnail: '/assets/dept/bba_seminar.jpg' },
  { id: 'bba-industrial-visit', deptSlug: 'bba', deptName: 'B.B.A. Department', title: 'Industrial Visit - BBA Department', shortDescription: 'Industrial Visit organized on 19th July 2025: Educational Tour to AMUL Dairy by BBA Department.', date: '2025-07-19', thumbnail: '/assets/dept/bba_industrial.jpg' },
  { id: 'ba-gujarati-guest-lecture', deptSlug: 'ba', deptName: 'B.A. Department', title: 'B.A. Gujarati Guest Lecture', shortDescription: 'On 15th July 2025, a guest lecture was organized for S.Y. B.A. Semester 3 Gujarati students at Nandkuvarba Mahila Arts College.', date: '2025-07-15', thumbnail: '/assets/dept/ba_lecture.jpg' },
  { id: 'ba-english-guest-lecture', deptSlug: 'ba', deptName: 'B.A. Department', title: 'B.A. English Departments Guest Lecture', shortDescription: 'On 12th July 2025, a guest lecture by Dr. Vishal Pandya, Dept of English, was arranged for arts students.', date: '2025-07-12', thumbnail: '/assets/dept/ba_lecture.jpg' },
  { id: 'bcom-guest-lecture-july', deptSlug: 'bcom', deptName: 'B.Com Department', title: 'Guest Lecture - B.Com', shortDescription: 'Guest lecture for B.Com Semester-1 students. CA Abhishek Shah was invited to share expertise on financial accounting.', date: '2025-07-22', thumbnail: '/assets/dept/bcom_lecture.jpg' },
  { id: 'ba-sociology-community', deptSlug: 'ba', deptName: 'B.A. Department', title: 'Sociology Department Community Visit', shortDescription: 'B.A. Sociology students conducted an educational community visit as part of field-work curriculum for understanding social structures.', date: '2025-06-10', thumbnail: '/assets/dept/msw_fieldwork.jpg' },
  { id: 'bca-it-quiz', deptSlug: 'bca', deptName: 'B.C.A. Department', title: 'IT Quiz - BCA Department', shortDescription: 'BCA department organized the IT Quiz event under Focus Club for BCA Sem 2, Sem 4, and Sem 6 students.', date: '2025-01-15', thumbnail: '/assets/dept/bca_workshop.jpg' },
  { id: 'mcom-tally-workshop', deptSlug: 'mcom', deptName: 'M.Com Department', title: 'Accounting Software Workshop', shortDescription: 'Faculty-led software session covering business ledgers, GST filings, and Tally transactions for M.Com students.', date: '2024-08-12', thumbnail: '/assets/dept/mcom_seminar.jpg' },
  { id: 'bcom-import-export', deptSlug: 'bcom', deptName: 'B.Com Department', title: 'Import-Export Trade Activity', shortDescription: 'B.Com Department organized an activity related to Import-Export Trade regulations under the Expert Club banner.', date: '2024-09-04', thumbnail: '/assets/dept/bcom_lecture.jpg' },
  { id: 'fd-fashion-show', deptSlug: 'fd', deptName: 'F.D. Department', title: 'Fashion Design Exhibition', shortDescription: 'Fashion Design students showcased their semester projects at the annual internal exhibition with traditional and modern garment designs.', date: '2024-11-20', thumbnail: '/assets/dept/fd_exhibition.jpg' },
  { id: 'msw-field-work', deptSlug: 'msw', deptName: 'M.S.W. Department', title: 'Community Field Work - MSW', shortDescription: 'M.S.W. students conducted community development field work with NGO partners focusing on rural women empowerment.', date: '2025-03-08', thumbnail: '/assets/dept/msw_fieldwork.jpg' },
  { id: 'bba-brand-management', deptSlug: 'bba', deptName: 'B.B.A. Department', title: 'Brand Management Workshop', shortDescription: 'A comprehensive Brand Management workshop organized for BBA students covering product launches, marketing strategy, and consumer behavior.', date: '2024-10-15', thumbnail: '/assets/dept/bba_seminar.jpg' },
  { id: 'ba-psychology-assessment', deptSlug: 'ba', deptName: 'B.A. Department', title: 'Psychological Assessment Activity', shortDescription: 'The B.A. Psychology Department organized Psychological Assessment activity to train students in standardized testing methods.', date: '2024-07-27', thumbnail: '/assets/dept/ba_lecture.jpg' },
];

export default function ByDepartmentPage() {
  const [selectedDept, setSelectedDept] = useState('all');
  const [currentPage, setCurrentPage]   = useState(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDept]);

  const filteredEvents   = selectedDept === 'all' ? deptEvents : deptEvents.filter(e => e.deptSlug === selectedDept);
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
                      event={{
                        id: evt.id,
                        title: evt.title,
                        shortDescription: evt.shortDescription,
                        date: evt.date,
                        thumbnail: evt.thumbnail,
                        clubName: evt.deptName,
                        categoryId: 'department',
                        subCategoryId: evt.deptSlug,
                      }}
                      disableLink={true}
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