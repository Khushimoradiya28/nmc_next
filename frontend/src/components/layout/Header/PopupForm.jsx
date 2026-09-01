"use client";

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import styles from './PopupForm.module.css';
import ContactServices from '@/services/ContactServices';
import CourseServices from '@/services/CourseServices';

// Custom Select Component
function CustomSelect({ name, value, onChange, options = [], placeholder, icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const triggerRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
        zIndex: 10000,
      });
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

  return (
    <div className={styles.customSelect} ref={selectRef}>
      <button
        type="button"
        ref={triggerRef}
        className={`${styles.selectTrigger} ${isOpen ? styles.selectOpen : ''} ${value ? styles.selectHasValue : ''}`}
        onClick={toggleDropdown}
      >
        <span className={styles.selectIcon}>{icon}</span>
        <span className={styles.selectText}>{selectedLabel}</span>
        <span className={`${styles.selectArrow} ${isOpen ? styles.selectArrowUp : ''}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>

      {isOpen && (
        <div
          className={styles.selectDropdown}
          style={dropdownStyle}
          onWheel={(e) => e.stopPropagation()}
        >
          <div
            className={styles.selectOptions}
            onWheel={(e) => {
              const el = e.currentTarget;
              const isScrollable = el.scrollHeight > el.clientHeight;
              if (isScrollable) {
                const isAtTop = el.scrollTop === 0 && e.deltaY < 0;
                const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight && e.deltaY > 0;
                if (!isAtTop && !isAtBottom) {
                  e.stopPropagation();
                }
              }
              e.stopPropagation();
            }}
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={`${styles.selectOption} ${value === option.value ? styles.selectOptionActive : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

const teacherOptions = [
  { value: 'General Inquiry & Helpdesk', label: 'General Inquiry & Helpdesk' },
  { value: 'Admission Department', label: 'Admission Department' },
  { value: 'Principal Office', label: 'Principal Office' },
];

export default function PopupForm() {
  const [courseOptions, setCourseOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    reason: '',
    course: '',
    website: '',
    teacher: '',
    message: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  // Load dynamic courses from backend API
  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await CourseServices.getCourseDropdown();
        if (res && res.data && Array.isArray(res.data)) {
          const mapped = res.data.map(item => ({
            value: item.display_label || item.full_title || item.title,
            label: item.display_label || item.full_title || item.title,
          }));
          setCourseOptions(mapped);
        }
      } catch (err) {
        console.error("Failed to load popup courses:", err);
      }
    }
    loadCourses();
  }, []);

  // Open popup 7 seconds after every page navigation
  useEffect(() => {
    setIsOpen(false);
    setSubmitted(false);
    setFieldErrors({});

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 7000);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Listen for custom event to open popup from anywhere
  useEffect(() => {
    const handleOpenPopup = () => {
      setIsOpen(true);
      setSubmitted(false);
      setFieldErrors({});
    };
    window.addEventListener('openContactPopup', handleOpenPopup);
    return () => window.removeEventListener('openContactPopup', handleOpenPopup);
  }, []);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: cleaned }));
      if (fieldErrors[name]) {
        setFieldErrors(prev => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
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
        source: 'modal',
      });
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: '', phone: '', email: '', reason: '', course: '', website: '', teacher: '', message: '' });
        setSubmitted(false);
        setIsOpen(false);
      }, 4000);
    } catch (err) {
      console.error("Popup submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const errLabel = {
    display: 'block',
    color: '#dc2626',
    fontSize: '0.72rem',
    fontWeight: 600,
    marginTop: '0.25rem',
    textAlign: 'left',
  };

  if (!isOpen) return null;

  return (
    <div className={styles.popupOverlay} onClick={closePopup}>
      <div className={styles.popupWrapper} onClick={(e) => e.stopPropagation()}>
        {/* Left Side Image */}
        <div className={styles.popupImageSide}>
          <Image
            src="/assets/modal-img.webp"
            alt=""
            fill
            sizes="240px"
            className={styles.popupImage}
            priority
          />
        </div>

        {/* Right Side Form */}
        <div className={styles.popupFormSide}>
          {/* Close Button */}
          <button className={styles.closeBtn} onClick={closePopup} aria-label="Close popup form">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {submitted ? (
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3>Message Sent Successfully!</h3>
              <p>Once we receive your information our representative will get back to you within 24 hours.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className={styles.popupHeader}>
                <div className={styles.headerIconTitle}>
                  <div className={styles.mortarboardIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                      <path d="M6 12v5c0 0 2.5 3 6 3s6-3 6-3v-5"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className={styles.popupTitle}>Please Fill the Form below.</h2>
                    <p className={styles.popupSubtext}>
                      Once we receive your information our representative will get back to you within 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className={styles.popupForm} noValidate>
                <div className={styles.formGrid}>
                  {/* Row 1 Left: Full Name */}
                  <div className={styles.formGroup}>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </span>
                      <input
                        type="text"
                        name="name"
                        className={styles.formInput}
                        placeholder="Your name here..."
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    {fieldErrors.name && <span style={errLabel}>⚠ {fieldErrors.name}</span>}
                  </div>

                  {/* Row 1 Right: Phone Number */}
                  <div className={styles.formGroup}>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        className={styles.formInput}
                        placeholder="Your phone number here..."
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={10}
                      />
                    </div>
                    {fieldErrors.phone && <span style={errLabel}>⚠ {fieldErrors.phone}</span>}
                  </div>

                  {/* Row 2 Left: Email Address */}
                  <div className={styles.formGroup}>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </span>
                      <input
                        type="email"
                        name="email"
                        className={styles.formInput}
                        placeholder="Enter your Email ..."
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    {fieldErrors.email && <span style={errLabel}>⚠ {fieldErrors.email}</span>}
                  </div>

                  {/* Row 2 Right: Reason */}
                  <div className={styles.formGroup}>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>
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
                        placeholder="Reason contacting us ..."
                        value={formData.reason}
                        onChange={handleChange}
                      />
                    </div>
                    {fieldErrors.reason && <span style={errLabel}>⚠ {fieldErrors.reason}</span>}
                  </div>

                  {/* Row 3 Left: Choose Course - Custom Select */}
                  <div className={styles.formGroup}>
                    <CustomSelect
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      options={courseOptions}
                      placeholder="Chose Course"
                      icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                        </svg>
                      }
                    />
                    {fieldErrors.course && <span style={errLabel}>⚠ {fieldErrors.course}</span>}
                  </div>

                  {/* Row 3 Right: Website */}
                  <div className={styles.formGroup}>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>
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
                        placeholder="Enter your Website ..."
                        value={formData.website}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Row 4: Choose Teacher - Custom Select (Full Width) */}
                  <div className={styles.formGroupFull}>
                    <CustomSelect
                      name="teacher"
                      value={formData.teacher}
                      onChange={handleChange}
                      options={teacherOptions}
                      placeholder="Chose Teacher"
                      icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      }
                    />
                    {fieldErrors.teacher && <span style={errLabel}>⚠ {fieldErrors.teacher}</span>}
                  </div>

                  {/* Row 5: Message (Full Width) */}
                  <div className={styles.formGroupFull}>
                    <div className={styles.textareaWrapper}>
                      <span className={styles.textareaIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                      </span>
                      <textarea
                        name="message"
                        className={styles.formTextarea}
                        placeholder="Your message..."
                        value={formData.message}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>

                  {/* Row 6: Submit Button */}
                  <div className={styles.formGroupFull}>
                    <button type="submit" className={styles.submitBtn} disabled={loading}>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
