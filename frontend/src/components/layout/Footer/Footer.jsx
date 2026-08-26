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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
                ISO 9001:2015 Certified
              </div>
              <div className={styles.highlightPill}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2" /><path d="M19 17h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" /><path d="M12 17V7" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /><path d="M5 7h14" /><path d="M5 11h14" /></svg>
                Free Bus Service
              </div>
              <div className={styles.highlightPill}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              </span>
              <span className={styles.contactText}>Near Shivaji Circle, Ring Road, Bhavnagar</span>
            </a>

            <a href="tel:02782471813" className={styles.contactItemLink}>
              <span className={styles.icon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </span>
              <span className={styles.contactText}>0278-2471813 / 14 / 15</span>
            </a>

            <a href="mailto:nmcbhavnagar@gmail.com" className={styles.contactItemLink}>
              <span className={styles.icon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </span>
              <span className={styles.contactText}>nmcbhavnagar@gmail.com</span>
            </a>

            {/* Social Pills */}
            <div className={styles.socialGrid}>
              <a href="https://www.facebook.com/NMC.girls.college/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/nmcgirlscollege/?hl=en" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/channel/UCyzUFRmzw_b23dxa7eagNgg" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="YouTube">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="X (Twitter)">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://workspaceupdates.googleblog.com/2023/04/new-community-features-for-google-chat-and-an-update-currents%20.html" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Google Updates">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.footerBottom}>
          <div className={styles.bottomLeft}>
            © 2026 All Rights Reserved by Nandkunvarba Mahila College. | Powered by <a href="https://themidnight.in/" target="_blank" rel="noopener noreferrer" className={styles.midnightLink}>The Midnight</a>
          </div>

          <div className={styles.bottomRight}>
            <span className={styles.bottomAffiliation}>Affiliated to Maharaja Krishnakumarsinhji Bhavnagar University (MKBU).</span>
          </div>
        </div>
      </div>

      {/* ── Giant Architectural Marquee at the Base (matching reference image) ── */}
      <div className={styles.bigMarqueeWrapper} aria-hidden="true">
        <div className={styles.bigMarqueeRail}>
          <div className={styles.bigMarqueeTrack}>
            <span className={styles.bigMarqueeText}>NANDKUNVARBA MAHILA COLLEGE</span>
            <span className={styles.bigMarqueeDot}>.</span>
            <span className={styles.bigMarqueeText}>NANDKUNVARBA MAHILA COLLEGE</span>
            <span className={styles.bigMarqueeDot}>.</span>
          </div>
          <div className={styles.bigMarqueeTrack}>
            <span className={styles.bigMarqueeText}>NANDKUNVARBA MAHILA COLLEGE</span>
            <span className={styles.bigMarqueeDot}>.</span>
            <span className={styles.bigMarqueeText}>NANDKUNVARBA MAHILA COLLEGE</span>
            <span className={styles.bigMarqueeDot}>.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
