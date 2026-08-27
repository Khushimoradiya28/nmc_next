"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import { ALL_FACULTY, DEPARTMENT_CATEGORIES } from '@/data/facultyData';
import styles from './page.module.css';

const ITEMS_PER_PAGE = 16; // 4 rows x 4 items per row on desktop layout

export default function AcademicPage() {
  const [selectedDept, setSelectedDept] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModalTeacher, setActiveModalTeacher] = useState(null);
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const deptDropdownRef = React.useRef(null);
  const searchInputRef = React.useRef(null);

  // Close department dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(event.target)) {
        setIsDeptOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Lock body scroll and prevent Lenis interference when modal is open
  useEffect(() => {
    if (activeModalTeacher) {
      document.body.style.overflow = 'hidden';
      if (window.__lenis) {
        window.__lenis.stop();
      }
    } else {
      document.body.style.overflow = '';
      if (window.__lenis) {
        window.__lenis.start();
      }
    }
    return () => {
      document.body.style.overflow = '';
      if (window.__lenis) {
        window.__lenis.start();
      }
    };
  }, [activeModalTeacher]);

  // Compute department counts for interactive badges
  const deptCounts = useMemo(() => {
    const counts = { all: ALL_FACULTY.length };
    DEPARTMENT_CATEGORIES.forEach(dept => {
      if (dept.value !== 'all') {
        counts[dept.value] = ALL_FACULTY.filter(fac => fac.departments.includes(dept.value)).length;
      }
    });
    return counts;
  }, []);

  // Filter faculty members based on selected department and search query
  const filteredFaculty = useMemo(() => {
    return ALL_FACULTY.filter(faculty => {
      const matchesDept = selectedDept === 'all' || faculty.departments.includes(selectedDept);

      if (!matchesDept) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchName = faculty.name.toLowerCase().includes(q);
      const matchRole = faculty.role.toLowerCase().includes(q);
      const matchQual = faculty.qualification.toLowerCase().includes(q);
      const matchSpec = faculty.specializations.some(s => s.toLowerCase().includes(q));
      const matchSubj = faculty.subjects ? faculty.subjects.some(s => s.toLowerCase().includes(q)) : false;

      return matchName || matchRole || matchQual || matchSpec || matchSubj;
    });
  }, [selectedDept, searchQuery]);

  // Total pages calculation
  const totalPages = Math.ceil(filteredFaculty.length / ITEMS_PER_PAGE);

  // Paginated subset of faculty for the active page
  const paginatedFaculty = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFaculty.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredFaculty, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const section = document.getElementById('faculty-directory');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleResetFilters = () => {
    setSelectedDept('all');
    setSearchQuery('');
    setIsSearchActive(false);
    setCurrentPage(1);
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main>

        {/* HERO BANNER SECTION */}
        <section className="hero-fullscreen" id="home" style={{ minHeight: "50vh", height: "50vh" }}>
          <div className="hero-bg-image">
            <Image
              src="/assets/hero/academic-hero-ai.jpg"
              alt="Academic Mentors and College Campus"
              fill
              priority
              unoptimized
              className="hero-bg-img"
            />
          </div>
          <div className="hero-overlay" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))" }}></div>
          <div className="hero-content container" style={{ paddingTop: "100px", display: "flex", alignItems: "flex-end", height: "100%", paddingBottom: "80px" }}>
            <h1 className="hero-main-title"><em>Academic Mentors</em></h1>
          </div>
        </section>

        {/* FACULTY DIRECTORY SPOTLIGHT */}
        <section className={styles.facultySection} id="faculty-directory">
          <div className={styles.container}>

            {/* Section Header */}
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>Academic Leadership &amp; Mentors</div>
              <h2 className={styles.sectionTitle}>
                Distinguished <span>Professors &amp; Faculty</span>
              </h2>
              <p className={styles.sectionDescription}>
                Explore the complete directory of our esteemed professors, department heads, and academic leaders dedicated to fostering student excellence.
              </p>
            </div>

            {/* Senior UI/UX Pro Command Hub (Search + Department Filter) */}
            <div className={styles.commandHubWrapper}>
              <div className={styles.commandHubBar}>

                {/* Left: Instant Directory Search */}
                <div className={styles.hubSearchSection}>
                  <svg className={styles.hubSearchIcon} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by faculty name, qualification, subject..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className={styles.hubSearchInput}
                    aria-label="Search faculty directory"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
                      className={styles.hubSearchClearBtn}
                      aria-label="Clear search query"
                      title="Clear search"
                    >
                      &times;
                    </button>
                  )}
                </div>

                {/* Vertical Divider */}
                <div className={styles.hubDivider} aria-hidden="true" />

                {/* Right: Themed Department Dropdown Trigger */}
                <div className={styles.hubDeptSection} ref={deptDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDeptOpen(!isDeptOpen)}
                    className={`${styles.hubDeptTrigger} ${isDeptOpen ? styles.triggerActive : ''}`}
                    aria-expanded={isDeptOpen}
                    aria-haspopup="listbox"
                    aria-label="Filter faculty by department"
                  >
                    <span className={styles.hubDeptLabelText}>
                      {DEPARTMENT_CATEGORIES.find(d => d.value === selectedDept)?.label || 'All Departments'}
                      <span className={styles.hubDeptCountText}>({deptCounts[selectedDept] || 0})</span>
                    </span>
                    <svg className={`${styles.hubArrowIcon} ${isDeptOpen ? styles.arrowRotated : ''}`} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  {/* Minimalist Themed Dropdown Menu */}
                  {isDeptOpen && (
                    <div
                      className={styles.customDeptMenu}
                      role="listbox"
                      aria-label="Department Filter Options"
                      data-lenis-prevent="true"
                      onWheel={(e) => e.stopPropagation()}
                      onTouchMove={(e) => e.stopPropagation()}
                    >
                      <div
                        className={styles.deptMenuList}
                        data-lenis-prevent="true"
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                      >
                        {DEPARTMENT_CATEGORIES.map((dept) => {
                          const isSelected = selectedDept === dept.value;
                          const count = deptCounts[dept.value] || 0;
                          return (
                            <button
                              key={dept.value}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => {
                                setSelectedDept(dept.value);
                                setCurrentPage(1);
                                setIsDeptOpen(false);
                              }}
                              className={`${styles.deptMenuItem} ${isSelected ? styles.deptMenuItemActive : ''}`}
                            >
                              <span className={styles.itemLabel}>
                                {dept.label}
                                <span className={`${styles.itemCountText} ${isSelected ? styles.itemCountTextActive : ''}`}>
                                  ({count})
                                </span>
                              </span>
                              {isSelected && (
                                <svg className={styles.activeCheckIcon} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Faculty Directory Cards Grid */}
            {filteredFaculty.length > 0 ? (
              <>
                <div className={styles.facultyGrid}>
                  {paginatedFaculty.map((fac) => {
                    const badgeClass =
                      fac.badgeType === 'ruby'
                        ? styles.badgeRuby
                        : fac.badgeType === 'gold'
                          ? styles.badgeGold
                          : fac.badgeType === 'azure'
                            ? styles.badgeAzure
                            : styles.badgePurple;

                    return (
                      <article
                        key={fac.id}
                        className={styles.facultyCard}
                        onClick={() => setActiveModalTeacher(fac)}
                      >
                        {/* Portrait Image & Floating Badges */}
                        <div className={styles.cardMedia}>
                          <Image
                            src={fac.image}
                            alt={`${fac.name} - ${fac.role}`}
                            fill
                            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            className={styles.portraitImg}
                          />
                          <span className={`${styles.cardRoleBadge} ${badgeClass}`}>
                            {fac.badge}
                          </span>
                        </div>

                        {/* Card Content Information */}
                        <div className={styles.cardContent}>
                          <span className={styles.cardRole}>{fac.role}</span>
                          <h3 className={styles.cardName}>{fac.name}</h3>
                          <p className={styles.cardQual}>{fac.qualification}</p>

                          {/* Micro Specialization Tags */}
                          <div className={styles.cardSpecTags}>
                            {fac.specializations.slice(0, 3).map((spec, idx) => (
                              <span key={idx} className={styles.cardSpecTag}>
                                {spec}
                              </span>
                            ))}
                          </div>

                          {/* Card Footer */}
                          <div className={styles.cardFooterRow}>
                            <span className={styles.cardExp}>{fac.experience}</span>
                            <button
                              type="button"
                              className={styles.viewProfileTrigger}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveModalTeacher(fac);
                              }}
                              aria-label={`View profile for ${fac.name}`}
                            >
                              Details
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Modern Luxury Pagination Bar */}
                {totalPages > 1 && (
                  <div className={styles.paginationWrapper}>
                    <div className={styles.paginationInfo}>
                      Showing <span>{(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredFaculty.length)}</span> of <span>{filteredFaculty.length}</span> Faculty Members
                    </div>

                    <div className={styles.paginationControls}>
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`${styles.pageNavBtn} ${currentPage === 1 ? styles.pageNavDisabled : ''}`}
                        aria-label="Previous page"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                      </button>

                      <div className={styles.pageNumbers}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                          <button
                            key={pg}
                            type="button"
                            onClick={() => handlePageChange(pg)}
                            className={`${styles.pageNumBtn} ${pg === currentPage ? styles.activePageBtn : ''}`}
                            aria-label={`Page ${pg}`}
                          >
                            {pg}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`${styles.pageNavBtn} ${currentPage === totalPages ? styles.pageNavDisabled : ''}`}
                        aria-label="Next page"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className={styles.emptyStateContainer}>
                <div className={styles.emptyStateIcon}>ðŸ”Â</div>
                <h3 className={styles.emptyStateTitle}>No Faculty Members Found</h3>
                <p className={styles.emptyStateText}>
                  We couldn&rsquo;t find any professors matching your current search criteria. Try modifying your search keywords or choosing another department.
                </p>
                <button onClick={handleResetFilters} className={styles.emptyStateActionBtn}>
                  Show All Faculty Members
                </button>
              </div>
            )}

          </div>
        </section>

      </main>

      {/* INTERACTIVE FULL PROFILE MODAL */}
      {activeModalTeacher && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setActiveModalTeacher(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="faculty-modal-title"
          data-lenis-prevent
        >
          <div
            className={styles.modalDialog}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalTeacher(null)}
              className={styles.modalCloseBtn}
              aria-label="Close profile modal"
            >
              &times;
            </button>

            {/* Modal Header Row */}
            <div className={styles.modalHeaderRow}>
              <div className={styles.modalMediaWrap}>
                <Image
                  src={activeModalTeacher.image}
                  alt={activeModalTeacher.name}
                  fill
                  className={styles.modalPortraitImg}
                />
              </div>

              <div className={styles.modalHeaderInfo}>
                <div className={styles.modalHeaderBadges}>
                  {activeModalTeacher.departments.map((dept, i) => (
                    <span key={i} className={styles.modalDeptBadge}>{dept}</span>
                  ))}
                </div>
                <h2 id="faculty-modal-title" className={styles.modalName}>
                  {activeModalTeacher.name}
                </h2>
                <div className={styles.modalRole}>{activeModalTeacher.role}</div>
                <div className={styles.modalQual}>{activeModalTeacher.qualification}</div>
              </div>
            </div>

            {/* Modal Body */}
            <div className={styles.modalBody}>

              {/* Meta Grid */}
              <div className={styles.modalMetaGrid}>
                <div className={styles.modalMetaCard}>
                  <span className={styles.modalMetaLabel}>Teaching Experience</span>
                  <span className={styles.modalMetaValue}>{activeModalTeacher.experience}</span>
                </div>
                <div className={styles.modalMetaCard}>
                  <span className={styles.modalMetaLabel}>Department Streams</span>
                  <span className={styles.modalMetaValue}>{activeModalTeacher.departments.join(', ')}</span>
                </div>
              </div>

              {/* Biography Section */}
              <div className={styles.modalSectionBlock}>
                <h4 className={styles.modalSectionTitle}>Academic Overview &amp; Biography</h4>
                <p className={styles.modalBioText}>{activeModalTeacher.bio}</p>
              </div>

              {/* Specializations */}
              <div className={styles.modalSectionBlock}>
                <h4 className={styles.modalSectionTitle}>Areas of Expertise &amp; Subjects</h4>
                <div className={styles.modalSubjectTags}>
                  {activeModalTeacher.specializations.map((spec, i) => (
                    <span key={i} className={styles.modalSubjectTag}>{spec}</span>
                  ))}
                  {activeModalTeacher.subjects && activeModalTeacher.subjects.map((subj, i) => (
                    <span key={`sub-${i}`} className={styles.modalSubjectTag}>{subj}</span>
                  ))}
                </div>
              </div>

              {/* Accolades & Research */}
              {activeModalTeacher.achievements && (
                <div className={styles.modalAchievementBox}>
                  <span className={styles.modalAchieveIcon} aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                      <path d="M4 22h16"></path>
                      <path d="M10 14.66V17c0 .55-.45 1-1 1H7"></path>
                      <path d="M14 14.66V17c0 .55.45 1 1 1h2"></path>
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                    </svg>
                  </span>
                  <p className={styles.modalAchieveText}>
                    <strong>Key Highlight:</strong> {activeModalTeacher.achievements}
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}