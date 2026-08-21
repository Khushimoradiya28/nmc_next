'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import styles from './InfrastructureSection.module.css';

const baseFacilities = [
  {
    src: "/assets/facilities/computer-lab.jpg",
    alt: "Computer Lab",
    title: "High-Tech BCA Computer Lab",
    desc: "Equipped with high-speed internet, latest software suites, and programming workstations."
  },
  {
    src: "/assets/facilities/fd-studio.jpg",
    alt: "Fashion Lab",
    title: "Fashion Designing Studio",
    desc: "Dedicated garment construction, pattern making, and textile testing equipment."
  },
  {
    src: "/assets/facilities/ac-hall.jpg",
    alt: "Seminar Hall",
    title: "Air-Conditioned Seminar Hall",
    desc: "Modern AV projectors for guest lectures, workshops, and national symposiums."
  },
  {
    src: "/assets/facilities/computer-lab.jpg",
    alt: "Computer Lab",
    title: "High-Tech BCA Computer Lab 2",
    desc: "Equipped with high-speed internet, latest software suites, and programming workstations."
  },
  {
    src: "/assets/facilities/fd-studio.jpg",
    alt: "Fashion Lab",
    title: "Fashion Designing Studio 2",
    desc: "Dedicated garment construction, pattern making, and textile testing equipment."
  },
  {
    src: "/assets/facilities/ac-hall.jpg",
    alt: "Seminar Hall",
    title: "Air-Conditioned Seminar Hall 2",
    desc: "Modern AV projectors for guest lectures, workshops, and national symposiums."
  }
];

// Duplicate the items array to allow infinite scrolling
const facilities = [...baseFacilities, ...baseFacilities];

export default function InfrastructureSection() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let intervalId;
    let isHovered = false;

    const startAutoScroll = () => {
      intervalId = setInterval(() => {
        if (isHovered) return;
        if (gsap.isTweening(container)) return;

        const card = container.querySelector(`.${styles.facilityCard}`);
        if (!card) return;

        const cardWidth = card.offsetWidth;
        const gap = 24;
        const step = cardWidth + gap;
        const setWidth = step * baseFacilities.length;

        const currentIndex = Math.round(container.scrollLeft / step);
        const nextIndex = currentIndex + 1;
        const targetScrollLeft = nextIndex * step;

        gsap.to(container, {
          scrollLeft: targetScrollLeft,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => {
            if (container.scrollLeft >= setWidth - 5) {
              container.scrollLeft = container.scrollLeft - setWidth;
            }
          }
        });
      }, 3000);
    };

    const handleMouseEnter = () => {
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    startAutoScroll();

    return () => {
      clearInterval(intervalId);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handlePrev = () => {
    const container = scrollRef.current;
    if (!container) return;

    if (gsap.isTweening(container)) return;

    const card = container.querySelector(`.${styles.facilityCard}`);
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap = 24;
    const step = cardWidth + gap;
    const setWidth = step * baseFacilities.length;

    let currentScroll = container.scrollLeft;

    // Jump instantly before moving backwards if we are at start
    if (currentScroll <= 5) {
      container.scrollLeft = setWidth;
      currentScroll = container.scrollLeft;
    }

    const currentIndex = Math.round(currentScroll / step);
    const prevIndex = currentIndex - 1;
    const targetScrollLeft = prevIndex * step;

    gsap.to(container, {
      scrollLeft: targetScrollLeft,
      duration: 0.8,
      ease: 'power2.out',
    });
  };

  const handleNext = () => {
    const container = scrollRef.current;
    if (!container) return;

    if (gsap.isTweening(container)) return;

    const card = container.querySelector(`.${styles.facilityCard}`);
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap = 24;
    const step = cardWidth + gap;
    const setWidth = step * baseFacilities.length;

    const currentIndex = Math.round(container.scrollLeft / step);
    const nextIndex = currentIndex + 1;
    const targetScrollLeft = nextIndex * step;

    gsap.to(container, {
      scrollLeft: targetScrollLeft,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => {
        if (container.scrollLeft >= setWidth - 5) {
          container.scrollLeft = container.scrollLeft - setWidth;
        }
      }
    });
  };

  return (
    <section className={`${styles.sectionPadding} ${styles.facilitiesSection} section-padding facilities-section`} id="facilities">
      <div className={`${styles.container} container`}>
        <div className={`${styles.sectionHeader} section-header`}>
          <div className={`${styles.sectionSubtitle} section-subtitle`}>Campus Facilities</div>
          <h2 className={`${styles.sectionTitle} section-title`}>Infrastructure & <span>Campus Facilities</span></h2>
          <p className={`${styles.sectionDescription} section-description`}>Modern classrooms, computer labs, fashion studios, e-libraries, and sports facilities.</p>
        </div>

        <div className={`${styles.facilitiesSliderWrap} facilities-slider-wrap`}>
          <button 
            className={`${styles.sliderArrow} ${styles.sliderArrowLeft} slider-arrow slider-arrow-left`} 
            id="facilityPrev"
            onClick={handlePrev}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className={`${styles.facilitiesGrid} facilities-grid`} ref={scrollRef}>
            {facilities.map((facility, index) => (
              <div key={index} className={`${styles.facilityCard} facility-card`}>
                <Image src={facility.src} alt={facility.alt} width={600} height={400} className={`${styles.facilityImg} facility-img`} />
                <div className={`${styles.facilityContent} facility-content`}>
                  <h3 className={`${styles.facilityTitle} facility-title`}>{facility.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>{facility.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            className={`${styles.sliderArrow} ${styles.sliderArrowRight} slider-arrow slider-arrow-right`} 
            id="facilityNext"
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
