import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import styles from './page.module.css';

export const metadata = {
  title: 'Tablet Scheme | Student Corner | Nandkunvarba Mahila College',
  description: 'Government tablet assistance scheme for students at Nandkunvarba Mahila College, Bhavnagar. Free tablet for eligible students.',
};

export default function TabletSchemePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className={styles.heroSection}>
          <div className={styles.heroBgImage}>
            <Image src="/assets/home/hero/2.jpg" alt="Tablet Scheme" width={1400} height={700} priority className={styles.heroBgImg} />
          </div>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}><em>Tablet Scheme</em></h1>
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.container}>
            <div className={styles.infoLayout}>
              {/* Left: Info */}
              <div className={styles.infoLeft}>
                <div className={styles.infoLabel}>
                  <span className={styles.infoLabelLine}></span>
                  Government Initiative
                </div>
                <h2 className={styles.infoTitle}>Tablet Assistance <span>Scheme</span></h2>
                <p className={styles.infoDesc}>
                  The Government of Gujarat provides free tablets to eligible college students under the Digital Gujarat initiative. NMC facilitates the application process and distribution to empower students with digital learning tools.
                </p>

                <div className={styles.highlights}>
                  <div className={styles.highlightItem}>
                    <span className={styles.highlightIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <span className={styles.highlightText}>100% Free tablet for eligible students from EWS/BPL families</span>
                  </div>
                  <div className={styles.highlightItem}>
                    <span className={styles.highlightIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <span className={styles.highlightText}>Apply through Digital Gujarat Portal (digitalgujarat.gov.in)</span>
                  </div>
                  <div className={styles.highlightItem}>
                    <span className={styles.highlightIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <span className={styles.highlightText}>Pre-loaded with educational apps &amp; e-books</span>
                  </div>
                  <div className={styles.highlightItem}>
                    <span className={styles.highlightIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <span className={styles.highlightText}>NMC office assists with application &amp; document verification</span>
                  </div>
                  <div className={styles.highlightItem}>
                    <span className={styles.highlightIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <span className={styles.highlightText}>Supports online lectures, exam prep &amp; digital submissions</span>
                  </div>
                </div>
              </div>

              {/* Right: Visual Card */}
              <div className={styles.infoVisual}>
                <div className={styles.visualIcon}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
                  </svg>
                </div>
                <h3 className={styles.visualTitle}>Free Tablet Distribution</h3>
                <p className={styles.visualSub}>Government of Gujarat initiative for digital empowerment of women students in higher education.</p>
                <div className={styles.visualStats}>
                  <div className={styles.visualStat}>
                    <div className={styles.visualStatNum}>1000+</div>
                    <div className={styles.visualStatLabel}>Tablets Distributed</div>
                  </div>
                  <div className={styles.visualStat}>
                    <div className={styles.visualStatNum}>Free</div>
                    <div className={styles.visualStatLabel}>No Cost to Student</div>
                  </div>
                  <div className={styles.visualStat}>
                    <div className={styles.visualStatNum}>WiFi</div>
                    <div className={styles.visualStatLabel}>Internet Enabled</div>
                  </div>
                  <div className={styles.visualStat}>
                    <div className={styles.visualStatNum}>4GB</div>
                    <div className={styles.visualStatLabel}>RAM + 64GB Storage</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Eligibility Section */}
        <section className={styles.eligibilitySection}>
          <div className={styles.container}>
            <div className={styles.eligibilityHeader}>
              <h2 className={styles.eligibilityTitle}>Eligibility <span>Criteria</span></h2>
            </div>

            <div className={styles.eligibilityGrid}>
              <div className={styles.eligibilityCard}>
                <span className={styles.eligibilityNum}>01</span>
                <p className={styles.eligibilityText}>Must be enrolled in a recognized college affiliated to Gujarat University/MKBU</p>
              </div>
              <div className={styles.eligibilityCard}>
                <span className={styles.eligibilityNum}>02</span>
                <p className={styles.eligibilityText}>Family annual income must be below ₹2,50,000 (BPL/EWS category)</p>
              </div>
              <div className={styles.eligibilityCard}>
                <span className={styles.eligibilityNum}>03</span>
                <p className={styles.eligibilityText}>Student must have Aadhar card linked to mobile number</p>
              </div>
              <div className={styles.eligibilityCard}>
                <span className={styles.eligibilityNum}>04</span>
                <p className={styles.eligibilityText}>Valid caste certificate (if applicable) from competent authority</p>
              </div>
              <div className={styles.eligibilityCard}>
                <span className={styles.eligibilityNum}>05</span>
                <p className={styles.eligibilityText}>Must not have received tablet from any other government scheme</p>
              </div>
              <div className={styles.eligibilityCard}>
                <span className={styles.eligibilityNum}>06</span>
                <p className={styles.eligibilityText}>Minimum 70% attendance in previous semester required</p>
              </div>
            </div>

            {/* Apply CTA */}
            <div className={styles.applyCta}>
              <span className={styles.applyCtaText}>Ready to apply? Visit <strong>Digital Gujarat Portal</strong> or contact NMC office.</span>
              <a href="https://www.digitalgujarat.gov.in/" target="_blank" rel="noopener noreferrer" className={styles.applyCtaBtn}>
                Apply Now
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
