'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './AwardsSection.module.css';

const baseAwards = [
  {
    src: "/assets/awards/award1.jpg",
    alt: "NMC Award Certificate 1",
    name: "Academic Excellence Award",
    info: "Outstanding performance in academics and student development."
  },
  {
    src: "/assets/awards/award2.jpg",
    alt: "NMC Award Certificate 2",
    name: "Best Women's College Recognition",
    info: "Empowering women through quality education and holistic growth."
  },
  {
    src: "/assets/awards/award3.jpg",
    alt: "NMC Award Certificate 3",
    name: "Campus Infrastructure Award",
    info: "Modern facilities, equipped labs, and student-friendly campus."
  }
];

// Triple the array to ensure smooth seamless looping forward and backward
const awards = [...baseAwards, ...baseAwards, ...baseAwards];

export default function AwardsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasTransition, setHasTransition] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef(null);

  const handleNext = () => {
    if (currentIndex >= baseAwards.length) {
      // Instantly jump back to start of duplicate set without transition
      setHasTransition(false);
      setCurrentIndex(0);

      // Trigger the slide transition to index 1 in the next paint cycle
      setTimeout(() => {
        setHasTransition(true);
        setCurrentIndex(1);
      }, 30);
    } else {
      setHasTransition(true);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex <= 0) {
      // Instantly jump to the end of duplicate set without transition
      setHasTransition(false);
      setCurrentIndex(baseAwards.length);

      // Trigger transition to index (length - 1) in the next paint cycle
      setTimeout(() => {
        setHasTransition(true);
        setCurrentIndex(baseAwards.length - 1);
      }, 30);
    } else {
      setHasTransition(true);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (isHovered) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 3000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [currentIndex, isHovered]);

  return (
    <section className={`${styles.sectionPadding} ${styles.awardsSection} section-padding awards-section`} id="awards">
      <div className={`${styles.container} container`}>
        <div className={`${styles.sectionHeader} section-header`}>
          <div className={`${styles.sectionSubtitle} section-subtitle`}>Recognition & Excellence</div>
          <h2 className={`${styles.sectionTitle} section-title`}>Awards & <span>Certificates</span></h2>
          <p className={`${styles.sectionDescription} section-description`}>Recognizing academic excellence, skill mastery, and professional growth of our students.</p>
        </div>

        <div className={`${styles.awardsSliderWrap} awards-slider-wrap`}>
          <button 
            className={`${styles.awardsArrow} ${styles.awardsArrowLeft} awards-arrow awards-arrow-left`} 
            id="awardPrev" 
            aria-label="Previous Award"
            onClick={handlePrev}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div 
            className={styles.carouselWrapper}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div 
              className={styles.awardsGallery}
              style={{
                transform: `translate3d(calc(-${currentIndex} * var(--slide-step)), 0, 0)`,
                transition: hasTransition ? 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'
              }}
            >
              {awards.map((award, index) => {
                const isCenter = index === currentIndex + 1;
                return (
                  <div key={index} className={`${styles.awardItem} ${isCenter ? styles.cardCenter : ''} award-item`}>
                    <div className={`${styles.awardImgWrap} award-img-wrap`}>
                      <Image src={award.src} alt={award.alt} width={320} height={220} className={`${styles.awardImg} award-img`} />
                    </div>
                    <h4 className={`${styles.awardName} award-name`}>{award.name}</h4>
                    <p className={`${styles.awardInfo} award-info`}>{award.info}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            className={`${styles.awardsArrow} ${styles.awardsArrowRight} awards-arrow awards-arrow-right`} 
            id="awardNext" 
            aria-label="Next Award"
            onClick={handleNext}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}
