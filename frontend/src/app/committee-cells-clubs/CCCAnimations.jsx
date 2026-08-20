"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CCCAnimations({ children }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const updateScrollTrigger = () => {
      ScrollTrigger.update();
    };
    gsap.ticker.add(updateScrollTrigger);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();

      const ctx = gsap.context(() => {
        // Animate section headers
        gsap.utils.toArray('[data-animate="header"]').forEach((el) => {
          gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          });
        });

        // Animate cards with stagger
        gsap.utils.toArray('[data-animate="stagger-cards"]').forEach((container) => {
          const cards = container.children;
          gsap.from(cards, {
            y: 50,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });
        });

      }, wrapperRef);

      wrapperRef._gsapCtx = ctx;
    }, 200);

    return () => {
      clearTimeout(timer);
      gsap.ticker.remove(updateScrollTrigger);
      if (wrapperRef._gsapCtx) {
        wrapperRef._gsapCtx.revert();
      }
    };
  }, []);

  return <div ref={wrapperRef}>{children}</div>;
}
