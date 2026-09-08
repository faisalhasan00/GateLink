import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function InteriorsCityBanner({ onOpenConsultation }) {
  return (
    <section className="interiors-city-banner-section">
      <div className="interiors-city-banner-overlay" />
      
      <div className="interiors-city-banner-container">
        <div className="interiors-city-banner-card">
          <h2 className="interiors-city-banner-title">
            Best Interior Designers In Hyderabad
          </h2>
          
          <p className="interiors-city-banner-subtitle">
            Dream Homes At Dream Budgets & 15,000 Happy Customers
          </p>

          <button
            type="button"
            className="interiors-city-banner-btn"
            onClick={() => onOpenConsultation && onOpenConsultation({ city: 'Hyderabad' })}
          >
            <span>Book Free Consultation</span>
          </button>
        </div>
      </div>
    </section>
  );
}
