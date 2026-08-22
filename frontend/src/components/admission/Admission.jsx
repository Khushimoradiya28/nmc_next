"use client";

import React, { useState, useEffect } from 'react';
import styles from './Admission.module.css';

const coursesMeta = {
  bca: { fee: "₹15,000 / Sem", seats: "10 Seats Left", name: "B.C.A. (Computer Applications)" },
  bba: { fee: "₹8,000 / Sem", seats: "15 Seats Left", name: "B.B.A. (Business Administration)" },
  bcom: { fee: "Affordable Merit Subsidy", seats: "36 Seats Left", name: "B.Com (Commerce & Banking)" },
  ba: { fee: "Affordable Merit Subsidy", seats: "53 Seats Left", name: "B.A. (Bachelor of Arts)" },
  msw: { fee: "Affordable Merit Subsidy", seats: "6 Seats Left", name: "M.S.W. (Master of Social Work)" },
  fashion: { fee: "Exclusive Subsidy", seats: "11 Seats Left", name: "Fashion Designing Diploma (DFD)" }
};

export default function Admission() {
  const [selectedCourse, setSelectedCourse] = useState('bca');
  const [timeLeft, setTimeLeft] = useState({ days: 8, hours: 14, minutes: 35, seconds: 42 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={`${styles.admissionDynamicSection} section-padding`} id="admissions-dynamic">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionSubtitle}>Admissions 2026-27 • Real-Time Portal</div>
          <h2 className={styles.sectionTitle}>Admissions &amp; <span>Enrollment Hub</span></h2>
          <p className={styles.sectionDescription}>
            Real-time seat availability, transparent fee calculators, 100% Free Bus route allocation, and instant online merit registration.
          </p>
        </div>

        {/* Live Admission Status Banner */}
        <div className={styles.admLiveBanner}>
          <div className={styles.admLiveStatus}>
            <span className={styles.admPulseDot}></span>
            <div>
              <strong>Round 1 Merit Admissions Active</strong>
              <span>Affiliated with M.K. Bhavnagar University (MKBU)</span>
            </div>
          </div>

          <div className={styles.admCountdownWrap}>
            <span className={styles.admCountdownLabel}>Round 1 Closes In:</span>
            <div className={styles.admTimerBoxes}>
              <div className={styles.admTimerBox}>
                <span className={styles.atimerNum}>{String(timeLeft.days).padStart(2, '0')}</span>
                <span className={styles.atimerTxt}>Days</span>
              </div>
              <span className={styles.atimerColon}>:</span>
              <div className={styles.admTimerBox}>
                <span className={styles.atimerNum}>{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className={styles.atimerTxt}>Hours</span>
              </div>
              <span className={styles.atimerColon}>:</span>
              <div className={styles.admTimerBox}>
                <span className={styles.atimerNum}>{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className={styles.atimerTxt}>Mins</span>
              </div>
              <span className={styles.atimerColon}>:</span>
              <div className={styles.admTimerBox}>
                <span className={styles.atimerNum}>{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className={styles.atimerTxt}>Secs</span>
              </div>
            </div>
          </div>

          <div className={styles.admBannerPerk}>
            <span className={styles.admPerkIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="3" width="16" height="16" rx="2" ry="2"/>
                <path d="M4 11h16"/><path d="M9 19v3"/><path d="M15 19v3"/>
                <circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/>
              </svg>
            </span>
            <span>100% Free Bus Pick-Up On All 40+ Routes</span>
          </div>
        </div>

        {/* 2-Column Admissions Grid */}
        <div className={styles.admCoreGrid}>
          {/* Left Column: Seats Availability */}
          <div className={styles.admIntakeCard}>
            <div className={styles.admCardHeader}>
              <div className={`${styles.admCardIcon} ${styles.iconRuby}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <span className={styles.admBadge}>Live Capacity Radar</span>
                <h3 className={styles.admCardTitle}>Real-Time Seat Intake Availability</h3>
              </div>
            </div>

            <div className={styles.admSeatsList}>
              {/* BCA */}
              <div className={styles.admSeatItem}>
                <div className={styles.aseatTop}>
                  <div className={styles.aseatNameWrap}>
                    <strong className={styles.aseatName}>B.C.A. – Computer Applications</strong>
                    <span className={`${styles.aseatTag} ${styles.tagRuby}`}>Fast Filling</span>
                  </div>
                  <span className={styles.aseatCount}><strong>110</strong> / 120 Seats (92%)</span>
                </div>
                <div className={styles.aseatProgressTrack}>
                  <div className={`${styles.aseatProgressFill} ${styles.fillRuby}`} style={{ width: '92%' }}></div>
                </div>
                <div className={styles.aseatMeta}><span>10 Seats Remaining for Round 1</span><span>Fee: ₹15,000 / Sem</span></div>
              </div>

              {/* BBA */}
              <div className={styles.admSeatItem}>
                <div className={styles.aseatTop}>
                  <div className={styles.aseatNameWrap}>
                    <strong className={styles.aseatName}>B.B.A. – Business Administration</strong>
                    <span className={`${styles.aseatTag} ${styles.tagGold}`}>High Demand</span>
                  </div>
                  <span className={styles.aseatCount}><strong>105</strong> / 120 Seats (88%)</span>
                </div>
                <div className={styles.aseatProgressTrack}>
                  <div className={`${styles.aseatProgressFill} ${styles.fillGold}`} style={{ width: '88%' }}></div>
                </div>
                <div className={styles.aseatMeta}><span>15 Seats Remaining for Round 1</span><span>Fee: ₹8,000 / Sem</span></div>
              </div>

              {/* BCom */}
              <div className={styles.admSeatItem}>
                <div className={styles.aseatTop}>
                  <div className={styles.aseatNameWrap}>
                    <strong className={styles.aseatName}>B.Com – Accounting &amp; Banking</strong>
                    <span className={`${styles.aseatTag} ${styles.tagCrimson}`}>Merit Seats</span>
                  </div>
                  <span className={styles.aseatCount}><strong>204</strong> / 240 Seats (85%)</span>
                </div>
                <div className={styles.aseatProgressTrack}>
                  <div className={`${styles.aseatProgressFill} ${styles.fillCrimson}`} style={{ width: '85%' }}></div>
                </div>
                <div className={styles.aseatMeta}><span>36 Seats Remaining for Round 1</span><span>Affordable Merit Subsidies</span></div>
              </div>

              {/* BA & MSW */}
              <div className={styles.admSeatItem}>
                <div className={styles.aseatTop}>
                  <div className={styles.aseatNameWrap}>
                    <strong className={styles.aseatName}>B.A., M.S.W. &amp; Fashion Studio</strong>
                    <span className={`${styles.aseatTag} ${styles.tagAmber}`}>Seats Open</span>
                  </div>
                  <span className={styles.aseatCount}><strong>290</strong> / 360 Seats (81%)</span>
                </div>
                <div className={styles.aseatProgressTrack}>
                  <div className={`${styles.aseatProgressFill} ${styles.fillAmber}`} style={{ width: '81%' }}></div>
                </div>
                <div className={styles.aseatMeta}><span>70 Combined Seats Remaining</span><span>Scholarships Available</span></div>
              </div>
            </div>

            <div className={styles.admCapacitySummary}>
              <div className={styles.acapIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <div className={styles.acapText}>
                <strong>Institutional Capacity: 840 Seats • 709 Confirmed</strong>
                <span>84.4% Total Admission Quota Claimed across all faculties</span>
              </div>
            </div>
          </div>

          {/* Right Column: Estimator */}
          <div className={styles.admEstimatorCard}>
            <div className={styles.admCardHeader}>
              <div className={`${styles.admCardIcon} ${styles.iconGold}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <div>
                <span className={styles.admBadge}>Live Fee &amp; Benefits</span>
                <h3 className={styles.admCardTitle}>Dynamic Course &amp; Fee Estimator</h3>
              </div>
            </div>

            <div className={styles.admCalculatorBox}>
              <label className={styles.acalcLabel} htmlFor="admCourseSelect">Select Intended Academic Program:</label>
              <select 
                className={styles.acalcSelect} 
                id="admCourseSelect"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="bca">B.C.A. (Computer Applications) – ₹15,000/Sem</option>
                <option value="bba">B.B.A. (Business Administration) – ₹8,000/Sem</option>
                <option value="bcom">B.Com (Commerce &amp; Banking) – Merit Fees</option>
                <option value="ba">B.A. (Bachelor of Arts) – Merit Fees</option>
                <option value="msw">M.S.W. (Master of Social Work) – Merit Fees</option>
                <option value="fashion">Fashion Designing Diploma (DFD) – Subsidized</option>
              </select>

              {/* Dynamic Result Panel */}
              <div className={styles.acalcDynamicResult}>
                <div className={styles.acalcFeeRow}>
                  <div>
                    <span className={styles.acalcFeeSub}>Tuition Fee</span>
                    <div className={styles.acalcFeeVal}>{coursesMeta[selectedCourse].fee}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={styles.acalcFeeSub}>Available Seats</span>
                    <div className={styles.acalcSeatsVal}>{coursesMeta[selectedCourse].seats}</div>
                  </div>
                </div>

                <div className={styles.acalcPerksList}>
                  <div className={styles.aperkItem}>
                    <span className={styles.aperkCheck}>✔</span> 
                    <span><strong>100% Free Bus Service</strong> on 40+ routes (Zero Bus Fee)</span>
                  </div>
                  <div className={styles.aperkItem}>
                    <span className={styles.aperkCheck}>✔</span> 
                    <span><strong>Free Custom Designer Blazer</strong> gifted upon enrollment</span>
                  </div>
                  <div className={styles.aperkItem}>
                    <span className={styles.aperkCheck}>✔</span> 
                    <span><strong>Free Digital GCAS &amp; ABC (APAAR)</strong> registration support</span>
                  </div>
                  <div className={styles.aperkItem}>
                    <span className={styles.aperkCheck}>✔</span> 
                    <span><strong>Pre-Placement Career Grooming</strong> &amp; on-campus interviews</span>
                  </div>
                </div>
              </div>

              <div className={styles.acalcActionsGrid}>
                <a href="#contact" className={styles.btnAdmApply}>
                  <span>Start Online Admission</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </a>
                <a href="tel:+919426281144" className={styles.btnAdmCall}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <span>Helpline Desk</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Step Protocol */}
        <div className={styles.admStepsWrapper}>
          <div className={styles.admStepsHeader}>
            <span className={styles.astepsTag}>Fast-Track Process</span>
            <h3 className={styles.astepsTitle}>3-Step Direct Admission Protocol</h3>
          </div>

          <div className={styles.admStepsGrid}>
            <div className={styles.astepItem}>
              <div className={styles.astepNumBox}>01</div>
              <div className={styles.astepContent}>
                <h4>Online Registration &amp; GCAS Form</h4>
                <p>Submit basic academic details online or visit college helpline desk for instant form filling.</p>
              </div>
            </div>

            <div className={styles.astepItem}>
              <div className={styles.astepNumBox}>02</div>
              <div className={styles.astepContent}>
                <h4>Document Verification &amp; Merit Seat</h4>
                <p>Submit 10th/12th marksheets, caste/income certificates (if applicable) for immediate seat confirmation.</p>
              </div>
            </div>

            <div className={styles.astepItem}>
              <div className={styles.astepNumBox}>03</div>
              <div className={styles.astepContent}>
                <h4>Free Bus Pass &amp; Blazer Gift</h4>
                <p>Receive your personalized bus route identity pass and free designer blazer measurement voucher.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
