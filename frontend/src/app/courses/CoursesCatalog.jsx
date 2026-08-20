"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './CoursesCatalog.module.css';

const coursesData = [
  {
    id: 1,
    code: "B.C.A.",
    title: "Bachelor of Computer Applications",
    category: "Undergraduate",
    duration: "3 Years (6 Semesters)",
    eligibility: "12th Pass (Any Stream with English)",
    fee: "₹15,000 / Semester",
    img: "/assets/shared/misc/9.png",
    perk: "Fast Filling",
    bullets: ["Software Development & Web Tech", "Database Management & Java/C++ Lab", "Pre-Placement Cloud Programming training"]
  },
  {
    id: 2,
    code: "B.B.A.",
    title: "Bachelor of Business Administration",
    category: "Undergraduate",
    duration: "3 Years (6 Semesters)",
    eligibility: "12th Pass (Any Stream)",
    fee: "₹8,000 / Semester",
    img: "/assets/shared/misc/2.png",
    perk: "High Demand",
    bullets: ["Marketing, HR & Finance Principles", "Entrepreneurship & Leadership projects", "Corporate Business communication modules"]
  },
  {
    id: 3,
    code: "B.Com",
    title: "Bachelor of Commerce",
    category: "Undergraduate",
    duration: "3 Years (6 Semesters)",
    eligibility: "12th Pass (Commerce/Science)",
    fee: "Merit Subsidized Fee",
    img: "/assets/home/misc/4.png",
    perk: "Affordable",
    bullets: ["Corporate Accounting & Auditing", "Indian Banking & Taxation frameworks", "Tally & GST practical certifications"]
  },
  {
    id: 4,
    code: "B.A.",
    title: "Bachelor of Arts",
    category: "Undergraduate",
    duration: "3 Years (6 Semesters)",
    eligibility: "12th Pass (Any Stream)",
    fee: "Merit Subsidized Fee",
    img: "/assets/home/misc/5.png",
    perk: "Popular",
    bullets: ["English Literature & Social Sciences", "Humanities & Competitive Exam Foundation", "Creative Writing & Presentation grooming"]
  },
  {
    id: 5,
    code: "M.Com",
    title: "Master of Commerce",
    category: "Postgraduate",
    duration: "2 Years (4 Semesters)",
    eligibility: "Graduation in Commerce (B.Com)",
    fee: "Merit Subsidized Fee",
    img: "/assets/shared/misc/12.jpg",
    perk: "Advanced",
    bullets: ["Advanced Corporate Financial Management", "Strategic Business Analysis & Economics", "Research project work & seminars"]
  },
  {
    id: 6,
    code: "M.A.",
    title: "Master of Arts",
    category: "Postgraduate",
    duration: "2 Years (4 Semesters)",
    eligibility: "Graduation in Arts (B.A.)",
    fee: "Merit Subsidized Fee",
    img: "/assets/shared/misc/13.jpg",
    perk: "Specialized",
    bullets: ["Advanced Literary Criticism & Linguistics", "Social Policy & Development research", "Seminar presentations and thesis guidance"]
  },
  {
    id: 7,
    code: "M.S.W.",
    title: "Master of Social Work",
    category: "Postgraduate",
    duration: "2 Years (4 Semesters)",
    eligibility: "Graduation (Any Stream)",
    fee: "Merit Subsidized Fee",
    img: "/assets/shared/misc/1.jpg",
    perk: "Fieldwork Led",
    bullets: ["NGO Management & Community Development", "Social work methodologies & counseling", "Concurrent Fieldwork in urban/rural sectors"]
  },
  {
    id: 8,
    code: "D.F.D. / C.F.D.",
    title: "Diploma / Certificate in Fashion Designing",
    category: "Diploma/Vocational",
    duration: "1 to 2 Years Options",
    eligibility: "10th or 12th Pass (Any Stream)",
    fee: "Exclusive Subsidy",
    img: "/assets/shared/misc/3.jpg",
    perk: "Creative Studio",
    bullets: ["Pattern Making & Apparel Construction", "Boutique Management & Fashion Marketing", "Personal Design illustration portfolio"]
  },
  {
    id: 9,
    code: "D.N.Y.S.",
    title: "Diploma in Naturopathy & Yogic Sciences",
    category: "Diploma/Vocational",
    duration: "1 Year",
    eligibility: "12th Pass (Any Stream)",
    fee: "Subsidized Fee",
    img: "/assets/shared/misc/6.jpg",
    perk: "Wellness Pro",
    bullets: ["Traditional Hatha Yoga & Kriyas", "Naturopathic therapies & dietetics", "Anatomy, physiology and wellness counseling"]
  }
];

export default function CoursesCatalog() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Undergraduate', 'Postgraduate', 'Diploma/Vocational'];

  const filteredCourses = activeCategory === 'All'
    ? coursesData
    : coursesData.filter(c => c.category === activeCategory);

  return (
    <>
      {/* 1. Hero banner */}
      <section className={styles.heroSection}>
        <div className={styles.heroBgImage}>
          <Image 
            src="/assets/shared/misc/1.jpg" 
            alt="Courses Banner" 
            fill
            priority
            sizes="100vw"
            className={styles.heroBgImg}
          />
        </div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Courses &amp; Programs</h1>
          </div>
        </div>
      </section>

      {/* 2. Catalog section */}
      <section className={styles.catalogSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>Academic Offerings</span>
            <h2 className={styles.sectionTitle}>Academic Programs <span>Offered at NMC</span></h2>
            <p className={styles.sectionDescription}>
              Select your academic career path from our university-affiliated undergraduate, postgraduate, and specialized vocational diploma programs.
            </p>
          </div>

          {/* Filters Bar */}
          <div className={styles.filtersBar}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Programs Grid */}
          <div className={styles.programsGrid}>
            {filteredCourses.map((course) => (
              <div key={course.id} className={styles.courseCard}>
                <div className={styles.cardMedia}>
                  <Image 
                    src={course.img} 
                    alt={course.title}
                    width={400}
                    height={220}
                    className={styles.cardImg}
                    style={{ objectFit: 'cover' }}
                  />
                  <span className={styles.categoryBadge}>{course.category}</span>
                  <span className={styles.perkBadge}>{course.perk}</span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.courseHeader}>
                    <span className={styles.courseCode}>{course.code}</span>
                    <h3 className={styles.courseTitle}>{course.title}</h3>
                  </div>

                  <p className={styles.courseMeta}>
                    <strong>Duration:</strong> {course.duration} <br />
                    <strong>Eligibility:</strong> {course.eligibility} <br />
                    <strong>Est. Fee:</strong> {course.fee}
                  </p>

                  <ul className={styles.bulletsList}>
                    {course.bullets.map((bullet, idx) => (
                      <li key={idx}>
                        <span className={styles.checkIcon}>✔</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.perksStrip}>
                    <span>🎓 Free Bus Service</span>
                    <span>🧥 Free Blazer</span>
                  </div>

                  <a href="#contact" className={styles.enrollBtn}>
                    <span>Inquire Now</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
