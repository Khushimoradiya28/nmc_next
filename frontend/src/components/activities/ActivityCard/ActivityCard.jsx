'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './ActivityCard.module.css';

export default function ActivityCard({ event, basePath }) {
  const getEventPath = () => {
    if (basePath) return `${basePath}/${event.id}`;
    return `/activities/${event.categoryId}/${event.subCategoryId}/${event.id}`;
  };

  return (
    <motion.div 
      className={styles.cardContainer}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Link href={getEventPath()} className={styles.cardLink}>
        <div className={styles.imageWrapper}>
          <div className={styles.dateTag}>
            <span className={styles.dateNum}>
              {new Date(event.date).getDate()}
            </span>
            <span className={styles.dateMonth}>
              {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
            </span>
          </div>
          <img 
            src={event.thumbnail} 
            alt={event.title} 
            className={styles.cardImg}
          />
        </div>

        <div className={styles.cardBody}>
          <h3 className={styles.cardTitle}>{event.title}</h3>
          <p className={styles.cardDesc}>{event.shortDescription}</p>
          
          <div className={styles.cardFooter}>
            <span className={styles.deptTag}>
              {event.subCategoryId.replace(/-/g, ' ').toUpperCase()}
            </span>
            <span className={styles.arrowCta}>
              Explore Activity
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
