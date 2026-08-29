"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import AcademicProgramServices from "@/services/AcademicProgramServices";

// Helper to get matching acronym badge CSS class based on acronym
const getAcronymClass = (programType, acronym = "", index = 0) => {
  const norm = (acronym || "").toUpperCase().trim();
  if (norm.includes("B.C.A") || norm.includes("DNYS")) return "acronym-azure";
  if (norm.includes("B.A.") || norm.includes("M.A.") || norm.includes("DFD")) return "acronym-gold";
  if (norm.includes("B.COM") || norm.includes("M.COM")) return "acronym-purple";
  if (norm.includes("M.S.W.") || norm.includes("B.B.A.")) return "";
  
  const classes = ["", "acronym-azure", "acronym-gold", "acronym-purple"];
  return classes[index % classes.length];
};

// Helper to get matching icon badge based on acronym
const getIconColor = (category, acronym = "", index = 0) => {
  const norm = (acronym || "").toUpperCase().trim();
  if (norm.includes("B.C.A") || norm.includes("DNYS")) return "prog-ibadge-azure";
  if (norm.includes("B.A.") || norm.includes("M.A.") || norm.includes("DFD")) return "prog-ibadge-gold";
  if (norm.includes("B.COM") || norm.includes("M.COM")) return "prog-ibadge-purple";
  return "prog-ibadge-ruby";
};

// Helper to get matching fee badge CSS class
const getFeeClass = (category, acronym = "", index = 0) => {
  const norm = (acronym || "").toUpperCase().trim();
  if (category === "ug" && norm.includes("B.C.A.")) return "fee-azure";
  if (norm.includes("B.A.")) return "fee-gold";
  if (category === "ug") return "fee-ruby";
  if (category === "pg" && norm.includes("M.COM")) return "fee-purple";
  if (category === "pg" && norm.includes("M.S.W.")) return "fee-ruby";
  if (category === "pg") return "fee-gold";
  if (norm.includes("DFD")) return "fee-gold";
  if (category === "diploma") return "fee-azure";
  
  const feeClasses = ["fee-ruby", "fee-azure", "fee-gold", "fee-purple"];
  return feeClasses[index % feeClasses.length];
};

// Helper to format fee string with Rupee symbol
const formatFee = (feeRaw) => {
  if (!feeRaw) return "Affordable Fee";
  const str = String(feeRaw).trim();
  if (str.toLowerCase() === "affordable fee" || str.toLowerCase().includes("standard") || str.toLowerCase().includes("norms")) {
    return str;
  }
  const clean = str.replace(/^[?\s]+/, "");
  if (clean.startsWith("₹")) return clean;
  if (/^\d/.test(clean)) return "₹" + clean;
  return clean;
};

// Default icon renderer
const renderIcon = (acronym = "") => {
  const norm = (acronym || "").toUpperCase().trim();
  if (norm.includes("B.C.A") || norm.includes("IT")) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  }
  if (norm.includes("B.A.") || norm.includes("M.A.")) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    );
  }
  if (norm.includes("DFD") || norm.includes("FASHION")) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" />
        <line x1="14.47" y1="14.48" x2="20" y2="20" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
};

export default function CoursesPage() {
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  // Fetch dynamic programs from API
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const res = await AcademicProgramServices.getAllPrograms({ status: "active", limit: 100 });
        const list = res?.data || res?.programs || (Array.isArray(res) ? res : []);
        
        if (Array.isArray(list)) {
          const formatted = list.map((item, idx) => {
            const rawCat = (item.programType || item.category || "ug").toLowerCase().trim();
            const cat = rawCat === "undergraduate" ? "ug" : rawCat === "postgraduate" ? "pg" : rawCat === "diploma & vocational" ? "diploma" : rawCat;
            const acronym = item.shortTitle || item.shortName || item.acronym || "";
            const defaultTag = cat === "ug" ? "UG Degree" : cat === "pg" ? "PG Degree" : "Diploma";
            
            let points = [];
            if (Array.isArray(item.highlights)) {
              points = item.highlights.filter(Boolean);
            } else if (typeof item.highlights === "string" && item.highlights.trim()) {
              try {
                const parsed = JSON.parse(item.highlights);
                points = Array.isArray(parsed) ? parsed.filter(Boolean) : item.highlights.split("\n").map(s => s.trim()).filter(Boolean);
              } catch {
                points = item.highlights.split("\n").map(s => s.trim()).filter(Boolean);
              }
            }

            return {
              id: item._id || item.slug || item.id || idx,
              category: cat,
              acronym: acronym || "DEGREE",
              acronymClass: getAcronymClass(cat, acronym, idx),
              tag: item.degreeBadge || defaultTag,
              iconColor: getIconColor(cat, acronym, idx),
              title: item.fullName || item.title || "",
              summary: item.description || item.summary || "",
              points: points.length > 0 ? points : ["Comprehensive Curriculum & Practical Training"],
              duration: item.duration || "3 Years (6 Sems)",
              fee: formatFee(item.fees || item.fee),
              feeClass: getFeeClass(cat, acronym, idx),
              icon: renderIcon(acronym),
            };
          });
          setCoursesData(formatted);
        }
      } catch (err) {
        console.error("Error fetching academic programs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Filter items dynamically
  const filteredCourses = useMemo(() => {
    if (activeFilter === "all") return coursesData;
    return coursesData.filter((c) => c.category === activeFilter);
  }, [coursesData, activeFilter]);

  // Count items for each category
  const allCount = coursesData.length;
  const ugCount = coursesData.filter((c) => c.category === "ug").length;
  const pgCount = coursesData.filter((c) => c.category === "pg").length;
  const diplomaCount = coursesData.filter((c) => c.category === "diploma").length;

  const FILTER_OPTIONS = [
    { value: "all", label: "All Programs", count: allCount },
    { value: "ug", label: "Undergraduate (UG)", count: ugCount },
    { value: "pg", label: "Postgraduate (PG)", count: pgCount },
    { value: "diploma", label: "Diploma & Vocational", count: diplomaCount },
  ];

  const activeOption =
    FILTER_OPTIONS.find((o) => o.value === activeFilter) || FILTER_OPTIONS[0];

  return (
    <>
      <Header />
      <main>
        {/* HERO BANNER */}
        <section
          className="hero-fullscreen"
          id="home"
          style={{ minHeight: "50vh", height: "50vh" }}
        >
          <div className="hero-bg-image">
            <Image
              src="/assets/home/hero/1.png"
              alt="Courses Banner"
              fill
              className="hero-bg-img"
              priority
              unoptimized
            />
          </div>
          <div
            className="hero-overlay"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))",
            }}
          ></div>
          <div
            className="hero-content container"
            style={{
              paddingTop: "100px",
              display: "flex",
              alignItems: "flex-end",
              height: "100%",
              paddingBottom: "80px",
              width: "100%",
            }}
          >
            <h1 className="hero-main-title">
              <em>Courses &amp; Programs</em>
            </h1>
          </div>
        </section>

        {/* ACADEMIC PROGRAMS OFFERED */}
        <section className="section-padding programs-section" id="programs">
          <div className="container">
            <div className="section-header">
              <div className="section-subtitle">Comprehensive Curriculum</div>
              <h2 className="section-title">
                Academic Programs <span>Offered at NMC</span>
              </h2>
              <p className="section-description">
                Career-oriented Undergraduate, Postgraduate, and Professional
                Diploma programs affiliated with M.K. Bhavnagar University.
              </p>
            </div>

            {/* Mobile Custom Dropdown Filter (<= 768px) */}
            <div
              className={`program-filter-dropdown ${filterOpen ? "open" : ""}`}
            >
              <button
                type="button"
                className="pfd-toggle"
                onClick={() => setFilterOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={filterOpen}
              >
                <span>
                  {activeOption.label} ({activeOption.count})
                </span>
                <svg
                  className="pfd-chevron"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {filterOpen && (
                <>
                  <div
                    className="pfd-overlay"
                    onClick={() => setFilterOpen(false)}
                  ></div>
                  <ul className="pfd-menu" role="listbox">
                    {FILTER_OPTIONS.map((opt) => (
                      <li
                        key={opt.value}
                        role="option"
                        aria-selected={activeFilter === opt.value}
                        className={`pfd-option ${activeFilter === opt.value ? "active" : ""}`}
                        onClick={() => {
                          setActiveFilter(opt.value);
                          setFilterOpen(false);
                        }}
                      >
                        <span className="pfd-option-label">
                          {opt.label}{" "}
                          <span className="pfd-option-count">
                            ({opt.count})
                          </span>
                        </span>
                        {activeFilter === opt.value && (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Enhanced Category Filter Bar */}
            <div className="program-filter-bar">
              <button
                className={`prog-filter-btn ${activeFilter === "all" ? "active" : ""}`}
                data-filter="all"
                onClick={() => setActiveFilter("all")}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>All Programs</span>
                <span className="prog-count-pill">{allCount}</span>
              </button>
              <button
                className={`prog-filter-btn ${activeFilter === "ug" ? "active" : ""}`}
                data-filter="ug"
                onClick={() => setActiveFilter("ug")}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                <span>Undergraduate (UG)</span>
                <span className="prog-count-pill">{ugCount}</span>
              </button>
              <button
                className={`prog-filter-btn ${activeFilter === "pg" ? "active" : ""}`}
                data-filter="pg"
                onClick={() => setActiveFilter("pg")}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>Postgraduate (PG)</span>
                <span className="prog-count-pill">{pgCount}</span>
              </button>
              <button
                className={`prog-filter-btn ${activeFilter === "diploma" ? "active" : ""}`}
                data-filter="diploma"
                onClick={() => setActiveFilter("diploma")}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
                <span>Diploma &amp; Vocational</span>
                <span className="prog-count-pill">{diplomaCount}</span>
              </button>
            </div>

            {/* Programs Grid */}
            <div className="programs-grid">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="prog-card prog-card-luxury spotlight-active"
                  data-category={course.category}
                >
                  <div className="prog-card-inner">
                    <div className="prog-card-header-bar">
                      <span
                        className={`prog-tag ${course.category === "ug" ? "tag-ug" : course.category === "pg" ? "tag-pg" : "tag-diploma"}`}
                      >
                        {course.tag}
                      </span>
                      <div className={`prog-icon-badge ${course.iconColor}`}>
                        {course.icon}
                      </div>
                    </div>

                    <div
                      className={`prog-acronym-badge ${course.acronymClass}`}
                    >
                      {course.acronym}
                    </div>
                    <h3 className="prog-title">{course.title}</h3>
                    <p className="prog-summary">{course.summary}</p>

                    <ul className="prog-points-list">
                      {course.points.slice(0, 3).map((pt, i) => (
                        <li key={i}>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="prog-meta-strip">
                      <div className="prog-meta-item">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{course.duration}</span>
                      </div>
                      <div
                        className={`prog-fee-badge ${course.feeClass}`}
                      >
                        {course.fee}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-crimson prog-card-btn"
                    onClick={() => window.dispatchEvent(new Event('openContactPopup'))}
                  >
                    <span>Apply for {course.acronym}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
