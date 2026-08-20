"use client";

import React, { useState } from 'react';
import styles from './AcademicProgramsSection.module.css';

const programsData = [
  { id: '01', code: 'B.C.A.', title: 'Bachelor of Computer Applications', duration: '3 Years', category: 'Undergraduate', desc: 'Hands-on software development, database design, cloud computing, and modern web tech.' },
  { id: '02', code: 'B.B.A.', title: 'Bachelor of Business Administration', duration: '3 Years', category: 'Undergraduate', desc: 'Management principles, leadership, marketing strategies, and modern entrepreneurial skills.' },
  { id: '03', code: 'B.Com.', title: 'Bachelor of Commerce', duration: '3 Years', category: 'Undergraduate', desc: 'Core business education covering financial accounting, taxation, auditing, and corporate governance.' },
  { id: '04', code: 'B.A.', title: 'Bachelor of Arts', duration: '3 Years', category: 'Undergraduate', desc: 'A comprehensive program focusing on humanities, literature, and social sciences to build analytical and communicative skills.' },
  { id: '05', code: 'M.Com.', title: 'Master of Commerce', duration: '2 Years', category: 'Postgraduate', desc: 'In-depth specialization in finance, economics, and corporate business strategies.' },
  { id: '06', code: 'M.A.', title: 'Master of Arts', duration: '2 Years', category: 'Postgraduate', desc: 'Advanced research and specialized study in humanities, designed for academic and professional leadership.' },
  { id: '07', code: 'M.S.W.', title: 'Master of Social Work', duration: '2 Years', category: 'Postgraduate', desc: 'Community development, social policy, welfare management, and field-based interventions.' },
  { id: '08', code: 'D.F.D.', title: 'Diploma in Fashion Designing', duration: '2 Years', category: 'Diploma', desc: 'A university-recognized vocational diploma covering textile structures, apparel construction, and computerized design illustration.' },
  { id: '09', code: 'D.N.Y.S.', title: 'Diploma in Naturopathy & Yogic Sciences', duration: '1 Year', category: 'Diploma', desc: 'Holistic health curriculum integrating traditional yoga techniques, naturopathic therapy, and wellness science.' }
];

export default function AcademicProgramsSection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState('01');

  const categories = ['All', 'Undergraduate', 'Postgraduate', 'Diploma'];

  const filteredPrograms = activeCategory === 'All'
    ? programsData
    : programsData.filter(p => p.category === activeCategory);

  return (
    <section className={styles.sliderSection} id="programs">
      <div className={styles.bgGridPattern}></div>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <div className={styles.titleGroup}>
            <span className={styles.eyebrow}>Academic Excellence</span>
            <h2 className={styles.heading}>Explore Our Programs</h2>
          </div>

          <div className={styles.filterBar}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
                onClick={() => {
                  setActiveCategory(cat);
                  // Auto expand first filtered program
                  const first = programsData.find(p => cat === 'All' || p.category === cat);
                  if (first) setExpandedId(first.id);
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sliding Program Tracks */}
        <div className={styles.sliderTrackWrapper}>
          <div className={styles.sliderTrack}>
            {filteredPrograms.map((program) => {
              const isExpanded = expandedId === program.id;
              return (
                <div 
                  key={program.id}
                  className={`${styles.card} ${isExpanded ? styles.cardExpanded : styles.cardCollapsed}`}
                  onClick={() => setExpandedId(program.id)}
                  onMouseEnter={() => setExpandedId(program.id)}
                >
                  {isExpanded ? (
                    <div className={styles.expandedContent}>
                      <div className={styles.cardHeader}>
                        <span className={styles.tagBadge}>{program.category}</span>
                        <span className={styles.durationBadge}>{program.duration}</span>
                      </div>
                      <div className={styles.cardBody}>
                        <span className={styles.cardIdLarge}>{program.id}</span>
                        <h3 className={styles.programCodeTitle}>{program.code}</h3>
                        <h4 className={styles.programFullTitle}>{program.title}</h4>
                        <p className={styles.programDesc}>{program.desc}</p>
                      </div>
                      <div className={styles.cardFooter}>
                        <a href="#contact" className={styles.ctaBtn}>
                          <span>Explore Course</span>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.collapsedContent}>
                      <span className={styles.collapsedNumber}>{program.id}</span>
                      <span className={styles.collapsedTitle}>{program.code}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
