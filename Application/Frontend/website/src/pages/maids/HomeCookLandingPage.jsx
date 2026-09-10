import React, { useState, useEffect } from 'react';
import MaidsNavbar from '../../features/maids/components/MaidsNavbar';
import MaidsCategoryHero from '../../features/maids/components/MaidsCategoryHero';
import CookOneCookScope from '../../features/maids/components/CookOneCookScope';
import CookKitchenHygiene from '../../features/maids/components/CookKitchenHygiene';
import CookWhyFamiliesTrust from '../../features/maids/components/CookWhyFamiliesTrust';
import MaidsQualityVetting from '../../features/maids/components/MaidsQualityVetting';
import MaidsServingCities from '../../features/maids/components/MaidsServingCities';
import MaidsTestimonials from '../../features/maids/components/MaidsTestimonials';
import MaidsFaq from '../../features/maids/components/MaidsFaq';
import MaidsFooter from '../../features/maids/components/MaidsFooter';
import MaidsBookingModal from '../../features/maids/components/MaidsBookingModal';

import '../../features/maids/styles/maids.css';

export default function HomeCookLandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState({});

  useEffect(() => {
    document.title = 'Home Cook in 10 Minutes — Fresh Meals at Home | GateLink';
    window.scrollTo(0, 0);
  }, []);

  const handleOpenBooking = (data = {}) => {
    setModalInitialData(data);
    setIsModalOpen(true);
  };

  return (
    <div className="maids-page">
      {/* Sticky Navigation */}
      <MaidsNavbar onOpenBooking={() => handleOpenBooking({ category: 'Home Cook' })} />

      <main>
        {/* Home Cook Category Hero (Matching Reference Design) */}
        <MaidsCategoryHero
          categoryTitle="Home Cook"
          city="10 Minutes"
          subtitle="Book a trained Home Cook on the GateLink app: fresh meals cooked at your home."
          image="/cook_hero_collage.jpg"
          onOpenBooking={handleOpenBooking}
        />

        {/* One Cook Who Does it All (Bento Grid Showcase) */}
        <CookOneCookScope />

        {/* We Treat Your Kitchen Like Ours (Hygiene Pillars) */}
        <CookKitchenHygiene />

        {/* Why Families Trust GateLink for Home Cook */}
        <CookWhyFamiliesTrust />

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
