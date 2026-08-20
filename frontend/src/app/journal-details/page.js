import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';

export const metadata = {
  title: 'Journal Details | Nandkunvarba Mahila College',
  description: 'Learn more about the academic journals, publication details, and guidelines at Nandkunvarba Mahila College.',
};

export default function JournalDetailsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Banner */}
        <section className="hero-fullscreen" style={{ minHeight: "50vh", height: "50vh", position: "relative", overflow: "hidden" }}>
          <div className="hero-bg-image" style={{ position: "absolute", inset: 0, zIndex: -2 }}>
            <Image 
              src="/assets/home/hero/2.jpg" 
              alt="Journal Details Banner" 
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          <div className="hero-overlay" style={{ position: "absolute", inset: 0, zIndex: -1, background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))" }}></div>
          
          <div className="container" style={{ paddingTop: "150px", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", paddingBottom: "80px", zIndex: 1, position: "relative" }}>
            <h1 className="hero-main-title" style={{ fontSize: "60px", fontWeight: "600", paddingRight: "15px", color: "#fff", margin: "0 0 1rem 0" }}>
              <em>Journal Details</em>
            </h1>
            
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
              <ol style={{ display: "flex", listStyle: "none", padding: 0, margin: 0, gap: "0.5rem", color: "var(--gold-500, #f59e0b)", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                <li><Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Home</Link></li>
                <li style={{ color: "rgba(255,255,255,0.5)" }}>&gt;</li>
                <li><span style={{ color: "rgba(255,255,255,0.7)" }}>About Us</span></li>
                <li style={{ color: "rgba(255,255,255,0.5)" }}>&gt;</li>
                <li aria-current="page" style={{ color: "var(--gold-500, #f59e0b)" }}>Journal Details</li>
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
                Academic Publications
              </span>
              <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--gray-900)", marginBottom: "1rem" }}>
                Nandkunvarba Mahila College Research Journal
              </h2>
              <p style={{ color: "var(--gray-700)", fontSize: "1.1rem", lineHeight: "1.8" }}>
                Our institution publishes a peer-reviewed academic journal biannually, providing a prominent platform for researchers, scholars, and academicians to publish high-quality research papers across multiple disciplines including Commerce, Arts, Management, and Humanities.
              </p>
            </div>

            {/* Grid for Details */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
              
              {/* Journal Info Card */}
              <div style={{ background: "var(--white)", padding: "2.5rem", borderRadius: "1rem", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", border: "1px solid var(--gray-200)" }}>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1.5rem", borderBottom: "2px solid var(--gold-500)", paddingBottom: "0.5rem" }}>
                  General Information
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <li style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--gray-100)", paddingBottom: "0.5rem" }}>
                    <span style={{ color: "var(--gray-500)", fontWeight: "600" }}>ISSN (Print)</span>
                    <strong style={{ color: "var(--gray-800)" }}>XXXX-XXXX</strong>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--gray-100)", paddingBottom: "0.5rem" }}>
                    <span style={{ color: "var(--gray-500)", fontWeight: "600" }}>Frequency</span>
                    <strong style={{ color: "var(--gray-800)" }}>Biannual</strong>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--gray-100)", paddingBottom: "0.5rem" }}>
                    <span style={{ color: "var(--gray-500)", fontWeight: "600" }}>Language</span>
                    <strong style={{ color: "var(--gray-800)" }}>English &amp; Gujarati</strong>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.5rem" }}>
                    <span style={{ color: "var(--gray-500)", fontWeight: "600" }}>Publisher</span>
                    <strong style={{ color: "var(--gray-800)" }}>NMC Publication Cell</strong>
                  </li>
                </ul>
              </div>

              {/* Call for Papers Card */}
              <div style={{ background: "var(--white)", padding: "2.5rem", borderRadius: "1rem", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", border: "1px solid var(--gray-200)" }}>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1.5rem", borderBottom: "2px solid var(--gold-500)", paddingBottom: "0.5rem" }}>
                  Call for Papers
                </h3>
                <p style={{ color: "var(--gray-600)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                  We invite original research papers, articles, and reviews for our upcoming winter volume. Submit your manuscripts formatted as per guidelines.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.9rem", color: "var(--gray-500)" }}>Submission Deadline:</span>
                  <strong style={{ color: "var(--gold-600)", fontSize: "1.1rem" }}>October 31, 2026</strong>
                </div>
              </div>

            </div>

            {/* Submission Guidelines Card */}
            <div style={{ background: "var(--white)", padding: "3rem", borderRadius: "1rem", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", border: "1px solid var(--gray-200)" }}>
              <h3 style={{ fontSize: "1.6rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1.5rem" }}>Submission Guidelines</h3>
              <ol style={{ paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "1rem", color: "var(--gray-700)", lineHeight: "1.7" }}>
                <li>Manuscripts must be original work, not submitted or published elsewhere.</li>
                <li>Submit soft copies in MS Word format (.doc or .docx) via email.</li>
                <li>All submissions undergo a double-blind peer review process.</li>
                <li>The paper must follow standard APA reference formatting.</li>
              </ol>
              <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid var(--gray-100)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <span style={{ display: "block", fontSize: "0.85rem", color: "var(--gray-500)", fontWeight: "600" }}>Submit articles directly to:</span>
                  <a href="mailto:editor.journal@nmc.edu.in" style={{ color: "var(--gold-600)", fontWeight: "700", textDecoration: "none", fontSize: "1.1rem" }}>editor.journal@nmc.edu.in</a>
                </div>
                <button style={{ background: "var(--gray-900)", color: "var(--white)", border: "none", padding: "0.8rem 1.5rem", borderRadius: "0.5rem", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer", transition: "background 0.3s" }}>
                  Download Author Guidelines (PDF)
                </button>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
