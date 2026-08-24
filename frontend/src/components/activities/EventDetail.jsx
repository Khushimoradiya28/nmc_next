"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './EventDetail.module.css';

export default function EventDetail({ event, parentPath = '/activities/by-club', parentName = 'Activities' }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!event) {
    return (
      <div className={styles.detailPageWrapper}>
        <div className={styles.container} style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#111' }}>Activity Not Found</h2>
          <p style={{ color: '#666', margin: '1rem 0 1.5rem 0' }}>The requested activity details are currently being updated.</p>
          <Link href={parentPath} className={styles.backBtn}>
            ← Back to {parentName}
          </Link>
        </div>
      </div>
    );
  }

  // Clean formatted date
  const formattedDate = event.date 
    ? new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  // Limit images to max 6 images for optimal presentation
  const rawImages = (event.gallery && event.gallery.length > 0) 
    ? event.gallery 
    : (event.thumbnail ? [event.thumbnail] : []);
  
  // Deduplicate and take max 6 images
  const images = [...new Set(rawImages)].slice(0, 6);
  const currentImg = images[activeImageIndex] || images[0] || '/assets/activities/club_activity.jpg';

  return (
    <div className={styles.detailPageWrapper}>
      <div className={styles.container}>

        {/* Top Back Navigation */}
        <div className={styles.topNavRibbon}>
          <Link href={parentPath} className={styles.backBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to {parentName}
          </Link>
        </div>

        {/* Main Card Container */}
        <div className={styles.mainCard}>
          
          {/* 1. Header with Category Badge & Photos Count */}
          <div className={styles.headerBlock}>
            <div className={styles.badgeRow}>
              <span className={styles.categoryBadge}>
                {event.clubName || (event.categoryId ? event.categoryId.replace(/-/g, ' ').toUpperCase() : 'NMC ACTIVITY')}
              </span>
            </div>

            {images.length > 1 && (
              <div className={styles.galleryCounterBadge}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span>{activeImageIndex + 1} of {images.length} Photos</span>
              </div>
            )}
          </div>

          {/* 2. Modern Interactive Stage Gallery */}
          {images.length > 0 && (
            <div className={styles.gallerySection}>
              <div className={styles.modernGalleryContainer}>
                
                {/* Main Large Stage Photo */}
                <div 
                  className={styles.mainViewport}
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <img
                    src={currentImg}
                    alt={`${event.title} - Main Photo`}
                    className={styles.mainStageImg}
                  />
                  <div className={styles.stageOverlay}>
                    <span className={styles.stageCaption}>{event.title}</span>
                    <span className={styles.expandBadge}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <polyline points="9 21 3 21 3 15"></polyline>
                        <line x1="21" y1="3" x2="14" y2="10"></line>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                      </svg>
                      Click to Expand
                    </span>
                  </div>
                </div>

                {/* Interactive Thumbnails Selector */}
                {images.length > 1 && (
                  <div className={styles.thumbnailsStrip}>
                    {images.map((imgSrc, idx) => (
                      <div
                        key={idx}
                        className={`${styles.thumbItem} ${activeImageIndex === idx ? styles.activeThumb : ''}`}
                        onClick={() => setActiveImageIndex(idx)}
                      >
                        <img
                          src={imgSrc}
                          alt={`Thumbnail ${idx + 1}`}
                          className={styles.thumbImg}
                        />
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          )}

          {/* 3. Bottom Two-Column Layout (Content Left, Info + Join Button Right) */}
          <div className={styles.bodyLayout}>
            
            {/* Left: Event Description Content */}
            <div className={styles.contentCol}>
              <h2 className={styles.sectionHeading}>About the Activity</h2>
              <div className={styles.bodyText}>
                {event.fullDescription ? (
                  event.fullDescription.split('\n\n').map((para, pIdx) => (
                    <p key={pIdx}>{para}</p>
                  ))
                ) : (
                  <p>{event.shortDescription || 'Event details and report will be updated soon.'}</p>
                )}
              </div>
            </div>

            {/* Right: Unified Single Minimal Card */}
            <aside className={styles.sidebarCol}>
              
              <div className={styles.infoCard}>
                <h3 className={styles.infoCardTitle}>Event Details</h3>
                
                <div className={styles.metaList}>
                  {formattedDate && (
                    <div className={styles.metaItem}>
                      <div className={styles.metaIconBox}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      <div>
                        <span className={styles.metaLabel}>Date</span>
                        <strong className={styles.metaValue}>{formattedDate}</strong>
                      </div>
                    </div>
                  )}

                  {event.time && (
                    <div className={styles.metaItem}>
                      <div className={styles.metaIconBox}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      </div>
                      <div>
                        <span className={styles.metaLabel}>Time</span>
                        <strong className={styles.metaValue}>{event.time}</strong>
                      </div>
                    </div>
                  )}

                  {event.location && (
                    <div className={styles.metaItem}>
                      <div className={styles.metaIconBox}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </div>
                      <div>
                        <span className={styles.metaLabel}>Venue</span>
                        <strong className={styles.metaValue}>{event.location}</strong>
                      </div>
                    </div>
                  )}

                  {event.speaker && (
                    <div className={styles.metaItem}>
                      <div className={styles.metaIconBox}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <div>
                        <span className={styles.metaLabel}>In-Charge / Faculty</span>
                        <strong className={styles.metaValue}>{event.speaker}</strong>
                      </div>
                    </div>
                  )}
                </div>

                {/* Minimal Integrated CTA Button */}
                <Link href="/student-corner/admission-form" className={styles.ctaBtn}>
                  Join Activity / Register
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>

              </div>

            </aside>

          </div>

        </div>

        {/* 4. Lightbox Modal Preview on Click */}
        {isLightboxOpen && (
          <div className={styles.lightboxModal} onClick={() => setIsLightboxOpen(false)}>
            <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.lightboxClose} onClick={() => setIsLightboxOpen(false)}>✕</button>
              <img src={currentImg} alt="Activity Preview" className={styles.lightboxImg} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
