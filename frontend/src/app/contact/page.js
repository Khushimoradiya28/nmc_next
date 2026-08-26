import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ContactForm from './ContactForm';
import styles from './page.module.css';

export const metadata = {
  title: 'Contact Us | Nandkunvarba Mahila College',
  description: 'Get in touch with Nandkunvarba Mahila College, Bhavnagar. Admission inquiry, campus address, phone, email & directions.',
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Banner */}
        <section className="hero-fullscreen" id="home" style={{ minHeight: "50vh", height: "50vh" }}>
          <div className="hero-bg-image">
            <Image
              src="/assets/home/hero/2.jpg"
              alt="Contact Us - NMC Bhavnagar"
              width={1400}
              height={700}
              priority
              className="hero-bg-img"
            />
          </div>
          <div className="hero-overlay" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))" }}></div>
          <div className="hero-content container" style={{ paddingTop: "100px", display: "flex", alignItems: "flex-end", height: "100%", paddingBottom: "80px" }}>
            <h1 className="hero-main-title"><em>Contact Us</em></h1>
          </div>
        </section>

        {/* Google Map */}
        <section className={styles.mapSection}>
          <div className={styles.container}>
            <div className={styles.mapWrapper}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3705.807869687989!2d72.1588143!3d21.7490487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395f5075bc7b99c7%3A0xa1aa677bbd1b64a2!2sNandkunvarba%20Mahila%20College!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Nandkunvarba Mahila College - Google Maps Location"
              />
            </div>
          </div>
        </section>

        {/* Main Content: Left Info + Right Form */}
        <section className={styles.contentSection}>
          {/* Decorative Background */}
          <div className={styles.bgMesh}>
            <div className={`${styles.glowOrb} ${styles.glowOrb1}`}></div>
            <div className={`${styles.glowOrb} ${styles.glowOrb2}`}></div>
            <div className={`${styles.glowOrb} ${styles.glowOrb3}`}></div>
            <div className={styles.gridPattern}></div>
          </div>

          <div className={styles.container}>
            <div className={styles.contentGrid}>
              {/* Left Sidebar: Image + Address + Contact + Social */}
              <aside className={styles.infoSidebar}>
                <div className={styles.infoImage}>
                  <Image
                    src="/assets/home/hero/2.jpg"
                    alt="Contact Support"
                    width={400}
                    height={400}
                  />
                </div>

                {/* Our Address */}
                <div className={styles.infoBlock}>
                  <h3 className={styles.infoBlockTitle}>Our Address</h3>
                  <p className={styles.infoBlockContent}>
                    Devraj nagar - 2, Saher farti sadak, Near Shivaji Circle, Ghogha Road, Bhavnagar.
                  </p>
                </div>

                {/* Get in Touch */}
                <div className={styles.infoBlock}>
                  <h3 className={styles.infoBlockTitle}>Get in Touch</h3>
                  <div className={styles.infoBlockContent}>
                    <div className={styles.infoLine}><strong>Contact No.:</strong> 0278 - 2471813/14/15/16/17</div>
                    <div className={styles.infoLine}><strong>Email:</strong> nmcbhavnagar@gmail.com</div>
                  </div>
                </div>

                {/* Follow Us */}
                <div className={styles.infoBlock}>
                  <h3 className={styles.infoBlockTitle}>Follow Us</h3>
                  <div className={styles.socialLinks}>
                    <a href="https://www.facebook.com/NMC.girls.college/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/nmcgirlscollege/?hl=en" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a href="https://www.youtube.com/channel/UCyzUFRmzw_b23dxa7eagNgg" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="YouTube">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                    <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="X (Twitter)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                    <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                    <a href="https://workspaceupdates.googleblog.com/2023/04/new-community-features-for-google-chat-and-an-update-currents%20.html" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Google Updates">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </aside>

              {/* Right: Form */}
              <ContactForm />
            </div>
          </div>
        </section>

        {/* CTA Bar */}
        <section className={styles.ctaBar}>
          <div className={styles.container}>
            <div className={styles.ctaBarInner}>
              <div className={styles.ctaBarIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <span className={styles.ctaBarText}>
                If you Have Any Questions Call Us On <strong>0278 - 2471813/14/15/16/17</strong>
              </span>
              <Link href="/contact" className={styles.ctaBarBtn}>Contact Us</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
