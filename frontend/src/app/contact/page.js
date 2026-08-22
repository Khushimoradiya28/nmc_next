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
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733-16z"/><path d="M4 20l6.768-6.768m2.46-2.46L20 4"/></svg>
                    </a>
                    <a href="https://google.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Google">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.945 11a9 9 0 1 1-3.284-5.997l-2.655 2.392A5.5 5.5 0 1 0 17.125 14H13v-3h8a1 1 0 0 1 1 1"/></svg>
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
