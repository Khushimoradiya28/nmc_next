import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || '';
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return {
    title: `${title} | Alumni Legacy | Nandkunvarba Mahila College`,
  };
}

export default async function AlumniSubPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || '';
  
  // Format slug to readable title
  const pageTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Dynamic contents based on page slug
  const getContentData = () => {
    switch (slug) {
      case 'alumni-association':
        return {
          subtitle: "Institutional Sisterhood Network",
          description: "Our Alumni Association brings together thousands of graduates working across diverse sectors globally, fostering a strong network of mentorship, guidance, and career development support.",
          details: (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
              <div style={{ background: "var(--white)", padding: "2.5rem", borderRadius: "1rem", border: "1px solid var(--gray-200)", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                <h4 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1rem" }}>Mentorship Program</h4>
                <p style={{ color: "var(--gray-600)", lineHeight: "1.6" }}>Connect with senior alumni working in IT, banking, design, and academic fields to get career counseling support and mock interview feedback.</p>
              </div>
              <div style={{ background: "var(--white)", padding: "2.5rem", borderRadius: "1rem", border: "1px solid var(--gray-200)", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                <h4 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1rem" }}>Alumni Registration</h4>
                <p style={{ color: "var(--gray-600)", lineHeight: "1.6" }}>If you are a graduate of Nandkunvarba Mahila College, fill out the registration form to join the official alumni database and receive event invitations.</p>
                <button style={{ background: "var(--gray-900)", color: "var(--white)", border: "none", padding: "0.6rem 1.2rem", borderRadius: "0.4rem", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer", marginTop: "1rem" }}>Register Now</button>
              </div>
            </div>
          )
        };
      case 'other-details':
        return {
          subtitle: "Legacy Milestones & Events",
          description: "Explore the different achievements of our alumnae who have brought pride to the college through their national and international accomplishments.",
          details: (
            <div style={{ background: "var(--white)", padding: "3rem", borderRadius: "1rem", border: "1px solid var(--gray-200)", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1.5rem" }}>Annual Alumni Meet Highlights</h3>
              <p style={{ color: "var(--gray-700)", lineHeight: "1.7", marginBottom: "1.5rem" }}>
                Every year, NMC hosts an alumni reunion on campus. It provides a platform for former students to share their industry experiences with current students, conduct workshops, and coordinate scholarship donations for deserving students.
              </p>
              <div style={{ borderLeft: "4px solid var(--gold-500)", paddingLeft: "1.5rem", margin: "1.5rem 0", color: "var(--gray-600)", fontStyle: "italic" }}>
                "The guidance and practical training I received at NMC was the cornerstone of my corporate career." — Krina Gohil, Fashion Designer (Batch 2024)
              </div>
            </div>
          )
        };
      case 'feedback-link':
        return {
          subtitle: "Feedback & Evaluation Gateway",
          description: "We constantly strive to improve our educational quality and student experience. Select your category below to fill out the feedback forms.",
          details: (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {[
                { type: "Student Feedback Form", desc: "For currently enrolled students to evaluate curriculum, teaching, and infrastructure." },
                { type: "Alumni Feedback Form", desc: "For graduates to evaluate the relevance of course objectives in their professional careers." },
                { type: "Employer Feedback Form", desc: "For organizations hiring our students to evaluate their skill competencies." }
              ].map((form, idx) => (
                <div key={idx} style={{ background: "var(--white)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--gray-200)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h4 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "0.5rem" }}>{form.type}</h4>
                    <p style={{ color: "var(--gray-600)", fontSize: "0.9rem", lineHeight: "1.5", marginBottom: "1.5rem" }}>{form.desc}</p>
                  </div>
                  <button style={{ background: "var(--gray-900)", color: "var(--white)", border: "none", padding: "0.6rem 1rem", borderRadius: "0.4rem", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer", width: "fit-content" }}>Open Form</button>
                </div>
              ))}
            </div>
          )
        };
      default:
        return {
          subtitle: "Alumni Legacy Support",
          description: "Connect with the institutional alumni network and check feedback resources.",
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
              src="/assets/home/hero/4.jpg" 
              alt="Alumni Legacy Banner" 
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
                <li><span style={{ color: "rgba(255,255,255,0.7)" }}>Contact Us</span></li>
                <li style={{ color: "rgba(255,255,255,0.5)" }}>&gt;</li>
                <li><span style={{ color: "rgba(255,255,255,0.7)" }}>Alumni Legacy</span></li>
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
