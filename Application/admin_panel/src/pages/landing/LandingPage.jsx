import React, { useState } from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import TrustedSection from './TrustedSection';
import StatsSection from './StatsSection';
import FeaturesSection from './FeaturesSection';
import SolutionsSection from './SolutionsSection';
import ProposalSection from './ProposalSection';
import ContactSection from './ContactSection';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';

export default function LandingPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const handleOpenDemo = () => {
    setIsDemoModalOpen(true);
  };

  const handleCloseDemo = () => {
    setIsDemoModalOpen(false);
  };

  return (
    <div style={{ backgroundColor: '#020617', color: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Sticky Glassmorphic Navbar */}
      <Navbar onOpenDemo={handleOpenDemo} />

      {/* Main Sections */}
      <main>
        <HeroSection onOpenDemo={handleOpenDemo} />
        <TrustedSection />
        <StatsSection />
        <FeaturesSection />
        <SolutionsSection onOpenDemo={handleOpenDemo} />
        <ProposalSection onOpenDemo={handleOpenDemo} />
        <ContactSection />
      </main>

      {/* Footer */}
      <FooterSection />

      {/* Demo Booking Modal */}
      <DemoModal isOpen={isDemoModalOpen} onClose={handleCloseDemo} />
    </div>
  );
}
