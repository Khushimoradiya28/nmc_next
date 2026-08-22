import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import styles from './page.module.css';

export const metadata = {
  title: 'About Us | Nandkunvarba Mahila College',
  description: 'Learn about Nandkunvarba Mahila College — our history, vision, mission, and faculty.',
};

export default function Page() {
  return (
    <>
      <Header />
      <main>
        {/* Scroll Progress Indicator Bar */}




        <section className="hero-fullscreen" id="home" style={{ minHeight: "50vh", height: "50vh" }}>
          <div className="hero-bg-image">
            <Image src="/assets/home/hero/2.jpg" alt="About Us Banner" width={1400} height={700} className="hero-bg-img" />
          </div>
          <div className="hero-overlay" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))" }}></div>
          <div className="hero-content container"
            style={{ paddingTop: "100px", display: "flex", alignItems: "flex-end", height: "100%", paddingBottom: "80px" }}>
            <h1 className="hero-main-title"><em>About Us</em></h1>
          </div>
        </section>


        {/* COLLEGE OVERVIEW SECTION */}
        <section className="section-padding" id="overview" style={{ padding: "3rem 0" }}>
          <div className="container">
            <div className="about-overview-grid" style={{ marginTop: "0" }}>
              <div className="about-overview-left">
                <div className="about-premium-tag" style={{ marginBottom: "0.5rem", alignSelf: "flex-start" }}>
                  <span className="about-tag-dot"></span>
                  <span>NMC Overview</span>
                </div>
                <h2 className="vm-main-title" style={{ marginBottom: "1.25rem" }}>
                  College <span>Overview</span>
                </h2>
                <p className="about-overview-lead">
                  Nandkunvarba Mahila College (NMC) is a premier institution dedicated exclusively to the higher education
                  and holistic development of women. Affiliated with Maharaja Krishnakumarsinhji Bhavnagar University
                  (MKBU), NMC offers a wide array of undergraduate and postgraduate programs.
                </p>
                <p className="about-overview-body">
                  With state-of-the-art infrastructure, highly experienced faculty members, and unique student welfare
                  initiatives like a 100% free bus service and robust placement support, the college stands as a beacon of
                  women's empowerment, fostering intellect, autonomy, and leadership in the region.
                </p>
              </div>

              <div className="about-overview-cards">
                <div className="about-overview-card">
                  <div className="about-card-icon-wrap">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  </div>
                  <h3 className="about-card-title">Exclusive Women's College</h3>
                  <p className="about-card-desc">Empowering female leaders through focused education since 2009.</p>
                </div>

                <div className="about-overview-card">
                  <div className="about-card-icon-wrap">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <h3 className="about-card-title">MKBU Affiliated</h3>
                  <p className="about-card-desc">Degrees affiliated with M.K. Bhavnagar University for academic reliability.</p>
                </div>

                <div className="about-overview-card">
                  <div className="about-card-icon-wrap">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="3" width="16" height="16" rx="2" ry="2" />
                      <path d="M4 11h16M9 19v3M15 19v3" />
                      <circle cx="8" cy="15" r="1" />
                      <circle cx="16" cy="15" r="1" />
                    </svg>
                  </div>
                  <h3 className="about-card-title">100% Free Bus</h3>
                  <p className="about-card-desc">Fully subsidized transport covering 40+ routes across the region.</p>
                </div>

                <div className="about-overview-card">
                  <div className="about-card-icon-wrap">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <h3 className="about-card-title">Placement Assistance</h3>
                  <p className="about-card-desc">Dedicated placement cell connecting graduates to top opportunities.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5B. OUR VISION & MISSION - LUXURY CREATIVE SECTION */}
        <section className="section-padding vision-mission-section" id="vision-mission">
          {/* Ambient glowing mesh background */}
          <div className="vm-bg-mesh">
            <div className="vm-glow-orb vm-glow-orb-1"></div>
            <div className="vm-glow-orb vm-glow-orb-2"></div>
            <div className="vm-glow-orb vm-glow-orb-3"></div>
            <div className="vm-grid-pattern"></div>
          </div>

          <div className="container">
            {/* Section Header */}
            <div className="vm-header-wrap">
              <div className="about-premium-tag">
                <span className="about-tag-dot"></span>
                <span>Guiding Institutional Philosophy</span>
              </div>
              <h2 className="vm-main-title">Vision &amp; <span>Mission</span></h2>
              <p className="vm-main-subtitle">Fostering intellect, autonomy, and leadership to shape enlightened women leaders for
                tomorrow's world.</p>
            </div>

            {/* Luxury Dual Grid Layout */}
            <div className="vm-luxury-grid">

              {/* CARD 1: OUR VISION */}
              <div className="vm-simple-card vm-card-blue">
                {/* Light backdrop SVG vector icon */}
                <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="rgba(2, 132, 199, 0.06)" strokeWidth="1.2" >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>

                <h3 className="vm-simple-title">Our Vision</h3>
                <p className="vm-simple-text">Our vision is to empower girls through quality education to make them realize their
                  full potential &amp; contribute to transforming societies where gender equality becomes a reality. We aim to
                  develop distinctive, pioneering, educational opportunities including regional and global partnerships that
                  lead to student success, sustainable communities, and differentiation of the institution within the state
                  and nation. We are also committed to cultivate and encourage a challenging, accommodating, student-centered
                  conducive environment that is characterized by academic eminence, inspiring and preparing girls to serve as
                  ethical, enlightened citizens and leaders in an increasingly intricate, multifarious, and global
                  environment.</p>
                <div className="vm-simple-badges vm-badges-blue">
                  <span className="vm-simple-badge">EMPOWERMENT</span>
                  <span className="vm-simple-badge">GLOBAL VISION</span>
                  <span className="vm-simple-badge">GENDER EQUALITY</span>
                </div>
              </div>

              {/* CARD 2: OUR MISSION */}
              <div className="vm-simple-card vm-card-gold">
                {/* Light backdrop SVG vector icon */}
                <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="rgba(245, 158, 11, 0.07)" strokeWidth="1.2" >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>

                <h3 className="vm-simple-title">Our Mission</h3>
                <p className="vm-simple-text">To improve the quality and availability of girls' education. To create a desire and
                  to provide an ambience that encourages the apperception, dissemination, and origination of new ideas and
                  understanding. To stimulate and foster the latent curiosity in every learner. To encourage students to
                  challenge the status quo and to create a spirit of inquiry, to generate free exchange of thoughts and ideas,
                  and to provide the resources to explore. To nurture young minds in an environment that is non-judgmental,
                  unbiased and liberated. To create awareness of the responsibility and accountability that goes hand-in-hand
                  with freedom. To empower learners with effective career planning skills. To advocate diversity through a
                  personalized approach.</p>
                <div className="vm-simple-badges vm-badges-gold">
                  <span className="vm-simple-badge">QUALITY EDUCATION</span>
                  <span className="vm-simple-badge">CURIOSITY</span>
                  <span className="vm-simple-badge">CAREER GROWTH</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 1. HISTORY & LEGACY */}
        <section className="section-padding bg-light" id="history">
          <div className="container">
            <div className="vm-header-wrap vm-header-left">
              <div className="about-premium-tag">
                <span className="about-tag-dot"></span>
                <span>Our Journey</span>
              </div>
              <h2 className="vm-main-title">History &amp; <span>Legacy</span></h2>

              <div className="vm-content-grid vm-content-grid-lg">
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ overflow: "hidden", borderRadius: "1.5rem", boxShadow: "0 20px 45px rgba(0,0,0,0.08)", display: "block" }}>
                    <Image
                      src="/assets/home/hero/2.jpg"
                      alt="Historical photo"
                      width={1400}
                      height={700}
                      style={{ display: "block", width: "100%", height: "auto", transition: "transform 0.5s ease" }}
                      className="about-history-img"
                    />
                  </div>
                </div>
                <div>
                  <h3
                    style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", color: "var(--gray-900)", marginBottom: "1rem", fontWeight: "800" }}>
                    Established with a Vision</h3>
                  <p style={{ fontSize: "1.05rem", lineHeight: "1.8", color: "var(--gray-700)", marginBottom: "1.25rem" }}>
                    Nandkunvarba Mahila College was established with a profound commitment to uplifting women through
                    education in the Saurashtra region. Since our inception, we have stood firmly on the principles of
                    academic rigor and moral integrity.
                  </p>
                  <p style={{ fontSize: "1.05rem", lineHeight: "1.8", color: "var(--gray-700)", marginBottom: "1.5rem" }}>
                    Managed by the prestigious Shree Sahajanand Education Trust, our legacy is built on decades of nurturing
                    talent, fostering independence, and equipping generations of women with the skills needed to thrive.
                  </p>

                  {/* Creative Checkmarks Highlights */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", borderTop: "1px solid var(--gray-200)", paddingTop: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.95rem", color: "var(--gray-800)", fontWeight: "700" }}>
                      <span style={{ color: "#8a0000", fontSize: "1.2rem", fontWeight: "900" }}>✔</span>
                      <span>Empowering female students since inception in Bhavnagar</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.95rem", color: "var(--gray-800)", fontWeight: "700" }}>
                      <span style={{ color: "#8a0000", fontSize: "1.2rem", fontWeight: "900" }}>✔</span>
                      <span>Affiliated with MK Bhavnagar University (MKBU)</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.95rem", color: "var(--gray-800)", fontWeight: "700" }}>
                      <span style={{ color: "#8a0000", fontSize: "1.2rem", fontWeight: "900" }}>✔</span>
                      <span>Pioneering curriculum with 100% Free Bus Service</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. FOUNDING FATHERS */}
        <section className="section-padding" id="founders" style={{ position:"relative", overflow:"hidden", background:"linear-gradient(160deg, #fffdf8 0%, #fff7ed 40%, #fef3e2 100%)" }}>
          {/* Soft ambient glow */}
          <div style={{ position:"absolute", top:"-15%", left:"-10%", width:"500px", height:"500px", background:"radial-gradient(ellipse, rgba(138,0,0,0.05) 0%, transparent 65%)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:"-15%", right:"-10%", width:"500px", height:"500px", background:"radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 65%)", pointerEvents:"none" }} />

          <div className="container" style={{ position:"relative", zIndex:2 }}>

            {/* Section Header — consistent with site */}
            <div data-aos="fade-up" style={{ textAlign:"center", maxWidth:"650px", margin:"0 auto 2rem auto" }}>
              <div className="about-premium-tag" style={{ marginBottom:"0.75rem", justifyContent:"center" }}>
                <span className="about-tag-dot"></span>
                <span>The Pioneers</span>
              </div>
              <h2 className="vm-main-title" style={{ marginBottom:"0.75rem" }}>
                Founding <span>Fathers</span>
              </h2>
              <p style={{ fontSize:"0.95rem", color:"var(--gray-500)", lineHeight:"1.7", margin:0 }}>
                Visionaries who laid the cornerstone of women&apos;s education and empowerment.
              </p>
            </div>

            {/* Cards Row */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:"2rem" }}>

              {/* Card 1 — Shri Samkit */}
              <div data-aos="fade-up" data-aos-delay="0" style={{ background:"#ffffff", borderRadius:"1.5rem", overflow:"hidden", border:"1px solid rgba(138,0,0,0.08)", boxShadow:"0 10px 40px rgba(138,0,0,0.06), 0 2px 8px rgba(0,0,0,0.03)", transition:"transform 0.3s ease, box-shadow 0.3s ease" }}>
                {/* Top gradient accent */}
                <div style={{ height:"4px", background:"linear-gradient(90deg, #8a0000, #c0392b, #f59e0b)" }} />

                <div className="founder-card-body">
                  {/* Profile Area */}
                  <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1.25rem" }}>
                    <div className="founder-avatar-wrap">
                      <div style={{ position:"absolute", inset:"-3px", borderRadius:"50%", background:"linear-gradient(135deg, #8a0000, #f59e0b)" }} />
                      <div style={{ position:"relative", width:"85px", height:"85px", borderRadius:"50%", overflow:"hidden", border:"3px solid #ffffff", boxShadow:"0 4px 12px rgba(138,0,0,0.15)" }}>
                        <Image src="/assets/about/team/1.jpg" alt="Shri Samkit" width={150} height={150} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontFamily:"var(--font-heading)", fontSize:"1.25rem", fontWeight:"800", color:"var(--gray-900)", margin:"0 0 0.2rem 0" }}>Shri Samkit</h4>
                      <span style={{ fontSize:"0.62rem", fontWeight:"800", color:"#8a0000", background:"rgba(138,0,0,0.06)", border:"1px solid rgba(138,0,0,0.12)", padding:"0.2rem 0.65rem", borderRadius:"2rem", textTransform:"uppercase", letterSpacing:"1.2px" }}>Chief Patron</span>
                    </div>
                  </div>

                  {/* Quote */}
                  <div style={{ background:"rgba(138,0,0,0.03)", borderLeft:"3px solid #8a0000", borderRadius:"0 0.6rem 0.6rem 0", padding:"0.85rem 1rem", marginBottom:"1.25rem" }}>
                    <p style={{ fontSize:"0.88rem", color:"var(--gray-600)", lineHeight:"1.7", fontStyle:"italic", margin:0 }}>
                      &ldquo;Empowering a woman is empowering a generation. Education is the key to unlock their boundless potential.&rdquo;
                    </p>
                  </div>

                  {/* Contributions */}
                  <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
                    {[
                      "Founding Visionary of the Institution",
                      "Pioneering Advocate for Women\u2019s Education",
                      "Senior Patron of Shree Sahajanand Trust",
                    ].map((label, i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
                        <div style={{ flexShrink:0, width:"28px", height:"28px", borderRadius:"50%", background:"rgba(138,0,0,0.06)", border:"1px solid rgba(138,0,0,0.12)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <span style={{ fontSize:"0.82rem", color:"var(--gray-600)", fontWeight:"500", lineHeight:"1.4" }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 2 — Shri Mehul */}
              <div data-aos="fade-up" data-aos-delay="150" style={{ background:"#ffffff", borderRadius:"1.5rem", overflow:"hidden", border:"1px solid rgba(245,158,11,0.12)", boxShadow:"0 10px 40px rgba(245,158,11,0.06), 0 2px 8px rgba(0,0,0,0.03)", transition:"transform 0.3s ease, box-shadow 0.3s ease" }}>
                {/* Top gradient accent */}
                <div style={{ height:"4px", background:"linear-gradient(90deg, #d97706, #f59e0b, #fcd34d)" }} />

                <div className="founder-card-body">
                  {/* Profile Area */}
                  <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1.25rem" }}>
                    <div className="founder-avatar-wrap">
                      <div style={{ position:"absolute", inset:"-3px", borderRadius:"50%", background:"linear-gradient(135deg, #d97706, #f59e0b)" }} />
                      <div style={{ position:"relative", width:"85px", height:"85px", borderRadius:"50%", overflow:"hidden", border:"3px solid #ffffff", boxShadow:"0 4px 12px rgba(245,158,11,0.2)" }}>
                        <Image src="/assets/about/team/2.jpg" alt="Shri Mehul" width={150} height={150} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontFamily:"var(--font-heading)", fontSize:"1.25rem", fontWeight:"800", color:"var(--gray-900)", margin:"0 0 0.2rem 0" }}>Shri Mehul</h4>
                      <span style={{ fontSize:"0.62rem", fontWeight:"800", color:"#92400e", background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.2)", padding:"0.2rem 0.65rem", borderRadius:"2rem", textTransform:"uppercase", letterSpacing:"1.2px" }}>Managing Trustee</span>
                    </div>
                  </div>

                  {/* Quote */}
                  <div style={{ background:"rgba(245,158,11,0.04)", borderLeft:"3px solid #f59e0b", borderRadius:"0 0.6rem 0.6rem 0", padding:"0.85rem 1rem", marginBottom:"1.25rem" }}>
                    <p style={{ fontSize:"0.88rem", color:"var(--gray-600)", lineHeight:"1.7", fontStyle:"italic", margin:0 }}>
                      &ldquo;Building institutions that not only educate but also instil strong cultural and ethical values.&rdquo;
                    </p>
                  </div>

                  {/* Contributions */}
                  <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
                    {[
                      "Spearheads Modern Infrastructure & Lab Upgrades",
                      "Formulates Strategic University Collaborations",
                      "Implements 100% Free Campus Security Audits",
                    ].map((label, i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
                        <div style={{ flexShrink:0, width:"28px", height:"28px", borderRadius:"50%", background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.18)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <span style={{ fontSize:"0.82rem", color:"var(--gray-600)", fontWeight:"500", lineHeight:"1.4" }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 3. CHAIRMAN'S MESSAGE */}

        {/* 3. CHAIRMAN'S MESSAGE */}
        <section className="section-padding" id="chairman" style={{ position: "relative", overflow: "hidden", background: "#ffffff" }}>
          <div className="container" style={{ position: "relative", zIndex: "2" }}>
            <div className="chairman-message-card">
              {/* Decorative watermark quotes */}
              <div className="chairman-watermark-quote">
                “
              </div>

              <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ position: "relative", padding: "10px" }}>
                  {/* Creative rotated background color frame */}
                  <div style={{
                    position: "absolute",
                    inset: "0",
                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    borderRadius: "1.75rem",
                    transform: "rotate(-3deg)",
                    opacity: 0.2,
                    boxShadow: "0 10px 25px rgba(245, 158, 11, 0.15)"
                  }} />

                  <div style={{
                    position: "relative",
                    width: "270px",
                    height: "320px",
                    borderRadius: "1.5rem",
                    overflow: "hidden",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
                    border: "4px solid var(--white)",
                    zIndex: 2
                  }}>
                    <Image src="/assets/about/team/4.jpg" alt="Shri Dipak" fill style={{ objectFit: "cover" }} />
                  </div>
                </div>
                {/* Executive identity text */}
                <div style={{ textAlign: "center", marginTop: "1.5rem", zIndex: 2 }}>
                  <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: "900", color: "var(--gray-900)", margin: "0 0 0.25rem 0" }}>
                    Shri Dipak
                  </h4>
                  <span style={{
                    fontSize: "0.78rem",
                    color: "#ffffff",
                    background: "linear-gradient(90deg, #8a0000 0%, #b30000 100%)",
                    padding: "0.3rem 0.95rem",
                    borderRadius: "2rem",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    boxShadow: "0 4px 10px rgba(138,0,0,0.2)",
                    display: "inline-block"
                  }}>
                    Chairman, NMC
                  </span>
                </div>
              </div>

              <div style={{ flex: "2 1 400px", position: "relative", zIndex: 2 }}>
                <span style={{
                  display: "inline-block",
                  fontSize: "0.72rem",
                  fontWeight: "900",
                  color: "#ffffff",
                  background: "linear-gradient(90deg, #d97706 0%, #f59e0b 100%)", /* Golden tag background */
                  padding: "0.35rem 1rem",
                  borderRadius: "2rem",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  marginBottom: "1rem",
                  boxShadow: "0 4px 10px rgba(245,158,11,0.2)"
                }}>
                  leadership message
                </span>

                <h2 className="vm-main-title" style={{ marginBottom: "1.75rem", textAlign: "left" }}>
                  Message from the <span style={{ color: "#8a0000" }}>Chairman</span>
                </h2>

                {/* Premium cream-tinted message block */}
                <div className="chairman-quote-block">
                  <p style={{ marginBottom: "1rem" }}>"Welcome to Nandkunvarba Mahila College.</p>
                  <p style={{ marginBottom: "1rem" }}>It gives me immense pride to see our institution grow into a temple of
                    learning where young women are shaped into leaders of tomorrow. Our philosophy is simple: provide
                    world-class education, ensure absolute safety, and cultivate an environment where every student can
                    discover her true potential.</p>
                  <p style={{ margin: 0 }}>We are constantly innovating, introducing new programs, and investing in infrastructure to ensure our
                    students have a competitive edge in the global landscape. I invite you to join our family and embark on a
                    transformative journey."</p>
                </div>

                <div className="chairman-signature-row">
                  <div style={{ width: "40px", height: "1px", background: "var(--gray-300)" }} />
                  <div className="chairman-signature-name">
                    Dipak
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. AFFILIATION & RECOGNITION */}
        <section className="section-padding" id="affiliation" style={{ background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)", position: "relative", overflow: "hidden" }}>
          <div className="container" style={{ position: "relative", zIndex: 2 }}>
            <div className="vm-header-wrap vm-header-center">
              <div className="about-premium-tag">
                <span className="about-tag-dot"></span>
                <span>Accreditation</span>
              </div>
              <h2 className="vm-main-title">Affiliation &amp; <span>Recognition</span></h2>
              <p className="vm-main-subtitle" style={{ marginTop: "1rem" }}>Recognized by statutory bodies for upholding the highest
                standards of education.</p>
            </div>

            <div className="affil-cards-container">
              {/* MKBU Card */}
              <div className="affil-card theme-ruby">
                <div className="affil-card-bg-glow"></div>
                <div className="affil-icon-box">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ margin: "auto" }}>
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </div>
                <h4 className="affil-title">MK Bhavnagar University</h4>
                <span className="affil-badge">MKBU Affiliated</span>
                <p className="affil-desc">Permanently affiliated for all UG and PG programs.</p>
              </div>

              {/* Govt of Gujarat Card */}
              <div className="affil-card theme-gold">
                <div className="affil-card-bg-glow"></div>
                <div className="affil-icon-box">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ margin: "auto" }}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <h4 className="affil-title">Government of Gujarat</h4>
                <span className="affil-badge">State Approved</span>
                <p className="affil-desc">Recognized and approved by the State Education Department.</p>
              </div>

              {/* UGC Card */}
              <div className="affil-card theme-ruby">
                <div className="affil-card-bg-glow"></div>
                <div className="affil-icon-box">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ margin: "auto" }}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                </div>
                <h4 className="affil-title">UGC Recognition</h4>
                <span className="affil-badge">UGC Recognized</span>
                <p className="affil-desc">Acknowledged under section 2(f) and 12(B) of the UGC Act.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. NMC SONG */}
        {/* 5. NMC SONG - CREATIVE THEME DESIGN */}
        <section className="section-padding bg-light" id="song" style={{ position: "relative", overflow: "hidden" }}>
          {/* Abstract Geometric Background matching theme colors */}
          <div style={{ position: "absolute", top: "-10%", left: "-5%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(0, 95, 153, 0.05) 0%, transparent 70%)", borderRadius: "50%" }}></div>
          <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(251, 192, 45, 0.05) 0%, transparent 70%)", borderRadius: "50%" }}></div>

          <div className="container" style={{ position: "relative", zIndex: "2" }}>
            <div className="vm-header-wrap vm-header-center vm-header-center-lg">
              <div className="about-premium-tag" style={{ gap: "0.5rem", display: "inline-flex", alignItems: "center", borderColor: "rgba(197, 48, 48, 0.2)", background: "rgba(197, 48, 48, 0.05)", padding: "0.4rem 1.2rem" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--red-800)"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg>
                <span style={{ color: "var(--red-800)", fontWeight: "800", letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.8rem" }}>Anthem</span>
              </div>
              <h2 className="vm-main-title">NMC <span>Song</span></h2>
            </div>

            <div className="song-flex-wrap">

              {/* Interactive Player Card (Dark Red Accent) */}
              <div className="song-player-card">
                <div className="song-note-bg">
                  <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg>
                </div>

                <h3 className="song-player-heading">Listen to our<br /><span>Guiding Star</span></h3>
                <p className="song-player-desc">The official anthem of Nandkunvarba Mahila College, echoing our values of truth, love, and empowerment.</p>

                <div className="song-controls">
                  <button className="song-play-btn">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="song-play-icon"><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none" /></svg>
                  </button>
                  <div className="song-progress-wrap">
                    <div className="song-progress-bar">
                      <div className="song-progress-fill"></div>
                      <div className="song-progress-knob"></div>
                    </div>
                    <div className="song-time-row">
                      <span>01:15</span>
                      <span>03:42</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lyrics Card (White/Light Accent) */}
              <div className="song-lyrics-card">

                <div className="song-quote-mark">"</div>

                <div className="song-lyrics-inner">
                  <div className="song-lyrics-text">
                    <p className="song-lyrics-para">
                      <span className="song-dropcap">O</span>de to knowledge, ode to light,<br />
                      We march ahead, futures bright.<br />
                      Nandkunvarba, our guiding star,<br />
                      Empowering women, near and far.
                    </p>
                    <p>
                      <span className="song-dropcap">W</span>ith courage in our hearts we stand,<br />
                      To serve our people and our land.<br />
                      Through wisdom's grace, we rise above,<br />
                      Bound together by truth and love.
                    </p>
                  </div>

                  <div className="song-anthem-row">
                    <div className="song-anthem-line"></div>
                    <p className="song-anthem-label">Official College Anthem</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 6. NMC BROCHURE - CREATIVE REDESIGN */}
        <section className={`section-padding brochure-section ${styles.brochureSection}`} id="brochure">
          <div className={styles.brochureOrbRed}></div>
          <div className={styles.brochureOrbGold}></div>

          <div className={`container ${styles.brochureContainer}`}>
            <div className={`brochure-card ${styles.brochureCard}`}>

              <div className={styles.brochureWatermark}>
                <Image src="/assets/shared/logo/1.png" alt="Watermark" width={200} height={80} />
              </div>

              <div className={`brochure-visual ${styles.brochureVisual}`}>
                <div className={styles.brochureGlowOrb}></div>

                <div className={`brochure-mockup ${styles.brochureMockup}`}>
                  <div className={styles.brochureBinding}></div>
                  <Image src="/assets/shared/logo/1.png" alt="NMC Logo" width={200} height={80} />
                  <h3 className={`brochure-mockup-title ${styles.brochureMockupTitle}`}>Prospectus</h3>
                  <div className={styles.brochureYearBadge}>2026 - 27</div>
                  <div className={styles.brochureSeparator}></div>
                  <p className={styles.brochureCollegeText}>Nandkunvarba Mahila College<br />Bhavnagar</p>
                </div>
              </div>

              <div className={`brochure-text ${styles.brochureText}`}>
                <div className={styles.brochureOfficialTag}>Official Guide</div>
                <h2 className={`brochure-heading ${styles.brochureHeading}`}>
                  Download Our <span className={styles.brochureHeadingAccent}>Brochure</span>
                </h2>
                <p className={`brochure-desc ${styles.brochureDesc}`}>
                  Explore our comprehensive prospectus to learn everything about our academic programs, campus facilities, placement records, and the vibrant student life at Nandkunvarba Mahila College.
                </p>

                <div className={`brochure-cta-row ${styles.brochureCtaRow}`}>
                  <a href="#" className={`brochure-download-btn ${styles.brochureDownloadBtn}`}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download PDF
                  </a>

                  <div className={`brochure-file-info ${styles.brochureFileInfo}`}>
                    <span><strong>Size:</strong> 4.2 MB</span>
                    <span><strong>Updated:</strong> 2026 Edition</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 7. AWARDS & ACHIEVEMENTS */}
        <section className="section-padding bg-light" id="awards">
          <div className="container">
            <div className="vm-header-wrap vm-header-center">
              <div className="about-premium-tag">
                <span className="about-tag-dot"></span>
                <span>Excellence</span>
              </div>
              <h2 className="vm-main-title">Awards &amp; <span>Achievements</span></h2>
              <p className="vm-main-subtitle" style={{ marginTop: "1rem" }}>Celebrating our milestones in academic and extracurricular
                excellence.</p>
            </div>

            <div className={styles.awardsGrid}>
              <div className={`${styles.awardCard} ${styles.awardCardGold}`}>
                <div className={styles.awardCardHeader}>
                  <div className={`${styles.awardIcon} ${styles.awardIconGold}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                      <path d="M4 22h16" />
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                    </svg>
                  </div>
                  <h4 className={styles.awardCardTitle}>Best Women&apos;s College</h4>
                </div>
                <p className={styles.awardCardDesc}>Awarded by regional educational authorities for outstanding contribution to female literacy and empowerment in Saurashtra.</p>
                <div className={styles.awardCardYear}>Year: 2023</div>
              </div>

              <div className={`${styles.awardCard} ${styles.awardCardSky}`}>
                <div className={styles.awardCardHeader}>
                  <div className={`${styles.awardIcon} ${styles.awardIconSky}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="7" />
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                    </svg>
                  </div>
                  <h4 className={styles.awardCardTitle}>Excellence in Placements</h4>
                </div>
                <p className={styles.awardCardDesc}>Recognized for achieving 90%+ placement records across all major IT, Management, and Commerce streams.</p>
                <div className={styles.awardCardYear}>Year: 2024</div>
              </div>

              <div className={`${styles.awardCard} ${styles.awardCardRed}`}>
                <div className={styles.awardCardHeader}>
                  <div className={`${styles.awardIcon} ${styles.awardIconRed}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 15l-2 5l9-9h-7l2-5l-9 9h7z" />
                    </svg>
                  </div>
                  <h4 className={styles.awardCardTitle}>Green Campus Initiative</h4>
                </div>
                <p className={styles.awardCardDesc}>Honored for implementing sustainable, eco-friendly practices and maintaining a lush, green, zero-waste campus environment.</p>
                <div className={styles.awardCardYear}>Year: 2022</div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. FUTURE VISION - PREMIUM THEME REDESIGN */}
        <section className="section-padding" id="future">
          <div className="container">
            <div className={styles.futureCard}>

              <div className={styles.futureOrbGold}></div>
              <div className={styles.futureOrbRed}></div>

              <div className={styles.futureContent}>
                <div className={`about-premium-tag ${styles.futureTag}`}>
                  <span className="about-tag-dot"></span>
                  <span className={styles.futureTagText}>Looking Ahead</span>
                </div>

                <h2 className={styles.futureHeading}>
                  Our Future <span className={styles.futureHeadingAccent}>Vision</span>
                </h2>

                <p className={styles.futureDesc}>
                  As we step into the next decade, NMC aims to integrate cutting-edge AI and tech-driven pedagogies across all disciplines. Our vision is to expand our global university tie-ups, foster high-impact research, and launch startup incubation centers tailored for female entrepreneurs. We are committed to evolving continuously, ensuring our students are not just ready for the future, but are the ones shaping it.
                </p>

                <div className={styles.futureStatsRow}>
                  <div className={styles.futureStatCard}>
                    <h4 className={`${styles.futureStatNum} ${styles.futureStatRed}`}>50+</h4>
                    <div className={styles.futureStatSep}></div>
                    <p className={styles.futureStatLabel}>New Global Tie-ups</p>
                  </div>

                  <div className={styles.futureStatCard}>
                    <h4 className={`${styles.futureStatNum} ${styles.futureStatDark}`}>100%</h4>
                    <div className={styles.futureStatSep}></div>
                    <p className={styles.futureStatLabel}>Digital Campus</p>
                  </div>

                  <div className={styles.futureStatCard}>
                    <h4 className={`${styles.futureStatNum} ${styles.futureStatRed}`}>₹5Cr</h4>
                    <div className={styles.futureStatSep}></div>
                    <p className={styles.futureStatLabel}>Incubation Fund</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* 360° CAMPUS VIRTUAL TOUR MODAL */}
        <div className="modal-backdrop" id="tourModal">
          <div className="modal-box" style={{ maxWidth: "800px" }}>
            <div className="modal-close" id="tourClose">&times;</div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", color: "var(--gray-900)", marginBottom: "0.5rem" }}>
              360° Interactive Campus Virtual Tour</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--gray-600)", marginBottom: "1rem" }}>Use your cursor/touch to rotate 360°
              and explore NMC Campus.</p>
            <div style={{ height: "420px", borderRadius: "var(--radius-md)", overflow: "hidden", background: "#000" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!4v1700000000000!6m8!1m7!1sCAoSLEFGMVFpcE1UZFlXTEt1Zk1rMVVUT3VlNXJ4TnpGVEp2Z1JrdjVkTlNWQW91!2m2!1d21.7490487!2d72.1588143!3f0!4f0!5f0.7820865974013092"
                width="100%" height="100%" style={{ border: "0" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>

        {/* ADMISSION REGISTRATION MODAL */}
        <div className="modal-backdrop" id="registrationModal">
          <div className="modal-box">
            <div className="modal-close">&times;</div>
            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <span
                style={{ background: "var(--sky-100)", color: "var(--sky-700)", fontSize: "0.75rem", fontWeight: "800", padding: "0.25rem 0.8rem", borderRadius: "var(--radius-full)", textTransform: "uppercase" }}>Admissions
                2026-27</span>
              <h3
                style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", fontWeight: "800", color: "var(--gray-900)", marginTop: "0.4rem" }}>
                Admission &amp; Expert Callback</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--gray-600)" }}>Includes <strong>100% Free Bus Pick-Up Service</strong>
                &amp; <strong>Free Blazer Gift!</strong></p>
            </div>

            <form id="modalForm">
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontWeight: "700", fontSize: "0.88rem", color: "var(--gray-900)" }}>Full Name of Student *</label>
                <input type="text" className="form-control" required />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontWeight: "700", fontSize: "0.88rem", color: "var(--gray-900)" }}>Mobile Number *</label>
                <input type="tel" className="form-control" required />
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ fontWeight: "700", fontSize: "0.88rem", color: "var(--gray-900)" }}>Course Selection *</label>
                <select className="form-control" required>
                  <option value="bba">B.B.A. - Rs. 8,000/Sem</option>
                  <option value="bca">B.C.A. - Rs. 15,000/Sem</option>
                  <option value="ba">B.A. (Bachelor of Arts)</option>
                  <option value="bcom">B.COM (Bachelor of Commerce)</option>
                  <option value="ma">M.A. (Master of Arts)</option>
                  <option value="mcom">M.Com (Master of Commerce)</option>
                  <option value="msw">M.S.W. (Master of Social Work)</option>
                  <option value="dfd">Diploma in Fashion Designing (DFD/CFD)</option>
                  <option value="dnys">Diploma in Naturopathy (DNYS)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-crimson" style={{ width: "100%", fontSize: "1rem" }}>Proceed to Official GCAS
                Portal</button>
            </form>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
