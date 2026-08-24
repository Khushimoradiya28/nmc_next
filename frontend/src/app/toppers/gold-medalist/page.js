"use client";
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import styles from './page.module.css';

const allMedalists = [
  { name: "Anjali K. Gohil", course: "BCA", year: "2025", cgpa: "9.68", photo: "/assets/toppers/anjali.jpg" },
  { name: "Krina G. Shah", course: "BCA", year: "2024", cgpa: "9.30", photo: "/assets/toppers/priya.jpg" },
  { name: "Priya R. Mori", course: "BBA", year: "2024", cgpa: "9.52", photo: "/assets/toppers/priya.jpg" },
  { name: "Meera D. Bhatt", course: "B.COM", year: "2024", cgpa: "9.45", photo: "/assets/toppers/meera.jpg" },
  { name: "Dhara M. Mehta", course: "M.COM", year: "2025", cgpa: "9.18", photo: "/assets/toppers/anjali.jpg" },
  { name: "Vidhi N. Pathak", course: "BA", year: "2025", cgpa: "9.15", photo: "/assets/toppers/meera.jpg" },
  { name: "Pooja V. Rathod", course: "MA", year: "2024", cgpa: "8.98", photo: "/assets/toppers/priya.jpg" },
  { name: "Neha S. Gohil", course: "MSW", year: "2025", cgpa: "9.20", photo: "/assets/toppers/anjali.jpg" },
  { name: "Kinjal B. Parmar", course: "DFD & CFD", year: "2024", cgpa: "9.40", photo: "/assets/toppers/meera.jpg" },
  { name: "Bhakti R. Dave", course: "DNYS", year: "2025", cgpa: "9.10", photo: "/assets/toppers/priya.jpg" },
  { name: "Riya K. Patel", course: "BCA", year: "2025", cgpa: "9.55", photo: "/assets/toppers/anjali.jpg" },
  { name: "Shruti M. Shah", course: "BBA", year: "2024", cgpa: "9.22", photo: "/assets/toppers/meera.jpg" },
  { name: "Nidhi V. Desai", course: "B.COM", year: "2025", cgpa: "9.38", photo: "/assets/toppers/priya.jpg" },
  { name: "Foram S. Joshi", course: "M.COM", year: "2024", cgpa: "9.05", photo: "/assets/toppers/anjali.jpg" },
  { name: "Kavya R. Trivedi", course: "MA", year: "2025", cgpa: "9.12", photo: "/assets/toppers/meera.jpg" },
  { name: "Hiral N. Patel", course: "BA", year: "2024", cgpa: "9.00", photo: "/assets/toppers/priya.jpg" },
  { name: "Disha K. Mehta", course: "MSW", year: "2025", cgpa: "9.25", photo: "/assets/toppers/anjali.jpg" },
  { name: "Mansi P. Vora", course: "DFD & CFD", year: "2024", cgpa: "9.48", photo: "/assets/toppers/meera.jpg" },
  { name: "Tanvi A. Rao", course: "DNYS", year: "2025", cgpa: "9.08", photo: "/assets/toppers/priya.jpg" },
  { name: "Kruti J. Shah", course: "BCA", year: "2024", cgpa: "9.60", photo: "/assets/toppers/anjali.jpg" },
  { name: "Prachi D. Thakkar", course: "BBA", year: "2025", cgpa: "9.35", photo: "/assets/toppers/meera.jpg" },
  { name: "Jalpa M. Gohil", course: "B.COM", year: "2024", cgpa: "9.42", photo: "/assets/toppers/priya.jpg" },
  { name: "Swati N. Parmar", course: "M.COM", year: "2025", cgpa: "9.17", photo: "/assets/toppers/anjali.jpg" },
  { name: "Foram R. Patel", course: "BA", year: "2024", cgpa: "9.03", photo: "/assets/toppers/meera.jpg" },
  { name: "Drashti K. Dave", course: "MA", year: "2025", cgpa: "9.28", photo: "/assets/toppers/priya.jpg" },
  { name: "Muskan A. Shah", course: "MSW", year: "2024", cgpa: "9.14", photo: "/assets/toppers/anjali.jpg" },
  { name: "Pooja K. Raval", course: "DFD & CFD", year: "2025", cgpa: "9.50", photo: "/assets/toppers/meera.jpg" },
  { name: "Khushi M. Modi", course: "DNYS", year: "2024", cgpa: "9.06", photo: "/assets/toppers/priya.jpg" },
  { name: "Urvi S. Bhavsar", course: "BCA", year: "2025", cgpa: "9.72", photo: "/assets/toppers/anjali.jpg" },
  { name: "Riddhi N. Kapadia", course: "BBA", year: "2024", cgpa: "9.33", photo: "/assets/toppers/meera.jpg" },
  { name: "Sonal R. Trivedi", course: "B.COM", year: "2025", cgpa: "9.46", photo: "/assets/toppers/priya.jpg" },
];

const departments = ["All Departments", "BA", "MA", "B.COM", "M.COM", "BCA", "BBA", "MSW", "DFD & CFD", "DNYS"];
const years = ["All Years", "2025", "2024"];

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


export default function GoldMedalistPage() {
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const filteredMedalists = allMedalists.filter(medalist => {
    const matchDept = selectedDept === 'All Departments' || medalist.course === selectedDept;
    const matchYear = selectedYear === 'All Years' || medalist.year === selectedYear;
    const matchName = medalist.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchYear && matchName;
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) { setItemsPerPage(4); setIsMobile(true); }
      else if (width < 1024) { setItemsPerPage(6); setIsMobile(true); }
      else { setItemsPerPage(21); setIsMobile(false); }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { setCurrentPage(1); }, [selectedDept, selectedYear, searchQuery]);

  const handleToggleSearch = () => {
    if (isSearchOpen) { setSearchQuery(''); }
    setIsSearchOpen(!isSearchOpen);
  };

  const totalPages = Math.ceil(filteredMedalists.length / itemsPerPage);
  const paginatedMedalists = filteredMedalists.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh", background: "var(--slate-50)" }}>
        <section className="hero-fullscreen" id="home" style={{ minHeight: "50vh", height: "50vh", background: "#4b5563" }}>
          <div className="hero-bg-image">
            <Image src="/assets/hero/hero-section.png" alt="Toppers Awards Banner" width={1400} height={700} className="hero-bg-img" priority />
          </div>
          <div className="hero-overlay" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.45))" }}></div>
          <div className="hero-content container" style={{ paddingTop: "100px", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", paddingBottom: "80px" }}>
            <h1 className="hero-main-title" style={{ paddingRight: "15px", color: "#fff", margin: "0 0 1rem 0" }}><em>Gold Medalist</em></h1>
            <nav aria-label="breadcrumb">
              <ol style={{ display: "flex", listStyle: "none", padding: 0, margin: 0, gap: "0.5rem", color: "var(--gold-500, #f59e0b)", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                <li><Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Home</Link></li>
                <li style={{ color: "rgba(255,255,255,0.5)" }}>&gt;</li>
                <li><span style={{ color: "rgba(255,255,255,0.7)" }}>Toppers</span></li>
                <li style={{ color: "rgba(255,255,255,0.5)" }}>&gt;</li>
                <li aria-current="page" style={{ color: "var(--gold-500, #f59e0b)" }}>Gold Medalist</li>
              </ol>
            </nav>
          </div>
        </section>

        <section className={`section-padding ${styles.contentSection}`}>
          <div className="container" style={{ maxWidth: "1200px" }}>
            <div className={styles.headerRow}>
              <div className={styles.headerText}>
                <h3 className={styles.sectionTitle} style={{ margin: 0 }}>Gold Medalist <span style={{ color: "#8a0000" }}>Achievers</span></h3>
                <p className={styles.sectionSubtitle} style={{ marginTop: "0.25rem" }}>Browse by department and graduation year</p>
              </div>
              <div className={`${styles.filterControls} ${isSearchOpen ? styles.searchActive : ''}`}>
                <div className={styles.searchWrapper}>
                  {isSearchOpen && (<input type="text" className={styles.searchInput} placeholder="Search student..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus />)}
                  <button className={styles.searchButton} onClick={handleToggleSearch} title="Search student">
                    {isSearchOpen ? (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>) : (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>)}
                  </button>
                </div>
                <div className={styles.dropdownsGroup}>
                  <CustomDropdown options={departments} value={selectedDept} onChange={setSelectedDept} />
                  <CustomDropdown options={years} value={selectedYear} onChange={setSelectedYear} />
                </div>
              </div>
            </div>

            {filteredMedalists.length > 0 ? (
              <>
                <div className={styles.medalistGrid}>
                  {paginatedMedalists.map((medalist, idx) => (
                    <div key={idx} className={styles.medalistCard}>
                      <div className={styles.imageContainer}>
                        <Image src={medalist.photo} alt={medalist.name} fill className={styles.cardImage} sizes="(max-width: 768px) 100vw, 33vw" />
                        <div className={styles.ribbon}>Gold Medalist</div>
                      </div>
                      <div className={styles.cardContent}>
                        <div>
                          <h4 className={styles.name}>{medalist.name}</h4>
                          <p className={styles.metaInfo}>{medalist.course} &bull; Passing Year: {medalist.year}</p>
                        </div>
                        <div className={styles.scoreBadge}>
                          <span className={styles.scoreLabel}>Academic score:</span>
                          <strong className={styles.scoreValue}>{medalist.cgpa} CGPA</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className={styles.paginationContainer}>
                    <button className={`${styles.pageNavBtn} ${currentPage === 1 ? styles.pageNavDisabled : ''}`} onClick={() => { if (currentPage > 1) setCurrentPage(p => p - 1); }} disabled={currentPage === 1} aria-label="Previous page">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                      <span>Prev</span>
                    </button>
                    <span className={styles.pageIndicator}>{currentPage} / {totalPages}</span>
                    <button className={`${styles.pageNavBtn} ${currentPage === totalPages ? styles.pageNavDisabled : ''}`} onClick={() => { if (currentPage < totalPages) setCurrentPage(p => p + 1); }} disabled={currentPage === totalPages} aria-label="Next page">
                      <span>Next</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.noResults}>
                <h3 className={styles.noResultsTitle}>No Achievers Found</h3>
                <p className={styles.noResultsText}>No gold medalists match the selected filters. Try choosing different values.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
