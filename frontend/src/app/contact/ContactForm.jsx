"use client";

import React, { useState } from 'react';
import styles from './page.module.css';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    website: '',
    reason: '',
    course: '',
    teacher: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.firstName && formData.message) {
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ firstName: '', lastName: '', website: '', reason: '', course: '', teacher: '', message: '' });
        setSubmitted(false);
      }, 6000);
    }
  };

  if (submitted) {
    return (
      <div className={styles.formArea}>
        <div className={styles.successMessage}>
          <h4>✔ Message Sent Successfully!</h4>
          <p>Once we receive your information our representative will get back to you within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formArea}>
      <h2 className={styles.formHeading}>Please Fill the Form below.</h2>
      <p className={styles.formSubtext}>
        Once we receive your information our representative will get back to you within 24 hours.
      </p>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          {/* First Name */}
          <div className={styles.formGroup}>
            <input
              type="text"
              name="firstName"
              className={styles.formInput}
              placeholder="Your name here..."
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Last Name */}
          <div className={styles.formGroup}>
            <input
              type="text"
              name="lastName"
              className={styles.formInput}
              placeholder="Your last name here..."
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          {/* Website */}
          <div className={styles.formGroup}>
            <input
              type="text"
              name="website"
              className={styles.formInput}
              placeholder="Enter your Website ..."
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          {/* Reason */}
          <div className={styles.formGroup}>
            <input
              type="text"
              name="reason"
              className={styles.formInput}
              placeholder="Reason contacting us ..."
              value={formData.reason}
              onChange={handleChange}
            />
          </div>

          {/* Choose Course */}
          <div className={styles.formGroupFull}>
            <select
              name="course"
              className={styles.formSelect}
              value={formData.course}
              onChange={handleChange}
            >
              <option value="">Chose Course</option>
              <option value="bba">BBA (Bachelor of Business Administration)</option>
              <option value="bca">BCA (Bachelor of Computer Application)</option>
              <option value="ba">BA (Bachelor of Arts)</option>
              <option value="bcom">B.Com (Bachelor of Commerce)</option>
              <option value="ma">MA (Master of Arts)</option>
              <option value="mcom">M.Com (Master of Commerce)</option>
              <option value="msw">MSW (Master of Social Work)</option>
              <option value="dfd">Diploma in Fashion Designing (DFD/CFD)</option>
              <option value="dnys">Diploma in Naturopathy (DNYS)</option>
            </select>
          </div>

          {/* Choose Teacher */}
          <div className={styles.formGroupFull}>
            <select
              name="teacher"
              className={styles.formSelect}
              value={formData.teacher}
              onChange={handleChange}
            >
              <option value="">Chose Teacher</option>
              <option value="general">General Inquiry</option>
              <option value="admission">Admission Department</option>
              <option value="principal">Principal Office</option>
            </select>
          </div>

          {/* Message */}
          <div className={styles.formGroupFull}>
            <textarea
              name="message"
              className={styles.formTextarea}
              placeholder="Your message ..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className={styles.formGroupFull}>
            <button type="submit" className={styles.submitBtn}>
              <span className={styles.submitBtnIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </span>
              <span>Send Your Message</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
