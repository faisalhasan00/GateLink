import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, Mail, MapPin, Wrench } from 'lucide-react';

import ServicesNavbar from '../../features/services/components/ServicesNavbar';
import ServicesHero from '../../features/services/components/ServicesHero';
import ServicesCatalog from '../../features/services/components/ServicesCatalog';
import ServicesRateCard from '../../features/services/components/ServicesRateCard';
import ServicesWhyGateLink from '../../features/services/components/ServicesWhyGateLink';
import ServicesTestimonials from '../../features/services/components/ServicesTestimonials';
import ServicesFaq from '../../features/services/components/ServicesFaq';
import ServicesBookingModal from '../../features/services/components/ServicesBookingModal';

import '../../features/services/styles/services.css';

export default function ServicesLandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState({});

  useEffect(() => {
    document.title = 'GateLink Services — Certified Electricians, Plumbers & AC Technicians in 15 Mins';
    window.scrollTo(0, 0);
  }, []);

  const handleOpenBooking = (data = {}) => {
    setModalInitialData(data);
    setIsModalOpen(true);
  };

  const handleScrollToCatalog = () => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="services-page">
      {/* Sticky Navigation */}
      <ServicesNavbar onOpenBooking={() => handleOpenBooking()} />

      <main>
        {/* Hero Section */}
        <ServicesHero
          onOpenBooking={handleOpenBooking}
          onScrollToCatalog={handleScrollToCatalog}
        />

        {/* Trade Catalog */}
        <ServicesCatalog onOpenBooking={handleOpenBooking} />

        {/* Standardized Rate Card */}
        <ServicesRateCard onOpenBooking={handleOpenBooking} />

        {/* The GateLink Advantage */}
        <ServicesWhyGateLink />

        {/* Testimonials */}
        <ServicesTestimonials />

        {/* FAQs */}
        <ServicesFaq />
      </main>

      {/* Dedicated Footer */}
      <footer style={{ background: '#0F172A', color: '#F8FAFC', padding: '60px 24px 40px', borderTop: '1px solid #334155' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FFFFFF' }}>GateLink</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#E11D48', background: 'rgba(225, 29, 72, 0.2)', padding: '2px 8px', borderRadius: '6px' }}>
                SERVICES & REPAIRS
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, maxWidth: '320px' }}>
              On-demand verified electrician, plumbing, AC, and carpentry services for gated community residents. 15-minute emergency response & 30-day rework warranty.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '16px' }}>
              Repair Services
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#94A3B8' }}>
              <li>Electrician (Wiring & Fans)</li>
              <li>Plumbing & Tap Leakage Fixes</li>
              <li>Split AC Deep Foam Jet Service</li>
              <li>Door Lock & Carpentry Fittings</li>
              <li>Waterproofing & Wall Seepage Repair</li>
              <li>Herbal Cockroach & Pest Control</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '16px' }}>
              Emergency Helpline
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PhoneCall size={16} color="#E11D48" />
                <a href="tel:+919121863117" style={{ color: '#F8FAFC', textDecoration: 'none' }}>+91 91218 63117</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#E11D48" />
                <a href="mailto:services@gatelink.in" style={{ color: '#F8FAFC', textDecoration: 'none' }}>services@gatelink.in</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="#E11D48" />
                <span>Stationed across 450+ Gated Communities in Bangalore, Mumbai & NCR</span>
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
      <ServicesBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={modalInitialData}
      />
    </div>
  );
}
