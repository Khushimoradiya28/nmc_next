'use client';

import { useEffect, useRef } from 'react';

export default function CounterAnimation() {
  const triggered = useRef(false);

  useEffect(() => {
    const animateCounters = () => {
      if (triggered.current) return;
      triggered.current = true;
      const counters = document.querySelectorAll('.strength-counter');
      counters.forEach((el, idx) => {
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        if (target === 0) return;
        const duration = 2000;
        const startTime = performance.now();

        const update = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          el.textContent = Math.floor(eased * target).toLocaleString();
          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.textContent = target.toLocaleString();
          }
        };

        setTimeout(() => requestAnimationFrame(update), idx * 80);
      });
    };

    const sections = document.querySelectorAll('#campus-strength, #alumni');
    if (sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !triggered.current) {
          animateCounters();
        }
      });
    }, { threshold: 0.15 });

    sections.forEach(section => observer.observe(section));

    // Also check if already in view
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0 && !triggered.current) {
        setTimeout(animateCounters, 300);
      }
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
