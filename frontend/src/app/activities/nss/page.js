'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import styles from './page.module.css';

// ── Data ──
const nssEvents = [
  {
    id: 'soft-skill-seminar-2025',
    title: 'Soft Skill Seminar',
    description: 'Organized by NSS Unit & M.Com Dept. Expert session on communication, leadership, and personality development.',
    organizers: 'NSS Unit & M.Com Dept',
    date: '2025-07-26',
    time: '09:00 AM – 12:00 PM',
    status: 'upcoming',
    category: 'seminar',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80'
  },
  {
    id: 'soft-skill-seminar-2024',
    title: 'Soft Skill Seminar',
    description: 'Guest: Shri D.M. Solanki, Regional Commissioner. Focused on life skills and career preparedness for students.',
    organizers: 'NSS Unit',
    date: '2024-07-31',
    time: '08:00 AM – 12:00 PM',
    status: 'past',
    category: 'seminar',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'
  },
  {
    id: 'soft-skill-seminar-2023',
    title: 'Soft Skill Seminar',
    description: 'Bhavnagar Municipal Commissioner Shri N.V. Upadhyay (IAS) shared insights on governance and public service.',
    organizers: 'NSS Unit',
    date: '2023-07-22',
    time: 'Full Day',
    status: 'past',
    category: 'seminar',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80'
  },
  {
    id: 'matruvandana-2022',
    title: 'Matruvandana Program',
    description: 'NSS Unit honored and expressed gratitude towards mothers on the occasion of Guru Purnima 2022.',
    organizers: 'NSS Unit',
    date: '2022-07-13',
    time: 'Full Day',
    status: 'past',
    category: 'cultural',
    image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&q=80'
  },
  {
    id: 'softskill-seminar-2022',
    title: 'Soft Skill Seminar',
    description: 'Full-day event at Yashwantray Auditorium with expert speakers and highly interactive student sessions.',
    organizers: 'NSS Unit',
    date: '2022-07-15',
    time: 'Full Day',
    status: 'past',
    category: 'seminar',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&q=80'
  },
  {
    id: 'matruvandana-2019',
    title: 'Matruvandana Program',
    description: 'Heartfelt celebration on Guru Purnima 2019 honoring motherhood and expressing collective gratitude.',
    organizers: 'NSS Unit',
    date: '2019-07-16',
    time: 'Full Day',
    status: 'past',
    category: 'cultural',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80'
  },
];

const nssInitiatives = [
  { title: 'Blood Donation Camp', desc: 'Annual drives with Bhavnagar Civil Hospital & Red Cross supporting community health.' },
  { title: 'Swachh Bharat Abhiyan', desc: 'Campus & village cleanliness campaigns under the national Swachh Bharat Mission.' },
  { title: 'Tree Plantation Drive', desc: 'Planting indigenous saplings to promote environmental awareness and sustainability.' },
  { title: '7-Day Residential Camp', desc: 'Immersive village camps on adult literacy, hygiene education, and welfare.' },
  { title: 'Soft Skill Development', desc: 'Seminars with government officials and industry experts on leadership and careers.' },
  { title: 'Matruvandana Program', desc: 'Annual Guru Purnima celebration honoring motherhood and fostering cultural values.' },
];

// NSS Stats — same structure as StatsSection
const nssStats = [
  {
    value: 15, suffix: '+', label: 'Years Active',
    chip: 'Est. 2009', theme: 'ruby',
    meter: 75,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
      </svg>
    )
  },
  {
    value: 100, suffix: '+', label: 'NSS Volunteers',
    chip: 'Active Members', theme: 'gold',
    meter: 80,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )
  },
  {
    value: 50, suffix: '+', label: 'Events Organized',
    chip: 'Community Programs', theme: 'crimson',
    meter: 65,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    )
  },
  {
    value: 5000, suffix: '+', label: 'Lives Impacted',
    chip: 'Community Reach', theme: 'amber',
    meter: 90,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
    )
  },
];

// ── Counter Animation Hook (same as StatsSection) ──
function useCounterAnimation(sectionRef) {
  useEffect(() => {
    let triggered = false;
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const run = () => {
      if (triggered || !sectionRef.current) return;
      triggered = true;
      const cards = sectionRef.current.querySelectorAll('.nss-stat-card');
      cards.forEach((card, idx) => {
        card.classList.add('revealed');
        const el = card.querySelector('.nss-stat-number');
        if (!el) return;
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2200;
        const startTime = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const val = Math.floor(easeOutExpo(progress) * target);
          el.innerHTML = `${val.toLocaleString()}<span>${suffix}</span>`;
          if (progress < 1) requestAnimationFrame(tick);
          else el.innerHTML = `${target.toLocaleString()}<span>${suffix}</span>`;
        };
        setTimeout(() => requestAnimationFrame(tick), idx * 100);
      });
    };

    const ref = sectionRef.current;
    if (!ref) return;
    const rect = ref.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) { setTimeout(run, 300); return; }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting && !triggered) { obs.unobserve(e.target); run(); } });
    }, { threshold: 0.2 });
    obs.observe(ref);
    return () => obs.unobserve(ref);
  }, [sectionRef]);
}

// ── Framer variants ──
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

// Custom Mobile Slider Component for NSS Initiatives (Smooth Auto Scroll with Manual Arrows)
function NssInitiativesSlider({ initiatives, styles }) {
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
        // loop scroll logic
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
    setIsPaused(true);
    const slider = sliderRef.current;
    if (!slider) return;
    const scrollAmount = slider.clientWidth; // scroll exactly 1 card width
    slider.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  };

  const doubleInitiatives = [...initiatives, ...initiatives];

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
        {doubleInitiatives.map((item, idx) => (
          <div key={`mob-init-${idx}`} className={styles.initiativeCard}>
            <div className={styles.initiativeBar} />
            <span className={styles.initiativeNum}>{String((idx % initiatives.length) + 1).padStart(2, '0')}</span>
            <h3 className={styles.initiativeName}>{item.title}</h3>
            <p className={styles.initiativeDesc}>{item.desc}</p>
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

export default function NssPage() {
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const statsRef = useRef(null);
  useCounterAnimation(statsRef);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // Mobile and tablet screens (under 1024px)
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset pagination page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const filteredEvents = filter === 'all' ? nssEvents : nssEvents.filter(e => e.category === filter);
  const eventsPerPage = isMobile ? 2 : filteredEvents.length; // Show 2 events on mobile/tablet, show all on desktop
  const totalEventPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const yr = (d) => new Date(d).getFullYear();

  return (
    <>
      <Header />
      <main>

        {/* ── Hero Banner ── */}
        <ActivityHero
          title="NSS — National Service Scheme"
          bgImage="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&q=90"
          height="50vh"
          decorative={true}
          breadcrumbs={[
            { label: 'Activities', link: '/activities' },
            { label: 'NSS' }
          ]}
        />

        {/* ── About Section ── */}
        <section className={styles.aboutSection}>
          <div className={styles.container}>
            <motion.div
              className={styles.aboutGrid}
              initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
            >
              <motion.div className={styles.aboutLeft} variants={fadeUp} transition={{ duration: 0.55 }}>
                <span className={styles.badge}>NSS Unit · Est. 2009</span>
                <h2 className={styles.sectionTitle}>
                  Shaping Responsible <span className={styles.highlight}>Citizens</span>
                </h2>
                <div className={styles.mottoTag}>❝ Not Me But You ❞</div>
                <p className={styles.aboutText}>
                  The NSS Unit at Nandkunvarba Mahila College channels youthful energy into structured
                  community development — healthcare, environment, literacy and skill-building.
                </p>
                <p className={styles.aboutText}>
                  Volunteers completing <strong>240 service hours</strong> receive University Certificates
                  recognizing their contribution to nation-building.
                </p>
                <div className={styles.metaRow}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Program Officer</span>
                    <span className={styles.metaValue}>Dr. Bhavesh Gohil</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Established</span>
                    <span className={styles.metaValue}>2009</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Affiliated</span>
                    <span className={styles.metaValue}>Gujarat University</span>
                  </div>
                </div>
              </motion.div>

              <motion.div className={styles.aboutRight} variants={fadeUp} transition={{ duration: 0.55, delay: 0.15 }}>
                <div className={styles.heroImageWrap}>
                  <Image
                    src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=85"
                    alt="NSS volunteers in community service"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={styles.heroImage}
                    priority
                  />
                  <div className={styles.heroImageOverlay} />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── Stats Section — theme box animation ── */}
        <section ref={statsRef} className={styles.statsSection}>
          <div className={styles.container}>
            <motion.div
              className={styles.statsGrid}
              initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
            >
              {nssStats.map((stat, i) => (
                <motion.div
                  key={i}
                  className={`${styles.statCard} ${styles[`statTheme_${stat.theme}`]} nss-stat-card`}
                  variants={fadeUp}
                  transition={{ duration: 0.45 }}
                >
                  {/* Top row: icon + chip */}
                  <div className={styles.statCardTop}>
                    <div className={`${styles.statIconWrap} ${styles[`statIcon_${stat.theme}`]}`}>
                      {stat.icon}
                    </div>
                    <span className={`${styles.statChip} ${styles[`chip_${stat.theme}`]}`}>
                      {stat.chip}
                    </span>
                  </div>
                  {/* Counter number */}
                  <div className={styles.statNumberWrap}>
                    <div
                      className={`${styles.statNumber} nss-stat-number`}
                      data-target={stat.value}
                      data-suffix={stat.suffix}
                    >
                      0<span>{stat.suffix}</span>
                    </div>
                  </div>
                  {/* Label */}
                  <div className={styles.statLabel}>{stat.label}</div>
                  {/* Progress meter */}
                  <div className={styles.statMeterTrack}>
                    <div
                      className={`${styles.statMeterFill} ${styles[`meterFill_${stat.theme}`]} nss-stat-card .revealed`}
                      style={{ '--meter-width': `${stat.meter}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Initiatives Section ── */}
        <section className={styles.initiativesSection}>
          <div className={styles.container}>
            <motion.div
              className={styles.sectionHeader}
              initial="hidden" whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp} transition={{ duration: 0.5 }}
            >
              <span className={styles.badge}>What We Do</span>
              <h2 className={styles.sectionTitle}>
                Core <span className={styles.highlightGold}>Initiatives</span>
              </h2>
            </motion.div>

            <div className={styles.desktopGrid}>
              <motion.div
                className={styles.initiativesGrid}
                initial="hidden" whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
              >
                {nssInitiatives.map((item, i) => (
                  <motion.div key={i} className={styles.initiativeCard} variants={fadeUp} transition={{ duration: 0.4 }}>
                    <div className={styles.initiativeBar} />
                    <span className={styles.initiativeNum}>{String(i + 1).padStart(2, '0')}</span>
                    <h3 className={styles.initiativeName}>{item.title}</h3>
                    <p className={styles.initiativeDesc}>{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <NssInitiativesSlider initiatives={nssInitiatives} styles={styles} />
          </div>
        </section>

        {/* ── Events Section ── */}
        <section className={styles.eventsSection}>
          <div className={styles.container}>
            <motion.div
              className={styles.sectionHeader}
              initial="hidden" whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp} transition={{ duration: 0.5 }}
            >
              <span className={styles.badge}>Events &amp; Programs</span>
              <h2 className={styles.sectionTitle}>
                NSS Event <span className={styles.highlight}>Chronicle</span>
              </h2>
            </motion.div>

            <div className={styles.filterBar}>
              {[{ key: 'all', label: 'All' }, { key: 'seminar', label: 'Seminars' }, { key: 'cultural', label: 'Cultural' }].map(f => (
                <button
                  key={f.key}
                  className={`${styles.filterBtn} ${filter === f.key ? styles.filterActive : ''}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>

             <motion.div className={styles.eventsGrid} layout>
               <AnimatePresence mode="popLayout">
                 {paginatedEvents.map((ev, i) => (
                   <motion.div
                     key={ev.id}
                     className={styles.eventCard}
                     layout
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     transition={{ duration: 0.3, delay: i * 0.04 }}
                   >
                     <div className={styles.eventImg}>
                       <Image src={ev.image} alt={ev.title} fill sizes="160px" className={styles.eventImage} />
                       <span className={styles.eventYearBadge}>{yr(ev.date)}</span>
                       <span className={`${styles.eventStatusBadge} ${ev.status === 'upcoming' ? styles.upcoming : styles.past}`}>
                         {ev.status === 'upcoming' ? 'Upcoming' : 'Done'}
                       </span>
                     </div>
                     <div className={styles.eventBody}>
                       <div className={styles.eventMeta}>
                         <span>📅 {fmt(ev.date)}</span>
                         <span>🕐 {ev.time}</span>
                       </div>
                       <h3 className={styles.eventTitle}>{ev.title}</h3>
                       <p className={styles.eventDesc}>{ev.description}</p>
                       <p className={styles.eventBy}><strong>By:</strong> {ev.organizers}</p>
                     </div>
                   </motion.div>
                 ))}
               </AnimatePresence>
             </motion.div>

             {/* Events Pagination (Mobile & Tablet only) */}
             {isMobile && totalEventPages > 1 && (
               <div className={styles.eventsPagination}>
                 <button
                   className={`${styles.pageNavBtn} ${currentPage === 1 ? styles.pageNavDisabled : ''}`}
                   onClick={() => { if (currentPage > 1) setCurrentPage(p => p - 1); }}
                   disabled={currentPage === 1}
                   aria-label="Previous page"
                 >
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                     <polyline points="15 18 9 12 15 6"></polyline>
                   </svg>
                 </button>

                 <span className={styles.mobilePageIndicator}>
                   Page {currentPage} of {totalEventPages}
                 </span>

                 <button
                   className={`${styles.pageNavBtn} ${currentPage === totalEventPages ? styles.pageNavDisabled : ''}`}
                   onClick={() => { if (currentPage < totalEventPages) setCurrentPage(p => p + 1); }}
                   disabled={currentPage === totalEventPages}
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

        {/* ── CTA ── */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <motion.div
              className={styles.ctaInner}
              initial="hidden" whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp} transition={{ duration: 0.55 }}
            >
              <div>
                <h2 className={styles.ctaTitle}>Become an NSS Volunteer</h2>
                <p className={styles.ctaSubtext}>
                  Open to all first &amp; second-year UG students. Complete 240 hours of service
                  and earn a University Certificate for your contribution.
                </p>
              </div>
              <div className={styles.ctaBtns}>
                <Link href="/contact" className={styles.btnWhite}>Register Interest</Link>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
