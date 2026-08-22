import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import styles from './page.module.css';

export const metadata = {
  title: 'Syllabus Link | Student Corner | Nandkunvarba Mahila College',
  description: 'Download MKBU syllabus for all courses — BBA, BCA, BA, BCom, MA, MCom, MSW, and diploma programs at NMC Bhavnagar.',
};

const syllabusData = [
  { name: 'B.B.A.', type: 'Undergraduate • 6 Semesters', icon: 'red', semesters: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'], link: '#' },
  { name: 'B.C.A.', type: 'Undergraduate • 6 Semesters', icon: 'red', semesters: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'], link: '#' },
  { name: 'B.A.', type: 'Undergraduate • 6 Semesters', icon: 'red', semesters: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'], link: '#' },
  { name: 'B.Com.', type: 'Undergraduate • 6 Semesters', icon: 'red', semesters: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'], link: '#' },
  { name: 'M.A.', type: 'Postgraduate • 4 Semesters', icon: 'gold', semesters: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'], link: '#' },
  { name: 'M.Com.', type: 'Postgraduate • 4 Semesters', icon: 'gold', semesters: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'], link: '#' },
  { name: 'M.S.W.', type: 'Postgraduate • 4 Semesters', icon: 'gold', semesters: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'], link: '#' },
  { name: 'P.G.D.P.A.', type: 'Postgraduate Diploma • 2 Semesters', icon: 'gold', semesters: ['Sem 1', 'Sem 2'], link: '#' },
  { name: 'Fashion Designing (F.D.)', type: 'Diploma • 1 Year', icon: 'green', semesters: ['Year 1'], link: '#' },
  { name: 'D.M.P.H.W.', type: 'Diploma • 2 Years', icon: 'green', semesters: ['Year 1', 'Year 2'], link: '#' },
  { name: 'D.H.S.I.', type: 'Diploma • 1 Year', icon: 'green', semesters: ['Year 1'], link: '#' },
  { name: 'D.N.Y.S.', type: 'Diploma • 2 Years', icon: 'green', semesters: ['Year 1', 'Year 2'], link: '#' },
];

export default function SyllabusLinkPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className={styles.heroSection}>
          <div className={styles.heroBgImage}>
            <Image src="/assets/home/hero/2.jpg" alt="Syllabus Link" width={1400} height={700} priority className={styles.heroBgImg} />
          </div>
          <div className={styles.heroOverlay}></div>
          <div className={`${styles.heroContent} container`}>
            <h1 className={`hero-main-title ${styles.heroTitle}`}><em>Syllabus Link</em></h1>
          </div>
        </section>

        {/* Syllabus Section */}
        <section className={styles.syllabusSection}>
          <div className={styles.container}>
            <div className={styles.syllabusHeader}>
              <div className={styles.syllabusLabel}>
                <span className={styles.syllabusLabelLine}></span>
                MKBU University Syllabus
              </div>
              <h2 className={styles.syllabusTitle}>Syllabus <span>Downloads</span></h2>
              <p className={styles.syllabusDesc}>
                Access semester-wise syllabus for all courses affiliated to Maharaja Krishnakumarsinhji Bhavnagar University. Click on any course to download the latest curriculum.
              </p>
            </div>

            <div className={styles.syllabusGrid}>
              {syllabusData.map((item, i) => (
                <div className={styles.syllabusCard} key={i}>
                  <div className={`${styles.syllabusCardIcon} ${styles[`icon${item.icon.charAt(0).toUpperCase() + item.icon.slice(1)}`]}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                  </div>
                  <h3 className={styles.syllabusCardName}>{item.name}</h3>
                  <p className={styles.syllabusCardType}>{item.type}</p>
                  <div className={styles.syllabusCardSemesters}>
                    {item.semesters.map((sem, j) => (
                      <span className={styles.semBadge} key={j}>{sem}</span>
                    ))}
                  </div>
                  <a href={item.link} className={styles.syllabusCardLink} target="_blank" rel="noopener noreferrer">
                    Download Syllabus
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
