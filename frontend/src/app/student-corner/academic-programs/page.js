import Image from 'next/image';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import AcademicTabs from './AcademicTabs';
import styles from './page.module.css';

export const metadata = {
  title: 'Academic Programs | Student Corner | Nandkunvarba Mahila College',
  description: 'Explore all undergraduate, postgraduate, diploma, and certificate courses offered at Nandkunvarba Mahila College, Bhavnagar.',
};

export default function AcademicProgramsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="hero-fullscreen" id="home" style={{ minHeight: "50vh", height: "50vh" }}>
          <div className="hero-bg-image">
            <Image src="/assets/home/hero/2.jpg" alt="Academic Programs" width={1400} height={700} priority className="hero-bg-img" />
          </div>
          <div className="hero-overlay" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))" }}></div>
          <div className="hero-content container" style={{ paddingTop: "100px", display: "flex", alignItems: "flex-end", height: "100%", paddingBottom: "80px" }}>
            <h1 className="hero-main-title"><em>Academic Programs</em></h1>
          </div>
        </section>

        {/* Programs Section */}
        <section className={styles.programsSection}>
          <div className={styles.container}>
            <div className={styles.programsHeader}>
              <div className={styles.programsLabel}>
                <span className={styles.programsLabelLine}></span>
                Course Offerings
              </div>
              <h2 className={styles.programsTitle}>Our Academic <span>Programs</span></h2>
              <p className={styles.programsDesc}>
                NMC offers 12+ undergraduate, postgraduate, diploma, and certificate courses affiliated to M.K. Bhavnagar University — empowering women with knowledge and industry-relevant skills.
              </p>
            </div>

            <AcademicTabs />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
