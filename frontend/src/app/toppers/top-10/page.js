"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import styles from './page.module.css';

const departments = ["BCA", "BBA", "B.COM", "M.COM", "BA", "MA", "MSW", "DFD & CFD", "DNYS"];
const years = ["2025", "2024"];

const firstNames = ["Priya", "Anjali", "Meera", "Krina", "Vidhi", "Bhakti", "Dhara", "Neha", "Kinjal", "Pooja", "Aaradhya", "Aditi", "Ishita", "Sneha", "Riddhi", "Siddhi", "Nisha", "Kajal", "Janki", "Hiral", "Komal", "Mansi", "Drashti", "Bhavna", "Rupal"];
const lastNames = ["Gohil", "Mori", "Bhatt", "Shah", "Pathak", "Dave", "Mehta", "Parmar", "Rathod", "Jadeja", "Trivedi", "Joshi", "Patel", "Vyas", "Chudasama", "Solanki", "Zala", "Pandya", "Vaghela", "Makwana", "Kapadia", "Doshi", "Sanghavi", "Oza", "Maniar"];

// Generate mock Top-10 data for every department and year combination
const generateTop10Data = () => {
  const data = [];
  const cgpaScores = ["9.85", "9.68", "9.52", "9.45", "9.30", "9.15", "9.05", "8.92", "8.75", "8.58"];
  
  departments.forEach((dept) => {
    years.forEach((year) => {
      for (let i = 0; i < 10; i++) {
        const rankSuffix = ["st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th"][i];
        const rankStr = `${i + 1}${rankSuffix}`;
        
        const hash = dept.charCodeAt(0) + (year === "2025" ? 7 : 3) + i;
        const firstName = firstNames[hash % firstNames.length];
        const lastName = lastNames[(hash * 3) % lastNames.length];
        
        data.push({
          rank: rankStr,
          name: `${lastName} ${firstName} ${lastName[0]}.`,
          dept: dept,
          year: year,
          score: `${cgpaScores[i]} CGPA`
        });
      }
    });
  });
  return data;
};

export default function Top10Page() {
  const [selectedDept, setSelectedDept] = useState('BCA');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const allTop10 = useMemo(() => generateTop10Data(), []);

  // Filter rankings based on dropdown selections and search query
  const filteredRankings = useMemo(() => {
    return allTop10.filter(row => 
      row.dept === selectedDept && 
      row.year === selectedYear &&
      row.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allTop10, selectedDept, selectedYear, searchQuery]);

  const getRankClass = (rank) => {
    if (rank === "1st") return styles.rank1;
    if (rank === "2nd") return styles.rank2;
    if (rank === "3rd") return styles.rank3;
    return styles.rankOther;
  };

  const handleToggleSearch = () => {
    if (isSearchOpen) {
      setSearchQuery(''); // Clear search query when closing
    }
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh", background: "var(--slate-50)" }}>
        {/* Hero Section */}
        <section className="hero-fullscreen" id="home" style={{ minHeight: "50vh", height: "50vh", background: "#4b5563" }}>
          <div className="hero-bg-image">
            <Image 
              src="/assets/hero/hero-section.png" 
              alt="Toppers Banner" 
              width={1400} 
              height={700}
              className="hero-bg-img"
              priority
            />
          </div>
          <div className="hero-overlay" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.45))" }}></div>
          
          <div className="hero-content" style={{ paddingTop: "100px", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", paddingBottom: "80px" }}>
            <h1 className="hero-main-title" style={{ fontSize: "60px", fontWeight: "600", paddingRight: "15px", color: "#fff", margin: "0 0 1rem 0" }}>
              <em>Top-10</em>
            </h1>
            
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
              <ol style={{ display: "flex", listStyle: "none", padding: 0, margin: 0, gap: "0.5rem", color: "var(--gold-500, #f59e0b)", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                <li><Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Home</Link></li>
                <li style={{ color: "rgba(255,255,255,0.5)" }}>&gt;</li>
                <li><span style={{ color: "rgba(255,255,255,0.7)" }}>Toppers</span></li>
                <li style={{ color: "rgba(255,255,255,0.5)" }}>&gt;</li>
                <li aria-current="page" style={{ color: "var(--gold-500, #f59e0b)" }}>Top-10</li>
              </ol>
            </nav>
          </div>
        </section>

        {/* Content Section */}
        <section className="section-padding" style={{ padding: "5rem 0" }}>
          <div className="container" style={{ maxWidth: "1000px" }}>

            {/* Selection Row: Title on Left, Filter Dropdowns on Right Corner */}
            <div className={styles.headerRow}>
              <div className={styles.headerText}>
                <h3 className={styles.sectionTitle} style={{ margin: 0 }}>
                  Top-10 <span style={{ color: "#8a0000" }}>Rankers</span>
                </h3>
                <p className={styles.sectionSubtitle} style={{ marginTop: "0.25rem" }}>
                  Browse leading scorers by department and graduation year
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

            {/* Leaderboard Single Card Container */}
            {filteredRankings.length > 0 ? (
              <div className={styles.leaderboardCard}>
                {filteredRankings.map((row, idx) => (
                  <div key={idx} className={styles.leaderboardRow}>
                    
                    {/* Rank Circle Badge */}
                    <span className={`${styles.rankBadge} ${getRankClass(row.rank)}`}>
                      {row.rank.replace(/(st|nd|rd|th)/, '')}
                    </span>

                    {/* Student Name */}
                    <span className={styles.studentName}>{row.name}</span>

                    {/* Creative Dot Connector Bridge (takes up all the white space) */}
                    <div className={styles.connectorLine}></div>

                    {/* Department Badge */}
                    <span className={styles.deptBadge}>{row.dept}</span>

                    {/* CGPA Score */}
                    <span className={styles.cgpaValue}>{row.score}</span>
                    
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <h3 className={styles.noResultsTitle}>No Rankers Found</h3>
                <p className={styles.noResultsText}>No students match the selected filters. Try choosing different values.</p>
              </div>
            )}

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
