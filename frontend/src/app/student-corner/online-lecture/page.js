import Image from 'next/image';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import styles from './page.module.css';

export const metadata = {
  title: 'Online Lecture Schedule | Student Corner | Nandkunvarba Mahila College',
  description: 'Department-wise online lecture timetable for BCA, BCom, BA, BBA, and MSW at NMC Bhavnagar.',
};

export default function OnlineLecturePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className={styles.heroSection}>
          <div className={styles.heroBgImage}>
            <Image src="/assets/home/hero/2.jpg" alt="Online Lectures" width={1400} height={700} priority className={styles.heroBgImg} />
          </div>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}><em>Online Lecture</em></h1>
          </div>
        </section>

        {/* Schedule Section */}
        <section className={styles.scheduleSection}>
          <div className={styles.container}>
            <div className={styles.scheduleHeader}>
              <div className={styles.scheduleLabel}>
                <span className={styles.scheduleLabelLine}></span>
                Virtual Classroom
              </div>
              <h2 className={styles.scheduleTitle}>Online Lecture <span>Schedule</span></h2>
              <p className={styles.scheduleDesc}>
                Department-wise timetable for online lectures. Join sessions via Google Meet or Zoom using the links shared by your faculty.
              </p>
            </div>

            <div className={styles.deptGrid}>
              {/* BCA */}
              <div className={styles.deptBlock}>
                <div className={`${styles.deptHeader} ${styles.deptHeaderRed}`}>
                  <span className={styles.deptName}>B.C.A. Department</span>
                  <span className={`${styles.deptBadge} ${styles.badgeRed}`}>UG</span>
                </div>
                <div className={styles.deptBody}>
                  <div className={styles.lectureRow}>
                    <span className={styles.lectureDay}>Monday</span>
                    <span className={styles.lectureSubject}>Programming in C / Data Structures</span>
                    <span className={styles.lectureTime}>09:00 – 10:30 AM</span>
                    <span className={styles.lecturePlatform}>Google Meet</span>
                  </div>
                  <div className={styles.lectureRow}>
                    <span className={styles.lectureDay}>Wednesday</span>
                    <span className={styles.lectureSubject}>Web Technology / DBMS</span>
                    <span className={styles.lectureTime}>10:30 – 12:00 PM</span>
                    <span className={styles.lecturePlatform}>Zoom</span>
                  </div>
                  <div className={styles.lectureRow}>
                    <span className={styles.lectureDay}>Friday</span>
                    <span className={styles.lectureSubject}>Python Programming / Software Engg.</span>
                    <span className={styles.lectureTime}>09:00 – 10:30 AM</span>
                    <span className={styles.lecturePlatform}>Google Meet</span>
                  </div>
                </div>
              </div>

              {/* B.Com */}
              <div className={styles.deptBlock}>
                <div className={`${styles.deptHeader} ${styles.deptHeaderGold}`}>
                  <span className={styles.deptName}>B.Com. Department</span>
                  <span className={`${styles.deptBadge} ${styles.badgeGold}`}>UG</span>
                </div>
                <div className={styles.deptBody}>
                  <div className={styles.lectureRow}>
                    <span className={styles.lectureDay}>Tuesday</span>
                    <span className={styles.lectureSubject}>Accountancy / Business Law</span>
                    <span className={styles.lectureTime}>09:00 – 10:30 AM</span>
                    <span className={styles.lecturePlatform}>Google Meet</span>
                  </div>
                  <div className={styles.lectureRow}>
                    <span className={styles.lectureDay}>Thursday</span>
                    <span className={styles.lectureSubject}>Taxation / Auditing</span>
                    <span className={styles.lectureTime}>10:30 – 12:00 PM</span>
                    <span className={styles.lecturePlatform}>Zoom</span>
                  </div>
                  <div className={styles.lectureRow}>
                    <span className={styles.lectureDay}>Saturday</span>
                    <span className={styles.lectureSubject}>Statistics / Economics</span>
                    <span className={styles.lectureTime}>09:00 – 10:30 AM</span>
                    <span className={styles.lecturePlatform}>Google Meet</span>
                  </div>
                </div>
              </div>

              {/* BA */}
              <div className={styles.deptBlock}>
                <div className={`${styles.deptHeader} ${styles.deptHeaderGreen}`}>
                  <span className={styles.deptName}>B.A. Department</span>
                  <span className={`${styles.deptBadge} ${styles.badgeGreen}`}>UG</span>
                </div>
                <div className={styles.deptBody}>
                  <div className={styles.lectureRow}>
                    <span className={styles.lectureDay}>Monday</span>
                    <span className={styles.lectureSubject}>English Literature / Psychology</span>
                    <span className={styles.lectureTime}>11:00 – 12:30 PM</span>
                    <span className={styles.lecturePlatform}>Google Meet</span>
                  </div>
                  <div className={styles.lectureRow}>
                    <span className={styles.lectureDay}>Wednesday</span>
                    <span className={styles.lectureSubject}>Sociology / Gujarati</span>
                    <span className={styles.lectureTime}>11:00 – 12:30 PM</span>
                    <span className={styles.lecturePlatform}>Zoom</span>
                  </div>
                  <div className={styles.lectureRow}>
                    <span className={styles.lectureDay}>Friday</span>
                    <span className={styles.lectureSubject}>Economics / Hindi</span>
                    <span className={styles.lectureTime}>11:00 – 12:30 PM</span>
                    <span className={styles.lecturePlatform}>Google Meet</span>
                  </div>
                </div>
              </div>

              {/* BBA */}
              <div className={styles.deptBlock}>
                <div className={`${styles.deptHeader} ${styles.deptHeaderRed}`}>
                  <span className={styles.deptName}>B.B.A. Department</span>
                  <span className={`${styles.deptBadge} ${styles.badgeRed}`}>UG</span>
                </div>
                <div className={styles.deptBody}>
                  <div className={styles.lectureRow}>
                    <span className={styles.lectureDay}>Tuesday</span>
                    <span className={styles.lectureSubject}>Marketing Management / HR</span>
                    <span className={styles.lectureTime}>09:00 – 10:30 AM</span>
                    <span className={styles.lecturePlatform}>Google Meet</span>
                  </div>
                  <div className={styles.lectureRow}>
                    <span className={styles.lectureDay}>Thursday</span>
                    <span className={styles.lectureSubject}>Financial Management / Entrepreneurship</span>
                    <span className={styles.lectureTime}>09:00 – 10:30 AM</span>
                    <span className={styles.lecturePlatform}>Zoom</span>
                  </div>
                  <div className={styles.lectureRow}>
                    <span className={styles.lectureDay}>Saturday</span>
                    <span className={styles.lectureSubject}>Business Environment / OB</span>
                    <span className={styles.lectureTime}>10:30 – 12:00 PM</span>
                    <span className={styles.lecturePlatform}>Google Meet</span>
                  </div>
                </div>
              </div>

              {/* MSW */}
              <div className={styles.deptBlock}>
                <div className={`${styles.deptHeader} ${styles.deptHeaderGold}`}>
                  <span className={styles.deptName}>M.S.W. Department</span>
                  <span className={`${styles.deptBadge} ${styles.badgeGold}`}>PG</span>
                </div>
                <div className={styles.deptBody}>
                  <div className={styles.lectureRow}>
                    <span className={styles.lectureDay}>Monday</span>
                    <span className={styles.lectureSubject}>Social Case Work / Community Org.</span>
                    <span className={styles.lectureTime}>02:00 – 03:30 PM</span>
                    <span className={styles.lecturePlatform}>Zoom</span>
                  </div>
                  <div className={styles.lectureRow}>
                    <span className={styles.lectureDay}>Wednesday</span>
                    <span className={styles.lectureSubject}>Social Research / Labour Welfare</span>
                    <span className={styles.lectureTime}>02:00 – 03:30 PM</span>
                    <span className={styles.lecturePlatform}>Google Meet</span>
                  </div>
                  <div className={styles.lectureRow}>
                    <span className={styles.lectureDay}>Friday</span>
                    <span className={styles.lectureSubject}>Counseling / Field Work Supervision</span>
                    <span className={styles.lectureTime}>02:00 – 03:30 PM</span>
                    <span className={styles.lecturePlatform}>Zoom</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className={styles.noteBox}>
              <span className={styles.noteIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </span>
              <span>
                <strong>Note:</strong> Lecture links are shared by respective faculty on WhatsApp groups 15 minutes before the session. Contact your class coordinator if you haven&apos;t received the link. Schedule may change — check weekly updates.
              </span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
