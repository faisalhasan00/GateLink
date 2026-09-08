import React from 'react';

export default function InteriorsSolutionsCatalog({ onOpenConsultation, onScrollToEstimator }) {
  const solutions = [
    {
      id: 1,
      title: 'Living/Dining Room',
      desc: 'TV Unit, TV Back Panelling, Crockery Unit, Bar Unit, Bookshelf',
      icon: (
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="10" width="40" height="44" rx="2" stroke="#334155" strokeWidth="2.5" />
          <line x1="12" y1="22" x2="52" y2="22" stroke="#334155" strokeWidth="2" />
          <line x1="12" y1="36" x2="52" y2="36" stroke="#334155" strokeWidth="2" />
          <line x1="32" y1="10" x2="32" y2="22" stroke="#334155" strokeWidth="2" />
          {/* TV Screen in Center */}
          <rect x="18" y="25" width="28" height="18" rx="1" stroke="#334155" strokeWidth="2" fill="#FFFFFF" />
          {/* Teal Base Storage */}
          <rect x="14" y="44" width="36" height="8" rx="1" fill="#1392a6" stroke="#334155" strokeWidth="2" />
          <circle cx="24" cy="48" r="1" fill="#FFFFFF" />
          <circle cx="40" cy="48" r="1" fill="#FFFFFF" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Bedroom',
      desc: 'Wardrobes, TV Unit, Bed with Storage, Dressing Unit, Study Unit',
      icon: (
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Headboard Wall Shelf */}
          <line x1="10" y1="18" x2="54" y2="18" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="16" y="12" width="8" height="6" stroke="#334155" strokeWidth="1.5" />
          <rect x="40" y="8" width="8" height="10" stroke="#334155" strokeWidth="1.5" />
          {/* Bed Base */}
          <rect x="12" y="32" width="40" height="16" rx="2" stroke="#334155" strokeWidth="2.5" fill="#FFFFFF" />
          {/* Teal Pillows */}
          <rect x="16" y="24" width="14" height="8" rx="2" fill="#1392a6" stroke="#334155" strokeWidth="2" />
          <rect x="34" y="24" width="14" height="8" rx="2" fill="#1392a6" stroke="#334155" strokeWidth="2" />
          {/* Folded Blanket Line */}
          <path d="M12 40h40" stroke="#334155" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Kitchen',
      desc: 'Countertops, Backsplashes, Accessories, Shutters, Storage',
      icon: (
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Chimney Hood */}
          <path d="M26 10h12v4l6 8H20l6-8V10z" stroke="#334155" strokeWidth="2" fill="#1392a6" />
          {/* Hob and Countertop */}
          <rect x="10" y="24" width="44" height="26" rx="2" stroke="#334155" strokeWidth="2.5" fill="#FFFFFF" />
          {/* Burner Knobs */}
          <circle cx="18" cy="28" r="1.5" fill="#334155" />
          <circle cx="26" cy="28" r="1.5" fill="#334155" />
          <circle cx="38" cy="28" r="1.5" fill="#334155" />
          <circle cx="46" cy="28" r="1.5" fill="#334155" />
          {/* Oven Glass Door with Accent Lines */}
          <rect x="16" y="32" width="32" height="14" rx="1" stroke="#334155" strokeWidth="2" fill="#F8FAFC" />
          <line x1="24" y1="36" x2="24" y2="42" stroke="#1392a6" strokeWidth="2" />
          <line x1="40" y1="36" x2="40" y2="42" stroke="#1392a6" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: 4,
      title: 'Innovative Storage',
      desc: 'Janitor Unit, Skirting Drawer, Pantry Pull Out, Appliance Garage, Hidden Bar Cabinet, Magic Corner',
      icon: (
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Books on top */}
          <rect x="30" y="12" width="16" height="4" rx="1" stroke="#334155" strokeWidth="1.5" />
          <rect x="28" y="16" width="20" height="4" rx="1" stroke="#334155" strokeWidth="1.5" />
          {/* Chest of Drawers */}
          <rect x="14" y="22" width="36" height="28" rx="2" stroke="#334155" strokeWidth="2.5" fill="#1392a6" />
          <line x1="14" y1="36" x2="50" y2="36" stroke="#334155" strokeWidth="2" />
          {/* Handles */}
          <line x1="26" y1="29" x2="38" y2="29" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="26" y1="43" x2="38" y2="43" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          {/* Legs */}
          <line x1="18" y1="50" x2="18" y2="54" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          <line x1="46" y1="50" x2="46" y2="54" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 5,
      title: 'Interior Design Services',
      desc: 'False Ceiling, Wall Panelling, Decor Accents, Lighting, Furnishing, Appliances',
      icon: (
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Floor Lamp */}
          <path d="M12 14l4 10H8l4-10z" stroke="#334155" strokeWidth="2" fill="#FFFFFF" />
          <line x1="12" y1="24" x2="12" y2="52" stroke="#334155" strokeWidth="2" />
          <line x1="8" y1="52" x2="16" y2="52" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          {/* Armchair */}
          <rect x="22" y="28" width="32" height="24" rx="3" stroke="#334155" strokeWidth="2.5" fill="#FFFFFF" />
          {/* Teal Cushion */}
          <rect x="28" y="32" width="20" height="12" rx="2" fill="#1392a6" stroke="#334155" strokeWidth="1.5" />
          {/* Armrests */}
          <rect x="20" y="36" width="6" height="14" rx="2" stroke="#334155" strokeWidth="2" fill="#F8FAFC" />
          <rect x="50" y="36" width="6" height="14" rx="2" stroke="#334155" strokeWidth="2" fill="#F8FAFC" />
        </svg>
      )
    },
    {
      id: 6,
      title: 'Home Improvement Services',
      desc: 'Painting, Bathroom Remodelling, Tiling, Plumbing, Electrical, Civil Work, Deep Cleaning',
      icon: (
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shower Head */}
          <path d="M14 18h10v6" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          <path d="M20 24l-3 6h10l-3-6z" fill="#334155" />
          {/* Bathtub */}
          <path d="M10 34h44v8a10 10 0 0 1-10 10H20a10 10 0 0 1-10-10v-8z" stroke="#334155" strokeWidth="2.5" fill="#1392a6" />
          <line x1="8" y1="34" x2="56" y2="34" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
          {/* Tub Feet */}
          <line x1="16" y1="52" x2="14" y2="56" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          <line x1="48" y1="52" x2="50" y2="56" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          {/* Mirror Cabinet Top Right */}
          <rect x="42" y="14" width="12" height="14" rx="1" stroke="#334155" strokeWidth="2" fill="#FFFFFF" />
        </svg>
      )
    }
  ];

  return (
    <section className="interiors-catalog-section">
      <div className="interiors-catalog-container">
        {/* Section Header */}
        <div className="interiors-catalog-header">
          <h2 className="interiors-catalog-title">
            Our Interior Design Solutions In Hyderabad Cover All Your Needs
          </h2>
        </div>

        {/* 6 Solutions Grid */}
        <div className="interiors-catalog-grid">
          {solutions.map((item) => (
            <div 
              key={item.id} 
              className="interiors-catalog-card"
              onClick={() => onOpenConsultation && onOpenConsultation({ space: item.title })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onOpenConsultation && onOpenConsultation({ space: item.title });
                }
              }}
            >
              <div className="interiors-catalog-icon-box">
                {item.icon}
              </div>
              <div className="interiors-catalog-info">
                <h3 className="interiors-catalog-item-title">{item.title}</h3>
                <p className="interiors-catalog-item-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Centered CTA Button Matching Reference */}
        <div className="interiors-catalog-cta-row">
          <button
            type="button"
            className="interiors-catalog-btn-teal"
            onClick={onScrollToEstimator || (() => onOpenConsultation && onOpenConsultation({ topic: 'Get Free Estimates' }))}
          >
            <span>Get Free Estimates</span>
          </button>
        </div>

        {/* Sub-heading Title Below Button */}
        <div className="interiors-catalog-subfooter">
          <h3 className="interiors-catalog-subfooter-title">
            Explore 51040 Interior Design Possibilities At Our Hyderabad Stores
          </h3>
        </div>
      </div>
    </section>
  );
}
