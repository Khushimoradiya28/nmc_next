"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function EventDetail({ event, parentPath, parentName }) {
  if (!event) return <div>Event not found.</div>;

  const isUpcoming = event.status === 'upcoming';

  return (
    <div className="section-padding" style={{ background: "var(--slate-50)", minHeight: "60vh" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>

        {/* Back Link */}
        <div style={{ marginBottom: "2rem" }}>
          <Link href={parentPath} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--gray-600)", textDecoration: "none", fontWeight: "600", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
            Back to {parentName}
          </Link>
        </div>

        {/* Header Section */}
        <div style={{ background: "var(--white)", padding: "3rem", borderRadius: "1rem", boxShadow: "0 10px 25px rgba(0,0,0,0.03)", marginBottom: "3rem", border: "1px solid var(--gray-200)" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{
              background: isUpcoming ? "var(--gold-100)" : "var(--emerald-100)",
              color: isUpcoming ? "var(--gold-800)" : "var(--emerald-800)",
              padding: "0.4rem 1rem",
              borderRadius: "2rem",
              fontSize: "0.8rem",
              fontWeight: "700",
              textTransform: "uppercase"
            }}>
              {isUpcoming ? 'Upcoming Event' : 'Past Event'}
            </span>
            <span style={{ color: "var(--gray-500)", fontWeight: "600", fontSize: "0.9rem" }}>{event.clubName}</span>
          </div>

          <h2 style={{ fontSize: "2.5rem", fontWeight: "800", color: "var(--gray-900)", marginBottom: "1.5rem", lineHeight: "1.2" }}>
            {event.title}
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--gray-100)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--sky-50)", color: "var(--sky-600)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <div>
                <span style={{ display: "block", fontSize: "0.75rem", color: "var(--gray-500)", textTransform: "uppercase", fontWeight: "700" }}>Date</span>
                <strong style={{ color: "var(--gray-800)" }}>{new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--ruby-50)", color: "var(--ruby-600)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div>
                <span style={{ display: "block", fontSize: "0.75rem", color: "var(--gray-500)", textTransform: "uppercase", fontWeight: "700" }}>Time</span>
                <strong style={{ color: "var(--gray-800)" }}>{event.time}</strong>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--emerald-50)", color: "var(--emerald-600)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div>
                <span style={{ display: "block", fontSize: "0.75rem", color: "var(--gray-500)", textTransform: "uppercase", fontWeight: "700" }}>Location</span>
                <strong style={{ color: "var(--gray-800)" }}>{event.location}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div style={{ background: "var(--white)", padding: "3rem", borderRadius: "1rem", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", marginBottom: "3rem", border: "1px solid var(--gray-200)" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "1rem" }}>About the Event</h3>
          <p style={{ fontSize: "1.05rem", color: "var(--gray-700)", lineHeight: "1.8", whiteSpace: "pre-line" }}>
            {event.fullDescription}
          </p>
        </div>

        {/* Gallery Section */}
        {event.gallery && event.gallery.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--gray-900)", margin: 0 }}>Event <span style={{ color: "var(--gold-600)" }}>Gallery</span></h3>
              <div style={{ flex: "1", height: "1px", background: "var(--gray-200)" }}></div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
              {event.gallery.map((imgUrl, index) => (
                <div key={index} style={{ position: "relative", height: "250px", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
                  <Image
                    src={imgUrl}
                    alt={`${event.title} gallery image ${index + 1}`}
                    fill
                    style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
