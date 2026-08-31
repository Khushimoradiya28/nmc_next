"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './page.module.css';
import ContactServices from '@/services/ContactServices';

// Custom Scrollbar Dropdown wrapper
function ScrollableDropdown({ children, onWheel }) {
  const scrollRef = useRef(null);
  const thumbRef = useRef(null);
  const trackRef = useRef(null);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  const [showScrollbar, setShowScrollbar] = useState(false);

  const updateThumb = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight <= clientHeight) {
      setShowScrollbar(false);
      return;
    }
    setShowScrollbar(true);
    const trackHeight = clientHeight - 12; // 6px margin top+bottom
    const ratio = clientHeight / scrollHeight;
    const height = Math.max(ratio * trackHeight, 24);
    const top = (scrollTop / (scrollHeight - clientHeight)) * (trackHeight - height);
    setThumbHeight(height);
    setThumbTop(top);
  }, []);

  useEffect(() => {
    updateThumb();
  }, [children, updateThumb]);

  return (
    <div className={styles.scrollbarWrapper}>
      <div
        ref={scrollRef}
        className={styles.dropdownScrollInner}
        onScroll={updateThumb}
        onWheel={onWheel}
      >
        {children}
      </div>
      {showScrollbar && (
        <div className={styles.customScrollbar} ref={trackRef}>
          <div
            ref={thumbRef}
            className={styles.customScrollThumb}
            style={{ height: thumbHeight, transform: `translateY(${thumbTop}px)` }}
          />
        </div>
      )}
    </div>
  );
}

const COURSE_OPTIONS = [
  { value: 'bca', label: 'B.C.A. – ₹15,000/Sem' },
  { value: 'bba', label: 'B.B.A. – ₹8,000/Sem' },
  { value: 'bcom', label: 'B.Com – Merit Fees' },
  { value: 'ba', label: 'B.A. – Merit Fees' },
  { value: 'msw', label: 'M.S.W. – Merit Fees' },
  { value: 'mcom', label: 'M.Com – Merit Fees' },
  { value: 'ma', label: 'M.A. – Merit Fees' },
  { value: 'dfd', label: 'DFD (Fashion Design) – Subsidized' },
  { value: 'dnys', label: 'DNYS (Naturopathy & Yoga) – Subsidized' },
];

const TEACHER_OPTIONS = [
  { value: 'general', label: 'General Inquiry & Helpdesk' },
  { value: 'admission', label: 'Admission Department' },
  { value: 'principal', label: 'Principal Office' },
  { value: 'bca_dept', label: 'BCA & IT Department Faculty' },
  { value: 'bba_dept', label: 'BBA & Management Faculty' },
  { value: 'commerce_dept', label: 'B.Com & M.Com Faculty' },
  { value: 'arts_dept', label: 'B.A. & M.A. Arts Faculty' },
  { value: 'social_work', label: 'MSW Social Work Faculty' },
];

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

  const [fieldErrors, setFieldErrors] = useState({});
  const [courseOpen, setCourseOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const courseRef = useRef(null);
  const teacherRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (courseRef.current && !courseRef.current.contains(e.target)) {
        setCourseOpen(false);
      }
      if (teacherRef.current && !teacherRef.current.contains(e.target)) {
        setTeacherOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const handleSelectCourse = (value) => {
    setFormData({ ...formData, course: value });
    setCourseOpen(false);
  };

  const handleSelectTeacher = (value) => {
    setFormData({ ...formData, teacher: value });
    setTeacherOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate mandatory fields
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required.';
    if (!formData.lastName.trim())  errors.lastName  = 'Last name is required.';
    if (!formData.reason.trim())    errors.reason    = 'Reason is required.';
    if (!formData.course)           errors.course    = 'Please select a course.';
    if (!formData.teacher)          errors.teacher   = 'Please select a teacher/department.';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;  // Stop — do nothing until required fields are filled
    }
    setFieldErrors({});
    setApiError('');
    setLoading(true);
    try {
      await ContactServices.submitInquiry({
        firstName: formData.firstName,
        lastName:  formData.lastName,
        website:   formData.website,
        reason:    formData.reason,
        course:    formData.course,
        teacher:   formData.teacher,
        message:   formData.message,
      });
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ firstName: '', lastName: '', website: '', reason: '', course: '', teacher: '', message: '' });
        setSubmitted(false);
      }, 6000);
    } catch (err) {
      setApiError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Inline error label style
  const errLabel = { display: 'block', color: '#dc2626', fontSize: '0.76rem', fontWeight: 600, marginTop: '0.3rem' };

  const selectedCourseObj = COURSE_OPTIONS.find(c => c.value === formData.course);
  const selectedTeacherObj = TEACHER_OPTIONS.find(t => t.value === formData.teacher);

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

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formGrid}>
          {/* First Name */}
          <div className={styles.formGroup}>
            <div className={styles.inputWithIcon}>
              <span className={styles.fieldIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                type="text"
                name="firstName"
                className={styles.formInput}
                placeholder="Your First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            {fieldErrors.firstName && <span style={errLabel}>⚠ {fieldErrors.firstName}</span>}
          </div>

          {/* Last Name */}
          <div className={styles.formGroup}>
            <div className={styles.inputWithIcon}>
              <span className={styles.fieldIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                type="text"
                name="lastName"
                className={styles.formInput}
                placeholder="Your Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            {fieldErrors.lastName && <span style={errLabel}>⚠ {fieldErrors.lastName}</span>}
          </div>

          {/* Website */}
          <div className={styles.formGroup}>
            <div className={styles.inputWithIcon}>
              <span className={styles.fieldIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </span>
              <input
                type="text"
                name="website"
                className={styles.formInput}
                placeholder="Enter your Website"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Reason */}
          <div className={styles.formGroup}>
            <div className={styles.inputWithIcon}>
              <span className={styles.fieldIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input
                type="text"
                name="reason"
                className={styles.formInput}
                placeholder="Reason contacting us"
                value={formData.reason}
                onChange={handleChange}
              />
            </div>
            {fieldErrors.reason && <span style={errLabel}>⚠ {fieldErrors.reason}</span>}
          </div>

          {/* Choose Course Dropdown */}
          <div className={styles.formGroupFull}>
            <div className={styles.customSelectWrapper} ref={courseRef}>
              <button
                type="button"
                className={`${styles.customSelectTrigger} ${courseOpen ? styles.isOpen : ''} ${!formData.course ? styles.isPlaceholder : ''}`}
                onClick={() => {
                  setCourseOpen(!courseOpen);
                  setTeacherOpen(false);
                }}
                aria-haspopup="listbox"
                aria-expanded={courseOpen}
              >
                <span className={styles.selectTriggerContent}>
                  <span className={styles.fieldIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                  </span>
                  <span>{selectedCourseObj ? selectedCourseObj.label : 'Choose Course'}</span>
                </span>
                <span className={styles.selectChevron}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </button>

              {courseOpen && (
                <div
                  className={styles.customDropdownMenu}
                  role="listbox"
                >
                  <ScrollableDropdown onWheel={(e) => e.stopPropagation()}>
                  {COURSE_OPTIONS.map((option) => {
                    const isSelected = formData.course === option.value;
                    return (
                      <div
                        key={option.value}
                        className={`${styles.customDropdownOption} ${isSelected ? styles.isSelected : ''}`}
                        onClick={() => handleSelectCourse(option.value)}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <span>{option.label}</span>
                        {isSelected && (
                          <span className={styles.optionCheckmark}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </span>
                        )}
                      </div>
                    );
                  })}
                  </ScrollableDropdown>
                </div>
              )}
            </div>
            <input type="hidden" name="course" value={formData.course} />
            {fieldErrors.course && <span style={errLabel}>⚠ {fieldErrors.course}</span>}
          </div>

          {/* Choose Teacher Dropdown */}
          <div className={styles.formGroupFull}>
            <div className={styles.customSelectWrapper} ref={teacherRef}>
              <button
                type="button"
                className={`${styles.customSelectTrigger} ${teacherOpen ? styles.isOpen : ''} ${!formData.teacher ? styles.isPlaceholder : ''}`}
                onClick={() => {
                  setTeacherOpen(!teacherOpen);
                  setCourseOpen(false);
                }}
                aria-haspopup="listbox"
                aria-expanded={teacherOpen}
              >
                <span className={styles.selectTriggerContent}>
                  <span className={styles.fieldIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </span>
                  <span>{selectedTeacherObj ? selectedTeacherObj.label : 'Choose Teacher / Department'}</span>
                </span>
                <span className={styles.selectChevron}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </button>

              {teacherOpen && (
                <div
                  className={styles.customDropdownMenu}
                  role="listbox"
                >
                  <ScrollableDropdown onWheel={(e) => e.stopPropagation()}>
                  {TEACHER_OPTIONS.map((option) => {
                    const isSelected = formData.teacher === option.value;
                    return (
                      <div
                        key={option.value}
                        className={`${styles.customDropdownOption} ${isSelected ? styles.isSelected : ''}`}
                        onClick={() => handleSelectTeacher(option.value)}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <span>{option.label}</span>
                        {isSelected && (
                          <span className={styles.optionCheckmark}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </span>
                        )}
                      </div>
                    );
                  })}
                  </ScrollableDropdown>
                </div>
              )}
            </div>
            <input type="hidden" name="teacher" value={formData.teacher} />
            {fieldErrors.teacher && <span style={errLabel}>⚠ {fieldErrors.teacher}</span>}
          </div>

          {/* Message */}
          <div className={styles.formGroupFull}>
            <div className={styles.textareaWithIcon}>
              <span className={styles.textareaFieldIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </span>
              <textarea
                name="message"
                className={styles.formTextarea}
                placeholder="Your message"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className={styles.formGroupFull}>
            {apiError && (
              <p style={{ color: '#dc2626', fontSize: '0.82rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                ⚠ {apiError}
              </p>
            )}
            <button type="submit" className={styles.submitBtn} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
              <span className={styles.submitBtnIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </span>
              <span>{loading ? 'Sending...' : 'Send Your Message'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
