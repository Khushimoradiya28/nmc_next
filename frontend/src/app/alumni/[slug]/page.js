'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import styles from './page.module.css';

// ── Animation Variants ──
const fadeUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0 } };
const fadeLeft = { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.93 }, visible: { opacity: 1, scale: 1 } };

// ── SVG Icons ──
const IconUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconStar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconBriefcase = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="12"/><path d="M12 12h.01"/>
  </svg>
);
const IconMail = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

// ══════════════════════════════════════
// PAGE 1 — ALUMNI ASSOCIATION
// ══════════════════════════════════════
function AlumniAssociationPage() {
  const programs = [
    {
      icon: <IconUsers />, iconClass: 'red',
      title: 'Mentorship Program',
      desc: 'Connect with senior alumni in IT, banking, design, and academia for career counseling, mock interviews, and real-world guidance.',
      action: 'Learn More'
    },
    {
      icon: <IconStar />, iconClass: 'gold',
      title: 'Annual Alumni Meet',
      desc: 'Every year, reconnect with batchmates, share achievements, and inspire current students at our flagship campus reunion.',
      action: 'View Gallery'
    },
    {
      icon: <IconBriefcase />, iconClass: 'dark',
      title: 'Placement Network',
      desc: 'Our alumni-driven job network helps current graduates find opportunities through referrals across sectors.',
      action: 'Explore Jobs'
    },
    {
      icon: <IconMail />, iconClass: 'red',
      title: 'Alumni Registration',
      desc: 'Graduate of NMC? Register to join the official alumni database and receive event invitations and newsletters.',
      action: 'Register Now'
    },
    {
      icon: <IconStar />, iconClass: 'gold',
      title: 'Scholarship Fund',
      desc: 'Alumni donate to scholarships helping deserving current students pursue their academic goals without financial burden.',
      action: 'Contribute'
    },
    {
      icon: <IconBriefcase />, iconClass: 'dark',
      title: 'Industry Workshops',
      desc: 'Alumni-led workshops on emerging skills, entrepreneurship, and career development organized every semester.',
      action: 'Join Workshop'
    },
  ];

  return (
    <section className={styles.contentSection}>
      <div className={styles.container}>

        {/* Intro grid — image + text */}
        <motion.div
          className={styles.introGrid}
          initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
        >
          <motion.div className={styles.introImageWrap} variants={scaleIn} transition={{ duration: 0.6 }}>
            <Image
              src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=85"
              alt="Alumni association graduation ceremony"
              fill sizes="(max-width: 1024px) 100vw, 50vw"
              className={styles.introImage}
              priority
            />
            <div className={styles.introImageOverlay} />
          </motion.div>
          <motion.div className={styles.introContent} variants={fadeLeft} transition={{ duration: 0.6 }}>
            <span className={styles.badge}>Alumni Association</span>
            <h2 className={styles.pageTitle}>
              A Network That <span className={styles.highlight}>Never Stops</span> Growing
            </h2>
            <p className={styles.leadText}>
              Our Alumni Association brings together thousands of graduates working across diverse sectors
              globally, fostering mentorship, career guidance, and lifelong sisterhood bonds.
            </p>
          </motion.div>
        </motion.div>

        {/* Program cards */}
        <motion.div
          className={styles.programCards}
          initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={stagger}
        >
          {programs.map((p, i) => (
            <motion.div key={i} className={styles.programCard} variants={fadeUp} transition={{ duration: 0.4 }}>
              <div className={`${styles.cardIcon} ${styles[p.iconClass]}`}>{p.icon}</div>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardDesc}>{p.desc}</p>
              <button className={styles.cardAction}>{p.action} <IconArrow /></button>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ══════════════════════════════════════
// PAGE 2 — OTHER DETAILS
// ══════════════════════════════════════
function OtherDetailsPage() {
  const milestones = [
    { year: '2024', title: 'Annual Alumni Meet — 15th Edition', desc: 'Over 400 alumni attended the landmark reunion. Featured keynotes from IAS officers, doctors, and fashion designers who are NMC graduates.' },
    { year: '2023', title: 'Scholarship Fund Launch', desc: '10 scholarships were awarded to meritorious students under the Alumni Scholarship Initiative, funded entirely by alumni contributions.' },
    { year: '2022', title: 'Industry Partnership Drive', desc: 'Alumni working in corporate sectors signed MoUs with the college to create placement channels for final-year students.' },
    { year: '2021', title: 'Digital Alumni Network', desc: 'Launch of the online alumni portal connecting 2,000+ graduates across 15 countries for mentorship and networking.' },
    { year: '2019', title: 'Centenary Alumni Celebration', desc: 'Grand centenary celebration with alumni from across India sharing their journeys and inspiring the next generation.' },
  ];

  const images = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', // alumni annual meet – conference hall
    'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=600&q=80', // scholarship – student with award
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',    // industry partnership – professional meeting
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80',    // digital alumni network – laptop
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=80', // centenary celebration – graduation
    'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80',    // NMC college campus building
  ];

  return (
    <section className={styles.contentSection}>
      <div className={styles.container}>

        <motion.div
          initial="hidden" whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp} transition={{ duration: 0.5 }}
          style={{ marginBottom: '3rem' }}
        >
          <span className={styles.badge}>Legacy Milestones</span>
          <h2 className={styles.pageTitle}>
            Alumni <span className={styles.highlight}>Achievements</span> & Events
          </h2>
          <p className={styles.leadText}>
            Explore the milestones and achievements of our alumnae who have brought pride to NMC through
            their national and international accomplishments.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className={styles.timelineWrap}
          initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={stagger}
        >
          {milestones.map((m, i) => (
            <motion.div key={i} className={styles.timelineItem} variants={fadeLeft} transition={{ duration: 0.45 }}>
              <div className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                <div className={styles.timelineYear}>{m.year}</div>
                <h3 className={styles.timelineTitle}>{m.title}</h3>
                <p className={styles.timelineDesc}>{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonial */}
        <motion.div
          className={styles.testimonialBox}
          initial="hidden" whileInView="visible"
          viewport={{ once: true }}
          variants={scaleIn} transition={{ duration: 0.55 }}
        >
          <p className={styles.testimonialText}>
            "The guidance and practical training I received at NMC was the cornerstone of my corporate career.
            The values instilled here shaped who I am professionally and personally."
          </p>
          <div className={styles.testimonialAuthor}>— Krina Gohil, Fashion Designer &nbsp;·&nbsp; Batch 2024</div>
        </motion.div>

        {/* Image Grid */}
        <motion.div
          className={styles.alumniImageGrid}
          initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={stagger}
        >
          {images.map((src, i) => (
            <motion.div key={i} className={styles.alumniImageItem} variants={scaleIn} transition={{ duration: 0.4 }}>
              <Image src={src} alt={`Alumni event ${i + 1}`} fill sizes="(max-width: 768px) 50vw, 33vw" />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ══════════════════════════════════════
// PAGE 3 — FEEDBACK LINK
// ══════════════════════════════════════
function FeedbackLinkPage() {
  const forms = [
    {
      num: '01',
      type: 'Student Feedback',
      desc: 'For currently enrolled students to evaluate curriculum quality, teaching effectiveness, and campus infrastructure.',
      link: '#'
    },
    {
      num: '02',
      type: 'Alumni Feedback',
      desc: 'For graduates to evaluate how relevant their NMC courses were to their professional careers and growth.',
      link: '#'
    },
    {
      num: '03',
      type: 'Employer Feedback',
      desc: 'For organizations hiring our graduates to evaluate their skill competencies, work ethic, and professional readiness.',
      link: '#'
    },
  ];

  return (
    <section className={styles.contentSection}>
      <div className={styles.container}>

        {/* Intro + Image */}
        <motion.div
          className={styles.feedbackIntro}
          initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.55 }}>
            <span className={styles.badge}>Feedback Gateway</span>
            <h2 className={styles.pageTitle}>
              Your Voice <span className={styles.highlightGold}>Shapes</span> Our Future
            </h2>
            <p className={styles.leadText}>
              We constantly strive to improve our educational quality and student experience.
              Select your category below to submit feedback — your insights drive real change.
            </p>
          </motion.div>
          <motion.div className={styles.feedbackImageWrap} variants={scaleIn} transition={{ duration: 0.55, delay: 0.1 }}>
            <Image
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=85"
              alt="Student filling feedback form"
              fill sizes="(max-width: 1024px) 100vw, 50vw"
              className={styles.feedbackImage}
            />
            <div className={styles.feedbackImageOverlay} />
          </motion.div>
        </motion.div>

        {/* Feedback Cards */}
        <motion.div
          className={styles.feedbackCards}
          initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={stagger}
        >
          {forms.map((f, i) => (
            <motion.div key={i} className={styles.feedbackCard} variants={fadeUp} transition={{ duration: 0.4 }}>
              <div className={styles.feedbackNum}>{f.num}</div>
              <h3 className={styles.feedbackType}>{f.type}</h3>
              <p className={styles.feedbackDesc}>{f.desc}</p>
              <Link href={f.link} className={styles.feedbackBtn}>
                Open Form <IconArrow />
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ══════════════════════════════════════
// MAIN PAGE COMPONENT
// ══════════════════════════════════════

const pageConfig = {
  'alumni-association': {
    title: 'Alumni Association',
    // Banner: alumni reunion/networking event crowd
    heroBg: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=90',
    subtitle: 'Institutional Sisterhood Network',
    Component: AlumniAssociationPage,
  },
  'other-details': {
    title: 'Other Details',
    // Banner: graduation ceremony caps thrown
    heroBg: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&q=90',
    subtitle: 'Legacy Milestones & Achievements',
    Component: OtherDetailsPage,
  },
  'feedback-link': {
    title: 'Feedback Link',
    // Banner: person writing/filling a survey form
    heroBg: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=90',
    subtitle: 'Your Voice Shapes Our Future',
    Component: FeedbackLinkPage,
  },
};

export default function AlumniSubPage() {
  const params = useParams();
  const slug = params?.slug || '';

  const config = pageConfig[slug] || {
    title: 'Alumni Legacy',
    heroBg: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&q=90',
    subtitle: 'Connect with the Network',
    Component: () => (
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <p style={{ color: '#888' }}>Page under development.</p>
        </div>
      </section>
    ),
  };

  const { title, heroBg, subtitle, Component } = config;

  return (
    <>
      <Header />
      <main>
        <ActivityHero
          title={title}
          subtitle={subtitle}
          bgImage={heroBg}
          height="50vh"
          decorative={true}
          breadcrumbs={[
            { label: 'Contact Us', link: '/contact' },
            { label: 'Alumni Legacy' },
            { label: title },
          ]}
        />
        <Component />
      </main>
      <Footer />
    </>
  );
}
