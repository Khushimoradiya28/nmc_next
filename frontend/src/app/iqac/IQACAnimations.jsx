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
    const updateScrollTrigger = () => {
      ScrollTrigger.update();
    };
    gsap.ticker.add(updateScrollTrigger);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();

      const ctx = gsap.context(() => {
        // Animate section headers
        gsap.utils.toArray('[data-animate="header"]').forEach((el) => {
          gsap.fromTo(
            el,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 95%',
                toggleActions: 'play none none none',
              },
            }
          );
        });

        // Animate cards with stagger
        gsap.utils.toArray('[data-animate="stagger-cards"]').forEach((container) => {
          const cards = container.children;
          gsap.fromTo(
            cards,
            { y: 35, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: container,
                start: 'top 95%',
                toggleActions: 'play none none none',
              },
            }
          );
        });

        // Fade up
        gsap.utils.toArray('[data-animate="fade-up"]').forEach((el) => {
          gsap.fromTo(
            el,
            { y: 35, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 95%',
                toggleActions: 'play none none none',
              },
            }
          );
        });

        // Fade from left
        gsap.utils.toArray('[data-animate="fade-left"]').forEach((el) => {
          gsap.fromTo(
            el,
            { x: -40, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 95%',
                toggleActions: 'play none none none',
              },
            }
          );
        });

        // Fade from right
        gsap.utils.toArray('[data-animate="fade-right"]').forEach((el) => {
          gsap.fromTo(
            el,
            { x: 40, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 95%',
                toggleActions: 'play none none none',
              },
            }
          );
        });
      }, wrapperRef);

      wrapperRef._gsapCtx = ctx;
    }, 150);

    return () => {
      clearTimeout(timer);
      gsap.ticker.remove(updateScrollTrigger);
      if (wrapperRef._gsapCtx) {
        wrapperRef._gsapCtx.revert();
      }
    };
  }, []);

  return (
    <div ref={wrapperRef} className="iqac-anim-wrapper">
      {children}
    </div>
  );
}
