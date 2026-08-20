"use client";

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

const MEMBERS = [
  { name: 'Dr. Principal', role: 'Chairperson' },
  { name: 'Senior Faculty Member', role: 'Coordinator' },
  { name: 'Faculty Rep. — Arts', role: 'Member' },
  { name: 'Faculty Rep. — Commerce', role: 'Member' },
  { name: 'Faculty Rep. — BCA', role: 'Member' },
  { name: 'Management Representative', role: 'Trust Member' },
  { name: 'Alumni Representative', role: 'External Member' },
  { name: 'Industry Expert', role: 'External Member' },
  { name: 'Administrative Staff', role: 'Office Superintendent' },
  { name: 'Student Representative', role: 'Student Member' },
];

export default function CommitteeSpotlight() {
  const [active, setActive] = useState(0);

  return (
    <section className={styles.compSection}>
      {/* Left: Navigation */}
      <div className={styles.compNav}>
        <p className={styles.compNavLabel}>Committee</p>
        <h2 className={styles.compNavTitle}>Composition of IQAC</h2>
        <div className={styles.compNavList}>
          {MEMBERS.map((m, i) => (
            <div
              key={i}
              className={`${styles.compNavItem} ${i === active ? styles.compNavItemActive : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              {m.name}
            </div>
          ))}
        </div>
      </div>

      {/* Right: Spotlight */}
      <div className={styles.compSpotlight}>
        {/* Editorial background image */}
        <div className={styles.compBgImage}>
          {/* 
            AI IMAGE PLACEHOLDER:
            Generate a cinematic editorial photograph:
            - Women leaders in Indian higher education environment
            - Contemporary institutional architecture (corridors, columns, warm light)
            - Sophisticated, non-corporate, editorial feel
            - Natural lighting, subtle film grain
            - Negative space on left side for text overlay
            - Aspect ratio: wide landscape (roughly 16:9)
            - Style: Premium magazine / campaign photography
          */}
          <Image
            src="/assets/home/hero/2.jpg"
            alt="IQAC Committee - Women in Academic Leadership"
            width={1200}
            height={800}
            priority
          />
        </div>
        <div className={styles.compBgOverlay}></div>

        {/* Giant background number */}
        <span className={styles.compBgNum} key={active}>
          {String(active + 1).padStart(2, '0')}
        </span>

        {/* Active member display */}
        <div className={styles.compMemberContent}>
          <p className={styles.compMemberIndex}>
            Member {String(active + 1).padStart(2, '0')} / 10
          </p>
          <h3 className={styles.compMemberName}>
            {MEMBERS[active].name}
          </h3>
          <p className={styles.compMemberRole}>
            {MEMBERS[active].role}
          </p>
          <div className={styles.compMemberBar}></div>
        </div>

        <span className={styles.compImageNote}>
          Editorial visual — Women shaping institutional excellence
        </span>
      </div>
    </section>
  );
}
