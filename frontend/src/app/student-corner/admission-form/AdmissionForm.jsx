"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import AdmissionServices from '@/services/AdmissionServices';
import CourseServices from '@/services/CourseServices';

// Themed custom dropdown
function CustomSelect({ name, value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;

  return (
    <div className={styles.customSelect} ref={selectRef}>
      <button
        type="button"
        className={`${styles.selectTrigger} ${isOpen ? styles.selectOpen : ''} ${value ? styles.selectHasValue : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={styles.selectText}>{selectedLabel}</span>
        <span className={`${styles.selectArrow} ${isOpen ? styles.selectArrowUp : ''}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className={styles.selectDropdown} role="listbox">
          <div
            className={styles.selectOptions}
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
          >
            {options.map((option) => (
              <div
                key={option.value}
                role="option"
                aria-selected={value === option.value}
                className={`${styles.selectOption} ${value === option.value ? styles.selectOptionActive : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const genderOptions = [
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const DEFAULT_COURSE_OPTIONS = [];

const qualificationOptions = [
  { value: '10th', label: '10th Pass' },
  { value: '12th', label: '12th Pass (HSC)' },
  { value: 'graduate', label: 'Graduate' },
  { value: 'postgraduate', label: 'Post Graduate' },
];

export default function AdmissionForm() {
  const router = useRouter();
  const [courseOptions, setCourseOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', gender: '', dob: '',
    course: '', qualification: '', city: ''
  });

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await CourseServices.getCourseDropdown();
        if (res && res.data && Array.isArray(res.data)) {
          const mapped = res.data.map(item => {
            const cleanName = (item.title || item.full_title || item.display_label || '').replace(/\s*\([^)]*\)\s*$/, '').trim();
            return {
              value: cleanName || item.title,
              label: cleanName || item.title,
            };
          });
          setCourseOptions(mapped);
        }
      } catch (err) {
        console.error("Failed to load courses dropdown:", err);
      }
    }
    loadCourses();
  }, []);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target || e;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required.';
    if (!formData.phone.trim()) errors.phone = 'Mobile number is required.';
    if (!formData.email.trim()) errors.email = 'Email address is required.';
    if (!formData.dob) errors.dob = 'Date of birth is required.';
    if (!formData.gender) errors.gender = 'Please select a gender.';
    if (!formData.city.trim()) errors.city = 'City/Village is required.';
    if (!formData.course) errors.course = 'Please select a course.';
    if (!formData.qualification) errors.qualification = 'Please select last qualification.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setApiError('');
    setLoading(true);

    try {
      const selectedCourseLabel = formData.course;
      const selectedGenderLabel = genderOptions.find(g => g.value === formData.gender)?.label || formData.gender;
      const selectedQualLabel = qualificationOptions.find(q => q.value === formData.qualification)?.label || formData.qualification;

      console.log("[AdmissionForm] Submitting application payload:", {
        full_name: formData.name.trim(),
        mobile: formData.phone.trim(),
        email: formData.email.trim(),
        dob: formData.dob,
        gender: selectedGenderLabel,
        city_village: formData.city.trim(),
        course: selectedCourseLabel,
        last_qualification: selectedQualLabel,
      });

      const res = await AdmissionServices.submitApplication({
        full_name: formData.name.trim(),
        mobile: formData.phone.trim(),
        email: formData.email.trim(),
        dob: formData.dob,
        gender: selectedGenderLabel,
        city_village: formData.city.trim(),
        course: selectedCourseLabel,
        last_qualification: selectedQualLabel,
      });

      console.log("[AdmissionForm] Application submitted successfully:", res);
      setFormData({ name: '', email: '', phone: '', gender: '', dob: '', course: '', qualification: '', city: '' });
      router.push('/thank-you');
    } catch (err) {
      console.error("[AdmissionForm] Submission failed:", err);
      setApiError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const errLabel = {
    color: '#dc2626',
    fontSize: '0.85rem',
    marginTop: '4px',
    display: 'block',
    fontWeight: '500'
  };

  return (
    <div className={styles.formCard}>
      <h3 className={styles.formCardTitle}>Admission Application Form</h3>
      <p className={styles.formCardSub}>Fill your details below. All fields marked * are mandatory.</p>

      {apiError && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.9rem', fontWeight: '500' }}>
          ⚠ {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Full Name *</label>
            <input type="text" name="name" className={styles.formInput} placeholder="Enter full name" value={formData.name} onChange={handleChange} />
            {fieldErrors.name && <span style={errLabel}>⚠ {fieldErrors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Mobile Number *</label>
            <input type="tel" name="phone" className={styles.formInput} placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleChange} />
            {fieldErrors.phone && <span style={errLabel}>⚠ {fieldErrors.phone}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email Address *</label>
            <input type="email" name="email" className={styles.formInput} placeholder="your.email@example.com" value={formData.email} onChange={handleChange} />
            {fieldErrors.email && <span style={errLabel}>⚠ {fieldErrors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Date of Birth *</label>
            <input
              type="date"
              name="dob"
              className={styles.formInput}
              value={formData.dob}
              onChange={handleChange}
              onClick={(e) => e.target.showPicker && e.target.showPicker()}
              style={{ cursor: 'pointer' }}
            />
            {fieldErrors.dob && <span style={errLabel}>⚠ {fieldErrors.dob}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Gender *</label>
            <CustomSelect
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={genderOptions}
              placeholder="Select Gender"
            />
            {fieldErrors.gender && <span style={errLabel}>⚠ {fieldErrors.gender}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>City / Village *</label>
            <input type="text" name="city" className={styles.formInput} placeholder="e.g. Bhavnagar, Sihor, Palitana" value={formData.city} onChange={handleChange} />
            {fieldErrors.city && <span style={errLabel}>⚠ {fieldErrors.city}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Course Interested In *</label>
            <CustomSelect
              name="course"
              value={formData.course}
              onChange={handleChange}
              options={courseOptions}
              placeholder="Select Course"
            />
            {fieldErrors.course && <span style={errLabel}>⚠ {fieldErrors.course}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Last Qualification *</label>
            <CustomSelect
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              options={qualificationOptions}
              placeholder="Select Qualification"
            />
            {fieldErrors.qualification && <span style={errLabel}>⚠ {fieldErrors.qualification}</span>}
          </div>

          <div className={styles.formGroupFull}>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span>SUBMITTING...</span>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  Submit Application
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
