import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, PhoneCall, Mail, MapPin, Zap, ShieldCheck } from 'lucide-react';

import MaidsNavbar from '../../features/maids/components/MaidsNavbar';
import MaidsHero from '../../features/maids/components/MaidsHero';
import MaidsExpertsShowcase from '../../features/maids/components/MaidsExpertsShowcase';
import MaidsQualityVetting from '../../features/maids/components/MaidsQualityVetting';
import MaidsServingCities from '../../features/maids/components/MaidsServingCities';
import MaidsTestimonials from '../../features/maids/components/MaidsTestimonials';
import MaidsFaq from '../../features/maids/components/MaidsFaq';
import MaidsFooter from '../../features/maids/components/MaidsFooter';
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

        {/* Testimonials */}
        <MaidsTestimonials />

        {/* FAQs */}
        <MaidsFaq />
      </main>

      {/* Minimalist Dark Footer with QR Code & Watermark */}
      <MaidsFooter />

      {/* Booking Modal */}
      <MaidsBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={modalInitialData}
      />
    </div>
  );
}
