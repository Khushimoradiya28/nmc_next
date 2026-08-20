'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './ActivityFilter.module.css';

export default function ActivityFilter({ tabs = [], activeTab, onTabChange }) {
  return (
    <div className={styles.filterBar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${styles.filterPill} ${isActive ? styles.filterActive : ''}`}
          >
            {isActive && (
              <motion.span 
                layoutId="activeFilterPill"
                className={styles.activeBg}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
