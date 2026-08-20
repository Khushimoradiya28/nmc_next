"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';

// 16 premium gallery media items for a perfect 4x4 grid layout
const GALLERY_ITEMS = [
  {
    id: 1,
    category: 'campus',
    type: 'image',
    src: '/assets/home/hero/2.jpg',
    badge: 'Campus',
    tag: 'Infrastructure',
    title: 'Main Academic Campus',
    desc: 'Expansive campus equipped with modern academic amenities and green surroundings.'
  },
  {
    id: 2,
    category: 'videos',
    type: 'video',
    src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/assets/home/hero/1.png',
    badge: 'Video Tour',
    tag: 'Video Tour',
    title: 'Campus Life & Facilities',
    desc: 'Experience the student energy, classrooms, and campus walkthrough.',
    duration: '2:30 Min'
  },
  {
    id: 3,
    category: 'campus',
    type: 'image',
    src: '/assets/home/gallery/2.jpg',
    badge: 'IT Lab',
    tag: 'Technology',
    title: 'High-Tech IT & BCA Lab',
    desc: 'Advanced computer laboratory setup with high-speed internet and digital terminals.'
  },
  {
    id: 4,
    category: 'campus',
    type: 'image',
    src: '/assets/home/gallery/3.jpg',
    badge: 'Studio',
    tag: 'Design Studio',
    title: 'Fashion Designing Studio',
    desc: 'Creative workshops for pattern design, styling, and apparel construction.'
  },
  {
    id: 5,
    category: 'events',
    type: 'image',
    src: '/assets/home/hero/6.png',
    badge: 'Events',
    tag: 'Cultural Fest',
    title: 'Annual Cultural Day',
    desc: 'Celebrating artistic talents, dance drama, and student presentations.'
  },
  {
    id: 6,
    category: 'campus',
    type: 'image',
    src: '/assets/home/gallery/1.jpg',
    badge: 'Auditorium',
    tag: 'Seminars',
    title: 'A/C Seminar Auditorium',
    desc: 'State-of-the-art auditorium with HD projection for national workshops.'
  },
  {
    id: 7,
    category: 'events',
    type: 'image',
    src: '/assets/home/overview/1.jpg',
    badge: 'Workshops',
    tag: 'Skill Training',
    title: 'Interactive Workshops',
    desc: 'Hands-on interactive learning sessions led by domain experts.'
  },
  {
    id: 8,
    category: 'events',
    type: 'image',
    src: '/assets/home/hero/5.png',
    badge: 'Celebration',
    tag: 'Milestones',
    title: 'Graduation & Honors',
    desc: 'Honoring and celebrating academic accomplishments of our graduates.'
  },
  {
    id: 9,
    category: 'campus',
    type: 'image',
    src: '/assets/home/hero/2.jpg',
    badge: 'Library',
    tag: 'Academic Resources',
    title: 'Central Digital Library',
    desc: 'Spacious reading rooms with vast catalogs of prints, e-journals, and references.'
  },
  {
    id: 10,
    category: 'videos',
    type: 'video',
    src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/assets/home/hero/6.png',
    badge: 'Video Tour',
    tag: 'Festival Video',
    title: 'Cultural Day Highlights',
    desc: 'Video montage of dance performances and prize distribution.',
    duration: '3:15 Min'
  },
  {
    id: 11,
    category: 'campus',
    type: 'image',
    src: '/assets/home/gallery/2.jpg',
    badge: 'Science Lab',
    tag: 'Research',
    title: 'Biotech & Chemistry Lab',
    desc: 'Fully equipped science labs for experimental learning and analytical research.'
  },
  {
    id: 12,
    category: 'events',
    type: 'image',
    src: '/assets/home/overview/1.jpg',
    badge: 'Sports Day',
    tag: 'Athletics Meet',
    title: 'Annual Sports Day',
    desc: 'Encouraging fitness, teamwork, and athletic competition.'
  },
  {
    id: 13,
    category: 'campus',
    type: 'image',
    src: '/assets/home/hero/2.jpg',
    badge: 'Cafeteria',
    tag: 'Campus Amenities',
    title: 'Student Cafeteria Lounge',
    desc: 'Clean, hygienic space offering healthy snack choices and leisure seating.'
  },
  {
    id: 14,
    category: 'videos',
    type: 'video',
    src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/assets/home/overview/1.jpg',
    badge: 'Video Tour',
    tag: 'Sports Highlights',
    title: 'Annual Sports Highlights',
    desc: 'Highlight reels from final races and winning sports awards.',
    duration: '1:45 Min'
  },
  {
    id: 15,
    category: 'events',
    type: 'image',
    src: '/assets/home/hero/5.png',
    badge: 'Exhibition',
    tag: 'Creative Arts',
    title: 'Handicraft & Art Expo',
    desc: 'Student exhibition of paintings, home decor, and fashion garments.'
  },
  {
    id: 16,
    category: 'campus',
    type: 'image',
    src: '/assets/home/gallery/3.jpg',
    badge: 'Classrooms',
    tag: 'Smart Learning',
    title: 'Smart Tech Classrooms',
    desc: 'Modern classrooms integrated with interactive smart screens and audio.'
  }
];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Filter items based on active tab select
  const filteredItems = activeFilter === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeFilter);

  // Lightbox navigation functions
  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showNextMedia = (e) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prevIndex) => (prevIndex + 1) % filteredItems.length);
    }
  };

  const showPrevMedia = (e) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prevIndex) => (prevIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const activeMediaItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <>
      <Header />
      <main>
        {/* HERO BANNER */}
        <section className="hero-fullscreen" id="home" style={{ minHeight: "50vh", height: "50vh" }}>
          <div className="hero-bg-image">
            <Image src="/assets/home/hero/2.jpg" alt="Gallery Banner" width={1400} height={700} className="hero-bg-img" priority />
          </div>
          <div className="hero-overlay" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))" }}></div>
          <div className="hero-content" style={{ paddingTop: "100px", display: "flex", alignItems: "flex-end", height: "100%", paddingBottom: "80px" }}>
            <h1 className="hero-main-title" style={{ fontSize: "60px", fontWeight: "600" }}><em>Photo &amp; Video Gallery</em></h1>
          </div>
        </section>

        {/* PHOTO & VIDEO GALLERY */}
        <section className="section-padding gallery-section" id="gallery">
          <div className="container">
            <div className="section-header">
              <div className="section-subtitle">Visual Experience</div>
              <h2 className="section-title">Photo &amp; <span>Video Gallery</span></h2>
              <p className="section-description">A vibrant showcase of campus life, state-of-the-art labs, cultural festivals, and student activities.</p>
            </div>

            {/* Gallery Filter Tabs */}
            <div className="gallery-filter-bar">
              <button
                className={`gfilter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => { setActiveFilter('all'); setLightboxIndex(null); }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                All Media
              </button>
              <button
                className={`gfilter-btn ${activeFilter === 'campus' ? 'active' : ''}`}
                onClick={() => { setActiveFilter('campus'); setLightboxIndex(null); }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                Campus &amp; Labs
              </button>
              <button
                className={`gfilter-btn ${activeFilter === 'events' ? 'active' : ''}`}
                onClick={() => { setActiveFilter('events'); setLightboxIndex(null); }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                Events &amp; Culture
              </button>
              <button
                className={`gfilter-btn ${activeFilter === 'videos' ? 'active' : ''}`}
                onClick={() => { setActiveFilter('videos'); setLightboxIndex(null); }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                Video Highlights
              </button>
            </div>

            {/* Modern Interactive Gallery Grid */}
            <div className="gallery-interactive-grid" id="galleryGrid">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`gcard-item ${item.type === 'video' ? 'gcard-video-card' : ''}`}
                  onClick={() => openLightbox(index)}
                >
                  <div className="gcard-media">
                    <Image
                      src={item.type === 'video' ? item.thumbnail : item.src}
                      alt={item.title}
                      width={800}
                      height={600}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />

                    {item.type === 'video' ? (
                      <>
                        <span className="gcard-badge gbadge-video">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                          Video &bull; {item.duration}
                        </span>
                        <div className="gcard-play-pulse">
                          <span className="play-pulse-ring"></span>
                          <span className="play-pulse-btn">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4" /></svg>
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="gcard-badge gbadge-campus">{item.badge}</span>
                    )}

                    <div className="gcard-overlay">
                      <div className="gcard-info">
                        <span className="gcard-tag">{item.tag}</span>
                        <h4 className="gcard-title">{item.title}</h4>
                        <p className="gcard-text">{item.desc}</p>
                      </div>
                      <button className="gcard-action-btn" aria-label={item.type === 'video' ? 'Play video' : 'View photo'}>
                        {item.type === 'video' ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4" /></svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY LIGHTBOX MODAL (PHOTO & VIDEO) */}
        {lightboxIndex !== null && activeMediaItem && (
          <div className="gallery-lightbox active" id="galleryLightbox" role="dialog" aria-modal="true" aria-label="Media Lightbox" onClick={closeLightbox}>
            <div className="lightbox-backdrop" id="lightboxBackdrop"></div>
            <div className="lightbox-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="lightbox-close-btn" id="lightboxClose" aria-label="Close Lightbox" onClick={closeLightbox}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>

              <button className="lightbox-nav-btn lightbox-prev-btn" id="lightboxPrev" aria-label="Previous Media" onClick={showPrevMedia}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
              </button>

              <div className="lightbox-stage">
                <div className="lightbox-media-container" id="lightboxMediaContainer">
                  {activeMediaItem.type === 'video' ? (
                    <iframe
                      src={activeMediaItem.src}
                      title={activeMediaItem.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ width: '100%', height: '100%', borderRadius: '0.75rem', minHeight: '380px' }}
                    ></iframe>
                  ) : (
                    <img
                      src={activeMediaItem.src}
                      alt={activeMediaItem.title}
                      style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', display: 'block', margin: 'auto', borderRadius: '0.75rem' }}
                    />
                  )}
                </div>
                <div className="lightbox-info-bar">
                  <div className="lightbox-meta">
                    <span className="lightbox-counter" id="lightboxCounter">{lightboxIndex + 1} / {filteredItems.length}</span>
                    <h4 className="lightbox-title" id="lightboxTitle">{activeMediaItem.title}</h4>
                  </div>
                  <p className="lightbox-desc" id="lightboxDesc">{activeMediaItem.desc}</p>
                </div>
              </div>

              <button className="lightbox-nav-btn lightbox-next-btn" id="lightboxNext" aria-label="Next Media" onClick={showNextMedia}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
