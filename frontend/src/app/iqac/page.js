import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import IQACAnimations from './IQACAnimations';
import CommitteeSpotlight from './CommitteeSpotlight';
import styles from './page.module.css';

export const metadata = {
  title: 'IQAC | Nandkunvarba Mahila College',
  description: 'Internal Quality Assurance Cell (IQAC) — quality initiatives, NAAC, NIRF, conferences at NMC Bhavnagar.',
};

export default function IQACPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className={styles.heroSection}>
          <div className={styles.heroBgImage}>
            <Image src="/assets/home/hero/2.jpg" alt="IQAC - NMC" width={1400} height={700} priority className={styles.heroBgImg} />
          </div>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}><em>IQAC</em></h1>
            <nav aria-label="breadcrumb" className={styles.heroBreadcrumb}>
              <Link href="/">Home</Link>
              <span className={styles.heroBreadcrumbSep}>&gt;</span>
              <Link href="/iqac">IQAC</Link>
              <span className={styles.heroBreadcrumbSep}>&gt;</span>
              <span className={styles.heroBreadcrumbCurrent}>Introduction</span>
            </nav>
          </div>
        </section>

        <IQACAnimations>
          {/* 1. About IQAC — Luxury Intro Section */}
          <section className={styles.introSection} id="about-iqac">
            <div className={styles.container}>
              <div className={styles.introLayout}>
                
                {/* Content Block — Left */}
                <div className={styles.introContentBlock} data-animate="fade-left">
                  <div className={styles.introLabel}>
                    <span className={styles.introLabelLine}></span>
                    <span>About IQAC</span>
                  </div>

                  <h2 className={styles.introHeading}>
                    Driving
                    <span className={styles.introHeadingAccent}>Quality Culture</span>
                    &amp; Academic Excellence
                  </h2>

                  <p className={styles.introDesc}>
                    The Internal Quality Assurance Cell (IQAC) at <strong>Nandkunvarba Mahila College</strong> develops an institutional framework for <strong>conscious, consistent, and catalytic improvement</strong> in educational standards, governance, and holistic student development.
                  </p>

                  {/* 4 Responsive Stats (2x2 Grid) */}
                  <div className={styles.introStatsGrid}>
                    <div className={styles.introStatCard}>
                      <span className={styles.introStatNum}>15+</span>
                      <span className={styles.introStatLabel}>Years of Excellence</span>
                    </div>
                    <div className={styles.introStatCard}>
                      <span className={styles.introStatNum}>10</span>
                      <span className={styles.introStatLabel}>Council Members</span>
                    </div>
                    <div className={styles.introStatCard}>
                      <span className={styles.introStatNum}>50+</span>
                      <span className={styles.introStatLabel}>Programs Conducted</span>
                    </div>
                    <div className={styles.introStatCard}>
                      <span className={styles.introStatNum}>12+</span>
                      <span className={styles.introStatLabel}>Departments Covered</span>
                    </div>
                  </div>
                </div>

                {/* Campus & Mentors Visual — Right */}
                <div className={styles.introVisualWrap} data-animate="fade-right">
                  <div className={styles.introVisual}>
                    <Image
                      src="/assets/hero/iqac-ai-banner.jpg"
                      alt="NMC College Campus and Academic Mentors — IQAC"
                      width={900}
                      height={600}
                      priority
                      unoptimized
                    />
                  </div>
                  <div className={styles.introFloatingBadge}>
                    <div className={styles.introBadgeIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </div>
                    <div className={styles.introBadgeText}>
                      <strong>Quality Benchmark</strong>
                      <span>NAAC &amp; UGC Standards</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* 2. Composition — Interactive Spotlight */}
          <CommitteeSpotlight />

          {/* 3. Strategies & Key Functions */}
          <section className={styles.stratSection} id="strategies-and-functions">
            <div className={styles.container}>

              {/* Section Header */}
              <div className={styles.stratHeaderBlock} data-animate="header">
                <div className={styles.stratBadge}>
                  <span className={styles.stratBadgeDot}></span>
                  <span>Quality Framework</span>
                </div>
                <h2 className={styles.stratMainTitle}>
                  Strategies &amp; <span className={styles.stratTitleAccent}>Key Functions</span>
                </h2>
                <p className={styles.stratMainSubtitle}>
                  Institutional mechanisms driving continuous quality assurance, academic auditing, infrastructure development, and student-centric excellence.
                </p>
              </div>

              {/* 6 Luxury Feature Cards (3x2 Grid) */}
              <div className={styles.stratGrid} data-animate="stagger-cards">
                {[
                  {
                    title: 'Academic Planning & Curriculum Review',
                    desc: 'Formulation of annual academic calendar, Outcome-Based Education (OBE) mapping, lesson plan frameworks, and pedagogical innovations.',
                    chip: 'Core Mandate',
                    metric: '100% Syllabi Adherence',
                    themeClass: styles.iconRuby,
                    borderClass: styles.cardRuby,
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                      </svg>
                    )
                  },
                  {
                    title: 'Performance Monitoring & Audits',
                    desc: 'Regular academic performance evaluations, student progression analytics, internal faculty reviews, and examination outcome metrics.',
                    chip: 'Continuous Audit',
                    metric: 'Quarterly Academic Audits',
                    themeClass: styles.iconGold,
                    borderClass: styles.cardGold,
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                      </svg>
                    )
                  },
                  {
                    title: 'Multi-Stakeholder Feedback System',
                    desc: 'Comprehensive digital feedback collection from students, parents, alumni, faculty, and industry recruiters for actionable enhancements.',
                    chip: '360° Stakeholder Voice',
                    metric: '98% Positive Feedback',
                    themeClass: styles.iconEmerald,
                    borderClass: styles.cardEmerald,
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    )
                  },
                  {
                    title: 'Infrastructure & Digital IT Upgrades',
                    desc: 'Expansion of smart interactive classrooms, high-speed Wi-Fi campus, BCA/IT computer labs, digital library, and online LMS platforms.',
                    chip: 'Smart Digitization',
                    metric: 'High-Tech IT Labs',
                    themeClass: styles.iconAzure,
                    borderClass: styles.cardAzure,
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                    )
                  },
                  {
                    title: 'Research, FDP & Innovation Culture',
                    desc: 'Promotion of faculty research publications in UGC-CARE journals, seed funding support, intellectual seminars, and faculty development training.',
                    chip: 'R&D & Training',
                    metric: '50+ Research Papers',
                    themeClass: styles.iconPurple,
                    borderClass: styles.cardPurple,
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    )
                  },
                  {
                    title: 'Best Practices & Quality Benchmarks',
                    desc: 'Documentation and institutionalization of best practices, 100% free transportation bus service, green campus audits, and student welfare initiatives.',
                    chip: 'Institutional Benchmarks',
                    metric: '100% Free Bus Welfare',
                    themeClass: styles.iconRuby,
                    borderClass: styles.cardRuby,
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    )
                  }
                ].map((s, i) => (
                  <article className={`${styles.stratCard} ${s.borderClass}`} key={i}>
                    <div className={styles.stratCardHeader}>
                      <div className={`${styles.stratCardIcon} ${s.themeClass}`}>
                        {s.icon}
                      </div>
                      <span className={styles.stratCardChip}>{s.chip}</span>
                    </div>

                    <h3 className={styles.stratCardTitle}>{s.title}</h3>
                    <p className={styles.stratCardDesc}>{s.desc}</p>

                    <div className={styles.stratCardFooter}>
                      <div className={styles.stratMetricBadge}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>{s.metric}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

            </div>
          </section>

          {/* 4. Conferences, FDP & Workshops — Minimal & Clean */}
          <section className={styles.eventsSection} id="conferences-and-workshops">
            <div className={styles.container}>
              
              <div className={styles.eventsHeaderBlock} data-animate="header">
                <div className={styles.eventsBadge}>
                  <span className={styles.eventsBadgeDot}></span>
                  <span>Professional Development</span>
                </div>
                <h2 className={styles.eventsMainTitle}>
                  Conferences, FDP &amp; <span className={styles.eventsTitleAccent}>Workshops</span>
                </h2>
                <p className={styles.eventsMainSubtitle}>
                  Empowering faculty pedagogies, scholarly discourse, and student career readiness.
                </p>
              </div>

              {/* Minimal Clean 4-Card Grid */}
              <div className={styles.eventsMinimalGrid} data-animate="stagger-cards">
                {[
                  {
                    title: 'Faculty Development (FDP)',
                    tag: 'Pedagogy & OBE Training',
                    desc: 'Masterclasses equipping faculty with Outcome-Based Education, ICT tools, and research methodologies.',
                    themeClass: styles.iconRuby,
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    )
                  },
                  {
                    title: 'National Conferences',
                    tag: 'Research & Discourse',
                    desc: 'Annual symposiums bringing together eminent academicians to present peer-reviewed research papers.',
                    themeClass: styles.iconGold,
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    )
                  },
                  {
                    title: 'Skill Workshops',
                    tag: 'Student Career Labs',
                    desc: 'Hands-on practical training covering digital tools, personality development, and entrepreneurship.',
                    themeClass: styles.iconEmerald,
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                      </svg>
                    )
                  },
                  {
                    title: 'Expert Guest Lectures',
                    tag: 'Corporate Interface',
                    desc: 'Interactive knowledge sessions by distinguished corporate leaders, civil servants, and alumni achievers.',
                    themeClass: styles.iconAzure,
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="10 8 16 12 10 16 10 8" />
                      </svg>
                    )
                  }
                ].map((item, idx) => (
                  <article className={styles.eventMinimalCard} key={idx}>
                    <div className={`${styles.eventMinimalIcon} ${item.themeClass}`}>
                      {item.icon}
                    </div>
                    <span className={styles.eventMinimalTag}>{item.tag}</span>
                    <h3 className={styles.eventMinimalTitle}>{item.title}</h3>
                    <p className={styles.eventMinimalDesc}>{item.desc}</p>
                  </article>
                ))}
              </div>

            </div>
          </section>

          {/* 5. NAAC & NIRF — Creative Quality Benchmarks Hub */}
          <section className={styles.accredSection} id="accreditation-and-rankings">
            <div className={styles.container}>
              
              {/* Section Header */}
              <div className={styles.accredHeader} data-animate="header">
                <div className={styles.accredBadge}>
                  <span className={styles.accredBadgeDot}></span>
                  <span>National Quality Standards</span>
                </div>
                <h2 className={styles.accredMainTitle}>
                  Accreditation &amp; <span className={styles.accredTitleAccent}>Rankings</span>
                </h2>
                <p className={styles.accredSubtitle}>
                  Institutional compliance with national quality frameworks established by statutory regulatory bodies of India.
                </p>
              </div>

              {/* Dual Creative Showcase Pillars (NAAC & NIRF) */}
              <div className={styles.accredDualGrid} data-animate="stagger-cards">
                
                {/* Pillar 1: NAAC Console */}
                <article className={`${styles.accredConsoleCard} ${styles.naacCardTheme}`}>
                  <div className={styles.accredCardTop}>
                    <div className={`${styles.accredEmblemIcon} ${styles.emblemRuby}`}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="7" />
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                      </svg>
                    </div>
                    <div className={styles.accredMetaGroup}>
                      <span className={styles.accredGovTag}>UGC Autonomous Body</span>
                      <h3 className={styles.accredCouncilName}>NAAC</h3>
                    </div>
                  </div>

                  <h4 className={styles.accredFullName}>National Assessment &amp; Accreditation Council</h4>
                  <p className={styles.accredDescription}>
                    Comprehensive quality assessment evaluating curriculum relevance, teaching-learning methodologies, faculty research output, student progression, and institutional governance.
                  </p>

                  {/* 7 Core NAAC Criteria Checklist */}
                  <div className={styles.accredCriteriaBox}>
                    <h5 className={styles.accredCriteriaHeader}>7 Core Assessment Criteria</h5>
                    <div className={styles.criteriaPillGrid}>
                      {[
                        '1. Curricular Aspects & OBE',
                        '2. Teaching-Learning & Evaluation',
                        '3. Research, Innovations & Extension',
                        '4. Infrastructure & Digital Labs',
                        '5. Student Support & Progression',
                        '6. Governance, Leadership & Audits',
                        '7. Institutional Values & Best Practices'
                      ].map((crit, idx) => (
                        <div className={styles.criteriaItem} key={idx}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>{crit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Verification Footer */}
                  <div className={styles.accredFooterStrip}>
                    <div className={styles.verifiedBadgeRuby}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span>Annual AQAR Documentation &amp; Continuous Auditing</span>
                    </div>
                  </div>
                </article>

                {/* Pillar 2: NIRF Console */}
                <article className={`${styles.accredConsoleCard} ${styles.nirfCardTheme}`}>
                  <div className={styles.accredCardTop}>
                    <div className={`${styles.accredEmblemIcon} ${styles.emblemGold}`}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                      </svg>
                    </div>
                    <div className={styles.accredMetaGroup}>
                      <span className={styles.accredGovTagGold}>Ministry of Education, Govt. of India</span>
                      <h3 className={styles.accredCouncilName}>NIRF</h3>
                    </div>
                  </div>

                  <h4 className={styles.accredFullName}>National Institutional Ranking Framework</h4>
                  <p className={styles.accredDescription}>
                    National standardized ranking methodology assessing higher education institutions across five comprehensive performance dimensions and academic vitality indicators.
                  </p>

                  {/* 5 NIRF Dimensions with Metric Indicators */}
                  <div className={styles.accredCriteriaBox}>
                    <h5 className={styles.accredCriteriaHeader}>5 Core Performance Dimensions</h5>
                    <div className={styles.nirfDimensionList}>
                      {[
                        { code: 'TLR', title: 'Teaching, Learning & Resources', sub: 'Faculty-student ratio, lab facilities, library budget' },
                        { code: 'RPC', title: 'Research & Professional Practice', sub: 'Peer-reviewed publications, citations & patents' },
                        { code: 'GO', title: 'Graduation Outcomes', sub: 'University exam pass rates & career placements' },
                        { code: 'OI', title: 'Outreach & Inclusivity', sub: 'Women empowerment, diversity & rural outreach' },
                        { code: 'PR', title: 'Peer & Public Perception', sub: 'Employer feedback & academic standing' },
                      ].map((dim, idx) => (
                        <div className={styles.nirfDimItem} key={idx}>
                          <span className={styles.nirfDimCode}>{dim.code}</span>
                          <div className={styles.nirfDimInfo}>
                            <strong>{dim.title}</strong>
                            <span>{dim.sub}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Verification Footer */}
                  <div className={styles.accredFooterStrip}>
                    <div className={styles.verifiedBadgeGold}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span>MoE Standardized Institutional Metric Compliance</span>
                    </div>
                  </div>
                </article>

              </div>

              {/* Bottom Institutional Quality Pledge Strip */}
              <div className={styles.qualityPledgeBanner} data-animate="fade-up">
                <div className={styles.pledgeHeaderRow}>
                  <div className={styles.pledgeIconWrap}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div>
                    <h4 className={styles.pledgeTitle}>Institutional Quality Commitment</h4>
                    <p className={styles.pledgeDesc}>Nandkunvarba Mahila College is committed to continuous quality enhancement, academic autonomy, and women leadership.</p>
                  </div>
                </div>
                
                <div className={styles.pledgeStatsRow}>
                  <div className={styles.pledgeStat}>
                    <strong>100%</strong>
                    <span>Curriculum Coverage</span>
                  </div>
                  <div className={styles.pledgeDivider} />
                  <div className={styles.pledgeStat}>
                    <strong>Quarterly</strong>
                    <span>Academic Audits</span>
                  </div>
                  <div className={styles.pledgeDivider} />
                  <div className={styles.pledgeStat}>
                    <strong>Zero</strong>
                    <span>Compromise Policy</span>
                  </div>
                </div>
              </div>

            </div>
          </section>
        </IQACAnimations>
      </main>
      <Footer />
    </>
  );
}
