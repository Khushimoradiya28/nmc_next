'use client';

import { useEffect, useRef } from 'react';

export default function CounterAnimation() {
  const triggered = useRef(false);

  useEffect(() => {
    const section = document.getElementById('campus-strength');
    if (!section) return;

    const animateCounters = () => {
      const counters = document.querySelectorAll('.strength-counter');
      counters.forEach((el, idx) => {
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        if (target === 0) return;
        const duration = 2000;
        const startTime = performance.now();

        const update = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // easeOutExpo
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

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          animateCounters();
        }
      });
    }, { threshold: 0.15 });

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return null;
}
