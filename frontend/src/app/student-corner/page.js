import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import CounterAnimation from './CounterAnimation';
import styles from './page.module.css';

export const metadata = {
  title: 'Student Corner | Nandkunvarba Mahila College',
  description: 'Student resources, notices, placements, alumni, and more at Nandkunvarba Mahila College.',
};

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <CounterAnimation />
        {/* Scroll Progress Indicator Bar */}


        {/* HEADER */}


        {/* HERO BANNER */}
        <section className="hero-fullscreen" id="home" style={{ minHeight: "50vh", height: "50vh" }}>
          <div className="hero-bg-image">
            <Image src="/assets/home/hero/2.jpg" alt="Student Corner Banner" width={1400} height={700} className="hero-bg-img" />
          </div>
          <div className="hero-overlay" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))" }}></div>
          <div className="hero-content container" style={{ paddingTop: "100px", display: "flex", alignItems: "flex-end", height: "100%", paddingBottom: "80px" }}>
            <h1 className="hero-main-title"><em>Student Corner</em></h1>
          </div>
        </section>

        {/* LATEST UPDATES & CIRCULARS */}
        <section className="section-padding updates-section" id="updates">
          <div className="container">
            <div className="section-header">
              <div className="section-subtitle">Official Announcements</div>
              <h2 className="section-title">Latest Updates &amp; <span>Circulars</span></h2>
              <p className="section-description">Stay updated with official college circulars, examination schedules, campus events, and university notifications.</p>
            </div>

            {/* Live Notice Ticker Strip */}
            <div className="notice-ticker-bar">
              <div className="notice-ticker-badge">
                <span className="ticker-dot"></span>
                <span>LIVE NOTICE</span>
              </div>
              <div className="notice-ticker-text">
                <span>Admissions open for AY 2026-27 &bull; Semester 3 &amp; 5 MKBU Examination Timetable Released &bull; Free Bus Service expanded to Sihor &amp; Palitana routes</span>
              </div>
            </div>

            {/* Luxury Notices Grid */}
            <div className="notices-executive-grid">

              {/* Notice 1 */}
              <div className="notice-card-luxury spotlight-active" data-category="admission">
                <div className="notice-date-badge date-ruby">
                  <span className="notice-day">10</span>
                  <span className="notice-month">AUG</span>
                  <span className="notice-year">2026</span>
                </div>
                <div className="notice-card-content">
                  <div className="notice-meta-header">
                    <span className="notice-category-pill pill-ruby">Admissions</span>
                    <span className="notice-status-badge badge-active">Applications Open</span>
                  </div>
                  <h3 className="notice-title">Admissions Open for Undergraduate &amp; Postgraduate Degrees 2026-27</h3>
                  <p className="notice-desc">Online application window is officially active for BBA, BCA, BA, B.Com, MA, M.Com, MSW, and Professional Diplomas affiliated with MKBU.</p>
                  <div className="notice-action-bar">
                    <a href="#" className="notice-link-btn">
                      <span>Apply Online</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                    </a>
                    <span className="notice-ref-id">Ref: NMC/ADM/2026/08</span>
                  </div>
                </div>
              </div>

              {/* Notice 2 */}
              <div className="notice-card-luxury spotlight-active" data-category="exam">
                <div className="notice-date-badge date-crimson">
                  <span className="notice-day">05</span>
                  <span className="notice-month">AUG</span>
                  <span className="notice-year">2026</span>
                </div>
                <div className="notice-card-content">
                  <div className="notice-meta-header">
                    <span className="notice-category-pill pill-crimson">Examinations</span>
                    <span className="notice-status-badge badge-info">Timetable Released</span>
                  </div>
                  <h3 className="notice-title">Semester 3 &amp; 5 MKBU University Examination Schedule</h3>
                  <p className="notice-desc">Detailed subject-wise examination timetable, hall ticket verification dates, and university center guidelines for all enrolled candidates.</p>
                  <div className="notice-action-bar">
                    <a href="#" className="notice-link-btn btn-secondary-notice">
                      <span>Download Timetable (PDF)</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    </a>
                    <span className="notice-ref-id">Ref: MKBU/EXAM/S35/26</span>
                  </div>
                </div>
              </div>

              {/* Notice 3 */}
              <div className="notice-card-luxury spotlight-active" data-category="event">
                <div className="notice-date-badge date-gold">
                  <span className="notice-day">01</span>
                  <span className="notice-month">AUG</span>
                  <span className="notice-year">2026</span>
                </div>
                <div className="notice-card-content">
                  <div className="notice-meta-header">
                    <span className="notice-category-pill pill-gold">Campus Events</span>
                    <span className="notice-status-badge badge-event">Workshop</span>
                  </div>
                  <h3 className="notice-title">National Hands-on Workshop on Cyber Security &amp; AI Safety</h3>
                  <p className="notice-desc">One-day interactive technical workshop in the Main Campus Auditorium featuring leading cyber investigators and industry leaders.</p>
                  <div className="notice-action-bar">
                    <a href="#" className="notice-link-btn">
                      <span>Register for Workshop</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                    </a>
                    <span className="notice-ref-id">Ref: NMC/EVENT/CS/26</span>
                  </div>
                </div>
              </div>

              {/* Notice 4 */}
              <div className="notice-card-luxury spotlight-active" data-category="transport">
                <div className="notice-date-badge date-amber">
                  <span className="notice-day">28</span>
                  <span className="notice-month">JUL</span>
                  <span className="notice-year">2026</span>
                </div>
                <div className="notice-card-content">
                  <div className="notice-meta-header">
                    <span className="notice-category-pill pill-amber">Student Transport</span>
                    <span className="notice-status-badge badge-transport">Free Route Update</span>
                  </div>
                  <h3 className="notice-title">100% Free Bus Route Extended to Sihor, Palitana &amp; Vartej</h3>
                  <p className="notice-desc">Updated morning departure schedules, designated village pickup halts, and contactless digital bus pass renewal for female students.</p>
                  <div className="notice-action-bar">
                    <a href="#" className="notice-link-btn btn-secondary-notice">
                      <span>View Route Map (PDF)</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    </a>
                    <span className="notice-ref-id">Ref: NMC/TRANS/2026/04</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* STUDENTS ON CAMPUS / TOTAL STRENGTH */}
        <section className={`section-padding ${styles.campusStrengthSection}`} id="campus-strength">
          <div className="container">
            <div className="section-header">
              <div className="section-subtitle">Real-Time Campus Analytics</div>
              <h2 className="section-title">Students on Campus &amp; <span>Total Strength</span></h2>
              <p className="section-description">Daily campus attendance overview and total academic enrollment strength across all disciplines.</p>
            </div>

            {/* Top Live Status Bar */}
            <div className={styles.strengthLiveBanner}>
              <div className={styles.strengthLiveBadge}>
                <span className={styles.strengthLiveDot}></span>
                <span>LIVE ATTENDANCE OVERVIEW</span>
              </div>
              <div className={styles.strengthLiveRatio}>
                <span>Overall Daily Presence: <strong><span className="strength-counter" data-target="86">0</span>% Active</strong></span>
              </div>
            </div>

            {/* 2 Balanced Hub Cards Grid */}
            <div className={styles.strengthDualHubs}>

              {/* Hub 1: Real-Time Presence Today */}
              <div className={`${styles.strengthHubCard} spotlight-active`}>
                <div className={styles.strengthHubHeader}>
                  <div className={styles.strengthHubIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                  </div>
                  <div>
                    <span className={styles.strengthHubTag}>Daily Presence</span>
                    <h3 className={styles.strengthHubTitle}>Students on Campus Today</h3>
                  </div>
                </div>

                <div className={styles.strengthHubStat}>
                  <div className={styles.strengthHubNumber}>
                    <span className="strength-counter" data-target="4280">0</span>
                    <span className={styles.strengthHubSub}>/ 5,000</span>
                  </div>
                  <p className={styles.strengthHubDesc}>Verified daily student presence across morning and afternoon lecture sessions.</p>
                </div>

                <div className={styles.strengthStreamMeters}>
                  <div className={styles.strengthSmeterRow}>
                    <div className={styles.strengthSmeterLabel}>
                      <span>Undergraduate (BBA, BCA, BA, B.Com)</span>
                      <strong>2,850 / 3,200 (89%)</strong>
                    </div>
                    <div className={styles.strengthSmeterBar}>
                      <div className={styles.strengthSmeterFill} style={{ width: "89%" }}></div>
                    </div>
                  </div>

                  <div className={styles.strengthSmeterRow}>
                    <div className={styles.strengthSmeterLabel}>
                      <span>Postgraduate (MA, M.Com, MSW)</span>
                      <strong>980 / 1,150 (85%)</strong>
                    </div>
                    <div className={styles.strengthSmeterBar}>
                      <div className={styles.strengthSmeterFill} style={{ width: "85%" }}></div>
                    </div>
                  </div>

                  <div className={styles.strengthSmeterRow}>
                    <div className={styles.strengthSmeterLabel}>
                      <span>Diploma &amp; Skill Courses (DFD, CFD, DNYS)</span>
                      <strong>450 / 650 (69%)</strong>
                    </div>
                    <div className={styles.strengthSmeterBar}>
                      <div className={styles.strengthSmeterFill} style={{ width: "69%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hub 2: Total Enrolled Institutional Strength */}
              <div className={`${styles.strengthHubCard} spotlight-active`}>
                <div className={styles.strengthHubHeader}>
                  <div className={styles.strengthHubIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  </div>
                  <div>
                    <span className={styles.strengthHubTag}>Total Capacity</span>
                    <h3 className={styles.strengthHubTitle}>Total Enrolled Strength</h3>
                  </div>
                </div>

                <div className={styles.strengthHubStat}>
                  <div className={styles.strengthHubNumber}>
                    <span className="strength-counter" data-target="5000">0</span><span className={styles.strengthHubPlus}>+</span>
                    <span className={styles.strengthHubSub}>Women</span>
                  </div>
                  <p className={styles.strengthHubDesc}>100% dedicated female empowerment through higher education and practical job skills.</p>
                </div>

                <div className={styles.strengthInsightsList}>
                  <div className={styles.strengthInsightItem}>
                    <div className={styles.strengthInsightIcon}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="15" rx="2" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /><line x1="3" y1="9" x2="21" y2="9" /></svg>
                    </div>
                    <div className={styles.strengthInsightText}>
                      <strong><span className="strength-counter" data-target="3200">0</span>+ Free Bus Commuters</strong>
                      <span>100% free transportation fleet connecting 15+ rural villages daily</span>
                    </div>
                  </div>

                  <div className={styles.strengthInsightItem}>
                    <div className={styles.strengthInsightIcon}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
                    </div>
                    <div className={styles.strengthInsightText}>
                      <strong>9 Academic Degrees &amp; Diplomas</strong>
                      <span>Recognized by M.K. Bhavnagar University &amp; Govt. of Gujarat</span>
                    </div>
                  </div>

                  <div className={styles.strengthInsightItem}>
                    <div className={styles.strengthInsightIcon}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                    </div>
                    <div className={styles.strengthInsightText}>
                      <strong>52 Smart Labs &amp; Creative Studios</strong>
                      <span>Equipped for high-speed IT labs, fashion design studios &amp; libraries</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* PLACEMENT, TRAINING & CAREER DEVELOPMENT */}
        <section className={`section-padding ${styles.placementCareerSection}`} id="placements">
          <div className="container">
            <div className="section-header">
              <div className="section-subtitle">Career Growth &amp; Corporate Readiness</div>
              <h2 className="section-title">Placement, Training &amp; <span>Career Development</span></h2>
              <p className="section-description">Empowering female graduates with corporate readiness, competitive salary packages, campus recruitment drives, and active industry MoUs.</p>
            </div>

            {/* Interactive 4-Stage Career Progression Runway */}
            <div className={`${styles.careerRunwayContainer} spotlight-active`}>
              <div className={styles.runwayHeader}>
                <div className={styles.runwayHeaderLeft}>
                  <div className={styles.runwayIconBox}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  </div>
                  <div>
                    <span className={styles.runwayBadge}>Progression Model</span>
                    <h3 className={styles.runwayTitle}>4-Stage Career Readiness Runway</h3>
                  </div>
                </div>
                <span className={styles.runwayNote}>Sem 1 to Sem 6 Complete Pathway</span>
              </div>

              <div className={styles.runwayStationsGrid}>

                {/* Station 01 */}
                <div className={styles.runwayStation}>
                  <div className={styles.stationTop}>
                    <span className={styles.stationNumber}>01</span>
                  </div>
                  <div className={styles.stationCard}>
                    <span className={styles.stationSem}>Semesters 1 &amp; 2</span>
                    <h4 className={styles.stationHeading}>Foundation &amp; Executive Voice</h4>
                    <p className={styles.stationDesc}>English fluency labs, executive public presentation, confidence coaching &amp; business communication.</p>
                    <div className={styles.stationPill}>Communication Lab</div>
                  </div>
                </div>

                {/* Station 02 */}
                <div className={styles.runwayStation}>
                  <div className={styles.stationTop}>
                    <span className={styles.stationNumber}>02</span>
                  </div>
                  <div className={styles.stationCard}>
                    <span className={styles.stationSem}>Semesters 3 &amp; 4</span>
                    <h4 className={styles.stationHeading}>Technical &amp; ERP Tool Mastery</h4>
                    <p className={styles.stationDesc}>Hands-on corporate tools: Tally Prime ERP, Python coding, MS Excel analytics &amp; digital marketing.</p>
                    <div className={styles.stationPill}>Applied Skills</div>
                  </div>
                </div>

                {/* Station 03 */}
                <div className={styles.runwayStation}>
                  <div className={styles.stationTop}>
                    <span className={styles.stationNumber}>03</span>
                  </div>
                  <div className={styles.stationCard}>
                    <span className={styles.stationSem}>Semester 5</span>
                    <h4 className={styles.stationHeading}>Interview Grooming &amp; Mock Drives</h4>
                    <p className={styles.stationDesc}>GD simulations, corporate dress etiquette, aptitude tests &amp; 1-on-1 mock HR interviews.</p>
                    <div className={styles.stationPill}>Corporate GDs</div>
                  </div>
                </div>

                {/* Station 04 */}
                <div className={styles.runwayStation}>
                  <div className={styles.stationTop}>
                    <span className={styles.stationNumber}>04</span>
                  </div>
                  <div className={`${styles.stationCard} ${styles.stationCardHighlight}`}>
                    <span className={styles.stationSem}>Semester 6</span>
                    <h4 className={styles.stationHeading}>Campus Placement &amp; Offers</h4>
                    <p className={styles.stationDesc}>Direct campus recruitment drives, paid internship conversions &amp; official appointment letters.</p>
                    <div className={`${styles.stationPill} ${styles.pillRuby}`}>Offer Letters</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Sector Badges & MoU Assurance Strip */}
            <div className={styles.recruitmentSpectrumGrid}>

              {/* Left: Sector Badges Showcase */}
              <div className={`${styles.sectorSpectrumCard} spotlight-active`}>
                <div className={styles.spectrumCardHeader}>
                  <span className={styles.spectrumTag}>Industry Ecosystem</span>
                  <h3 className={styles.spectrumTitle}>Prominent Recruiting Sectors</h3>
                </div>

                <div className={styles.spectrumPillsWrap}>
                  <div className={styles.spectrumItem}>
                    <span className={styles.specIcon}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg></span>
                    <div className={styles.specData}>
                      <strong>Banking &amp; Finance</strong>
                      <span>HDFC, Axis, ICICI &amp; State Banks</span>
                    </div>
                  </div>

                  <div className={styles.spectrumItem}>
                    <span className={styles.specIcon}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg></span>
                    <div className={styles.specData}>
                      <strong>IT &amp; Software</strong>
                      <span>Web developers &amp; digital studios</span>
                    </div>
                  </div>

                  <div className={styles.spectrumItem}>
                    <span className={styles.specIcon}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg></span>
                    <div className={styles.specData}>
                      <strong>Healthcare &amp; Social</strong>
                      <span>Civil Hospital &amp; NGO bodies</span>
                    </div>
                  </div>

                  <div className={styles.spectrumItem}>
                    <span className={styles.specIcon}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3c0 0 1 1 4 1s4-1 4-1" /><path d="M8 3c-1 1.5-2 3-3 5 1.5 0.5 3 1 3 1s-2 4-5 12h18c-3-8-5-12-5-12s1.5-0.5 3-1c-1-2-2-3.5-3-5" /></svg></span>
                    <div className={styles.specData}>
                      <strong>Apparel &amp; Fashion</strong>
                      <span>Garment export units &amp; boutiques</span>
                    </div>
                  </div>

                  <div className={styles.spectrumItem}>
                    <span className={styles.specIcon}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg></span>
                    <div className={styles.specData}>
                      <strong>Accounting &amp; GST</strong>
                      <span>Chartered accountant consultancies</span>
                    </div>
                  </div>

                  <div className={styles.spectrumItem}>
                    <span className={styles.specIcon}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg></span>
                    <div className={styles.specData}>
                      <strong>Education &amp; K-12</strong>
                      <span>Higher secondary schools &amp; academies</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: MoU Assurance & Placement Cell Connect */}
              <div className={`${styles.mouConnectCard} spotlight-active`}>
                <div className={styles.mouSealBadge}>
                  <span className="mou-seal-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" /><path d="M12 5.36L8.87 8.5a2.13 2.13 0 0 0 0 3l.51.51a2.13 2.13 0 0 0 3 0L15 9.38" /><path d="M18 15l-3-3" /><path d="M6 15l3-3" /></svg></span>
                  <span className="mou-seal-text">Official Industry Collaboration</span>
                </div>

                <h3 className={styles.mouConnectTitle}>10+ Active Institutional MoUs Guaranteeing Practical Exposure</h3>
                <p className={styles.mouConnectDesc}>Our corporate agreements guarantee mandatory live internship projects, on-site industrial visits, and prioritized hiring windows for NMC female graduates.</p>

                <div className={styles.mouPerksList}>
                  <div className={styles.mouPerkItem}>
                    <span className={styles.mouCheck}>&#10004;</span>
                    <span>100% stipend eligibility for select internships</span>
                  </div>
                  <div className={styles.mouPerkItem}>
                    <span className={styles.mouCheck}>&#10004;</span>
                    <span>Dedicated On-Campus Training &amp; Placement Cell</span>
                  </div>
                  <div className={styles.mouPerkItem}>
                    <span className={styles.mouCheck}>&#10004;</span>
                    <span>Lifelong Alumni Career Network Support</span>
                  </div>
                </div>

                <div className="mou-actions-bar">
                  <a href="#" className={styles.btnMouPrimary}>
                    <span>Contact Placement Cell</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 14F. EXECUTIVE QUICK LINKS & E-RESOURCES ENTERPRISE HUB */}
        <section className={`section-padding ${styles.quicklinksSection}`} id="quicklinks">
          <div className="container">
            <div className="section-header">
              <div className="section-subtitle">Digital Gateway &amp; Official Repositories</div>
              <h2 className="section-title">Quick Links &amp; <span>E-Resources Hub</span></h2>
              <p className="section-description">Centralized access to government portals, national digital libraries, academic credit systems, and student support helplines.</p>
            </div>

            {/* Category Filter Pills Bar */}
            <div className="qhub-filter-bar">
              <button className="qhub-filter-btn active" data-qcat="all">
                <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg> All Portals (14)</span>
              </button>
              <button className="qhub-filter-btn" data-qcat="gov">
                <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" /></svg> Gov &amp; University (5)</span>
              </button>
              <button className="qhub-filter-btn" data-qcat="eresources">
                <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg> National E-Resources (4)</span>
              </button>
              <button className="qhub-filter-btn" data-qcat="support">
                <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> Helplines &amp; Support (5)</span>
              </button>
            </div>

            {/* Professional Executive Grid (2-Column / 3-Column Responsive) */}
            <div className="qhub-grid">

              {/* 1. GCAS Portal */}
              <a href="https://gujgcas.gujarat.gov.in/" target="_blank" className="qhub-card spotlight-active" data-category="gov">
                <div className="qhub-icon icon-ruby">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                </div>
                <div className="qhub-info">
                  <div className="qhub-top">
                    <span className="qhub-tag tag-ruby">Government of Gujarat</span>
                    <span className="qhub-arrow">&#8599;</span>
                  </div>
                  <h4 className="qhub-title">GCAS Admission Portal</h4>
                  <p className="qhub-desc">Centralized Gujarat Common Admission Services &amp; university choice filling.</p>
                </div>
              </a>

              {/* 2. Digital Gujarat */}
              <a href="https://www.digitalgujarat.gov.in/" target="_blank" className="qhub-card spotlight-active" data-category="gov">
                <div className="qhub-icon icon-gold">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                </div>
                <div className="qhub-info">
                  <div className="qhub-top">
                    <span className="qhub-tag tag-gold">State Portal</span>
                    <span className="qhub-arrow">&#8599;</span>
                  </div>
                  <h4 className="qhub-title">Digital Gujarat Portal</h4>
                  <p className="qhub-desc">Online scholarship schemes, certificates &amp; government student subsidies.</p>
                </div>
              </a>

              {/* 3. APAAR ID (ABC) */}
              <a href="https://www.abc.gov.in/" target="_blank" className="qhub-card spotlight-active" data-category="gov">
                <div className="qhub-icon icon-ruby">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                </div>
                <div className="qhub-info">
                  <div className="qhub-top">
                    <span className="qhub-tag tag-ruby">MoE &bull; DigiLocker</span>
                    <span className="qhub-arrow">&#8599;</span>
                  </div>
                  <h4 className="qhub-title">APAAR ID (Academic Bank of Credits)</h4>
                  <p className="qhub-desc">Unified digital academic identity, credit repository &amp; transcript management.</p>
                </div>
              </a>

              {/* 4. Uni Results */}
              <a href="https://mkbhavuni.edu.in/" target="_blank" className="qhub-card spotlight-active" data-category="gov">
                <div className="qhub-icon icon-gold">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
                </div>
                <div className="qhub-info">
                  <div className="qhub-top">
                    <span className="qhub-tag tag-gold">MKBU Examination</span>
                    <span className="qhub-arrow">&#8599;</span>
                  </div>
                  <h4 className="qhub-title">University Examination Results</h4>
                  <p className="qhub-desc">Official semester marksheet verification and university merit scorecards.</p>
                </div>
              </a>

              {/* 5. Syllabus */}
              <a href="https://mkbhavuni.edu.in/" target="_blank" className="qhub-card spotlight-active" data-category="gov">
                <div className="qhub-icon icon-ruby">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                </div>
                <div className="qhub-info">
                  <div className="qhub-top">
                    <span className="qhub-tag tag-ruby">Academic Structure</span>
                    <span className="qhub-arrow">&#8599;</span>
                  </div>
                  <h4 className="qhub-title">MKBU Syllabus &amp; Curriculum</h4>
                  <p className="qhub-desc">Download updated course curricula, credit structures &amp; NEP guidelines.</p>
                </div>
              </a>

              {/* 6. SWAYAM */}
              <a href="https://swayam.gov.in/" target="_blank" className="qhub-card spotlight-active" data-category="eresources">
                <div className="qhub-icon icon-gold">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                </div>
                <div className="qhub-info">
                  <div className="qhub-top">
                    <span className="qhub-tag tag-gold">National MOOCs</span>
                    <span className="qhub-arrow">&#8599;</span>
                  </div>
                  <h4 className="qhub-title">SWAYAM Online Learning</h4>
                  <p className="qhub-desc">Govt. of India free certified courses from premier professors &amp; IIT faculty.</p>
                </div>
              </a>

              {/* 7. SWAYAM PRABHA */}
              <a href="https://swayamprabha.gov.in/" target="_blank" className="qhub-card spotlight-active" data-category="eresources">
                <div className="qhub-icon icon-ruby">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="7" width="20" height="15" rx="2" ry="2" /><polyline points="17 2 12 7 7 2" /></svg>
                </div>
                <div className="qhub-info">
                  <div className="qhub-top">
                    <span className="qhub-tag tag-ruby">34 DTH Channels</span>
                    <span className="qhub-arrow">&#8599;</span>
                  </div>
                  <h4 className="qhub-title">SWAYAM PRABHA DTH</h4>
                  <p className="qhub-desc">24x7 high quality educational telecast across higher education subjects.</p>
                </div>
              </a>

              {/* 8. E-PATHSHALA */}
              <a href="https://epathshala.nic.in/" target="_blank" className="qhub-card spotlight-active" data-category="eresources">
                <div className="qhub-icon icon-gold">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                </div>
                <div className="qhub-info">
                  <div className="qhub-top">
                    <span className="qhub-tag tag-gold">NCERT &amp; CIET</span>
                    <span className="qhub-arrow">&#8599;</span>
                  </div>
                  <h4 className="qhub-title">e-Pathshala Digital Vault</h4>
                  <p className="qhub-desc">Comprehensive digital textbooks, audio resources &amp; interactive study material.</p>
                </div>
              </a>

              {/* 9. NDLI Library */}
              <a href="https://ndl.iitkgp.ac.in/" target="_blank" className="qhub-card spotlight-active" data-category="eresources">
                <div className="qhub-icon icon-ruby">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 2l9 4.9V11c0 5.5-3.8 10.7-9 12-5.2-1.3-9-6.5-9-12V6.9L12 2z" /></svg>
                </div>
                <div className="qhub-info">
                  <div className="qhub-top">
                    <span className="qhub-tag tag-ruby">IIT Kharagpur</span>
                    <span className="qhub-arrow">&#8599;</span>
                  </div>
                  <h4 className="qhub-title">National Digital Library of India (NDLI)</h4>
                  <p className="qhub-desc">Access millions of journals, research papers, e-books &amp; institutional repositories.</p>
                </div>
              </a>

              {/* 10. Apply Online */}
              <a href="https://forms.gle/TBNKycyc6AjfipWc8" target="_blank" className="qhub-card spotlight-active" data-category="support">
                <div className="qhub-icon icon-gold">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </div>
                <div className="qhub-info">
                  <div className="qhub-top">
                    <span className="qhub-tag tag-gold">Admissions 2026-27</span>
                    <span className="qhub-arrow">&#8599;</span>
                  </div>
                  <h4 className="qhub-title">Online Application Portal</h4>
                  <p className="qhub-desc">Direct admission registration with 100% Free Bus service and blazer perk.</p>
                </div>
              </a>

              {/* 11. Cyber Awareness (1930) */}
              <a href="tel:1930" className="qhub-card spotlight-active" data-category="support">
                <div className="qhub-icon icon-ruby">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </div>
                <div className="qhub-info">
                  <div className="qhub-top">
                    <span className="qhub-tag tag-ruby">National Helpline</span>
                    <span className="qhub-arrow">&#8599;</span>
                  </div>
                  <h4 className="qhub-title">Cyber Crime Awareness &bull; 1930</h4>
                  <p className="qhub-desc">Immediate 24x7 reporting hotline for cyber fraud, harassment &amp; digital safety.</p>
                </div>
              </a>

              {/* 12. RTI Statutory Info */}
              <a href="#contact" className="qhub-card spotlight-active" data-category="support">
                <div className="qhub-icon icon-gold">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="12" y1="3" x2="12" y2="21" /><path d="M5 21h14" /><path d="M6 8l6-3 6 3" /><path d="M6 8l-3 6h6z" /><path d="M18 8l-3 6h6z" /></svg>
                </div>
                <div className="qhub-info">
                  <div className="qhub-top">
                    <span className="qhub-tag tag-gold">Statutory Portal</span>
                    <span className="qhub-arrow">&#8599;</span>
                  </div>
                  <h4 className="qhub-title">Right to Information (RTI Act)</h4>
                  <p className="qhub-desc">Public Information Officer details, institutional transparency &amp; disclosures.</p>
                </div>
              </a>

              {/* 13. ARC Helpline */}
              <a href="tel:02782471813" className="qhub-card spotlight-active" data-category="support">
                <div className="qhub-icon icon-ruby">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                </div>
                <div className="qhub-info">
                  <div className="qhub-top">
                    <span className="qhub-tag tag-ruby">Zero Tolerance</span>
                    <span className="qhub-arrow">&#8599;</span>
                  </div>
                  <h4 className="qhub-title">ARC Anti-Ragging &amp; Grievance Cell</h4>
                  <p className="qhub-desc">Confidential student support squad, safety committee &amp; grievance redressal.</p>
                </div>
              </a>

              {/* 14. Contact Us */}
              <a href="#contact" className="qhub-card spotlight-active" data-category="support">
                <div className="qhub-icon icon-gold">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </div>
                <div className="qhub-info">
                  <div className="qhub-top">
                    <span className="qhub-tag tag-gold">Campus Desk</span>
                    <span className="qhub-arrow">&#8599;</span>
                  </div>
                  <h4 className="qhub-title">Central Campus Contact Desk</h4>
                  <p className="qhub-desc">Get in touch with administrative officers, faculties &amp; student counselors.</p>
                </div>
              </a>

            </div>
          </div>
        </section>

        {/* 14F. FUTURE VISION & STRATEGIC ROADMAP 2030 */}
        <section className="section-padding future-vision-section" id="future-vision">
          <div className="container">
            <div className="section-header fv-header-center">
              <div className="section-subtitle">Strategic Horizon &bull; Mission 2030</div>
              <h2 className="section-title">Institutional Future <span>Vision &amp; Roadmap</span></h2>
              <p className="section-description">Shaping the vanguard of women's leadership through global research standards, cutting-edge AI infrastructure, incubation ecosystems, and NAAC A++ excellence.</p>
            </div>

            {/* Main 2-Column Vision Architecture */}
            <div className="fv-master-grid">

              {/* Left: 4 Strategic Vision Milestone Cards */}
              <div className="fv-pillars-grid">

                {/* Pillar 1: NAAC */}
                <div className="fvision-card spotlight-active">
                  <div className="fvc-top">
                    <div className="fvc-icon icon-gold">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
                    </div>
                    <span className="fvc-year">Target: 2027</span>
                  </div>
                  <h4 className="fvc-title">NAAC 'A++' Accreditation Benchmark</h4>
                  <p className="fvc-desc">Establishing gold-standard quality audits across curriculum design, experiential pedagogy, faculty research publications, and state governance.</p>
                  <div className="fvc-footer">
                    <span className="fvc-tag tag-gold">Target CGPA: 3.65+</span>
                    <span className="fvc-status">Phase 2 Audit Active</span>
                  </div>
                </div>

                {/* Pillar 2: Global MoUs */}
                <div className="fvision-card spotlight-active">
                  <div className="fvc-top">
                    <div className="fvc-icon icon-ruby">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                    </div>
                    <span className="fvc-year">Target: 2028</span>
                  </div>
                  <h4 className="fvc-title">International University &amp; Corporate MoUs</h4>
                  <p className="fvc-desc">Forging bilateral dual-certification treaties with leading MNCs and global academic institutions for student immersion and overseas faculty exchanges.</p>
                  <div className="fvc-footer">
                    <span className="fvc-tag tag-ruby">50+ Target MoUs</span>
                    <span className="fvc-status">18 Active Signed</span>
                  </div>
                </div>

                {/* Pillar 3: AI & Data Science */}
                <div className="fvision-card spotlight-active">
                  <div className="fvc-top">
                    <div className="fvc-icon icon-ruby">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                    </div>
                    <span className="fvc-year">Target: 2028</span>
                  </div>
                  <h4 className="fvc-title">Next-Gen AI &amp; Fintech Research Labs</h4>
                  <p className="fvc-desc">Commissioning high-performance GPU computing clusters, Generative AI sandboxes, and financial algorithmic modeling labs across BCA &amp; BBA programs.</p>
                  <div className="fvc-footer">
                    <span className="fvc-tag tag-ruby">NEP 2020 Aligned</span>
                    <span className="fvc-status">Lab Setup In Progress</span>
                  </div>
                </div>

                {/* Pillar 4: Incubation Center */}
                <div className="fvision-card spotlight-active">
                  <div className="fvc-top">
                    <div className="fvc-icon icon-gold">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    </div>
                    <span className="fvc-year">Target: 2029</span>
                  </div>
                  <h4 className="fvc-title">On-Campus Women's Startup Incubation</h4>
                  <p className="fvc-desc">Empowering student entrepreneurs with dedicated seed grant capital, intellectual property patent filing support, and direct venture capitalist access.</p>
                  <div className="fvc-footer">
                    <span className="fvc-tag tag-gold">&#8377;50L Seed Fund</span>
                    <span className="fvc-status">Incubation Hub Ready</span>
                  </div>
                </div>

              </div>

              {/* Right: Vision 2030 Core Command Terminal Card */}
              <div className="fv-horizon-wrap">
                <div className="fv-horizon-card spotlight-active">

                  <div className="fvh-badge-wrap">
                    <span className="fvh-badge">STRATEGIC MASTERPLAN</span>
                  </div>

                  <div className="fvh-year-display">
                    <span className="fvh-year-num">2030</span>
                    <span className="fvh-year-title">Empowering 10,000+ Female Leaders</span>
                  </div>

                  <p className="fvh-mission-statement">
                    "By 2030, Nandkunvarba Mahila College will stand as Saurashtra's premier autonomous center of academic distinction, women entrepreneurship, and digital equity."
                  </p>

                  <div className="fvh-milestone-bars">
                    <div className="fvh-bar-item">
                      <div className="fvh-bar-header">
                        <span>Placement &amp; Corporate Readiness Target</span>
                        <strong>100%</strong>
                      </div>
                      <div className="fvh-progress-track">
                        <div className="fvh-progress-fill" style={{ width: "100%" }}></div>
                      </div>
                    </div>

                    <div className="fvh-bar-item">
                      <div className="fvh-bar-header">
                        <span>Digital Lab &amp; Smart Campus Infrastructure</span>
                        <strong>95%</strong>
                      </div>
                      <div className="fvh-progress-track">
                        <div className="fvh-progress-fill" style={{ width: "95%" }}></div>
                      </div>
                    </div>

                    <div className="fvh-bar-item">
                      <div className="fvh-bar-header">
                        <span>Scholarship &amp; Free Bus Accessibility</span>
                        <strong>100%</strong>
                      </div>
                      <div className="fvh-progress-track">
                        <div className="fvh-progress-fill" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="fvh-trust-seal">
                    <span className="fvh-seal-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="22" y2="22" /><line x1="6" x2="6" y1="18" y2="11" /><line x1="10" x2="10" y1="18" y2="11" /><line x1="14" x2="14" y1="18" y2="11" /><line x1="18" x2="18" y1="18" y2="11" /><polygon points="12 2 20 7 4 7" /></svg></span>
                    <div className="fvh-seal-text">
                      <strong>Managed by Shree Sahajanand Education Trust</strong>
                      <span>Affiliated with Maharaja Krishnakumarsinhji Bhavnagar University</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 14G. EXECUTIVE ALUMNI NETWORK & GLOBAL SISTERHOOD GUILD */}
        <section className="section-padding alumni-section" id="alumni">
          <div className="container">
            <div className="section-header">
              <div className="section-subtitle">Global Community &amp; Sisterhood</div>
              <h2 className="section-title">NMC Alumni <span>Network &amp; Guild</span></h2>
              <p className="section-description">Connecting 5,000+ empowered female graduates across corporate multinationals, banking, civil administration, academia, and creative entrepreneurship.</p>
            </div>

            {/* 4 High-Impact Metric Cards */}
            <div className="alumni-metrics-grid">

              <div className="alumni-metric-card spotlight-active">
                <div className="ametric-top">
                  <div className="ametric-icon icon-ruby">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                  </div>
                  <span className="ametric-tag tag-ruby">Global Presence</span>
                </div>
                <div className="ametric-num-wrap">
                  <span className="ametric-number"><span className="strength-counter" data-target="5000">0</span>+</span>
                </div>
                <h4 className="ametric-title">Graduated Alumni</h4>
                <p className="ametric-sub">Empowered women leaders actively excelling worldwide</p>
              </div>

              <div className="alumni-metric-card spotlight-active">
                <div className="ametric-top">
                  <div className="ametric-icon icon-gold">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
                  </div>
                  <span className="ametric-tag tag-gold">Since 2009</span>
                </div>
                <div className="ametric-num-wrap">
                  <span className="ametric-number"><span className="strength-counter" data-target="15">0</span>+ Years</span>
                </div>
                <h4 className="ametric-title">Institutional Legacy</h4>
                <p className="ametric-sub">Decades of unbroken excellence in female higher education</p>
              </div>

              <div className="alumni-metric-card spotlight-active">
                <div className="ametric-top">
                  <div className="ametric-icon icon-ruby">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                  </div>
                  <span className="ametric-tag tag-ruby">Top Recruiters</span>
                </div>
                <div className="ametric-num-wrap">
                  <span className="ametric-number"><span className="strength-counter" data-target="20">0</span>+ Sectors</span>
                </div>
                <h4 className="ametric-title">Industry Representation</h4>
                <p className="ametric-sub">IT, Banking, Healthcare, Education &amp; Civil Services</p>
              </div>

              <div className="alumni-metric-card spotlight-active">
                <div className="ametric-top">
                  <div className="ametric-icon icon-gold">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  </div>
                  <span className="ametric-tag tag-gold">Active Guidance</span>
                </div>
                <div className="ametric-num-wrap">
                  <span className="ametric-number"><span className="strength-counter" data-target="94">0</span>%</span>
                </div>
                <h4 className="ametric-title">Mentorship Engagement</h4>
                <p className="ametric-sub">Seniors actively mentoring junior batches &amp; mock interviews</p>
              </div>

            </div>

            {/* Featured Distinguished Alumni Success Stories */}
            <div className="alumni-stories-section">
              <div className="astories-header">
                <div>
                  <span className="astories-badge">PROUD NMC ALUMNAE</span>
                  <h3 className="astories-title">Distinguished Alumni Spotlights</h3>
                </div>
                <span className="astories-note">Real stories of career elevation from Bhavnagar to global corporations.</span>
              </div>

              <div className="alumni-stories-grid">

                {/* Story 1 */}
                <div className="astory-card spotlight-active">
                  <div className="astory-header">
                    <div className="astory-avatar avatar-ruby">PT</div>
                    <div className="astory-meta">
                      <h4 className="astory-name">Pooja Trivedi</h4>
                      <span className="astory-role">Senior Software Engineer &bull; TCS</span>
                      <span className="astory-batch">B.C.A. (Batch of 2021)</span>
                    </div>
                  </div>
                  <p className="astory-quote">
                    "The advanced computer coding labs, technical workshops, and mentorship from NMC faculty gave me the solid fundamentals needed to clear technical rounds in top multinational software firms."
                  </p>
                  <div className="astory-footer">
                    <span className="astory-tag tag-ruby">IT &amp; Software</span>
                  </div>
                </div>

                {/* Story 2 */}
                <div className="astory-card spotlight-active">
                  <div className="astory-header">
                    <div className="astory-avatar avatar-gold">HV</div>
                    <div className="astory-meta">
                      <h4 className="astory-name">Hetal Vaghela</h4>
                      <span className="astory-role">Branch Operations Manager &bull; HDFC Bank</span>
                      <span className="astory-batch">B.Com (Batch of 2019)</span>
                    </div>
                  </div>
                  <p className="astory-quote">
                    "NMC's free doorstep bus service made daily college commute safe and effortless. The practical commerce training in taxation and banking gave me an immediate head start in banking."
                  </p>
                  <div className="astory-footer">
                    <span className="astory-tag tag-gold">Banking &amp; Finance</span>
                  </div>
                </div>

                {/* Story 3 */}
                <div className="astory-card spotlight-active">
                  <div className="astory-header">
                    <div className="astory-avatar avatar-ruby">KP</div>
                    <div className="astory-meta">
                      <h4 className="astory-name">Kinjal Patel</h4>
                      <span className="astory-role">Founder &amp; Creative Lead &bull; Aura Apparel</span>
                      <span className="astory-batch">Diploma in Fashion Designing (2022)</span>
                    </div>
                  </div>
                  <p className="astory-quote">
                    "The state-of-the-art garment stitching studio and incubation guidance at NMC provided me the confidence to launch my own boutique studio, now employing 12 local craftswomen."
                  </p>
                  <div className="astory-footer">
                    <span className="astory-tag tag-ruby">Fashion &amp; Startup</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Alumni Association Hub & Quick Registration Card */}
            <div className="alumni-guild-hub spotlight-active">
              <div className="aguild-left">
                <span className="aguild-badge">ALUMNAE GUILD PRIVILEGES</span>
                <h3 className="aguild-title">Join the Official NMC Alumni Network</h3>
                <p className="aguild-desc">Are you an NMC graduate? Connect with 5,000+ sisters, access exclusive recruitment boards, and participate in annual campus galas.</p>

                <div className="aguild-perks">
                  <div className="aperk-item">
                    <span className="aperk-dot"></span>
                    <div>
                      <strong>Alumni Mentorship Circle</strong>
                      <span>Lead workshops and guide junior college students</span>
                    </div>
                  </div>
                  <div className="aperk-item">
                    <span className="aperk-dot"></span>
                    <div>
                      <strong>Annual Homecoming Gala &amp; Awards</strong>
                      <span>Reconnect with classmates, esteemed professors &amp; trustees</span>
                    </div>
                  </div>
                  <div className="aperk-item">
                    <span className="aperk-dot"></span>
                    <div>
                      <strong>Corporate Hiring &amp; Job Board</strong>
                      <span>Post opportunities and recruit verified talent from NMC</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="aguild-right">
                <div className="aguild-form-box">
                  <h4 className="aform-title">Fast-Track Alumni Registration</h4>
                  <p className="aform-sub">Register in under 60 seconds to join our verified directory.</p>

                  <form id="alumniForm" onsubmit="event.preventDefault(); alert('Thank you for registering in the NMC Alumni Guild! Our community coordinator will reach out shortly.'); this.reset();">
                    <div className="aform-group">
                      <input type="text" className="aform-input" placeholder="Your Full Name *" required />
                    </div>
                    <div className="aform-row">
                      <input type="text" className="aform-input" placeholder="Passout Year (e.g. 2021)" required />
                      <input type="text" className="aform-input" placeholder="Course (BCA/BBA/B.Com)" required />
                    </div>
                    <div className="aform-group">
                      <input type="text" className="aform-input" placeholder="Current Company / Designation" />
                    </div>
                    <div className="aform-group">
                      <input type="tel" className="aform-input" placeholder="WhatsApp Number *" required />
                    </div>
                    <button type="submit" className="btn-alumni-submit">
                      <span>Join Official Alumni Guild</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* FOOTER */}


        {/* Back to Top Button */}
      </main>
      <Footer />
    </>
  );
}







