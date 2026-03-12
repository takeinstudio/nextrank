import { useState, useEffect } from 'react';
import Preloader from '@/components/Preloader';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import SubjectsSection from '@/components/landing/SubjectsSection';
import FacultySection from '@/components/landing/FacultySection';
import YouTubeSection from '@/components/landing/YouTubeSection';
import InstagramSection from '@/components/landing/InstagramSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Preloader isLoading={loading} />
      <div className={loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
        <Navbar />
        <HeroSection />
        <div id="features"><FeaturesSection /></div>
        <div id="subjects"><SubjectsSection /></div>
        <div id="faculty"><FacultySection /></div>
        <div id="youtube"><YouTubeSection /></div>
        <InstagramSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
};

export default Index;
