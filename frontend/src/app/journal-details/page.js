import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import styles from './page.module.css';

export const metadata = {
  title: 'Journal Details | Nandkunvarba Mahila College',
  description: 'Learn more about the academic journals, publication details, and guidelines at Nandkunvarba Mahila College.',
};

export default function JournalDetailsPage() {
  return (
    <>
      <Header />
      <main className={styles.pageWrapper}>
        {/* Hero Banner */}
        <section className="hero-fullscreen" id="home" style={{ minHeight: "50vh", height: "50vh" }}>
          <div className="hero-bg-image">
            <Image 
              src="/assets/home/hero/2.jpg" 
              alt="Journal Details Banner" 
              fill
              className="hero-bg-img"
              priority
            />
          </div>
          <div className="hero-overlay" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))" }}></div>
          
          <div className="hero-content container" style={{ paddingTop: "100px", display: "flex", alignItems: "flex-end", height: "100%", paddingBottom: "80px" }}>
            <h1 className="hero-main-title">
              <em>Journal Details</em>
            </h1>
          </div>
        </section>

        {/* Content Section */}
        <section className={`section-padding ${styles.contentSection}`}>
          <div className="container">
            
            {/* Intro Card */}
            <div className={styles.introCard}>
              <span className={styles.introBadge}>
                Academic Publications
              </span>
              <h2 className={styles.introTitle}>
                Nandkunvarba Mahila College Research Journal
              </h2>
              <p className={styles.introDescription}>
                Our institution publishes a peer-reviewed academic journal biannually, providing a prominent platform for researchers, scholars, and academicians to publish high-quality research papers across multiple disciplines including Commerce, Arts, Management, and Humanities.
              </p>
            </div>

            {/* Grid for Details */}
            <div className={styles.infoGrid}>
              
              {/* Journal Info Card */}
              <div className={styles.infoCard}>
                <h3 className={styles.infoCardHeading}>
                  General Information
                </h3>
                <ul className={styles.infoList}>
                  <li className={styles.infoListItem}>
                    <span className={styles.infoLabel}>ISSN (Print)</span>
                    <strong className={styles.infoValue}>XXXX-XXXX</strong>
                  </li>
                  <li className={styles.infoListItem}>
                    <span className={styles.infoLabel}>Frequency</span>
                    <strong className={styles.infoValue}>Biannual</strong>
                  </li>
                  <li className={styles.infoListItem}>
                    <span className={styles.infoLabel}>Language</span>
                    <strong className={styles.infoValue}>English &amp; Gujarati</strong>
                  </li>
                  <li className={styles.infoListItem}>
                    <span className={styles.infoLabel}>Publisher</span>
                    <strong className={styles.infoValue}>NMC Publication Cell</strong>
                  </li>
                </ul>
              </div>

              {/* Call for Papers Card */}
              <div className={styles.infoCard}>
                <h3 className={styles.infoCardHeading}>
                  Call for Papers
                </h3>
                <p className={styles.callForPapersText}>
                  We invite original research papers, articles, and reviews for our upcoming winter volume. Submit your manuscripts formatted as per guidelines.
                </p>
                <div className={styles.deadlineWrapper}>
                  <span className={styles.deadlineLabel}>Submission Deadline:</span>
                  <strong className={styles.deadlineValue}>October 31, 2026</strong>
                </div>
              </div>

            </div>

            {/* Submission Guidelines Card */}
            <div className={styles.guidelinesCard}>
              <h3 className={styles.guidelinesTitle}>Submission Guidelines</h3>
              <ol className={styles.guidelinesList}>
                <li className={styles.guidelinesItem}>Manuscripts must be original work, not submitted or published elsewhere.</li>
                <li className={styles.guidelinesItem}>Submit soft copies in MS Word format (.doc or .docx) via email.</li>
                <li className={styles.guidelinesItem}>All submissions undergo a double-blind peer review process.</li>
                <li className={styles.guidelinesItem}>The paper must follow standard APA reference formatting.</li>
              </ol>
              <div className={styles.guidelinesFooter}>
                <div className={styles.contactInfo}>
                  <span className={styles.contactLabel}>Submit articles directly to:</span>
                  <a href="mailto:editor.journal@nmc.edu.in" className={styles.contactEmail}>editor.journal@nmc.edu.in</a>
                </div>
                <button className={styles.submitBtn}>
                  <span className={styles.submitBtnText}>Download Author Guidelines (PDF)</span>
                </button>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
