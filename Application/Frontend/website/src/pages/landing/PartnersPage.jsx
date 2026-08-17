import React, { useState } from 'react';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';
import DemoModal from './DemoModal';
import { useTheme } from '../../context/ThemeContext';

// Modular Feature Components & Hook
import { usePartnerLead } from '../../features/partners/hooks/usePartnerLead';
import PartnerHero from '../../features/partners/components/PartnerHero';
import PartnerMetrics from '../../features/partners/components/PartnerMetrics';
import PartnerTierGrid from '../../features/partners/components/PartnerTierGrid';
import PartnerEarningsCalculator from '../../features/partners/components/PartnerEarningsCalculator';
import PromoterLinkGenerator from '../../features/partners/components/PromoterLinkGenerator';
import PartnerStatusTracker from '../../features/partners/components/PartnerStatusTracker';
import PartnerLeadForm from '../../features/partners/components/PartnerLeadForm';
import PartnerFaq from '../../features/partners/components/PartnerFaq';

export default function PartnersPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Modular Form Hook
  const {
    formData,
    refCodeFromUrl,
    selectedTier,
    setSelectedTier,
    submitting,
    submittedRef,
    validationError,
    handleInputChange,
    handleFormSubmit,
    resetForm,
  } = usePartnerLead();

  return (
    <div style={{
      backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
      color: isDark ? '#FFFFFF' : '#2C2C2C',
      minHeight: '100vh',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <SeoHead
        title="Partner & Referral Program - GateLink Society OS"
        description="Join GateLink's Partner Program and earn up to 10% Month 1 Bonus + 2% Lifetime Recurring Commissions by introducing housing societies."
        canonicalUrl="https://gatelink.in/partners"
      />

      {/* Header */}
      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      {/* Main Feature Modules */}
      <main>
        <PartnerHero />
        <PartnerMetrics />
        <PartnerTierGrid onSelectTier={(tierId) => setSelectedTier(tierId)} />
        <PartnerEarningsCalculator selectedTier={selectedTier} />
        <PromoterLinkGenerator />
        <PartnerStatusTracker />
        <PartnerLeadForm
          formData={formData}
          refCodeFromUrl={refCodeFromUrl}
          submitting={submitting}
          submittedRef={submittedRef}
          validationError={validationError}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          resetForm={resetForm}
        />
        <PartnerFaq />
      </main>

      {/* Footer & Demo Modal */}
      <FooterSection />
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
