"use client";

import { useState } from 'react';
import styles from './page.module.css';

export default function AdmissionForm() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', gender: '', dob: '',
    course: '', qualification: '', city: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.course) {
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', gender: '', dob: '', course: '', qualification: '', city: '' });
        setSubmitted(false);
      }, 6000);
    }
  };

  if (submitted) {
    return (
      <div className={styles.formCard}>
        <div className={styles.successMsg}>
          <h4>✔ Application Submitted Successfully!</h4>
          <p>Our admission team will contact you within 24 hours. Keep your documents ready.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formCard}>
      <h3 className={styles.formCardTitle}>Admission Application Form</h3>
      <p className={styles.formCardSub}>Fill your details below. All fields marked * are mandatory.</p>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Full Name *</label>
            <input type="text" name="name" className={styles.formInput} placeholder="Enter full name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Mobile Number *</label>
            <input type="tel" name="phone" className={styles.formInput} placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email Address</label>
            <input type="email" name="email" className={styles.formInput} placeholder="your.email@example.com" value={formData.email} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Date of Birth</label>
            <input type="date" name="dob" className={styles.formInput} value={formData.dob} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Gender</label>
            <select name="gender" className={styles.formSelect} value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>City / Village</label>
            <input type="text" name="city" className={styles.formInput} placeholder="e.g. Bhavnagar, Sihor, Palitana" value={formData.city} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Course Interested In *</label>
            <select name="course" className={styles.formSelect} value={formData.course} onChange={handleChange} required>
              <option value="">Select Course</option>
              <option value="bba">BBA (₹8,000/Sem)</option>
              <option value="bca">BCA (₹15,000/Sem)</option>
              <option value="ba">BA (Bachelor of Arts)</option>
              <option value="bcom">B.Com (Bachelor of Commerce)</option>
              <option value="ma">MA (Master of Arts)</option>
              <option value="mcom">M.Com (Master of Commerce)</option>
              <option value="msw">MSW (Master of Social Work)</option>
              <option value="pgdpa">PGDPA (Public Administration)</option>
              <option value="fd">Diploma in Fashion Designing</option>
              <option value="dmphw">DMPHW (Health Worker)</option>
              <option value="dhsi">DHSI (Sanitary Inspector)</option>
              <option value="dnys">DNYS (Naturopathy)</option>
              <option value="cfd">Certificate in Fashion Designing</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Last Qualification</label>
            <select name="qualification" className={styles.formSelect} value={formData.qualification} onChange={handleChange}>
              <option value="">Select Qualification</option>
              <option value="10th">10th Pass</option>
              <option value="12th">12th Pass (HSC)</option>
              <option value="graduate">Graduate</option>
              <option value="postgraduate">Post Graduate</option>
            </select>
          </div>

          <div className={styles.formGroupFull}>
            <button type="submit" className={styles.submitBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Submit Application
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
