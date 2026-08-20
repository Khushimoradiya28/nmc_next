import Image from 'next/image';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import styles from './page.module.css';

export const metadata = {
  title: 'Happenings | Nandkunvarba Mahila College',
  description: 'Latest news, events, and happenings at Nandkunvarba Mahila College, Bhavnagar.',
};

export default function HappeningsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Standard Hero Banner */}
        <section className={styles.heroSection}>
          <div className={styles.heroBgImage}>
            <Image src="/assets/home/hero/2.jpg" alt="Happenings - NMC" width={1400} height={700} priority className={styles.heroBgImg} />
          </div>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitleStandard}><em>Happenings</em></h1>
          </div>
        </section>

        {/* News Section — Left scroll + Right sticky */}
        <section className={styles.newsSection} id="news">
          <div className={styles.container}>
            <div className={styles.newsLayout}>
              {/* Left: Scrollable news cards */}
              <div className={styles.newsLeft}>
                <h3 className={styles.newsLeftHeading}>Premium Content</h3>
                <div className={styles.newsCardList}>
                  <div className={styles.newsCard}>
                    <div className={styles.newsCardImg}>
                      <Image src="https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=400&q=80" alt="Youth Festival" width={400} height={300} />
                    </div>
                    <div>
                      <p className={styles.newsCardMeta}>Aug 12 • <span className={styles.newsCardMetaTag}>Sports</span></p>
                      <h4 className={styles.newsCardTitle}>NMC Students Win Zonal Youth Festival Championships</h4>
                      <p className={styles.newsCardDesc}>Students brought glory by winning multiple events at the Zonal Youth Festival organized by MKBU.</p>
                    </div>
                  </div>

                  <div className={styles.newsCard}>
                    <div className={styles.newsCardImg}>
                      <Image src="https://images.unsplash.com/photo-1707343848552-893e05dba6ac?w=400&q=80" alt="Conference" width={400} height={300} />
                    </div>
                    <div>
                      <p className={styles.newsCardMeta}>Jul 28 • <span className={styles.newsCardMetaTag}>Conference</span></p>
                      <h4 className={styles.newsCardTitle}>Research Cell Hosts National Commerce Conference</h4>
                      <p className={styles.newsCardDesc}>National-level conference on emerging trends in commerce and management studies.</p>
                    </div>
                  </div>

                  <div className={styles.newsCard}>
                    <div className={styles.newsCardImg}>
                      <Image src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80" alt="Workshop" width={400} height={300} />
                    </div>
                    <div>
                      <p className={styles.newsCardMeta}>Jun 22 • <span className={styles.newsCardMetaTag}>Workshop</span></p>
                      <h4 className={styles.newsCardTitle}>Ad-Mad Competition &amp; Digital Marketing Workshop</h4>
                      <p className={styles.newsCardDesc}>Shine Club (BBA) organized a creative Ad-Mad competition with industry expert as judge.</p>
                    </div>
                  </div>

                  <div className={styles.newsCard}>
                    <div className={styles.newsCardImg}>
                      <Image src="https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=400&q=80" alt="Research" width={400} height={300} />
                    </div>
                    <div>
                      <p className={styles.newsCardMeta}>Jun 10 • <span className={styles.newsCardMetaTag}>Research</span></p>
                      <h4 className={styles.newsCardTitle}>Faculty Paper Published in UGC-CARE Listed Journal</h4>
                      <p className={styles.newsCardDesc}>Research on vocational education and NEP 2020 by NMC faculty accepted in IJIRT journal.</p>
                    </div>
                  </div>

                  <div className={styles.newsCard}>
                    <div className={styles.newsCardImg}>
                      <Image src="https://images.unsplash.com/photo-1707343848552-893e05dba6ac?w=400&q=80" alt="Republic Day" width={400} height={300} />
                    </div>
                    <div>
                      <p className={styles.newsCardMeta}>Jan 26 • <span className={styles.newsCardMetaTag}>NCC</span></p>
                      <h4 className={styles.newsCardTitle}>Republic Day Celebration &amp; NCC Parade at Campus</h4>
                      <p className={styles.newsCardDesc}>NCC cadets led the parade followed by cultural programs and flag hoisting ceremony.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Sticky highlighted news */}
              <div className={styles.newsRight}>
                <h3 className={styles.newsRightHeading}>Highlighted News</h3>
                <div className={styles.highlightList}>
                  <div className={styles.highlightItem}>
                    <span className={styles.highlightNum}>1</span>
                    <div>
                      <p className={styles.highlightMeta}>Jul 15 • <span className={styles.highlightMetaTag}>Scholarship</span></p>
                      <h4 className={styles.highlightTitle}>Alumni Association Declares Scholarship Funds</h4>
                    </div>
                  </div>
                  <div className={styles.highlightItem}>
                    <span className={styles.highlightNum}>2</span>
                    <div>
                      <p className={styles.highlightMeta}>May 20 • <span className={styles.highlightMetaTag}>Lecture</span></p>
                      <h4 className={styles.highlightTitle}>Expert Session on National Income by Dr. Shah</h4>
                    </div>
                  </div>
                  <div className={styles.highlightItem}>
                    <span className={styles.highlightNum}>3</span>
                    <div>
                      <p className={styles.highlightMeta}>Apr 8 • <span className={styles.highlightMetaTag}>Seminar</span></p>
                      <h4 className={styles.highlightTitle}>Guest Lecture on Tax Planning &amp; Clubbing of Income</h4>
                    </div>
                  </div>
                  <div className={styles.highlightItem}>
                    <span className={styles.highlightNum}>4</span>
                    <div>
                      <p className={styles.highlightMeta}>Mar 15 • <span className={styles.highlightMetaTag}>MoU</span></p>
                      <h4 className={styles.highlightTitle}>Partnership with TCS for Placement Drives</h4>
                    </div>
                  </div>
                  <div className={styles.highlightItem}>
                    <span className={styles.highlightNum}>5</span>
                    <div>
                      <p className={styles.highlightMeta}>Feb 5 • <span className={styles.highlightMetaTag}>NSS</span></p>
                      <h4 className={styles.highlightTitle}>Blood Donation Camp &amp; Health Awareness Drive</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className={styles.eventsSection} id="events">
          <div className={styles.container}>
            <div className={styles.eventsHeader}>
              <div className={styles.eventsLabel}>
                <span className={styles.eventsLabelLine}></span>
                Upcoming &amp; Recent Events
              </div>
              <h2 className={styles.eventsTitle}>Campus <span>Events</span></h2>
            </div>

            <div className={styles.eventsGrid}>
              <div className={styles.eventCard}>
                <div className={styles.eventCardImg}>
                  <Image src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500&q=80" alt="Orientation Day" width={500} height={280} />
                </div>
                <div className={styles.eventCardBody}>
                  <p className={styles.eventCardDate}>Aug 20, 2026 • <span>Academic</span></p>
                  <h4 className={styles.eventCardTitle}>Orientation Day 2026 — Welcoming New Students</h4>
                  <p className={styles.eventCardDesc}>Welcoming newly admitted students to their academic tracks with campus tour and introduction sessions.</p>
                </div>
              </div>

              <div className={styles.eventCard}>
                <div className={styles.eventCardImg}>
                  <Image src="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&q=80" alt="Annual Sports Meet" width={500} height={280} />
                </div>
                <div className={styles.eventCardBody}>
                  <p className={styles.eventCardDate}>Dec 18, 2026 • <span>Sports</span></p>
                  <h4 className={styles.eventCardTitle}>Annual Sports Meet — Indoor &amp; Outdoor Championships</h4>
                  <p className={styles.eventCardDesc}>A week-long indoor and outdoor athletics championship event with inter-department competitions.</p>
                </div>
              </div>

              <div className={styles.eventCard}>
                <div className={styles.eventCardImg}>
                  <Image src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&q=80" alt="Women Empowerment Seminar" width={500} height={280} />
                </div>
                <div className={styles.eventCardBody}>
                  <p className={styles.eventCardDate}>Jan 12, 2027 • <span>Seminar</span></p>
                  <h4 className={styles.eventCardTitle}>National Seminar on Women Empowerment</h4>
                  <p className={styles.eventCardDesc}>Key lectures by academic researchers and prominent social leaders on women empowerment through education.</p>
                </div>
              </div>

              <div className={styles.eventCard}>
                <div className={styles.eventCardImg}>
                  <Image src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80" alt="Cultural Fest" width={500} height={280} />
                </div>
                <div className={styles.eventCardBody}>
                  <p className={styles.eventCardDate}>Feb 14, 2027 • <span>Cultural</span></p>
                  <h4 className={styles.eventCardTitle}>Annual Cultural Festival — Talent Showcase</h4>
                  <p className={styles.eventCardDesc}>Dance, drama, music, art exhibitions, and fashion show celebrating student creativity and diversity.</p>
                </div>
              </div>

              <div className={styles.eventCard}>
                <div className={styles.eventCardImg}>
                  <Image src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=500&q=80" alt="Placement Drive" width={500} height={280} />
                </div>
                <div className={styles.eventCardBody}>
                  <p className={styles.eventCardDate}>Mar 5, 2027 • <span>Placement</span></p>
                  <h4 className={styles.eventCardTitle}>Campus Placement Drive — TCS &amp; Partner Companies</h4>
                  <p className={styles.eventCardDesc}>On-campus recruitment drive with leading companies offering job opportunities to final year students.</p>
                </div>
              </div>

              <div className={styles.eventCard}>
                <div className={styles.eventCardImg}>
                  <Image src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=500&q=80" alt="NSS Camp" width={500} height={280} />
                </div>
                <div className={styles.eventCardBody}>
                  <p className={styles.eventCardDate}>Mar 20, 2027 • <span>NSS</span></p>
                  <h4 className={styles.eventCardTitle}>NSS 7-Day Special Camp — Rural Development</h4>
                  <p className={styles.eventCardDesc}>Community service camp in adopted village — health awareness, cleanliness drive, and tree plantation.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notice & Circular Section */}
        <section className={styles.noticeSection} id="notice-circular">
          <div className={styles.container}>
            <div className={styles.noticeHeader}>
              <div className={styles.noticeLabel}>
                <span className={styles.noticeLabelLine}></span>
                Official Notices
              </div>
              <h2 className={styles.noticeTitle}>Notice &amp; <span>Circular</span></h2>
            </div>

            <div className={styles.noticeList}>
              <div className={styles.noticeItem}>
                <span className={styles.noticeItemDate}>Aug 18, 2026</span>
                <div className={styles.noticeItemContent}>
                  <h4 className={styles.noticeItemTitle}>Circular 2026/04: Odd Semester Enrollment Verification Dates</h4>
                </div>
                <span className={styles.noticeItemTag}>Enrollment</span>
                <button className={styles.noticeItemBtn} aria-label="View Notice">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </button>
              </div>

              <div className={styles.noticeItem}>
                <span className={styles.noticeItemDate}>Aug 15, 2026</span>
                <div className={styles.noticeItemContent}>
                  <h4 className={styles.noticeItemTitle}>Anti-Ragging Squad Campus Monitoring Guidelines</h4>
                </div>
                <span className={styles.noticeItemTag}>Guidelines</span>
                <button className={styles.noticeItemBtn} aria-label="View Notice">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </button>
              </div>

              <div className={styles.noticeItem}>
                <span className={styles.noticeItemDate}>Aug 10, 2026</span>
                <div className={styles.noticeItemContent}>
                  <h4 className={styles.noticeItemTitle}>Syllabus Revision Updates for M.Com Sem-I &amp; II</h4>
                </div>
                <span className={styles.noticeItemTag}>Academic</span>
                <button className={styles.noticeItemBtn} aria-label="View Notice">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </button>
              </div>

              <div className={styles.noticeItem}>
                <span className={styles.noticeItemDate}>Jul 28, 2026</span>
                <div className={styles.noticeItemContent}>
                  <h4 className={styles.noticeItemTitle}>Scholarship Application Last Date Extended — Digital Gujarat</h4>
                </div>
                <span className={styles.noticeItemTag}>Scholarship</span>
                <button className={styles.noticeItemBtn} aria-label="View Notice">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </button>
              </div>

              <div className={styles.noticeItem}>
                <span className={styles.noticeItemDate}>Jul 20, 2026</span>
                <div className={styles.noticeItemContent}>
                  <h4 className={styles.noticeItemTitle}>Internal Exam Schedule — BCA, BBA, B.Com (July 2026)</h4>
                </div>
                <span className={styles.noticeItemTag}>Exam</span>
                <button className={styles.noticeItemBtn} aria-label="View Notice">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </button>
              </div>

              <div className={styles.noticeItem}>
                <span className={styles.noticeItemDate}>Jul 12, 2026</span>
                <div className={styles.noticeItemContent}>
                  <h4 className={styles.noticeItemTitle}>Fee Payment Deadline Notice for Even Semester Students</h4>
                </div>
                <span className={styles.noticeItemTag}>Fee</span>
                <button className={styles.noticeItemBtn} aria-label="View Notice">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* MoUs Section */}
        <section className={styles.mousSection} id="mous">
          <div className={styles.container}>
            <div className={styles.mousHeader}>
              <div className={styles.mousLabel}>
                <span className={styles.mousLabelLine}></span>
                Collaborations
              </div>
              <h2 className={styles.mousTitle}>Memorandum of <span>Understanding</span></h2>
              <p className={styles.mousDesc}>Partnering with leading organizations to provide internship pathways, vocational training, and research collaboration.</p>
            </div>

            <div className={styles.mousGrid}>
              <div className={styles.mouCard}>
                <div className={styles.mouCardIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                </div>
                <h4 className={styles.mouCardPartner}>Tata Consultancy Services (TCS)</h4>
                <p className={styles.mouCardArea}>Technical Training &amp; Campus Placement Drives for BCA and BBA students.</p>
              </div>

              <div className={styles.mouCard}>
                <div className={styles.mouCardIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </div>
                <h4 className={styles.mouCardPartner}>MKBU Commerce Research Cell</h4>
                <p className={styles.mouCardArea}>Joint Seminars, Academic Publications &amp; Faculty Research Collaboration.</p>
              </div>

              <div className={styles.mouCard}>
                <div className={styles.mouCardIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                </div>
                <h4 className={styles.mouCardPartner}>Regional Vocational Training Center</h4>
                <p className={styles.mouCardArea}>Apparel Designing, Craft Workshops &amp; Skill Development Programs.</p>
              </div>

              <div className={styles.mouCard}>
                <div className={styles.mouCardIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h4 className={styles.mouCardPartner}>Gujarat Entrepreneurship Council</h4>
                <p className={styles.mouCardArea}>Startup Mentoring, Business Plan Competitions &amp; Entrepreneurship Cell Support.</p>
              </div>

              <div className={styles.mouCard}>
                <div className={styles.mouCardIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                </div>
                <h4 className={styles.mouCardPartner}>National Digital Library (NDLI)</h4>
                <p className={styles.mouCardArea}>Digital Resource Access, E-Learning Integration &amp; Online Research Support.</p>
              </div>

              <div className={styles.mouCard}>
                <div className={styles.mouCardIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                </div>
                <h4 className={styles.mouCardPartner}>SWAYAM &amp; NPTEL</h4>
                <p className={styles.mouCardArea}>Online Course Credits, MOOC Integration &amp; Faculty Training Programs.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
