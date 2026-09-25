import React, { useEffect, useState } from 'react';
import { ScrollExpandHero } from './components/hero/ScrollExpandHero';
import { AboutSection } from './components/about/AboutSection';
import { ProjectsSection } from './components/projects/ProjectsSection';
import { SkillsSection } from './components/skills/SkillsSection';
import { ExperienceSection } from './components/experience/ExperienceSection';
import { CertificationsSection } from './components/certifications/CertificationsSection';
import { ContactSection } from './components/contact/ContactSection';
import { Footer } from './components/footer/Footer';
import { ArchitectProfilePage } from './pages/ArchitectProfilePage';
import { initSmoothScroll, scrollTo } from './utils/smoothScroll';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'architect-profile'>('home');

  useEffect(() => {
    const lenis = initSmoothScroll();
    return () => {
      lenis?.destroy();
    };
  }, []);

  // Synchronize routing via URL hash and browser history (Back/Forward navigation)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/architect-profile' || hash === '#architect-profile') {
        setCurrentPage('architect-profile');
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const handleOpenProfile = () => {
    window.location.hash = '#/architect-profile';
    setCurrentPage('architect-profile');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToHome = () => {
    window.location.hash = '';
    setCurrentPage('home');
    setTimeout(() => {
      scrollTo('#about', -60);
    }, 60);
  };

  const scrollToContact = () => {
    // Dispatch expand-hero event first so expansion snaps open
    window.dispatchEvent(new CustomEvent('expand-hero'));
    setTimeout(() => {
      scrollTo('#contact', -60);
    }, 60);
  };

  if (currentPage === 'architect-profile') {
    return <ArchitectProfilePage onBack={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F7FF] via-[#E2EFFF] to-[#D5E8FD] text-slate-800 flex flex-col font-sans selection:bg-sky-200 selection:text-blue-900">
      {/* Hero Section with Scroll Expansion and Azure/Beige Ferrofluid */}
      <main className="flex-1">
        {/* Hero Section with Interactive Ink Reveal & Scroll Expansion */}
        <ScrollExpandHero onContactClick={scrollToContact}>
          <AboutSection onOpenProfile={handleOpenProfile} />
          <ProjectsSection />
          <SkillsSection />
          <ExperienceSection />
          <CertificationsSection />
          <ContactSection />
          <Footer />
        </ScrollExpandHero>
      </main>
    </div>
  );
};

export default App;
