"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './StudentTestimonials.module.css';

// REAL DATA SCHEMA: Leave empty or populate ONLY with verified college data
const studentTestimonialsData = []; 

export default function StudentTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback view when no real data is available
  if (!studentTestimonialsData || studentTestimonialsData.length === 0) {
    return (
      <section className={styles.sectionWrapper} id="students-testimonials">
        <div className={styles.container}>
          <div className={styles.headerBlock}>
            <span className={styles.badge}>STUDENT VOICES</span>
            <h2 className={styles.sectionTitle}>Campus Experiences & Success Stories</h2>
          </div>
          <div className={styles.placeholderCard}>
            <div className={styles.placeholderIcon}>🎓</div>
            <h3 className={styles.placeholderTitle}>Student Stories Coming Soon</h3>
            <p className={styles.placeholderText}>
              We are currently gathering verified experiences, testimonials, and success journeys directly from our students and alumnae.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const current = studentTestimonialsData[currentIndex];

  return (
    <section className={styles.sectionWrapper} id="students-testimonials">
      <div className={styles.container}>
        <div className={styles.headerBlock}>
          <span className={styles.badge}>STUDENT VOICES</span>
          <h2 className={styles.sectionTitle}>Campus Experiences & Success Stories</h2>
        </div>

        <motion.div 
          className={styles.spotlightCanvas}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Left: Student Image Frame */}
          <div className={styles.visualColumn}>
            <div className={styles.imageWrapper}>
              <Image 
                src={current.photo} 
                alt={current.name} 
                className={styles.studentImg} 
                fill 
                sizes="320px"
              />
              <div className={styles.floatingBadge}>
                <span>{current.program}</span> • <span>{current.year}</span>
              </div>
            </div>
          </div>

          {/* Right: Testimonial Quote */}
          <div className={styles.contentColumn}>
            <div className={styles.quoteMark}>“</div>
            <p className={styles.quoteText}>{current.quote}</p>
            
            <div className={styles.bioBlock}>
              <div className={styles.goldLine} />
              <h3 className={styles.studentName}>{current.name}</h3>
              <p className={styles.studentDetails}>{current.program} ({current.year})</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
