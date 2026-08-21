'use client';

import React from 'react';
import Image from 'next/image';
import styles from './DignitaryTestimonial.module.css';

export default function DignitaryTestimonial() {
  return (
    <section className={`${styles.sectionPadding} ${styles.digiTestiSection} section-padding digi-testi-section`} id="testimonials">
      <div className={`${styles.container} container`}>
        <div className={`${styles.sectionHeader} section-header`}>
          <div className={`${styles.sectionSubtitle} section-subtitle`}>Testimonials</div>
          <h2 className={`${styles.sectionTitle} section-title`}>What People <span>Say About Us</span></h2>
          <p className={`${styles.sectionDescription} section-description`}>Inspiring words from academic dignitaries, board members, and our empowered
            students.</p>
        </div>

        {/* Tab Buttons */}
        <div className={`${styles.digiTabBar} digi-tab-bar`}>
          <button className={`${styles.digiTab} digi-tab active`} data-panel="dignitaryPanel">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            Dignitary Testimonials
          </button>
          <button className={`${styles.digiTab} digi-tab`} data-panel="studentsPanel">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Student Testimonials
          </button>
        </div>

        {/* Panel 1: Dignitary Dark Cards */}
        <div className={`${styles.digiPanel} digi-panel active`} id="dignitaryPanel">
          <div className={`${styles.digiCardsRow} digi-cards-row`}>
            {/* Card 1 - Vice Chancellor */}
            <div className={`${styles.digiCard} digi-card`}>
              <div className={`${styles.digiCardInner} digi-card-inner`}>
                <div className={`${styles.digiQuoteIcon} digi-quote-icon`}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <h3 className={`${styles.digiCardTitle} digi-card-title`}>A BENCHMARK FOR WOMEN'S HIGHER EDUCATION.</h3>
                <p className={`${styles.digiCardText} digi-card-text`}>"Nandkunvarba Mahila College has set a benchmark for women's higher education in
                  Bhavnagar. Their commitment to free transportation, modern infrastructure, and high academic standard
                  makes them a model institution for women's empowerment."</p>
                <div className={`${styles.digiCardAuthor} digi-card-author`}>
                  <div className={`${styles.digiAuthorImg} digi-author-img`}>
                    <Image src="/assets/team/samkit.jpg" alt="Vice Chancellor" width={600} height={400} />
                  </div>
                  <div className={`${styles.digiAuthorInfo} digi-author-info`}>
                    <h4>Vice Chancellor</h4>
                    <span>M.K. Bhavnagar University</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - Dr. Rajesh Patel */}
            <div className={`${styles.digiCard} digi-card`}>
              <div className={`${styles.digiCardInner} digi-card-inner`}>
                <div className={`${styles.digiQuoteIcon} digi-quote-icon`}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <h3 className={`${styles.digiCardTitle} digi-card-title`}>INNOVATIVE PROGRAMS & ZERO-COST FACILITIES.</h3>
                <p className={`${styles.digiCardText} digi-card-text`}>"The college's dedication to women's education through innovative programs and
                  zero-cost facilities is truly commendable. An institution that truly lives by its mission of empowering
                  young women."</p>
                <div className={`${styles.digiCardAuthor} digi-card-author`}>
                  <div className={`${styles.digiAuthorImg} digi-author-img`}>
                    <Image src="/assets/team/mehul.jpg" alt="Dr. Rajesh Patel" width={600} height={400} />
                  </div>
                  <div className={`${styles.digiAuthorInfo} digi-author-info`}>
                    <h4>Dr. Rajesh Patel</h4>
                    <span>Education Board Member</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 - Shri Mehta */}
            <div className={`${styles.digiCard} digi-card`}>
              <div className={`${styles.digiCardInner} digi-card-inner`}>
                <div className={`${styles.digiQuoteIcon} digi-quote-icon`}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <h3 className={`${styles.digiCardTitle} digi-card-title`}>HOLISTIC EDUCATION & CAREER READINESS.</h3>
                <p className={`${styles.digiCardText} digi-card-text`}>"NMC's approach to holistic women's education — combining academics with personality development and career skills — creates well-rounded graduates ready for the modern workforce."</p>
                <div className={`${styles.digiCardAuthor} digi-card-author`}>
                  <div className={`${styles.digiAuthorImg} digi-author-img`}>
                    <Image src="/assets/team/ankita.jpg" alt="Shri Mehta" width={600} height={400} />
                  </div>
                  <div className={`${styles.digiAuthorInfo} digi-author-info`}>
                    <h4>Shri Mehta</h4>
                    <span>Trust Chairman</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Student Cards */}
        <div className={`${styles.digiPanel} digi-panel`} id="studentsPanel">
          <div className={`${styles.studTestiGrid} stud-testi-grid`}>
            <div className={`${styles.studTestiCard} stud-testi-card`}>
              <div className={`${styles.studTestiStars} stud-testi-stars`}>{"\u2605\u2605\u2605\u2605\u2605"}</div>
              <p className={`${styles.studTestiQuote} stud-testi-quote`}>"The free bus pick-up service gave my parents complete peace of mind, and the
                BCA faculty supported me to launch my IT software career."</p>
              <div className={`${styles.studTestiAuthor} stud-testi-author`}>
                <div className={`${styles.studAvatar} ${styles.studAvatarRed} stud-avatar stud-avatar-red`}>PG</div>
                <div>
                  <h4>Priyaba Gohil</h4>
                  <span>BCA Alumna (Batch 2024)</span>
                </div>
              </div>
            </div>

            <div className={`${styles.studTestiCard} stud-testi-card`}>
              <div className={`${styles.studTestiStars} stud-testi-stars`}>{"\u2605\u2605\u2605\u2605\u2605"}</div>
              <p className={`${styles.studTestiQuote} stud-testi-quote`}>"The free blazer gift made us feel like executive professionals right from day
                one! Proud to be an NMCian."</p>
              <div className={`${styles.studTestiAuthor} stud-testi-author`}>
                <div className={`${styles.studAvatar} ${styles.studAvatarGold} stud-avatar stud-avatar-gold`}>KR</div>
                <div>
                  <h4>Kavita Rathod</h4>
                  <span>BBA Student</span>
                </div>
              </div>
            </div>

            <div className={`${styles.studTestiCard} stud-testi-card`}>
              <div className={`${styles.studTestiStars} stud-testi-stars`}>{"\u2605\u2605\u2605\u2605\u2605"}</div>
              <p className={`${styles.studTestiQuote} stud-testi-quote`}>"MSW fieldwork training gave me real-world experience in community service. NMC
                shaped my career path completely."</p>
              <div className={`${styles.studTestiAuthor} stud-testi-author`}>
                <div className={`${styles.studAvatar} ${styles.studAvatarSky} stud-avatar stud-avatar-sky`}>NP</div>
                <div>
                  <h4>Neha Parmar</h4>
                  <span>MSW Graduate (2023)</span>
                </div>
              </div>
            </div>

            <div className={`${styles.studTestiCard} stud-testi-card`}>
              <div className={`${styles.studTestiStars} stud-testi-stars`}>{"\u2605\u2605\u2605\u2605\u2605"}</div>
              <p className={`${styles.studTestiQuote} stud-testi-quote`}>"Fashion Designing course at NMC was incredible — the studio, faculty, and practical exposure prepared me for the industry."</p>
              <div className={`${styles.studTestiAuthor} stud-testi-author`}>
                <div className={`${styles.studAvatar} ${styles.studAvatarRed} stud-avatar stud-avatar-red`}>RJ</div>
                <div>
                  <h4>Riya Joshi</h4>
                  <span>DFD Student</span>
                </div>
              </div>
            </div>

            <div className={`${styles.studTestiCard} stud-testi-card`}>
              <div className={`${styles.studTestiStars} stud-testi-stars`}>{"\u2605\u2605\u2605\u2605\u2605"}</div>
              <p className={`${styles.studTestiQuote} stud-testi-quote`}>"The computer lab facilities are excellent. I learned C++, Java, and Web
                Development with full practical exposure."</p>
              <div className={`${styles.studTestiAuthor} stud-testi-author`}>
                <div className={`${styles.studAvatar} ${styles.studAvatarSky} stud-avatar stud-avatar-sky`}>SP</div>
                <div>
                  <h4>Shreya Patel</h4>
                  <span>BCA Student (2025)</span>
                </div>
              </div>
            </div>

            <div className={`${styles.studTestiCard} stud-testi-card`}>
              <div className={`${styles.studTestiStars} stud-testi-stars`}>{"\u2605\u2605\u2605\u2605\u2605"}</div>
              <p className={`${styles.studTestiQuote} stud-testi-quote`}>"Commerce faculty here is amazing. Tally and GST certificate course gave me a
                huge advantage in placement interviews."</p>
              <div className={`${styles.studTestiAuthor} stud-testi-author`}>
                <div className={`${styles.studAvatar} ${styles.studAvatarGold} stud-avatar stud-avatar-gold`}>DV</div>
                <div>
                  <h4>Divya Vaghela</h4>
                  <span>B.Com Graduate (2024)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
