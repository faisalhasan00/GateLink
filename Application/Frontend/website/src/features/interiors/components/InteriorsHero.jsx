import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle,
  Calculator
} from 'lucide-react';

export default function InteriorsHero({ onOpenConsultation, onScrollToEstimator }) {
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85',
      tag: 'Heritage Luxury Dining & Lounge'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2000&q=85',
      tag: 'Contemporary Living & Foyer'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2000&q=85',
      tag: 'Master Suite & Study Lounge'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2000&q=85',
      tag: 'Modular Quartz Island Kitchen'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Auto-scroll slideshow timer (5 seconds per slide)
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, slides.length]);

  return (
    <section 
      className="interiors-cinematic-hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Carousel with Smooth Crossfade */}
      <div className="interiors-hero-slider-track">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`interiors-hero-slide ${idx === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${slide.image})`
            }}
          />
        ))}
      </div>

      {/* Cinematic Gradient Overlays */}
      <div className="interiors-hero-overlay-dark" />
      <div className="interiors-hero-overlay-bottom" />

      {/* Hero Content Layer (Matching Exact Reference Layout) */}
      <div className="interiors-hero-content-container">
        <div className="interiors-hero-text-block interiors-hero-centered-layout">

          {/* Main Headline (Exact Match with Reference Image) */}
          <h1 className="interiors-cinematic-title">
            Best Interior Designers In Hyderabad
          </h1>

          {/* Subtitle (Exact Match with Reference Image) */}
          <p className="interiors-cinematic-subtitle">
            Dream Homes At Dream Budgets & 15,000 Happy Customers
          </p>

          {/* Action CTA Group (2 Buttons: Primary Consultation + Instant Cost Calculator) */}
          <div className="interiors-hero-actions-row">
            <button
              type="button"
              className="interiors-hero-btn-teal"
              onClick={() => onOpenConsultation && onOpenConsultation({ city: 'Hyderabad' })}
            >
              <span>Book Free Consultation</span>
            </button>

            <button
              type="button"
              className="interiors-hero-btn-cost"
              onClick={onScrollToEstimator}
            >
              <Calculator size={19} />
              <span>Instant Cost Calculator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href="https://wa.me/919121863117?text=Hi%20GateLink%20Interiors,%20I%20want%20to%20book%20a%20free%20interior%20consultation%20in%20Hyderabad"
        target="_blank"
        rel="noopener noreferrer"
        className="interiors-floating-whatsapp"
        aria-label="Chat with Senior Architect on WhatsApp"
      >
        <div className="interiors-whatsapp-bubble">
          <span>Talk to Architect</span>
        </div>
        <div className="interiors-whatsapp-icon-wrapper">
          <MessageCircle size={28} />
        </div>
      </a>
    </section>
  );
}
