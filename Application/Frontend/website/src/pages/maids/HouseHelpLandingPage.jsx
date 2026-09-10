import React, { useState, useEffect } from 'react';
import MaidsNavbar from '../../features/maids/components/MaidsNavbar';
import MaidsCategoryHero from '../../features/maids/components/MaidsCategoryHero';
import MaidsQualityVetting from '../../features/maids/components/MaidsQualityVetting';
import MaidsServingCities from '../../features/maids/components/MaidsServingCities';
import MaidsTestimonials from '../../features/maids/components/MaidsTestimonials';
import MaidsFaq from '../../features/maids/components/MaidsFaq';
import MaidsFooter from '../../features/maids/components/MaidsFooter';
import MaidsBookingModal from '../../features/maids/components/MaidsBookingModal';

import '../../features/maids/styles/maids.css';

export default function HouseHelpLandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState({});

  useEffect(() => {
    document.title = 'House Help in India — Verified & Trained Experts | GateLink Maids';
    window.scrollTo(0, 0);
  }, []);

  const handleOpenBooking = (data = {}) => {
    setModalInitialData(data);
    setIsModalOpen(true);
  };

  return (
    <div className="maids-page">
      {/* Sticky Navigation */}
      <MaidsNavbar onOpenBooking={() => handleOpenBooking({ category: 'House Help' })} />

      <main>
        {/* House Help Category Hero (Matching Reference Design) */}
        <MaidsCategoryHero
          categoryTitle="House Help"
          city="India"
          subtitle="Book House Help online and get a verified Expert at your door in 10 minutes."
          image="/maids_house_help_hero.jpg"
          onOpenBooking={handleOpenBooking}
        />

        {/* Experts Vetted for Quality */}
        <MaidsQualityVetting />

        {/* Serving Homes Across Hyderabad */}
        <MaidsServingCities onOpenBooking={handleOpenBooking} />

        {/* Testimonials */}
        <MaidsTestimonials />

        {/* FAQs */}
        <MaidsFaq />
      </main>

      {/* Footer */}
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
