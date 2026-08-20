"use client";

import React, { useState } from 'react';
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
  { name: "Bhakti R. Dave", course: "DNYS", year: "2025", cgpa: "9.10", photo: "/assets/toppers/priya.jpg" }
];

const departments = ["All Departments", "BA", "MA", "B.COM", "M.COM", "BCA", "BBA", "MSW", "DFD & CFD", "DNYS"];
const years = ["All Years", "2025", "2024"];

export default function GoldMedalistPage() {
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleReset = () => {
    setSelectedDept('All Departments');
    setSelectedYear('All Years');
    setSearchQuery('');
  };

  const handleToggleSearch = () => {
    if (isSearchOpen) {
      setSearchQuery(''); // Clear query when closing
    }
    setIsSearchOpen(!isSearchOpen);
  };

  // Filter medalists based on dropdown selections and search query
  const filteredMedalists = allMedalists.filter(medalist => {
    const matchDept = selectedDept === 'All Departments' || medalist.course === selectedDept;
    const matchYear = selectedYear === 'All Years' || medalist.year === selectedYear;
    const matchName = medalist.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchYear && matchName;
  });

  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh", background: "var(--slate-50)" }}>
        {/* Hero Section */}
        <section className="hero-fullscreen" id="home" style={{ minHeight: "50vh", height: "50vh", background: "#4b5563" }}>
          <div className="hero-bg-image">
            <Image 
              src="/assets/hero/hero-section.png" 
              alt="Toppers Awards Banner" 
              width={1400} 
              height={700}
              className="hero-bg-img"
              priority
            />
          </div>
          <div className="hero-overlay" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.45))" }}></div>
          
          <div className="hero-content" style={{ paddingTop: "100px", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", paddingBottom: "80px" }}>
            <h1 className="hero-main-title" style={{ fontSize: "60px", fontWeight: "600", paddingRight: "15px", color: "#fff", margin: "0 0 1rem 0" }}>
              <em>Gold Medalist</em>
            </h1>
            
            {/* Breadcrumb */}
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

        {/* Content Section */}
        <section className="section-padding" style={{ padding: "5rem 0" }}>
          <div className="container" style={{ maxWidth: "1200px" }}>

            {/* Selection Row: Title on Left, Filter Dropdowns on Right Corner */}
            <div className={styles.headerRow}>
              <div className={styles.headerText}>
                <h3 className={styles.sectionTitle} style={{ margin: 0 }}>
                  Gold Medalist <span style={{ color: "#8a0000" }}>Achievers</span>
                </h3>
                <p className={styles.sectionSubtitle} style={{ marginTop: "0.25rem" }}>
                  Browse by department and graduation year
                </p>
              </div>
              
              <div className={styles.filterControls}>
                {/* Search Toggle Icon */}
                <div className={styles.searchWrapper}>
                  {isSearchOpen && (
                    <input 
                      type="text"
                      className={styles.searchInput}
                      placeholder="Search student..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  )}
                  <button className={styles.searchButton} onClick={handleToggleSearch} title="Search student">
                    {isSearchOpen ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    )}
                  </button>
                </div>

                {/* Department Dropdown */}
                <select 
                  className={styles.filterSelect}
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                {/* Year Dropdown */}
                <select 
                  className={styles.filterSelect}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {years.map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Medalist Grid (Full Width, Compact styling) */}
            {filteredMedalists.length > 0 ? (
              <div className={styles.medalistGrid}>
                {filteredMedalists.map((medalist, idx) => (
                  <div key={idx} className={styles.medalistCard}>
                    <div className={styles.imageContainer}>
                      <Image 
                        src={medalist.photo} 
                        alt={medalist.name} 
                        fill 
                        className={styles.cardImage}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      
                      {/* Sleek Corner Ribbon to avoid overlapping face */}
                      <div className={styles.ribbon}>
                        Gold Medalist
                      </div>
                    </div>
                    
                    <div className={styles.cardContent}>
                      <div>
                        <h4 className={styles.name}>{medalist.name}</h4>
                        <p className={styles.metaInfo}>
                          {medalist.course} &bull; Passing Year: {medalist.year}
                        </p>
                      </div>
                      <div className={styles.scoreBadge}>
                        <span className={styles.scoreLabel}>Academic score:</span>
                        <strong className={styles.scoreValue}>{medalist.cgpa} CGPA</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
