import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, PhoneCall, Mail, MapPin, Zap, ShieldCheck } from 'lucide-react';

import MaidsNavbar from '../../features/maids/components/MaidsNavbar';
import MaidsHero from '../../features/maids/components/MaidsHero';
import MaidsExpertsShowcase from '../../features/maids/components/MaidsExpertsShowcase';
import MaidsQualityVetting from '../../features/maids/components/MaidsQualityVetting';
import MaidsServingCities from '../../features/maids/components/MaidsServingCities';
import MaidsPricingCalculator from '../../features/maids/components/MaidsPricingCalculator';
import MaidsWhyGateLink from '../../features/maids/components/MaidsWhyGateLink';
import MaidsTestimonials from '../../features/maids/components/MaidsTestimonials';
import MaidsFaq from '../../features/maids/components/MaidsFaq';
import MaidsBookingModal from '../../features/maids/components/MaidsBookingModal';

import '../../features/maids/styles/maids.css';

export default function MaidsLandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState({});

  useEffect(() => {
    document.title = 'GateLink Maids — Verified House Help & Cleaning in 15 Minutes';
    window.scrollTo(0, 0);
  }, []);

  const handleOpenBooking = (data = {}) => {
    setModalInitialData(data);
    setIsModalOpen(true);
  };

  const handleScrollToServices = () => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="maids-page">
      {/* Sticky Navigation */}
      <MaidsNavbar onOpenBooking={() => handleOpenBooking()} />

      <main>
        {/* Hero Section */}
        <MaidsHero
          onOpenBooking={handleOpenBooking}
          onScrollToServices={handleScrollToServices}
        />

        {/* Trained & Verified Home Experts (Matching Reference) */}
        <MaidsExpertsShowcase onOpenBooking={handleOpenBooking} />

        {/* Experts Vetted for Quality (Matching Reference Design) */}
        <MaidsQualityVetting />

        {/* Serving Homes Across Hyderabad (Matching Reference Design) */}
        <MaidsServingCities onOpenBooking={handleOpenBooking} />

        {/* Pricing & Salary Calculator */}
        <MaidsPricingCalculator onOpenBooking={handleOpenBooking} />

        {/* The GateLink Advantage */}
        <MaidsWhyGateLink onOpenBooking={handleOpenBooking} />

        {/* Testimonials */}
        <MaidsTestimonials />

        {/* FAQs */}
        <MaidsFaq />
      </main>

      {/* Dedicated Footer */}
      <footer style={{ background: '#0F172A', color: '#F8FAFC', padding: '60px 24px 40px', borderTop: '1px solid #334155' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FFFFFF' }}>GateLink</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#D97706', background: 'rgba(217, 119, 6, 0.2)', padding: '2px 8px', borderRadius: '6px' }}>
                MAIDS & CARE
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, maxWidth: '320px' }}>
              On-demand verified house help, cooking, deep cleaning, and salon care tailored for gated community residents. 15-minute gate arrival guarantee.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '16px' }}>
              Services Available
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#94A3B8' }}>
              <li>Daily House Cleaning & Mopping</li>
              <li>Utensils & Dishwashing</li>
              <li>Homestyle Cooking (North/South Indian)</li>
              <li>Bathroom & Kitchen Deep Cleaning</li>
              <li>At-Home Salon & Beautician Care</li>
              <li>Babysitting & Senior Citizen Support</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '16px' }}>
              Customer Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PhoneCall size={16} color="#D97706" />
                <a href="tel:+919121863117" style={{ color: '#F8FAFC', textDecoration: 'none' }}>+91 91218 63117</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#D97706" />
                <a href="mailto:maids@gatelink.in" style={{ color: '#F8FAFC', textDecoration: 'none' }}>maids@gatelink.in</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="#D97706" />
                <span>Operating across 450+ Gated Communities in Bangalore, Mumbai & NCR</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1240px', margin: '40px auto 0', paddingTop: '24px', borderTop: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: '#64748B' }}>
          <div>© {new Date().getFullYear()} GateLink Technologies Pvt Ltd. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/privacy" style={{ color: '#94A3B8', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: '#94A3B8', textDecoration: 'none' }}>Terms of Service</Link>
            <Link to="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Back to GateLink Home</Link>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      <MaidsBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={modalInitialData}
      />
    </div>
  );
}
