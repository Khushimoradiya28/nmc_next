"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './VirtualTourSection.module.css';

const tourImages = [
  { src: "/assets/hero/nmc-collage.jpg", alt: "NMC College Collage" },
  { src: "/assets/clg-overview/wel-come-to-nmc-copy.webp", alt: "Welcome to NMC" },
  { src: "/assets/facilities/computer-lab.jpg", alt: "High-Tech Computer Lab" },
  { src: "/assets/facilities/fd-studio.jpg", alt: "Fashion Studio" },
  { src: "/assets/facilities/ac-hall.jpg", alt: "Seminar Hall" }
];

export default function VirtualTourSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('360'); // '360' | 'photos'
  const [photoIndex, setPhotoIndex] = useState(0);

  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  const nextSlide = () => {
    setPhotoIndex((prev) => (prev + 1) % tourImages.length);
  };

  const prevSlide = () => {
    setPhotoIndex((prev) => (prev - 1 + tourImages.length) % tourImages.length);
  };

  return (
    <section className={`${styles.sectionPadding} ${styles.tourSection} section-padding tour-section`} id="tour">
      <div className={`${styles.container} container`}>
        <div className={`${styles.tourCard} tour-card`}>
          <div>
            <span className={`${styles.tourBadge} tour-badge`}>Interactive Feature</span>
            <h2 className={`${styles.tourTitle} tour-title`}>360° Campus Virtual Tour</h2>
            <p className={`${styles.tourDesc} tour-desc`}>
              Take an immersive 360-degree interactive tour of our campus buildings, computer labs, library, fashion
              design studio, and green sports quadrangle from anywhere in the world!
            </p>

            <button 
              className={`${styles.btn} ${styles.btnCrimson} ${styles.openTourModal} btn btn-crimson open-tour-modal`} 
              style={{fontSize: '1.05rem'}}
              onClick={openModal}
            >
              <span>Launch Interactive 360° Tour</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </button>
          </div>

          <div className={`${styles.tourPreviewBox} tour-preview-box`}>
            <Image src="/assets/hero/nmc-collage.jpg" alt="NMC College Collage" width={600} height={400} className={`${styles.tourPreviewImg} tour-preview-img`} />
          </div>
        </div>
      </div>

      {/* 360° CAMPUS VIRTUAL TOUR & SLIDER MODAL */}
      <div className={`${styles.modalBackdrop} ${isOpen ? styles.modalBackdropActive : ''}`} onClick={closeModal}>
        <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
          <button className={styles.modalClose} onClick={closeModal}>&times;</button>
          
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>360° Interactive Campus Virtual Tour</h3>
            <p className={styles.modalSubtitle}>Explore the premium infrastructure and campus life at NMC.</p>
          </div>

          <div className={styles.modalTabs}>
            <button 
              className={`${styles.modalTabBtn} ${activeTab === '360' ? styles.modalTabBtnActive : ''}`}
              onClick={() => setActiveTab('360')}
            >
              Interactive 360° Tour
            </button>
            <button 
              className={`${styles.modalTabBtn} ${activeTab === 'photos' ? styles.modalTabBtnActive : ''}`}
              onClick={() => setActiveTab('photos')}
            >
              Campus Photos Gallery
            </button>
          </div>

          <div className={styles.modalContent}>
            {activeTab === '360' ? (
              <iframe
                src="https://www.google.com/maps/embed?pb=!4v1700000000000!6m8!1m7!1sCAoSLEFFMVFpcE1UZFlXTEt1Zk1rMVVUT3VlNXJ4TnpGVEp2Z1JrdjVkTlNWQW91!2m2!1d21.7490487!2d72.1588143!3f0!4f0!5f0.7820865974013092"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
            ) : (
              <div className={styles.modalSlider}>
                {tourImages.map((image, idx) => (
                  <div 
                    key={idx} 
                    className={`${styles.modalSlide} ${idx === photoIndex ? styles.modalSlideActive : ''}`}
                  >
                    <Image 
                      src={image.src} 
                      alt={image.alt} 
                      fill 
                      className={styles.modalSlideImg} 
                    />
                  </div>
                ))}

                {/* Arrows */}
                <button className={`${styles.sliderArrow} ${styles.sliderArrowLeft}`} onClick={prevSlide}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button className={`${styles.sliderArrow} ${styles.sliderArrowRight}`} onClick={nextSlide}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>

                {/* Pagination Dots */}
                <div className={styles.sliderPagination}>
                  {tourImages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`${styles.paginationDot} ${idx === photoIndex ? styles.paginationDotActive : ''}`}
                      onClick={() => setPhotoIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
