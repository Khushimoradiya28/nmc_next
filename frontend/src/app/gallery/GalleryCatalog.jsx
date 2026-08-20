"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './GalleryCatalog.module.css';

const galleryData = [
  {
    id: 1,
    type: "photo",
    category: "Campus",
    title: "Main Campus Infrastructure View",
    img: "/assets/shared/misc/1.jpg"
  },
  {
    id: 2,
    type: "video",
    category: "Videos",
    title: "Campus Infrastructure & Life Tour",
    img: "/assets/shared/misc/6.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Standard mock embed
  },
  {
    id: 3,
    type: "photo",
    category: "Labs/Studios",
    title: "High-Tech Computer Applications Lab",
    img: "/assets/home/misc/4.png"
  },
  {
    id: 4,
    type: "photo",
    category: "Labs/Studios",
    title: "Fashion Designing Studio & Lab",
    img: "/assets/shared/misc/3.jpg"
  },
  {
    id: 5,
    type: "photo",
    category: "Events",
    title: "Annual Day & Cultural Celebrations",
    img: "/assets/shared/misc/4.jpg"
  },
  {
    id: 6,
    type: "photo",
    category: "Campus",
    title: "Air Conditioned Executive Seminar Hall",
    img: "/assets/shared/misc/5.png"
  },
  {
    id: 7,
    type: "photo",
    category: "Events",
    title: "Empowerment Workshops & Seminars",
    img: "/assets/shared/misc/2.png"
  },
  {
    id: 8,
    type: "photo",
    category: "Events",
    title: "Graduation Convocation Ceremony",
    img: "/assets/shared/misc/12.jpg"
  }
];

export default function GalleryCatalog() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxItem, setLightboxItem] = useState(null);

  const filters = ['All', 'Campus', 'Labs/Studios', 'Events', 'Videos'];

  const filteredItems = activeFilter === 'All'
    ? galleryData
    : galleryData.filter(item => {
        if (activeFilter === 'Videos') return item.type === 'video';
        return item.category === activeFilter;
      });

  return (
    <>
      {/* 1. Hero banner */}
      <section className={styles.heroSection}>
        <div className={styles.heroBgImage}>
          <Image 
            src="/assets/shared/misc/4.jpg" 
            alt="Gallery Banner" 
            fill
            priority
            sizes="100vw"
            className={styles.heroBgImg}
          />
        </div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Media Gallery</h1>
          </div>
        </div>
      </section>

      {/* 2. Gallery Section */}
      <section className={styles.gallerySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>NMC Visuals</span>
            <h2 className={styles.sectionTitle}>Campus <span>Photo &amp; Video Gallery</span></h2>
            <p className={styles.sectionDescription}>
              Explore glimpses of our state-of-the-art campus, modern computer laboratories, active design studios, and vibrant student life events.
            </p>
          </div>

          {/* Filters Bar */}
          <div className={styles.filtersBar}>
            {filters.map((f) => (
              <button
                key={f}
                className={`${styles.filterBtn} ${activeFilter === f ? styles.filterActive : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className={styles.galleryGrid}>
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className={styles.galleryCard}
                onClick={() => setLightboxItem(item)}
              >
                <div className={styles.cardMedia}>
                  <Image 
                    src={item.img} 
                    alt={item.title}
                    width={400}
                    height={280}
                    className={styles.cardImg}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className={styles.cardOverlay}>
                    <div className={styles.actionBtn}>
                      {item.type === 'video' ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className={styles.tagBadge}>{item.category}</span>
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Lightbox Modal */}
      {lightboxItem && (
        <div className={styles.lightbox} onClick={() => setLightboxItem(null)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setLightboxItem(null)}>&times;</button>
            
            {lightboxItem.type === 'video' ? (
              <div className={styles.videoWrapper}>
                <iframe
                  src={lightboxItem.videoUrl}
                  title={lightboxItem.title}
                  allowFullScreen
                  className={styles.lightboxVideo}
                />
              </div>
            ) : (
              <div className={styles.imageWrapper}>
                <Image 
                  src={lightboxItem.img} 
                  alt={lightboxItem.title}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}
            
            <div className={styles.lightboxCaption}>
              <h4>{lightboxItem.title}</h4>
              <span>Category: {lightboxItem.category}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
