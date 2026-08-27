"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
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
    <>
      {/* Contact Us Phone Icon */}
      <Link 
        href="/contact"
        className={`${styles.contactBtn} ${isVisible ? styles.visible : ""}`}
        title="Contact Us"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      </Link>

      {/* Scroll to Top Button */}
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
    </>
  );
}
