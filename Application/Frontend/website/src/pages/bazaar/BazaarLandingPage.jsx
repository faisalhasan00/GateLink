import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, Mail, MapPin, ShoppingBag, ShieldCheck, Heart } from 'lucide-react';

import BazaarNavbar from '../../features/bazaar/components/BazaarNavbar';
import BazaarHero from '../../features/bazaar/components/BazaarHero';
import BazaarCategories from '../../features/bazaar/components/BazaarCategories';
import BazaarLiveFeed from '../../features/bazaar/components/BazaarLiveFeed';
import BazaarSafetyPillars from '../../features/bazaar/components/BazaarSafetyPillars';
import BazaarSteps from '../../features/bazaar/components/BazaarSteps';
import BazaarTestimonials from '../../features/bazaar/components/BazaarTestimonials';
import BazaarFaq from '../../features/bazaar/components/BazaarFaq';
import BazaarPostListingModal from '../../features/bazaar/components/BazaarPostListingModal';

import '../../features/bazaar/styles/bazaar.css';

export default function BazaarLandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState({});

  useEffect(() => {
    document.title = 'GateLink Bazaar — Hyper-Local Society Marketplace | Zero Commission';
    window.scrollTo(0, 0);
  }, []);

  const handleOpenPostModal = (data = {}) => {
    setModalInitialData(data);
    setIsModalOpen(true);
  };

  const handleSelectCategory = (catTitle) => {
    handleOpenPostModal({ category: catTitle });
  };

  const handleOpenItem = (item) => {
    handleOpenPostModal({
      title: `Inquiry for ${item.title}`,
      category: item.category,
    });
  };

  return (
    <div className="bazaar-page-wrapper">
      {/* Navigation */}
      <BazaarNavbar onOpenPostModal={() => handleOpenPostModal()} />

      <main>
        {/* Hero Section */}
        <BazaarHero 
          onOpenPostModal={() => handleOpenPostModal()}
          onSearchSelect={handleSelectCategory}
        />

        {/* Categories Grid */}
        <BazaarCategories onSelectCategory={handleSelectCategory} />

        {/* Live Society Listings Feed */}
        <BazaarLiveFeed onOpenItemModal={handleOpenItem} />

        {/* Trust & Safety Comparison */}
        <BazaarSafetyPillars />

        {/* 4-Step Process */}
        <BazaarSteps />

        {/* Resident Testimonials */}
        <BazaarTestimonials />

        {/* FAQ */}
        <BazaarFaq />
      </main>

      {/* Post Free Ad Modal */}
      <BazaarPostListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={modalInitialData}
      />

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '4.5rem 1.5rem 2.5rem', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', marginBottom: '3.5rem' }}>
          {/* Col 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div style={{ background: '#ecfdf5', padding: '0.4rem', borderRadius: '8px', color: '#059669', display: 'flex' }}>
                <ShoppingBag size={22} />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.025em' }}>
                GateLink <span style={{ color: '#10b981' }}>Bazaar</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#94a3b8', marginBottom: '1.5rem' }}>
              The secure hyper-local community marketplace for gated societies. Buy, sell, and trade with verified neighbors inside your gates with 0% commission.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#10b981' }}>
              <ShieldCheck size={16} />
              <span>100% Resident KYC Verified</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Marketplace Categories
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><a href="#categories" style={{ color: '#94a3b8', textDecoration: 'none' }}>Furniture & Home Decor</a></li>
              <li><a href="#categories" style={{ color: '#94a3b8', textDecoration: 'none' }}>Electronics & Gadgets</a></li>
              <li><a href="#categories" style={{ color: '#94a3b8', textDecoration: 'none' }}>Kids, Toys & Cycles</a></li>
              <li><a href="#categories" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home Food & Bakers</a></li>
              <li><a href="#categories" style={{ color: '#94a3b8', textDecoration: 'none' }}>Books, Plants & Hobbies</a></li>
              <li><a href="#categories" style={{ color: '#94a3b8', textDecoration: 'none' }}>Parking & Carpool</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              GateLink Ecosystem
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/interiors" style={{ color: '#94a3b8', textDecoration: 'none' }}>GateLink Interiors</Link></li>
              <li><Link to="/maids" style={{ color: '#94a3b8', textDecoration: 'none' }}>GateLink Maids & Home Care</Link></li>
              <li><Link to="/services" style={{ color: '#94a3b8', textDecoration: 'none' }}>GateLink Home Repairs</Link></li>
              <li><Link to="/society-management-software" style={{ color: '#94a3b8', textDecoration: 'none' }}>Society Management ERP</Link></li>
              <li><Link to="/security-management" style={{ color: '#94a3b8', textDecoration: 'none' }}>Gate Security System</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Need Help?
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PhoneCall size={16} style={{ color: '#10b981' }} />
                <span>+91 91218 63117</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} style={{ color: '#10b981' }} />
                <span>support@gatelink.in</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                <span>Bengaluru, Hyderabad, Mumbai, Pune, Delhi NCR</span>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', paddingTop: '2rem', borderTop: '1px solid #1e293b', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.85rem' }}>
          <div>
            © {new Date().getFullYear()} GateLink Technologies Private Limited. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/privacy" style={{ color: '#94a3b8', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: '#94a3b8', textDecoration: 'none' }}>Terms of Service</Link>
            <Link to="/refund-policy" style={{ color: '#94a3b8', textDecoration: 'none' }}>Trust & Safety</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
