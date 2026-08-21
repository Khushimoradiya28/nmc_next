"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './StudentCorner.module.css';

const noticesData = [
  { id: 1, date: "August 19, 2026", category: "Admission", title: "GCAS Round 1 Merit Registration Guidelines and Cut-Off Lists", file: "gcas_guidelines_2026.pdf" },
  { id: 2, date: "August 15, 2026", category: "Exam", title: "Odd Semester Internal Written Test Schedule (BCA, BBA, B.Com, B.A.)", file: "odd_sem_internal_schedule.pdf" },
  { id: 3, date: "August 10, 2026", category: "Placement", title: "Tata Consultancy Services (TCS) Campus Drive - Registration Open for Batch 2026", file: "tcs_campus_drive.pdf" },
  { id: 4, date: "August 02, 2026", category: "Scholarship", title: "Digital Gujarat Scholarship Schemes Online Form Filling Support Desk", file: "scholarship_helpdesk.pdf" }
];

const portalsData = [
  { name: "GCAS Registration Portal", desc: "Gujarat Common Admission Services central portal.", link: "https://gcas.gujarat.gov.in/" },
  { name: "Digital Gujarat Portal", desc: "Government scholarship registrations for OBC, SC, ST, and EBC students.", link: "https://www.digitalgujarat.gov.in/" },
  { name: "APAAR ID (ABC Bank)", desc: "Academic Bank of Credits central digital registry.", link: "https://www.abc.gov.in/" },
  { name: "MKBU Results Portal", desc: "Official Maharaja Krishnakumarsinhji Bhavnagar University results.", link: "#" },
  { name: "MKBU Syllabus Link", desc: "Download course curriculum frameworks from university.", link: "#" },
  { name: "SWAYAM Online Courses", desc: "Self-learning digital courses with credit transfer.", link: "https://swayam.gov.in/" },
  { name: "NDLI Digital Library", desc: "National Digital Library of India repository.", link: "https://ndl.iitkgp.ac.in/" }
];

const storiesData = [
  { name: "Hardi Trivedi", role: "Software Developer, WIPRO", desc: "NMC's pre-placement grooming sessions and computer practical focus gave me the skills to crack my interview at WIPRO. I am proud to be an alumna.", year: "BCA (Batch 2024)" },
  { name: "Pooja Shah", role: "Business Analyst, HDFC Bank", desc: "The BBA program's leadership challenges, presentation reviews, and guest speakers prepared me for the financial corporate sector.", year: "BBA (Batch 2023)" },
  { name: "Krina Gohil", role: "Assistant Designer, Label Ritu Kumar", desc: "Our fashion design studio and regular boutique visits at NMC were completely aligned with what the industry demands today.", year: "DFD (Batch 2024)" }
];

export default function StudentCorner() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  return (
    <>
      {/* 1. Hero banner */}
      <section className={styles.heroSection}>
        <div className={styles.heroBgImage}>
          <Image
            src="/assets/shared/misc/13.jpg"
            alt="Student Corner Banner"
            fill
            priority
            sizes="100vw"
            className={styles.heroBgImg}
          />
        </div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Student Corner</h1>
          </div>
        </div>
      </section>

      {/* 2. Notice Board & Circulars */}
      <section className={styles.updatesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>Notices &amp; Circulars</span>
            <h2 className={styles.sectionTitle}>Latest Updates <span>&amp; Notice Board</span></h2>
          </div>

          {/* Live Notice Ticker Strip */}
          <div className={styles.tickerBar}>
            <span className={styles.tickerBadge}>Breaking</span>
            <div className={styles.tickerTrack}>
              <div className={styles.tickerText}>
                ⚠️ GCAS Round 1 Merit Admissions open till August 28 • 📚 Odd Semester internal test schedules are released • 📝 Digital Gujarat scholarship desk begins registration assistance in the library...
              </div>
            </div>
          </div>

          {/* Notices Grid */}
          <div className={styles.noticesGrid}>
            {noticesData.map((notice) => (
              <div key={notice.id} className={styles.noticeCard}>
                <div className={styles.noticeHeader}>
                  <span className={styles.noticeDate}>{notice.date}</span>
                  <span className={styles.categoryTag}>{notice.category}</span>
                </div>
                <h3 className={styles.noticeTitle}>{notice.title}</h3>
                <a href={`#download-${notice.id}`} className={styles.pdfBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download PDF ({notice.file})</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Placement & Career Progression */}
      <section className={styles.placementSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>Empowerment Runway</span>
            <h2 className={styles.sectionTitle}>Placement, Training <span>&amp; Career cell</span></h2>
            <p className={styles.sectionDescription}>
              A structured roadmap ensuring every student transitions from classroom learner to corporate professional.
            </p>
          </div>

          <div className={styles.runwayGrid}>
            <div className={styles.runwayCard}>
              <div className={styles.runwayNum}>01</div>
              <h4>Pre-Placement Grooming</h4>
              <p>Personality development, corporate communications, and resume writing starting Semester 4.</p>
            </div>
            <div className={styles.runwayCard}>
              <div className={styles.runwayNum}>02</div>
              <h4>Aptitude &amp; Technical Prep</h4>
              <p>Practical coding tests, logical reasoning, and industry-oriented Excel/Tally certifications.</p>
            </div>
            <div className={styles.runwayCard}>
              <div className={styles.runwayNum}>03</div>
              <h4>Mock Interviews</h4>
              <p>Realistic panel evaluations and HR reviews led by industry managers and alumni experts.</p>
            </div>
            <div className={styles.runwayCard}>
              <div className={styles.runwayNum}>04</div>
              <h4>Campus Recruitments</h4>
              <p>On-campus and pool recruitment drives with MNCs and premier banking corporations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Enterprise Quick Links */}
      <section className={styles.portalsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>Digital Resources</span>
            <h2 className={styles.sectionTitle}>Executive Portals <span>&amp; E-Resources</span></h2>
          </div>

          <div className={styles.portalsGrid}>
            {portalsData.map((portal, idx) => (
              <a href={portal.link} target="_blank" rel="noopener noreferrer" key={idx} className={styles.portalCard}>
                <h4>{portal.name}</h4>
                <p>{portal.desc}</p>
                <span className={styles.portalLink}>
                  <span>Access Portal</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Strategic Vision Roadmap 2030 */}
      <section className={styles.visionSection}>
        <div className={styles.container}>
          <div className={styles.visionGrid}>
            <div>
              <span className={styles.sectionSubtitle}>Strategic Milestones</span>
              <h2 className={styles.sectionTitle}>Future Roadmap <span>NMC Vision 2030</span></h2>
              <p className={styles.visionText}>
                We are committed to upgrading our institutional capabilities, expanding academic disciplines, and driving community impact over the next decade.
              </p>

              <div className={styles.milestonesList}>
                <div className={styles.milestone}>
                  <strong>NAAC Accreditation</strong>
                  <p>Attaining A-Grade status for institutional and academic frameworks.</p>
                </div>
                <div className={styles.milestone}>
                  <strong>Global Research MoUs</strong>
                  <p>Expanding collaborations with international vocational institutions.</p>
                </div>
                <div className={styles.milestone}>
                  <strong>AI &amp; Data Science Studio</strong>
                  <p>Launching specialized computational intelligence classrooms.</p>
                </div>
              </div>
            </div>

            <div className={styles.visionTerminal}>
              <h4>Vision Core Objective</h4>
              <p>Empowering rural and urban women with future-ready skills, leading with gender equality values.</p>
              <ul>
                <li>✔ 100% Free Bus Support Continuation</li>
                <li>✔ Free Blazer Gift for Professional Presence</li>
                <li>✔ Global Industry Placement Partnerships</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Alumni Network & Guild */}
      <section className={styles.alumniSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>Global Sisterhood Guild</span>
            <h2 className={styles.sectionTitle}>Alumni Success <span>Stories</span></h2>
          </div>

          <div className={styles.alumniGrid}>
            {storiesData.map((story, idx) => (
              <div key={idx} className={styles.storyCard}>
                <p>"{story.desc}"</p>
                <div className={styles.storyAuthor}>
                  <strong>{story.name}</strong>
                  <span>{story.role} • {story.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

