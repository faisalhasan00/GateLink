import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, PhoneCall, Mail, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

import InteriorsNavbar from '../../features/interiors/components/InteriorsNavbar';
import InteriorsHero from '../../features/interiors/components/InteriorsHero';
import InteriorsTrustStrip from '../../features/interiors/components/InteriorsTrustStrip';
import InteriorsModularKitchenShowcase from '../../features/interiors/components/InteriorsModularKitchenShowcase';
import InteriorsBedroomShowcase from '../../features/interiors/components/InteriorsBedroomShowcase';
import InteriorsLivingRoomShowcase from '../../features/interiors/components/InteriorsLivingRoomShowcase';
import InteriorsSpaceSavingShowcase from '../../features/interiors/components/InteriorsSpaceSavingShowcase';
import InteriorsProjectsShowcase from '../../features/interiors/components/InteriorsProjectsShowcase';
import InteriorsHyderabadReviews from '../../features/interiors/components/InteriorsHyderabadReviews';
import InteriorsComparisonTable from '../../features/interiors/components/InteriorsComparisonTable';
import InteriorsHappyCustomersShowcase from '../../features/interiors/components/InteriorsHappyCustomersShowcase';
import InteriorsSolutionsCatalog from '../../features/interiors/components/InteriorsSolutionsCatalog';
import InteriorsLookbook from '../../features/interiors/components/InteriorsLookbook';
import InteriorsCityBanner from '../../features/interiors/components/InteriorsCityBanner';
import InteriorsProcess from '../../features/interiors/components/InteriorsProcess';
import InteriorsFaq from '../../features/interiors/components/InteriorsFaq';
import InteriorsConsultationModal from '../../features/interiors/components/InteriorsConsultationModal';

import '../../features/interiors/styles/interiors.css';

export default function InteriorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState({});

  useEffect(() => {
    document.title = 'GateLink Interiors — Luxury Home Interiors for Gated Communities';
    window.scrollTo(0, 0);
  }, []);

  const handleOpenConsultation = (data = {}) => {
    setModalInitialData(data);
    setIsModalOpen(true);
  };

  const handleScrollToEstimator = () => {
    handleOpenConsultation({ topic: 'Instant Cost Estimate' });
  };

  return (
    <div className="interiors-page">
      {/* Sticky Navigation */}
      <InteriorsNavbar onOpenConsultation={() => handleOpenConsultation()} />

      <main>
        {/* Hero Section */}
        <InteriorsHero
          onOpenConsultation={handleOpenConsultation}
          onScrollToEstimator={handleScrollToEstimator}
        />

        {/* Elevated Trust Highlights Ribbon Strip (Matching Reference) */}
        <InteriorsTrustStrip />

        {/* Smart Modular Kitchen Designs Showcase (Matching Reference Screenshot) */}
        <InteriorsModularKitchenShowcase onOpenConsultation={handleOpenConsultation} />

        {/* Bedroom Interiors Showcase (Matching Reference Screenshot) */}
        <InteriorsBedroomShowcase onOpenConsultation={handleOpenConsultation} />

        {/* Living Room Interiors Showcase (Matching Reference Screenshot) */}
        <InteriorsLivingRoomShowcase onOpenConsultation={handleOpenConsultation} />

        {/* Space-Saving Designs Showcase (Matching Reference Screenshot) */}
        <InteriorsSpaceSavingShowcase onOpenConsultation={handleOpenConsultation} />

        {/* Latest Home Interior Projects In Hyderabad (Matching Reference Screenshot) */}
        <InteriorsProjectsShowcase onOpenConsultation={handleOpenConsultation} />

        {/* Customer Reviews & Google Trust Card (Matching Reference Screenshot) */}
        <InteriorsHyderabadReviews onOpenConsultation={handleOpenConsultation} />

        {/* Why Choose Our Interior Designers Comparison Table (Matching Reference Screenshot) */}
        <InteriorsComparisonTable />

        {/* Happy Customers Testimonial Showcase (Matching Reference Screenshot) */}
        <InteriorsHappyCustomersShowcase onOpenConsultation={handleOpenConsultation} />

        {/* Solutions Catalog & Outline Grid (Matching Reference Screenshot) */}
        <InteriorsSolutionsCatalog
          onOpenConsultation={handleOpenConsultation}
          onScrollToEstimator={handleScrollToEstimator}
        />

        {/* Curated Lookbook */}
        <InteriorsLookbook onOpenConsultation={handleOpenConsultation} />

        {/* Hyderabad City Mid-Page Banner (Matching Reference Screenshot) */}
        <InteriorsCityBanner onOpenConsultation={handleOpenConsultation} />

        {/* 4-Step Process */}
        <InteriorsProcess onOpenConsultation={handleOpenConsultation} />

        {/* FAQs */}
        <InteriorsFaq />
      </main>

      {/* Dedicated Luxury Footer */}
      <footer style={{ background: '#0F172A', color: '#F8FAFC', padding: '60px 24px 40px', borderTop: '1px solid #334155' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FFFFFF' }}>GateLink</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#E25B38', background: 'rgba(226, 91, 56, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                INTERIORS
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, maxWidth: '320px' }}>
              End-to-end luxury home interiors engineered exclusively for apartment owners in gated societies. 45-day move-in guarantee & 10-year warranty.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '16px' }}>
              Design Services
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#94A3B8' }}>
              <li>Modular Kitchen Design (Acrylic & PU)</li>
              <li>Floor-to-Ceiling Wardrobes & Storage</li>
              <li>Living Room TV Units & Acoustic Panelling</li>
              <li>False Ceiling & Ambient Cove Lighting</li>
              <li>Full Home Turnkey Transformations</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '16px' }}>
              Direct Consultation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PhoneCall size={16} color="#E25B38" />
                <a href="tel:+919121863117" style={{ color: '#F8FAFC', textDecoration: 'none' }}>+91 91218 63117</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#E25B38" />
                <a href="mailto:interiors@gatelink.in" style={{ color: '#F8FAFC', textDecoration: 'none' }}>interiors@gatelink.in</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="#E25B38" />
                <span>Experience Centre: Indiranagar, Bangalore</span>
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

      {/* Free 3D Design Consultation Modal */}
      <InteriorsConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={modalInitialData}
      />
    </div>
  );
}
