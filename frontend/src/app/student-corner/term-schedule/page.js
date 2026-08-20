import Image from 'next/image';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import styles from './page.module.css';

export const metadata = {
  title: 'Term Schedule | Student Corner | Nandkunvarba Mahila College',
  description: 'Academic term schedule, semester dates, exam timetables, and important events at Nandkunvarba Mahila College.',
};

export default function TermSchedulePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className={styles.heroSection}>
          <div className={styles.heroBgImage}>
            <Image src="/assets/home/hero/2.jpg" alt="Term Schedule" width={1400} height={700} priority className={styles.heroBgImg} />
          </div>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}><em>Term Schedule</em></h1>
          </div>
        </section>

        {/* Schedule Section */}
        <section className={styles.scheduleSection}>
          <div className={styles.container}>
            <div className={styles.scheduleHeader}>
              <div className={styles.scheduleLabel}>
                <span className={styles.scheduleLabelLine}></span>
                Academic Calendar 2026-27
              </div>
              <h2 className={styles.scheduleTitle}>Term <span>Schedule</span></h2>
              <p className={styles.scheduleDesc}>
                Complete academic calendar with semester dates, examination schedules, holidays, and important events for the current academic year.
              </p>
            </div>

            <div className={styles.termGrid}>
              {/* Odd Semester */}
              <div className={styles.termCard}>
                <div className={`${styles.termCardHeader} ${styles.termCardHeaderOdd}`}>
                  <span className={styles.termCardSem}>Odd Semester (1, 3, 5)</span>
                  <span className={styles.termCardPeriod}>Aug – Dec 2026</span>
                </div>
                <div className={styles.termCardBody}>
                  <div className={styles.termEvent}>
                    <span className={styles.termEventDate}>Aug 1</span>
                    <span className={styles.termEventName}>Semester Commencement</span>
                    <span className={styles.termEventTag}>Start</span>
                  </div>
                  <div className={styles.termEvent}>
                    <span className={styles.termEventDate}>Aug 15</span>
                    <span className={styles.termEventName}>Independence Day Holiday</span>
                    <span className={`${styles.termEventTag} ${styles.termEventTagGold}`}>Holiday</span>
                  </div>
                  <div className={styles.termEvent}>
                    <span className={styles.termEventDate}>Sep 15</span>
                    <span className={styles.termEventName}>Internal Exam - I (Unit Test)</span>
                    <span className={styles.termEventTag}>Exam</span>
                  </div>
                  <div className={styles.termEvent}>
                    <span className={styles.termEventDate}>Oct 2-5</span>
                    <span className={styles.termEventName}>Dussehra &amp; Gandhi Jayanti Break</span>
                    <span className={`${styles.termEventTag} ${styles.termEventTagGold}`}>Holiday</span>
                  </div>
                  <div className={styles.termEvent}>
                    <span className={styles.termEventDate}>Oct 20</span>
                    <span className={styles.termEventName}>Diwali Vacation Begins</span>
                    <span className={`${styles.termEventTag} ${styles.termEventTagGold}`}>Holiday</span>
                  </div>
                  <div className={styles.termEvent}>
                    <span className={styles.termEventDate}>Nov 5</span>
                    <span className={styles.termEventName}>Classes Resume</span>
                    <span className={styles.termEventTag}>Start</span>
                  </div>
                  <div className={styles.termEvent}>
                    <span className={styles.termEventDate}>Nov 15</span>
                    <span className={styles.termEventName}>Internal Exam - II (Mid Sem)</span>
                    <span className={styles.termEventTag}>Exam</span>
                  </div>
                  <div className={styles.termEvent}>
                    <span className={styles.termEventDate}>Dec 1-15</span>
                    <span className={styles.termEventName}>MKBU University Examination</span>
                    <span className={styles.termEventTag}>Exam</span>
                  </div>
                  <div className={styles.termEvent}>
                    <span className={styles.termEventDate}>Dec 20</span>
                    <span className={styles.termEventName}>Winter Vacation Begins</span>
                    <span className={`${styles.termEventTag} ${styles.termEventTagGold}`}>Holiday</span>
                  </div>
                </div>
              </div>

              {/* Even Semester */}
              <div className={styles.termCard}>
                <div className={`${styles.termCardHeader} ${styles.termCardHeaderEven}`}>
                  <span className={styles.termCardSem}>Even Semester (2, 4, 6)</span>
                  <span className={styles.termCardPeriod}>Jan – May 2027</span>
                </div>
                <div className={styles.termCardBody}>
                  <div className={styles.termEvent}>
                    <span className={styles.termEventDate}>Jan 6</span>
                    <span className={styles.termEventName}>Semester Commencement</span>
                    <span className={styles.termEventTag}>Start</span>
                  </div>
                  <div className={styles.termEvent}>
                    <span className={styles.termEventDate}>Jan 26</span>
                    <span className={styles.termEventName}>Republic Day Celebration &amp; NCC Parade</span>
                    <span className={`${styles.termEventTag} ${styles.termEventTagGold}`}>Holiday</span>
                  </div>
                  <div className={styles.termEvent}>
                    <span className={styles.termEventDate}>Feb 10</span>
                    <span className={styles.termEventName}>Internal Exam - I (Unit Test)</span>
                    <span className={styles.termEventTag}>Exam</span>
                  </div>
                  <div className={styles.termEvent}>
                    <span className={styles.termEventDate}>Feb 14-16</span>
                    <span className={styles.termEventName}>Annual Cultural Festival</span>
                    <span className={`${styles.termEventTag} ${styles.termEventTagGold}`}>Event</span>
                  </div>
                  <div className={styles.termEvent}>
                    <span className={styles.termEventDate}>Mar 8</span>
                    <span className={styles.termEventName}>Women&apos;s Day Celebration</span>
                    <span className={`${styles.termEventTag} ${styles.termEventTagGold}`}>Event</span>
                  </div>
                  <div className={styles.termEvent}>
                    <span className={styles.termEventDate}>Mar 15</span>
                    <span className={styles.termEventName}>Internal Exam - II (Mid Sem)</span>
                    <span className={styles.termEventTag}>Exam</span>
                  </div>
                  <div className={styles.termEvent}>
                    <span className={styles.termEventDate}>Mar 20-25</span>
                    <span className={styles.termEventName}>Campus Placement Drive</span>
                    <span className={styles.termEventTag}>Placement</span>
                  </div>
                  <div className={styles.termEvent}>
                    <span className={styles.termEventDate}>Apr 10-30</span>
                    <span className={styles.termEventName}>MKBU University Examination</span>
                    <span className={styles.termEventTag}>Exam</span>
                  </div>
                  <div className={styles.termEvent}>
                    <span className={styles.termEventDate}>May 1</span>
                    <span className={styles.termEventName}>Summer Vacation Begins</span>
                    <span className={`${styles.termEventTag} ${styles.termEventTagGold}`}>Holiday</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
