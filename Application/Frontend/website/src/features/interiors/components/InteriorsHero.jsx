import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  MessageCircle,
  ArrowRight
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
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2000&q=85',
      tag: 'Master Suite & Study Lounge'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
      tag: 'Contemporary Living & Foyer'
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

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const current = slides[currentSlide];

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

      {/* Hero Content Layer (Matching Exact Reference Layout with Centered Translucent Card) */}
      <div className="interiors-hero-content-container">
        <div className="interiors-hero-card">
          {/* Main Headline */}
          <h1 className="interiors-cinematic-title">
            Best Interior Designers In Hyderabad
          </h1>

          {/* Subtitle */}
          <p className="interiors-cinematic-subtitle">
            Dream Homes At Dream Budgets & 15,000 Happy Customers
          </p>

          {/* Action CTA Button */}
          <div className="interiors-hero-actions-row">
            <button
              type="button"
              className="interiors-hero-btn-teal"
              onClick={() => onOpenConsultation && onOpenConsultation({ city: 'Hyderabad' })}
            >
              <span>Book Free Consultation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Controls & Indicators (Bottom Right) */}
      <div className="interiors-hero-controls-bar">
        {/* Slide Counter & Tag */}
        <div className="interiors-slide-info-tag">
          <span className="interiors-slide-tag-text">{current.tag}</span>
        </div>

        {/* Dots Navigation */}
        <div className="interiors-slider-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`interiors-slider-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Prev / Next Arrows */}
        <div className="interiors-slider-arrow-group">
          <button
            type="button"
            className="interiors-arrow-btn"
            onClick={handlePrev}
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className="interiors-arrow-btn"
            onClick={handleNext}
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
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
