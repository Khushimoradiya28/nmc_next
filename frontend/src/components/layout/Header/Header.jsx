"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import styles from './Header.module.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileActive, setMobileActive] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1216);
    };

    handleResize();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMobileNav = () => {
    const next = !mobileActive;
    setMobileActive(next);
    setOpenDropdown(null);
    document.body.style.overflow = next ? 'hidden' : '';
    if (window.__lenis) {
      next ? window.__lenis.stop() : window.__lenis.start();
    }
  };

  const closeMobileNav = () => {
    setMobileActive(false);
    setOpenDropdown(null);
    document.body.style.overflow = '';
    if (window.__lenis) {
      window.__lenis.start();
    }
  };

  const toggleDropdown = (id, e) => {
    if (isMobileView) {
      e.preventDefault();
      e.stopPropagation();
      setOpenDropdown(openDropdown === id ? null : id);
    }
  };

  return (
    <header className={`${styles.heroHeader} ${scrolled ? styles.scrolled : ''}`} id="header">
      <div className="container">
      <div className={styles.heroHeaderContainer}>
        {/* College Logo */}
        <Link href="/" className={styles.heroLogoBox} title="Nandkunvarba Mahila College">
          <Image 
            src="/assets/logo/new-logo-1.png" 
            alt="NMC Logo" 
            width={180} 
            height={70} 
            priority
            className={styles.heroLogoImg} 
          />
        </Link>

        {/* Navigation Links */}
        <nav 
          className={`${styles.heroNav} ${mobileActive ? styles.active : ''}`}
          onWheel={(e) => e.stopPropagation()}
          data-lenis-prevent
        >
          <ul className={styles.heroNavMenu}>
            <li>
              <Link 
                href="/" 
                className={`${styles.heroNavLink} ${pathname === '/' ? styles.activeLink : ''}`}
                onClick={closeMobileNav}
              >
                HOME
              </Link>
            </li>
            
            <li className={`${styles.heroNavDropdown} ${openDropdown === 'about' ? styles.dropdownOpen : ''}`}>
              <span 
                className={`${styles.heroNavLink} ${pathname.startsWith('/about') ? styles.activeLink : ''}`}
                onClick={(e) => toggleDropdown('about', e)}
              >
                ABOUT US 
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
              <ul className={styles.heroDropdownMenu}>
                <li><Link href="/about" onClick={closeMobileNav}>About Us</Link></li>
                <li><Link href="/committee-cells-clubs" onClick={closeMobileNav}>Committee, Cells &amp; Clubs</Link></li>
                <li><Link href="/journal-details" onClick={closeMobileNav}>Journal Details</Link></li>
              </ul>
            </li>

            <li>
              <Link 
                href="/gallery" 
                className={`${styles.heroNavLink} ${pathname === '/gallery' ? styles.activeLink : ''}`}
                onClick={closeMobileNav}
              >
                GALLERY
              </Link>
            </li>

            <li className={styles.heroNavDropdown}>
              <Link 
                href="/courses" 
                className={`${styles.heroNavLink} ${pathname === '/courses' ? styles.activeLink : ''}`}
                onClick={closeMobileNav}
              >
                COURSES 
              </Link>
            </li>

            <li>
              <Link 
                href="/academic" 
                className={`${styles.heroNavLink} ${pathname.startsWith('/academic') ? styles.activeLink : ''}`}
                onClick={closeMobileNav}
              >
                ACADEMIC
              </Link>
            </li>

            <li className={styles.heroNavDropdown}>
              <span 
                className={`${styles.heroNavLink} ${pathname.startsWith('/activities') ? styles.activeLink : ''}`}
              >
                ACTIVITIES 
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
              <ul className={styles.heroDropdownMenu}>
                <li><Link href="/activities/by-club" onClick={closeMobileNav}>By Club</Link></li>
                <li><Link href="/activities/by-department" onClick={closeMobileNav}>By Department</Link></li>
                <li><Link href="/activities/orientation" onClick={closeMobileNav}>Orientation Programs</Link></li>
                <li><Link href="/activities/sports" onClick={closeMobileNav}>Sports</Link></li>
                <li><Link href="/activities/college-events" onClick={closeMobileNav}>College Events</Link></li>
                <li><Link href="/activities/year-calendar" onClick={closeMobileNav}>Year-Calendar</Link></li>
                <li><Link href="/activities/nss" onClick={closeMobileNav}>NSS</Link></li>
              </ul>
            </li>

            <li className={`${styles.heroNavDropdown} ${openDropdown === 'toppers' ? styles.dropdownOpen : ''}`}>
              <span 
                className={`${styles.heroNavLink} ${pathname.startsWith('/toppers') ? styles.activeLink : ''}`}
                onClick={(e) => toggleDropdown('toppers', e)}
              >
                TOPPERS
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
              <ul className={styles.heroDropdownMenu}>
                <li><Link href="/toppers/gold-medalist" onClick={closeMobileNav}>Gold Medalist</Link></li>
                <li><Link href="/toppers/top-10" onClick={closeMobileNav}>Top-10</Link></li>
              </ul>
            </li>

            <li className={`${styles.heroNavDropdown} ${openDropdown === 'student' ? styles.dropdownOpen : ''}`}>
              <span 
                className={`${styles.heroNavLink} ${pathname.startsWith('/student-corner') ? styles.activeLink : ''}`}
                onClick={(e) => toggleDropdown('student', e)}
              >
                STUDENT CORNER 
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
              <ul className={styles.heroDropdownMenu}>
                <li><Link href="/student-corner" onClick={closeMobileNav}>Student Corner</Link></li>
                <li><Link href="/student-corner/academic-programs" onClick={closeMobileNav}>Academic Programs</Link></li>
                <li><Link href="/student-corner/admission-form" onClick={closeMobileNav}>Admission Form</Link></li>
                <li><Link href="/student-corner/term-schedule" onClick={closeMobileNav}>Term Schedule</Link></li>
                <li><Link href="/student-corner/syllabus-link" onClick={closeMobileNav}>Syllabus link</Link></li>
                <li><Link href="/student-corner/uni-result-link" onClick={closeMobileNav}>Uni Result link</Link></li>
                <li><Link href="/student-corner/tablet-scheme" onClick={closeMobileNav}>Tablet Scheme</Link></li>
                <li><Link href="/student-corner/online-lecture" onClick={closeMobileNav}>Online Lecture</Link></li>
                <li><Link href="/student-corner/transportation-inquiry" onClick={closeMobileNav}>Transportation Inquiry</Link></li>
              </ul>
            </li>

            <li>
              <Link 
                href="/happenings" 
                className={`${styles.heroNavLink} ${pathname === '/happenings' ? styles.activeLink : ''}`}
                onClick={closeMobileNav}
              >
                HAPPENINGS
              </Link>
            </li>
            
            <li className={`${styles.heroNavDropdown} ${openDropdown === 'iqac' ? styles.dropdownOpen : ''}`}>
              <span 
                className={`${styles.heroNavLink} ${pathname.startsWith('/iqac') ? styles.activeLink : ''}`}
                onClick={(e) => toggleDropdown('iqac', e)}
              >
                IQAC
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
              <ul className={styles.heroDropdownMenu}>
                <li><Link href="/iqac" onClick={closeMobileNav}>Introduction</Link></li>
                <li><Link href="/iqac/vision-mission" onClick={closeMobileNav}>Vision / Mission</Link></li>
                <li><Link href="/iqac/composition-of-iqac" onClick={closeMobileNav}>Composition of IQAC</Link></li>
                <li><Link href="/iqac/strategies-benefits-functions" onClick={closeMobileNav}>Strategies / Benefits / Functions</Link></li>
                <li><Link href="/iqac/conferences-fdp-workshops" onClick={closeMobileNav}>Conferences / FDP / workshops</Link></li>
                <li><Link href="/iqac/naac" onClick={closeMobileNav}>NAAC</Link></li>
                <li><Link href="/iqac/nirf" onClick={closeMobileNav}>NIRF</Link></li>
              </ul>
            </li>

            <li className={`${styles.heroNavDropdown} ${openDropdown === 'contact' ? styles.dropdownOpen : ''}`}>
              <span 
                className={`${styles.heroNavLink} ${pathname.startsWith('/contact') || pathname.startsWith('/alumni') ? styles.activeLink : ''}`}
                onClick={(e) => toggleDropdown('contact', e)}
              >
                CONTACT US
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
              <ul className={styles.heroDropdownMenu}>
                <li><Link href="/contact" onClick={closeMobileNav}>Contact Us</Link></li>
                <li className={`${styles.heroSubDropdown} ${openDropdown === 'alumni' ? styles.dropdownOpen : ''}`}>
                  <a 
                    href="#" 
                    className={styles.heroSubMenuToggle} 
                    onClick={(e) => { e.preventDefault(); toggleDropdown('alumni', e); }}
                  >
                    Alumni Legacy
                    <span>»</span>
                  </a>
                  <ul className={styles.heroSubDropdownMenu}>
                    <li><Link href="/alumni/alumni-association" onClick={closeMobileNav}>» Alumni Association</Link></li>
                    <li><Link href="/alumni/other-details" onClick={closeMobileNav}>» Other Details</Link></li>
                    <li><Link href="/alumni/feedback-link" onClick={closeMobileNav}>» Feedback link</Link></li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </nav>

        {/* Mobile Hamburger Button */}
        <div 
          className={`${styles.hamburger} ${mobileActive ? styles.hamburgerActive : ''}`} 
          onClick={toggleMobileNav}
          aria-label="Toggle Navigation Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      </div>
    </header>
  );
}
