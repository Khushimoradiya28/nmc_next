"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import RankerServices from '@/services/RankerServices';
import styles from './page.module.css';

const FALLBACK_PHOTO = '/assets/toppers/anjali.jpg';


// Rank helper: numeric -> ordinal string (1 -> 1ST, 2 -> 2ND ...)
const toOrdinal = (n) => {
  const num = parseInt(n);
  if (isNaN(num)) return n;
  const s = ["TH", "ST", "ND", "RD"];
  const v = num % 100;
  return `${num}${s[(v - 20) % 10] || s[v] || s[0]}`;
};

// Map a raw API ranker record into the shape the page expects (design unchanged)
const mapRanker = (item) => ({
  academicYear: item.academicYear || '',
  programme: item.programme || '',
  semesterYear: item.semesterYear || '',
  name: item.name || '',
  rankNum: Number(item.rankNum) || 0,
  achievement: item.rankLabel || 'University Rank Holder',
  photo: item.image_url || item.image_webp_url || item.image || FALLBACK_PHOTO,
});

function CustomDropdown({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const menuEl = menuRef.current;
      const onWheel = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = menuEl;
        const maxScroll = scrollHeight - clientHeight;
        if (maxScroll <= 0) return;
        if (e.deltaY < 0 && scrollTop <= 0) { e.preventDefault(); return; }
        if (e.deltaY > 0 && scrollTop >= maxScroll) { e.preventDefault(); return; }
        e.preventDefault();
        e.stopPropagation();
        menuEl.scrollTop = Math.min(Math.max(0, scrollTop + e.deltaY), maxScroll);
      };
      menuEl.addEventListener('wheel', onWheel, { passive: false });
      return () => { menuEl.removeEventListener('wheel', onWheel); };
    }
  }, [isOpen]);
  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };
  return (
    <div className={styles.customDropdown} ref={dropdownRef}>
      <button type="button" className={`${styles.dropdownTrigger} ${isOpen ? styles.dropdownOpen : ''}`} onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-haspopup="listbox">
        <span className={styles.dropdownValue}>{value}</span>
        <svg className={`${styles.dropdownArrow} ${isOpen ? styles.dropdownArrowRotated : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {isOpen && (
        <ul className={styles.dropdownMenu} role="listbox" ref={menuRef}>
          {options.map((option) => (
            <li key={option} className={`${styles.dropdownItem} ${option === value ? styles.dropdownItemActive : ''}`} onClick={() => handleSelect(option)} role="option" aria-selected={option === value}>{option}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Top10Page() {
  const [allRankers, setAllRankers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProgramme, setSelectedProgramme] = useState('All Programmes');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedSem, setSelectedSem] = useState('All Semesters');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCard, setActiveCard] = useState(null);

  // Fetch active rankers from backend once on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await RankerServices.getAllRankers({ page: 1, limit: 1000, status: 'active' });
        const list = res?.data || (Array.isArray(res) ? res : []);
        if (mounted) setAllRankers(Array.isArray(list) ? list.map(mapRanker) : []);
      } catch (err) {
        console.error('Failed to fetch rankers:', err);
        if (mounted) setAllRankers([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Programme options with 'All Programmes'
  const programmes = useMemo(() => {
    const progs = Array.from(new Set(allRankers.map((r) => r.programme).filter(Boolean)));
    return ['All Programmes', ...progs];
  }, [allRankers]);

  // Academic-year options with 'All Years'
  const academicYears = useMemo(() => {
    const years = allRankers
      .filter((r) => selectedProgramme === 'All Programmes' || !selectedProgramme || r.programme === selectedProgramme)
      .map((r) => r.academicYear)
      .filter(Boolean);
    return ['All Years', ...Array.from(new Set(years)).sort((a, b) => b.localeCompare(a))];
  }, [allRankers, selectedProgramme]);

  // If selectedYear is not valid for the selected programme, reset to 'All Years'
  useEffect(() => {
    if (academicYears.length > 0 && !academicYears.includes(selectedYear)) {
      setSelectedYear('All Years');
    }
  }, [academicYears, selectedYear]);

  // Semester options with 'All Semesters'
  const semesterOptions = useMemo(() => {
    const sems = allRankers
      .filter(r => (selectedProgramme === 'All Programmes' || !selectedProgramme || r.programme === selectedProgramme) &&
                   (selectedYear === 'All Years' || !selectedYear || r.academicYear === selectedYear))
      .map(r => r.semesterYear);
    return ['All Semesters', ...Array.from(new Set(sems))];
  }, [allRankers, selectedProgramme, selectedYear]);

  // Reset semester filter if it's no longer valid
  useEffect(() => {
    if (!semesterOptions.includes(selectedSem)) setSelectedSem('All Semesters');
  }, [semesterOptions, selectedSem]);

  const filteredRankings = useMemo(() => {
    return allRankers.filter(row =>
      (selectedProgramme === 'All Programmes' || !selectedProgramme || row.programme === selectedProgramme) &&
      (selectedYear === 'All Years' || !selectedYear || row.academicYear === selectedYear) &&
      (selectedSem === 'All Semesters' || !selectedSem || row.semesterYear === selectedSem) &&
      row.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allRankers, selectedProgramme, selectedYear, selectedSem, searchQuery]);

  // Group filtered results by Semester / Year, each group sorted by rank
  const groupedRankings = useMemo(() => {
    const groups = new Map();
    filteredRankings.forEach(row => {
      if (!groups.has(row.semesterYear)) groups.set(row.semesterYear, []);
      groups.get(row.semesterYear).push(row);
    });
    return Array.from(groups.entries()).map(([sem, rows]) => ({
      sem,
      rows: [...rows].sort((a, b) => a.rankNum - b.rankNum),
    }));
  }, [filteredRankings]);

  const getRankClass = (rankNum) => {
    if (rankNum === 1) return styles.rank1;
    if (rankNum === 2) return styles.rank2;
    if (rankNum === 3) return styles.rank3;
    return styles.rankOther;
  };
  const photoFor = (row) => row.photo || FALLBACK_PHOTO;
  const handleToggleSearch = () => {
    if (isSearchOpen) { setSearchQuery(''); }
    setIsSearchOpen(!isSearchOpen);
  };
  const handleAvatarClick = (row) => {
    const key = `${row.name}-${row.semesterYear}-${row.rankNum}`;
    setActiveCard(activeCard?.key === key ? null : { key, row });
  };

  // Reset semester filter if it's no longer valid for the new programme/year
  useEffect(() => {
    if (!semesterOptions.includes(selectedSem)) setSelectedSem('All Semesters');
  }, [semesterOptions, selectedSem]);

  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh", background: "var(--slate-50)" }}>
        <section className="hero-fullscreen" id="home" style={{ minHeight: "50vh", height: "50vh", background: "#4b5563" }}>
          <div className="hero-bg-image">
            <Image src="/assets/hero/hero-section.png" alt="Rankers Banner" width={1400} height={700} className="hero-bg-img" priority />
          </div>
          <div className="hero-overlay" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.45))" }}></div>
          <div className="hero-content container" style={{ paddingTop: "100px", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", paddingBottom: "80px" }}>
            <h1 className="hero-main-title" style={{ paddingRight: "15px", color: "#fff", margin: "0 0 1rem 0" }}><em>Rankers</em></h1>
            <nav aria-label="breadcrumb">
              <ol style={{ display: "flex", listStyle: "none", padding: 0, margin: 0, gap: "0.5rem", color: "var(--gold-500, #f59e0b)", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                <li><Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Home</Link></li>
                <li style={{ color: "rgba(255,255,255,0.5)" }}>&gt;</li>
                <li><span style={{ color: "rgba(255,255,255,0.7)" }}>Toppers</span></li>
                <li style={{ color: "rgba(255,255,255,0.5)" }}>&gt;</li>
                <li aria-current="page" style={{ color: "var(--gold-500, #f59e0b)" }}>Rankers</li>
              </ol>
            </nav>
          </div>
        </section>

        <section className={`section-padding ${styles.contentSection}`}>
          <div className="container">
            <div className={styles.headerRow}>
              <div className={styles.headerText}>
                <h3 className={styles.sectionTitle} style={{ margin: 0 }}>University <span style={{ color: "#8a0000" }}>Rankers</span></h3>
                <p className={styles.sectionSubtitle} style={{ marginTop: "0.25rem" }}>Browse rank holders by programme and academic year</p>
              </div>
              <div className={`${styles.filterControls} ${isSearchOpen ? styles.searchActive : ''}`}>
                <div className={styles.searchWrapper}>
                  {isSearchOpen && (<input type="text" className={styles.searchInput} placeholder="Search student..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus />)}
                  <button className={styles.searchButton} onClick={handleToggleSearch} title="Search student">
                    {isSearchOpen ? (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>) : (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>)}
                  </button>
                </div>
                <div className={styles.dropdownsGroup}>
                  <CustomDropdown options={programmes} value={selectedProgramme} onChange={setSelectedProgramme} />
                  <CustomDropdown options={academicYears} value={selectedYear} onChange={setSelectedYear} />
                  <CustomDropdown options={semesterOptions} value={selectedSem} onChange={setSelectedSem} />
                </div>
              </div>
            </div>

            {loading ? (
              <div className={styles.noResults}>
                <p className={styles.noResultsText}>Loading university rankers...</p>
              </div>
            ) : filteredRankings.length > 0 ? (
              <div className={styles.groupsWrap}>
                {groupedRankings.map((group) => (
                  <section key={group.sem} className={styles.semGroup}>
                    <div className={styles.semHeader}>
                      <span className={styles.semTitle}>{group.sem}</span>
                      <span className={styles.semCount}>{group.rows.length} {group.rows.length === 1 ? 'Ranker' : 'Rankers'}</span>
                    </div>

                    <div className={styles.rosterGrid}>
                      {group.rows.map((row) => (
                        <div
                          key={`${row.name}-${row.semesterYear}-${row.rankNum}`}
                          className={`${styles.rosterCard} ${row.rankNum <= 3 ? styles.rosterCardTop : ''}`}
                          onClick={() => handleAvatarClick(row)}
                        >
                          <div className={styles.rosterPhoto}>
                            <Image src={photoFor(row)} alt={row.name} fill sizes="(max-width: 768px) 50vw, 240px" style={{ objectFit: 'cover', objectPosition: 'top' }} unoptimized />
                            <span className={`${styles.rankBadge} ${getRankClass(row.rankNum)}`}>
                              <span className={styles.rankBadgeNum}>{row.rankNum}</span>
                              <span className={styles.rankBadgeSuffix}>{toOrdinal(row.rankNum).replace(/\d+/, '')}</span>
                            </span>
                          </div>
                          <div className={styles.rosterInfo}>
                            <span className={styles.studentName}>{row.name}</span>
                            <span className={styles.achievementRow}>
                              <svg className={styles.achievementIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                              </svg>
                              <span className={styles.achievementText}>{row.achievement}</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}

                {activeCard !== null && (
                  <>
                    <div className={styles.mobilePopupBackdrop} onClick={() => setActiveCard(null)} />
                    <div className={styles.mobilePopup}>
                      <div className={styles.mobilePopupImg}>
                        <Image src={photoFor(activeCard.row)} alt={activeCard.row.name} fill style={{ objectFit: 'cover', objectPosition: 'top' }} unoptimized />
                        <span className={styles.mobilePopupRank}>{toOrdinal(activeCard.row.rankNum)}</span>
                      </div>
                      <div className={styles.mobilePopupInfo}>
                        <p className={styles.mobilePopupName}>{activeCard.row.name}</p>
                        <p className={styles.mobilePopupMeta}>{activeCard.row.programme} &bull; {activeCard.row.semesterYear} &bull; {activeCard.row.academicYear}</p>
                        <span className={styles.mobilePopupScore}>{activeCard.row.achievement}</span>
                      </div>
                      <button className={styles.mobilePopupClose} onClick={() => setActiveCard(null)} aria-label="Close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className={styles.noResults}>
                <h3 className={styles.noResultsTitle}>No Rankers Found</h3>
                <p className={styles.noResultsText}>
                  {allRankers.length === 0
                    ? 'Currently, there are no active university rankers to display.'
                    : 'No students match the selected filters. Try choosing different values.'}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
