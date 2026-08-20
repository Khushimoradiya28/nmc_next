import React from 'react';
import Image from 'next/image';
import styles from './WhyChooseUs.module.css';

export default function WhyChooseUs() {
  return (
    <section className={`${styles.sectionPadding} ${styles.whyChooseSection} section-padding why-choose-section`}>
    <div className={`${styles.container} container`}>
      <div className={`${styles.whyChooseLayout} why-choose-layout`}>
        {/* Left: Image Collage */}
        <div className={`${styles.whyChooseImages} why-choose-images`}>
          <div className={`${styles.whyImgCollage} why-img-collage`}>
            <div className={`${styles.whyImgLarge} why-img-large`}>
              <Image src="/assets/whyus/why-us3.jpg" alt="NMC College Building" width={400} height={500}  />
            </div>
            <div className={`${styles.whyImgSmallGroup} why-img-small-group`}>
              <div className={`${styles.whyImgSmall} why-img-small`}>
                <Image src="/assets/whyus/why-us1.jpg" alt="NMC Workshop" width={220} height={160}  />
              </div>
              <div className={`${styles.whyImgSmall} why-img-small`}>
                <Image src="/assets/whyus/why-us2.jpg" alt="NMC Subject Information" width={220} height={160}  />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className={`${styles.whyChooseContent} why-choose-content`}>
          <div className={`${styles.sectionSubtitle} section-subtitle`}>Why NMC Stands Out</div>
          <h2 className={`${styles.sectionTitle} section-title`}>Why Choose <span>Nandkunvarba Mahila College?</span></h2>
          <p className={`${styles.whyChooseDesc} why-choose-desc`}>Unmatched safety, academic rigor, financial relief, and professional growth for
            female students.</p>

          <div className={`${styles.whyChooseFeatures} why-choose-features`}>
            <div className={`${styles.whyFeatureItem} why-feature-item`}>
              <div className={`${styles.whyFeatureIcon} why-feature-icon`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <path d="M16 8h2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                  <path d="M8 18h8" />
                </svg>
              </div>
              <span className={`${styles.whyFeatureText} why-feature-text`}>100% Free Bus Service</span>
            </div>

            <div className={`${styles.whyFeatureItem} why-feature-item`}>
              <div className={`${styles.whyFeatureIcon} why-feature-icon`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 12 20 22 4 22 4 12" />
                  <rect x="2" y="7" width="20" height="5" />
                  <line x1="12" y1="22" x2="12" y2="7" />
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                </svg>
              </div>
              <span className={`${styles.whyFeatureText} why-feature-text`}>Free Designer Blazer Gift</span>
            </div>

            <div className={`${styles.whyFeatureItem} why-feature-item`}>
              <div className={`${styles.whyFeatureIcon} why-feature-icon`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className={`${styles.whyFeatureText} why-feature-text`}>Expert Faculty Mentors</span>
            </div>

            <div className={`${styles.whyFeatureItem} why-feature-item`}>
              <div className={`${styles.whyFeatureIcon} why-feature-icon`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <span className={`${styles.whyFeatureText} why-feature-text`}>Placement & Industry MoUs</span>
            </div>
          </div>

          <a href="#facilities" className={`${styles.whyChooseBtn} why-choose-btn`}>
            MORE DETAILS
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
  );
}
