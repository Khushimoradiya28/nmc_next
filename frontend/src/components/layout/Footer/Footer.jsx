'use client';

import React from 'react';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} id="quick-links">
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          
          {/* Column 1: Brand Info & Badges */}
          <div className={styles.footerColumn}>
            <div className={styles.logoWrapper}>
              <Image 
                src="/assets/logo/new-logo-1.png" 
                alt="Nandkunvarba Mahila College Logo" 
                width={170} 
                height={66} 
                priority
              />
            </div>
            <p className={styles.tagline}>
              Empowering Women Through Higher Education
            </p>
            <p className={styles.trustText}>
              Managed by Shree Sahajanand Education Trust
            </p>
            
            {/* Horizontal Badges Row */}
            <div className={styles.badgesRow}>
              <div className={styles.highlightPill}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
                ISO 9001:2015 Certified
              </div>
              <div className={styles.highlightPill}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2"/><path d="M19 17h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path d="M12 17V7"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 7h14"/><path d="M5 11h14"/></svg>
                Free Bus Service
              </div>
              <div className={styles.highlightPill}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                Blazer Gift
              </div>
            </div>
          </div>

          {/* Column 2: Portals & Student Quick Links */}
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Quick Links</h4>
            <ul className={styles.footerLinks}>
              <li>
                <a href="https://gcas.gujgov.edu.in" target="_blank" rel="noopener noreferrer">
                  GCAS Registration Portal
                </a>
              </li>
              <li>
                <a href="https://www.digitalgujarat.gov.in" target="_blank" rel="noopener noreferrer">
                  Digital Gujarat Portal
                </a>
              </li>
              <li>
                <a href="https://www.abc.gov.in" target="_blank" rel="noopener noreferrer">
                  APAAR ID (ABC Bank)
              </a>
              </li>
              <li>
                <a href="https://mkbhavuni.edu.in" target="_blank" rel="noopener noreferrer">
                  MKBU University Results
                </a>
              </li>
              <li>
                <a href="https://mkbhavuni.edu.in" target="_blank" rel="noopener noreferrer">
                  MKBU Syllabus Link
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: E-Resources & Governance */}
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>E-Resources &amp; RTI</h4>
            <ul className={styles.footerLinks}>
              <li>
                <a href="https://swayam.gov.in" target="_blank" rel="noopener noreferrer">
                  SWAYAM Online Courses
                </a>
              </li>
              <li>
                <a href="https://swayamprabha.gov.in" target="_blank" rel="noopener noreferrer">
                  SWAYAM PRABHA DTH
                </a>
              </li>
              <li>
                <a href="https://epgp.inflibnet.ac.in" target="_blank" rel="noopener noreferrer">
                  e-Pathshala Platform
                </a>
              </li>
              <li>
                <a href="https://ndl.iitkgp.ac.in" target="_blank" rel="noopener noreferrer">
                  National Digital Library (NDLI)
                </a>
              </li>
              <li>
                <a href="#quick-links">
                  Right to Information (RTI)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Action */}
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Contact &amp; Support</h4>
            
            <a 
              href="https://maps.google.com/?q=Nandkunvarba+Mahila+College+Bhavnagar" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.contactItemLink}
            >
              <span className={styles.icon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </span>
              <span className={styles.contactText}>Near Shivaji Circle, Ring Road, Bhavnagar</span>
            </a>

            <a href="tel:02782471813" className={styles.contactItemLink}>
              <span className={styles.icon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </span>
              <span className={styles.contactText}>0278-2471813 / 14 / 15</span>
            </a>

            <a href="mailto:nmcbhavnagar@gmail.com" className={styles.contactItemLink}>
              <span className={styles.icon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </span>
              <span className={styles.contactText}>nmcbhavnagar@gmail.com</span>
            </a>

            {/* Social Pills */}
            <div className={styles.socialGrid}>
              <a href="https://www.facebook.com/NMC.girls.college/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/nmcgirlscollege/?hl=en" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/channel/UCyzUFRmzw_b23dxa7eagNgg" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Youtube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                </svg>
              </a>
            </div>

            {/* Expert Button with Glow Aura wrapper */}
            {/* <div className={styles.ctaWrapper}>
              <div className={styles.ctaGlowAura} />
              <button className={styles.ctaExpertBtn}>
                Speech with Expert / Admission Help
              </button>
            </div> */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.footerBottom}>
          <div className={styles.bottomLeft}>
            Copyright © 2026 Nandkunvarba Mahila College. All Rights Reserved by <a href="https://themidnight.in/" target="_blank" rel="noopener noreferrer" className={styles.midnightLink}>Midnight</a>.
          </div>
          
          <div className={styles.bottomRight}>
            <span className={styles.bottomAffiliation}>Affiliated to Maharaja Krishnakumarsinhji Bhavnagar University (MKBU).</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
