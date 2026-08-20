"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './FacultySection.module.css';

const facultyData = [
  {
    id: 1,
    name: 'Dr. Samkit Shah',
    designation: 'I/C Principal & Assistant Professor',
    qualification: 'M.Com., DTLP, Ph.D. (Pursuing)',
    image: '/assets/techers/Dr. Samkit Shah/1.-350x350.webp',
    category: 'Commerce',
    experience: '8+ Years Exp.',
    quote: 'Specializes in Accountancy, taxation laws, and commerce research, directing the academic growth of the college.'
  },
  {
    id: 2,
    name: 'Mehulkumar Bhatt',
    designation: 'I/C Principal & Coordinator',
    qualification: 'M.Com., M.B.A.',
    image: '/assets/techers/Mehulkumar Bhatt/1-350.webp',
    category: 'Management',
    experience: '12+ Years Exp.',
    quote: 'Serving as I/C Principal since July 2018, conveying insights in business law, company law practice, and NSS coordination.'
  },
  {
    id: 3,
    name: 'Ankita R. Patel',
    designation: 'Principal & Coordinator',
    qualification: 'M.Sc. (IT), Recognized UG & PG Teacher',
    image: '/assets/techers/Ankita R. Patel/1-350.webp',
    category: 'IT & Science',
    experience: '14+ Years Exp.',
    quote: 'Principal of BCA department since July 2012, specializing in RDBMS, C-Language, DFS, and P.G.D.C.A. management.'
  },
  {
    id: 4,
    name: 'Dipak Makwana',
    designation: 'Coordinator & Assistant Professor',
    qualification: 'M.Com., DTLP, GSET (Commerce)',
    image: '/assets/techers/DIPAK MAKWANA/1-350.webp',
    category: 'Commerce',
    experience: '6+ Years Exp.',
    quote: 'Over 6 years of academic teaching experience at the P.G. Center of M.Com and B.Com, specializing in taxation laws.'
  },
  {
    id: 5,
    name: 'Shah Keyurbhai',
    designation: 'I/C Principal & Assistant Professor',
    qualification: 'M.B.A. (Finance), B.Com. (H)',
    image: '/assets/techers/SHAH KEYURBHAI/1-350.webp',
    category: 'Management',
    experience: '10+ Years Exp.',
    quote: 'Directing students in financial planning, export-import management, web design, and strategic business administration.'
  },
  {
    id: 6,
    name: 'Shraddha Makwana',
    designation: 'Coordinator & Assistant Professor',
    qualification: 'B.Com., Diploma in Fashion Designing',
    image: '/assets/techers/Shraddha Makwana/1-350.webp',
    category: 'Arts/Design',
    experience: '8+ Years Exp.',
    quote: 'Associated with the college since June 2018, leading the region\'s first university-recognized department of fashion design.'
  }
];

const categories = ["ALL", "Commerce", "Management", "IT & Science", "Arts/Design"];

export default function FacultySection() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [activeCard, setActiveCard] = useState(null);

  const filteredFaculty = activeTab === "ALL" 
    ? facultyData 
    : facultyData.filter(f => f.category === activeTab);

  return (
    <section className={styles.facultyWrapper} id="faculty">
      <div className={styles.facultyContainer}>
        {/* SECTION HEADER */}
        <div className={styles.headerArea}>
          <span className={styles.subHeading}>EXPERT LECTURERS</span>
          <h2 className={styles.mainHeading}>Experienced Faculty</h2>
          <p className={styles.description}>
            Our lecturers aim to discover your talents and fulfill your potential by conveying insights and expertise clearly.
          </p>

          {/* CATEGORY TABS */}
          <div className={styles.tabContainer}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.tabBtn} ${activeTab === cat ? styles.activeTab : ''}`}
                onClick={() => {
                  setActiveTab(cat);
                  setActiveCard(null);
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FACULTY CARDS GRID / CAROUSEL */}
        <div className={styles.cardsGrid}>
          {filteredFaculty.map((item) => {
            const isActive = activeCard === item.id;
            return (
              <div
                key={item.id}
                className={`${styles.card} ${isActive ? styles.activeCard : ''}`}
                onMouseEnter={() => setActiveCard(item.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                {/* IMAGE LAYER */}
                <div className={styles.imageBox}>
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 992px) 45vw, 380px"
                    className={styles.facultyImg} 
                  />
                </div>

                {/* OVERLAY CONTENT (FADES/SLIDES IN ON HOVER/ACTIVE) */}
                <div className={styles.cardOverlay}>
                  <p className={styles.quote}>“{item.quote}”</p>
                  <div className={styles.badgeRow}>
                    <span className={styles.badge}>{item.qualification}</span>
                    <span className={styles.badge}>{item.experience}</span>
                  </div>
                  <h3 className={styles.facultyName}>{item.name}</h3>
                  <span className={styles.facultyRole}>{item.designation}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
