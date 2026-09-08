import React from 'react';

export default function InteriorsModularKitchenShowcase({ onOpenConsultation }) {
  const kitchenDesigns = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85',
      title: 'A straight kitchen with handle less cabinets',
      alt: 'Straight modular kitchen with handle-less cabinets in Hyderabad'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      title: 'A straight kitchen with a breakfast counter',
      alt: 'Modern straight modular kitchen with island breakfast counter'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85',
      title: 'An L-shaped kitchen with bottom and top storage',
      alt: 'L-shaped modular kitchen with dual tone upper and lower cabinetry'
    }
  ];

  return (
    <section className="interiors-kitchen-showcase-section">
      <div className="interiors-kitchen-showcase-container">
        {/* Section Header */}
        <div className="interiors-kitchen-header">
          <p className="interiors-kitchen-overline">
            Interior Designs In Hyderabad For Every Budget And Lifestyle
          </p>
          <h2 className="interiors-kitchen-title">
            Smart Modular Kitchen Designs For Hyderabad Homes
          </h2>
        </div>

        {/* 3-Column Kitchen Grid */}
        <div className="interiors-kitchen-grid">
          {kitchenDesigns.map((kitchen) => (
            <div 
              key={kitchen.id} 
              className="interiors-kitchen-card"
              onClick={() => onOpenConsultation && onOpenConsultation({ space: 'Modular Kitchen', design: kitchen.title })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onOpenConsultation && onOpenConsultation({ space: 'Modular Kitchen', design: kitchen.title });
                }
              }}
            >
              <div className="interiors-kitchen-image-wrapper">
                <img 
                  src={kitchen.image} 
                  alt={kitchen.alt} 
                  className="interiors-kitchen-image"
                  loading="lazy"
                />
              </div>
              <p className="interiors-kitchen-caption">
                {kitchen.title}
              </p>
            </div>
          ))}
        </div>

        {/* Centered CTA Button Matching Reference */}
        <div className="interiors-kitchen-cta-row">
          <button
            type="button"
            className="interiors-kitchen-btn-teal"
            onClick={() => onOpenConsultation && onOpenConsultation({ space: 'Modular Kitchen', topic: 'Meet Kitchen Experts' })}
          >
            <span>Meet Our Kitchen Experts</span>
          </button>
        </div>
      </div>
    </section>
  );
}
