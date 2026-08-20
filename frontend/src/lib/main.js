/* ==========================================================================
   NANDKUNVARBA MAHILA COLLEGE (NMC) - MAIN INTERACTIVE SYSTEM & ANIMATION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. SCROLL PROGRESS BAR & BACK TO TOP PROGRESS RING
     ========================================================================== */
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const backToTopBtn = document.getElementById('backToTop');
  const progressRingFill = document.getElementById('progressRingFill');
  const ringCircumference = 125.66; // 2 * PI * r (r = 20)

  const updateScrollProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (scrollHeight > 0) {
      const scrollPercent = Math.min(Math.max((scrollTop / scrollHeight) * 100, 0), 100);
      
      // Update top progress bar
      if (scrollProgressBar) {
        scrollProgressBar.style.width = `${scrollPercent}%`;
      }

      // Update circular progress ring
      if (progressRingFill) {
        const offset = ringCircumference - (scrollPercent / 100) * ringCircumference;
        progressRingFill.style.strokeDashoffset = `${offset}`;
      }

      // Toggle back to top visibility
      if (backToTopBtn) {
        if (scrollTop > 300) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }
    }
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     2. STICKY HEADER & SCROLLSPY NAVIGATION
     ========================================================================== */
  const header = document.querySelector('.hero-header');
  const navLinks = document.querySelectorAll('.hero-nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  const handleScrollEffects = () => {
    const scrollY = window.scrollY;

    // Header styling
    if (scrollY > 60) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // ScrollSpy active link
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 160;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('active');
        } else if (href && href.startsWith('#') && href !== `#${currentSectionId}`) {
          link.classList.remove('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScrollEffects, { passive: true });

  /* ==========================================================================
     3. MOBILE MENU TOGGLE
     ========================================================================== */
  const hamburger = document.getElementById('hamburger');
  const heroNav = document.querySelector('.hero-nav');

  if (hamburger && heroNav) {
    hamburger.addEventListener('click', () => {
      heroNav.classList.toggle('active');
      hamburger.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        heroNav.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
  }

  /* ==========================================================================
     4. EASED STATS COUNTER ANIMATION (easeOutExpo)
     ========================================================================== */
  const statCards = document.querySelectorAll('.stat-premium-card');
  let statsTriggered = false;

  const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  const animateStatsEased = () => {
    statCards.forEach((card, idx) => {
      const statNumber = card.querySelector('.stat-premium-number');
      if (!statNumber) return;

      const target = parseInt(statNumber.getAttribute('data-target') || '0', 10);
      const suffix = statNumber.getAttribute('data-suffix') || '';
      const duration = 2200; // ms
      const startTime = performance.now();

      card.classList.add('revealed');

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const currentVal = Math.floor(easedProgress * target);

        statNumber.innerHTML = `${currentVal.toLocaleString()}<span>${suffix}</span>`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          statNumber.innerHTML = `${target.toLocaleString()}<span>${suffix}</span>`;
        }
      };

      setTimeout(() => {
        requestAnimationFrame(updateCounter);
      }, idx * 100);
    });
  };

  const statsSection = document.querySelector('.stats-premium-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsTriggered) {
          statsTriggered = true;
          animateStatsEased();
        }
      });
    }, { threshold: 0.2 });

    statsObserver.observe(statsSection);
  }

  /* Campus Strength Live Counters & Gauge Animation */
  const campusStrengthSection = document.getElementById('campus-strength');
  let campusStrengthTriggered = false;

  const animateCampusStrength = () => {
    const strengthCounters = document.querySelectorAll('.strength-counter');
    strengthCounters.forEach((numElem, idx) => {
      const target = parseInt(numElem.getAttribute('data-target') || '0', 10);
      const duration = 2200;
      const startTime = performance.now();

      const updateStrengthCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const currentVal = Math.floor(easedProgress * target);

        numElem.textContent = currentVal.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateStrengthCount);
        } else {
          numElem.textContent = target.toLocaleString();
        }
      };

      setTimeout(() => {
        requestAnimationFrame(updateStrengthCount);
      }, idx * 100);
    });

    const gaugeMeter = document.getElementById('strengthGaugeMeter');
    if (gaugeMeter) {
      gaugeMeter.style.strokeDashoffset = '62';
    }
  };

  if (campusStrengthSection) {
    const strengthObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !campusStrengthTriggered) {
          campusStrengthTriggered = true;
          animateCampusStrength();
        }
      });
    }, { threshold: 0.15 });

    strengthObserver.observe(campusStrengthSection);
  }

  /* ==========================================================================
     5. 3D PERSPECTIVE TILT & SPOTLIGHT GLOW ENGINE (Desktop)
     ========================================================================== */
  const isHoverSupported = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (isHoverSupported) {
    const tiltCards = document.querySelectorAll('.prog-card, .why-pro-card, .facility-card, .digi-card, .stud-testi-card, .career-indicator-card, .career-runway-container, .sector-spectrum-card, .mou-connect-card, .cal-milestone-card, .cal-shift-card, .cal-matrix-card, .cal-exam-item, .adm-intake-card, .adm-estimator-card, .adm-steps-wrapper, .qhub-card, .fvision-card, .fv-horizon-card, .alumni-metric-card, .astory-card, .alumni-guild-hub, .stat-premium-card, .cert-card-luxury, .vm-card-luxury, .gcard-item, .notice-card-luxury, .strength-hub-card');

    tiltCards.forEach(card => {
      card.classList.add('spotlight-active');

      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Spotlight coordinates
        card.style.setProperty('--spot-x', `${x}px`);
        card.style.setProperty('--spot-y', `${y}px`);

        // Subtle 3D tilt
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5; // max 5deg
        const rotateY = ((x - centerX) / centerX) * 5;  // max 5deg

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  /* ==========================================================================
     6. BUTTON RIPPLE CLICK FEEDBACK
     ========================================================================== */
  const rippleButtons = document.querySelectorAll('.btn, .hero-apply-btn, .hero-tour-btn, .digi-tab, .prog-filter-btn, .gfilter-btn, .vm-tab');

  rippleButtons.forEach(btn => {
    btn.classList.add('btn-ripple');
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-span';
      
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* ==========================================================================
     7. PHOTO & VIDEO GALLERY FILTER & LIGHTBOX SYSTEM
     ========================================================================== */
  const gfilterBtns = document.querySelectorAll('.gfilter-btn');
  const gcardItems = document.querySelectorAll('.gcard-item');

  // Category filter tabs
  gfilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      gfilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      gcardItems.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Lightbox Modal
  const galleryLightbox = document.getElementById('galleryLightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxMediaContainer = document.getElementById('lightboxMediaContainer');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxCounter = document.getElementById('lightboxCounter');

  let currentGalleryIndex = 0;
  let activeGalleryItems = [];

  const updateActiveGalleryItems = () => {
    activeGalleryItems = Array.from(gcardItems).filter(item => item.style.display !== 'none');
  };

  const renderLightboxContent = (index) => {
    if (!activeGalleryItems.length || index < 0 || index >= activeGalleryItems.length) return;
    currentGalleryIndex = index;
    const item = activeGalleryItems[index];
    const type = item.getAttribute('data-type');
    const src = item.getAttribute('data-src');
    const title = item.getAttribute('data-title') || 'Campus Life';
    const desc = item.getAttribute('data-desc') || '';

    if (lightboxCounter) {
      lightboxCounter.textContent = `${index + 1} / ${activeGalleryItems.length}`;
    }
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = desc;

    if (lightboxMediaContainer) {
      lightboxMediaContainer.innerHTML = '';
      if (type === 'video') {
        const iframe = document.createElement('iframe');
        iframe.src = `${src}?autoplay=1`;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        lightboxMediaContainer.appendChild(iframe);
      } else {
        const img = document.createElement('img');
        img.src = src;
        img.alt = title;
        lightboxMediaContainer.appendChild(img);
      }
    }
  };

  const openLightbox = (index) => {
    updateActiveGalleryItems();
    renderLightboxContent(index);
    if (galleryLightbox) {
      galleryLightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    if (galleryLightbox) {
      galleryLightbox.classList.remove('active');
      document.body.style.overflow = '';
      if (lightboxMediaContainer) {
        lightboxMediaContainer.innerHTML = ''; // Stop video
      }
    }
  };

  gcardItems.forEach((card) => {
    card.addEventListener('click', () => {
      updateActiveGalleryItems();
      const activeIdx = activeGalleryItems.indexOf(card);
      if (activeIdx !== -1) {
        openLightbox(activeIdx);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      const prevIdx = (currentGalleryIndex - 1 + activeGalleryItems.length) % activeGalleryItems.length;
      renderLightboxContent(prevIdx);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      const nextIdx = (currentGalleryIndex + 1) % activeGalleryItems.length;
      renderLightboxContent(nextIdx);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!galleryLightbox || !galleryLightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
  });

  /* ==========================================================================
     8. DYNAMIC ACADEMIC PROGRAM FILTERS
     ========================================================================== */
  const progFilterBtns = document.querySelectorAll('.prog-filter-btn');
  const progCards = document.querySelectorAll('.prog-card');

  progFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      progFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      progCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     9. 360 VIRTUAL TOUR & REGISTRATION MODALS
     ========================================================================== */
  const tourModal = document.getElementById('tourModal');
  const tourTriggers = document.querySelectorAll('.open-tour-modal');
  const tourClose = document.getElementById('tourClose');

  if (tourModal) {
    tourTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        tourModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    if (tourClose) {
      tourClose.addEventListener('click', () => {
        tourModal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  }

  const regModal = document.getElementById('registrationModal');
  const regTriggers = document.querySelectorAll('.open-reg-modal');
  const modalClose = document.querySelector('.modal-close');

  if (regModal) {
    regTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        regModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        regModal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    regModal.addEventListener('click', (e) => {
      if (e.target === regModal) {
        regModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ==========================================================================
     10. FORM SUBMISSION HANDLERS
     ========================================================================== */
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        const oldText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Connecting to Official Portal...</span>`;

        setTimeout(() => {
          window.open('https://forms.gle/TBNKycyc6AjfipWc8', '_blank');
          submitBtn.disabled = false;
          submitBtn.innerHTML = oldText;
          if (regModal) regModal.classList.remove('active');
        }, 600);
      }
    });
  });

  /* ==========================================================================
     11. HORIZONTAL CAROUSEL CONTROLS
     ========================================================================== */
  const awardsGallery = document.getElementById('awardsGallery');
  const awardPrev = document.getElementById('awardPrev');
  const awardNext = document.getElementById('awardNext');

  if (awardsGallery && awardPrev && awardNext) {
    const scrollAmount = 360;
    awardNext.addEventListener('click', () => awardsGallery.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
    awardPrev.addEventListener('click', () => awardsGallery.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
  }

  const certTrack = document.getElementById('certTrack');
  const certPrev = document.getElementById('certPrev');
  const certNext = document.getElementById('certNext');

  if (certTrack && certPrev && certNext) {
    const certScrollAmount = 450;
    certNext.addEventListener('click', () => certTrack.scrollBy({ left: certScrollAmount, behavior: 'smooth' }));
    certPrev.addEventListener('click', () => certTrack.scrollBy({ left: -certScrollAmount, behavior: 'smooth' }));
  }

  /* ==========================================================================
     12. TESTIMONIALS TAB SWITCHERS
     ========================================================================== */
  const digiTabs = document.querySelectorAll('.digi-tab');
  const digiPanels = document.querySelectorAll('.digi-panel');

  digiTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-panel');

      digiTabs.forEach(t => t.classList.remove('active'));
      digiPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(target);
      if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.style.animation = 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    });
  });

  /* ==========================================================================
     13. GLOBAL SCROLL REVEAL OBSERVER
     ========================================================================== */
  const revealElements = document.querySelectorAll(
    '.section-header, .stat-premium-card, .why-pro-card, .facility-card, .prog-card, .cert-hcard, .update-card, .placement-stat-card, .qlink-card, .alumni-stat, .fv-goal-item, .calendar-link-btn, .testimonial-card, .testi-student-card, .digi-card, .stud-testi-card, .faculty-img-card, .about-premium-img-wrap, .about-premium-content, .vm-card-luxury, .gcard-item'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach((el, index) => {
    el.classList.add('reveal-up');
    el.style.transitionDelay = `${(index % 4) * 0.08}s`;
    revealObserver.observe(el);
  });

  /* ==========================================================================
     14. PLACEMENT & ALUMNI STAT NUMBER COUNT-UP
     ========================================================================== */
  const placementNums = document.querySelectorAll('.placement-stat-num, .alumni-stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        const numMatch = text.match(/(\d+)/);
        if (numMatch) {
          const target = parseInt(numMatch[1], 10);
          const suffix = text.replace(numMatch[1], '');
          const duration = 1800;
          const startTime = performance.now();

          const countUp = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const current = Math.floor(easedProgress * target);
            el.textContent = `${current}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(countUp);
            } else {
              el.textContent = text;
            }
          };

          requestAnimationFrame(countUp);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  placementNums.forEach(el => counterObserver.observe(el));
  
  /* ==========================================================================
     16. ACADEMIC COMMAND CENTER (CALENDAR & TIMETABLE TAB SWITCHER)
     ========================================================================== */
  const calTabBtns = document.querySelectorAll('.cal-tab-btn');
  const calPanels = document.querySelectorAll('.cal-tab-panel');

  if (calTabBtns.length && calPanels.length) {
    calTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-cal-tab');
        
        calTabBtns.forEach(b => b.classList.remove('active'));
        calPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = document.getElementById(`cal-panel-${tabId}`);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  /* ==========================================================================
     17. ADMISSION (DYNAMIC) ESTIMATOR & LIVE COUNTDOWN TIMER
     ========================================================================== */
  const admCourseSelect = document.getElementById('admCourseSelect');
  const calcFeeVal = document.getElementById('calcFeeVal');
  const calcSeatsVal = document.getElementById('calcSeatsVal');

  if (admCourseSelect && calcFeeVal && calcSeatsVal) {
    admCourseSelect.addEventListener('change', () => {
      const selectedOption = admCourseSelect.options[admCourseSelect.selectedIndex];
      const fee = selectedOption.getAttribute('data-fee') || '₹15,000 / Sem';
      const seats = selectedOption.getAttribute('data-seats') || 'Seats Available';

      calcFeeVal.textContent = fee;
      calcSeatsVal.textContent = seats;

      calcFeeVal.style.transform = 'scale(1.08)';
      calcFeeVal.style.transition = 'transform 0.2s ease';
      setTimeout(() => {
        calcFeeVal.style.transform = 'scale(1)';
      }, 200);
    });
  }

  // Live Admission Countdown Timer
  const daysEl = document.getElementById('adm-days');
  const hoursEl = document.getElementById('adm-hours');
  const minsEl = document.getElementById('adm-mins');
  const secsEl = document.getElementById('adm-secs');

  if (daysEl && hoursEl && minsEl && secsEl) {
    let totalSeconds = (8 * 24 * 3600) + (14 * 3600) + (35 * 60) + 42;

    const updateTimer = () => {
      if (totalSeconds > 0) {
        totalSeconds--;
        const d = Math.floor(totalSeconds / (3600 * 24));
        const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        daysEl.textContent = String(d).padStart(2, '0');
        hoursEl.textContent = String(h).padStart(2, '0');
        minsEl.textContent = String(m).padStart(2, '0');
        secsEl.textContent = String(s).padStart(2, '0');
      }
    };

    setInterval(updateTimer, 1000);
  }

  /* ==========================================================================
     18. EXECUTIVE QUICK LINKS & E-RESOURCES CATEGORY FILTER
     ========================================================================== */
  const qhubBtns = document.querySelectorAll('.qhub-filter-btn');
  const qhubCards = document.querySelectorAll('.qhub-card');

  if (qhubBtns.length && qhubCards.length) {
    qhubBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-qcat');

        qhubBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        qhubCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (cat === 'all' || cardCat === cat) {
            card.classList.remove('hidden');
            card.style.animation = 'fadeInCal 0.35s ease';
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }
});
