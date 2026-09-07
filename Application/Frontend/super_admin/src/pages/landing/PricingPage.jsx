import React, { useState } from 'react';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import PricingHeroHeader from './pricing/PricingHeroHeader';
import PricingCardsGrid from './pricing/PricingCardsGrid';
import PricingRoiCalculator from './pricing/PricingRoiCalculator';
import PricingFaqSection from './pricing/PricingFaqSection';

export default function PricingPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState('annual'); // annual or monthly

  return (
    <div style={{ backgroundColor: '#020617', color: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Sticky Navbar */}
      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      {/* Header Banner & Billing Cycle Toggle */}
      <PricingHeroHeader 
        billingCycle={billingCycle} 
        setBillingCycle={setBillingCycle} 
      />

      {/* Pricing Cards Grid */}
      <PricingCardsGrid 
        billingCycle={billingCycle} 
        onOpenDemo={() => setIsDemoModalOpen(true)} 
      />

      {/* Interactive ROI Calculator Section */}
      <PricingRoiCalculator 
        onOpenDemo={() => setIsDemoModalOpen(true)} 
      />

      {/* FAQ Section */}
      <PricingFaqSection />

      {/* Footer */}
      <FooterSection />

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
