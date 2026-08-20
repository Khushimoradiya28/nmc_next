import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';

// Helper to format title based on slug
const getFormatTitle = (slug) => {
  switch (slug) {
    case 'vision-mission': return 'Vision / Mission';
    case 'composition-of-iqac': return 'Composition of IQAC';
    case 'strategies-benefits-functions': return 'Strategies / Benefits / Functions';
    case 'conferences-fdp-workshops': return 'Conferences / FDP / workshops';
    case 'naac': return 'NAAC';
    case 'nirf': return 'NIRF';
    default: return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || '';
  const title = getFormatTitle(slug);
  return {
    title: `${title} | IQAC | Nandkunvarba Mahila College`,
  };
}

export default async function IQACSubPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || '';
  
  const pageTitle = getFormatTitle(slug);

  // Dynamic contents based on page slug
  const getContentData = () => {
    switch (slug) {
      case 'vision-mission':
        return {
          subtitle: "Quality Assurance Mandate",
          description: "Internal Quality Assurance Cell (IQAC) aims to develop a system for conscious, consistent, and catalytic action to improve the academic and administrative performance of the institution.",
          details: (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", flexWrap: "wrap" }}>
              <div style={{ background: "var(--white)", padding: "2.5rem", borderRadius: "1rem", border: "1px solid var(--gray-200)" }}>
                <h4 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1rem" }}>IQAC Vision</h4>
                <p style={{ color: "var(--gray-600)", lineHeight: "1.6" }}>To build a quality-centric institutional culture that drives pedagogical excellence, research integration, and comprehensive student growth values.</p>
              </div>
              <div style={{ background: "var(--white)", padding: "2.5rem", borderRadius: "1rem", border: "1px solid var(--gray-200)" }}>
                <h4 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1rem" }}>IQAC Mission</h4>
                <ul style={{ paddingLeft: "1.2rem", color: "var(--gray-600)", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <li>Promoting academic quality standards through student-centric learning.</li>
                  <li>Fostering feedback analysis structures to review teaching plans.</li>
                  <li>Facilitating teacher training and professional faculty audits.</li>
                </ul>
              </div>
            </div>
          )
        };
      case 'composition-of-iqac':
        return {
          subtitle: "Executive Committee Members",
          description: "The IQAC committee consists of members from college leadership, senior faculty, administrative staff, local industry mentors, and student representatives.",
          details: (
            <div style={{ background: "var(--white)", padding: "2.5rem", borderRadius: "1rem", border: "1px solid var(--gray-200)", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--gray-200)", color: "var(--gray-800)", fontWeight: "700" }}>
                    <th style={{ padding: "1rem" }}>Committee Designation</th>
                    <th style={{ padding: "1rem" }}>Representative Name</th>
                  </tr>
                </thead>
                <tbody style={{ color: "var(--gray-700)", lineHeight: "1.6" }}>
                  <tr style={{ borderBottom: "1px solid var(--gray-100)" }}>
                    <td style={{ padding: "1rem", fontWeight: "600" }}>Chairperson</td>
                    <td style={{ padding: "1rem" }}>Dr. Vijaysinh Gohil (Principal)</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--gray-100)" }}>
                    <td style={{ padding: "1rem", fontWeight: "600" }}>IQAC Coordinator</td>
                    <td style={{ padding: "1rem" }}>Prof. H. M. Patel</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--gray-100)" }}>
                    <td style={{ padding: "1rem", fontWeight: "600" }}>Management Representative</td>
                    <td style={{ padding: "1rem" }}>Shri Sahajanand Education Trust Trustee</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "1rem", fontWeight: "600" }}>Senior Faculty Members</td>
                    <td style={{ padding: "1rem" }}>Prof. K. R. Mehta, Dr. S. D. Vyas, Prof. R. T. Mori</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        };
      case 'strategies-benefits-functions':
        return {
          subtitle: "IQAC Quality Roadmaps",
          description: "The IQAC cell serves as the chief auditing and implementation wing of the institution, ensuring academic performance checks and student feedback integration.",
          details: (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
              <div style={{ background: "var(--white)", padding: "2.5rem", borderRadius: "1rem", border: "1px solid var(--gray-200)" }}>
                <h4 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1rem" }}>Core Strategies</h4>
                <p style={{ color: "var(--gray-600)", lineHeight: "1.6" }}>Ensuring timely, efficient, and progressive performance of academic tasks and optimization of modern learning tools.</p>
              </div>
              <div style={{ background: "var(--white)", padding: "2.5rem", borderRadius: "1rem", border: "1px solid var(--gray-200)" }}>
                <h4 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1rem" }}>Key Benefits</h4>
                <p style={{ color: "var(--gray-600)", lineHeight: "1.6" }}>Better decision-making frameworks for college development and high quality of vocational skill certification courses.</p>
              </div>
              <div style={{ background: "var(--white)", padding: "2.5rem", borderRadius: "1rem", border: "1px solid var(--gray-200)" }}>
                <h4 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1rem" }}>Functions</h4>
                <p style={{ color: "var(--gray-600)", lineHeight: "1.6" }}>Reviewing student/parent feedback, conducting departmental AAA audits, and submitting AQAR reports yearly.</p>
              </div>
            </div>
          )
        };
      case 'conferences-fdp-workshops':
        return {
          subtitle: "Faculty Development Programs & Seminars",
          description: "IQAC coordinates academic workshops and faculty development programs (FDP) to train teachers on digital pedagogical methodologies and research publication standards.",
          details: (
            <div style={{ background: "var(--white)", padding: "2.5rem", borderRadius: "1rem", border: "1px solid var(--gray-200)", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1.5rem" }}>Upcoming FDP Calendar 2026-27</h3>
              <ul style={{ paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "1rem", color: "var(--gray-700)", lineHeight: "1.6" }}>
                <li><strong>September 2026:</strong> Workshop on AI Tools for Interactive Virtual Classrooms.</li>
                <li><strong>December 2026:</strong> Seminar on Peer-Reviewed Academic Research Paper Writing.</li>
                <li><strong>February 2027:</strong> FDP on Implementing NEP 2020 Credit Framework structures.</li>
              </ul>
            </div>
          )
        };
      case 'naac':
        return {
          subtitle: "National Assessment & Accreditation Council Audits",
          description: "The college maintains rigorous academic standards and participates in the NAAC accreditation assessment cycles.",
          details: (
            <div style={{ background: "var(--white)", padding: "3rem", borderRadius: "1rem", border: "1px solid var(--gray-200)", boxShadow: "0 10px 25px rgba(0,0,0,0.03)" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1rem" }}>NAAC AQAR Submission Status</h3>
              <p style={{ color: "var(--gray-600)", marginBottom: "2rem" }}>All Annual Quality Assurance Reports (AQAR) are compiled by the IQAC committee and submitted to NAAC registry databases in accordance with regulatory rules.</p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button style={{ background: "var(--gray-900)", color: "var(--white)", border: "none", padding: "0.8rem 1.5rem", borderRadius: "0.5rem", fontWeight: "600", cursor: "pointer" }}>Download NAAC Certificate (PDF)</button>
                <button style={{ background: "transparent", color: "var(--gray-900)", border: "1px solid var(--gray-900)", padding: "0.8rem 1.5rem", borderRadius: "0.5rem", fontWeight: "600", cursor: "pointer" }}>View AQAR Reports</button>
              </div>
            </div>
          )
        };
      case 'nirf':
        return {
          subtitle: "National Institutional Ranking Framework",
          description: "Evaluating institutional data parameters across teaching quality, graduation outcomes, research outputs, and community outreach metrics for NIRF rankings.",
          details: (
            <div style={{ background: "var(--white)", padding: "3rem", borderRadius: "1rem", border: "1px solid var(--gray-200)", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", textAlign: "center" }}>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1rem" }}>NIRF Data Submission</h3>
              <p style={{ color: "var(--gray-600)", marginBottom: "2rem", maxWidth: "700px", margin: "0 auto 2rem auto" }}>Our institutional metrics are submitted annually. You can download the complete submitted data sheets below.</p>
              <button style={{ background: "var(--gray-900)", color: "var(--white)", border: "none", padding: "0.8rem 2rem", borderRadius: "0.5rem", fontWeight: "700", cursor: "pointer" }}>Download NIRF Report 2026 (PDF)</button>
            </div>
          )
        };
      default:
        return {
          subtitle: "Internal Quality Assurance Cell",
          description: "Internal audit structures ensuring college progress.",
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
              src="/assets/home/hero/2.jpg" 
              alt="IQAC Banner" 
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          <div className="hero-overlay" style={{ position: "absolute", inset: 0, zIndex: -1, background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))" }}></div>
          
          <div className="container" style={{ paddingTop: "150px", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", paddingBottom: "80px", zIndex: 1, position: "relative" }}>
            <h1 className="hero-main-title" style={{ fontSize: "60px", fontWeight: "600", paddingRight: "15px", color: "#fff", margin: "0 0 1rem 0" }}>
              <em>{pageTitle}</em>
            </h1>
            
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
              <ol style={{ display: "flex", listStyle: "none", padding: 0, margin: 0, gap: "0.5rem", color: "var(--gold-500, #f59e0b)", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                <li><Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Home</Link></li>
                <li style={{ color: "rgba(255,255,255,0.5)" }}>&gt;</li>
                <li><span style={{ color: "rgba(255,255,255,0.7)" }}>IQAC</span></li>
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
