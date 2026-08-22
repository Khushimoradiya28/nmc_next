"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';

// 9 detailed courses mapped to the filter categories
const COURSES_DATA = [
  {
    id: 1,
    category: 'ug',
    acronym: 'B.B.A.',
    acronymClass: '',
    tag: 'UG Degree',
    iconColor: 'prog-ibadge-ruby',
    title: 'Bachelor of Business Administration',
    summary: 'Comprehensive corporate leadership training covering marketing strategy, corporate finance, and business management.',
    points: [
      'Strategic Marketing & Human Resources',
      'Financial Analysis & Corporate Law',
      'Executive Presentation & Internships'
    ],
    duration: '3 Years (6 Sems)',
    fee: '₹8,000 / Sem',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
    )
  },
  {
    id: 2,
    category: 'ug',
    acronym: 'B.C.A.',
    acronymClass: 'acronym-azure',
    tag: 'UG Degree',
    iconColor: 'prog-ibadge-azure',
    title: 'Bachelor of Computer Applications',
    summary: 'Modern computing curriculum with hands-on software development, database engineering, and full-stack web technologies.',
    points: [
      'C++, Java, Python & Full-Stack Web',
      'Database Systems & Cloud Infrastructure',
      'High-Speed Computer Lab Workstations'
    ],
    duration: '3 Years (6 Sems)',
    fee: '₹15,000 / Sem',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
    )
  },
  {
    id: 3,
    category: 'ug',
    acronym: 'B.A.',
    acronymClass: 'acronym-gold',
    tag: 'UG Degree',
    iconColor: 'prog-ibadge-gold',
    title: 'Bachelor of Arts',
    summary: 'Rich humanities program fostering critical thought, communication skills, and social-cultural awareness.',
    points: [
      'Gujarati, English & Hindi Literature',
      'Sociology, Psychology & History',
      'Competitive Exam Coaching Alignment'
    ],
    duration: '3 Years (6 Sems)',
    fee: 'Affordable Fee',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
    )
  },
  {
    id: 4,
    category: 'ug',
    acronym: 'B.COM',
    acronymClass: 'acronym-purple',
    tag: 'UG Degree',
    iconColor: 'prog-ibadge-purple',
    title: 'Bachelor of Commerce',
    summary: 'Rigorous curriculum in advanced corporate accounting, tax law, banking operations, and financial auditing.',
    points: [
      'Financial Accounting & GST Taxation',
      'Commercial Law & Banking Practices',
      'Tally Prime & E-Commerce Labs'
    ],
    duration: '3 Years (6 Sems)',
    fee: 'MKBU Standard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    )
  },
  {
    id: 5,
    category: 'pg',
    acronym: 'M.A.',
    acronymClass: 'acronym-gold',
    tag: 'PG Degree',
    iconColor: 'prog-ibadge-gold',
    title: 'Master of Arts',
    summary: 'Postgraduate literary scholarship and advanced research in Gujarati literature, philosophy, and cultural analysis.',
    points: [
      'Advanced Literary Criticism & Research',
      'Dissertation & Seminar Presentations',
      'Academic & Teaching Career Pathways'
    ],
    duration: '2 Years (4 Sems)',
    fee: 'PG Norms',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    )
  },
  {
    id: 6,
    category: 'pg',
    acronym: 'M.COM',
    acronymClass: 'acronym-purple',
    tag: 'PG Degree',
    iconColor: 'prog-ibadge-purple',
    title: 'Master of Commerce',
    summary: 'Specialized postgraduate training in strategic finance, corporate restructuring, international trade, and economics.',
    points: [
      'Strategic Financial Management & Auditing',
      'Creative Commerce Club Research',
      'UGC NET / SLET Examination Guidance'
    ],
    duration: '2 Years (4 Sems)',
    fee: 'Govt. Scale',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
    )
  },
  {
    id: 7,
    category: 'pg',
    acronym: 'M.S.W.',
    acronymClass: '',
    tag: 'PG Degree',
    iconColor: 'prog-ibadge-ruby',
    title: 'Master of Social Work',
    summary: 'Professional postgraduate degree preparing women leaders for social policy, NGO management, and healthcare advocacy.',
    points: [
      'NGO Administration & Community Organizing',
      'Concurrent Fieldwork & Rural Camps',
      'Human Rights & Social Welfare Policy'
    ],
    duration: '2 Years (4 Sems)',
    fee: 'Fieldwork Focus',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    )
  },
  {
    id: 8,
    category: 'diploma',
    acronym: 'DFD & CFD',
    acronymClass: 'acronym-gold',
    tag: 'Fashion Diploma',
    iconColor: 'prog-ibadge-gold',
    title: 'Diploma in Fashion Designing',
    summary: 'Hands-on fashion industry program in garment construction, illustration, boutique styling, and apparel entrepreneurship.',
    points: [
      'Pattern Making & Garment Construction',
      'Textile Science, Embroidery & Styling',
      'Dedicated Fashion Design Studio & Labs'
    ],
    duration: '1 Year / 6 Months',
    fee: 'Practical Studio',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
    )
  },
  {
    id: 9,
    category: 'diploma',
    acronym: 'DNYS',
    acronymClass: 'acronym-azure',
    tag: 'Health Diploma',
    iconColor: 'prog-ibadge-azure',
    title: 'Diploma in Naturopathy & Yoga Sciences',
    summary: 'Comprehensive vocational diploma in holistic healthcare, therapeutic yoga, herbal nutrition, and natural wellness counseling.',
    points: [
      'Yogic Therapy & Holistic Health Science',
      'Herbal Dietetics & Natural Healing',
      'Certified Naturopathy Practitioner Diploma'
    ],
    duration: '1 Year Diploma',
    fee: 'Wellness Cert.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    )
  }
];

export default function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter items dynamically
  const filteredCourses = activeFilter === 'all'
    ? COURSES_DATA
    : COURSES_DATA.filter(course => course.category === activeFilter);

  // Count items for each category
  const allCount = COURSES_DATA.length;
  const ugCount = COURSES_DATA.filter(c => c.category === 'ug').length;
  const pgCount = COURSES_DATA.filter(c => c.category === 'pg').length;
  const diplomaCount = COURSES_DATA.filter(c => c.category === 'diploma').length;

  return (
    <>
      <Header />
      <main>
        {/* HERO BANNER */}
        <section className="hero-fullscreen" id="home" style={{minHeight: "50vh", height: "50vh"}}>
          <div className="hero-bg-image">
            <Image src="/assets/home/hero/1.png" alt="Courses Banner" width={1400} height={700} className="hero-bg-img" priority />
          </div>
          <div className="hero-overlay" style={{background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))"}}></div>
          <div className="hero-content" style={{paddingTop: "100px", display: "flex", alignItems: "flex-end", height: "100%", paddingBottom: "80px", width: "100%"}}>
            <div className="container" style={{ width: "100%", display: "flex", justifyContent: "flex-start", padding: "0 2rem" }}>
              <h1 className="hero-main-title" style={{ margin: 0 }}><em>Courses &amp; Programs</em></h1>
            </div>
          </div>
        </section>

        {/* ACADEMIC PROGRAMS OFFERED */}
        <section className="section-padding programs-section" id="programs">
          <div className="container">
            <div className="section-header">
              <div className="section-subtitle">Comprehensive Curriculum</div>
              <h2 className="section-title">Academic Programs <span>Offered at NMC</span></h2>
              <p className="section-description">Career-oriented Undergraduate, Postgraduate, and Professional Diploma programs affiliated with M.K. Bhavnagar University.</p>
            </div>

            {/* Enhanced Category Filter Bar */}
            <div className="program-filter-bar">
              <button 
                className={`prog-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                <span>All Programs</span>
                <span className="prog-count-pill">{allCount}</span>
              </button>
              <button 
                className={`prog-filter-btn ${activeFilter === 'ug' ? 'active' : ''}`}
                onClick={() => setActiveFilter('ug')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                <span>Undergraduate (UG)</span>
                <span className="prog-count-pill">{ugCount}</span>
              </button>
              <button 
                className={`prog-filter-btn ${activeFilter === 'pg' ? 'active' : ''}`}
                onClick={() => setActiveFilter('pg')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span>Postgraduate (PG)</span>
                <span className="prog-count-pill">{pgCount}</span>
              </button>
              <button 
                className={`prog-filter-btn ${activeFilter === 'diploma' ? 'active' : ''}`}
                onClick={() => setActiveFilter('diploma')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                <span>Diploma &amp; Vocational</span>
                <span className="prog-count-pill">{diplomaCount}</span>
              </button>
            </div>

            {/* Programs Grid */}
            <div className="programs-grid">
              {filteredCourses.map(course => (
                <div key={course.id} className="prog-card prog-card-luxury spotlight-active" data-category={course.category}>
                  <div className="prog-card-inner">
                    <div className="prog-card-header-bar">
                      <span className={`prog-tag ${course.category === 'ug' ? 'tag-ug' : course.category === 'pg' ? 'tag-pg' : 'tag-diploma'}`}>
                        {course.tag}
                      </span>
                      <div className={`prog-icon-badge ${course.iconColor}`}>
                        {course.icon}
                      </div>
                    </div>

                    <div className={`prog-acronym-badge ${course.acronymClass}`}>
                      {course.acronym}
                    </div>
                    <h3 className="prog-title">{course.title}</h3>
                    <p className="prog-summary">{course.summary}</p>

                    <ul className="prog-points-list">
                      {course.points.map((pt, i) => (
                        <li key={i}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="prog-meta-strip">
                      <div className="prog-meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span>{course.duration}</span>
                      </div>
                      <div className={`prog-fee-badge ${course.category === 'ug' && course.acronym === 'B.C.A.' ? 'fee-azure' : course.acronym === 'B.A.' ? 'fee-gold' : course.category === 'ug' ? 'fee-ruby' : course.category === 'pg' && course.acronym === 'M.COM' ? 'fee-purple' : course.category === 'pg' && course.acronym === 'M.S.W.' ? 'fee-ruby' : course.category === 'pg' ? 'fee-gold' : course.acronym === 'DFD & CFD' ? 'fee-gold' : 'fee-azure'}`}>
                        {course.fee}
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-crimson prog-card-btn open-reg-modal">
                    <span>Apply for {course.acronym}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z"/></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
