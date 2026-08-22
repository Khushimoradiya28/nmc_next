"use client";

import React, { useState } from 'react';
import styles from './page.module.css';

const MEMBERS = [
  {
    id: 1,
    name: 'Dr. Principal',
    role: 'Chairperson',
    tier: 'Executive Leadership',
    desc: 'Provides overarching institutional leadership, presides over IQAC strategic planning, and approves all internal quality policies and academic development frameworks.',
    responsibilities: ['Strategic Direction', 'Institutional Governance', 'Policy Approvals'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
      </svg>
    )
  },
  {
    id: 2,
    name: 'Senior Faculty Member',
    role: 'IQAC Coordinator',
    tier: 'Core Administration',
    desc: 'Spearheads academic quality audits, coordinates NAAC and AQAR compliance documentation, and drives continuous benchmarking across all departments.',
    responsibilities: ['AQAR & NAAC Audits', 'Quality Benchmarking', 'Faculty Coordination'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7"></circle>
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
      </svg>
    )
  },
  {
    id: 3,
    name: 'Faculty Rep. — Arts',
    role: 'Department Member',
    tier: 'Academic Representation',
    desc: 'Liaises with Humanities and Social Sciences departments to promote innovative pedagogical models, student mentoring, and cultural enrichment activities.',
    responsibilities: ['Pedagogical Innovations', 'Arts Curriculum Review', 'Student Mentoring'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    )
  },
  {
    id: 4,
    name: 'Faculty Rep. — Commerce',
    role: 'Department Member',
    tier: 'Academic Representation',
    desc: 'Monitors commerce and management syllabi alignment, industry certification workshops, financial literacy programs, and commerce student career readiness.',
    responsibilities: ['Commerce Syllabi Review', 'Financial Literacy', 'Skill Certification'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    )
  },
  {
    id: 5,
    name: 'Faculty Rep. — BCA & IT',
    role: 'Technical Member',
    tier: 'Technical Representation',
    desc: 'Oversees smart campus digitization, computer laboratory standards, LMS platform efficiency, and technology-driven pedagogy enhancements.',
    responsibilities: ['Digital Campus Tools', 'Computer Lab Upgrades', 'E-Learning Protocols'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    )
  },
  {
    id: 6,
    name: 'Management Representative',
    role: 'Trustee Member',
    tier: 'Institutional Management',
    desc: 'Ensures budgetary provisioning, resource allocation for quality infrastructure, faculty welfare initiatives, and institutional expansion projects.',
    responsibilities: ['Resource Provisioning', 'Infrastructure Expansion', 'Budgetary Support'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    )
  },
  {
    id: 7,
    name: 'Alumni Representative',
    role: 'External Stakeholder',
    tier: 'Alumni Network',
    desc: 'Contributes graduate perspective, career progression insights, and helps foster meaningful alumni mentorship networks for outgoing students.',
    responsibilities: ['Graduate Insights', 'Career Mentoring', 'Alumni Feedback'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    )
  },
  {
    id: 8,
    name: 'Industry Expert',
    role: 'Corporate Advisor',
    tier: 'Industry Interface',
    desc: 'Advises the council on corporate demands, practical industry skills, internship opportunities, and modern workplace readiness for women graduates.',
    responsibilities: ['Industry Alignment', 'Placement Guidance', 'Corporate Seminars'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    )
  },
  {
    id: 9,
    name: 'Administrative Staff',
    role: 'Office Superintendent',
    tier: 'Administration & Operations',
    desc: 'Ensures efficient administrative workflows, student enrollment tracking, record digitization, and seamless logistical execution of IQAC directives.',
    responsibilities: ['Administrative Audits', 'Record Digitization', 'Workflow Efficiency'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    )
  },
  {
    id: 10,
    name: 'Student Representative',
    role: 'Student Member',
    tier: 'Student Welfare & Voice',
    desc: 'Articulates student suggestions, campus life welfare requirements, student club initiatives, and library facility feedback to the committee.',
    responsibilities: ['Student Council Voice', 'Welfare Feedback', 'Campus Amenities'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    )
  },
];

export default function CommitteeSpotlight() {
  const [active, setActive] = useState(0);

  const handlePrev = () => {
    setActive((prev) => (prev === 0 ? MEMBERS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActive((prev) => (prev === MEMBERS.length - 1 ? 0 : prev + 1));
  };

  const currentMember = MEMBERS[active];

  return (
    <section className={styles.compSection} id="composition-of-iqac">
      <div className={styles.container}>
        
        {/* Section Header */}
        <div className={styles.compHeaderBlock}>
          <div className={styles.compBadge}>
            <span className={styles.compBadgeDot}></span>
            <span>Governance &amp; Leadership</span>
          </div>
          <h2 className={styles.compTitle}>
            Composition of <span className={styles.compTitleAccent}>IQAC Committee</span>
          </h2>
          <p className={styles.compSubtitle}>
            A dedicated multi-stakeholder council comprising academic leaders, department representatives, management trustees, and student mentors working synchronously for institutional excellence.
          </p>
        </div>

        {/* Clean Centered Spotlight Feature Card (Without Left Scroll List) */}
        <div className={styles.compConsoleWrapperCentered}>
          
          <div className={styles.compSpotlightCardFull}>
            
            {/* Background Subtle Watermark Number */}
            <span className={styles.compBgNum} key={active}>
              {String(active + 1).padStart(2, '0')}
            </span>

            {/* Top Meta Bar */}
            <div className={styles.spotlightTopMeta}>
              <div className={styles.spotlightMemberBadge}>
                <span>Member {String(active + 1).padStart(2, '0')} of {MEMBERS.length}</span>
              </div>
              <span className={styles.spotlightTierTag}>{currentMember.tier}</span>
            </div>

            {/* Main Role Profile Info */}
            <div className={styles.spotlightProfile}>
              <div className={styles.spotlightIconWrap}>
                {currentMember.icon}
              </div>
              <div className={styles.spotlightHeadingWrap}>
                <span className={styles.spotlightRoleLabel}>{currentMember.role}</span>
                <h3 className={styles.spotlightName}>{currentMember.name}</h3>
              </div>
            </div>

            {/* Mandate & Description */}
            <div className={styles.spotlightDescBox}>
              <h4 className={styles.spotlightDescTitle}>Council Mandate &amp; Role</h4>
              <p className={styles.spotlightDescText}>{currentMember.desc}</p>
            </div>

            {/* Core Responsibilities Chips */}
            <div className={styles.spotlightRespBlock}>
              <h4 className={styles.spotlightRespTitle}>Key Focus Areas</h4>
              <div className={styles.spotlightTags}>
                {currentMember.responsibilities.map((resp, idx) => (
                  <span key={idx} className={styles.spotlightTag}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {resp}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Pagination & Navigation Controls */}
            <div className={styles.spotlightFooterControls}>
              <div className={styles.spotlightProgressDots}>
                {MEMBERS.map((m, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setActive(dotIdx)}
                    className={`${styles.spotlightDot} ${dotIdx === active ? styles.spotlightDotActive : ''}`}
                    aria-label={`Go to ${m.name}`}
                    title={m.name}
                  />
                ))}
              </div>

              <div className={styles.spotlightArrows}>
                <button
                  type="button"
                  onClick={handlePrev}
                  className={styles.spotlightNavBtn}
                  aria-label="Previous member"
                  title="Previous Member"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className={styles.spotlightNavBtn}
                  aria-label="Next member"
                  title="Next Member"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
