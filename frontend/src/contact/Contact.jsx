"use client";

import React from 'react';
import Image from 'next/image';
import styles from './Contact.module.css';

export default function Contact() {
  return (
    <section className={`${styles.sectionPadding} ${styles.contactSection} section-padding contact-section`} id="contact">
    <div className={`${styles.container} container`}>
      <div className={`${styles.contactGrid} contact-grid`}>
        <div>
          <div className={`${styles.sectionSubtitle} section-subtitle`}>Get In Touch</div>
          <h2 className={`${styles.sectionTitle} section-title`}>Contact Us & <span>Geo-Location</span></h2>
          <p style={{color: 'var(--gray-600)', marginBottom: '2rem'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style={{display: 'inline', verticalAlign: 'middle', marginRight: '4px'}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> <strong>Campus Address:</strong> Devraj nagar - 2, Saher farti sadak, Near Shivaji Circle, Ghogha Road,
            Bhavnagar.<br />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style={{display: 'inline', verticalAlign: 'middle', marginRight: '4px'}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> <strong>Helpline:</strong> 0278 - 2471813 / 14 / 15 / 16 / 17<br />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style={{display: 'inline', verticalAlign: 'middle', marginRight: '4px'}}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> <strong>Email:</strong> nmcbhavnagar@gmail.com
          </p>

          <div className={`${styles.mapCardWrapper} map-card-wrapper`}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3705.807869687989!2d72.1588143!3d21.7490487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395f5075bc7b99c7%3A0xa1aa677bbd1b64a2!2sNandkunvarba%20Mahila%20College!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%" height="100%" style={{border: '0'}} allowfullscreen="" loading="lazy"></iframe>
          </div>
        </div>

        <div className={`${styles.contactFormCard} contact-form-card`}>
          <h3
            style={{fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: '800', color: 'var(--gray-900)', marginBottom: '.5rem'}}>
            Admission Inquiry Form
          </h3>
          <p style={{color: 'var(--gray-600)', marginBottom: '1.5rem', fontSize: '0.92rem'}}>
            Fill out your details to receive instant callback regarding admission & free bus service.
          </p>

          <form id="inquiryForm">
            <div style={{marginBottom: '1rem'}}>
              <label style={{fontWeight: '700', fontSize: '0.9rem', color: 'var(--gray-900)'}}>Student Full Name *</label>
              <input type="text" className={`${styles.formControl} form-control`} required />
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{fontWeight: '700', fontSize: '0.9rem', color: 'var(--gray-900)'}}>Mobile Number *</label>
              <input type="tel" className={`${styles.formControl} form-control`} required />
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{fontWeight: '700', fontSize: '0.9rem', color: 'var(--gray-900)'}}>Course Interested In
                *</label>
              <select className={`${styles.formControl} form-control`} required>
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

            <button type="submit" className={`${styles.btn} ${styles.btnCrimson} btn btn-crimson`} style={{width: '100%', fontSize: '1rem'}}>Submit Inquiry</button>
          </form>
        </div>
      </div>
    </div>
  </section>
  );
}
