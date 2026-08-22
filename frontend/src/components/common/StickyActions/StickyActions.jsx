"use client";

import React from 'react';
import Link from 'next/link';
import styles from './StickyActions.module.css';

export default function StickyActions() {
  return (
    <aside 
      className={styles.stickyActionsContainer} 
      aria-label="Quick Action Floating Menu"
    >
      {/* 1. Admission Now Button */}
      <Link 
        href="/student-corner/admission-form" 
        className={`${styles.stickyBtn} ${styles.btnAdmission}`}
        title="Apply for Admission 2026-27"
        id="stickyAdmissionBtn"
      >
        <span className={styles.btnShimmer}></span>
        <span className={styles.pulseDot} aria-hidden="true"></span>
        <span className={styles.btnIconWrap}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </span>
        <span className={styles.btnText}>Admission Now</span>
      </Link>

      {/* 2. Download Brochure Button */}
      <Link 
        href="/about#brochure" 
        className={`${styles.stickyBtn} ${styles.btnBrochure}`}
        title="Download Official College Brochure & Prospectus"
        id="stickyBrochureBtn"
      >
        <span className={styles.btnShimmer}></span>
        <span className={styles.btnIconWrap}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </span>
        <span className={styles.btnText}>Download Brochure</span>
      </Link>
    </aside>
  );
}
