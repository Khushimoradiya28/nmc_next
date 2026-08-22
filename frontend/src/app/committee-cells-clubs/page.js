import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import CCCAnimations from './CCCAnimations';
import styles from './page.module.css';

export const metadata = {
  title: 'Committee, Cells & Clubs | Nandkunvarba Mahila College',
  description: 'Explore the committees, cells, and clubs at Nandkunvarba Mahila College — Research Cell, Anti-Ragging, ICC, Women Empowerment, NSS, NCC, and more.',
};

export default function CommitteeCellsClubsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Banner */}
        <section className={styles.heroSection}>
          <div className={styles.heroBgImage}>
            <Image
              src="/assets/home/hero/2.jpg"
              alt="Committee, Cells & Clubs - NMC Bhavnagar"
              width={1400}
              height={700}
              priority
              className={styles.heroBgImg}
            />
          </div>
          <div className={styles.heroOverlay}></div>
          <div className={`${styles.heroContent} container`}>
            <h1 className={`hero-main-title ${styles.heroTitle}`}><em>Committee, Cells &amp; Clubs</em></h1>
          </div>
        </section>

        <CCCAnimations>
          {/* Intro Statement */}
          <section className={styles.introSection}>
            <div className={styles.container}>
              <div className={styles.introLayout} data-animate="header">
                <p className={styles.introBigText}>
                  Dedicated institutional bodies ensuring <span>safety, empowerment,</span> academic support, and holistic student development beyond the classroom.
                </p>
                <p className={styles.introMeta}>
                  11 active committees and clubs working year-round to create a supportive, inclusive, and growth-oriented campus ecosystem for every student at NMC.
                </p>
              </div>
            </div>
          </section>

          {/* Bento Grid */}
          <section className={styles.gridSection}>
            <div className={styles.container}>
              <div className={styles.bentoGrid} data-animate="stagger-cards">

                {/* Row 1: 7 + 5 = 12 */}
                <div className={`${styles.cell} ${styles.cellLg} ${styles.bgDark}`}>
                  <span className={styles.cellCorner}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  </span>
                  <span className={styles.cellNum}>01 — Cell</span>
                  <h3 className={styles.cellTitle}>Research &amp; Development Cell</h3>
                  <p className={styles.cellDesc}>Promotes research culture among faculty and students — publications, methodology workshops, mini-research projects, and interdisciplinary collaboration.</p>
                  <div className={styles.cellTags}>
                    <span className={styles.cellTag}>Publications</span>
                    <span className={styles.cellTag}>Workshops</span>
                    <span className={styles.cellTag}>Innovation</span>
                  </div>
                </div>

                <div className={`${styles.cell} ${styles.cellMd} ${styles.bgRed}`}>
                  <span className={styles.cellCorner}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </span>
                  <span className={styles.cellNum}>02 — Safety</span>
                  <h3 className={styles.cellTitle}>Anti-Ragging Cell</h3>
                  <p className={styles.cellDesc}>Zero-tolerance policy. 24/7 helpline, awareness campaigns, and strict disciplinary action as per UGC &amp; Supreme Court guidelines.</p>
                  <div className={styles.cellTags}>
                    <span className={styles.cellTag}>Zero Tolerance</span>
                    <span className={styles.cellTag}>24/7 Helpline</span>
                  </div>
                </div>

                {/* Row 2: 4 + 8 = 12 */}
                <div className={`${styles.cell} ${styles.cellSm} ${styles.bgCream}`}>
                  <span className={styles.cellCorner}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </span>
                  <span className={styles.cellNum}>03 — Support</span>
                  <h3 className={styles.cellTitle}>Students Counseling Cell</h3>
                  <p className={styles.cellDesc}>Professional guidance for academic stress, career confusion, and personal challenges.</p>
                  <div className={styles.cellTags}>
                    <span className={styles.cellTag}>Career Guidance</span>
                    <span className={styles.cellTag}>Mentoring</span>
                  </div>
                </div>

                <div className={`${styles.cell} ${styles.cellWide} ${styles.bgLight}`}>
                  <span className={styles.cellCorner}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  </span>
                  <span className={styles.cellNum}>04 — Compliance</span>
                  <h3 className={styles.cellTitle}>Internal Complaint Committee (ICC)</h3>
                  <p className={styles.cellDesc}>Constituted under the Sexual Harassment of Women at Workplace Act, 2013. Confidential complaint handling, gender sensitization, and timely legal resolution.</p>
                  <div className={styles.cellTags}>
                    <span className={styles.cellTag}>Confidential</span>
                    <span className={styles.cellTag}>Legal Framework</span>
                    <span className={styles.cellTag}>Gender Sensitization</span>
                  </div>
                </div>

                {/* Row 3: 7 + 5 = 12 */}
                <div className={`${styles.cell} ${styles.cellLg} ${styles.bgGlass}`}>
                  <span className={styles.cellCorner}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </span>
                  <span className={styles.cellNum}>05 — Redressal</span>
                  <h3 className={styles.cellTitle}>Grievance Redressal Cell</h3>
                  <p className={styles.cellDesc}>Transparent mechanism — online &amp; offline submission, time-bound resolution, anonymous complaint facility, and regular review meetings.</p>
                  <div className={styles.cellTags}>
                    <span className={styles.cellTag}>Transparent</span>
                    <span className={styles.cellTag}>Time-Bound</span>
                    <span className={styles.cellTag}>Anonymous</span>
                  </div>
                </div>

                <div className={`${styles.cell} ${styles.cellMd} ${styles.bgDark}`}>
                  <span className={styles.cellCorner}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  </span>
                  <span className={styles.cellNum}>06 — Empowerment</span>
                  <h3 className={styles.cellTitle}>Women Empowerment Cell</h3>
                  <p className={styles.cellDesc}>Self-defense, legal awareness, entrepreneurship programs, and leadership training for women students.</p>
                  <div className={styles.cellTags}>
                    <span className={styles.cellTag}>Self-Defense</span>
                    <span className={styles.cellTag}>Legal Rights</span>
                    <span className={styles.cellTag}>Leadership</span>
                  </div>
                </div>

                {/* Row 4: 6 + 6 = 12 */}
                <div className={`${styles.cell} ${styles.cellHalf} ${styles.bgCream}`}>
                  <span className={styles.cellCorner}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                  </span>
                  <span className={styles.cellNum}>07 — Academic</span>
                  <h3 className={styles.cellTitle}>Remedial Classes</h3>
                  <p className={styles.cellDesc}>Extra coaching for SC/ST/OBC and economically backward students — study material, focused attention, and periodic assessments.</p>
                  <div className={styles.cellTags}>
                    <span className={styles.cellTag}>Extra Classes</span>
                    <span className={styles.cellTag}>Study Material</span>
                    <span className={styles.cellTag}>Assessment</span>
                  </div>
                </div>

                <div className={`${styles.cell} ${styles.cellHalf} ${styles.bgRed}`}>
                  <span className={styles.cellCorner}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>
                  </span>
                  <span className={styles.cellNum}>08 — Service</span>
                  <h3 className={styles.cellTitle}>NSS Committee</h3>
                  <p className={styles.cellDesc}>Community service, 7-day village camps, blood donation, Swachh Bharat, and voter awareness programs.</p>
                  <div className={styles.cellTags}>
                    <span className={styles.cellTag}>Village Camps</span>
                    <span className={styles.cellTag}>Blood Donation</span>
                    <span className={styles.cellTag}>Swachh Bharat</span>
                  </div>
                </div>

                {/* Row 5: 5 + 7 = 12 */}
                <div className={`${styles.cell} ${styles.cellMd} ${styles.bgLight}`}>
                  <span className={styles.cellCorner}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                  </span>
                  <span className={styles.cellNum}>09 — Discipline</span>
                  <h3 className={styles.cellTitle}>NCC Committee</h3>
                  <p className={styles.cellDesc}>Discipline, patriotism, and leadership through drill, parades, adventure camps, and personality development.</p>
                  <div className={styles.cellTags}>
                    <span className={styles.cellTag}>Parades</span>
                    <span className={styles.cellTag}>Adventure</span>
                    <span className={styles.cellTag}>Patriotism</span>
                  </div>
                </div>

                <div className={`${styles.cell} ${styles.cellLg} ${styles.bgDark}`}>
                  <span className={styles.cellCorner}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  </span>
                  <span className={styles.cellNum}>10 — Equity</span>
                  <h3 className={styles.cellTitle}>SC / ST Committee</h3>
                  <p className={styles.cellDesc}>Welfare, equal opportunity, anti-discrimination monitoring, scholarship guidance, and special mentoring for SC/ST students.</p>
                  <div className={styles.cellTags}>
                    <span className={styles.cellTag}>Scholarships</span>
                    <span className={styles.cellTag}>Mentoring</span>
                    <span className={styles.cellTag}>Inclusion</span>
                  </div>
                </div>

                {/* Row 6: 12 (full) */}
                <div className={`${styles.cell} ${styles.cellFull} ${styles.bgCream}`}>
                  <span className={styles.cellCorner}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22V8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>
                  </span>
                  <span className={styles.cellNum}>11 — Sustainability</span>
                  <h3 className={styles.cellTitle}>Nature &amp; Environment Club</h3>
                  <p className={styles.cellDesc}>Tree plantation drives, World Environment Day, plastic-free campus, waste management, and nature excursions promoting eco-consciousness across campus.</p>
                  <div className={styles.cellTags}>
                    <span className={styles.cellTag}>Plantation</span>
                    <span className={styles.cellTag}>Eco-Campus</span>
                    <span className={styles.cellTag}>Sustainability</span>
                    <span className={styles.cellTag}>Awareness</span>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </CCCAnimations>
      </main>
      <Footer />
    </>
  );
}
