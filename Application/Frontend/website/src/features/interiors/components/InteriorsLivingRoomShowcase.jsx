import React from 'react';

export default function InteriorsLivingRoomShowcase({ onOpenConsultation }) {
  const livingRoomDesigns = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
      title: 'A living room with a free standing book cabinet',
      alt: 'Luxury Indian living room with wooden book cabinet and lounge swing'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
      title: 'A living room with a floating TV unit',
      alt: 'Contemporary living room with sleek floating TV unit and acoustic wall panelling'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=85',
      title: 'A living room with a pooja unit',
      alt: 'Elegant living room with custom carved wooden pooja unit and accent wall'
    }
  ];

  return (
    <section className="interiors-living-showcase-section">
      <div className="interiors-living-showcase-container">
        {/* Section Header */}
        <div className="interiors-living-header">
          <h2 className="interiors-living-title">
            Living Room Interiors For A Fabulous First Impression
          </h2>
        </div>

        {/* 3-Column Living Room Grid */}
        <div className="interiors-living-grid">
          {livingRoomDesigns.map((design) => (
            <div 
              key={design.id} 
              className="interiors-living-card"
              onClick={() => onOpenConsultation && onOpenConsultation({ space: 'Living Room', design: design.title })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onOpenConsultation && onOpenConsultation({ space: 'Living Room', design: design.title });
                }
              }}
            >
              <div className="interiors-living-image-wrapper">
                <img 
                  src={design.image} 
                  alt={design.alt} 
                  className="interiors-living-image"
                  loading="lazy"
                />
              </div>
              <p className="interiors-living-caption">
                {design.title}
              </p>
            </div>
          ))}
        </div>

        {/* Centered CTA Button Matching Reference */}
        <div className="interiors-living-cta-row">
          <button
            type="button"
            className="interiors-living-btn-teal"
            onClick={() => onOpenConsultation && onOpenConsultation({ space: 'Living Room', topic: 'Book Consultation' })}
          >
            <span>Book A Free Consultation</span>
          </button>
        </div>
      </div>
    </section>
  );
}
