import Image from 'next/image';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import AdmissionForm from './AdmissionForm';
import styles from './page.module.css';

export const metadata = {
  title: 'Admission Form | Student Corner | Nandkunvarba Mahila College',
  description: 'Apply for admission to Nandkunvarba Mahila College, Bhavnagar. Online admission form for BBA, BCA, BA, BCom, MA, MCom, MSW, and diploma courses.',
};

export default function AdmissionFormPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className={styles.heroSection}>
          <div className={styles.heroBgImage}>
            <Image src="/assets/home/hero/2.jpg" alt="Admission Form" width={1400} height={700} priority className={styles.heroBgImg} />
          </div>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}><em>Admission Form</em></h1>
          </div>
        </section>

        {/* Admission Section */}
        <section className={styles.admissionSection}>
          <div className={styles.container}>
            <div className={styles.admissionLayout}>
              {/* Left: Info + Steps */}
              <div className={styles.admissionInfo}>
                <div className={styles.admissionLabel}>
                  <span className={styles.admissionLabelLine}></span>
                  Enrolment 2026-27
                </div>
                <h2 className={styles.admissionTitle}>Admission <span>Process</span></h2>
                <p className={styles.admissionDesc}>
                  Simple and transparent admission process. Evaluating each applicant considering personal background, qualities &amp; opportunities available. Admissions open Monday to Saturday, 9 AM to 1:30 PM.
                </p>

                {/* Steps */}
                <div className={styles.admissionSteps}>
                  <div className={styles.admissionStep}>
                    <span className={styles.stepNum}>1</span>
                    <div className={styles.stepContent}>
                      <h4 className={styles.stepTitle}>Register on GCAS Portal</h4>
                      <p className={styles.stepDesc}>Complete online registration at gcas.gujarat.gov.in with required documents.</p>
                    </div>
                  </div>
                  <div className={styles.admissionStep}>
                    <span className={styles.stepNum}>2</span>
                    <div className={styles.stepContent}>
                      <h4 className={styles.stepTitle}>Fill Application Form</h4>
                      <p className={styles.stepDesc}>Submit the admission inquiry form below or visit campus with original documents.</p>
                    </div>
                  </div>
                  <div className={styles.admissionStep}>
                    <span className={styles.stepNum}>3</span>
                    <div className={styles.stepContent}>
                      <h4 className={styles.stepTitle}>Document Verification</h4>
                      <p className={styles.stepDesc}>Bring marksheets, LC, Aadhar, photos for verification at the admission counter.</p>
                    </div>
                  </div>
                  <div className={styles.admissionStep}>
                    <span className={styles.stepNum}>4</span>
                    <div className={styles.stepContent}>
                      <h4 className={styles.stepTitle}>Fee Payment &amp; Confirmation</h4>
                      <p className={styles.stepDesc}>Pay semester fee and collect admission confirmation letter with bus pass.</p>
                    </div>
                  </div>
                </div>

                {/* Important Dates */}
                <div className={styles.datesBox}>
                  <h4 className={styles.datesBoxTitle}>Important Dates</h4>
                  <div className={styles.dateRow}>
                    <span className={styles.dateRowLabel}>Application Start</span>
                    <span className={styles.dateRowValue}>June 15, 2026</span>
                  </div>
                  <div className={styles.dateRow}>
                    <span className={styles.dateRowLabel}>First Merit List</span>
                    <span className={styles.dateRowValue}>July 10, 2026</span>
                  </div>
                  <div className={styles.dateRow}>
                    <span className={styles.dateRowLabel}>Document Verification</span>
                    <span className={styles.dateRowValue}>July 15-20, 2026</span>
                  </div>
                  <div className={styles.dateRow}>
                    <span className={styles.dateRowLabel}>Classes Begin</span>
                    <span className={styles.dateRowValue}>August 1, 2026</span>
                  </div>
                </div>
              </div>

              {/* Right: Form */}
              <AdmissionForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
