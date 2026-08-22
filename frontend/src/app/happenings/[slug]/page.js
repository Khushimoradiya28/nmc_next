import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || '';
  const title = slug === 'mous' ? 'MoUs' : slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return {
    title: `${title} | Happenings | Nandkunvarba Mahila College`,
  };
}

export default async function HappeningsSubPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || '';
  
  // Format slug to readable title
  const pageTitle = slug === 'mous' ? 'MoUs' : slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Dynamic contents based on page slug
  const getContentData = () => {
    switch (slug) {
      case 'news':
        return {
          subtitle: "College Media & Press Releases",
          description: "Stay updated with the latest press releases, media coverages, and print news regarding accomplishments of students and faculty members at Nandkunvarba Mahila College.",
          details: (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
              {[
                { title: "NMC Students Win Zonal Youth Festival Championships", date: "August 12, 2026", source: "Divya Bhaskar" },
                { title: "Research Cell Hosts National Commerce Conference", date: "July 28, 2026", source: "Gujarat Samachar" },
                { title: "NMC Alumni Association Declares Scholarship Funds", date: "July 15, 2026", source: "Sandesh News" }
              ].map((news, idx) => (
                <div key={idx} style={{ background: "var(--white)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--gray-200)", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--gray-500)", fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", marginBottom: "1rem" }}>
                    <span>{news.date}</span>
                    <span style={{ color: "var(--gold-600)" }}>{news.source}</span>
                  </div>
                  <h4 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--gray-900)", lineHeight: "1.4", marginBottom: "1.5rem" }}>{news.title}</h4>
                  <button style={{ background: "transparent", color: "var(--gray-900)", border: "1px solid var(--gray-900)", padding: "0.5rem 1rem", borderRadius: "0.4rem", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" }}>Read Coverage</button>
                </div>
              ))}
            </div>
          )
        };
      case 'events':
        return {
          subtitle: "Institutional Events & Gatherings",
          description: "A summary of recent and upcoming general campus events, guest lectures, cultural gatherings, and sports tournaments.",
          details: (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              {[
                { name: "Orientation Day 2026", desc: "Welcoming the newly admitted students to their academic tracks.", date: "Aug 20, 2026" },
                { name: "Annual Sports Meet", desc: "A week-long indoor and outdoor athletics championship event.", date: "Dec 18, 2026" },
                { name: "National Seminar on Women Empowerment", desc: "Key lectures by academic researchers and prominent social leaders.", date: "Jan 12, 2027" }
              ].map((evt, idx) => (
                <div key={idx} style={{ background: "var(--white)", borderRadius: "1rem", overflow: "hidden", border: "1px solid var(--gray-200)", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                  <div style={{ background: "var(--gray-900)", padding: "1.5rem 2rem", color: "var(--white)" }}>
                    <span style={{ fontSize: "0.85rem", opacity: 0.7 }}>Event Date: {evt.date}</span>
                    <h4 style={{ fontSize: "1.2rem", fontWeight: "700", margin: "0.5rem 0 0 0" }}>{evt.name}</h4>
                  </div>
                  <div style={{ padding: "2rem" }}>
                    <p style={{ color: "var(--gray-600)", lineHeight: "1.6", margin: "0 0 1.5rem 0" }}>{evt.desc}</p>
                    <button style={{ background: "transparent", color: "var(--gray-900)", border: "1px solid var(--gray-900)", padding: "0.5rem 1.2rem", borderRadius: "0.3rem", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" }}>View Highlights</button>
                  </div>
                </div>
              ))}
            </div>
          )
        };
      case 'notice-circular':
        return {
          subtitle: "Official Circulars & Notice Archives",
          description: "Access the complete library of institutional notices, curriculum releases, guidelines, and executive announcements.",
          details: (
            <div style={{ background: "var(--white)", padding: "2.5rem", borderRadius: "1rem", border: "1px solid var(--gray-200)", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  { title: "Circular 2026/04: Odd Semester Enrollment verification dates", date: "Aug 18, 2026" },
                  { title: "Anti-Ragging Squad Campus Monitoring Guidelines", date: "Aug 15, 2026" },
                  { title: "Syllabus revision updates for M.Com Sem-I & II", date: "Aug 10, 2026" }
                ].map((notice, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: idx !== 2 ? "1px solid var(--gray-100)" : "none", paddingBottom: idx !== 2 ? "1.2rem" : 0, paddingTop: idx !== 0 ? "1.2rem" : 0, flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <span style={{ fontSize: "0.8rem", color: "var(--gray-400)", fontWeight: "700" }}>{notice.date}</span>
                      <h4 style={{ margin: "0.3rem 0 0 0", color: "var(--gray-800)", fontWeight: "600" }}>{notice.title}</h4>
                    </div>
                    <button style={{ background: "var(--gray-900)", color: "var(--white)", border: "none", padding: "0.5rem 1.2rem", borderRadius: "0.4rem", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" }}>View Notice</button>
                  </div>
                ))}
              </div>
            </div>
          )
        };
      case 'mous':
        return {
          subtitle: "Memorandum of Understanding Collaborations",
          description: "Partnering with leading regional and national organizations to provide internship pathways, vocational training modules, and research resources.",
          details: (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
              {[
                { partner: "Tata Consultancy Services (TCS)", area: "Technical Training & Placement Drives" },
                { partner: "MKBU Commerce Research Cell", area: "Joint Seminars & Academic Publications" },
                { partner: "Regional Vocational Center", area: "Apparel Designing & Craft Workshops" }
              ].map((mou, idx) => (
                <div key={idx} style={{ background: "var(--white)", padding: "2.5rem", borderRadius: "1rem", border: "1px solid var(--gray-200)", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                  <div style={{ width: "50px", height: "50px", background: "var(--gold-50)", color: "var(--gold-600)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <h4 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "0.5rem" }}>{mou.partner}</h4>
                  <p style={{ color: "var(--gray-500)", margin: 0, fontSize: "0.95rem" }}><strong>Focus:</strong> {mou.area}</p>
                </div>
              ))}
            </div>
          )
        };
      default:
        return {
          subtitle: "Institutional News & Events Portal",
          description: "Browse academic updates, press coverages, circular archives, and corporate MoUs.",
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
              src="/assets/home/hero/3.jpg" 
              alt="Happenings Banner" 
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
                <li><span style={{ color: "rgba(255,255,255,0.7)" }}>Happenings</span></li>
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
