import Header from '@/components/layout/Header/Header';
import Hero from '@/components/home/Hero/Hero';
import StatsSection from '@/components/home/StatsSection/StatsSection';
import CollegeOverview from '@/components/home/CollegeOverview/CollegeOverview';
import WhyChooseUs from '@/components/home/WhyChooseUs/WhyChooseUs';
import InfrastructureSection from '@/components/home/InfrastructureSection/InfrastructureSection';
import VirtualTourSection from '@/components/home/VirtualTourSection/VirtualTourSection';
import AwardsSection from '@/components/home/AwardsSection/AwardsSection';
import CertificateCoursesSection from '@/components/home/CertificateCourses/CertificateCoursesSection';
import DignitaryTestimonial from '@/components/home/DignitaryTestimonial/DignitaryTestimonial';
import Admission from '@/components/admission/Admission';
import CTASection from '@/components/home/CTASection/CTASection';
import HighlightsSection from '@/components/home/HighlightsSection/HighlightsSection';
import Footer from '@/components/layout/Footer/Footer';

export const metadata = {
  title: "Nandkunvarba Mahila College (NMC) Bhavnagar | Premier Women's Education",
  description: "Nandkunvarba Mahila College (NMC) Bhavnagar, managed by Shree Sahajanand Education Trust & affiliated with MK Bhavnagar University. Offering BBA, BCA, BA, BCom, MA, MCom, MSW, DFD, DNYS with 100% Free Bus Service.",
};

export default function Home() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: 0, overflowX: 'hidden' }}>
        <Hero />
        <StatsSection />
        <CollegeOverview />
        <WhyChooseUs />
        <InfrastructureSection />
        <VirtualTourSection />
        <AwardsSection />
        <CertificateCoursesSection />
        <DignitaryTestimonial />
        <Admission />
        <CTASection />
        <HighlightsSection />
      </main>
      <Footer />
    </>
  );
}
