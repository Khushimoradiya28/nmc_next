'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import FacultyServices from '@/services/FacultyServices';
import styles from './page.module.css';

const resolveImageUrl = (img) => {
  if (!img) return '';
  const clean = String(img).trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
  const backendBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
  const cleanPath = clean.startsWith('/') ? clean : '/' + clean;
  return backendBase + cleanPath;
};

const getInitials = (name) => {
  if (!name) return 'FM';
  const parts = String(name).replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s*/i, '').trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

function FacultyPortrait({ src, name, role, className }) {
  const [imgError, setImgError] = useState(false);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={`${name} - ${role || ''}`}
        className={className}
        onError={() => setImgError(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #8a0000 0%, #b30000 100%)',
      color: '#ffffff',
      fontWeight: 800,
      fontSize: '2.2rem'
    }}>
      {getInitials(name)}
    </div>
  );
}

const formatExp = (exp) => {
  if (!exp) return '1+ Years Experience';
  // Extract strictly the number
  const digits = String(exp).replace(/[^0-9]/g, '').trim();
  const num = digits || '1';
  return `${num}+ Years Experience`;
};

const getItemsPerPage = (width) => {
  if (width > 1280) return 12;
  if (width > 1024) return 9;
  return 6;
};

export default function AcademicPage() {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isCompactPagination, setIsCompactPagination] = useState(false);
  const [activeModalTeacher, setActiveModalTeacher] = useState(null);
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const deptDropdownRef = React.useRef(null);

  // Fetch pure dynamic active faculty from backend API
  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        setLoading(true);
        const res = await FacultyServices.getAllFaculty({ status: 'active', limit: 100 });
        const items = res?.data || (Array.isArray(res) ? res : []);
        if (Array.isArray(items)) {
          const formatted = items.map((item, idx) => {
            const rawImg = item.photo_webp_url || item.photo_url || item.image || item.photo || '';
            let depts = [];
            const rawDept = item.department || item.coursesStreams || item.courses_streams || item.streams || item.courseStreams || '';
            if (Array.isArray(rawDept)) {
              depts = rawDept.map((s) => (typeof s === 'string' ? s : s?.value || s?.label || s?.shortTitle || '')).filter(Boolean);
            } else if (typeof rawDept === 'string' && rawDept.trim()) {
              try {
                const parsed = JSON.parse(rawDept);
                if (Array.isArray(parsed)) {
                  depts = parsed.map((s) => (typeof s === 'string' ? s : s?.value || s?.label || s?.shortTitle || '')).filter(Boolean);
                } else {
                  depts = rawDept.split(',').map((s) => s.trim()).filter(Boolean);
                }
              } catch {
                depts = rawDept.split(',').map((s) => s.trim()).filter(Boolean);
              }
            }

            const rawSpecs = item.specializations || item.areasOfExpertise || item.expertise || [];
            let specs = [];
            if (Array.isArray(rawSpecs)) {
              rawSpecs.forEach((s) => {
                const val = typeof s === 'string' ? s : s?.value || s?.label || '';
                if (val) {
                  // Split each item by comma if present
                  val.split(',').forEach((part) => {
                    const clean = part.trim();
                    if (clean && !specs.includes(clean)) specs.push(clean);
                  });
                }
              });
            } else if (typeof rawSpecs === 'string' && rawSpecs.trim()) {
              rawSpecs.split(',').forEach((part) => {
                const clean = part.trim();
                if (clean && !specs.includes(clean)) specs.push(clean);
              });
            }

            const rawSubjs = item.subjects || item.teachingSubjects || [];
            let subjs = [];
            if (Array.isArray(rawSubjs)) {
              rawSubjs.forEach((s) => {
                const val = typeof s === 'string' ? s : s?.value || s?.label || '';
                if (val) {
                  val.split(',').forEach((part) => {
                    const clean = part.trim();
                    if (clean && !subjs.includes(clean)) subjs.push(clean);
                  });
                }
              });
            } else if (typeof rawSubjs === 'string' && rawSubjs.trim()) {
              rawSubjs.split(',').forEach((part) => {
                const clean = part.trim();
                if (clean && !subjs.includes(clean)) subjs.push(clean);
              });
            }

            return {
              id: item._id || item.slug || item.id || idx,
              name: item.fullName || item.name || 'Faculty Member',
              role: item.designation || item.role || item.badgeTag || item.badge || 'Faculty',
              qualification: item.qualifications || item.qualification || '',
              experience: formatExp(item.experience),
              image: resolveImageUrl(rawImg),
              departments: depts.length > 0 ? depts : ['General'],
              specializations: specs.length > 0 ? specs : (subjs.length > 0 ? subjs : ['Academic Instruction']),
              subjects: subjs,
              bio: item.overview || item.bio || item.biography || item.description || item.quote || 'Dedicated educator conveying insights and guiding academic excellence.',
              achievements: item.keyHighlight || item.highlight || item.achievements || '',
              slug: item.slug || ''
            };
          });
          setFacultyList(formatted);
        }
      } catch (err) {
        console.error('Error fetching dynamic faculty:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, []);

  // Compute dynamic department categories from active faculty
  const dynamicDeptCategories = useMemo(() => {
    const set = new Set();
    facultyList.forEach((fac) => {
      fac.departments.forEach((d) => {
        if (d && d !== 'General') set.add(d);
      });
    });

    const list = [{ value: 'all', label: 'All Departments' }];
    Array.from(set).sort().forEach((d) => {
      list.push({ value: d, label: d });
    });
    return list;
  }, [facultyList]);

  // Keep items-per-page in sync with the grid's column count
  useEffect(() => {
    const syncItemsPerPage = () => {
      setItemsPerPage(getItemsPerPage(window.innerWidth));
      setIsCompactPagination(window.innerWidth <= 768);
    };
    syncItemsPerPage();
    window.addEventListener('resize', syncItemsPerPage);
    return () => window.removeEventListener('resize', syncItemsPerPage);
  }, []);

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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeModalTeacher) {
      document.body.style.overflow = 'hidden';
      if (window.__lenis) window.__lenis.stop();
    } else {
      document.body.style.overflow = '';
      if (window.__lenis) window.__lenis.start();
    }
    return () => {
      document.body.style.overflow = '';
      if (window.__lenis) window.__lenis.start();
    };
  }, [activeModalTeacher]);

  // Compute department counts for interactive badges
  const deptCounts = useMemo(() => {
    const counts = { all: facultyList.length };
    dynamicDeptCategories.forEach((dept) => {
      if (dept.value !== 'all') {
        counts[dept.value] = facultyList.filter((fac) =>
          fac.departments.some((d) => d.toLowerCase().trim() === dept.value.toLowerCase().trim())
        ).length;
      }
    });
    return counts;
  }, [facultyList, dynamicDeptCategories]);

  // Filter faculty members based on selected department and search query
  const filteredFaculty = useMemo(() => {
    return facultyList.filter((faculty) => {
      const isAllDept = !selectedDept || selectedDept === 'all';
      const matchesDept =
        isAllDept ||
        faculty.departments.some(
          (d) =>
            d.toLowerCase().trim() === selectedDept.toLowerCase().trim() ||
            selectedDept.toLowerCase().trim().includes(d.toLowerCase().trim())
        );

      if (!matchesDept) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchName = (faculty.name || '').toLowerCase().includes(q);
      const matchRole = (faculty.role || '').toLowerCase().includes(q);
      const matchQual = (faculty.qualification || '').toLowerCase().includes(q);
      const matchSpec = Array.isArray(faculty.specializations) && faculty.specializations.some((s) => (s || '').toLowerCase().includes(q));
      const matchSubj = Array.isArray(faculty.subjects) && faculty.subjects.some((s) => (s || '').toLowerCase().includes(q));

      return matchName || matchRole || matchQual || matchSpec || matchSubj;
    });
  }, [facultyList, selectedDept, searchQuery]);

  // Total pages calculation
  const totalPages = Math.ceil(filteredFaculty.length / itemsPerPage);

  // Paginated subset of faculty for the active page
  const paginatedFaculty = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFaculty.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFaculty, currentPage, itemsPerPage]);

  const visiblePages = useMemo(() => {
    const allPages = Array.from({ length: totalPages }, (_, i) => i + 1);
    if (!isCompactPagination || totalPages <= 4) return allPages;
    if (currentPage <= 3) return [1, 2, 3, 'gap-end', totalPages];
    if (currentPage >= totalPages - 2) return [1, 'gap-start', totalPages - 2, totalPages - 1, totalPages];
    return [1, 'gap-start', currentPage, 'gap-end', totalPages];
  }, [totalPages, currentPage, isCompactPagination]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const section = document.getElementById('faculty-directory');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main>

        {/* HERO BANNER SECTION */}
        <section className={styles.heroBanner} id="home">
          <div className={styles.heroBgMedia}>
            <Image
              src="/assets/hero/academic-hero-ai.jpg"
              alt="Academic Mentors and College Campus"
              fill
              priority
              unoptimized
              className={styles.heroBgImage}
            />
          </div>
          <div className={styles.heroOverlayGradient}></div>
          <div className={styles.heroOverlayMesh}></div>
          <div className={styles.container}>
            <div className={styles.heroContentContainer}>
              <h1 className={styles.heroTitle}>
                <span className={styles.heroTitleHighlight}>Academic Mentors</span>
              </h1>
            </div>
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

            {/* Senior UI/UX Command Hub */}
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
                      {dynamicDeptCategories.find((d) => d.value === selectedDept)?.label || 'All Departments'}
                      <span className={styles.hubDeptCountText}>({deptCounts[selectedDept] || 0})</span>
                    </span>
                    <svg className={`${styles.hubArrowIcon} ${isDeptOpen ? styles.arrowRotated : ''}`} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  {/* Minimalist Themed Dropdown Menu */}
                  {isDeptOpen && (
                    <div className={styles.customDeptMenu} role="listbox" aria-label="Department Filter Options">
                      <div className={styles.deptMenuList}>
                        {dynamicDeptCategories.map((dept) => {
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
                  {paginatedFaculty.map((fac) => (
                    <article
                      key={fac.id}
                      className={styles.facultyCard}
                      onClick={() => setActiveModalTeacher(fac)}
                    >
                      {/* Portrait Image */}
                      <div className={styles.cardMedia}>
                        <FacultyPortrait
                          src={fac.image}
                          name={fac.name}
                          role={fac.role}
                          className={styles.portraitImg}
                        />
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
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav className={styles.paginationWrap} aria-label="Faculty Directory Pagination">
                    <div className={styles.paginationInner}>
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`${styles.pageBtn} ${styles.pageArrowBtn} ${currentPage === 1 ? styles.pageBtnDisabled : ''}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                        <span className={styles.pageBtnText}>Prev</span>
                      </button>

                      <div className={styles.pageNumberList}>
                        {visiblePages.map((pg, idx) => {
                          if (pg === 'gap-start' || pg === 'gap-end') {
                            return <span key={`gap-${idx}`} className={styles.pageEllipsis}>&hellip;</span>;
                          }
                          const isCurrent = pg === currentPage;
                          return (
                            <button
                              key={pg}
                              type="button"
                              onClick={() => handlePageChange(pg)}
                              className={`${styles.pageBtn} ${styles.pageNumBtn} ${isCurrent ? styles.pageBtnActive : ''}`}
                            >
                              {pg}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`${styles.pageBtn} ${styles.pageArrowBtn} ${currentPage === totalPages ? styles.pageBtnDisabled : ''}`}
                      >
                        <span className={styles.pageBtnText}>Next</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                    </div>
                  </nav>
                )}
              </>
            ) : (
              /* Clean Empty State */
              <div className={styles.emptyStateContainer}>
                <div className={styles.emptyStateIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </div>
                <h3 className={styles.emptyStateTitle}>No Faculty Members Found</h3>
                <p className={styles.emptyStateText}>
                  We couldn&rsquo;t find any professors matching your current search criteria. Try modifying your search keywords or choosing another department.
                </p>
              </div>
            )}

          </div>
        </section>

      </main>

      {/* DETAILED PROFILE MODAL */}
      {activeModalTeacher && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setActiveModalTeacher(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveModalTeacher(null)} className={styles.modalCloseBtn} type="button">
              <svg className={styles.modalCloseIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>

            <div className={styles.modalHeaderRow}>
              <div className={styles.modalMediaWrap}>
                <FacultyPortrait
                  src={activeModalTeacher.image}
                  name={activeModalTeacher.name}
                  role={activeModalTeacher.role}
                  className={styles.modalPortraitImg}
                />
              </div>

              <div className={styles.modalHeaderInfo}>
                <div className={styles.modalHeaderBadges}>
                  {activeModalTeacher.departments.map((dept, i) => (
                    <span key={i} className={styles.modalDeptBadge}>{dept}</span>
                  ))}
                </div>
                <h2 className={styles.modalName}>{activeModalTeacher.name}</h2>
                <div className={styles.modalRole}>{activeModalTeacher.role}</div>
                <div className={styles.modalQual}>{activeModalTeacher.qualification}</div>
              </div>
            </div>

            <div className={styles.modalBody}>
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

              <div className={styles.modalSectionBlock}>
                <h4 className={styles.modalSectionTitle}>Academic Overview &amp; Biography</h4>
                <p className={styles.modalBioText}>{activeModalTeacher.bio}</p>
              </div>

              <div className={styles.modalSectionBlock}>
                <h4 className={styles.modalSectionTitle}>Areas of Expertise &amp; Subjects</h4>
                <div className={styles.modalSubjectTags}>
                  {Array.from(new Set([
                    ...(activeModalTeacher.specializations || []),
                    ...(activeModalTeacher.subjects || [])
                  ])).filter(Boolean).map((tag, i) => (
                    <span key={i} className={styles.modalSubjectTag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {activeModalTeacher.achievements && (
                <div className={styles.modalAchievementBox}>
                  <span className={styles.modalAchieveIcon}>
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
