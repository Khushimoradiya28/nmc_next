"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function IQACAnimations({ children }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Connect Lenis (if active) with GSAP ScrollTrigger
    // Lenis uses requestAnimationFrame, so we hook into gsap.ticker
    const updateScrollTrigger = () => {
      ScrollTrigger.update();
    };
    gsap.ticker.add(updateScrollTrigger);

    // Wait for layout to settle
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
            duration: 0.7,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });
        });

        // Fade up
        gsap.utils.toArray('[data-animate="fade-up"]').forEach((el) => {
          gsap.from(el, {
            y: 50,
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

        // Fade from left
        gsap.utils.toArray('[data-animate="fade-left"]').forEach((el) => {
          gsap.from(el, {
            x: -60,
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

        // Fade from right
        gsap.utils.toArray('[data-animate="fade-right"]').forEach((el) => {
          gsap.from(el, {
            x: 60,
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

        // Scale up
        gsap.utils.toArray('[data-animate="scale-up"]').forEach((el) => {
          gsap.from(el, {
            scale: 0.9,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          });
        });

        // Table rows stagger
        gsap.utils.toArray('[data-animate="table-rows"]').forEach((table) => {
          const rows = table.querySelectorAll('tbody tr');
          gsap.from(rows, {
            x: -30,
            opacity: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: table,
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
