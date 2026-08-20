"use client";

import { useState } from 'react';
import styles from './page.module.css';

const programs = [
  { name: 'Bachelor of Business Administration (B.B.A.)', type: 'UG', typeClass: 'typeUG', duration: '3 Years (6 Semesters)', fee: '₹8,000/Sem', eligibility: '10+2 with English', desc: 'Offers professional skills in early stage of career. Focuses on management principles, marketing, finance, and entrepreneurship.', category: 'ug' },
  { name: 'Bachelor of Computer Applications (B.C.A.)', type: 'UG', typeClass: 'typeUG', duration: '3 Years (6 Semesters)', fee: '₹15,000/Sem', eligibility: '10+2 with English & Maths', desc: 'Comprehensive IT education covering programming, web development, databases, and software engineering.', category: 'ug' },
  { name: 'Bachelor of Arts (B.A.)', type: 'UG', typeClass: 'typeUG', duration: '3 Years (6 Semesters)', fee: 'As per MKBU', eligibility: '10+2 Any Stream', desc: 'Liberal arts education with specializations in English, Gujarati, Psychology, Sociology, and Economics.', category: 'ug' },
  { name: 'Bachelor of Commerce (B.Com.)', type: 'UG', typeClass: 'typeUG', duration: '3 Years (6 Semesters)', fee: 'As per MKBU', eligibility: '10+2 Commerce/General', desc: 'Established in 2009, focuses on accounting, taxation, banking, auditing, and business law.', category: 'ug' },
  { name: 'Master of Arts (M.A.)', type: 'PG', typeClass: 'typePG', duration: '2 Years (4 Semesters)', fee: 'As per MKBU', eligibility: 'Graduation in Arts', desc: 'Advanced study in humanities with research orientation. Established 2019, affiliated to MKBU.', category: 'pg' },
  { name: 'Master of Commerce (M.Com.)', type: 'PG', typeClass: 'typePG', duration: '2 Years (4 Semesters)', fee: 'As per MKBU', eligibility: 'B.Com Graduation', desc: 'Postgraduate degree focusing on advanced commerce, accounting, and financial management.', category: 'pg' },
  { name: 'Master of Social Work (M.S.W.)', type: 'PG', typeClass: 'typePG', duration: '2 Years (4 Semesters)', fee: 'As per MKBU', eligibility: 'Any Graduation', desc: 'Established in 2010, trains students in community development, counseling, and social welfare.', category: 'pg' },
  { name: 'P.G. Diploma in Public Administration (P.G.D.P.A.)', type: 'PG', typeClass: 'typePG', duration: '1 Year (2 Semesters)', fee: 'As per MKBU', eligibility: 'Any Graduation', desc: 'Professional diploma for careers in public administration and government services.', category: 'pg' },
  { name: 'Diploma in Fashion Designing (F.D.)', type: 'Diploma', typeClass: 'typeDiploma', duration: '1 Year', fee: 'As per MKBU', eligibility: '10+2 Any Stream', desc: 'First UGC and University-approved fashion designing program. Covers art, design, pattern making, and embroidery.', category: 'diploma' },
  { name: 'Diploma in Multi Purpose Health Worker (D.M.P.H.W.)', type: 'Diploma', typeClass: 'typeDiploma', duration: '2 Years', fee: 'As per MKBU', eligibility: '10+2 Science', desc: 'Healthcare-focused diploma training students for community health services and wellness roles.', category: 'diploma' },
  { name: 'Diploma in Health Sanitary Inspector (D.H.S.I.)', type: 'Diploma', typeClass: 'typeDiploma', duration: '1 Year', fee: 'As per MKBU', eligibility: '10+2 Science', desc: 'Prepares students for sanitation and public health inspection roles in government and private sectors.', category: 'diploma' },
  { name: 'Diploma in Naturopathy & Yogic Sciences (D.N.Y.S.)', type: 'Diploma', typeClass: 'typeDiploma', duration: '2 Years', fee: 'As per MKBU', eligibility: '10+2 Any Stream', desc: 'Holistic wellness diploma covering naturopathy, yoga therapy, nutrition, and alternative healing practices.', category: 'diploma' },
  { name: 'Certificate in Fashion Designing (C.F.D.)', type: 'Certificate', typeClass: 'typeCert', duration: '6 Months', fee: 'As per MKBU', eligibility: '10+2 Any Stream', desc: 'Short-term course covering Art & Design, Pattern Making, Embroidery, and Garment Construction.', category: 'cert' },
  { name: 'Add-On Course: Water Pollution & Mental Health', type: 'Certificate', typeClass: 'typeCert', duration: 'Short-term', fee: 'Free', eligibility: 'Any NMC Student', desc: 'Equips students with knowledge about water pollution causes, health impacts, and mental wellness strategies.', category: 'cert' },
  { name: 'Add-On Course: Air Pollution', type: 'Certificate', typeClass: 'typeCert', duration: 'Short-term', fee: 'Free', eligibility: 'Any NMC Student', desc: 'Study of air pollution in urban areas — causes, effects on health, and remedial measures.', category: 'cert' },
  { name: 'Add-On Course: Sound Pollution & Mental Health', type: 'Certificate', typeClass: 'typeCert', duration: 'Short-term', fee: 'Free', eligibility: 'Any NMC Student', desc: 'Understanding noise pollution impacts on mental health and strategies for sound environment management.', category: 'cert' },
  { name: 'Add-On Course: Soil Pollution', type: 'Certificate', typeClass: 'typeCert', duration: 'Short-term', fee: 'Free', eligibility: 'Any NMC Student', desc: 'Study of soil contamination, its health implications, and sustainable agricultural practices.', category: 'cert' },
];

const tabs = [
  { key: 'all', label: 'All Programs' },
  { key: 'ug', label: 'Undergraduate' },
  { key: 'pg', label: 'Postgraduate' },
  { key: 'diploma', label: 'Diploma' },
  { key: 'cert', label: 'Certificate' },
];

export default function AcademicTabs() {
  const [active, setActive] = useState('all');

  const filtered = active === 'all' ? programs : programs.filter(p => p.category === active);

  return (
    <>
      {/* Category Tabs */}
      <div className={styles.categoryTabs}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`${styles.categoryTab} ${active === tab.key ? styles.categoryTabActive : ''}`}
            onClick={() => setActive(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Programs Grid */}
      <div className={styles.programsGrid}>
        {filtered.map((prog, i) => (
          <div className={styles.programCard} key={i}>
            <div className={styles.programCardHeader}>
              <span className={`${styles.programCardType} ${styles[prog.typeClass]}`}>{prog.type}</span>
              <span className={styles.programCardFee}>{prog.fee}</span>
            </div>
            <h3 className={styles.programCardName}>{prog.name}</h3>
            <div className={styles.programCardMeta}>
              <span className={styles.programCardMetaItem}><strong>Duration:</strong> {prog.duration}</span>
              <span className={styles.programCardMetaItem}><strong>Eligibility:</strong> {prog.eligibility}</span>
            </div>
            <p className={styles.programCardDesc}>{prog.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}
