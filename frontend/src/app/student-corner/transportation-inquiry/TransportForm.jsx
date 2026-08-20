"use client";

import { useState } from 'react';
import styles from './page.module.css';

export default function TransportForm() {
  const [form, setForm] = useState({ name: '', phone: '', village: '', course: '', route: '' });
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.phone) {
      setDone(true);
      setTimeout(() => { setForm({ name: '', phone: '', village: '', course: '', route: '' }); setDone(false); }, 5000);
    }
  };

  if (done) {
    return (
      <div className={styles.inquiryForm} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ color: '#16a34a', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>✔ Inquiry Submitted!</h4>
          <p style={{ color: '#4b5563', fontSize: '0.9rem', margin: 0 }}>Our transport coordinator will call you within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <form className={styles.inquiryForm} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Student Name *</label>
          <input type="text" className={styles.formInput} placeholder="Full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Mobile Number *</label>
          <input type="tel" className={styles.formInput} placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Village / Area</label>
          <input type="text" className={styles.formInput} placeholder="e.g. Sihor, Palitana, Ghogha" value={form.village} onChange={e => setForm({...form, village: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Course</label>
          <select className={styles.formSelect} value={form.course} onChange={e => setForm({...form, course: e.target.value})}>
            <option value="">Select Course</option>
            <option value="bba">BBA</option>
            <option value="bca">BCA</option>
            <option value="ba">BA</option>
            <option value="bcom">B.Com</option>
            <option value="ma">MA</option>
            <option value="mcom">M.Com</option>
            <option value="msw">MSW</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className={styles.formGroupFull}>
          <label className={styles.formLabel}>Preferred Route</label>
          <select className={styles.formSelect} value={form.route} onChange={e => setForm({...form, route: e.target.value})}>
            <option value="">Select Route</option>
            <option value="city">Bhavnagar City Route</option>
            <option value="sihor">Sihor Route</option>
            <option value="palitana">Palitana Route</option>
            <option value="ghogha">Ghogha Route</option>
            <option value="botad">Botad Route</option>
            <option value="dholera">Dholera Route</option>
            <option value="other">Other / New Route Request</option>
          </select>
        </div>
        <div className={styles.formGroupFull}>
          <button type="submit" className={styles.submitBtn}>Submit Transport Inquiry</button>
        </div>
      </div>
    </form>
  );
}
