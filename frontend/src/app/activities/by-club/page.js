'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import ClubCard from '@/components/activities/ClubCard/ClubCard';
import ActivityCard from '@/components/activities/ActivityCard/ActivityCard';
import styles from './page.module.css';

// SVG Icons for the 9 clubs
const SparklesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  </svg>
);

const CodeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>
);

const TrendingUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);

const CompassIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
);

const AwardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7"/>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const BookOpenIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const clubs = [
  { name: 'Shine Club', dept: 'B.B.A.', link: '/activities/by-club/shine-club-bba', color: '#FFF0F0', icon: SparklesIcon, slug: 'shine-club' },
  { name: 'Focus Club', dept: 'B.C.A.', link: '/activities/by-club/focus-club-bca', color: '#F0F4FF', icon: CodeIcon, slug: 'focus-club' },
  { name: 'Expert Club', dept: 'B.Com', link: '/activities/by-club/expert-club-bcom', color: '#FFFBEB', icon: TrendingUpIcon, slug: 'expert-club' },
  { name: 'Creative Club', dept: 'M.Com', link: '/activities/by-club/creative-club-mcom', color: '#F0FFF4', icon: CompassIcon, slug: 'creative-club' },
  { name: 'Nirman Kendra', dept: 'M.S.W.', link: '/activities/by-club/nirman-kendra-msw', color: '#FFF0F8', icon: HeartIcon, slug: 'nirman-kendra' },
  { name: 'Nucleus Club', dept: 'B.A. English', link: '/activities/by-club/nucleus-club-ba-english', color: '#F5F0FF', icon: AwardIcon, slug: 'nucleus-club' },
  { name: 'Spandan Club', dept: 'B.A. Sociology', link: '/activities/by-club/spandan-club-ba-sociology', color: '#FFF8F0', icon: GlobeIcon, slug: 'spandan-club' },
  { name: 'Mind Club', dept: 'B.A. Psychology', link: '/activities/by-club/mind-club-ba-psychology', color: '#F0FFFF', icon: MindIconHelper, slug: 'mind-club' },
  { name: 'Anushilanvrut Club', dept: 'B.A. Gujarati', link: '/activities/by-club/anushilanvrut-club-ba-gujarati', color: '#FFF0F0', icon: BookOpenIcon, slug: 'anushilanvrut-club' }
];

function MindIconHelper() {
  return <EyeIcon />;
}

// 22 Real Scraped Events from: https://nandkunvarbamahilacollege.com/?events_group=by-club
const realEvents = [
  {
    id: "nucleus-club-shakespeare",
    clubSlug: "nucleus-club",
    clubName: "Nucleus Club [B.A. English]",
    title: "B. A. Nucleus Club activity",
    shortDescription: "Let’s Celebrate William Shakespeare (1564–1616), often called the Bard of Avon, is regarded as the greatest playwright in the English language.",
    date: "2025-08-10",
    thumbnail: "/assets/home/hero/1.png"
  },
  {
    id: "creative-club-ad-mcom",
    clubSlug: "creative-club",
    clubName: "Creative Club [M.Com]",
    title: "M.Com Department – Creative Club Activity",
    shortDescription: "Department: P. G. Center Of M.Com. Creative Club Session covering Advertisement / Logo creation / Product launch.",
    date: "2025-08-05",
    thumbnail: "/assets/home/hero/2.jpg"
  },
  {
    id: "expert-club-insurance-roleplay",
    clubSlug: "expert-club",
    clubName: "Expert Club [B.Com]",
    title: "B.Com Expert Club Roleplay",
    shortDescription: "Empowering Future Insurance Professionals! Organized a Role Play in General Insurance activity for banking students.",
    date: "2025-08-01",
    thumbnail: "/assets/home/hero/3.png"
  },
  {
    id: "expert-club-statement-analysis",
    clubSlug: "expert-club",
    clubName: "Expert Club [B.Com]",
    title: "B. Com Department Expert Club Activity",
    shortDescription: "Successfully organized a Financial Statement Analysis activity for the students of commerce department.",
    date: "2025-07-28",
    thumbnail: "/assets/home/hero/4.png"
  },
  {
    id: "focus-club-bubble-sorting",
    clubSlug: "focus-club",
    clubName: "Focus Club [B.C.A.]",
    title: "Bubble Theory sorting",
    shortDescription: "BCA department organized the “Bubble Theory” session under the Focus club for BCA Sem 2 students to demonstrate sorting methods.",
    date: "2025-01-24",
    thumbnail: "/assets/home/hero/5.png"
  },
  {
    id: "creative-club-online-startup",
    clubSlug: "creative-club",
    clubName: "Creative Club [M.Com]",
    title: "Club Activity-Online Business",
    shortDescription: "P.G. Department of Commerce organized a Club Activity for “How to do online business?” under the heading of ‘Creative Club’.",
    date: "2025-01-28",
    thumbnail: "/assets/home/hero/1.png"
  },
  {
    id: "focus-club-it-quiz-comp",
    clubSlug: "focus-club",
    clubName: "Focus Club [B.C.A.]",
    title: "IT Quiz",
    shortDescription: "BCA department organized the “IT Quiz” event under Focus club for BCA Sem 2, Sem 4, and Sem 6 students.",
    date: "2025-01-15",
    thumbnail: "/assets/home/hero/2.jpg"
  },
  {
    id: "spandan-club-childrens-home",
    clubSlug: "spandan-club",
    clubName: "Spandan Club [Sociology]",
    title: "Children’s Home Visitation",
    shortDescription: "The Department of Sociology under Spandan Club visited the regional Children's Home as part of community exposure classes.",
    date: "2024-09-30",
    thumbnail: "/assets/home/hero/3.png"
  },
  {
    id: "creative-club-exhibition-model",
    clubSlug: "creative-club",
    clubName: "Creative Club [M.Com]",
    title: "M.com Department – Club Activity",
    shortDescription: "The M.com Department of Nandkunvarba Mahila College organized a Club Activity for an Import Export Model Exhibition.",
    date: "2024-09-12",
    thumbnail: "/assets/home/hero/4.png"
  },
  {
    id: "expert-club-trade-export",
    clubSlug: "expert-club",
    clubName: "Expert Club [B.Com]",
    title: "B.Com. Expert Club Activity",
    shortDescription: "B.Com Department, under the Expert Club, organized an activity related with Import – Export Trade regulations.",
    date: "2024-09-04",
    thumbnail: "/assets/home/hero/5.png"
  },
  {
    id: "focus-club-poster-making",
    clubSlug: "focus-club",
    clubName: "Focus Club [B.C.A.]",
    title: "Poster & I-card making",
    shortDescription: "BCA department organized Event “Poster & I-card making” under Focus club for computer application streams.",
    date: "2024-08-03",
    thumbnail: "/assets/home/hero/1.png"
  },
  {
    id: "nucleus-club-gallery-walk",
    clubSlug: "nucleus-club",
    clubName: "Nucleus Club [B.A. English]",
    title: "Gen-Z Gallery Walk – (Nucleus Club)",
    shortDescription: "The Nucleus Club of English Department organized a ‘Gen-Z Gallery Walk’ to present classic poetry through visual cues.",
    date: "2024-08-16",
    thumbnail: "/assets/home/hero/2.jpg"
  },
  {
    id: "creative-club-accounting-tally",
    clubSlug: "creative-club",
    clubName: "Creative Club [M.Com]",
    title: "Club Activity (Accounting Software)",
    shortDescription: "Faculty led software session covering business ledgers, GST filings, and Tally transactions.",
    date: "2024-08-12",
    thumbnail: "/assets/home/hero/3.png"
  },
  {
    id: "focus-club-google-hub",
    clubSlug: "focus-club",
    clubName: "Focus Club [B.C.A.]",
    title: "Focus Club Activity(Google Hub)",
    shortDescription: "BCA department organized Event “Google Hub” under the Focus club for BCA first year students.",
    date: "2024-07-19",
    thumbnail: "/assets/home/hero/4.png"
  },
  {
    id: "mind-club-assessment",
    clubSlug: "mind-club",
    clubName: "Mind Club [B.A. Psychology]",
    title: "Psychological Assessment",
    shortDescription: "The Arts Department organized an activity titled “Psychological Assessment” under the Mind Club banner.",
    date: "2024-07-27",
    thumbnail: "/assets/home/hero/5.png"
  },
  {
    id: "spandan-club-sathdhanya",
    clubSlug: "spandan-club",
    clubName: "Spandan Club [Sociology]",
    title: "Sathdhanya",
    shortDescription: "The Department of Sociology, through Spandan Club, organized a traditional Sathdhanya community exhibition.",
    date: "2024-07-27",
    thumbnail: "/assets/home/hero/1.png"
  },
  {
    id: "expert-club-industrial-visit",
    clubSlug: "expert-club",
    clubName: "Expert Club [B.Com]",
    title: "Industrial Visit of Parle Company",
    shortDescription: "Industrial Visit of Parle Company (Tagdi-Bhavnagar) organized for First Year B.Com students by Expert Club.",
    date: "2024-07-10",
    thumbnail: "/assets/home/hero/2.jpg"
  },
  {
    id: "mind-club-roleplay-counseling",
    clubSlug: "mind-club",
    clubName: "Mind Club [B.A. Psychology]",
    title: "Mind Club Counseling Roleplay",
    shortDescription: "Psychology department students presented roleplays showcasing counselor behavior and mental health clinics.",
    date: "2024-03-15",
    thumbnail: "/assets/home/hero/3.png"
  },
  {
    id: "creative-club-brand-battle",
    clubSlug: "creative-club",
    clubName: "Creative Club [M.Com]",
    title: "Brand Battle",
    shortDescription: "M.COM department organized BRAND BATTLE-NEW INNOVATIVE PRODUCT MARKETING session for 30+ participants.",
    date: "2024-03-14",
    thumbnail: "/assets/home/hero/4.png"
  },
  {
    id: "expert-club-gst-seminar",
    clubSlug: "expert-club",
    clubName: "Expert Club [B.Com]",
    title: "Goods and Services Tax (GST)",
    shortDescription: "B.Com Department, through Expert Club, hosted a guest lecture featuring tax experts clarifying current GST practices.",
    date: "2024-03-21",
    thumbnail: "/assets/home/hero/5.png"
  },
  {
    id: "creative-club-multinational-research",
    clubSlug: "creative-club",
    clubName: "Creative Club [M.Com]",
    title: "Research Work on Multinational Company",
    shortDescription: "M.COM department under Creative Club completed a 2-day session focusing on international business frameworks.",
    date: "2023-08-22",
    thumbnail: "/assets/home/hero/1.png"
  },
  {
    id: "spandan-club-woman-power",
    clubSlug: "spandan-club",
    clubName: "Spandan Club [Sociology]",
    title: "Woman Power",
    shortDescription: "Nari Shakti Program organized at devrajnagar campus in affiliation with Maharaja Krishkumarsinhji Bhavnagar University.",
    date: "2023-08-12",
    thumbnail: "/assets/home/hero/2.jpg"
  }
];

export default function ByClubPage() {
  const [selectedClub, setSelectedClub] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Exactly 3 rows of 3 columns

  // Reset page whenever filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedClub]);

  const filteredEvents = selectedClub === 'all' 
    ? realEvents 
    : realEvents.filter(e => e.clubSlug === selectedClub);

  // Pagination indexing
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNo) => {
    if (pageNo >= 1 && pageNo <= totalPages) {
      setCurrentPage(pageNo);
      // Soft scroll to feed section
      const feedEl = document.getElementById('feed-section');
      if (feedEl) {
        feedEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <Header />
      <main>
        
        <ActivityHero 
          title="Activities by Club" 
          bgImage="/assets/banners/banner1.webp"
          breadcrumbs={[
            { label: 'Activities', link: '/activities' },
            { label: 'By Club' }
          ]}
        />


        {/* 2. Events Feed Section (Even - Warm Beige) */}
        <section className={styles.feedSection} id="feed-section">
          <div className={styles.container}>
            <span className={styles.preTitle}>Outreach Feed</span>
            <h2 className={styles.sectionTitle}>Club Sessions &amp; <span>Activities</span></h2>
            
            {/* Horizontal Filter Tabs with Framer Motion layoutId */}
            <div className={styles.filterTabs}>
              <button 
                onClick={() => setSelectedClub('all')}
                className={`${styles.tabBtn} ${selectedClub === 'all' ? styles.activeTab : ''}`}
                style={{ position: 'relative' }}
              >
                <span className={styles.tabText}>All Club Events</span>
                {selectedClub === 'all' && (
                  <motion.span 
                    layoutId="activeTabPill"
                    className={styles.activePill}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
              </button>
              {clubs.map((club, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedClub(club.slug)}
                  className={`${styles.tabBtn} ${selectedClub === club.slug ? styles.activeTab : ''}`}
                  style={{ position: 'relative' }}
                >
                  <span className={styles.tabText}>{club.name}</span>
                  {selectedClub === club.slug && (
                    <motion.span 
                      layoutId="activeTabPill"
                      className={styles.activePill}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Grid display of matching events */}
            <div className={styles.feedGrid}>
              <AnimatePresence mode="popLayout">
                {paginatedEvents.map((evt) => (
                  <motion.div
                    key={evt.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ActivityCard 
                      event={{
                        id: evt.id,
                        title: evt.title,
                        shortDescription: evt.shortDescription,
                        date: evt.date,
                        thumbnail: evt.thumbnail,
                        clubName: evt.clubName,
                        categoryId: "club",
                        subCategoryId: evt.clubSlug
                      }}
                      disableLink={true}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {filteredEvents.length === 0 && (
              <div className={styles.emptyState}>
                <span style={{ fontSize: '2.5rem' }}>📅</span>
                <h3>No sessions listed for this club</h3>
                <p>Check back later for newly scheduled student actions and workshops.</p>
              </div>
            )}

            {/* 3. Pagination Controls */}
            {totalPages > 1 && (
              <div className={styles.paginationContainer}>
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={styles.pageBtn}
                >
                  « Prev
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNo) => (
                  <button
                    key={pageNo}
                    onClick={() => handlePageChange(pageNo)}
                    className={`${styles.pageBtn} ${currentPage === pageNo ? styles.activePageBtn : ''}`}
                  >
                    {pageNo}
                  </button>
                ))}

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={styles.pageBtn}
                >
                  Next »
                </button>
              </div>
            )}

          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
