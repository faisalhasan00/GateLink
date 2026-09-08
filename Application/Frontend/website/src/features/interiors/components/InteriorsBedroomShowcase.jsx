import React from 'react';

export default function InteriorsBedroomShowcase({ onOpenConsultation }) {
  const bedroomDesigns = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=85',
      title: 'A bedroom with a study corner',
      alt: 'Luxury bedroom with integrated study corner and wardrobe in Hyderabad'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
      title: 'A bedroom with multiple space-saving mechanisms',
      alt: 'Smart modern bedroom with multifunctional space saving storage'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=85',
      title: 'A bedroom with a wardrobe and dressing unit',
      alt: 'Master bedroom with custom sliding wardrobe and vanity dressing unit'
    }
  ];

  return (
    <section className="interiors-bedroom-showcase-section">
      <div className="interiors-bedroom-showcase-container">
        {/* Section Header */}
        <div className="interiors-bedroom-header">
          <h2 className="interiors-bedroom-title">
            Bedroom Interiors In Hyderabad For Comfort And Style
          </h2>
        </div>

        {/* 3-Column Bedroom Grid */}
        <div className="interiors-bedroom-grid">
          {bedroomDesigns.map((bedroom) => (
            <div 
              key={bedroom.id} 
              className="interiors-bedroom-card"
              onClick={() => onOpenConsultation && onOpenConsultation({ space: 'Bedroom Interiors', design: bedroom.title })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onOpenConsultation && onOpenConsultation({ space: 'Bedroom Interiors', design: bedroom.title });
                }
              }}
            >
              <div className="interiors-bedroom-image-wrapper">
                <img 
                  src={bedroom.image} 
                  alt={bedroom.alt} 
                  className="interiors-bedroom-image"
                  loading="lazy"
                />
              </div>
              <p className="interiors-bedroom-caption">
                {bedroom.title}
              </p>
            </div>
          ))}
        </div>

        {/* Centered CTA Button Matching Reference */}
        <div className="interiors-bedroom-cta-row">
          <button
            type="button"
            className="interiors-bedroom-btn-teal"
            onClick={() => onOpenConsultation && onOpenConsultation({ space: 'Bedroom Interiors', topic: 'Meet Designer' })}
          >
            <span>Meet Our Designer</span>
          </button>
        </div>
      </div>
    </section>
  );
}
