import React, { useState } from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import SolutionsSection from './SolutionsSection';
import TrustedSection from './TrustedSection';
import FeaturesSection from './FeaturesSection';
import ComparisonSection from './ComparisonSection';
import FaqSection from './FaqSection';
import ProposalSection from './ProposalSection';
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
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Sticky Enterprise Navbar */}
      <Navbar onOpenDemo={handleOpenDemo} />

      {/* Main Sections */}
      <main>
        <HeroSection onOpenDemo={handleOpenDemo} />
        <SolutionsSection onOpenDemo={handleOpenDemo} />
        <TrustedSection />
        <FeaturesSection />
        <ComparisonSection />
        <FaqSection />
        <ProposalSection onOpenDemo={handleOpenDemo} />
      </main>

      {/* Footer */}
      <FooterSection />

      {/* Demo Booking Modal */}
      <DemoModal isOpen={isDemoModalOpen} onClose={handleCloseDemo} />
    </div>
  );
}
