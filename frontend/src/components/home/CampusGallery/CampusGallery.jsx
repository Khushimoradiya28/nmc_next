"use client";

import React, { useState, useEffect, useCallback } from 'react';
import styles from './CampusGallery.module.css';

const galleryImages = [
  { id: 1, img: '/assets/gellery/1.jpg', title: 'Campus Activity', category: 'Campus Life' },
  { id: 2, img: '/assets/gellery/2.jpg', title: 'Students Group', category: 'Campus Life' },
  { id: 3, img: '/assets/gellery/3.jpg', title: 'College Event', category: 'Events' },
  { id: 4, img: '/assets/gellery/4.jpg', title: 'Library Resources', category: 'Academics' },
  { id: 5, img: '/assets/gellery/5.jpg', title: 'Auditorium Seminars', category: 'Events' },
  { id: 6, img: '/assets/gellery/6.jpg', title: 'Classroom Session', category: 'Academics' },
  { id: 7, img: '/assets/gellery/7.jpg', title: 'Fashion Designing Lab', category: 'Labs' },
  { id: 8, img: '/assets/gellery/8.jpg', title: 'Science Laboratory', category: 'Labs' },
  { id: 9, img: '/assets/gellery/9.jpg', title: 'Sports Tournament', category: 'Sports' },
  { id: 10, img: '/assets/gellery/10.jpg', title: 'Green Campus', category: 'Campus Life' },
  { id: 11, img: '/assets/gellery/11.jpg', title: 'Student Achievements', category: 'Academic Excellence' },
  { id: 12, img: '/assets/gellery/12.jpg', title: 'Cultural Day Celebrations', category: 'Events' }
];

export default function CampusGallery() {
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Row 1 aur Row 2 ke liye images split karna
  const half = Math.ceil(galleryImages.length / 2);
  const row1Images = galleryImages.slice(0, half);
  const row2Images = galleryImages.slice(half);

  // Popup Navigation Functions
  const handlePrev = useCallback(() => {
    setSelectedIndex((prevIndex) => 
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  }, []);

  const handleNext = useCallback(() => {
    setSelectedIndex((prevIndex) => 
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  // Keyboard Arrow Keys support for Popup Slider
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setSelectedIndex(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev]);

  return (
    <section className={styles.gallerySection}>
      {/* HEADER */}
      <div className={styles.headerArea}>
        <span className={styles.subTag}>AMAZING CAMPUS LIFE</span>
        <h2 className={styles.mainTitle}>Campus highlights gallery</h2>
        <p className={styles.subTitle}>Some Amazing Stuff From Our Campus</p>
      </div>

      {/* MARQUEE CONTAINER */}
      <div className={styles.marqueeWrapper}>
        {/* ROW 1: RIGHT TO LEFT */}
        <div className={styles.marqueeRow}>
          <div className={styles.trackLeft}>
            {[...row1Images, ...row1Images, ...row1Images].map((item, idx) => {
              const originalIndex = galleryImages.findIndex((g) => g.id === item.id);
              return (
                <div 
                  key={`r1-${item.id}-${idx}`} 
                  className={styles.imageCard}
                  onClick={() => setSelectedIndex(originalIndex)}
                >
                  <img src={item.img} alt={item.title} className={styles.cardImg} />
                  <div className={styles.overlay}>
                    <span className={styles.categoryBadge}>{item.category}</span>
                    <h4 className={styles.imageTitle}>{item.title}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROW 2: LEFT TO RIGHT */}
        <div className={styles.marqueeRow}>
          <div className={styles.trackRight}>
            {[...row2Images, ...row2Images, ...row2Images].map((item, idx) => {
              const originalIndex = galleryImages.findIndex((g) => g.id === item.id);
              return (
                <div 
                  key={`r2-${item.id}-${idx}`} 
                  className={styles.imageCard}
                  onClick={() => setSelectedIndex(originalIndex)}
                >
                  <img src={item.img} alt={item.title} className={styles.cardImg} />
                  <div className={styles.overlay}>
                    <span className={styles.categoryBadge}>{item.category}</span>
                    <h4 className={styles.imageTitle}>{item.title}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* LIGHTBOX POPUP MODAL WITH IMAGE SCROLL SLIDER */}
      {selectedIndex !== null && (
        <div className={styles.lightboxOverlay} onClick={() => setSelectedIndex(null)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            
            {/* Close Button */}
            <button className={styles.closeBtn} onClick={() => setSelectedIndex(null)}>
              &times;
            </button>

            {/* Left Scroll Arrow */}
            <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={handlePrev}>
              &#10094;
            </button>

            {/* Main Popup Image Container */}
            <div className={styles.imageViewer}>
              <img 
                src={galleryImages[selectedIndex].img} 
                alt={galleryImages[selectedIndex].title} 
                className={styles.fullImg} 
              />
            </div>

            {/* Right Scroll Arrow */}
            <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={handleNext}>
              &#10095;
            </button>

            {/* Popup Bottom Bar Meta Info */}
            <div className={styles.lightboxMeta}>
              <div>
                <span className={styles.modalCategory}>
                  {galleryImages[selectedIndex].category}
                </span>
                <h3 className={styles.modalTitle}>
                  {galleryImages[selectedIndex].title}
                </h3>
              </div>
              <div className={styles.counterBadge}>
                {selectedIndex + 1} / {galleryImages.length}
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
