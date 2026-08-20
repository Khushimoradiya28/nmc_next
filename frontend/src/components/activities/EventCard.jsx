"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function EventCard({ event, basePath }) {
  const eventUrl = `${basePath}/${event.id}`;
  
  return (
    <div style={{
      display: "flex",
      background: "var(--white)",
      border: "1px solid var(--gray-200)",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
      height: "100%",
      minHeight: "250px"
    }}>
      {/* Text Content */}
      <div style={{
        flex: "1",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}>
        <div>
          <h3 style={{
            fontSize: "1.2rem",
            color: "var(--gray-800)",
            fontWeight: "600",
            textTransform: "uppercase",
            marginBottom: "1rem",
            lineHeight: "1.4"
          }}>
            {event.clubName}
          </h3>
          <p style={{
            color: "var(--gray-600)",
            fontSize: "0.95rem",
            lineHeight: "1.6",
            marginBottom: "1.5rem",
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {event.shortDescription}
          </p>
        </div>
        
        <div>
          <Link href={eventUrl} style={{
            display: "inline-block",
            padding: "0.6rem 1.2rem",
            border: "1px solid var(--gray-900)",
            color: "var(--gray-900)",
            fontWeight: "700",
            fontSize: "0.85rem",
            textTransform: "uppercase",
            textDecoration: "none",
            letterSpacing: "0.5px",
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'var(--gray-900)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--gray-900)';
          }}
          >
            Show More
          </Link>
        </div>
      </div>

      {/* Image Content */}
      <div style={{
        width: "35%",
        minWidth: "150px",
        position: "relative",
        borderLeft: "1px solid var(--gray-200)"
      }}>
        <Image 
          src={event.thumbnail || '/assets/home/hero/1.jpg'} 
          alt={event.title}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
