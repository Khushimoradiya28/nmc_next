"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';

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

  const [courseOpen, setCourseOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectCourse = (value) => {
    setFormData({ ...formData, course: value });
    setCourseOpen(false);
  };

  const handleSelectTeacher = (value) => {
    setFormData({ ...formData, teacher: value });
    setTeacherOpen(false);
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
                <span>{selectedCourseObj ? selectedCourseObj.label : 'Choose Course'}</span>
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
                  onWheel={(e) => e.stopPropagation()}
                >
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
                </div>
              )}
            </div>
            <input type="hidden" name="course" value={formData.course} />
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
                <span>{selectedTeacherObj ? selectedTeacherObj.label : 'Choose Teacher / Department'}</span>
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
                  onWheel={(e) => e.stopPropagation()}
                >
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
                </div>
              )}
            </div>
            <input type="hidden" name="teacher" value={formData.teacher} />
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
