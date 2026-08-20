'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './OurTeachers.module.css';

// Exact teacher data scraped from https://nandkunvarbamahilacollege.com/?page_id=188
const teachersData = [
  {
    id: 1,
    name: "Priyaba Sarvaiya",
    designation: "Assistant Professor",
    department: "Arts",
    qualification: "M.A. (English)",
    experience: "5+ Years of Academic Experience",
    bio: "Dedicated Assistant Professor in the Arts department, specializing in English literature and language instruction to nurture students' communication skills.",
    image: "/assets/our-faculties/B.A/Priyaba Sarvaiya/1-350.webp"
  },
  {
    id: 2,
    name: "Dr. Manisha Jamod",
    designation: "Assistant Professor",
    department: "Arts",
    qualification: "M.A., Ph.D (Sanskrit)",
    experience: "7+ Years of Academic Experience",
    bio: "An accomplished scholar in Sanskrit, teaching ancient languages, literature, and culture to preserve and promote classical Indian heritage.",
    image: "/assets/our-faculties/B.A/Dr.Manisha Jamod/1-350.webp"
  },
  {
    id: 3,
    name: "Dhara Dhandhukiya",
    designation: "Assistant Professor",
    department: "Arts",
    qualification: "M.A., B.Ed. (English)",
    experience: "6+ Years of Academic Experience",
    bio: "Dedicated educator in English literature and language development, focusing on modern instructional methods and active learning.",
    image: "/assets/our-faculties/B.A/DHARA DHANDHUKIYA/1-350.webp"
  },
  {
    id: 4,
    name: "Shri Kishan Hariyani",
    designation: "Assistant Professor",
    department: "Arts",
    qualification: "M.P.Ed. (Physical Education)",
    experience: "5+ Years of Physical Instruction Experience",
    bio: "Directs physical education programs, athletic training, and fitness education to promote wellness and health among students.",
    image: "/assets/our-faculties/B.A/Shri Kishan Hariyani/1-350.webp"
  },
  {
    id: 5,
    name: "Shri Bhartiba K. Zala",
    designation: "Assistant Professor",
    department: "Arts",
    qualification: "M.A. (Sanskrit)",
    experience: "8+ Years of Academic Experience",
    bio: "Teaches Sanskrit literature, philosophy, and classical grammar with a focus on historical Indian texts.",
    image: "/assets/our-faculties/B.A/Shri Bhartiba K  Zala/1-350.webp"
  },
  {
    id: 6,
    name: "Shri Poonam H. Chudasama",
    designation: "Assistant Professor",
    department: "Arts",
    qualification: "M.A. (Hindi)",
    experience: "6+ Years of Academic Experience",
    bio: "Specializes in Hindi grammar, modern poetry, and prose, helping students develop deep literary insights and analytical skills.",
    image: "/assets/our-faculties/B.A/Shri Poonam H. Chudasama/1-350.webp"
  },
  {
    id: 7,
    name: "Shri Anjana G. Chauhan",
    designation: "Assistant Professor",
    department: "Arts",
    qualification: "M.A. (Economics)",
    experience: "5+ Years of Academic Experience",
    bio: "Teaches macroeconomics, microeconomics, and public finance, preparing students for business analytical studies.",
    image: "/assets/our-faculties/B.A/Shri Anjana G. Chauhan/1-350.webp"
  },
  {
    id: 8,
    name: "Shri Hemisha Bharodiya",
    designation: "Assistant Professor",
    department: "Arts",
    qualification: "M.A. (Sanskrit)",
    experience: "5+ Years of Academic Experience",
    bio: "Instructs Sanskrit language courses and epic poetry, connecting students to traditional wisdom and cultural ethics.",
    image: "/assets/our-faculties/B.A/Shri Hemisha Bharodiya/1-350.webp"
  },
  {
    id: 9,
    name: "Dr. Samkit Shah",
    designation: "I/C Principal",
    department: "Arts",
    qualification: "M.A., Ph.D. (Economics)",
    experience: "10 Years (Undergraduate & Postgraduate teaching in Economics)",
    bio: "Administrative head and senior economist who has presented 22 national/international seminar papers and published 14 research publications.",
    image: "/assets/our-faculties/B.A/Dr. Samkit Shah/1-350.webp"
  },
  {
    id: 10,
    name: "Drashtiben Mangukiya",
    designation: "Assistant Professor",
    department: "Arts",
    qualification: "B.A., M.A. (Arts)",
    experience: "4+ Years of Academic Experience",
    bio: "Instructs basic humanities and social science modules to promote creative and cultural analysis.",
    image: "/assets/our-faculties/B.A/Drashtiben Mangukiya/1-350.webp"
  },
  {
    id: 11,
    name: "Sima Rathod",
    designation: "Assistant Professor",
    department: "Arts",
    qualification: "B.A., M.A. (English)",
    experience: "4+ Years of Academic Experience",
    bio: "Focuses on English communication, literary theory, and linguistics to improve student fluency and expression.",
    image: "/assets/our-faculties/B.A/Sima Rathod/1-350.webp"
  },
  {
    id: 12,
    name: "Parulben Yadav",
    designation: "Assistant Professor",
    department: "Arts",
    qualification: "M.A., B.Ed. (Gujarati)",
    experience: "5+ Years of Academic Experience",
    bio: "Teaches Gujarati language skills, regional literature, and grammar structures with dedication.",
    image: "/assets/our-faculties/B.A/Parulben Yadav/1-350.webp"
  },
  {
    id: 13,
    name: "Tejalben Rathod",
    designation: "Assistant Professor",
    department: "Arts",
    qualification: "M.A., B.Ed. (Gujarati)",
    experience: "5+ Years of Academic Experience",
    bio: "Guides student exploration of classic Gujarati texts, encouraging native heritage understanding.",
    image: "/assets/our-faculties/B.A/Tejalben Rathod/1-350.webp"
  },
  {
    id: 14,
    name: "Hitikshaben Gundigara",
    designation: "Assistant Professor",
    department: "Arts",
    qualification: "B.A., M.A. (Gujarati)",
    experience: "4+ Years of Academic Experience",
    bio: "Assists students in grammar projects and comparative linguistics in regional languages.",
    image: "/assets/our-faculties/B.A/Hitikshaben Gundigara/1-350.webp"
  },
  {
    id: 15,
    name: "Jitendra R. Bhatt",
    designation: "Assistant Professor",
    department: "Arts",
    qualification: "B.A., M.A. (English)",
    experience: "8+ Years of Academic Experience",
    bio: "Experienced senior faculty member delivering classes in Western literary criticism and classic poetry.",
    image: "/assets/our-faculties/B.A/Jitendra R. Bhatt/1-350.webp"
  },
  {
    id: 16,
    name: "Jasmin Joshi",
    designation: "Assistant Professor",
    department: "Arts",
    qualification: "B.A., M.A. (Hindi)",
    experience: "5+ Years of Academic Experience",
    bio: "Encourages students in creative writing and Hindi poetry composition projects.",
    image: "/assets/our-faculties/B.A/Jasmin Joshi/1-350.webp"
  },
  {
    id: 17,
    name: "Bhumi Parmar",
    designation: "Lecturer",
    department: "Arts",
    qualification: "M.A. (Arts)",
    experience: "3+ Years of Academic Experience",
    bio: "Mentors young students in foundational social sciences, preparing them for advanced major studies.",
    image: "/assets/our-faculties/B.A/Bhumi Parmar/1-350.webp"
  },
  {
    id: 18,
    name: "Ektaben Bhaliya",
    designation: "Lecturer",
    department: "Arts",
    qualification: "M.A. (Arts)",
    experience: "3+ Years of Academic Experience",
    bio: "Teaches essential humanities curriculum, specializing in critical thinking and research methods.",
    image: "/assets/our-faculties/B.A/Ektaben Bhaliya/1-350.webp"
  },
  {
    id: 19,
    name: "Kajal Gohil",
    designation: "Lecturer",
    department: "Arts",
    qualification: "M.A. (Arts)",
    experience: "3+ Years of Academic Experience",
    bio: "Delivers introductory lecture courses in political systems and sociology basics.",
    image: "/assets/our-faculties/B.A/Kajal Gohil/1-350.webp"
  },
  {
    id: 20,
    name: "Princyba Gohil",
    designation: "Assistant Professor",
    department: "Arts",
    qualification: "M.A. (Psychology)",
    experience: "5+ Years of Academic Experience",
    bio: "Teaches cognitive psychology, child development, and counseling principles to Arts majors.",
    image: "/assets/our-faculties/B.A/PRINCYBA GOHIL/1-350.webp"
  },
  {
    id: 21,
    name: "Bhavikaben Patel",
    designation: "Assistant Professor",
    department: "Arts",
    qualification: "M.A. (Sociology)",
    experience: "6+ Years of Academic Experience",
    bio: "Fosters discussions on social structures, gender studies, and community systems within India.",
    image: "/assets/our-faculties/B.A/BHAVIKABEN PATEL/1-350.webp"
  },
  {
    id: 22,
    name: "Hemangi Mehta",
    designation: "Assistant Professor",
    department: "Arts",
    qualification: "M.A., B.Ed., D.Ped (Education)",
    experience: "8 Years of Teaching Experience",
    bio: "Specialist in physical fitness pedagogy and education theory, presenting at multiple sanitation seminars.",
    image: "/assets/our-faculties/B.A/Hemangi Mehta/1-350.webp"
  },
  {
    id: 23,
    name: "Alpeshsinh Zala",
    designation: "Assistant Professor",
    department: "Arts",
    qualification: "M.A., B.Ed.",
    experience: "5 Years of Teaching Experience",
    bio: "Strong advocate for introducing practical and vocational curriculum models into regional academic streams.",
    image: "/assets/our-faculties/B.A/Alpeshsinh Zala/1-350.webp"
  },
  {
    id: 24,
    name: "Dr. Raksha H. Dave",
    designation: "Assistant Professor",
    department: "Arts",
    qualification: "M.A., Ph.D.",
    experience: "20 Years of Academic Experience",
    bio: "Senior faculty member conducting research in Gujarati short stories and publishing literary papers.",
    image: "/assets/our-faculties/B.A/Dr. Raksha H. Dave/1-350.webp"
  },
  {
    id: 25,
    name: "Gaurang Makwana",
    designation: "Assistant Professor",
    department: "Management",
    qualification: "M.B.A (Finance), B.B.A.",
    experience: "5+ Years of Professional Teaching",
    bio: "Teaches financial accounting, managerial analytics, and basic corporate finance concepts.",
    image: "/assets/our-faculties/B.B.A/Gaurang Makwana/1-350.webp"
  },
  {
    id: 26,
    name: "Shah Keyurbhai",
    designation: "I/C Principal",
    department: "Management",
    qualification: "M.B.A. (Finance), B.Com (H), D.B.M.",
    experience: "12+ Years of Leadership Experience",
    bio: "Senior administrative leader guiding business management streams and organizing quality assurance workshops.",
    image: "/assets/our-faculties/B.B.A/SHAH KEYURBHAI/1-350.webp"
  },
  {
    id: 27,
    name: "Khushbu Trivedi",
    designation: "Assistant Professor",
    department: "Computer Application",
    qualification: "B.C.A., M.C.A.",
    experience: "6+ Years of IT Mentorship",
    bio: "Instructs database architectures, object-oriented languages, and frontend web development paradigms.",
    image: "/assets/our-faculties/B.C.A/Khushbu Trivedi/5-300.webp"
  },
  {
    id: 28,
    name: "Rekha Makwana",
    designation: "Assistant Professor",
    department: "Computer Application",
    qualification: "B.C.A., M.C.A.",
    experience: "6+ Years of IT Mentorship",
    bio: "Conducts practical labs for software engineering, system design, and algorithms.",
    image: "/assets/our-faculties/B.C.A/Rekha Makwana/1-350.webp"
  },
  {
    id: 29,
    name: "Ankita R. Patel",
    designation: "Principal / Coordinator",
    department: "Computer Application",
    qualification: "M.C.A. (RDBMS, C-Language)",
    experience: "14+ Years of Academic Experience",
    bio: "Coordinates advanced computer applications and guides project groups in building web architectures.",
    image: "/assets/our-faculties/B.C.A/Ankita R. Patel/1-350.webp"
  },
  {
    id: 30,
    name: "Dr Digvijaysinh Ranjitsinh Gohil",
    designation: "Assistant Professor",
    department: "Commerce",
    qualification: "M.Com, M.Phil, Ph.D, GSET",
    experience: "7+ Years of Academic Experience",
    bio: "Qualified GSET scholar teaching advanced financial management, international trade, and statistics.",
    image: "/assets/our-faculties/B.COM/Dr Digvijaysinh Ranjitsinh Gohil/1-350.webp"
  },
  {
    id: 31,
    name: "Mrs Sheetal ben Sedani",
    designation: "Assistant Professor",
    department: "Commerce",
    qualification: "M.Com, M.Phil, B.Ed.",
    experience: "8+ Years of Academic Experience",
    bio: "Specializes in business economics, microfinance, and modern auditing practices for corporate studies.",
    image: "/assets/our-faculties/B.COM/Mrs Sheetal ben Sedani/1-350.webp"
  },
  {
    id: 32,
    name: "Tanviben Solanki",
    designation: "Assistant Professor",
    department: "Commerce",
    qualification: "M.Com, M.Phil",
    experience: "6+ Years of Academic Experience",
    bio: "Focuses on cost accounting, human resource structures, and organizational behaviors.",
    image: "/assets/our-faculties/B.COM/Tanviben Solanki/1-350.webp"
  },
  {
    id: 33,
    name: "Shraddha Makwana",
    designation: "Coordinator",
    department: "Fashion Designing",
    qualification: "B.Com, Diploma in Fashion Designing",
    experience: "8+ Years of Design Experience",
    bio: "Leads creative workshops in fabric science, apparel pattern design, and textile printing.",
    image: "/assets/our-faculties/F.D/Shraddha Makwana/1-350.webp"
  },
  {
    id: 34,
    name: "Saraiya Nidhibahen Kiritkumar",
    designation: "Assistant Professor",
    department: "Commerce",
    qualification: "M.Com, B.Ed",
    experience: "5+ Years of Academic Experience",
    bio: "Instructs corporate accounting and banking procedures, helping students gain practical finance perspectives.",
    image: "/assets/our-faculties/M.COM/SARAIYA NIDHIBAHEN KIRITKUMAR/1-350.webp"
  },
  {
    id: 35,
    name: "Saiyad Manzoorali",
    designation: "Assistant Professor",
    department: "Commerce",
    qualification: "M.Com, GSET",
    experience: "6+ Years of Academic Experience",
    bio: "Teaches market research methods, entrepreneurial leadership, and statistics tools.",
    image: "/assets/our-faculties/M.COM/Saiyad Manzoorali/1-350.webp"
  },
  {
    id: 36,
    name: "Shruti R. Raval",
    designation: "Assistant Professor",
    department: "Commerce",
    qualification: "M.B.A (Finance)",
    experience: "1 Year of Teaching Experience",
    bio: "Engages students in modern business taxation structures, portfolios, and investment analysis.",
    image: "/assets/our-faculties/M.COM/Shruti R. Raval/1-350.webp"
  },
  {
    id: 37,
    name: "Zainab A. Makda",
    designation: "Assistant Professor",
    department: "Social Work",
    qualification: "M.S.W (Master of Social Work)",
    experience: "5+ Years of Field Mentorship",
    bio: "Teaches family welfare policies, community organization techniques, and social case work paradigms.",
    image: "/assets/our-faculties/M.S.W/Zainab A. Makda/1-182.webp"
  },
  {
    id: 38,
    name: "Chandresh H. Pandya",
    designation: "Assistant Professor",
    department: "Social Work",
    qualification: "M.S.W., Ph.D (Running)",
    experience: "5+ Years of Field Mentorship",
    bio: "Mentors students in rural development camps, NGO management, and clinical social work practices.",
    image: "/assets/our-faculties/M.S.W/Chandresh H. Pandya/1-350.webp"
  },
  {
    id: 39,
    name: "Juli H. Patel",
    designation: "I/c Coordinator",
    department: "Social Work",
    qualification: "M.S.W (Master of Social Work)",
    experience: "6+ Years of Social Work Management",
    bio: "Coordinates field visits and internships for MSW students, linking them with civic health and labor organizations.",
    image: "/assets/our-faculties/M.S.W/Juli  H. Patel/1-350.webp"
  }
];

// Helper to determine a floating badge for the card top-right corner
const getFloatingBadge = (teacher) => {
  const designation = teacher.designation.toLowerCase();
  const qual = teacher.qualification.toLowerCase();
  const exp = teacher.experience;

  if (designation.includes('principal') || designation.includes('director')) return 'Principal';
  if (designation.includes('coordinator')) return 'Coordinator';
  if (designation.includes('head')) return 'Dept Head';
  if (qual.includes('ph.d') || qual.includes('phd')) return 'Ph.D. Holder';
  if (exp) {
    const match = exp.match(/(\d+)\+?\s*Years?/i);
    if (match) return `${match[1]}+ Yrs Exp`;
  }
  return 'Distinguished';
};

const ITEMS_PER_PAGE = 8;

export default function OurTeachers() {
  const [selectedDept, setSelectedDept] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const departments = ["All", "Arts", "Management", "Computer Application", "Commerce", "Fashion Designing", "Social Work"];

  // Filter teachers based on department
  const filteredTeachers = selectedDept === 'All'
    ? teachersData
    : teachersData.filter((t) => t.department === selectedDept);

  // Reset page when filter changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [selectedDept]);

  const totalItems = filteredTeachers.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paginatedTeachers = filteredTeachers.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <section className={styles.section} aria-labelledby="faculty-heading">
      <div className={styles.blobLeft} aria-hidden="true" />
      <div className={styles.blobRight} aria-hidden="true" />

      <div className={`${styles.container} sectionContainer`}>
        {/* Section Header */}
        <header className={styles.header}>
          <span className={styles.eyebrow}>
            <svg 
              className={styles.capIcon} 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              width="16" 
              height="16"
              aria-hidden="true"
            >
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
              <path d="M4.14 12.18L12 16.5l7.86-4.32V18c0 1.1-.9 2-2 2H6.14c-1.1 0-2-.9-2-2v-5.82z"/>
            </svg>
            DISTINGUISHED FACULTY
          </span>
          <h2 id="faculty-heading" className={styles.heading}>
            Learn From World-Class <span className={styles.headingAccent}>Educators & Scholars</span>
          </h2>
          <div className={styles.decorLine} aria-hidden="true" />
        </header>

        {/* Category Pills Filters */}
        <nav className={styles.filterContainer} aria-label="Faculty Department Filters">
          {departments.map((dept) => {
            const isActive = selectedDept === dept;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`${styles.filterBtn} ${isActive ? styles.activeFilterBtn : ''}`}
              >
                {dept}
                {isActive && (
                  <motion.span
                    layoutId="activeDeptIndicator"
                    className={styles.activePillIndicator}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bento Grid Faculty Showcase */}
        <div className={styles.gridWrapper}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedDept}-${currentPage}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={styles.bentoGrid}
            >
              {paginatedTeachers.map((teacher, index) => {
                // Highlight Featured Spotlight Card:
                // Make the first card of page 1 in selected categories a featured spotlight card
                const isFeatured = index === 0 && currentPage === 1;
                const badgeText = getFloatingBadge(teacher);

                return (
                  <article
                    key={teacher.id}
                    className={`${styles.card} ${isFeatured ? styles.featuredCard : ''}`}
                    onClick={() => setSelectedTeacher(teacher)}
                  >
                    {/* Glowing Accent for Spotlight elements */}
                    {isFeatured && <div className={styles.glowOverlay} />}

                    <div className={styles.imageFrame}>
                      {/* Floating Badge */}
                      <span className={styles.floatingTag}>{badgeText}</span>
                      
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={teacher.image}
                        alt={teacher.name}
                        className={styles.teacherImage}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/our-faculties/B.A/Dr. Samkit Shah/1-350.webp';
                        }}
                      />
                      {/* Subtle Bottom Gradient Overlay */}
                      <div className={styles.imageOverlay} />
                    </div>

                    <div className={styles.textContainer}>
                      <span className={styles.designation}>
                        {teacher.designation} • {teacher.department}
                      </span>
                      
                      <div className={styles.nameWrapper}>
                        <h3 className={styles.name}>{teacher.name}</h3>
                        <span className={styles.nameGoldBar} />
                      </div>

                      <p className={styles.bio}>{teacher.bio}</p>

                      <button 
                        className={styles.profileBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTeacher(teacher);
                        }}
                      >
                        View Academic Profile
                        <span className={styles.arrow}>→</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dynamic Pagination Bar */}
        {totalPages > 1 && (
          <div className={styles.paginationBar}>
            <div className={styles.paginationInfo}>
              Showing <span className={styles.boldText}>{startIndex + 1}–{endIndex}</span> of <span className={styles.boldText}>{totalItems}</span> Professors
            </div>

            <div className={styles.paginationControls}>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`${styles.pNavBtn} ${currentPage === 1 ? styles.disabledBtn : ''}`}
                aria-label="Previous Page"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <div className={styles.numericPages}>
                {Array.from({ length: totalPages }, (_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`${styles.pageNumberBtn} ${currentPage === pageNum ? styles.activePageNumber : ''}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`${styles.pNavBtn} ${currentPage === totalPages ? styles.disabledBtn : ''}`}
                aria-label="Next Page"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Glassmorphism Modal */}
      <AnimatePresence>
        {selectedTeacher && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTeacher(null)}
          >
            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className={styles.modalCloseBtn}
                onClick={() => setSelectedTeacher(null)}
                aria-label="Close modal"
              >
                &times;
              </button>
              
              <div className={styles.modalBody}>
                <div className={styles.modalImageWrapper}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedTeacher.image}
                    alt={selectedTeacher.name}
                    className={styles.modalImage}
                    onError={(e) => {
                      e.currentTarget.src = '/assets/our-faculties/B.A/Dr. Samkit Shah/1-350.webp';
                    }}
                  />
                </div>

                <div className={styles.modalTextInfo}>
                  <span className={styles.modalDeptBadge}>
                    {selectedTeacher.department.toUpperCase()}
                  </span>
                  <h3 className={styles.modalName}>{selectedTeacher.name}</h3>
                  <p className={styles.modalDesignation}>
                    {selectedTeacher.designation}
                  </p>

                  <hr className={styles.modalLine} />

                  <div className={styles.modalMetaGrid}>
                    <div className={styles.modalMetaItem}>
                      <span className={styles.metaLabel}>Qualification</span>
                      <span className={styles.metaValue}>{selectedTeacher.qualification}</span>
                    </div>
                    <div className={styles.modalMetaItem}>
                      <span className={styles.metaLabel}>Experience</span>
                      <span className={styles.metaValue}>{selectedTeacher.experience}</span>
                    </div>
                  </div>

                  <div className={styles.modalBioContainer}>
                    <h4 className={styles.modalBioTitle}>Biography & Academic Commitments</h4>
                    <p className={styles.modalBioText}>{selectedTeacher.bio}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
