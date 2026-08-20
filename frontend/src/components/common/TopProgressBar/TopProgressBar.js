"use client";
import React, { useEffect, useRef } from "react";
import styles from "./TopProgressBar.module.css";

export default function TopProgressBar() {
  const progressRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          
          if (progressRef.current) {
            if (scrollHeight > 0) {
              const progress = Math.min(Math.max((scrollTop / scrollHeight) * 100, 0), 100);
              progressRef.current.style.width = `${progress}%`;
            } else {
              progressRef.current.style.width = '0%';
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={progressRef}
      className={styles.scrollProgressBar}
      style={{ width: "0%" }}
    ></div>
  );
}
