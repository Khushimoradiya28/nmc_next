"use client";

import React, { useState } from 'react';
import styles from './Contact.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    course: 'bca'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.mobile) {
      setSubmitted(true);
      // Reset form after short delay
      setTimeout(() => {
        setFormData({ name: '', mobile: '', course: 'bca' });
        setSubmitted(false);
      }, 5000);
    }
  };

  return (
    <section className={styles.contactSection} id="contact">
      <div className={styles.container}>
        <div className={styles.contactGrid}>
          {/* Left Column: Campus details and Google Maps */}
          <div>
            <div className={styles.sectionSubtitle}>Get In Touch</div>
            <h2 className={styles.sectionTitle}>Contact Us &amp; <span>Geo-Location</span></h2>
            
            <p className={styles.contactInfoBlock}>
              <span className={styles.infoLine}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.infoIcon}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg> 
                <strong>Campus Address:</strong> Devraj nagar - 2, Saher farti sadak, Near Shivaji Circle, Ghogha Road, Bhavnagar.
              </span>
              <span className={styles.infoLine}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.infoIcon}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg> 
                <strong>Helpline:</strong> 0278 - 2471813 / 14 / 15 / 16 / 17
              </span>
              <span className={styles.infoLine}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.infoIcon}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg> 
                <strong>Email:</strong> nmcbhavnagar@gmail.com
              </span>
            </p>

            <div className={styles.mapCardWrapper}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3705.807869687989!2d72.1588143!3d21.7490487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395f5075bc7b99c7%3A0xa1aa677bbd1b64a2!2sNandkunvarba%20Mahila%20College!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                title="Google Maps Location"
              />
            </div>
          </div>

          {/* Right Column: Callback Inquiry Form */}
          <div className={styles.contactFormCard}>
            <h3 className={styles.formHeading}>Admission Inquiry Form</h3>
            <p className={styles.formSubtext}>
              Fill out your details to receive instant callback regarding admission &amp; free bus service.
            </p>

            {submitted ? (
              <div className={styles.successMessage}>
                <h4>✔ Inquiry Submitted Successfully</h4>
                <p>Thank you! Our admission representative will call you back within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} id="inquiryForm">
                <div style={{ marginBottom: '1rem' }}>
                  <label className={styles.inputLabel}>Student Full Name *</label>
                  <input 
                    type="text" 
                    className={styles.formControl}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required 
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label className={styles.inputLabel}>Mobile Number *</label>
                  <input 
                    type="tel" 
                    className={styles.formControl}
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    required 
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className={styles.inputLabel}>Course Interested In *</label>
                  <select 
                    className={styles.formControl}
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    required
                  >
                    <option value="bba">BBA (Rs 8,000/sem)</option>
                    <option value="bca">BCA (Rs 15,000/sem)</option>
                    <option value="ba">BA (Bachelor of Arts)</option>
                    <option value="bcom">B.Com (Bachelor of Commerce)</option>
                    <option value="ma">MA (Master of Arts)</option>
                    <option value="mcom">M.Com (Master of Commerce)</option>
                    <option value="msw">MSW (Master of Social Work)</option>
                    <option value="dfd">Diploma in Fashion Designing (DFD/CFD)</option>
                    <option value="dnys">Diploma in Naturopathy (DNYS)</option>
                  </select>
                </div>

                <button type="submit" className={`${styles.btn} ${styles.btnCrimson}`}>Submit Inquiry</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
