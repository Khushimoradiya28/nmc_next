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
                🛡️ ISO 9001:2015 Certified
              </div>
              <div className={styles.highlightPill}>
                🚌 Free Bus Service
              </div>
              <div className={styles.highlightPill}>
                🧥 Blazer Gift
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
              <span className={styles.icon}>📍</span>
              <span className={styles.contactText}>Near Shivaji Circle, Ring Road, Bhavnagar</span>
            </a>

            <a href="tel:02782471813" className={styles.contactItemLink}>
              <span className={styles.icon}>📞</span>
              <span className={styles.contactText}>0278-2471813 / 14 / 15</span>
            </a>

            <a href="mailto:nmcbhavnagar@gmail.com" className={styles.contactItemLink}>
              <span className={styles.icon}>✉️</span>
              <span className={styles.contactText}>nmcbhavnagar@gmail.com</span>
            </a>

            {/* Social Pills */}
            <div className={styles.socialGrid}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Youtube">
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
            Copyright © 2026 Nandkunvarba Mahila College. All Rights Reserved.
          </div>
          
          <div className={styles.bottomRight}>
            <span className={styles.bottomAffiliation}>Affiliated to Maharaja Krishnakumarsinhji Bhavnagar University (MKBU).</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
