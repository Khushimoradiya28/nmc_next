import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || '';
  const title = slug === 'top-10' ? 'Top 10' : slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return {
    title: `${title} | Toppers | Nandkunvarba Mahila College`,
  };
}

export default async function ToppersSubPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || '';
  
  // Format slug to readable title
  const pageTitle = slug === 'top-10' ? 'Top-10' : slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Dynamic contents based on page slug
  const getContentData = () => {
    switch (slug) {
      case 'gold-medalist':
        return {
          subtitle: "Maharaja Krishnakumarsinhji Bhavnagar University Rankers",
          description: "Our pride, our achievers. These students secured the prestigious Gold Medals at the university level through outstanding academic performances.",
          details: (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
              {[
                { name: "Anjali K. Gohil", course: "B.C.A.", year: "2025", cgpa: "9.68", photo: "/assets/home/hero/1.jpg" },
                { name: "Priya R. Mori", course: "B.B.A.", year: "2024", cgpa: "9.52", photo: "/assets/home/hero/2.jpg" },
                { name: "Meera D. Bhatt", course: "B.Com.", year: "2024", cgpa: "9.45", photo: "/assets/home/hero/3.jpg" }
              ].map((medalist, idx) => (
                <div key={idx} style={{ background: "var(--white)", borderRadius: "1rem", overflow: "hidden", border: "1px solid var(--gray-200)", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", textAlign: "center" }}>
                  <div style={{ position: "relative", height: "200px", width: "100%" }}>
                    <Image src={medalist.photo} alt={medalist.name} fill style={{ objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: "10px", right: "10px", background: "var(--gold-500)", color: "var(--white)", padding: "0.2rem 0.6rem", borderRadius: "1rem", fontSize: "0.75rem", fontWeight: "700" }}>
                      Gold Medalist
                    </div>
                  </div>
                  <div style={{ padding: "1.5rem" }}>
                    <h4 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--gray-900)", margin: "0 0 0.5rem 0" }}>{medalist.name}</h4>
                    <p style={{ color: "var(--gray-500)", margin: "0.2rem 0", fontSize: "0.9rem" }}><strong>Course:</strong> {medalist.course}</p>
                    <p style={{ color: "var(--gray-500)", margin: "0.2rem 0", fontSize: "0.9rem" }}><strong>Passing Year:</strong> {medalist.year}</p>
                    <p style={{ color: "var(--gold-600)", margin: "0.5rem 0 0 0", fontSize: "1.1rem", fontWeight: "700" }}>CGPA: {medalist.cgpa}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        };
      case 'top-10':
        return {
          subtitle: "Department Wise Top Scorers",
          description: "Meet the top 10 academic achievers across our key degree departments who have shown exceptional dedication and excellence in their coursework.",
          details: (
            <div style={{ background: "var(--white)", padding: "2.5rem", borderRadius: "1rem", border: "1px solid var(--gray-200)", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "500px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--gray-200)", color: "var(--gray-800)", fontWeight: "700" }}>
                      <th style={{ padding: "1rem" }}>Rank</th>
                      <th style={{ padding: "1rem" }}>Student Name</th>
                      <th style={{ padding: "1rem" }}>Department</th>
                      <th style={{ padding: "1rem" }}>Percentage / CGPA</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "var(--gray-700)", lineHeight: "1.6" }}>
                    {[
                      { rank: "1st", name: "Gohil Anjali K.", dept: "B.C.A.", score: "9.68 CGPA" },
                      { rank: "2nd", name: "Mori Priya R.", dept: "B.B.A.", score: "9.52 CGPA" },
                      { rank: "3rd", name: "Bhatt Meera D.", dept: "B.Com.", score: "9.45 CGPA" },
                      { rank: "4th", name: "Shah Krina G.", dept: "B.C.A.", score: "9.30 CGPA" },
                      { rank: "5th", name: "Pathak Vidhi N.", dept: "B.A. English", score: "9.15 CGPA" }
                    ].map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid var(--gray-100)" }}>
                        <td style={{ padding: "1rem", fontWeight: "700", color: "var(--gold-600)" }}>{row.rank}</td>
                        <td style={{ padding: "1rem", fontWeight: "600" }}>{row.name}</td>
                        <td style={{ padding: "1rem" }}>{row.dept}</td>
                        <td style={{ padding: "1rem" }}>{row.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        };
      default:
        return {
          subtitle: "Academic Honours Portal",
          description: "Browse the lists of gold medalists and top departmental achievers.",
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
              src="/assets/home/hero/5.jpg" 
              alt="Toppers Banner" 
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
                <li><span style={{ color: "rgba(255,255,255,0.7)" }}>Toppers</span></li>
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
