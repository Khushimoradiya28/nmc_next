import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import TimelineSection from './TimelineSection';
import styles from './page.module.css';

export const metadata = {
  title: 'NAAC | Accreditation & Quality Assurance | Nandkunvarba Mahila College',
  description: 'NAAC accreditation details, 7 assessment criteria, AQAR submissions, quality initiatives, and institutional excellence at Nandkunvarba Mahila College, Bhavnagar.',
};

export default function NAACPage() {
  const criteria = [
    {
      num: '01',
      title: 'Curricular Aspects',
      desc: 'Curriculum design aligned with NEP 2020, outcome-based education, continuous feedback from stakeholders, and integration of vocational and skill-based courses.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          <line x1="9" y1="7" x2="16" y2="7"/>
          <line x1="9" y1="11" x2="14" y2="11"/>
        </svg>
      ),
      color: '#8a0000'
    },
    {
      num: '02',
      title: 'Teaching-Learning & Evaluation',
      desc: 'Student-centric pedagogies, ICT-enabled smart classrooms, mentor-mentee ratios, transparent evaluation, and continuous assessment reforms.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      ),
      color: '#d97706'
    },
    {
      num: '03',
      title: 'Research, Innovations & Extension',
      desc: 'Faculty publications in UGC-CARE journals, research seed grants, MoU collaborations, patent filings, and community extension activities.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="11" y1="8" x2="11" y2="14"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      ),
      color: '#059669'
    },
    {
      num: '04',
      title: 'Infrastructure & Learning Resources',
      desc: 'State-of-the-art labs, high-speed WiFi campus, digital library access (INFLIBNET/N-LIST), smart classrooms, and sports infrastructure.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18"/>
          <path d="M9 21V9"/>
        </svg>
      ),
      color: '#0284c7'
    },
    {
      num: '05',
      title: 'Student Support & Progression',
      desc: 'Scholarship disbursements, counseling services, placement cell activities, entrepreneurship development, alumni engagement, and career mentoring.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      color: '#7c3aed'
    },
    {
      num: '06',
      title: 'Governance, Leadership & Management',
      desc: 'Decentralized governance, strategic institutional planning, e-governance adoption, faculty welfare, and transparent financial management.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      ),
      color: '#dc2626'
    },
    {
      num: '07',
      title: 'Institutional Values & Best Practices',
      desc: 'Gender sensitization, environmental sustainability, waste management, solar energy, divyangjan facilities, and institutional distinctiveness.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
      color: '#b45309'
    }
  ];

  const aqarData = [
    { year: '2024 – 2025', status: 'Under Review', statusClass: styles.statusPending, file: '#' },
    { year: '2023 – 2024', status: 'Submitted', statusClass: styles.statusSubmitted, file: '#' },
    { year: '2022 – 2023', status: 'Approved', statusClass: styles.statusApproved, file: '#' },
    { year: '2021 – 2022', status: 'Approved', statusClass: styles.statusApproved, file: '#' },
    { year: '2020 – 2021', status: 'Approved', statusClass: styles.statusApproved, file: '#' },
  ];

  return (
    <>
      <Header />
      <main className={styles.naacPage}>
        {/* ═══════════════ HERO — Matching Theme Banner ═══════════════ */}
        <section className="hero-fullscreen" style={{ minHeight: '35vh', height: '35vh' }}>
          <div className="hero-bg-image">
            <Image
              src="/assets/banners/vision_mission_banner.jpg"
              alt="NAAC Accreditation - Nandkunvarba Mahila College Campus"
              fill
              style={{ objectFit: 'cover' }}
              className="hero-bg-img"
              priority
            />
          </div>
          <div className="hero-overlay"></div>
          <div className="hero-content container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', paddingBottom: '45px' }}>
            <h1 className="hero-main-title" style={{ color: '#fff', margin: '0 0 0.5rem 0', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.02em' }}>
              NAAC <em style={{ color: 'var(--color-secondary, #F4B000)' }}>Accreditation</em>
            </h1>
            <nav aria-label="breadcrumb">
              <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '0.5rem', color: 'var(--color-secondary, #f4b000)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                <li><Link href="/" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Home</Link></li>
                <li style={{ color: 'rgba(255,255,255,0.4)' }}>/</li>
                <li><Link href="/iqac" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>IQAC</Link></li>
                <li style={{ color: 'rgba(255,255,255,0.4)' }}>/</li>
                <li aria-current="page" style={{ color: 'var(--color-secondary, #F4B000)' }}>NAAC</li>
              </ol>
            </nav>
          </div>
        </section>

        {/* ═══════════════ ABOUT NAAC ═══════════════ */}
        <section className={styles.aboutSection}>
          <div className={styles.container}>
            <div className={styles.aboutGrid}>
              <div className={styles.aboutContent}>
                <div className={styles.sectionTag}>
                  <span className={styles.tagDot}></span>
                  About NAAC
                </div>
                <h2 className={styles.sectionTitle}>
                  What is <span>NAAC?</span>
                </h2>
                <p className={styles.aboutText}>
                  The National Assessment and Accreditation Council (NAAC) is an autonomous body established by the University Grants Commission (UGC) to assess and accredit institutions of higher education in India. NAAC evaluates institutions based on seven key criteria that collectively measure the quality and effectiveness of teaching, governance, research, and student development.
                </p>
                <p className={styles.aboutText}>
                  Nandkunvarba Mahila College actively participates in the NAAC assessment cycle, maintaining rigorous documentation, transparent governance, and continuous quality improvements across all departments.
                </p>
              </div>

              <div className={styles.aboutVisual}>
                <div className={styles.aboutCard}>
                  <div className={styles.aboutCardGlow}></div>
                  <div className={styles.aboutCardInner}>
                    <div className={styles.naacEmblem}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 15l-2 5l9-11h-5l2-5L7 15h5z"/>
                      </svg>
                    </div>
                    <h3 className={styles.aboutCardTitle}>Quality Assurance</h3>
                    <p className={styles.aboutCardDesc}>Institutional commitment to academic excellence and continuous improvement</p>
                    
                    <div className={styles.aboutStatsRow}>
                      <div className={styles.aboutStat}>
                        <strong>7</strong>
                        <span>Criteria</span>
                      </div>
                      <div className={styles.aboutStatDivider}></div>
                      <div className={styles.aboutStat}>
                        <strong>Annual</strong>
                        <span>AQAR Filing</span>
                      </div>
                      <div className={styles.aboutStatDivider}></div>
                      <div className={styles.aboutStat}>
                        <strong>360°</strong>
                        <span>Feedback</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ ACCREDITATION STATUS ═══════════════ */}
        <section className={styles.statusSection}>
          <div className={styles.container}>
            <div className={styles.statusCard}>
              <div className={styles.statusCardGlow}></div>
              <div className={styles.statusGrid}>
                <div className={styles.statusLeft}>
                  <div className={styles.sectionTag}>
                    <span className={styles.tagDot}></span>
                    Accreditation Status
                  </div>
                  <h2 className={styles.statusTitle}>Current NAAC Status</h2>
                  <p className={styles.statusDesc}>
                    Nandkunvarba Mahila College maintains active IQAC operations and submits Annual Quality Assurance Reports (AQAR) as per NAAC guidelines. The institution is committed to achieving and maintaining high accreditation standards.
                  </p>
                </div>
                <div className={styles.statusRight}>
                  <div className={styles.statusMetrics}>
                    <div className={styles.metricCard}>
                      <div className={styles.metricIconWrap}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                      </div>
                      <div className={styles.metricInfo}>
                        <strong>Active</strong>
                        <span>IQAC Cell</span>
                      </div>
                    </div>
                    <div className={styles.metricCard}>
                      <div className={styles.metricIconWrap}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                        </svg>
                      </div>
                      <div className={styles.metricInfo}>
                        <strong>Annual</strong>
                        <span>AQAR Reports</span>
                      </div>
                    </div>
                    <div className={styles.metricCard}>
                      <div className={styles.metricIconWrap}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      </div>
                      <div className={styles.metricInfo}>
                        <strong>7 Pillars</strong>
                        <span>Quality Matrix</span>
                      </div>
                    </div>
                    <div className={styles.metricCard}>
                      <div className={styles.metricIconWrap}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      </div>
                      <div className={styles.metricInfo}>
                        <strong>UGC</strong>
                        <span>Compliant</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ 7 CRITERIA ═══════════════ */}
        <section className={styles.criteriaSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTag}>
                <span className={styles.tagDot}></span>
                Assessment Framework
              </div>
              <h2 className={styles.sectionTitle}>
                The 7 Key <span>Assessment Criteria</span>
              </h2>
              <p className={styles.sectionSubtext}>
                Every academic year, institutional performance is meticulously evaluated across seven critical criteria mandated by the NAAC framework for comprehensive quality assessment.
              </p>
            </div>

            <div className={styles.criteriaRow}>
              {criteria.slice(0, 4).map((item, idx) => (
                <div
                  className={styles.criteriaCard}
                  key={idx}
                  style={{ '--card-accent': item.color }}
                >
                  <div className={styles.criteriaCardTop}>
                    <div className={styles.criteriaIconWrap}>
                      {item.icon}
                    </div>
                    <span className={styles.criteriaNum}>{item.num}</span>
                  </div>
                  <h3 className={styles.criteriaTitle}>{item.title}</h3>
                  <p className={styles.criteriaDesc}>{item.desc}</p>
                  <div className={styles.criteriaCardLine}></div>
                </div>
              ))}
            </div>
            <div className={styles.criteriaRowCentered}>
              {criteria.slice(4).map((item, idx) => (
                <div
                  className={styles.criteriaCard}
                  key={idx + 4}
                  style={{ '--card-accent': item.color }}
                >
                  <div className={styles.criteriaCardTop}>
                    <div className={styles.criteriaIconWrap}>
                      {item.icon}
                    </div>
                    <span className={styles.criteriaNum}>{item.num}</span>
                  </div>
                  <h3 className={styles.criteriaTitle}>{item.title}</h3>
                  <p className={styles.criteriaDesc}>{item.desc}</p>
                  <div className={styles.criteriaCardLine}></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ QUALITY INITIATIVES TIMELINE ═══════════════ */}
        <TimelineSection />

        {/* ═══════════════ AQAR DOWNLOADS ═══════════════ */}
        <section className={styles.aqarSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTag}>
                <span className={styles.tagDot}></span>
                Compliance Archives
              </div>
              <h2 className={styles.sectionTitle}>
                AQAR Annual <span>Submissions</span>
              </h2>
              <p className={styles.sectionSubtext}>
                Access and review the official Annual Quality Assurance Reports submitted by the IQAC to the NAAC portal.
              </p>
            </div>

            <div className={styles.aqarTableWrap}>
              <div className={styles.aqarTableGlow}></div>
              <table className={styles.aqarTable}>
                <thead>
                  <tr>
                    <th>Academic Session</th>
                    <th>Document Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {aqarData.map((row, idx) => (
                    <tr key={idx}>
                      <td className={styles.aqarYear}>{row.year}</td>
                      <td className={styles.aqarDoc}>Annual Quality Assurance Report (AQAR)</td>
                      <td>
                        <span className={`${styles.aqarStatus} ${row.statusClass}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>
                        <a href={row.file} className={styles.aqarDownloadBtn}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                          </svg>
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
