"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import styles from './page.module.css';

// 16 Experienced Faculty Members for a full 4x4 grid layout mapped to the departments
const FACULTY_DATA = [
  {
    id: 1,
    name: 'Dr. Samkit Shah',
    role: 'I/C Principal & Professor',
    qualification: 'Ph.D., M.Com, M.Phil • 15+ Yrs Experience',
    departments: ['M.Com.', 'B.Com.'],
    badge: 'Institutional Leader',
    badgeType: 'ruby',
    image: '/assets/team/samkit.jpg',
    specializations: ['Commerce', 'Management', 'Research']
  },
  {
    id: 2,
    name: 'Mehulkumar Bhatt',
    role: 'I/C Principal & Administrator',
    qualification: 'M.Com, M.Phil • Corporate Finance Expert',
    departments: ['B.B.A.', 'B.Com.', 'M.Com.'],
    badge: 'Senior Leadership',
    badgeType: 'gold',
    image: '/assets/team/mehul.jpg',
    specializations: ['Finance', 'Administration', 'Economics']
  },
  {
    id: 3,
    name: 'Ankita R. Patel',
    role: 'Principal & Chief Co-ordinator',
    qualification: 'M.A., B.Ed • Women Empowerment Lead',
    departments: ['B.A.', 'M.A.'],
    badge: 'Student Welfare',
    badgeType: 'azure',
    image: '/assets/team/ankita.jpg',
    specializations: ['Humanities', 'Mentorship', 'Co-ordination']
  },
  {
    id: 4,
    name: 'Dipak Makwana',
    role: 'Academic Co-ordinator & IT Head',
    qualification: 'M.C.A., M.Phil • Software Architect',
    departments: ['B.C.A.'],
    badge: 'IT & Academics',
    badgeType: 'purple',
    image: '/assets/team/dipak.jpg',
    specializations: ['BCA & IT', 'Software', 'Curriculum']
  },
  {
    id: 5,
    name: 'Dr. Priya Sharma',
    role: 'Senior Professor',
    qualification: 'Ph.D. in English, M.A. • 12+ Yrs Experience',
    departments: ['B.A.', 'M.A.'],
    badge: 'Senior Mentor',
    badgeType: 'ruby',
    image: '/assets/team/ankita.jpg',
    specializations: ['English Lit', 'Linguistics', 'Poetry']
  },
  {
    id: 6,
    name: 'Prof. Rajesh Mehta',
    role: 'Associate Professor',
    qualification: 'MBA, B.B.A. • Marketing Strategist',
    departments: ['B.B.A.'],
    badge: 'Business Head',
    badgeType: 'gold',
    image: '/assets/team/mehul.jpg',
    specializations: ['Marketing', 'Strategy', 'Consumer Behavior']
  },
  {
    id: 7,
    name: 'Dr. Neha Vyas',
    role: 'Assistant Professor',
    qualification: 'Ph.D. in CS, M.C.A. • Cloud Computing Lead',
    departments: ['B.C.A.'],
    badge: 'IT Faculty',
    badgeType: 'purple',
    image: '/assets/team/ankita.jpg',
    specializations: ['Database', 'Web Tech', 'Cloud Computing']
  },
  {
    id: 8,
    name: 'Prof. Hitesh Dave',
    role: 'Senior Lecturer',
    qualification: 'M.Com, Chartered Accountant (Inter)',
    departments: ['B.Com.', 'M.Com.'],
    badge: 'Accountancy Head',
    badgeType: 'azure',
    image: '/assets/team/samkit.jpg',
    specializations: ['Taxation', 'Auditing', 'Accounting']
  },
  {
    id: 9,
    name: 'Ms. Kinjal Shah',
    role: 'Design Lead & Instructor',
    qualification: 'Master in Fashion Technology (NIFT)',
    departments: ['F.D.'],
    badge: 'Design Expert',
    badgeType: 'gold',
    image: '/assets/team/ankita.jpg',
    specializations: ['Garment Construction', 'Pattern Making', 'Styling']
  },
  {
    id: 10,
    name: 'Dr. Ramesh Gohel',
    role: 'Social Science Head',
    qualification: 'Ph.D., M.S.W. • Community Welfare Lead',
    departments: ['M.S.W.'],
    badge: 'Social Worker',
    badgeType: 'ruby',
    image: '/assets/team/dipak.jpg',
    specializations: ['Counseling', 'NGO Management', 'Social Policy']
  },
  {
    id: 11,
    name: 'Prof. Sneha Trivedi',
    role: 'Admin Coordinator',
    qualification: 'Master of Public Administration (PGDPA)',
    departments: ['PGDPA'],
    badge: 'Public Relations',
    badgeType: 'azure',
    image: '/assets/team/ankita.jpg',
    specializations: ['Administration', 'Governance', 'HR Policies']
  },
  {
    id: 12,
    name: 'Mrs. Bharti Vala',
    role: 'Nursing Supervisor',
    qualification: 'B.Sc. Nursing, DMPHW Training Expert',
    departments: ['DMPHW'],
    badge: 'Healthcare Lead',
    badgeType: 'purple',
    image: '/assets/team/ankita.jpg',
    specializations: ['Nursing', 'Health Audits', 'First Aid']
  },
  {
    id: 13,
    name: 'Dr. Jyoti Joshi',
    role: 'Literature Expert',
    qualification: 'Ph.D., M.A. • Folklore Researcher',
    departments: ['B.A.', 'M.A.'],
    badge: 'Language Head',
    badgeType: 'gold',
    image: '/assets/team/ankita.jpg',
    specializations: ['Gujarati Lit', 'History', 'Culture']
  },
  {
    id: 14,
    name: 'Prof. Manish Parmar',
    role: 'Assistant Professor',
    qualification: 'M.C.A., B.C.A. • Full Stack Developer',
    departments: ['B.C.A.'],
    badge: 'IT Mentor',
    badgeType: 'purple',
    image: '/assets/team/dipak.jpg',
    specializations: ['React Native', 'Node.js', 'Programming']
  },
  {
    id: 15,
    name: 'Ms. Riddhi Mehta',
    role: 'Art Director & Lecturer',
    qualification: 'B.F.A., Diploma in Apparel Designing',
    departments: ['F.D.'],
    badge: 'Apparel Designer',
    badgeType: 'ruby',
    image: '/assets/team/ankita.jpg',
    specializations: ['Art & Sketching', 'Textiles', 'Illustrations']
  },
  {
    id: 16,
    name: 'Dr. Vikram Rathod',
    role: 'Commerce Research Mentor',
    qualification: 'Ph.D., M.Com. • 10+ Research Publications',
    departments: ['B.Com.', 'M.Com.'],
    badge: 'Research Head',
    badgeType: 'azure',
    image: '/assets/team/samkit.jpg',
    specializations: ['Statistics', 'Methodology', 'Business Laws']
  }
];

export default function Page() {
  const [selectedDept, setSelectedDept] = useState('all');

  // Filter faculty members dynamically
  const filteredFaculty = selectedDept === 'all'
    ? FACULTY_DATA
    : FACULTY_DATA.filter(fac => fac.departments.includes(selectedDept));

  return (
    <>
      <Header />
      <main style={{ paddingTop: 0 }}>

        {/* HERO BANNER */}
        <section className={`${styles.heroFullscreen} hero-fullscreen`} id="home" style={{ minHeight: '50vh', height: '50vh' }}>
          <div className={`${styles.heroBgImage} hero-bg-image`}>
            <Image src="/assets/hero/hero-section.png" alt="Academic Banner" width={1400} height={700} className={`${styles.heroBgImg} hero-bg-img`} priority />
          </div>
          <div className={`${styles.heroOverlay} hero-overlay`} style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))' }}></div>
          <div className={`${styles.heroContent} hero-content`} style={{ paddingTop: '100px', display: 'flex', alignItems: 'flex-end', height: '100%', paddingBottom: '80px' }}>
            <h1 className={`${styles.heroMainTitle} hero-main-title`} style={{ fontSize: '60px', fontWeight: '600' }}><em>Academic</em></h1>
          </div>
        </section>

        {/* EXPERIENCED FACULTY SPOTLIGHT */}
        <section className={`${styles.sectionPadding} ${styles.facultySpotlightSection} section-padding faculty-spotlight-section`} id="faculty" style={{ background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)" }}>
          <div className={`${styles.container} container`}>
            <div className={`${styles.sectionHeader} section-header`}>
              <div className={`${styles.sectionSubtitle} section-subtitle`}>Academic Leadership</div>
              <h2 className={`${styles.sectionTitle} section-title`}>Experienced <span>Faculty & Mentors</span></h2>
              <p className={`${styles.sectionDescription} section-description`}>Distinguished academic scholars, Ph.D. holders, and dedicated mentors committed to empowering every student.</p>
            </div>

            {/* Department Tabs */}
            <div style={{
              marginBottom: "3rem",
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "0.5rem",
              position: "relative",
              zIndex: 10
            }}>
              {[
                { value: "all", label: "All" },
                { value: "B.A.", label: "B.A." },
                { value: "B.B.A.", label: "B.B.A." },
                { value: "B.C.A.", label: "B.C.A." },
                { value: "B.Com.", label: "B.Com." },
                { value: "F.D.", label: "F.D." },
                { value: "M.Com.", label: "M.Com." },
                { value: "M.S.W.", label: "M.S.W." },
                { value: "PGDPA", label: "PGDPA" },
                { value: "DMPHW", label: "DMPHW" },
                { value: "M.A.", label: "M.A." },
              ].map((dept) => (
                <button
                  key={dept.value}
                  onClick={() => setSelectedDept(dept.value)}
                  style={{
                    padding: "0.55rem 1.25rem",
                    borderRadius: "2rem",
                    border: selectedDept === dept.value ? "1px solid #8a0000" : "1px solid #e2e8f0",
                    background: selectedDept === dept.value ? "#8a0000" : "#ffffff",
                    color: selectedDept === dept.value ? "#ffffff" : "var(--gray-700)",
                    fontWeight: "700",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    boxShadow: selectedDept === dept.value ? "0 4px 12px rgba(138,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.03)",
                  }}
                >
                  {dept.label}
                </button>
              ))}
            </div>

            {/* Dynamic Grid Layout */}
            <div className={`${styles.facultyExecutiveGrid} faculty-executive-grid`} style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center" }}>
              {filteredFaculty.map(fac => (
                <div key={fac.id} className={`${styles.facultyExecCard} ${styles.spotlightActive} faculty-exec-card spotlight-active`} style={{ width: "354px", height: "340px", flexShrink: 0 }}>
                  <div className={`${styles.facultyExecMedia} faculty-exec-media`} style={{ width: "100%", height: "100%", position: "relative" }}>
                    <Image src={fac.image} alt={`${fac.name} - ${fac.role}`} fill style={{ objectFit: 'cover' }} className={`${styles.facultyExecImg} faculty-exec-img`} />
                    <span className={`${styles.facultyBadge} ${fac.badgeType === 'ruby' ? styles.badgeRuby : fac.badgeType === 'gold' ? styles.badgeGold : fac.badgeType === 'azure' ? styles.badgeAzure : styles.badgePurple} faculty-badge`}>
                      {fac.badge}
                    </span>
                    <div className={`${styles.facultyExecOverlay} faculty-exec-overlay`}>
                      <div className={`${styles.facultyExecInfo} faculty-exec-info`}>
                        <span className={`${styles.facultyExecRole} faculty-exec-role`}>{fac.role}</span>
                        <h3 className={`${styles.facultyExecName} faculty-exec-name`}>{fac.name}</h3>
                        <div className={`${styles.facultyExecDetails} faculty-exec-details`}>
                          <p className={`${styles.facultyExecQual} faculty-exec-qual`}>{fac.qualification}</p>
                          <div className={`${styles.facultySpecializationTags} faculty-specialization-tags`}>
                            {fac.specializations.map((spec, i) => (
                              <span key={i} className={`${styles.fspecTag} fspec-tag`}>{spec}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredFaculty.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--gray-500)", fontWeight: "600" }}>
                No faculty members listed under the selected department.
              </div>
            )}
          </div>
        </section>

        {/* Back to Top Button */}
        <button className={`${styles.backToTopBtn} back-to-top-btn`} id="backToTop" aria-label="Scroll to top" title="Scroll to top">
          <svg className={`${styles.progressRingSvg} progress-ring-svg`} width="46" height="46" viewBox="0 0 46 46">
            <circle className={`${styles.progressRingTrack} progress-ring-track`} cx="23" cy="23" r="20" fill="none" strokeWidth="3" />
            <circle className={`${styles.progressRingFill} progress-ring-fill`} id="progressRingFill" cx="23" cy="23" r="20" fill="none" strokeWidth="3"
              strokeDasharray="125.66" strokeDashoffset="125.66" />
          </svg>
          <span className={`${styles.backToTopArrow} back-to-top-arrow`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </span>
        </button>

      </main>
      <Footer />
    </>
  );
}
