import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import styles from './page.module.css';

// Helper to format title based on slug
const getFormatTitle = (slug) => {
  switch (slug) {
    case 'vision-mission': return 'Vision / Mission';
    case 'composition-of-iqac': return 'Composition of IQAC';
    case 'strategies-benefits-functions': return 'Strategies / Benefits / Functions';
    case 'conferences-fdp-workshops': return 'Conferences / FDP / workshops';
    case 'naac': return 'NAAC';
    case 'nirf': return 'NIRF';
    default: return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || '';
  const title = getFormatTitle(slug);
  return {
    title: `${title} | IQAC | Nandkunvarba Mahila College`,
  };
}

export default async function IQACSubPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || '';
  
  const pageTitle = getFormatTitle(slug);

  // Dynamic contents based on page slug
  const getContentData = () => {
    switch (slug) {
      case 'strategies-benefits-functions':
        return {
          subtitle: "IQAC Quality Roadmaps & Operational Framework",
          description: "The Internal Quality Assurance Cell (IQAC) functions as the central driving force at Nandkunvarba Mahila College, institutionalizing quality benchmarks, modern pedagogies, transparent evaluation, and continuous 360° stakeholder audits.",
          isCustomLayout: true,
          details: (
            <>
              {/* Executive Intro Banner */}
              <div className={styles.execBannerCard}>
                <div className={styles.execBadgeRow}>
                  <div className={styles.execBadge}>
                    <span className={styles.execBadgeDot}></span>
                    <span>Quality Mandate &amp; Framework</span>
                  </div>
                </div>
                <h2 className={styles.execHeading}>
                  IQAC Strategies, Key Benefits &amp; <span>Operational Functions</span>
                </h2>
                <p className={styles.execDescription}>
                  The Internal Quality Assurance Cell (IQAC) serves as the primary catalytic wing of Nandkunvarba Mahila College, ensuring conscious, consistent, and systemic improvements in academic performance, administrative efficiency, and institutional governance.
                </p>
                <div className={styles.execKpiRow}>
                  <div className={styles.execKpiItem}>
                    <strong className={styles.execKpiNum}>100%</strong>
                    <span className={styles.execKpiLabel}>Curriculum &amp; NEP Aligned</span>
                  </div>
                  <div className={styles.execKpiItem}>
                    <strong className={styles.execKpiNum}>Quarterly</strong>
                    <span className={styles.execKpiLabel}>Academic Audits (AAA)</span>
                  </div>
                  <div className={styles.execKpiItem}>
                    <strong className={styles.execKpiNum}>360°</strong>
                    <span className={styles.execKpiLabel}>Stakeholder Feedback Loop</span>
                  </div>
                  <div className={styles.execKpiItem}>
                    <strong className={styles.execKpiNum}>Annual</strong>
                    <span className={styles.execKpiLabel}>NAAC AQAR Submissions</span>
                  </div>
                </div>
              </div>

              {/* 1. STRATEGIES SECTION */}
              <div className={styles.sectionHeaderWrap}>
                <span className={styles.sectionMiniTag}>Core Pillars</span>
                <h3 className={styles.sectionMainHeading}>Institutional Quality Strategies</h3>
                <p className={styles.sectionSubtext}>
                  Structured roadmaps designed to ensure timely, efficient, and progressive execution of institutional goals.
                </p>
              </div>

              <div className={styles.strategiesGrid}>
                {[
                  {
                    idx: '01',
                    title: 'Curriculum & Pedagogical Rigor',
                    desc: 'Timely, efficient, and progressive execution of the academic calendar, Outcome-Based Education (OBE), and Bloom’s taxonomy mapping across all departments.',
                    tag: 'Academic Excellence'
                  },
                  {
                    idx: '02',
                    title: 'Technology Integration & ICT Classrooms',
                    desc: 'Equitable access to modern ICT-enabled smart classrooms, Google Workspace tools, digital library portals (INFLIBNET/N-LIST), and LMS resources.',
                    tag: 'Smart Learning'
                  },
                  {
                    idx: '03',
                    title: 'Objective & Transparent Evaluation',
                    desc: 'Ensuring credibility and fairness in continuous internal assessments, transparent grading rubrics, and rapid student grievance redressal channels.',
                    tag: 'Assessment Integrity'
                  },
                  {
                    idx: '04',
                    title: 'Research, Innovation & Publications',
                    desc: 'Incentivizing faculty research in UGC-CARE and Scopus indexed journals, providing institutional seed grants, and promoting student research projects.',
                    tag: 'Scholarly Research'
                  },
                  {
                    idx: '05',
                    title: 'Infrastructure & Resource Optimization',
                    desc: 'Optimal allocation and modernization of institutional resources, state-of-the-art computer labs, high-speed campus WiFi, and sports facilities.',
                    tag: 'Campus Assets'
                  },
                  {
                    idx: '06',
                    title: 'Industry Partnerships & Career MoUs',
                    desc: 'Signing active MOUs with corporate organizations, skill academies, and industrial bodies to facilitate student internships and placement drives.',
                    tag: 'Industry Linkages'
                  }
                ].map((item, i) => (
                  <div className={styles.strategyCard} key={i}>
                    <div className={styles.strategyCardHeader}>
                      <div className={styles.strategyIconWrap}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 11 12 14 22 4" />
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                      </div>
                      <span className={styles.strategyIndex}>{item.idx}</span>
                    </div>
                    <h4 className={styles.strategyTitle}>{item.title}</h4>
                    <p className={styles.strategyDesc}>{item.desc}</p>
                    <span className={styles.strategyTag}>{item.tag}</span>
                  </div>
                ))}
              </div>

              {/* 2. BENEFITS SECTION */}
              <div className={styles.sectionHeaderWrap}>
                <span className={styles.sectionMiniTag}>Multi-Stakeholder Impact</span>
                <h3 className={styles.sectionMainHeading}>Key Benefits of IQAC</h3>
                <p className={styles.sectionSubtext}>
                  How structured quality assurance mechanisms empower students, educators, and the community.
                </p>
              </div>

              <div className={styles.benefitsGrid}>
                {[
                  {
                    audience: 'For Students',
                    heading: 'Holistic Development & Employability',
                    themeClass: styles.benefitRuby,
                    iconClass: styles.iconRuby,
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    ),
                    points: [
                      'Standardized, learner-centric pedagogical delivery across all degree programs.',
                      'Continuous access to add-on vocational certifications and skill development workshops.',
                      'Personalized academic counseling and structured faculty-student mentorship.',
                      'Strong industry interface resulting in superior campus placement opportunities.'
                    ]
                  },
                  {
                    audience: 'For Faculty',
                    heading: 'Professional Growth & Research Rigor',
                    themeClass: styles.benefitGold,
                    iconClass: styles.iconGold,
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    ),
                    points: [
                      'Sponsored participation in National & International FDPs, conferences, and seminars.',
                      'Incentives and seed grants for quality research publications and textbook authorship.',
                      'Transparent performance appraisal systems fostering merit-based career elevation.',
                      'Integration of advanced AI and digital pedagogical technologies in everyday teaching.'
                    ]
                  },
                  {
                    audience: 'For Institution',
                    heading: 'Systemic Governance & Accreditation',
                    themeClass: styles.benefitEmerald,
                    iconClass: styles.iconEmerald,
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                      </svg>
                    ),
                    points: [
                      'Streamlined data management and digital documentation for NAAC AQAR & NIRF rankings.',
                      'Continuous internal academic and administrative auditing (AAA) to resolve bottlenecks.',
                      'Optimized resource deployment ensuring financial, infrastructural, and academic efficiency.',
                      'Enhanced institutional reputation and brand standing at state and national levels.'
                    ]
                  },
                  {
                    audience: 'For Society & Employers',
                    heading: 'Value-Driven Women Leadership',
                    themeClass: styles.benefitAzure,
                    iconClass: styles.iconAzure,
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    ),
                    points: [
                      'Graduates with high ethical grounding, critical thinking, and modern professional competencies.',
                      'Direct alignment of student learning outcomes with contemporary market and corporate needs.',
                      'Active community outreach, social welfare projects, and gender sensitization initiatives.',
                      'Reliable pipeline of empowered women professionals ready to lead corporate enterprises.'
                    ]
                  }
                ].map((benefit, bIdx) => (
                  <div className={`${styles.benefitCard} ${benefit.themeClass}`} key={bIdx}>
                    <div className={styles.benefitHeader}>
                      <div className={`${styles.benefitIconBox} ${benefit.iconClass}`}>
                        {benefit.icon}
                      </div>
                      <div className={styles.benefitTitleWrap}>
                        <span className={styles.benefitAudience}>{benefit.audience}</span>
                        <h4 className={styles.benefitHeading}>{benefit.heading}</h4>
                      </div>
                    </div>
                    <ul className={styles.benefitPointsList}>
                      {benefit.points.map((pt, pIdx) => (
                        <li className={styles.benefitPointItem} key={pIdx}>
                          <span className={styles.benefitCheckSvg}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* 3. FUNCTIONS SECTION */}
              <div className={styles.sectionHeaderWrap}>
                <span className={styles.sectionMiniTag}>Operational Mandates</span>
                <h3 className={styles.sectionMainHeading}>Key Operational Functions</h3>
                <p className={styles.sectionSubtext}>
                  Systemic administrative and academic activities carried out by the IQAC cell throughout the academic year.
                </p>
              </div>

              <div className={styles.functionsGrid}>
                {[
                  {
                    num: 'F1',
                    title: 'Formulating Quality Parameters',
                    desc: 'Development and application of realistic, measurable quality benchmarks for various academic and administrative operations of the college.'
                  },
                  {
                    num: 'F2',
                    title: 'Learner-Centric Environment',
                    desc: 'Creating an environment conducive to quality education and faculty maturation to adopt required knowledge and participatory teaching techniques.'
                  },
                  {
                    num: 'F3',
                    title: '360° Feedback Collection & Action',
                    desc: 'Collection, analysis, and implementation of feedback responses on quality-related institutional processes from students, parents, alumni, and employers.'
                  },
                  {
                    num: 'F4',
                    title: 'Workshops, Seminars & FDPs',
                    desc: 'Organizing inter- and intra-institutional workshops, seminars on quality themes, and promotion of quality circles and research colloquiums.'
                  },
                  {
                    num: 'F5',
                    title: 'Institutional Digital Documentation',
                    desc: 'Systematic digital documentation of various quality enhancement programs and activities leading to continuous academic benchmarking.'
                  },
                  {
                    num: 'F6',
                    title: 'Annual AQAR Submission to NAAC',
                    desc: 'Preparation and timely submission of the comprehensive Annual Quality Assurance Report (AQAR) to NAAC as per statutory guidelines.'
                  }
                ].map((fn, fIdx) => (
                  <div className={styles.functionCard} key={fIdx}>
                    <span className={styles.functionNumPill}>{fn.num}</span>
                    <h4 className={styles.functionTitle}>{fn.title}</h4>
                    <p className={styles.functionDesc}>{fn.desc}</p>
                  </div>
                ))}
              </div>

              {/* 4. DEMING QUALITY CYCLE (PDCA) — Creative Brand Themed Console */}
              <div className={styles.qualityLoopCard}>
                <div className={styles.qualityLoopHeader}>
                  <div className={styles.qualityLoopBadge}>
                    <span className={styles.qualityLoopBadgeDot}></span>
                    <span>Continuous Institutional Improvement</span>
                  </div>
                  <h3 className={styles.qualityLoopTitle}>
                    The Deming Quality Cycle <span>(PDCA Framework)</span>
                  </h3>
                  <p className={styles.qualityLoopSubtitle}>
                    A four-stage iterative management methodology applied year-round across all academic, administrative, and research programs at Nandkunvarba Mahila College.
                  </p>
                </div>

                <div className={styles.qualityLoopGrid}>
                  {/* Step 1: PLAN */}
                  <div className={`${styles.loopStepItem} ${styles.loopStepPlan}`}>
                    <div className={styles.loopStepHeader}>
                      <div className={`${styles.loopStepIconBox} ${styles.iconBoxPlan}`}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                        </svg>
                      </div>
                      <span className={styles.loopStepNum}>Stage 01</span>
                    </div>
                    <h4 className={styles.loopStepName}>01. Plan &amp; Strategize</h4>
                    <p className={styles.loopStepDesc}>
                      Establish academic calendars, NEP curriculum mapping, semester lesson plans, and faculty research milestones.
                    </p>
                    <div className={styles.loopTagsWrap}>
                      <span className={styles.loopMiniTag}>Curriculum Goals</span>
                      <span className={styles.loopMiniTag}>NEP Modules</span>
                    </div>
                  </div>

                  {/* Step 2: DO */}
                  <div className={`${styles.loopStepItem} ${styles.loopStepDo}`}>
                    <div className={styles.loopStepHeader}>
                      <div className={`${styles.loopStepIconBox} ${styles.iconBoxDo}`}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                      <span className={styles.loopStepNum}>Stage 02</span>
                    </div>
                    <h4 className={styles.loopStepName}>02. Execute &amp; Deliver</h4>
                    <p className={styles.loopStepDesc}>
                      Conduct ICT-enabled smart classes, experiential learning, skill certification bootcamps, and faculty development masterclasses.
                    </p>
                    <div className={styles.loopTagsWrap}>
                      <span className={styles.loopMiniTag}>Smart ICT Delivery</span>
                      <span className={styles.loopMiniTag}>FDP Bootcamps</span>
                    </div>
                  </div>

                  {/* Step 3: CHECK */}
                  <div className={`${styles.loopStepItem} ${styles.loopStepCheck}`}>
                    <div className={styles.loopStepHeader}>
                      <div className={`${styles.loopStepIconBox} ${styles.iconBoxCheck}`}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 11l3 3L22 4" />
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                      </div>
                      <span className={styles.loopStepNum}>Stage 03</span>
                    </div>
                    <h4 className={styles.loopStepName}>03. Audit &amp; Evaluate</h4>
                    <p className={styles.loopStepDesc}>
                      Execute continuous internal evaluations, analyze 360° stakeholder feedback, and conduct departmental AAA audits.
                    </p>
                    <div className={styles.loopTagsWrap}>
                      <span className={styles.loopMiniTag}>360° Feedback</span>
                      <span className={styles.loopMiniTag}>AAA Audits</span>
                    </div>
                  </div>

                  {/* Step 4: ACT */}
                  <div className={`${styles.loopStepItem} ${styles.loopStepAct}`}>
                    <div className={styles.loopStepHeader}>
                      <div className={`${styles.loopStepIconBox} ${styles.iconBoxAct}`}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 4 23 10 17 10" />
                          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                        </svg>
                      </div>
                      <span className={styles.loopStepNum}>Stage 04</span>
                    </div>
                    <h4 className={styles.loopStepName}>04. Institutionalize &amp; Elevate</h4>
                    <p className={styles.loopStepDesc}>
                      Implement corrective pedagogical upgrades, benchmark best practices, and publish the Annual AQAR for NAAC compliance.
                    </p>
                    <div className={styles.loopTagsWrap}>
                      <span className={styles.loopMiniTag}>AQAR Reporting</span>
                      <span className={styles.loopMiniTag}>Best Practices</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Commitment Ribbon */}
                <div className={styles.qualityLoopRibbon}>
                  <div className={styles.qualityLoopRibbonItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Continuous 365-Day PDCA Loop</span>
                  </div>
                  <div className={styles.qualityLoopRibbonDivider}>•</div>
                  <div className={styles.qualityLoopRibbonItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Zero Compromise Quality Assurance</span>
                  </div>
                  <div className={styles.qualityLoopRibbonDivider}>•</div>
                  <div className={styles.qualityLoopRibbonItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>NAAC &amp; UGC Mandate Aligned</span>
                  </div>
                </div>
              </div>
            </>
          )
        };
      case 'vision-mission':
        return {
          subtitle: "Quality Assurance Mandate",
          description: "Internal Quality Assurance Cell (IQAC) aims to develop a system for conscious, consistent, and catalytic action to improve the academic and administrative performance of the institution.",
          isCustomLayout: false,
          details: (
            <div className={styles.genericCard}>
              <h3 className={styles.cardTitle}>Vision &amp; Mission of IQAC</h3>
              <p className={styles.cardDesc}>
                To build a quality-centric institutional culture that drives pedagogical excellence, research integration, and comprehensive student growth values across all academic streams at Nandkunvarba Mahila College.
              </p>
            </div>
          )
        };
      case 'composition-of-iqac':
        return {
          subtitle: "Executive Committee Members",
          description: "The IQAC committee consists of members from college leadership, senior faculty, administrative staff, local industry mentors, and student representatives.",
          isCustomLayout: false,
          details: (
            <div className={styles.genericCard}>
              <h3 className={styles.cardTitle}>IQAC Committee Composition</h3>
              <table className={styles.genericTable}>
                <thead>
                  <tr>
                    <th>Committee Designation</th>
                    <th>Representative Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Chairperson</strong></td>
                    <td>Dr. Vijaysinh Gohil (Principal)</td>
                  </tr>
                  <tr>
                    <td><strong>IQAC Coordinator</strong></td>
                    <td>Prof. H. M. Patel</td>
                  </tr>
                  <tr>
                    <td><strong>Management Representative</strong></td>
                    <td>Shri Sahajanand Education Trust Trustee</td>
                  </tr>
                  <tr>
                    <td><strong>Senior Faculty Members</strong></td>
                    <td>Prof. K. R. Mehta, Dr. S. D. Vyas, Prof. R. T. Mori</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        };
      case 'conferences-fdp-workshops':
        return {
          subtitle: "Academic Excellence & Faculty Empowerment",
          description: "Internal Quality Assurance Cell (IQAC) regularly organizes National Conferences, Faculty Development Programs (FDP), and hands-on skill workshops to foster pedagogical innovation, research publication ethics, and NEP 2020 integration.",
          isCustomLayout: true,
          details: (
            <>
              {/* Executive Overview Banner with Live Seminar Image */}
              <div className={styles.execBannerCard}>
                <div className={styles.execBannerGrid}>
                  <div className={styles.execBannerTextCol}>
                    <div className={styles.execBadgeRow}>
                      <div className={styles.execBadge}>
                        <span className={styles.execBadgeDot}></span>
                        <span>Academic Excellence &amp; Upskilling</span>
                      </div>
                    </div>
                    <h2 className={styles.execHeading}>
                      Conferences, FDPs &amp; <span>Skill Development Workshops</span>
                    </h2>
                    <p className={styles.execDescription}>
                      The Internal Quality Assurance Cell (IQAC) at Nandkunvarba Mahila College acts as the central catalyst for continuous faculty maturation, scholastic research advancement, and participatory student workshops.
                    </p>
                  </div>
                  <div className={styles.execBannerImgWrap}>
                    <Image
                      src="/assets/dept/bba_seminar.jpg"
                      alt="NMC Academic Seminar & Conference Hall"
                      width={520}
                      height={390}
                      className={styles.execBannerImg}
                    />
                    <div className={styles.execImgFloatingBadge}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span>State-of-the-Art Seminar Hall &amp; Media Labs</span>
                    </div>
                  </div>
                </div>

                <div className={styles.execKpiRow}>
                  <div className={styles.execKpiItem}>
                    <strong className={styles.execKpiNum}>45+</strong>
                    <span className={styles.execKpiLabel}>Academic Programs Hosted</span>
                  </div>
                  <div className={styles.execKpiItem}>
                    <strong className={styles.execKpiNum}>1,200+</strong>
                    <span className={styles.execKpiLabel}>Faculty &amp; Scholars Trained</span>
                  </div>
                  <div className={styles.execKpiItem}>
                    <strong className={styles.execKpiNum}>18+</strong>
                    <span className={styles.execKpiLabel}>National &amp; State Seminars</span>
                  </div>
                  <div className={styles.execKpiItem}>
                    <strong className={styles.execKpiNum}>100%</strong>
                    <span className={styles.execKpiLabel}>NEP 2020 Aligned Modules</span>
                  </div>
                </div>
              </div>

              {/* 1. THREE CORE ACADEMIC PILLARS (WITH IMAGES) */}
              <div className={styles.sectionHeaderWrap}>
                <span className={`${styles.sectionMiniTag} ${styles.sectionMiniTagGold}`}>Academic Pillars</span>
                <h3 className={styles.sectionMainHeading}>Three Strategic Upgradation Wings</h3>
                <p className={styles.sectionSubtext}>
                  Structured developmental tracks designed for faculty members, postgraduate scholars, and students.
                </p>
              </div>

              <div className={styles.confCategoryGrid}>
                {/* Pillar 1: National Conferences */}
                <div className={`${styles.confCategoryCard} ${styles.confCatRuby}`}>
                  <div className={styles.confCatImgWrap}>
                    <Image
                      src="/assets/dept/bba_seminar.jpg"
                      alt="National Conferences at NMC"
                      width={400}
                      height={200}
                      className={styles.confCatImg}
                    />
                    <span className={styles.confCatOverlayBadge}>National Conferences</span>
                  </div>
                  <div className={styles.confCatBody}>
                    <h4 className={styles.confCatTitle}>Conferences &amp; Conventions</h4>
                    <p className={styles.confCatDesc}>
                      Prestigious multi-disciplinary conventions inviting academic leaders, researchers, and corporate experts from across India.
                    </p>
                    <ul className={styles.confCatFeatureList}>
                      <li className={styles.confCatFeatureItem}>
                        <span className={styles.confCatCheckDot}></span>
                        <span>Peer-Reviewed ISBN Proceedings</span>
                      </li>
                      <li className={styles.confCatFeatureItem}>
                        <span className={styles.confCatCheckDot}></span>
                        <span>Keynote Lectures by Eminent Scholars</span>
                      </li>
                      <li className={styles.confCatFeatureItem}>
                        <span className={styles.confCatCheckDot}></span>
                        <span>Interactive Paper Presentation Tracks</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Pillar 2: Faculty Development Programs (FDP) */}
                <div className={`${styles.confCategoryCard} ${styles.confCatGold}`}>
                  <div className={styles.confCatImgWrap}>
                    <Image
                      src="/assets/dept/ba_lecture.jpg"
                      alt="Faculty Development Programs FDP"
                      width={400}
                      height={200}
                      className={styles.confCatImg}
                    />
                    <span className={styles.confCatOverlayBadge}>Faculty Development</span>
                  </div>
                  <div className={styles.confCatBody}>
                    <h4 className={styles.confCatTitle}>Faculty Training (FDPs)</h4>
                    <p className={styles.confCatDesc}>
                      Multi-day intensive masterclasses empowering teachers with digital pedagogies, AI tools, and UGC-CARE publication standards.
                    </p>
                    <ul className={styles.confCatFeatureList}>
                      <li className={styles.confCatFeatureItem}>
                        <span className={styles.confCatCheckDot}></span>
                        <span>NEP 2020 Curricular Framework</span>
                      </li>
                      <li className={styles.confCatFeatureItem}>
                        <span className={styles.confCatCheckDot}></span>
                        <span>AI &amp; Blended Classroom Delivery</span>
                      </li>
                      <li className={styles.confCatFeatureItem}>
                        <span className={styles.confCatCheckDot}></span>
                        <span>Research Grant Proposal Writing</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Pillar 3: Skill Workshops & Masterclasses */}
                <div className={`${styles.confCategoryCard} ${styles.confCatEmerald}`}>
                  <div className={styles.confCatImgWrap}>
                    <Image
                      src="/assets/dept/bca_workshop.jpg"
                      alt="Skill Workshops and IT Labs"
                      width={400}
                      height={200}
                      className={styles.confCatImg}
                    />
                    <span className={styles.confCatOverlayBadge}>Skill Workshops</span>
                  </div>
                  <div className={styles.confCatBody}>
                    <h4 className={styles.confCatTitle}>Skill Bootcamps</h4>
                    <p className={styles.confCatDesc}>
                      Hands-on practical bootcamps for faculty and students on modern software, statistical tools, and professional certifications.
                    </p>
                    <ul className={styles.confCatFeatureList}>
                      <li className={styles.confCatFeatureItem}>
                        <span className={styles.confCatCheckDot}></span>
                        <span>Data Analytics &amp; SPSS Software</span>
                      </li>
                      <li className={styles.confCatFeatureItem}>
                        <span className={styles.confCatCheckDot}></span>
                        <span>Smart LMS &amp; Google Workspace</span>
                      </li>
                      <li className={styles.confCatFeatureItem}>
                        <span className={styles.confCatCheckDot}></span>
                        <span>Certified Vocational Skill Badges</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2. FLAGSHIP ACADEMIC EVENTS SCHEDULE */}
              <div className={styles.sectionHeaderWrap}>
                <span className={styles.sectionMiniTag}>Events Calendar</span>
                <h3 className={styles.sectionMainHeading}>Flagship Conferences &amp; Upcoming FDPs</h3>
                <p className={styles.sectionSubtext}>
                  Detailed itinerary of upcoming institutional seminars, quality webinars, and intensive training programs for 2026-27.
                </p>
              </div>

              <div className={styles.eventsScheduleGrid}>
                {[
                  {
                    day: '24-25',
                    month: 'SEP 2026',
                    pill: 'National Conference',
                    pillClass: styles.catPillRed,
                    title: 'National Conference on AI & Emerging Pedagogies in Higher Education',
                    dept: 'IQAC in association with Dept. of Computer Science & Commerce',
                    mode: 'Hybrid (Campus Auditorium + Live Stream)',
                    audience: 'Faculty, Research Scholars & Postgraduates',
                    highlights: [
                      'Keynote addresses on AI-assisted teaching rubrics.',
                      'Special technical tracks on ChatGPT & GenAI ethics.',
                      'Selected papers published in Scopus/UGC-CARE indexed journal.'
                    ]
                  },
                  {
                    day: '12-18',
                    month: 'OCT 2026',
                    pill: 'UGC-Sponsored FDP',
                    pillClass: styles.catPillGold,
                    title: 'One-Week FDP on Research Methodology & Data Analysis using SPSS/R',
                    dept: 'Organized by IQAC & Faculty Development Cell',
                    mode: 'Offline Computer Lab Sessions',
                    audience: 'College Professors & Ph.D. Scholars',
                    highlights: [
                      'Hands-on training on regression, ANOVA & factor analysis.',
                      'Publishing strategies for high impact factor journals.',
                      'Government and corporate grant proposal formulation.'
                    ]
                  },
                  {
                    day: '15-17',
                    month: 'DEC 2026',
                    pill: 'National Workshop',
                    pillClass: styles.catPillEmerald,
                    title: 'Workshop on NEP 2020: Outcome-Based Education & Rubrics Design',
                    dept: 'Jointly organized with MKBU Bhavnagar University Experts',
                    mode: 'On-Campus Interactive Seminar Hall',
                    audience: 'All Department Heads & Faculty Members',
                    highlights: [
                      'Course Outcome (CO) & Program Outcome (PO) mapping.',
                      'Continuous Internal Assessment (CIA) modernization.',
                      'Multidisciplinary credit structuring under NEP 2020.'
                    ]
                  },
                  {
                    day: '08-09',
                    month: 'FEB 2027',
                    pill: 'State Seminar',
                    pillClass: styles.catPillAzure,
                    title: 'State-Level Seminar on Women Entrepreneurship, IPR & Patent Filing',
                    dept: 'IQAC & Women Development Cell (WDC)',
                    mode: 'Campus Seminar Hall & Virtual Sessions',
                    audience: 'Faculty Mentors, Alumni & Final Year Students',
                    highlights: [
                      'IPR awareness, copyright norms, and trademark filings.',
                      'Mentorship from successful women startup founders.',
                      'Institutional incubation and angel funding pathways.'
                    ]
                  }
                ].map((ev, eIdx) => (
                  <div className={styles.eventScheduleCard} key={eIdx}>
                    <div className={styles.eventCardTop}>
                      <div className={styles.eventDateBadge}>
                        <span className={styles.eventDateDay}>{ev.day}</span>
                        <span className={styles.eventDateMonth}>{ev.month}</span>
                      </div>
                      <span className={`${styles.eventCatPill} ${ev.pillClass}`}>{ev.pill}</span>
                    </div>

                    <h4 className={styles.eventCardHeading}>{ev.title}</h4>

                    <div className={styles.eventMetaInfoWrap}>
                      <div className={styles.eventMetaRow}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span><strong>Dept:</strong> {ev.dept}</span>
                      </div>
                      <div className={styles.eventMetaRow}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span><strong>Mode:</strong> {ev.mode}</span>
                      </div>
                      <div className={styles.eventMetaRow}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                        </svg>
                        <span><strong>Audience:</strong> {ev.audience}</span>
                      </div>
                    </div>

                    <ul className={styles.eventHighlightsList}>
                      {ev.highlights.map((hl, hIdx) => (
                        <li className={styles.eventHighlightItem} key={hIdx}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 11 12 14 22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                          </svg>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>

                    <div className={styles.eventActionsRow}>
                      <a href="#register" className={styles.eventBtnPrimary}>
                        <span>Register for Event</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </a>
                      <a href="#brochure" className={styles.eventBtnOutline}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>Download Brochure</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* 3. LIVE EVENT GALLERY MOMENTS (PHOTO STRIP) */}
              <div className={styles.sectionHeaderWrap}>
                <span className={`${styles.sectionMiniTag} ${styles.sectionMiniTagGold}`}>Campus Moments</span>
                <h3 className={styles.sectionMainHeading}>Glimpses of Past Academic Sessions</h3>
                <p className={styles.sectionSubtext}>
                  Snapshots of eminent keynote lectures, computer laboratory workshops, and interactive student symposiums at NMC.
                </p>
              </div>

              <div className={styles.gallerySpotlightGrid}>
                <div className={styles.gallerySpotlightCard}>
                  <div className={styles.galleryImgWrap}>
                    <Image
                      src="/assets/dept/bba_seminar.jpg"
                      alt="National Seminar Hall Keynotes"
                      width={320}
                      height={180}
                      className={styles.galleryImg}
                    />
                  </div>
                  <div className={styles.galleryCaptionBox}>
                    <h5 className={styles.galleryCaptionTitle}>Auditorium Keynotes</h5>
                    <p className={styles.galleryCaptionDesc}>National faculty conventions with guest deans.</p>
                  </div>
                </div>

                <div className={styles.gallerySpotlightCard}>
                  <div className={styles.galleryImgWrap}>
                    <Image
                      src="/assets/dept/bca_workshop.jpg"
                      alt="Computer Lab Skill Workshops"
                      width={320}
                      height={180}
                      className={styles.galleryImg}
                    />
                  </div>
                  <div className={styles.galleryCaptionBox}>
                    <h5 className={styles.galleryCaptionTitle}>Hands-on IT Labs</h5>
                    <p className={styles.galleryCaptionDesc}>Data science, SPSS and AI classroom workshops.</p>
                  </div>
                </div>

                <div className={styles.gallerySpotlightCard}>
                  <div className={styles.galleryImgWrap}>
                    <Image
                      src="/assets/dept/bba_industrial.jpg"
                      alt="Corporate & Industrial Colloquiums"
                      width={320}
                      height={180}
                      className={styles.galleryImg}
                    />
                  </div>
                  <div className={styles.galleryCaptionBox}>
                    <h5 className={styles.galleryCaptionTitle}>Industry Interface</h5>
                    <p className={styles.galleryCaptionDesc}>Interaction with corporate leaders and entrepreneurs.</p>
                  </div>
                </div>

                <div className={styles.gallerySpotlightCard}>
                  <div className={styles.galleryImgWrap}>
                    <Image
                      src="/assets/dept/fd_exhibition.jpg"
                      alt="Workshops & Project Exhibitions"
                      width={320}
                      height={180}
                      className={styles.galleryImg}
                    />
                  </div>
                  <div className={styles.galleryCaptionBox}>
                    <h5 className={styles.galleryCaptionTitle}>Student Exhibitions</h5>
                    <p className={styles.galleryCaptionDesc}>Skill display bootcamps and creative showcases.</p>
                  </div>
                </div>
              </div>

              {/* 4. MULTI-STAKEHOLDER INSTITUTIONAL IMPACT */}
              <div className={styles.sectionHeaderWrap}>
                <span className={styles.sectionMiniTag}>Holistic Benefits</span>
                <h3 className={styles.sectionMainHeading}>Institutional Impact of Academic Events</h3>
                <p className={styles.sectionSubtext}>
                  How structured conferences, seminars, and FDP workshops uplift institutional quality indices.
                </p>
              </div>

              <div className={styles.benefitsGrid}>
                {[
                  {
                    audience: 'For Faculty Members',
                    heading: 'Pedagogical Mastery & Career Advancement',
                    themeClass: styles.benefitRuby,
                    iconClass: styles.iconRuby,
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    ),
                    points: [
                      'Earning mandatory Career Advancement Scheme (CAS) points for academic promotions.',
                      'Hands-on expertise in digital tools, interactive LMS, and hybrid class orchestration.',
                      'Networking with peer educators, researchers, and keynote university professors.',
                      'Financial sponsorship provided by college management for conference participation.'
                    ]
                  },
                  {
                    audience: 'For Research Scholars',
                    heading: 'Publication Rigor & Research Funding',
                    themeClass: styles.benefitGold,
                    iconClass: styles.iconGold,
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    ),
                    points: [
                      'Guidance on publishing in UGC-CARE, Scopus, and Web of Science indexed journals.',
                      'Statistical methodologies, plagiarism check mechanisms, and citation improvement.',
                      'Assistance in applying for central and state governmental research seed grants.',
                      'Collaborative interdisciplinary research opportunities across college departments.'
                    ]
                  },
                  {
                    audience: 'For Students & Scholars',
                    heading: 'Industry Skills & Global Readiness',
                    themeClass: styles.benefitEmerald,
                    iconClass: styles.iconEmerald,
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    ),
                    points: [
                      'Exposure to emerging industry domains, IT software, and digital financial tools.',
                      'Verifiable certificates of participation and add-on vocational skill badges.',
                      'Direct interactive access to keynote corporate leaders and subject matter experts.',
                      'Substantial boost in placement interview confidence and resume portfolio.'
                    ]
                  },
                  {
                    audience: 'For Institutional Accreditations',
                    heading: 'NAAC & NIRF Documentation Benchmark',
                    themeClass: styles.benefitAzure,
                    iconClass: styles.iconAzure,
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                      </svg>
                    ),
                    points: [
                      'Directly fulfilling NAAC Criterion III (Research, Innovations & Extension) parameters.',
                      'Comprehensive digital repository of workshop proceedings, photos, and feedback reports.',
                      'Strengthening institutional ranking under NIRF Outreach & TLR parameters.',
                      'Fostering a progressive culture of lifelong academic learning and institutional excellence.'
                    ]
                  }
                ].map((benefit, bIdx) => (
                  <div className={`${styles.benefitCard} ${benefit.themeClass}`} key={bIdx}>
                    <div className={styles.benefitHeader}>
                      <div className={`${styles.benefitIconBox} ${benefit.iconClass}`}>
                        {benefit.icon}
                      </div>
                      <div className={styles.benefitTitleWrap}>
                        <span className={styles.benefitAudience}>{benefit.audience}</span>
                        <h4 className={styles.benefitHeading}>{benefit.heading}</h4>
                      </div>
                    </div>
                    <ul className={styles.benefitPointsList}>
                      {benefit.points.map((pt, pIdx) => (
                        <li className={styles.benefitPointItem} key={pIdx}>
                          <span className={styles.benefitCheckSvg}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* 5. RESOURCE & PROCEEDINGS ARCHIVE */}
              <div className={styles.confArchiveCard}>
                <div className={styles.confArchiveTextWrap}>
                  <div className={styles.confArchiveBadge}>
                    <span>Repository &amp; Documentation</span>
                  </div>
                  <h3 className={styles.confArchiveHeading}>
                    Conference Proceedings &amp; Certificate Verification Portal
                  </h3>
                  <p className={styles.confArchiveDesc}>
                    Access digital copies of published conference proceedings books (with ISBN), workshop summary reports, faculty slide decks, and participant e-certificate validation.
                  </p>
                </div>
                <div className={styles.confArchiveBtnGroup}>
                  <a href="#proceedings" className={styles.eventBtnPrimary}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Download Proceedings (PDF)</span>
                  </a>
                  <a href="#certificate" className={styles.eventBtnOutline}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                    <span>Verify E-Certificate</span>
                  </a>
                </div>
              </div>
            </>
          )
        };
      case 'naac':
        return {
          subtitle: "Accreditation & Compliance Registry",
          description: "Nandkunvarba Mahila College actively upholds strict academic criteria, regularly submitting annual reports and participating in assessment cycles overseen by the National Assessment and Accreditation Council.",
          isCustomLayout: true,
          details: (
            <>
              {/* Executive Assessment Intro Card */}
              <div className={styles.execBannerCard}>
                <div className={styles.execBadgeRow}>
                  <div className={styles.execBadge}>
                    <span className={styles.execBadgeDot}></span>
                    <span>Accreditation Cycle Dashboard</span>
                  </div>
                </div>
                <h2 className={styles.execHeading}>
                  NAAC Compliance, Annual AQARs &amp; <span>Accreditation Quality</span>
                </h2>
                <p className={styles.execDescription}>
                  As part of the continuous quality upkeep guidelines monitored by UGC, the college compiles extensive Annual Quality Assurance Reports (AQAR) tracking infrastructure growth, smart pedagogy, research outputs, and gender empowerment initiatives.
                </p>
                <div className={styles.execKpiRow}>
                  <div className={styles.execKpiItem}>
                    <strong className={styles.execKpiNum}>Active</strong>
                    <span className={styles.execKpiLabel}>IQAC Assessment Wing</span>
                  </div>
                  <div className={styles.execKpiItem}>
                    <strong className={styles.execKpiNum}>Annual</strong>
                    <span className={styles.execKpiLabel}>AQAR Audits Filed</span>
                  </div>
                  <div className={styles.execKpiItem}>
                    <strong className={styles.execKpiNum}>7 Pillars</strong>
                    <span className={styles.execKpiLabel}>Assessment Matrix</span>
                  </div>
                  <div className={styles.execKpiItem}>
                    <strong className={styles.execKpiNum}>UGC</strong>
                    <span className={styles.execKpiLabel}>Affiliated Norms</span>
                  </div>
                </div>
              </div>

              {/* Interactive Seven Pillars Grid */}
              <div className={styles.sectionHeaderWrap}>
                <span className={`${styles.sectionMiniTag} ${styles.sectionMiniTagGold}`}>Quality Matrix</span>
                <h3 className={styles.sectionMainHeading}>The 7 Key Assessment Pillars</h3>
                <p className={styles.sectionSubtext}>
                  Every academic year, college performance is meticulously evaluated across the seven critical criteria mandated by the NAAC manual.
                </p>
              </div>

              <div className={styles.confCategoryGrid}>
                {[
                  {
                    title: "1. Curricular Aspects",
                    desc: "Focuses on curriculum design, feedback systems from students, teachers, alumni, and integration of vocational courses.",
                    pill: "Outcome-Based"
                  },
                  {
                    title: "2. Teaching-Learning",
                    desc: "Assesses student enrollment metrics, catering to diverse learning paces, student-centric classrooms, and ICT-enabled pedagogies.",
                    pill: "Smart Pedagogy"
                  },
                  {
                    title: "3. Research & Innovations",
                    desc: "Measures resource mobilization for research projects, active MoUs, patent filings, and publications in UGC care journals.",
                    pill: "Scholarly"
                  },
                  {
                    title: "4. Infrastructure & Assets",
                    desc: "Evaluates physical classroom quality, high-speed WiFi, library databases, computing labs, and outdoor sports setups.",
                    pill: "Campus Facilities"
                  },
                  {
                    title: "5. Student Support",
                    desc: "Tracks scholarship disbursements, counseling wings, student council operations, and active graduate placements.",
                    pill: "Career Progression"
                  },
                  {
                    title: "6. Governance & Leadership",
                    desc: "Evaluates decentralization strategies, e-governance systems, employee welfare schemes, and institutional strategic plans.",
                    pill: "Strategic Planning"
                  }
                ].map((p, pIdx) => (
                  <div className={`${styles.confCategoryCard} ${styles.confCatGold}`} key={pIdx}>
                    <div className={styles.confCatBody} style={{ paddingTop: '1.75rem' }}>
                      <h4 className={styles.confCatTitle}>{p.title}</h4>
                      <p className={styles.confCatDesc}>{p.desc}</p>
                      <div className={styles.confCatFeatureItem} style={{ marginTop: '1rem' }}>
                        <span className={styles.confCatCheckDot} style={{ background: '#f59e0b' }}></span>
                        <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, color: '#f59e0b' }}>{p.pill}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic AQAR Downloads Table Section */}
              <div className={styles.sectionHeaderWrap} style={{ marginTop: '5rem' }}>
                <span className={styles.sectionMiniTag}>Compliance Archives</span>
                <h3 className={styles.sectionMainHeading}>AQAR Annual Submissions</h3>
                <p className={styles.sectionSubtext}>
                  Access and review the official Annual Quality Assurance Reports submitted by the IQAC Cell to the NAAC database.
                </p>
              </div>

              <div className={styles.confArchiveSection} style={{ background: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(138, 0, 0, 0.1)', padding: '2.5rem' }}>
                <table className={styles.genericTable} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(138, 0, 0, 0.04)', borderBottom: '2px solid rgba(138, 0, 0, 0.12)' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '800', color: 'var(--red-800, #8a0000)' }}>Academic Session</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '800', color: 'var(--red-800, #8a0000)' }}>Compliance Document Type</th>
                      <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '800', color: 'var(--red-800, #8a0000)' }}>Official Access Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { year: "2024 - 2025", doc: "Annual Quality Assurance Report (AQAR) - Draft Under Review", file: "#" },
                      { year: "2023 - 2024", doc: "Annual Quality Assurance Report (AQAR) - Final Submission", file: "#" },
                      { year: "2022 - 2023", doc: "Annual Quality Assurance Report (AQAR) - Approved Compliance", file: "#" },
                      { year: "2021 - 2022", doc: "Annual Quality Assurance Report (AQAR) - Approved Compliance", file: "#" }
                    ].map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                        <td style={{ padding: '1.25rem 1rem', fontWeight: '700', color: '#111827' }}>{row.year}</td>
                        <td style={{ padding: '1.25rem 1rem', color: '#4b5563' }}>{row.doc}</td>
                        <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                          <a href={row.file} className={styles.eventBtnOutline} style={{ display: 'inline-flex', padding: '0.5rem 1rem', fontSize: '0.78rem' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            <span>Download PDF</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )
        };
      case 'nirf':
        return {
          subtitle: "National Institutional Ranking Framework",
          description: "Evaluating institutional data parameters across teaching quality, graduation outcomes, research outputs, and community outreach metrics under Ministry of Education (MoE) NIRF mandate.",
          isCustomLayout: true,
          details: (
            <>
              {/* Executive Overview Banner with Campus Image */}
              <div className={styles.execBannerCard}>
                <div className={styles.execBannerGrid}>
                  <div className={styles.execBannerTextCol}>
                    <div className={styles.execBadgeRow}>
                      <div className={styles.execBadge}>
                        <span className={styles.execBadgeDot}></span>
                        <span>Ministry of Education (Govt. of India) Mandate</span>
                      </div>
                    </div>
                    <h2 className={styles.execHeading}>
                      National Institutional <span>Ranking Framework (NIRF)</span>
                    </h2>
                    <p className={styles.execDescription}>
                      Nandkunvarba Mahila College actively participates in the National Institutional Ranking Framework (NIRF), established by the Ministry of Education, Government of India. Our IQAC ensures full institutional data transparency, authentic Data Capturing System (DCS) uploads, and continuous benchmark enhancement across all five core evaluation parameters.
                    </p>
                  </div>
                  <div className={styles.execBannerImgWrap}>
                    <Image
                      src="/assets/dept/bcom_lecture.jpg"
                      alt="NIRF Institutional Excellence at NMC"
                      width={520}
                      height={390}
                      className={styles.execBannerImg}
                    />
                    <div className={styles.execImgFloatingBadge}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span>MoE Verified Institutional Data Portal</span>
                    </div>
                  </div>
                </div>

                <div className={styles.execKpiRow}>
                  <div className={styles.execKpiItem}>
                    <strong className={styles.execKpiNum}>100%</strong>
                    <span className={styles.execKpiLabel}>Public Data Disclosures</span>
                  </div>
                  <div className={styles.execKpiItem}>
                    <strong className={styles.execKpiNum}>5 Core</strong>
                    <span className={styles.execKpiLabel}>Weighted NIRF Pillars</span>
                  </div>
                  <div className={styles.execKpiItem}>
                    <strong className={styles.execKpiNum}>Annual</strong>
                    <span className={styles.execKpiLabel}>DCS Portal Submissions</span>
                  </div>
                  <div className={styles.execKpiItem}>
                    <strong className={styles.execKpiNum}>College</strong>
                    <span className={styles.execKpiLabel}>Category Participation</span>
                  </div>
                </div>
              </div>

              {/* 1. FIVE CORE NIRF EVALUATION PARAMETERS */}
              <div className={styles.sectionHeaderWrap}>
                <span className={`${styles.sectionMiniTag} ${styles.sectionMiniTagGold}`}>Ranking Methodology</span>
                <h3 className={styles.sectionMainHeading}>Five Core NIRF Evaluation Parameters</h3>
                <p className={styles.sectionSubtext}>
                  Comprehensive evaluation methodology defined by the National Institutional Ranking Framework (MoE, Govt. of India).
                </p>
              </div>

              <div className={styles.nirfPillarsGrid}>
                {/* Parameter 1: TLR */}
                <div className={`${styles.nirfPillarCard} ${styles.nirfPillarRuby}`}>
                  <div className={styles.nirfPillarHeader}>
                    <div className={`${styles.nirfPillarIconBox} ${styles.iconRuby}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>
                    <span className={`${styles.nirfWeightBadge} ${styles.weightBadgeRed}`}>Weight: 30%</span>
                  </div>
                  <span className={styles.nirfPillarCode}>PARAMETER 01 — TLR</span>
                  <h4 className={styles.nirfPillarTitle}>Teaching, Learning &amp; Resources</h4>
                  <p className={styles.nirfPillarDesc}>
                    Core academic infrastructure assessing student enrolment, qualified permanent faculty with doctoral degrees, and annual capital/operational expenditures.
                  </p>
                  <ul className={styles.nirfSubmetricsList}>
                    <li className={styles.nirfSubmetricItem}>
                      <span className={styles.nirfSubmetricDot}></span>
                      <span>Student Strength &amp; Approved Intake (SS)</span>
                    </li>
                    <li className={styles.nirfSubmetricItem}>
                      <span className={styles.nirfSubmetricDot}></span>
                      <span>Faculty-Student Ratio &amp; Cadre (FSR)</span>
                    </li>
                    <li className={styles.nirfSubmetricItem}>
                      <span className={styles.nirfSubmetricDot}></span>
                      <span>Faculty with Ph.D. &amp; Experience (FQE)</span>
                    </li>
                    <li className={styles.nirfSubmetricItem}>
                      <span className={styles.nirfSubmetricDot}></span>
                      <span>Financial Resources Utilization (FRU)</span>
                    </li>
                  </ul>
                </div>

                {/* Parameter 2: RPC */}
                <div className={`${styles.nirfPillarCard} ${styles.nirfPillarGold}`}>
                  <div className={styles.nirfPillarHeader}>
                    <div className={`${styles.nirfPillarIconBox} ${styles.iconGold}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                    <span className={`${styles.nirfWeightBadge} ${styles.weightBadgeGold}`}>Weight: 30%</span>
                  </div>
                  <span className={styles.nirfPillarCode}>PARAMETER 02 — RPC</span>
                  <h4 className={styles.nirfPillarTitle}>Research &amp; Professional Practice</h4>
                  <p className={styles.nirfPillarDesc}>
                    Scholastic productivity evaluating peer-reviewed publications, citation impact factor, intellectual property rights (IPR), and sponsored research grants.
                  </p>
                  <ul className={styles.nirfSubmetricsList}>
                    <li className={styles.nirfSubmetricItem}>
                      <span className={styles.nirfSubmetricDot}></span>
                      <span>Combined Metric for Publications (PU)</span>
                    </li>
                    <li className={styles.nirfSubmetricItem}>
                      <span className={styles.nirfSubmetricDot}></span>
                      <span>Quality of Publications &amp; Citations (QP)</span>
                    </li>
                    <li className={styles.nirfSubmetricItem}>
                      <span className={styles.nirfSubmetricDot}></span>
                      <span>IPR: Patents Published &amp; Granted (IPR)</span>
                    </li>
                    <li className={styles.nirfSubmetricItem}>
                      <span className={styles.nirfSubmetricDot}></span>
                      <span>Sponsored Research &amp; Consultancies (FPHP)</span>
                    </li>
                  </ul>
                </div>

                {/* Parameter 3: GO */}
                <div className={`${styles.nirfPillarCard} ${styles.nirfPillarEmerald}`}>
                  <div className={styles.nirfPillarHeader}>
                    <div className={`${styles.nirfPillarIconBox} ${styles.iconEmerald}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    </div>
                    <span className={`${styles.nirfWeightBadge} ${styles.weightBadgeEmerald}`}>Weight: 20%</span>
                  </div>
                  <span className={styles.nirfPillarCode}>PARAMETER 03 — GO</span>
                  <h4 className={styles.nirfPillarTitle}>Graduation Outcomes</h4>
                  <p className={styles.nirfPillarDesc}>
                    Success metrics evaluating examination pass percentages, campus placement packages, median salary, and student progression to premier PG/Ph.D. institutions.
                  </p>
                  <ul className={styles.nirfSubmetricsList}>
                    <li className={styles.nirfSubmetricItem}>
                      <span className={styles.nirfSubmetricDot}></span>
                      <span>University Examination Pass Rate (GUE)</span>
                    </li>
                    <li className={styles.nirfSubmetricItem}>
                      <span className={styles.nirfSubmetricDot}></span>
                      <span>Placements &amp; Median Salary (GPH)</span>
                    </li>
                    <li className={styles.nirfSubmetricItem}>
                      <span className={styles.nirfSubmetricDot}></span>
                      <span>Progression to Higher Education (GHE)</span>
                    </li>
                    <li className={styles.nirfSubmetricItem}>
                      <span className={styles.nirfSubmetricDot}></span>
                      <span>University Gold Medals &amp; Top Ranks</span>
                    </li>
                  </ul>
                </div>

                {/* Parameter 4: OI */}
                <div className={`${styles.nirfPillarCard} ${styles.nirfPillarAzure}`}>
                  <div className={styles.nirfPillarHeader}>
                    <div className={`${styles.nirfPillarIconBox} ${styles.iconAzure}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <span className={`${styles.nirfWeightBadge} ${styles.weightBadgeAzure}`}>Weight: 10%</span>
                  </div>
                  <span className={styles.nirfPillarCode}>PARAMETER 04 — OI</span>
                  <h4 className={styles.nirfPillarTitle}>Outreach &amp; Inclusivity</h4>
                  <p className={styles.nirfPillarDesc}>
                    Inclusiveness metrics measuring women student diversity, socio-economically challenged representation, and accessible infrastructure for Divyangjan.
                  </p>
                  <ul className={styles.nirfSubmetricsList}>
                    <li className={styles.nirfSubmetricItem}>
                      <span className={styles.nirfSubmetricDot}></span>
                      <span>100% Women Student Focus (WD)</span>
                    </li>
                    <li className={styles.nirfSubmetricItem}>
                      <span className={styles.nirfSubmetricDot}></span>
                      <span>Regional &amp; Geographic Diversity (RD)</span>
                    </li>
                    <li className={styles.nirfSubmetricItem}>
                      <span className={styles.nirfSubmetricDot}></span>
                      <span>Economically Challenged SC/ST/OBC (ESCS)</span>
                    </li>
                    <li className={styles.nirfSubmetricItem}>
                      <span className={styles.nirfSubmetricDot}></span>
                      <span>Barrier-Free Divyangjan Facilities (PCS)</span>
                    </li>
                  </ul>
                </div>

                {/* Parameter 5: PR */}
                <div className={`${styles.nirfPillarCard} ${styles.nirfPillarAmber}`}>
                  <div className={styles.nirfPillarHeader}>
                    <div className={`${styles.nirfPillarIconBox} ${styles.iconGold}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                    <span className={`${styles.nirfWeightBadge} ${styles.weightBadgeAmber}`}>Weight: 10%</span>
                  </div>
                  <span className={styles.nirfPillarCode}>PARAMETER 05 — PR</span>
                  <h4 className={styles.nirfPillarTitle}>Peer Perception</h4>
                  <p className={styles.nirfPillarDesc}>
                    Institutional stature in academic and industrial domains assessed through peer surveys, corporate recruiter reviews, and public reputation.
                  </p>
                  <ul className={styles.nirfSubmetricsList}>
                    <li className={styles.nirfSubmetricItem}>
                      <span className={styles.nirfSubmetricDot}></span>
                      <span>Academic Peer Perception Surveys (PR)</span>
                    </li>
                    <li className={styles.nirfSubmetricItem}>
                      <span className={styles.nirfSubmetricDot}></span>
                      <span>Corporate Recruiter &amp; Employer Feedback</span>
                    </li>
                    <li className={styles.nirfSubmetricItem}>
                      <span className={styles.nirfSubmetricDot}></span>
                      <span>Alumni Goodwill &amp; Community Impact</span>
                    </li>
                    <li className={styles.nirfSubmetricItem}>
                      <span className={styles.nirfSubmetricDot}></span>
                      <span>Accredited Academic Stature in Gujarat</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 2. OFFICIAL NIRF DCS REPORT ARCHIVE */}
              <div className={styles.sectionHeaderWrap}>
                <span className={styles.sectionMiniTag}>Public Disclosures</span>
                <h3 className={styles.sectionMainHeading}>Official NIRF Data Capturing System (DCS) Reports</h3>
                <p className={styles.sectionSubtext}>
                  Annual institutional data files submitted to the NIRF portal as per Ministry of Education disclosure compliance.
                </p>
              </div>

              <div className={styles.nirfDcsGrid}>
                {[
                  {
                    year: 'NIRF 2026',
                    category: 'College Category',
                    status: 'Verified & Submitted',
                    desc: 'Full institutional data capturing report covering student demographics, faculty credentials, and expenditures for 2025-26.'
                  },
                  {
                    year: 'NIRF 2025',
                    category: 'College Category',
                    status: 'Verified & Submitted',
                    desc: 'Annual NIRF submission document with verified examination pass rates, placement statistics, and research outputs for 2024-25.'
                  },
                  {
                    year: 'NIRF 2024',
                    category: 'College Category',
                    status: 'Verified & Submitted',
                    desc: 'Comprehensive NIRF institutional report containing infrastructure audits, student progression, and scholarship data for 2023-24.'
                  },
                  {
                    year: 'NIRF 2023',
                    category: 'College Category',
                    status: 'Verified & Submitted',
                    desc: 'Archived institutional ranking dossier detailing TLR, RPC, GO, and OI parameter metrics submitted for NIRF 2023 cycle.'
                  }
                ].map((dcs, dIdx) => (
                  <div className={styles.nirfDcsCard} key={dIdx}>
                    <div className={styles.nirfDcsTopRow}>
                      <div className={styles.nirfDcsDocIcon}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                      </div>
                      <span className={styles.nirfDcsStatusBadge}>{dcs.status}</span>
                    </div>

                    <h4 className={styles.nirfDcsYear}>{dcs.year}</h4>
                    <span className={styles.nirfDcsCategory}>{dcs.category}</span>
                    <p className={styles.nirfDcsDesc}>{dcs.desc}</p>

                    <a href={`#dcs-${dIdx}`} className={styles.nirfDcsDownloadBtn}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <span>Download DCS (PDF)</span>
                    </a>
                  </div>
                ))}
              </div>

              {/* 3. INSTITUTIONAL INCLUSION BENCHMARKS */}
              <div className={styles.sectionHeaderWrap}>
                <span className={`${styles.sectionMiniTag} ${styles.sectionMiniTagGold}`}>Quality Benchmarks</span>
                <h3 className={styles.sectionMainHeading}>Key Institutional Highlights under NIRF</h3>
                <p className={styles.sectionSubtext}>
                  Measurable institutional parameters reflecting our commitment to women empowerment, academic rigor, and holistic student support.
                </p>
              </div>

              <div className={styles.nirfHighlightsGrid}>
                <div className={styles.nirfHighlightCard}>
                  <span className={styles.nirfHighlightNum}>100%</span>
                  <h4 className={styles.nirfHighlightHeading}>Women Empowerment Focus</h4>
                  <p className={styles.nirfHighlightDesc}>Dedicated higher education sanctuary for young women across Bhavnagar &amp; Saurashtra.</p>
                </div>

                <div className={styles.nirfHighlightCard}>
                  <span className={styles.nirfHighlightNum}>88%+</span>
                  <h4 className={styles.nirfHighlightHeading}>Graduation Success Rate</h4>
                  <p className={styles.nirfHighlightDesc}>Consistent top ranks and high graduation success in MKBU university examinations.</p>
                </div>

                <div className={styles.nirfHighlightCard}>
                  <span className={styles.nirfHighlightNum}>100%</span>
                  <h4 className={styles.nirfHighlightHeading}>Smart ICT Laboratories</h4>
                  <p className={styles.nirfHighlightDesc}>Equipped with high-speed internet, smart boards, language lab, and modern computer labs.</p>
                </div>

                <div className={styles.nirfHighlightCard}>
                  <span className={styles.nirfHighlightNum}>45%+</span>
                  <h4 className={styles.nirfHighlightHeading}>Scholarship Beneficiaries</h4>
                  <p className={styles.nirfHighlightDesc}>Government DBT freeships, trust concessions, and merit stipends awarded to students.</p>
                </div>
              </div>

              {/* 4. NIRF NODAL OFFICER & STAKEHOLDER FEEDBACK */}
              <div className={styles.nirfNodalCard}>
                <div className={styles.nirfNodalTextWrap}>
                  <div className={styles.execBadgeRow}>
                    <div className={styles.execBadge}>
                      <span className={styles.execBadgeDot}></span>
                      <span>Transparency &amp; Governance</span>
                    </div>
                  </div>
                  <h3 className={styles.nirfNodalHeading}>
                    NIRF Nodal Cell &amp; Public Feedback Desk
                  </h3>
                  <p className={styles.nirfNodalDesc}>
                    In compliance with the Ministry of Education guidelines, Nandkunvarba Mahila College invites comments and suggestions from all stakeholders (students, parents, alumni, educators) regarding the submitted NIRF DCS data.
                  </p>
                </div>

                <div className={styles.nirfNodalContactBox}>
                  <div className={styles.nirfContactRow}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <div>
                      <strong>Nodal Officer:</strong>
                      <div>Dr. NIRF Nodal Coordinator</div>
                    </div>
                  </div>

                  <div className={styles.nirfContactRow}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <div>
                      <strong>Official Email:</strong>
                      <div><a href="mailto:nirf@nandkunvarbacollege.org">nirf@nandkunvarbacollege.org</a></div>
                    </div>
                  </div>

                  <div className={styles.nirfContactRow}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <div>
                      <strong>Office Timings:</strong>
                      <div>Mon – Sat: 08:00 AM to 04:00 PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        };
      default:
        return {
          subtitle: "Internal Quality Assurance Cell",
          description: "Internal audit structures ensuring college progress.",
          isCustomLayout: false,
          details: <div className={styles.genericCard}>Detailed section is under development.</div>
        };
    }
  };

  const { subtitle, description, details, isCustomLayout } = getContentData();

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero-fullscreen" id="home" style={{ minHeight: "50vh", height: "50vh" }}>
          <div className="hero-bg-image">
            <Image 
              src="/assets/home/hero/2.jpg" 
              alt="IQAC Banner" 
              width={1400} 
              height={700} 
              priority 
              className="hero-bg-img" 
            />
          </div>
          <div className="hero-overlay" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))" }}></div>
          
          <div className="hero-content container" style={{ paddingTop: "100px", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", paddingBottom: "80px" }}>
            <h1 className="hero-main-title" style={{ marginBottom: "0.35rem" }}>
              <em>{pageTitle}</em>
            </h1>
            
            {/* Breadcrumb — exactly matching introduction page */}
            <nav aria-label="breadcrumb" className={styles.heroBreadcrumb}>
              <Link href="/">Home</Link>
              <span className={styles.heroBreadcrumbSep}>&gt;</span>
              <Link href="/iqac">IQAC</Link>
              <span className={styles.heroBreadcrumbSep}>&gt;</span>
              <span className={styles.heroBreadcrumbCurrent}>{pageTitle}</span>
            </nav>
          </div>
        </section>

        {/* Subpage Main Content */}
        <section className={styles.subpageMain}>
          <div className={styles.container}>
            {isCustomLayout ? (
              details
            ) : (
              <>
                <div className={styles.execBannerCard}>
                  <div className={styles.execBadgeRow}>
                    <div className={styles.execBadge}>
                      <span className={styles.execBadgeDot}></span>
                      <span>{subtitle}</span>
                    </div>
                  </div>
                  <h2 className={styles.execHeading}>
                    {pageTitle}
                  </h2>
                  <p className={styles.execDescription}>
                    {description}
                  </p>
                </div>
                {details}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
