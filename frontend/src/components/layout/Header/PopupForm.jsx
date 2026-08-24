"use client";

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import styles from './PopupForm.module.css';

// Custom Select Component
function CustomSelect({ name, value, onChange, options, placeholder, icon }) {
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

const courseOptions = [
  { value: 'bba', label: 'BBA (Bachelor of Business Administration)' },
  { value: 'bca', label: 'BCA (Bachelor of Computer Application)' },
  { value: 'ba', label: 'BA (Bachelor of Arts)' },
  { value: 'bcom', label: 'B.Com (Bachelor of Commerce)' },
  { value: 'ma', label: 'MA (Master of Arts)' },
  { value: 'mcom', label: 'M.Com (Master of Commerce)' },
  { value: 'msw', label: 'MSW (Master of Social Work)' },
  { value: 'dfd', label: 'Diploma in Fashion Designing (DFD/CFD)' },
  { value: 'dnys', label: 'Diploma in Naturopathy (DNYS)' },
];

const teacherOptions = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'admission', label: 'Admission Department' },
  { value: 'principal', label: 'Principal Office' },
];

export default function PopupForm() {
  const [isOpen, setIsOpen] = useState(false);
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
  const pathname = usePathname();

  // Open popup 7 seconds after every page navigation
  useEffect(() => {
    setIsOpen(false);
    setSubmitted(false);

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.firstName && formData.message) {
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ firstName: '', lastName: '', website: '', reason: '', course: '', teacher: '', message: '' });
        setSubmitted(false);
        setIsOpen(false);
      }, 4000);
    }
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
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h4>Message Sent Successfully!</h4>
              <p>Our representative will get back to you within 24 hours.</p>
            </div>
          ) : (
            <>
              {/* Header with Graduation Cap */}
              <div className={styles.popupHeader}>
                <div className={styles.headerRow}>
                  <div className={styles.capIcon}>
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#8a0000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

              <form onSubmit={handleSubmit} className={styles.popupForm}>
                <div className={styles.formGrid}>
                  {/* First Name */}
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
                        name="firstName"
                        className={styles.formInput}
                        placeholder="Your First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Last Name */}
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
                        name="lastName"
                        className={styles.formInput}
                        placeholder="Your Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Website */}
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
                        placeholder="Enter your Website"
                        value={formData.website}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Reason */}
                  <div className={styles.formGroup}>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>
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
                  </div>

                  {/* Choose Course - Custom Select */}
                  <div className={styles.formGroupFull}>
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
                  </div>

                  {/* Choose Teacher - Custom Select */}
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
                  </div>

                  {/* Message */}
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
                        placeholder="Your message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
