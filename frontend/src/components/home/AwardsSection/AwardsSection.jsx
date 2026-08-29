'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './AwardsSection.module.css';
import AwardServices from '@/services/AwardServices';

const resolveImageUrl = (img) => {
  if (!img) return '';
  const clean = img.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  const backendBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
  const cleanPath = clean.startsWith('/') ? clean : `/${clean}`;
  return `${backendBase}${cleanPath}`;
};

export default function AwardsSection() {
  const [awardsData, setAwardsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasTransition, setHasTransition] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const autoPlayRef = useRef(null);

  // Responsive slidesToShow detection
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 575) {
        setSlidesToShow(1);
      } else if (window.innerWidth <= 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch purely dynamic awards from API
  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setLoading(true);
        const res = await AwardServices.getAllAwards({ status: 'active', limit: 50 });
        if (res?.data && Array.isArray(res.data)) {
          const formatted = res.data.map((item, idx) => {
            const rawImg = item.image_url || item.image_webp_url || item.image || item.image_webp || '';
            return {
              id: item._id || item.guid || idx,
              name: item.title || '',
              info: item.description || '',
              src: resolveImageUrl(rawImg),
              alt: item.title || `NMC Award Certificate ${idx + 1}`
            };
          });
          setAwardsData(formatted);
        }
      } catch (err) {
        console.error('Error fetching awards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, []);

  const totalAwards = awardsData.length;
  const isSliderActive = totalAwards > slidesToShow;

  // Infinite looping duplicate sets only if totalAwards > 1
  const displayAwards = isSliderActive
    ? [...awardsData, ...awardsData, ...awardsData]
    : awardsData;

  const handleNext = () => {
    if (!isSliderActive) return;

    if (currentIndex >= totalAwards) {
      setHasTransition(false);
      setCurrentIndex(0);

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
    if (!isSliderActive) return;

    if (currentIndex <= 0) {
      setHasTransition(false);
      setCurrentIndex(totalAwards);

      setTimeout(() => {
        setHasTransition(true);
        setCurrentIndex(totalAwards - 1);
      }, 30);
    } else {
      setHasTransition(true);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (!isSliderActive || isHovered) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 3000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [currentIndex, isHovered, isSliderActive, totalAwards]);

  if (awardsData.length === 0 && !loading) {
    return null; // Or empty if nothing exists
  }

  return (
    <section className={`${styles.sectionPadding} ${styles.awardsSection} section-padding awards-section`} id="awards">
      <div className={`${styles.container} container`}>
        <div className={`${styles.sectionHeader} section-header`}>
          <div className={`${styles.sectionSubtitle} section-subtitle`}>Recognition & Excellence</div>
          <h2 className={`${styles.sectionTitle} section-title`}>Awards & <span>Certificates</span></h2>
          <p className={`${styles.sectionDescription} section-description`}>
            Recognizing academic excellence, skill mastery, and professional growth of our students.
          </p>
        </div>

        <div className={`${styles.awardsSliderWrap} awards-slider-wrap`}>
          {isSliderActive && (
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
          )}

          <div
            className={styles.carouselWrapper}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className={styles.awardsGallery}
              style={{
                transform: isSliderActive ? `translate3d(calc(-${currentIndex} * var(--slide-step)), 0, 0)` : 'none',
                transition: hasTransition && isSliderActive ? 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
                justifyContent: !isSliderActive ? 'center' : 'flex-start'
              }}
            >
              {displayAwards.map((award, index) => {
                const isCenter = isSliderActive && index === currentIndex + 1;
                return (
                  <div key={`${award.id}-${index}`} className={`${styles.awardItem} ${isCenter ? styles.cardCenter : (!isSliderActive ? styles.cardCenter : '')} award-item`}>
                    <div className={`${styles.awardImgWrap} award-img-wrap`}>
                      {award.src ? (
                        <Image 
                          src={award.src} 
                          alt={award.alt} 
                          width={320} 
                          height={220} 
                          className={`${styles.awardImg} award-img`}
                          unoptimized={award.src.startsWith('http')}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '280px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #8a0000 0%, #b30000 100%)',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '1.25rem',
                          borderRadius: '16px'
                        }}>
                          🏆
                        </div>
                      )}
                    </div>
                    <h4 className={`${styles.awardName} award-name`}>{award.name}</h4>
                    <p className={`${styles.awardInfo} award-info`}>{award.info}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {isSliderActive && (
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
          )}
        </div>

      </div>
    </section>
  );
}
