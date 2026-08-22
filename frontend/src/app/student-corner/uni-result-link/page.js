import Image from 'next/image';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import styles from './page.module.css';

export const metadata = {
  title: 'University Result Link | Student Corner | Nandkunvarba Mahila College',
  description: 'Check MKBU university exam results for all courses at Nandkunvarba Mahila College, Bhavnagar.',
};

const results = [
  { name: 'B.B.A.', sem: 'Semester 1 to 6', type: 'UG' },
  { name: 'B.C.A.', sem: 'Semester 1 to 6', type: 'UG' },
  { name: 'B.A.', sem: 'Semester 1 to 6', type: 'UG' },
  { name: 'B.Com.', sem: 'Semester 1 to 6', type: 'UG' },
  { name: 'M.A.', sem: 'Semester 1 to 4', type: 'PG' },
  { name: 'M.Com.', sem: 'Semester 1 to 4', type: 'PG' },
  { name: 'M.S.W.', sem: 'Semester 1 to 4', type: 'PG' },
  { name: 'P.G.D.P.A.', sem: 'Semester 1 & 2', type: 'PG' },
];

export default function UniResultLinkPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className={styles.heroSection}>
          <div className={styles.heroBgImage}>
            <Image src="/assets/home/hero/2.jpg" alt="University Results" width={1400} height={700} priority className={styles.heroBgImg} />
          </div>
          <div className={styles.heroOverlay}></div>
          <div className={`${styles.heroContent} container`}>
            <h1 className={`hero-main-title ${styles.heroTitle}`}><em>University Results</em></h1>
          </div>
        </section>

        {/* CTA Section — Dark centered */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaInner}>
            <div className={styles.ctaIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <h2 className={styles.ctaTitle}>Check Your MKBU Result</h2>
            <p className={styles.ctaDesc}>
              Access your semester examination results directly from Maharaja Krishnakumarsinhji Bhavnagar University&apos;s official portal. Keep your seat number ready.
            </p>
            <a href="https://www.mkbhavuni.edu.in/result" target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}>
              Open MKBU Result Portal
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
            <p className={styles.ctaSub}>Official portal of M.K. Bhavnagar University</p>
          </div>
        </section>

        {/* Results List Section */}
        <section className={styles.resultsSection}>
          <div className={styles.container}>
            <div className={styles.resultsHeader}>
              <div className={styles.resultsHeaderLeft}>
                <div className={styles.resultsLabel}>
                  <span className={styles.resultsLabelLine}></span>
                  Course-wise Results
                </div>
                <h2 className={styles.resultsTitle}>All <span>Programs</span></h2>
              </div>
              <span className={styles.resultsCount}>8 Courses</span>
            </div>

            <div className={styles.resultList}>
              {results.map((item, i) => (
                <div className={styles.resultRow} key={i}>
                  <span className={styles.resultRowNum}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={styles.resultRowInfo}>
                    <h4 className={styles.resultRowName}>{item.name}</h4>
                    <p className={styles.resultRowSem}>{item.sem}</p>
                  </div>
                  <span className={`${styles.resultRowType} ${styles[`type${item.type}`]}`}>{item.type}</span>
                  <a href="https://www.mkbhavuni.edu.in/result" target="_blank" rel="noopener noreferrer" className={styles.resultRowLink}>
                    Check
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                  </a>
                </div>
              ))}
            </div>

            {/* Note */}
            <div className={styles.noteBox}>
              <span className={styles.noteIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </span>
              <span>
                <strong>Note:</strong> Results are declared by MKBU. You need your seat number and enrollment number. For discrepancies, contact the university examination department or NMC office at 0278-2471813.
              </span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
