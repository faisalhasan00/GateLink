import React, { useState, useEffect } from 'react';
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
import { Phone } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function LandingPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOpenDemo = () => {
    setIsDemoModalOpen(true);
  };

  const handleCloseDemo = () => {
    setIsDemoModalOpen(false);
  };

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", paddingBottom: isMobile ? '70px' : '0' }}>
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

      {/* Sticky Bottom Mobile Call/Demo Bar */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderTop: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #E5E7EB',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.12)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 9800
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#2C2C2C', lineHeight: 1.2 }}>
              To schedule a free demo,
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#94A3B8' : '#666666', marginTop: '2px' }}>
              call us on <a href="tel:+919999999999" style={{ color: '#00B589', textDecoration: 'none', fontWeight: 800 }}>+91 99999 99999</a>
            </div>
          </div>
          <a
            href="tel:+919999999999"
            aria-label="Call for free demo"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #00B589',
              boxShadow: '0 2px 10px rgba(0,181,137,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00B589',
              textDecoration: 'none'
            }}
          >
            <Phone size={18} color="#00B589" />
          </a>
        </div>
      )}
    </div>
  );
}
