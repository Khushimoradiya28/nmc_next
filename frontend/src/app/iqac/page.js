import Image from 'next/image';
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
          </div>
        </section>

        <IQACAnimations>
          {/* 1. About IQAC — The Overlap Composition */}
          <section className={styles.introSection}>
            <div className={styles.introLayout}>
              {/* Editorial Image — right-aligned, bleeds beyond grid */}
              <div className={styles.introVisual} data-animate="fade-right">
                {/* 
                  AI IMAGE DIRECTION:
                  Cinematic editorial photo — Indian women educators in institutional 
                  corridor/architecture. Natural lighting, warm tones, subtle film grain.
                  Composition: subjects on right side, negative space on left for text.
                  Style: Premium magazine / campaign photography. NOT stock photo.
                */}
                <Image
                  src="/assets/home/hero/2.jpg"
                  alt="Women leaders in academic excellence — IQAC"
                  width={900}
                  height={600}
                  priority
                />
                <div className={styles.introVisualOverlay}></div>
              </div>

              {/* Ghost IQAC between layers */}
              <span className={styles.introGhost}>IQAC</span>

              {/* Content — overlaps image from left */}
              <div className={styles.introContentBlock} data-animate="fade-left">
                <div className={styles.introLabel}>
                  <span className={styles.introLabelLine}></span>
                  About IQAC
                </div>

                <h2 className={styles.introHeading}>
                  Driving
                  <span className={styles.introHeadingAccent}>Quality Culture</span>
                  & Academic Excellence
                </h2>

                <p className={styles.introDesc}>
                  The IQAC at <strong>Nandkunvarba Mahila College</strong> develops a system for <strong>conscious, consistent, and catalytic improvement</strong> in institutional performance — planning, guiding, and monitoring academic and administrative activities across every department.
                </p>

                {/* Statistics — vertical strip */}
                <div className={styles.introStats}>
                  <div className={styles.introStatItem}>
                    <span className={styles.introStatNum}>15+</span>
                    <span className={styles.introStatLabel}>Years of Excellence</span>
                  </div>
                  <div className={styles.introStatItem}>
                    <span className={styles.introStatNum}>10</span>
                    <span className={styles.introStatLabel}>Committee Members</span>
                  </div>
                  <div className={styles.introStatItem}>
                    <span className={styles.introStatNum}>50+</span>
                    <span className={styles.introStatLabel}>Programs Conducted</span>
                  </div>
                  <div className={styles.introStatItem}>
                    <span className={styles.introStatNum}>12+</span>
                    <span className={styles.introStatLabel}>Departments Covered</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Composition — Interactive Spotlight */}
          <CommitteeSpotlight />

          {/* 3. Strategies */}
          <section className={styles.stratSection}>
            <div className={styles.container}>
              <div className={styles.premiumTag}>
                <span className={styles.premiumTagDot}></span>
                <span>Quality Framework</span>
              </div>
              <h2 className={styles.sectionTitle}>Strategies &amp; <span>Functions</span></h2>
              <p className={styles.sectionDesc}>
                Key functions driving quality assurance and enhancement across the institution.
              </p>

              <div className={styles.stratGrid} data-animate="stagger-cards">
                {[
                  { title: 'Academic Planning', desc: 'Systematic academic calendar, curriculum enrichment, and pedagogical innovations for enhanced outcomes.', icon: 'red', chip: 'Core', meter: 'meterRed' },
                  { title: 'Performance Monitoring', desc: 'Regular evaluation of teaching-learning processes, research output, and performance metrics.', icon: 'gold', chip: 'Analysis', meter: 'meterGold' },
                  { title: 'Stakeholder Feedback', desc: 'Structured feedback from students, parents, faculty, and employers for continuous improvement.', icon: 'green', chip: 'Input', meter: 'meterGreen' },
                  { title: 'Infrastructure Development', desc: 'Smart classrooms, digital library, labs, and campus facility upgradation.', icon: 'red', chip: 'Growth', meter: 'meterRed' },
                  { title: 'Research & Innovation', desc: 'Research culture promotion, publication support, and innovative practices among faculty.', icon: 'gold', chip: 'R&D', meter: 'meterGold' },
                  { title: 'Best Practices', desc: 'Documentation and dissemination of institutional best practices and quality benchmarks.', icon: 'green', chip: 'Standard', meter: 'meterGreen' },
                ].map((s, i) => (
                  <div className={styles.stratCard} key={i}>
                    <div className={styles.stratCardTop}>
                      <div className={`${styles.stratCardIcon} ${styles[`stratIcon${s.icon.charAt(0).toUpperCase() + s.icon.slice(1)}`]}`}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <span className={styles.stratCardChip}>{s.chip}</span>
                    </div>
                    <h4 className={styles.stratCardTitle}>{s.title}</h4>
                    <p className={styles.stratCardDesc}>{s.desc}</p>
                    <div className={styles.stratMeter}>
                      <div className={`${styles.stratMeterFill} ${styles[s.meter]}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Events */}
          <section className={styles.eventsSection}>
            <div className={styles.container}>
              <div className={styles.premiumTag}>
                <span className={styles.premiumTagDot}></span>
                <span>Professional Development</span>
              </div>
              <h2 className={styles.sectionTitle}>Conferences, FDP &amp; <span>Workshops</span></h2>
              <p className={styles.sectionDesc}>Regularly organized for faculty empowerment and student development.</p>

              <div className={styles.eventsGrid} data-animate="stagger-cards">
                {[
                  { title: 'Faculty Development Programs', desc: 'Pedagogy, ICT integration, research methodology, and outcome-based education.', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
                  { title: 'National & State Conferences', desc: 'Inviting eminent scholars, researchers, and industry experts for discourse.', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
                  { title: 'Skill Development Workshops', desc: 'Soft skills, digital literacy, entrepreneurship, and career readiness.', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> },
                  { title: 'Webinars & Guest Lectures', desc: 'Expert sessions by industry professionals and subject specialists.', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg> },
                ].map((e, i) => (
                  <div className={styles.eventCard} key={i}>
                    <div className={styles.eventCardIcon}>{e.icon}</div>
                    <div>
                      <h4 className={styles.eventCardTitle}>{e.title}</h4>
                      <p className={styles.eventCardDesc}>{e.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 5. NAAC & NIRF */}
          <section className={styles.accredSection}>
            <div className={styles.container}>
              <div className={styles.accredHeader} data-animate="header">
                <p className={styles.accredHeaderTag}>Accreditation &amp; Ranking</p>
                <h2 className={styles.accredHeaderTitle}>NAAC &amp; NIRF</h2>
              </div>

              <div className={styles.accredGrid} data-animate="stagger-cards">
                <div className={styles.accredCard}>
                  <div className={`${styles.accredCardIcon} ${styles.accredIconRed}`}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                  </div>
                  <h3 className={styles.accredCardTitle}>NAAC</h3>
                  <p className={styles.accredCardSub}>National Assessment &amp; Accreditation</p>
                  <p className={styles.accredCardText}>Quality assurance assessing curricular aspects, teaching-learning, research, infrastructure, student support, and governance.</p>
                </div>
                <div className={styles.accredCard}>
                  <div className={`${styles.accredCardIcon} ${styles.accredIconGold}`}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  </div>
                  <h3 className={styles.accredCardTitle}>NIRF</h3>
                  <p className={styles.accredCardSub}>National Institutional Ranking</p>
                  <p className={styles.accredCardText}>Ranking based on Teaching, Research, Graduation Outcomes, Outreach, Inclusivity, and Perception parameters.</p>
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
