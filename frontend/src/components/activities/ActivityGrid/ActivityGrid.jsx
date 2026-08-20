'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './ActivityGrid.module.css';

export default function ActivityGrid({ images = [] }) {
  const [selectedImg, setSelectedImg] = useState(null);

  if (images.length === 0) return null;

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.grid}>
        {images.map((img, idx) => (
          <div 
            key={idx} 
            className={styles.imgWrapper}
            onClick={() => setSelectedImg(img)}
          >
            <Image 
              src={img} 
              alt={`Gallery image ${idx + 1}`} 
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={styles.galleryImg}
            />
            <div className={styles.overlay}>
              <span className={styles.zoomText}>View Photo</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox overlay */}
      {selectedImg && (
        <div className={styles.lightbox} onClick={() => setSelectedImg(null)}>
          <button className={styles.closeBtn} onClick={() => setSelectedImg(null)} aria-label="Close lightbox">
            &times;
          </button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <Image 
              src={selectedImg} 
              alt="Expanded view" 
              width={1000} 
              height={700}
              className={styles.lightboxImg}
            />
          </div>
        </div>
      )}
    </div>
  );
}
