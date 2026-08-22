import Image from 'next/image';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import TransportForm from './TransportForm';
import styles from './page.module.css';

export const metadata = {
  title: 'Transportation Inquiry | Student Corner | Nandkunvarba Mahila College',
  description: '100% free bus service routes, schedules, and transportation inquiry at NMC Bhavnagar.',
};

const routes = [
  { name: 'Bhavnagar City Route', stops: 'Waghawadi → Kaliyabid → Ghogha Circle → NMC', time: '7:30 AM' },
  { name: 'Sihor Route', stops: 'Sihor → Budhel → Vartej → NMC Campus', time: '7:00 AM' },
  { name: 'Palitana Route', stops: 'Palitana → Talaja → Mahuva → NMC Campus', time: '6:45 AM' },
  { name: 'Ghogha Route', stops: 'Ghogha → Koliyak → Trap → NMC Campus', time: '7:15 AM' },
  { name: 'Botad Route', stops: 'Botad → Gadhada → Vallabhipur → NMC Campus', time: '6:30 AM' },
  { name: 'Dholera Route', stops: 'Dholera → Ranpur → Airport Rd → NMC Campus', time: '6:45 AM' },
];

export default function TransportationInquiryPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className={styles.heroSection}>
          <div className={styles.heroBgImage}>
            <Image src="/assets/home/hero/2.jpg" alt="Transportation" width={1400} height={700} priority className={styles.heroBgImg} />
          </div>
          <div className={styles.heroOverlay}></div>
          <div className={`${styles.heroContent} container`}>
            <h1 className={`hero-main-title ${styles.heroTitle}`}><em>Transportation Inquiry</em></h1>
          </div>
        </section>

        {/* Highlight Banner */}
        <section className={styles.highlightBanner}>
          <div className={styles.container}>
            <div className={styles.bannerCard}>
              <div className={styles.bannerLeft}>
                <div className={styles.bannerIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="15" rx="2"/><circle cx="7.5" cy="15.5" r="1.5"/><circle cx="16.5" cy="15.5" r="1.5"/><path d="M16 3v4H8V3"/>
                  </svg>
                </div>
                <div>
                  <h2 className={styles.bannerTitle}>100% Free Bus Service</h2>
                  <p className={styles.bannerSub}>Doorstep pick-up &amp; drop for all female students — 15+ village routes daily</p>
                </div>
              </div>
              <span className={styles.bannerBadge}>Completely Free</span>
            </div>
          </div>
        </section>

        {/* Routes Section */}
        <section className={styles.routesSection}>
          <div className={styles.container}>
            <div className={styles.routesHeader}>
              <div className={styles.routesLabel}>
                <span className={styles.routesLabelLine}></span>
                Bus Routes
              </div>
              <h2 className={styles.routesTitle}>Active <span>Routes</span></h2>
              <p className={styles.routesDesc}>
                Our fleet covers 15+ villages and town areas with morning pickup and afternoon drop-back schedules.
              </p>
            </div>

            <div className={styles.routeList}>
              {routes.map((route, i) => (
                <div className={styles.routeCard} key={i}>
                  <span className={styles.routeNum}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={styles.routeInfo}>
                    <h4 className={styles.routeName}>{route.name}</h4>
                    <p className={styles.routeStops}>{route.stops}</p>
                  </div>
                  <span className={styles.routeTime}>{route.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Inquiry Form Section */}
        <section className={styles.inquirySection}>
          <div className={styles.container}>
            <div className={styles.inquiryLayout}>
              <div className={styles.inquiryLeft}>
                <h2 className={styles.inquiryTitle}>Need a Bus Pass or Route Info?</h2>
                <p className={styles.inquiryDesc}>
                  Fill the inquiry form and our transport coordinator will contact you with route details, pickup timing, and digital bus pass information.
                </p>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/></svg>
                  </span>
                  <span className={styles.contactText}>0278 - 2471813 / 14 / 15</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </span>
                  <span className={styles.contactText}>nmcbhavnagar@gmail.com</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </span>
                  <span className={styles.contactText}>Mon - Sat: 8:00 AM to 1:30 PM</span>
                </div>
              </div>

              <TransportForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
