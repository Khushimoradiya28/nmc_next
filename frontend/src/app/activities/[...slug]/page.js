import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import EventCard from '@/components/activities/EventCard';
import EventDetail from '@/components/activities/EventDetail';
import { getEventsByCategory, getEventsBySubCategory, getEventById } from '@/data/activitiesData';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const title = slug.length > 0 ? slug[slug.length - 1].replace(/-/g, ' ') : 'Activities';
  return {
    title: `${title.charAt(0).toUpperCase() + title.slice(1)} | Nandkunvarba Mahila College`,
  };
}

export default async function ActivitiesSubPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];

  // Format breadcrumb text
  const formatText = (text) => {
    return text.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const pageTitle = slug.length > 0 ? formatText(slug[slug.length - 1]) : 'Activity';
  const parentCategory = slug.length > 1 ? formatText(slug[0]) : '';

  if (slug.length === 1) {
    const events = getEventsByCategory(slug[0]);
    content = (
      <div className="section-padding" style={{ background: "#ffffff" }}>
        <div className="container">
          {events.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              {events.map(event => (
                <EventCard key={event.id} event={event} basePath={`/activities/${slug[0]}/${event.subCategoryId}`} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <h2 style={{ fontSize: "2rem", color: "var(--gray-800)", marginBottom: "1rem" }}>Welcome to {pageTitle}</h2>
              <p style={{ color: "var(--gray-600)", fontSize: "1.1rem" }}>Events and updates will be available soon.</p>
            </div>
          )}
        </div>
      </div>
    );
  } else if (slug.length === 2) {
    const events = getEventsBySubCategory(slug[0], slug[1]);
    content = (
      <div className="section-padding" style={{ background: "#ffffff" }}>
        <div className="container">
          {events.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              {events.map(event => (
                <EventCard key={event.id} event={event} basePath={`/activities/${slug[0]}/${slug[1]}`} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <h2 style={{ fontSize: "2rem", color: "var(--gray-800)", marginBottom: "1rem" }}>Welcome to {pageTitle}</h2>
              <p style={{ color: "var(--gray-600)", fontSize: "1.1rem" }}>Events and updates will be available soon.</p>
            </div>
          )}
        </div>
      </div>
    );
  } else if (slug.length === 3) {
    const event = getEventById(slug[2]);
    content = <EventDetail event={event} parentPath={`/activities/${slug[0]}/${slug[1]}`} parentName={formatText(slug[1])} />;
  }

  return (
    <>
      <Header />
      <main>
        <section className="hero-fullscreen" id="home" style={{ minHeight: "45vh", height: "45vh", position: "relative", overflow: "hidden" }}>
          <div className="hero-bg-image" style={{ position: "absolute", inset: 0, zIndex: -2 }}>
            <Image
              src="/assets/home/hero/2.jpg"
              alt={`${pageTitle} Banner`}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="hero-overlay" style={{ position: "absolute", inset: 0, zIndex: -1, background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))" }}></div>

          <div className="container" style={{ paddingTop: "110px", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", paddingBottom: "40px", zIndex: 1, position: "relative" }}>

            <h1 className="hero-main-title" style={{ fontSize: "60px", fontWeight: "600", paddingRight: "15px", color: "#fff", margin: "0 0 1rem 0" }}>
              <em>{pageTitle}</em>
            </h1>

            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
              <ol style={{ display: "flex", listStyle: "none", padding: 0, margin: 0, gap: "0.5rem", color: "var(--gold-500, #f59e0b)", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                <li><Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Home</Link></li>
                <li style={{ color: "rgba(255,255,255,0.5)" }}>&gt;</li>
                <li><span style={{ color: "rgba(255,255,255,0.7)" }}>Activities</span></li>

                {parentCategory && slug.length === 2 && (
                  <>
                    <li style={{ color: "rgba(255,255,255,0.5)" }}>&gt;</li>
                    <li><span style={{ color: "rgba(255,255,255,0.7)" }}>{parentCategory}</span></li>
                  </>
                )}

                {slug.length === 3 && (
                  <>
                    <li style={{ color: "rgba(255,255,255,0.5)" }}>&gt;</li>
                    <li><span style={{ color: "rgba(255,255,255,0.7)" }}>{formatText(slug[0])}</span></li>
                    <li style={{ color: "rgba(255,255,255,0.5)" }}>&gt;</li>
                    <li><span style={{ color: "rgba(255,255,255,0.7)" }}>{formatText(slug[1])}</span></li>
                  </>
                )}

                <li style={{ color: "rgba(255,255,255,0.5)" }}>&gt;</li>
                <li aria-current="page" style={{ color: "var(--gold-500, #f59e0b)" }}>{pageTitle}</li>
              </ol>
            </nav>
          </div>
        </section>

        {content}
      </main>
      <Footer />
    </>
  );
}
