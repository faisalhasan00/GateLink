import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function InteriorsSpaceSavingShowcase({ onOpenConsultation }) {
  const spaceSavingDesigns = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=1200&q=85',
      title: 'A wardrobe with separate his and her section',
      alt: 'Floor-to-ceiling wardrobe with separate his and her sections in Hyderabad'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=85',
      title: 'A vibrant kitchen with pantry pullout',
      alt: 'Vibrant modular kitchen with tall pantry pullout organizer unit'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
      title: 'A TV unit with a mandir',
      alt: 'Multifunctional living room TV entertainment unit with integrated mandir'
    }
  ];

  return (
    <section className="interiors-spacesaving-showcase-section">
      <div className="interiors-spacesaving-showcase-container">
        {/* Section Header */}
        <div className="interiors-spacesaving-header">
          <h2 className="interiors-spacesaving-title">
            Space-Saving Designs In Hyderabad With 20% Extra Storage
          </h2>
        </div>

        {/* Carousel / Grid Wrapper with Side Nav Chevrons */}
        <div className="interiors-spacesaving-carousel-wrapper">
          <button
            type="button"
            className="interiors-spacesaving-nav-btn prev"
            aria-label="Previous space saving designs"
          >
            <ChevronLeft size={24} />
          </button>

          {/* 3-Column Card Grid */}
          <div className="interiors-spacesaving-grid">
            {spaceSavingDesigns.map((design) => (
              <div 
                key={design.id} 
                className="interiors-spacesaving-card"
                onClick={() => onOpenConsultation && onOpenConsultation({ space: 'Space-Saving Interiors', design: design.title })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onOpenConsultation && onOpenConsultation({ space: 'Space-Saving Interiors', design: design.title });
                  }
                }}
              >
                <div className="interiors-spacesaving-image-wrapper">
                  <img 
                    src={design.image} 
                    alt={design.alt} 
                    className="interiors-spacesaving-image"
                    loading="lazy"
                  />
                </div>
                <p className="interiors-spacesaving-caption">
                  {design.title}
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="interiors-spacesaving-nav-btn next"
            aria-label="Next space saving designs"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Centered CTA Button Matching Reference */}
        <div className="interiors-spacesaving-cta-row">
          <button
            type="button"
            className="interiors-spacesaving-btn-teal"
            onClick={() => onOpenConsultation && onOpenConsultation({ space: 'Space-Saving Interiors', topic: 'Talk to Space Saving Experts' })}
          >
            <span>Talk To Our Space Saving Experts Today!</span>
          </button>
        </div>
      </div>
    </section>
  );
}
