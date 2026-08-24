"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './GalleryCatalog.module.css';

// Inline Icon Components (matching sports page)
const IconChevronLeft = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconChevronRight = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconX = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const GALLERY_ITEMS = [
  {
    id: 1,
    category: 'campus',
    type: 'image',
    src: '/assets/home/hero/2.jpg',
    badge: 'Campus',
    title: 'Main Academic Campus'
  },
  {
    id: 2,
    category: 'videos',
    type: 'video',
    src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/assets/home/hero/1.png',
    badge: 'Video Tour',
    title: 'Campus Life & Facilities'
  },
  {
    id: 3,
    category: 'campus',
    type: 'image',
    src: '/assets/home/gallery/2.jpg',
    badge: 'IT Lab',
    title: 'High-Tech IT & BCA Lab'
  },
  {
    id: 4,
    category: 'campus',
    type: 'image',
    src: '/assets/home/gallery/3.jpg',
    badge: 'Studio',
    title: 'Fashion Designing Studio'
  },
  {
    id: 5,
    category: 'events',
    type: 'image',
    src: '/assets/home/hero/6.png',
    badge: 'Events',
    title: 'Annual Cultural Day'
  },
  {
    id: 6,
    category: 'campus',
    type: 'image',
    src: '/assets/home/gallery/1.jpg',
    badge: 'Auditorium',
    title: 'A/C Seminar Auditorium'
  },
  {
    id: 7,
    category: 'events',
    type: 'image',
    src: '/assets/home/overview/1.jpg',
    badge: 'Workshops',
    title: 'Interactive Workshops'
  },
  {
    id: 8,
    category: 'events',
    type: 'image',
    src: '/assets/home/hero/5.png',
    badge: 'Celebration',
    title: 'Graduation & Honors'
  },
  {
    id: 9,
    category: 'campus',
    type: 'image',
    src: '/assets/home/hero/2.jpg',
    badge: 'Library',
    title: 'Central Digital Library'
  },
  {
    id: 10,
    category: 'videos',
    type: 'video',
    src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/assets/home/hero/6.png',
    badge: 'Video Tour',
    title: 'Cultural Day Highlights'
  },
  {
    id: 11,
    category: 'campus',
    type: 'image',
    src: '/assets/home/gallery/2.jpg',
    badge: 'Science Lab',
    title: 'Biotech & Chemistry Lab'
  },
  {
    id: 12,
    category: 'events',
    type: 'image',
    src: '/assets/home/overview/1.jpg',
    badge: 'Sports Day',
    title: 'Annual Sports Day'
  },
  {
    id: 13,
    category: 'campus',
    type: 'image',
    src: '/assets/home/hero/2.jpg',
    badge: 'Cafeteria',
    title: 'Student Cafeteria Lounge'
  },
  {
    id: 14,
    category: 'videos',
    type: 'video',
    src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/assets/home/overview/1.jpg',
    badge: 'Video Tour',
    title: 'Annual Sports Highlights'
  },
  {
    id: 15,
    category: 'events',
    type: 'image',
    src: '/assets/home/hero/5.png',
    badge: 'Exhibition',
    title: 'Handicraft & Art Expo'
  },
  {
    id: 16,
    category: 'campus',
    type: 'image',
    src: '/assets/home/gallery/3.jpg',
    badge: 'Classrooms',
    title: 'Smart Tech Classrooms'
  }
];

const ITEMS_PER_PAGE = 9; // 3x3 layout

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter items based on active tab
  const filteredItems = activeTab === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeTab);

  // Pagination calculation
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
    setLightboxIndex(null);
  };

  const activeMediaItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div className={styles.mainWrapper}>
      <Header />
      <main>
        {/* ActivityHero Banner */}
        <ActivityHero 
          title="Photo & Video Gallery" 
          subtitle="A vibrant showcase of campus life, state-of-the-art labs, cultural festivals, and student activities."
          bgImage="/assets/home/hero/2.jpg"
          breadcrumbs={[{ label: 'Photo & Video Gallery' }]}
          decorative={true}
        />

        {/* Sticky Tab Controls */}
        <section className={styles.tabNavbarSection}>
          <div className={styles.container}>
            <div className={styles.tabNavbar}>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'all' ? styles.activeTabBtn : ''}`}
                onClick={() => handleTabChange('all')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
                All Media ({GALLERY_ITEMS.length})
              </button>

              <button 
                className={`${styles.tabBtn} ${activeTab === 'campus' ? styles.activeTabBtn : ''}`}
                onClick={() => handleTabChange('campus')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Campus &amp; Labs
              </button>

              <button 
                className={`${styles.tabBtn} ${activeTab === 'events' ? styles.activeTabBtn : ''}`}
                onClick={() => handleTabChange('events')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Events &amp; Culture
              </button>

              <button 
                className={`${styles.tabBtn} ${activeTab === 'videos' ? styles.activeTabBtn : ''}`}
                onClick={() => handleTabChange('videos')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                Video Highlights
              </button>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className={styles.gallerySection}>
          <div className={styles.container}>
            {/* Original Clean Section Header */}
            <div className={styles.sectionHeader}>
              <div className={styles.sectionSubtitle}>Visual Experience</div>
              <h2 className={styles.sectionTitle}>Photo &amp; <span>Video Gallery</span></h2>
              <p className={styles.sectionDescription}>
                A vibrant showcase of campus life, state-of-the-art labs, cultural festivals, and student activities.
              </p>
            </div>

            {/* Interactive Grid matching Sports Gallery */}
            <div className={styles.galleryGrid}>
              {paginatedItems.map((item, idx) => {
                const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + idx;
                return (
                  <div
                    key={item.id}
                    className={styles.galleryItem}
                    onClick={() => setLightboxIndex(globalIndex)}
                  >
                    <Image
                      src={item.type === 'video' ? item.thumbnail : item.src}
                      alt={item.title}
                      width={600}
                      height={400}
                      className={styles.galleryImg}
                    />

                    {/* Badge */}
                    <span className={`${styles.mediaBadge} ${item.type === 'video' ? styles.videoBadge : ''}`}>
                      {item.badge}
                    </span>

                    {/* Hover Overlay: Exact Sports Style with ONLY Center Button */}
                    <div className={styles.galleryHoverOverlay}>
                      <span>{item.type === 'video' ? 'Watch Video' : 'View Image'}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.galleryPagination}>
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

                {isMobile ? (
                  <span className={styles.mobilePageIndicator}>
                    Page {currentPage} of {totalPages}
                  </span>
                ) : (
                  <div className={styles.pageNumbers}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                      <button
                        key={pg}
                        className={`${styles.pageNumBtn} ${pg === currentPage ? styles.activePageBtn : ''}`}
                        onClick={() => setCurrentPage(pg)}
                        aria-label={`Page ${pg}`}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  className={`${styles.pageNavBtn} ${currentPage === totalPages ? styles.pageNavDisabled : ''}`}
                  onClick={() => { if (currentPage < totalPages) setCurrentPage(p => p + 1); }}
                  disabled={currentPage === totalPages}
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

        {/* Lightbox Modal (Exact Sports Gallery Style - Clean & No Extra Box) */}
        <AnimatePresence>
          {lightboxIndex !== null && activeMediaItem && (
            <motion.div
              className={styles.lightboxOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxIndex(null)}
            >
              <div className={styles.lightboxWrapper} onClick={(e) => e.stopPropagation()}>
                <button
                  className={styles.lightboxNavBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
                  }}
                  aria-label="Previous media"
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
                    aria-label="Close popup"
                  >
                    <IconX size={15} strokeWidth={2.5} />
                  </button>

                  <div className={styles.lightboxImgWrapper}>
                    {activeMediaItem.type === 'video' ? (
                      <iframe
                        src={activeMediaItem.src}
                        title={activeMediaItem.title}
                        className={styles.lightboxVideoFrame}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <img
                        src={activeMediaItem.src}
                        alt={activeMediaItem.title}
                        className={styles.lightboxImg}
                      />
                    )}
                  </div>
                </motion.div>

                <button
                  className={styles.lightboxNavBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
                  }}
                  aria-label="Next media"
                >
                  <IconChevronRight size={22} strokeWidth={2.5} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
