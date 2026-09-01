"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import ContactServices from '@/services/ContactServices';
import CourseServices from '@/services/CourseServices';

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

const TEACHER_OPTIONS = [
  { value: 'General Inquiry & Helpdesk', label: 'General Inquiry & Helpdesk' },
  { value: 'Admission Department', label: 'Admission Department' },
  { value: 'Principal Office', label: 'Principal Office' },
  { value: 'BCA & IT Department Faculty', label: 'BCA & IT Department Faculty' },
  { value: 'BBA & Management Faculty', label: 'BBA & Management Faculty' },
  { value: 'B.Com & M.Com Faculty', label: 'B.Com & M.Com Faculty' },
  { value: 'B.A. & M.A. Arts Faculty', label: 'B.A. & M.A. Arts Faculty' },
  { value: 'MSW Social Work Faculty', label: 'MSW Social Work Faculty' },
];

export default function ContactForm() {
  const router = useRouter();
  const [courseOptions, setCourseOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    reason: '',
    course: '',
    website: '',
    teacher: '',
    message: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [courseOpen, setCourseOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const courseRef = useRef(null);
  const teacherRef = useRef(null);

  // Load live courses from API
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
        console.error("Failed to load courses for contact form:", err);
      }
    }
    loadCourses();
  }, []);

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
    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: cleaned }));
      if (fieldErrors[name]) setFieldErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const handleSelectCourse = (value) => {
    setFormData(prev => ({ ...prev, course: value }));
    if (fieldErrors.course) setFieldErrors(prev => { const n = { ...prev }; delete n.course; return n; });
    setCourseOpen(false);
  };

  const handleSelectTeacher = (value) => {
    setFormData(prev => ({ ...prev, teacher: value }));
    if (fieldErrors.teacher) setFieldErrors(prev => { const n = { ...prev }; delete n.teacher; return n; });
    setTeacherOpen(false);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Validate mandatory fields with safe variable extraction
    const errors = {};
    const nameVal = (formData.name || '').trim();
    const phoneVal = (formData.phone || '').trim();
    const emailVal = (formData.email || '').trim();
    const reasonVal = (formData.reason || '').trim();
    const courseVal = formData.course || '';
    const teacherVal = formData.teacher || '';
    const messageVal = (formData.message || '').trim();

    if (!nameVal) {
      errors.name = 'Full name is required.';
    }
    if (!phoneVal) {
      errors.phone = 'Phone number is required.';
    } else if (!/^[6-9]\d{9}$/.test(phoneVal)) {
      errors.phone = 'Phone number must be 10 digits starting with 6, 7, 8, or 9.';
    }

    if (!emailVal) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!reasonVal) {
      errors.reason = 'Reason is required.';
    }
    if (!courseVal) {
      errors.course = 'Please select a course.';
    }
    if (!teacherVal) {
      errors.teacher = 'Please select a teacher/department.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setApiError('');
    setLoading(true);
    try {
      await ContactServices.submitInquiry({
        name: nameVal,
        first_name: nameVal,
        phone: phoneVal,
        email: emailVal,
        reason: reasonVal,
        course: courseVal,
        website: (formData.website || '').trim(),
        teacher: teacherVal,
        message: messageVal,
        source: 'page',
      });
      setFormData({ name: '', phone: '', email: '', reason: '', course: '', website: '', teacher: '', message: '' });
      router.push('/thank-you');
    } catch (err) {
      setApiError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const errLabel = { display: 'block', color: '#dc2626', fontSize: '0.76rem', fontWeight: 600, marginTop: '0.3rem' };

  const selectedCourseObj = courseOptions.find(c => c.value === formData.course);
  const selectedTeacherObj = TEACHER_OPTIONS.find(t => t.value === formData.teacher);

  return (
    <div className={styles.formArea}>
      <h2 className={styles.formHeading}>Please Fill the Form below.</h2>
      <p className={styles.formSubtext}>
        Once we receive your information our representative will get back to you within 24 hours.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formGrid}>
          {/* Row 1 Left: Full Name */}
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
                name="name"
                className={styles.formInput}
                placeholder="Your Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            {fieldErrors.name && <span style={errLabel}>⚠ {fieldErrors.name}</span>}
          </div>

          {/* Row 1 Right: Phone Number */}
          <div className={styles.formGroup}>
            <div className={styles.inputWithIcon}>
              <span className={styles.fieldIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </span>
              <input
                type="tel"
                name="phone"
                className={styles.formInput}
                placeholder="Your Phone Number"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
              />
            </div>
            {fieldErrors.phone && <span style={errLabel}>⚠ {fieldErrors.phone}</span>}
          </div>

          {/* Row 2 Left: Email Address */}
          <div className={styles.formGroup}>
            <div className={styles.inputWithIcon}>
              <span className={styles.fieldIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input
                type="email"
                name="email"
                className={styles.formInput}
                placeholder="Your Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {fieldErrors.email && <span style={errLabel}>⚠ {fieldErrors.email}</span>}
          </div>

          {/* Row 2 Right: Reason */}
          <div className={styles.formGroup}>
            <div className={styles.inputWithIcon}>
              <span className={styles.fieldIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
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

          {/* Row 3 Left: Choose Course Dropdown */}
          <div className={styles.formGroup}>
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
                  {courseOptions.map((option) => {
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

          {/* Row 3 Right: Website */}
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

          {/* Row 4: Choose Teacher Dropdown (Full Width) */}
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

          {/* Row 5: Message (Full Width) */}
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

          {/* Row 6: Submit Button */}
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
