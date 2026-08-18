import React, { useState } from 'react';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';
import DemoModal from './DemoModal';
import { useTheme } from '../../context/ThemeContext';

import { usePartnerLead } from '../../features/partners/hooks/usePartnerLead';
import { subscribeCommissionRates } from '../../features/partners/services/partnerService';
import PartnerHero from '../../features/partners/components/PartnerHero';
import PartnerMetrics from '../../features/partners/components/PartnerMetrics';
import PartnerTierGrid from '../../features/partners/components/PartnerTierGrid';
import PartnerEarningsCalculator from '../../features/partners/components/PartnerEarningsCalculator';
import PromoterLinkGenerator from '../../features/partners/components/PromoterLinkGenerator';
import PartnerStatusTracker from '../../features/partners/components/PartnerStatusTracker';
import PartnerLeadForm from '../../features/partners/components/PartnerLeadForm';
import PartnerOnboardingWizard from '../../features/partners/components/onboarding/PartnerOnboardingWizard';
import PartnerFaq from '../../features/partners/components/PartnerFaq';

export default function PartnersPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Dynamic Commission Rates (Synced Live from Super Admin)
  const [rates, setRates] = useState({
    tier1Month1Percent: 5,
    tier1MonthlyPercent: 2,
    tier2Month1Percent: 10,
    tier2MonthlyPercent: 2,
    tier3Month1Percent: 10,
    tier3MonthlyPercent: 2,
    baseRatePerFlat: 25,
    minFlatsThreshold: 40,
  });

  React.useEffect(() => {
    const unsub = subscribeCommissionRates((data) => {
      setRates((prev) => ({ ...prev, ...data }));
    });
    return () => unsub();
  }, []);

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
        <PartnerHero rates={rates} />
        <PartnerMetrics rates={rates} />
        <PartnerTierGrid rates={rates} onSelectTier={(tierId) => setSelectedTier(tierId)} />
        <PartnerEarningsCalculator rates={rates} selectedTier={selectedTier} />
        <PromoterLinkGenerator />
        <PartnerStatusTracker />
        <PartnerLeadForm
          formData={formData}
          refCodeFromUrl={refCodeFromUrl}
          selectedTier={selectedTier}
          setSelectedTier={setSelectedTier}
          submitting={submitting}
          submittedRef={submittedRef}
          validationError={validationError}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          resetForm={resetForm}
        />
        <PartnerOnboardingWizard />
        <PartnerFaq />
      </main>

      {/* Footer & Demo Modal */}
      <FooterSection />
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
