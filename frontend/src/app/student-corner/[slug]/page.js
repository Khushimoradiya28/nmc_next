import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || '';
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return {
    title: `${title} | Student Corner | Nandkunvarba Mahila College`,
  };
}

export default async function StudentCornerSubPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || '';
  
  // Format slug to readable title
  const pageTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Dynamic contents based on page slug
  const getContentData = () => {
    switch (slug) {
      case 'academic-programs':
        return {
          subtitle: "Course Offerings & Curriculums",
          description: "Nandkunvarba Mahila College offers a range of undergraduate and postgraduate programs designed to empower women with knowledge and industry-relevant skills.",
          details: (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {[
                { name: "Bachelor of Computer Applications (B.C.A.)", duration: "3 Years (6 Semesters)", eligibility: "10+2 with English" },
                { name: "Bachelor of Business Administration (B.B.A.)", duration: "3 Years (6 Semesters)", eligibility: "10+2 English Medium preferred" },
                { name: "Bachelor of Commerce (B.Com.)", duration: "3 Years (6 Semesters)", eligibility: "10+2 General/Science Stream" },
                { name: "Master of Commerce (M.Com.)", duration: "2 Years (4 Semesters)", eligibility: "Graduation in Commerce" }
              ].map((prog, idx) => (
                <div key={idx} style={{ background: "var(--white)", padding: "2rem", borderRadius: "0.8rem", border: "1px solid var(--gray-200)", boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
                  <h4 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1rem" }}>{prog.name}</h4>
                  <p style={{ margin: "0.3rem 0", color: "var(--gray-600)" }}><strong>Duration:</strong> {prog.duration}</p>
                  <p style={{ margin: "0.3rem 0", color: "var(--gray-600)" }}><strong>Eligibility:</strong> {prog.eligibility}</p>
                </div>
              ))}
            </div>
          )
        };
      case 'admission-form':
        return {
          subtitle: "Enrolment & Admissions 2026",
          description: "Follow the guidelines below to submit your admission applications. All admissions are processed through the central GCAS portal.",
          details: (
            <div style={{ background: "var(--white)", padding: "3rem", borderRadius: "1rem", border: "1px solid var(--gray-200)", boxShadow: "0 10px 25px rgba(0,0,0,0.03)" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1.5rem" }}>GCAS Centralised Admission Guide</h3>
              <ol style={{ paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "1rem", color: "var(--gray-700)", lineHeight: "1.7" }}>
                <li>Register on the central GCAS admission portal (gcas.gujarat.gov.in).</li>
                <li>Select 'Nandkunvarba Mahila College, Bhavnagar' as your preferred college.</li>
                <li>Fill in academic credentials and upload supporting documents.</li>
                <li>Once selected in the merit list, visit college campus for verification.</li>
              </ol>
              <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <a href="https://gcas.gujarat.gov.in/" target="_blank" rel="noopener noreferrer" style={{ background: "var(--gray-900)", color: "var(--white)", padding: "0.8rem 1.5rem", borderRadius: "0.5rem", textDecoration: "none", fontWeight: "600" }}>Go to GCAS Portal</a>
                <button style={{ background: "transparent", color: "var(--gray-900)", border: "1px solid var(--gray-900)", padding: "0.8rem 1.5rem", borderRadius: "0.5rem", fontWeight: "600", cursor: "pointer" }}>Download Help Document</button>
              </div>
            </div>
          )
        };
      case 'term-schedule':
        return {
          subtitle: "Academic Calendar 2026-27",
          description: "Plan your semesters with the official college schedule, including session start dates, internal exams, holidays, and university assessments.",
          details: (
            <div style={{ background: "var(--white)", padding: "2.5rem", borderRadius: "1rem", border: "1px solid var(--gray-200)", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--gray-200)", color: "var(--gray-800)", fontWeight: "700" }}>
                    <th style={{ padding: "1rem" }}>Academic Event</th>
                    <th style={{ padding: "1rem" }}>Tentative Date</th>
                  </tr>
                </thead>
                <tbody style={{ color: "var(--gray-700)", lineHeight: "1.6" }}>
                  <tr style={{ borderBottom: "1px solid var(--gray-100)" }}>
                    <td style={{ padding: "1rem" }}>Odd Semesters Commencement</td>
                    <td style={{ padding: "1rem" }}>June 15, 2026</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--gray-100)" }}>
                    <td style={{ padding: "1rem" }}>Odd Semesters Internal Exams</td>
                    <td style={{ padding: "1rem" }}>September 2026</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--gray-100)" }}>
                    <td style={{ padding: "1rem" }}>Odd Semesters MKBU Final Exams</td>
                    <td style={{ padding: "1rem" }}>November 2026</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "1rem" }}>Even Semesters Commencement</td>
                    <td style={{ padding: "1rem" }}>December 10, 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        };
      case 'syllabus-link':
        return {
          subtitle: "Course Syllabus & Curriculum Frameworks",
          description: "Download the updated syllabus for your respective undergraduate and postgraduate departments as prescribed by MKBU.",
          details: (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {["BCA", "BBA", "B.Com", "B.A. English", "B.A. Psychology", "M.Com"].map((course, idx) => (
                <div key={idx} style={{ background: "var(--white)", padding: "2rem", borderRadius: "0.8rem", border: "1px solid var(--gray-200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ margin: 0, fontWeight: "700", color: "var(--gray-900)" }}>{course} Syllabus</h4>
                  <button style={{ background: "var(--gray-900)", color: "var(--white)", border: "none", padding: "0.5rem 1rem", borderRadius: "0.3rem", fontWeight: "600", fontSize: "0.8rem", cursor: "pointer" }}>Download</button>
                </div>
              ))}
            </div>
          )
        };
      case 'uni-result-link':
        return {
          subtitle: "Maharaja Krishnakumarsinhji Bhavnagar University Results",
          description: "Check your semester final university exam results directly on the MKBU university result gateway page.",
          details: (
            <div style={{ background: "var(--white)", padding: "3rem", borderRadius: "1rem", border: "1px solid var(--gray-200)", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.03)" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1rem" }}>External Exam Results Portal</h3>
              <p style={{ color: "var(--gray-600)", marginBottom: "2rem" }}>You will be redirected to the official MKBU exam registry server to input your seat details and retrieve marksheet documents.</p>
              <a href="https://www.mkbhavuni.edu.in/" target="_blank" rel="noopener noreferrer" style={{ background: "var(--gray-900)", color: "var(--white)", padding: "0.8rem 2rem", borderRadius: "0.5rem", textDecoration: "none", fontWeight: "700", display: "inline-block" }}>Open University Result Page</a>
            </div>
          )
        };
      case 'tablet-scheme':
        return {
          subtitle: "Government Gujarat Tablet Distribution",
          description: "Eligible first-year college students can claim government tablets under the state educational technology welfare scheme.",
          details: (
            <div style={{ background: "var(--white)", padding: "3rem", borderRadius: "1rem", border: "1px solid var(--gray-200)", boxShadow: "0 10px 25px rgba(0,0,0,0.03)" }}>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1.5rem" }}>Eligibility &amp; Documents Required</h3>
              <ul style={{ paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "1rem", color: "var(--gray-700)", lineHeight: "1.6" }}>
                <li>Must be currently enrolled in 1st year (Semester 1).</li>
                <li>Submit GCAS Fee Payment Receipt.</li>
                <li>Aadhar Card copy and 12th Marksheet copy.</li>
                <li>Tablet Registration token receipt (issued at college office Counter 3).</li>
              </ul>
            </div>
          )
        };
      case 'online-lecture':
        return {
          subtitle: "Virtual Learning Rooms & E-Lectures",
          description: "Access live Microsoft Teams classrooms, digital presentations, and virtual reference video materials for distant learning support.",
          details: (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", flexWrap: "wrap" }}>
              <div style={{ background: "var(--white)", padding: "2.5rem", borderRadius: "1rem", border: "1px solid var(--gray-200)" }}>
                <h4 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1rem" }}>Microsoft Teams Classrooms</h4>
                <p style={{ color: "var(--gray-600)", lineHeight: "1.6" }}>Login using your institutional Microsoft ID (@nmc.edu.in) to access live streams and recorded session repositories.</p>
                <button style={{ background: "var(--gray-900)", color: "var(--white)", border: "none", padding: "0.7rem 1.5rem", borderRadius: "0.4rem", fontWeight: "600", marginTop: "1rem", cursor: "pointer" }}>Join MS Teams</button>
              </div>
              <div style={{ background: "var(--white)", padding: "2.5rem", borderRadius: "1rem", border: "1px solid var(--gray-200)" }}>
                <h4 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1rem" }}>SWAYAM Digital Platform</h4>
                <p style={{ color: "var(--gray-600)", lineHeight: "1.6" }}>Enroll in online certificate programs offered by NPTEL and UGC. Credits will transfer directly to academic score records.</p>
                <a href="https://swayam.gov.in/" target="_blank" rel="noopener noreferrer" style={{ background: "transparent", color: "var(--gray-900)", border: "1px solid var(--gray-900)", padding: "0.6rem 1.5rem", borderRadius: "0.4rem", fontWeight: "600", display: "inline-block", marginTop: "1rem", textDecoration: "none" }}>Access SWAYAM</a>
              </div>
            </div>
          )
        };
      case 'transportation-inquiry':
        return {
          subtitle: "NMC Free Bus Facility & Timetable",
          description: "To support women's education, the college offers 100% free transportation bus services across multiple routes in Bhavnagar city.",
          details: (
            <div style={{ background: "var(--white)", padding: "3rem", borderRadius: "1rem", border: "1px solid var(--gray-200)", boxShadow: "0 10px 25px rgba(0,0,0,0.03)" }}>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1.5rem" }}>Bus Routes &amp; Pick-up Schedule</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--gray-200)", color: "var(--gray-800)", fontWeight: "700" }}>
                    <th style={{ padding: "1rem" }}>Route Name</th>
                    <th style={{ padding: "1rem" }}>Key Pick-up Points</th>
                    <th style={{ padding: "1rem" }}>Departure Time</th>
                  </tr>
                </thead>
                <tbody style={{ color: "var(--gray-700)", lineHeight: "1.6" }}>
                  <tr style={{ borderBottom: "1px solid var(--gray-100)" }}>
                    <td style={{ padding: "1rem", fontWeight: "600" }}>Route A</td>
                    <td style={{ padding: "1rem" }}>Ghogha Circle, Kaliyabid, Talaja Road</td>
                    <td style={{ padding: "1rem" }}>07:15 AM</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--gray-100)" }}>
                    <td style={{ padding: "1rem", fontWeight: "600" }}>Route B</td>
                    <td style={{ padding: "1rem" }}>Sardar Nagar, Chitra, RTO Circle</td>
                    <td style={{ padding: "1rem" }}>07:20 AM</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "1rem", fontWeight: "600" }}>Route C</td>
                    <td style={{ padding: "1rem" }}>Halvad Road, Mahila College Chowk</td>
                    <td style={{ padding: "1rem" }}>07:30 AM</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid var(--gray-100)" }}>
                <span style={{ display: "block", fontSize: "0.85rem", color: "var(--gray-500)", fontWeight: "600" }}>For details, contact Transportation Cell:</span>
                <strong style={{ color: "var(--gray-800)", fontSize: "1.1rem" }}>+91-XXXXXX (Counter 4)</strong>
              </div>
            </div>
          )
        };
      default:
        return {
          subtitle: "Student Support Gateway",
          description: "Explore the different digital frameworks, resources, and services available for college students.",
          details: <div style={{ color: "var(--gray-500)" }}>Detailed section is under development.</div>
        };
    }
  };

  const { subtitle, description, details } = getContentData();

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero-fullscreen" style={{ minHeight: "50vh", height: "50vh", position: "relative", overflow: "hidden" }}>
          <div className="hero-bg-image" style={{ position: "absolute", inset: 0, zIndex: -2 }}>
            <Image 
              src="/assets/shared/misc/13.jpg" 
              alt="Student Corner Banner" 
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          <div className="hero-overlay" style={{ position: "absolute", inset: 0, zIndex: -1, background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))" }}></div>
          
          <div className="container" style={{ paddingTop: "150px", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", paddingBottom: "80px", zIndex: 1, position: "relative" }}>
            <h1 className="hero-main-title" style={{ paddingRight: "15px", color: "#fff", margin: "0 0 1rem 0" }}>
              <em>{pageTitle}</em>
            </h1>
            
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
              <ol style={{ display: "flex", listStyle: "none", padding: 0, margin: 0, gap: "0.5rem", color: "var(--gold-500, #f59e0b)", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                <li><Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Home</Link></li>
                <li style={{ color: "rgba(255,255,255,0.5)" }}>&gt;</li>
                <li><span style={{ color: "rgba(255,255,255,0.7)" }}>Student Corner</span></li>
                <li style={{ color: "rgba(255,255,255,0.5)" }}>&gt;</li>
                <li aria-current="page" style={{ color: "var(--gold-500, #f59e0b)" }}>{pageTitle}</li>
              </ol>
            </nav>
          </div>
        </section>

        {/* Content Section */}
        <section className="section-padding" style={{ background: "var(--slate-50)", padding: "5rem 0" }}>
          <div className="container" style={{ maxWidth: "1000px" }}>
            
            {/* Intro Card */}
            <div style={{ background: "var(--white)", padding: "3rem", borderRadius: "1rem", boxShadow: "0 10px 25px rgba(0,0,0,0.03)", marginBottom: "3rem", border: "1px solid var(--gray-200)" }}>
              <span style={{ background: "var(--gold-100)", color: "var(--gold-800)", padding: "0.4rem 1rem", borderRadius: "2rem", fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", display: "inline-block", marginBottom: "1.5rem" }}>
                {subtitle}
              </span>
              <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--gray-900)", marginBottom: "1rem" }}>
                {pageTitle}
              </h2>
              <p style={{ color: "var(--gray-700)", fontSize: "1.1rem", lineHeight: "1.8", margin: 0 }}>
                {description}
              </p>
            </div>

            {/* Render sub-content */}
            {details}

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
