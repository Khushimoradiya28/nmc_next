'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAVIGATION_CONFIG, isActiveRoute } from '@/constants/navigation';
import styles from './Navigation.module.css';

/**
 * Desktop Navigation Component
 * Renders nested dropdowns and structures for mega menus.
 * Fully accessible with ARIA markers.
 * 
 * @param {Object} props
 * @param {boolean} props.shouldBeSolid - If header is solid (scrolled state)
 */
export const Navigation = ({ shouldBeSolid }) => {
  const pathname = usePathname();
  const menuItems = NAVIGATION_CONFIG.desktop.filter(item => item.visible);

  return (
    <ul className={styles.navList} role="menubar">
      {menuItems.map((item) => {
        const active = isActiveRoute(pathname, item.path);
        const hasSubmenu = item.hasDropdown && item.items && item.items.length > 0;

        return (
          <li
            key={item.id}
            className={`${styles.navItem} ${hasSubmenu ? styles.hasDropdown : ''}`}
            role="none"
          >
            <Link
              href={item.path}
              target={item.target || '_self'}
              rel={item.isExternal ? 'noopener noreferrer' : undefined}
              className={`${styles.navLink} ${active ? styles.active : ''} ${
                shouldBeSolid ? styles.linkDark : styles.linkLight
              }`}
              role="menuitem"
              aria-haspopup={hasSubmenu ? 'true' : 'false'}
              aria-expanded={hasSubmenu ? 'false' : undefined} // Handled by hover CSS or JS
            >
              <span className={styles.linkLabel}>{item.label}</span>
              {hasSubmenu && (
                <svg
                  className={styles.chevron}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              )}
            </Link>

            {/* Submenu Panels */}
            {hasSubmenu && item.dropdownType === 'standard' && (
              <ul className={styles.dropdown} role="menu" aria-label={`${item.label} Submenu`}>
                {item.items
                  .filter((sub) => sub.visible)
                  .map((subItem) => {
                    const subActive = isActiveRoute(pathname, subItem.path, true);
                    return (
                      <li key={subItem.id} role="none">
                        <Link
                          href={subItem.path}
                          target={subItem.target || '_self'}
                          className={`${styles.dropdownLink} ${subActive ? styles.dropdownActive : ''}`}
                          role="menuitem"
                        >
                          {subItem.label}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            )}

            {/* Mega Menu Layout Structure (Future-ready) */}
            {hasSubmenu && item.dropdownType === 'megamenu' && (
              <div className={styles.megaMenu} role="menu" aria-label={`${item.label} Mega Menu`}>
                <div className={styles.megaMenuGrid}>
                  {item.items
                    .filter((section) => section.visible)
                    .map((section) => (
                      <div key={section.id} className={styles.megaMenuCol}>
                        <h4 className={styles.megaMenuTitle}>{section.label}</h4>
                        <ul className={styles.megaMenuList}>
                          {section.items
                            .filter((sub) => sub.visible)
                            .map((subItem) => {
                              const megaActive = isActiveRoute(pathname, subItem.path, true);
                              return (
                                <li key={subItem.id} role="none">
                                  <Link
                                    href={subItem.path}
                                    target={subItem.target || '_self'}
                                    className={`${styles.megaMenuLink} ${megaActive ? styles.megaActive : ''}`}
                                    role="menuitem"
                                  >
                                    {subItem.label}
                                  </Link>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default Navigation;
