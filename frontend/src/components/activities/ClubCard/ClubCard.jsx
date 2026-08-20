'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './ClubCard.module.css';

export default function ClubCard({ name, dept, link, color, icon: Icon }) {
  return (
    <motion.div 
      className={styles.clubCard}
      style={{ '--card-bg': color }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Link href={link} className={styles.cardLink}>
        <div className={styles.cardHeader}>
          <span className={styles.deptBadge}>{dept}</span>
          {Icon && (
            <span className={styles.clubIcon}>
              <Icon size={24} />
            </span>
          )}
        </div>
        
        <h3 className={styles.clubName}>{name}</h3>
        
        <div className={styles.cardFooter}>
          <span className={styles.ctaText}>View Activities</span>
          <span className={styles.arrowIcon}>→</span>
        </div>
      </Link>
    </motion.div>
  );
}
