"use client";

import React from 'react';
import Image from 'next/image';
import styles from './Admission.module.css';

export default function Admission() {
  return (
    <section className={`${styles.sectionPadding} ${styles.admissionDynamicSection} section-padding admission-dynamic-section`} id="admissions-dynamic">
    <div className={`${styles.container} container`}>
      <div className={`${styles.sectionHeader} section-header`}>
        <div className={`${styles.sectionSubtitle} section-subtitle`}>Admissions 2026-27 &bull; Real-Time Portal</div>
        <h2 className={`${styles.sectionTitle} section-title`}>Admissions & <span>Enrollment Hub</span></h2>
        <p className={`${styles.sectionDescription} section-description`}>Real-time seat availability, transparent fee calculators, 100% Free Bus route allocation, and instant online merit registration.</p>
      </div>

      {/* Live Admission Pulse & Round Countdown Banner */}
      <div className={`${styles.admLiveBanner} adm-live-banner`}>
        <div className={`${styles.admLiveStatus} adm-live-status`}>
          <span className={`${styles.admPulseDot} adm-pulse-dot`}></span>
          <div>
            <strong>Round 1 Merit Admissions Active</strong>
            <span>Affiliated with M.K. Bhavnagar University (MKBU)</span>
          </div>
        </div>

        <div className={`${styles.admCountdownWrap} adm-countdown-wrap`}>
          <span className={`${styles.admCountdownLabel} adm-countdown-label`}>Round 1 Closes In:</span>
          <div className={`${styles.admTimerBoxes} adm-timer-boxes`}>
            <div className={`${styles.admTimerBox} adm-timer-box`}><span className={`${styles.atimerNum} atimer-num`} id="adm-days">08</span><span className={`${styles.atimerTxt} atimer-txt`}>Days</span></div>
            <span className={`${styles.atimerColon} atimer-colon`}>:</span>
            <div className={`${styles.admTimerBox} adm-timer-box`}><span className={`${styles.atimerNum} atimer-num`} id="adm-hours">14</span><span className={`${styles.atimerTxt} atimer-txt`}>Hours</span></div>
            <span className={`${styles.atimerColon} atimer-colon`}>:</span>
            <div className={`${styles.admTimerBox} adm-timer-box`}><span className={`${styles.atimerNum} atimer-num`} id="adm-mins">35</span><span className={`${styles.atimerTxt} atimer-txt`}>Mins</span></div>
            <span className={`${styles.atimerColon} atimer-colon`}>:</span>
            <div className={`${styles.admTimerBox} adm-timer-box`}><span className={`${styles.atimerNum} atimer-num`} id="adm-secs">42</span><span className={`${styles.atimerTxt} atimer-txt`}>Secs</span></div>
          </div>
        </div>

        <div className={`${styles.admBannerPerk} adm-banner-perk`}>
          <span className={`${styles.admPerkIcon} adm-perk-icon`} style={{display: 'flex', alignItems: 'center'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="16" rx="2" ry="2"/><path d="M4 11h16"/><path d="M9 19v3"/><path d="M15 19v3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg></span>
          <span>100% Free Bus Pick-Up On All 40+ Routes</span>
        </div>
      </div>

      {/* Core 2-Column Admission Hub Grid */}
      <div className={`${styles.admCoreGrid} adm-core-grid`}>

        {/* Left: Real-Time Stream Seat Availability Tracker */}
        <div className={`${styles.admIntakeCard} ${styles.spotlightActive} adm-intake-card spotlight-active`}>
          <div className={`${styles.admCardHeader} adm-card-header`}>
            <div className={`${styles.admCardIcon} ${styles.iconRuby} adm-card-icon icon-ruby`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <span className={`${styles.admBadge} adm-badge`}>Live Capacity Radar</span>
              <h3 className={`${styles.admCardTitle} adm-card-title`}>Real-Time Seat Intake Availability</h3>
            </div>
          </div>

          <div className={`${styles.admSeatsList} adm-seats-list`}>

            {/* Stream 1: BCA */}
            <div className={`${styles.admSeatItem} adm-seat-item`}>
              <div className={`${styles.aseatTop} aseat-top`}>
                <div className={`${styles.aseatNameWrap} aseat-name-wrap`}>
                  <strong className={`${styles.aseatName} aseat-name`}>B.C.A. – Computer Applications</strong>
                  <span className={`${styles.aseatTag} ${styles.tagRuby} aseat-tag tag-ruby`}>Fast Filling</span>
                </div>
                <span className={`${styles.aseatCount} aseat-count`}><strong>110</strong> / 120 Seats (<span className={`${styles.strengthCounter} strength-counter`} data-target="92">0</span>%)</span>
              </div>
              <div className={`${styles.aseatProgressTrack} aseat-progress-track`}>
                <div className={`${styles.aseatProgressFill} ${styles.fillRuby} aseat-progress-fill fill-ruby`} style={{width: '92%'}}></div>
              </div>
              <div className={`${styles.aseatMeta} aseat-meta`}><span>10 Seats Remaining for Round 1</span><span>Fee: &#8377;15,000 / Sem</span></div>
            </div>

            {/* Stream 2: BBA */}
            <div className={`${styles.admSeatItem} adm-seat-item`}>
              <div className={`${styles.aseatTop} aseat-top`}>
                <div className={`${styles.aseatNameWrap} aseat-name-wrap`}>
                  <strong className={`${styles.aseatName} aseat-name`}>B.B.A. – Business Administration</strong>
                  <span className={`${styles.aseatTag} ${styles.tagGold} aseat-tag tag-gold`}>High Demand</span>
                </div>
                <span className={`${styles.aseatCount} aseat-count`}><strong>105</strong> / 120 Seats (<span className={`${styles.strengthCounter} strength-counter`} data-target="88">0</span>%)</span>
              </div>
              <div className={`${styles.aseatProgressTrack} aseat-progress-track`}>
                <div className={`${styles.aseatProgressFill} ${styles.fillGold} aseat-progress-fill fill-gold`} style={{width: '88%'}}></div>
              </div>
              <div className={`${styles.aseatMeta} aseat-meta`}><span>15 Seats Remaining for Round 1</span><span>Fee: &#8377;8,000 / Sem</span></div>
            </div>

            {/* Stream 3: B.Com */}
            <div className={`${styles.admSeatItem} adm-seat-item`}>
              <div className={`${styles.aseatTop} aseat-top`}>
                <div className={`${styles.aseatNameWrap} aseat-name-wrap`}>
                  <strong className={`${styles.aseatName} aseat-name`}>B.Com – Accounting & Banking</strong>
                  <span className={`${styles.aseatTag} ${styles.tagCrimson} aseat-tag tag-crimson`}>Merit Seats</span>
                </div>
                <span className={`${styles.aseatCount} aseat-count`}><strong>204</strong> / 240 Seats (<span className={`${styles.strengthCounter} strength-counter`} data-target="85">0</span>%)</span>
              </div>
              <div className={`${styles.aseatProgressTrack} aseat-progress-track`}>
                <div className={`${styles.aseatProgressFill} ${styles.fillCrimson} aseat-progress-fill fill-crimson`} style={{width: '85%'}}></div>
              </div>
              <div className={`${styles.aseatMeta} aseat-meta`}><span>36 Seats Remaining for Round 1</span><span>Affordable Merit Subsidies</span></div>
            </div>

            {/* Stream 4: B.A. & M.S.W. & Diploma */}
            <div className={`${styles.admSeatItem} adm-seat-item`}>
              <div className={`${styles.aseatTop} aseat-top`}>
                <div className={`${styles.aseatNameWrap} aseat-name-wrap`}>
                  <strong className={`${styles.aseatName} aseat-name`}>B.A., M.S.W. & Fashion Studio</strong>
                  <span className={`${styles.aseatTag} ${styles.tagAmber} aseat-tag tag-amber`}>Seats Open</span>
                </div>
                <span className={`${styles.aseatCount} aseat-count`}><strong>290</strong> / 360 Seats (<span className={`${styles.strengthCounter} strength-counter`} data-target="81">0</span>%)</span>
              </div>
              <div className={`${styles.aseatProgressTrack} aseat-progress-track`}>
                <div className={`${styles.aseatProgressFill} ${styles.fillAmber} aseat-progress-fill fill-amber`} style={{width: '81%'}}></div>
              </div>
              <div className={`${styles.aseatMeta} aseat-meta`}><span>70 Combined Seats Remaining</span><span>Scholarships Available</span></div>
            </div>

          </div>

          {/* Overall Live Capacity Summary */}
          <div className={`${styles.admCapacitySummary} adm-capacity-summary`}>
            <div className={`${styles.acapIcon} acap-icon`}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>
            <div className={`${styles.acapText} acap-text`}>
              <strong>Institutional Capacity: 840 Seats &bull; 709 Confirmed</strong>
              <span>84.4% Total Admission Quota Claimed across all faculties</span>
            </div>
          </div>
        </div>

        {/* Right: Dynamic Interactive Fee & Calculator Box */}
        <div className={`${styles.admEstimatorCard} ${styles.spotlightActive} adm-estimator-card spotlight-active`}>
          <div className={`${styles.admCardHeader} adm-card-header`}>
            <div className={`${styles.admCardIcon} ${styles.iconGold} adm-card-icon icon-gold`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <div>
              <span className={`${styles.admBadge} adm-badge`}>Live Fee & Benefits</span>
              <h3 className={`${styles.admCardTitle} adm-card-title`}>Dynamic Course & Fee Estimator</h3>
            </div>
          </div>

          <div className={`${styles.admCalculatorBox} adm-calculator-box`}>
            <label className={`${styles.acalcLabel} acalc-label`} for="admCourseSelect">Select Intended Academic Program:</label>
            <select className={`${styles.acalcSelect} acalc-select`} id="admCourseSelect">
              <option value="bca" data-fee="&#8377;15,000 / Sem" data-duration="3 Years (6 Semesters)" data-seats="10 Left">B.C.A. (Computer Applications) – &#8377;15,000/Sem</option>
              <option value="bba" data-fee="&#8377;8,000 / Sem" data-duration="3 Years (6 Semesters)" data-seats="15 Left">B.B.A. (Business Administration) – &#8377;8,000/Sem</option>
              <option value="bcom" data-fee="Affordable Merit Subsidy" data-duration="3 Years (6 Semesters)" data-seats="36 Left">B.Com (Commerce & Banking) – Merit Fees</option>
              <option value="ba" data-fee="Affordable Merit Subsidy" data-duration="3 Years (6 Semesters)" data-seats="53 Left">B.A. (Bachelor of Arts) – Merit Fees</option>
              <option value="msw" data-fee="Affordable Merit Subsidy" data-duration="2 Years (4 Semesters)" data-seats="6 Left">M.S.W. (Master of Social Work) – Merit Fees</option>
              <option value="fashion" data-fee="Exclusive Subsidy" data-duration="1 to 2 Years Diploma" data-seats="11 Left">Fashion Designing Diploma (DFD) – Subsidized</option>
            </select>

            {/* Dynamic Result Card */}
            <div className={`${styles.acalcDynamicResult} acalc-dynamic-result`}>
              <div className={`${styles.acalcFeeRow} acalc-fee-row`}>
                <div>
                  <span className={`${styles.acalcFeeSub} acalc-fee-sub`}>Tuition Fee</span>
                  <div className={`${styles.acalcFeeVal} acalc-fee-val`} id="calcFeeVal">&#8377;15,000 / Sem</div>
                </div>
                <div className={`${styles.textRight} text-right`}>
                  <span className={`${styles.acalcFeeSub} acalc-fee-sub`}>Available Seats</span>
                  <div className={`${styles.acalcSeatsVal} acalc-seats-val`} id="calcSeatsVal">10 Seats Left</div>
                </div>
              </div>

              {/* Perks Checklist */}
              <div className={`${styles.acalcPerksList} acalc-perks-list`}>
                <div className={`${styles.aperkItem} aperk-item`}><span className={`${styles.aperkCheck} aperk-check`}>&#10004;</span> <span><strong>100% Free Bus Service</strong> on 40+ routes (Zero Bus Fee)</span></div>
                <div className={`${styles.aperkItem} aperk-item`}><span className={`${styles.aperkCheck} aperk-check`}>&#10004;</span> <span><strong>Free Custom Designer Blazer</strong> gifted upon enrollment</span></div>
                <div className={`${styles.aperkItem} aperk-item`}><span className={`${styles.aperkCheck} aperk-check`}>&#10004;</span> <span><strong>Free Digital GCAS & ABC (APAAR)</strong> registration support</span></div>
                <div className={`${styles.aperkItem} aperk-item`}><span className={`${styles.aperkCheck} aperk-check`}>&#10004;</span> <span><strong>Pre-Placement Career Grooming</strong> & on-campus interviews</span></div>
              </div>
            </div>

            {/* Instant Apply & Hotline Buttons */}
            <div className={`${styles.acalcActionsGrid} acalc-actions-grid`}>
              <button onclick="openModal()" className={`${styles.btnAdmApply} btn-adm-apply`}>
                <span>Start Online Admission</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <a href="tel:+919426281144" className={`${styles.btnAdmCall} btn-adm-call`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>Helpline Desk</span>
              </a>
            </div>

          </div>
        </div>

      </div>

      {/* 3-Step Streamlined Admission Protocol */}
      <div className={`${styles.admStepsWrapper} ${styles.spotlightActive} adm-steps-wrapper spotlight-active`}>
        <div className={`${styles.admStepsHeader} adm-steps-header`}>
          <span className={`${styles.astepsTag} asteps-tag`}>Fast-Track Process</span>
          <h3 className={`${styles.astepsTitle} asteps-title`}>3-Step Direct Admission Protocol</h3>
        </div>

        <div className={`${styles.admStepsGrid} adm-steps-grid`}>
          
          <div className={`${styles.astepItem} astep-item`}>
            <div className={`${styles.astepNumBox} astep-num-box`}>01</div>
            <div className={`${styles.astepContent} astep-content`}>
              <h4>Online Registration & GCAS Form</h4>
              <p>Submit basic academic details online or visit college helpline desk for instant form filling.</p>
            </div>
          </div>

          <div className={`${styles.astepItem} astep-item`}>
            <div className={`${styles.astepNumBox} astep-num-box`}>02</div>
            <div className={`${styles.astepContent} astep-content`}>
              <h4>Document Verification & Merit Seat</h4>
              <p>Submit 10th/12th marksheets, caste/income certificates (if applicable) for immediate seat confirmation.</p>
            </div>
          </div>

          <div className={`${styles.astepItem} astep-item`}>
            <div className={`${styles.astepNumBox} astep-num-box`}>03</div>
            <div className={`${styles.astepContent} astep-content`}>
              <h4>Free Bus Pass & Blazer Gift</h4>
              <p>Receive your personalized bus route identity pass and free designer blazer measurement voucher.</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
  );
}
