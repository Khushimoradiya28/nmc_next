"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './GalleryCatalog.module.css';
import GalleryServices from '@/services/GalleryServices';

// Inline Icon Components
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

const normalizeCategory = (cat, mediaType) => {
  if (mediaType === 'video' || cat === 'video_highlights') return 'videos';
  if (cat === 'campus_labs' || cat === 'campus') return 'campus';
  if (cat === 'events_culture' || cat === 'events') return 'events';
  return 'campus';
};

const ITEMS_PER_PAGE = 9; // 3x3 layout

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Fetch dynamic items strictly from Admin API
  useEffect(() => {
    let isMounted = true;

    const fetchGalleries = async () => {
      try {
        const res = await GalleryServices.getActiveGalleries();
        if (isMounted) {
          if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
            const formatted = res.data.map((item, idx) => {
              const catKey = normalizeCategory(item.category, item.media_type);
              const isVideo = item.media_type === 'video' || catKey === 'videos';
              const mediaSrc = item.media_url || item.media_file_webp_url || item.video_url || item.media_file || '';
              
              let badgeLabel = 'Campus';
              if (isVideo) badgeLabel = 'Video Tour';
              else if (catKey === 'events') badgeLabel = 'Events';
              else if (item.category === 'campus_labs') badgeLabel = 'Campus & Labs';

              return {
                id: item._id || idx,
                category: catKey,
                type: isVideo ? 'video' : 'image',
                src: mediaSrc,
                badge: badgeLabel,
                title: item.title || 'Campus Gallery',
              };
            });
            setGalleryItems(formatted);
          } else {
            setGalleryItems([]);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load gallery items:', err);
        if (isMounted) {
          setGalleryItems([]);
          setLoading(false);
        }
      }
    };

    fetchGalleries();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter items based on active tab
  const filteredItems = activeTab === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeTab);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
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
                All Media ({galleryItems.length})
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

            {/* Interactive Grid matching Exact Original CSS */}
            {filteredItems.length > 0 ? (
              <div className={styles.galleryGrid}>
                {paginatedItems.map((item, idx) => {
                  const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + idx;
                  const isVideo = item.type === 'video';

                  return (
                    <div
                      key={item.id}
                      className={styles.galleryItem}
                      onClick={() => setLightboxIndex(globalIndex)}
                    >
                      {/* Video vs Image Rendering */}
                      {isVideo ? (
                        <video
                          src={item.src}
                          className={styles.galleryImg}
                          muted
                          playsInline
                          preload="metadata"
                          onMouseOver={(e) => e.target.play().catch(() => {})}
                          onMouseOut={(e) => e.target.pause()}
                        />
                      ) : (
                        <img
                          src={item.src}
                          alt={item.title}
                          className={styles.galleryImg}
                          loading="lazy"
                        />
                      )}

                      {/* Badge */}
                      <span className={`${styles.mediaBadge} ${isVideo ? styles.videoBadge : ''}`}>
                        {item.badge}
                      </span>

                      {/* Video Center Play Indicator */}
                      {isVideo && (
                        <div className={styles.videoPlayBtn} aria-label="Play video">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="6 3 20 12 6 21 6 3" />
                          </svg>
                        </div>
                      )}

                      {/* Hover Overlay: Exact Original CSS Classes */}
                      <div className={styles.galleryHoverOverlay}>
                        <span>{isVideo ? 'Watch Video' : 'View Image'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center text-gray-500">
                <p className="text-lg font-medium">No media found in this category.</p>
              </div>
            )}

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

        {/* Lightbox Modal (Exact Original Style) */}
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
                <motion.div
                  className={styles.lightboxContent}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Left Arrow Button */}
                  <button
                    className={`${styles.lightboxNavBtn} ${styles.lightboxNavPrev}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
                    }}
                    aria-label="Previous media"
                  >
                    <IconChevronLeft size={20} strokeWidth={2.5} />
                  </button>

                  {/* Close Button */}
                  <button
                    className={styles.lightboxCloseBtn}
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
                    aria-label="Close popup"
                  >
                    <IconX size={15} strokeWidth={2.5} />
                  </button>

                  <div className={styles.lightboxImgWrapper}>
                    {activeMediaItem.type === 'video' ? (
                      activeMediaItem.src.includes('embed') || activeMediaItem.src.includes('youtube') ? (
                        <iframe
                          src={activeMediaItem.src}
                          title={activeMediaItem.title}
                          className={styles.lightboxVideoFrame}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <video
                          src={activeMediaItem.src}
                          controls
                          autoPlay
                          className={styles.lightboxImg}
                          style={{ maxHeight: '80vh', maxWidth: '100%', objectFit: 'contain' }}
                        />
                      )
                    ) : (
                      <img
                        src={activeMediaItem.src}
                        alt={activeMediaItem.title}
                        className={styles.lightboxImg}
                      />
                    )}
                  </div>

                  {/* Right Arrow Button */}
                  <button
                    className={`${styles.lightboxNavBtn} ${styles.lightboxNavNext}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
                    }}
                    aria-label="Next media"
                  >
                    <IconChevronRight size={20} strokeWidth={2.5} />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
