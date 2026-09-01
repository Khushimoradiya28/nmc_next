"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';

export default function ThankYouPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Set uniform body background & prevent scroll
    const prevBg = document.body.style.backgroundColor;
    const prevOverflow = document.body.style.overflow;
    document.body.style.backgroundColor = '#FAF7F2';
    document.body.style.overflow = 'hidden';

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      document.body.style.backgroundColor = prevBg;
      document.body.style.overflow = prevOverflow;
      clearInterval(timer);
    };
  }, [router]);

  return (
    <div className={styles.pageContainer}>
      {/* Full-width edge-to-edge subtle background pattern */}
      <div className={styles.backgroundPattern}></div>

      {/* Subtle Background Watermark Logo */}
      <Image
        src="/assets/logo/new-logo-1.png"
        alt="NMC Watermark"
        width={480}
        height={480}
        className={styles.watermarkLogo}
        priority
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />

      <div className={styles.contentWrapper}>
        {/* Top College Logo & Centered 2-Line Name */}
        <div className={styles.brandingGroup}>
          <Image
            src="/assets/logo/new-logo-1.png"
            alt="Nandkunvarba Mahila College"
            width={110}
            height={110}
            className={styles.collegeLogo}
            priority
            onError={(e) => {
              e.currentTarget.src = '/assets/logo/nmc-logo.png';
            }}
          />
          <h2 className={styles.collegeName}>Nandkunvarba Mahila College</h2>
          <p className={styles.collegeTagline}>BHAVNAGAR • EMPOWERING WOMEN</p>
          <div className={styles.goldDivider}></div>
        </div>

        {/* Clean Centered Thank You Heading */}
        <h1 className={styles.title}>
          Thank You for <span>Reaching Out!</span>
        </h1>

        {/* Centered Subtitle */}
        <p className={styles.subtitle}>
          Your inquiry has been submitted successfully. Our team will review your details and connect with you shortly.
        </p>

        {/* Minimal Auto-Redirect Badge */}
        <div className={styles.redirectBadge}>
          <svg className={styles.spinner} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeDasharray="36" strokeDashoffset="12" />
          </svg>
          <span>Redirecting to home page in <strong>{countdown}s</strong>...</span>
        </div>
      </div>
    </div>
  );
}
