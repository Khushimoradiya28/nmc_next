"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./ScrollToTop.module.css";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const ringRef = useRef(null);
  const ringCircumference = 125.66; // 2 * PI * r (r = 20)

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          
          if (ringRef.current) {
            let percent = 0;
            if (scrollHeight > 0) {
              percent = Math.min(Math.max((scrollTop / scrollHeight) * 100, 0), 100);
            }
            const offset = ringCircumference - (percent / 100) * ringCircumference;
            ringRef.current.style.strokeDashoffset = offset;
          }
          
          setIsVisible(scrollTop > 300);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button 
      className={`${styles.backToTopBtn} ${isVisible ? styles.visible : ""}`} 
      onClick={scrollToTop} 
      title="Back to Top"
    >
      <svg className={styles.progressRingSvg} width="46" height="46" viewBox="0 0 46 46">
        <circle className={styles.progressRingTrack} cx="23" cy="23" r="20" fill="none" strokeWidth="3" />
        <circle 
          ref={ringRef}
          className={styles.progressRingFill} 
          cx="23" cy="23" r="20" fill="none" strokeWidth="3"
          strokeDasharray={ringCircumference} 
          strokeDashoffset={ringCircumference} 
        />
      </svg>
      <span className={styles.backToTopArrow}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </span>
    </button>
  );
}
