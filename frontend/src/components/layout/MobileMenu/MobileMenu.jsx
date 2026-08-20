'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAVIGATION_CONFIG, isActiveRoute } from '@/constants/navigation';
import styles from './MobileMenu.module.css';

/**
 * Premium Fullscreen Navigation Overlay
 * Unizin-inspired — dark fullscreen panel with large nav links,
 * smooth open/close transitions, and keyboard accessibility.
 */
export const MobileMenu = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const drawerRef = useRef(null);
  const menuItems = NAVIGATION_CONFIG.mobile.filter(item => item.visible);

  // Escape key close handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Close menu when route changes
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      id="fullscreen-navigation"
      className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
      ref={drawerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      aria-hidden={!isOpen}
    >
      <div className={styles.content}>
        {/* Navigation Links */}
        <nav className={styles.nav} role="navigation" aria-label="Main Navigation">
          <ul className={styles.navList}>
            {menuItems.map((item, index) => {
              const active = isActiveRoute(pathname, item.path, true);

              return (
                <li
                  key={item.id}
                  className={styles.navItem}
                  style={{ transitionDelay: isOpen ? `${0.1 + index * 0.04}s` : '0s' }}
                >
                  <Link
                    href={item.path}
                    className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
                    onClick={onClose}
                  >
                    <span className={styles.linkIndex}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.linkLabel}>{item.label}</span>
                    <svg
                      className={styles.linkArrow}
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer info */}
        <div className={styles.menuFooter}>
          <div className={styles.footerContact}>
            <a href="mailto:nmcbhavnagar@gmail.com" className={styles.footerLink}>
              nmcbhavnagar@gmail.com
            </a>
            <a href="tel:02782471813" className={styles.footerLink}>
              0278 - 2471813
            </a>
          </div>
          <p className={styles.footerAddress}>
            Bhavnagar, Gujarat, India
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
