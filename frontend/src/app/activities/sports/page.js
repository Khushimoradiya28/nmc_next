'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';

// Inline icon components (replacing @tabler/icons-react)
const IconChevronLeft = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="15 18 9 12 15 6" /></svg>
);
const IconChevronRight = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 18 15 12 9 6" /></svg>
);
const IconX = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);

// SVG Icons
const ChessIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a2 2 0 0 1 2 2v1H10V4a2 2 0 0 1 2-2Z" />
    <path d="M6 20h12" />
    <path d="M8 20V12h8v8" />
    <path d="M6 12a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2" />
    <path d="M9 10V6h6v4" />
  </svg>
);

const FootballIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m12 2-2 3.5 2 2.5h3L17 5Z" />
    <path d="M12 22v-4.5L10 15H8l-2 2.5" />
    <path d="m2 12 3.5 2 2.5-2V9L5 7Z" />
    <path d="m22 12-3.5-2-2.5 2v3l3 2.5" />
    <path d="M12 8.5 9 10v3l3 1.5 3-1.5v-3Z" />
  </svg>
);

const SwimmingIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 10a4 4 0 0 1 7-2.5h.1a4 4 0 0 1 5.8 0h.1a4 4 0 0 1 7 2.5" />
    <path d="M2 14a4 4 0 0 1 7-2.5h.1a4 4 0 0 1 5.8 0h.1a4 4 0 0 1 7 2.5" />
    <path d="M2 18a4 4 0 0 1 7-2.5h.1a4 4 0 0 1 5.8 0h.1a4 4 0 0 1 7 2.5" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
    <path d="M12 2a5 5 0 0 1 5 5v2H7V7a5 5 0 0 1 5-5z" />
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// Data structure representing extracted site details
const tournaments = [
  {
    title: 'Chess Tournament',
    organizer: 'Department of Physical Education of MK Bhav Uni in NMC',
    desc: 'Annual brain-battling chess meet organizing mental athletics with high cognitive precision.',
    icon: ChessIcon,
    accent: '#B00000',
    bg: '#FFF0F0',
    count: '8 gallery photos'
  },
  {
    title: 'Football Tournament',
    organizer: 'Department of Physical Education of MK Bhav Uni in NMC',
    desc: 'High-octane collegiate football face-offs promoting strategic gameplay, agility, and sportsmanship.',
    icon: FootballIcon,
    accent: '#F4B000',
    bg: '#FFFBEB',
    count: '9 gallery photos'
  },
  {
    title: 'Swimming Tournament',
    organizer: 'Department of Physical Education of MK Bhav Uni in NMC',
    desc: 'Competitive aquatic races fostering endurance, speed, and standard swimming strokes.',
    icon: SwimmingIcon,
    accent: '#0284c7',
    bg: '#f0f9ff',
    count: '5 gallery photos'
  }
];

const championships = [
  { title: 'Champion College Team', sport: 'Inter College YOGA', badge: 'University Champions' },
  { title: 'Champion Team', sport: 'Inter College Handball Competition', badge: 'University Champions' },
  { title: 'Champion Team', sport: 'Inter College Kabbadi Competition', badge: 'University Champions' },
  { title: 'Champion Team', sport: 'inter College VolleyBall Tournament', badge: 'University Champions' },
  { title: 'Champion Team in University', sport: 'Inter College KHO-KHO Competition', badge: 'University Champions' },
  { title: 'Champions Team', sport: 'Inter College Hockey Competition', badge: 'University Champions' },
  { title: 'University Champions team', sport: 'Inter College gymnastics', badge: 'University Champions' },
  { title: '1st & 2nd Rank in University', sport: 'Lawn Tennis and squash rackets', badge: 'Gold & Silver Medalists' },
  { title: '2nd Ranker in University', sport: 'Inter College Cross Country Competition', badge: 'Silver Medalist' },
  { title: 'University Runner-up Team', sport: 'Inter College badminton', badge: 'Runners Up' },
  { title: 'University Runners-Up Team', sport: 'Inter College Table Tennis', badge: 'Runners Up' }
];

const selections = [
  { sport: 'Kho-Kho', detail: 'Selected Students for Inter Uni Kho-Kho Competition' },
  { sport: 'Chess', detail: 'Selected student in Inter Uni. Chess Competition' },
  { sport: 'Swimming', detail: 'Selected Student in inter Uni. Swimming Competition' },
  { sport: 'Badminton', detail: 'Selected Student in Inter Uni. Badminton' },
  { sport: 'Rifle Shooting', detail: 'Selected Students in Inter Uni rifle shooting Competition' },
  { sport: 'Kabaddi', detail: 'Selected Students in Inter Uni. Kabaddi Competition' },
  { sport: 'Football', detail: 'Selected Students in Inter Uni. Football Competition' },
  { sport: 'Volleyball', detail: 'Selected Students in Inter Uni. VolleyBall Competition' },
  { sport: 'Yoga', detail: 'Selected Students in inter Uni. YOGA competition' },
  { sport: 'Lawn Tennis & Squash', detail: 'Selected Students in University for Inter uni. Lawn Tennis and squash rackets competition' },
  { sport: 'Handball', detail: 'Selected Students In Inter Uni. Handball Competition' }
];

const otherAchievements = [
  { title: 'Champion in 400m and 800m Race', level: 'Inter College Athletics', type: 'Track & Field' },
  { title: 'Champion In Karate Competition', level: 'State Level', type: 'Martial Arts' },
  { title: 'Champion Team', level: 'Inter College Volley Ball Competition', type: 'Team Event' },
  { title: 'Champion Team', level: 'Inter College Kho – Kho Competition', type: 'Team Event' },
  { title: 'Champion Team', level: 'Inter College Hockey Competition', type: 'Team Event' }
];

const galleryImages = [
  '/assets/sports_gallery/yoga.jpg',
  '/assets/sports_gallery/chess.jpg',
  '/assets/sports_gallery/run.jpg',
  '/assets/sports_gallery/swim.jpg',
  '/assets/sports_gallery/karate.jpg',
  '/assets/sports_gallery/badminton.jpg',
  '/assets/sports_gallery/yoga.jpg',
  '/assets/sports_gallery/run.jpg',
  '/assets/sports_gallery/swim.jpg'
];

const GALLERY_PER_PAGE = 9; // 3 rows × 3 columns

// Custom Mobile Slider Component for Loop Scroll with Manual Arrows
function MobileSlider({ championships, TrophyIcon, styles }) {
  const sliderRef = React.useRef(null);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let animationFrameId;
    const speed = 0.8; // pixels per frame

    const scroll = () => {
      if (!isPaused) {
        slider.scrollLeft += speed;
        // loop scroll logic: reset scrollLeft to 0 if it reaches half of scrollWidth
        if (slider.scrollLeft >= (slider.scrollWidth) / 2) {
          slider.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  const scrollManual = (direction) => {
    setIsPaused(true); // pause auto scroll on manual interaction
    const slider = sliderRef.current;
    if (!slider) return;
    const scrollAmount = slider.clientWidth; // scroll exactly 1 full card width
    slider.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
    // resume auto scroll after a brief delay
    setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  };

  const doubleChampionships = [...championships, ...championships];

  return (
    <div className={styles.mobileSliderContainer}>
      <div 
        className={styles.mobileSliderTrack}
        ref={sliderRef}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {doubleChampionships.map((ch, idx) => (
          <div key={`mob-${idx}`} className={styles.champMarqueeCard}>
            <div className={styles.champIconContainer}>
              <TrophyIcon />
            </div>
            <div className={styles.champInfo}>
              <span className={styles.champBadge}>{ch.badge}</span>
              <h3 className={styles.champTitle}>{ch.sport}</h3>
              <p className={styles.champDetail}>{ch.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Manual arrows below the card */}
      <div className={styles.sliderControls}>
        <button 
          className={styles.sliderArrowBtn} 
          onClick={() => scrollManual('left')}
          aria-label="Previous Slide"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button 
          className={styles.sliderArrowBtn} 
          onClick={() => scrollManual('right')}
          aria-label="Next Slide"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function SportsPage() {
  const [activeTab, setActiveTab] = useState('tournaments');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [galleryPage, setGalleryPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const itemsPerPage = isMobile ? 1 : GALLERY_PER_PAGE;
  const totalGalleryPages = Math.ceil(galleryImages.length / itemsPerPage);
  const paginatedImages = galleryImages.slice(
    (galleryPage - 1) * itemsPerPage,
    galleryPage * itemsPerPage
  );

  const filterSelections = selections.filter(sel => 
    sel.sport.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sel.detail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filterChamps = championships.filter(ch => 
    ch.sport.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ch.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className={styles.mainWrapper}>
        
        <ActivityHero 
          title="Sports Activities" 
          bgImage="/assets/banners/sports_banner.jpg"
          breadcrumbs={[
            { label: 'Activities' },
            { label: 'Sports' }
          ]}
        />

        {/* Tab Controls Navigation */}
        <section className={styles.tabNavbarSection}>
          <div className={styles.container}>
            <div className={styles.tabNavbar}>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'tournaments' ? styles.activeTabBtn : ''}`}
                onClick={() => { setActiveTab('tournaments'); setSearchQuery(''); }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
                Tournaments
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'championships' ? styles.activeTabBtn : ''}`}
                onClick={() => { setActiveTab('championships'); setSearchQuery(''); }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
                  <path d="M12 2a5 5 0 0 1 5 5v2H7V7a5 5 0 0 1 5-5z" />
                </svg>
                Championships
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'selections' ? styles.activeTabBtn : ''}`}
                onClick={() => { setActiveTab('selections'); setSearchQuery(''); }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                Uni Selections
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'state' ? styles.activeTabBtn : ''}`}
                onClick={() => { setActiveTab('state'); setSearchQuery(''); }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                State &amp; Other Events
              </button>
            </div>
          </div>
        </section>

        {/* Search Bar for Achievements & Selections */}
        {(activeTab === 'championships' || activeTab === 'selections') && (
          <section className={styles.searchSection}>
            <div className={styles.container}>
              <div className={styles.searchWrapper}>
                <span className={styles.searchIcon}><SearchIcon /></span>
                <input 
                  type="text" 
                  placeholder="Search achievements or sports (e.g. Yoga, Chess, Kabaddi)..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>
          </section>
        )}

        {/* Dynamic Content Section with AnimatePresence */}
        <section className={styles.contentSection}>
          <div className={styles.container}>
            <AnimatePresence mode="wait">
              
              {/* TOURNAMENTS TAB */}
              {activeTab === 'tournaments' && (
                <motion.div
                  key="tournaments"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>MKBU <span>University Tournaments</span></h2>
                    <p className={styles.sectionSubtitle}>Tournaments organized by the Department of Physical Education of MKBU in NMC Campus</p>
                  </div>
                  
                  <div className={styles.tournamentsGrid}>
                    {tournaments.map((t, idx) => {
                      const Icon = t.icon;
                      return (
                        <motion.div 
                          key={idx}
                          className={styles.tournamentCard}
                          whileHover={{ y: -8 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className={styles.tournamentHeader} style={{ backgroundColor: t.bg, color: t.accent }}>
                            <Icon />
                            <span className={styles.cardBadge}>{t.count}</span>
                          </div>
                          <div className={styles.tournamentBody}>
                            <h3 className={styles.cardTitle}>{t.title}</h3>
                            <span className={styles.organizerLabel}>Organized by</span>
                            <p className={styles.organizerText}>{t.organizer}</p>
                            <p className={styles.cardDesc}>{t.desc}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* CHAMPIONSHIPS TAB */}
              {activeTab === 'championships' && (
                <motion.div
                  key="championships"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>MKBU <span>Championship Achievements</span></h2>
                    <p className={styles.sectionSubtitle}>Outstanding champion college teams and individual top ranks in University sports competitions</p>
                  </div>

                  {!searchQuery ? (
                    <div className={styles.sliderWrapper}>
                      <div className={styles.desktopMarquee}>
                        <div className={styles.marqueeContainer}>
                          {/* Row 1: Left scrolling */}
                          <div className={`${styles.marqueeTrack} ${styles.marqueeTrackLeft}`}>
                            {[...championships.slice(0, 6), ...championships.slice(0, 6)].map((ch, idx) => (
                              <div key={`r1-${idx}`} className={styles.champMarqueeCard}>
                                <div className={styles.champIconContainer}>
                                  <TrophyIcon />
                                </div>
                                <div className={styles.champInfo}>
                                  <span className={styles.champBadge}>{ch.badge}</span>
                                  <h3 className={styles.champTitle}>{ch.sport}</h3>
                                  <p className={styles.champDetail}>{ch.title}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Row 2: Right scrolling */}
                          <div className={`${styles.marqueeTrack} ${styles.marqueeTrackRight}`}>
                            {[...championships.slice(6), ...championships.slice(6)].map((ch, idx) => (
                              <div key={`r2-${idx}`} className={styles.champMarqueeCard}>
                                <div className={styles.champIconContainer}>
                                  <TrophyIcon />
                                </div>
                                <div className={styles.champInfo}>
                                  <span className={styles.champBadge}>{ch.badge}</span>
                                  <h3 className={styles.champTitle}>{ch.sport}</h3>
                                  <p className={styles.champDetail}>{ch.title}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <MobileSlider championships={championships} TrophyIcon={TrophyIcon} styles={styles} />
                    </div>
                  ) : (
                    <div className={styles.champsGrid}>
                      {filterChamps.map((ch, idx) => (
                        <motion.div 
                          key={idx}
                          className={styles.champCard}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className={styles.champIconContainer}>
                            <TrophyIcon />
                          </div>
                          <div className={styles.champInfo}>
                            <span className={styles.champBadge}>{ch.badge}</span>
                            <h3 className={styles.champTitle}>{ch.sport}</h3>
                            <p className={styles.champDetail}>{ch.title} Achievement</p>
                          </div>
                        </motion.div>
                      ))}
                      {filterChamps.length === 0 && (
                        <div className={styles.noResults}>No achievements matching your search.</div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* SELECTIONS TAB */}
              {activeTab === 'selections' && (
                <motion.div
                  key="selections"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Inter-University <span>Student Selections</span></h2>
                    <p className={styles.sectionSubtitle}>NMC students selected to represent Maharaja Krishnakumarsinhji Bhavnagar University in National Meets</p>
                  </div>

                  <div className={styles.selectionsGrid}>
                    {filterSelections.map((sel, idx) => (
                      <motion.div 
                        key={idx} 
                        className={styles.selectionCard}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                      >
                        <div className={styles.selectionCardHeader}>
                          <span className={styles.selectionSportLabel}>{sel.sport}</span>
                          <span className={styles.selectionIcon}>🏅</span>
                        </div>
                        <p className={styles.selectionCardText}>{sel.detail}</p>
                        <div className={styles.selectionCardFooter}>
                          <span className={styles.verifiedBadge}><StarIcon /> Verified</span>
                        </div>
                      </motion.div>
                    ))}
                    {filterSelections.length === 0 && (
                      <div className={styles.noResults}>No selections matching your search.</div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STATE & OTHER EVENTS */}
              {activeTab === 'state' && (
                <motion.div
                  key="state"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>State &amp; <span>External Competitions</span></h2>
                    <p className={styles.sectionSubtitle}>Performances and championship wins in Athletics races, State Karate, and external open sports meets</p>
                  </div>

                  <div className={styles.otherGrid}>
                    {otherAchievements.map((o, idx) => (
                      <motion.div 
                        key={idx}
                        className={styles.otherCard}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className={styles.otherType}>{o.type}</span>
                        <h3 className={styles.otherTitle}>{o.title}</h3>
                        <p className={styles.otherLevel}>📍 {o.level}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </section>

        {/* Gallery Section */}
        <section className={styles.gallerySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 className={styles.sectionTitle}>Sports <span>Gallery</span></h2>
              <p className={styles.sectionSubtitle}>Visual highlights of athletic achievements, college meets, and tournament events</p>
            </div>
            
            <div className={styles.galleryGrid}>
              {paginatedImages.map((img, idx) => {
                const globalIdx = (galleryPage - 1) * GALLERY_PER_PAGE + idx;
                return (
                  <div 
                    key={globalIdx} 
                    className={styles.galleryItem}
                    onClick={() => setLightboxIndex(globalIdx)}
                  >
                    <img 
                      src={img} 
                      alt={`Sports Activity ${globalIdx + 1}`} 
                      className={styles.galleryImg} 
                    />
                    <div className={styles.galleryHoverOverlay}>
                      <span>View Image</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Gallery Pagination */}
            {totalGalleryPages > 1 && (
              <div className={styles.galleryPagination}>
                <button
                  className={`${styles.pageNavBtn} ${galleryPage === 1 ? styles.pageNavDisabled : ''}`}
                  onClick={() => { if (galleryPage > 1) setGalleryPage(p => p - 1); }}
                  disabled={galleryPage === 1}
                  aria-label="Previous page"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>

                {isMobile ? (
                  <span className={styles.mobilePageIndicator}>
                    Page {galleryPage} of {totalGalleryPages}
                  </span>
                ) : (
                  <div className={styles.pageNumbers}>
                    {Array.from({ length: totalGalleryPages }, (_, i) => i + 1).map(pg => (
                      <button
                        key={pg}
                        className={`${styles.pageNumBtn} ${pg === galleryPage ? styles.activePageBtn : ''}`}
                        onClick={() => setGalleryPage(pg)}
                        aria-label={`Page ${pg}`}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  className={`${styles.pageNavBtn} ${galleryPage === totalGalleryPages ? styles.pageNavDisabled : ''}`}
                  onClick={() => { if (galleryPage < totalGalleryPages) setGalleryPage(p => p + 1); }}
                  disabled={galleryPage === totalGalleryPages}
                  aria-label="Next page"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Lightbox / Fancy Box Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div 
              className={styles.lightboxOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxIndex(null)}
            >
              <div className={styles.lightboxWrapper} onClick={(e) => e.stopPropagation()}>
                <button 
                  className={styles.lightboxPrevBtn} 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length); 
                  }}
                  aria-label="Previous image"
                >
                  <IconChevronLeft size={22} strokeWidth={2.5} />
                </button>

                <motion.div 
                  className={styles.lightboxContent}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    className={styles.lightboxCloseBtn} 
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
                    aria-label="Close image popup"
                  >
                    <IconX size={15} strokeWidth={2.5} />
                  </button>
                  <div className={styles.lightboxImgWrapper}>
                    <img 
                      src={galleryImages[lightboxIndex]} 
                      alt={`Sports Activity Enlarged ${lightboxIndex + 1}`} 
                      className={styles.lightboxImg} 
                    />
                  </div>
                </motion.div>

                <button 
                  className={styles.lightboxNextBtn} 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setLightboxIndex((prev) => (prev + 1) % galleryImages.length); 
                  }}
                  aria-label="Next image"
                >
                  <IconChevronRight size={22} strokeWidth={2.5} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
      <Footer />
    </>
  );
}
