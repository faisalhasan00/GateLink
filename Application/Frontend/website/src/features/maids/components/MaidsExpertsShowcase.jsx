import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function MaidsExpertsShowcase({ onOpenBooking }) {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'house-help',
      title: 'House Help',
      path: '/maids/house-help',
      image: '/maids_house_help_card.jpg',
      badge: null,
      locations: ['Hyderabad', 'Gachibowli', 'Hitec City', '& more']
    },
    {
      id: 'home-cook',
      title: 'Home Cook',
      path: '/maids/home-cook',
      image: '/maids_home_cook_card.jpg',
      badge: null,
      locations: ['Hyderabad']
    },
    {
      id: 'home-salon',
      title: 'Home Salon',
      path: null,
      image: '/maids_home_salon_card.jpg',
      badge: 'Coming Soon',
      locations: ['Hyderabad']
    }
  ];

  const handleCardClick = (cat) => {
    if (cat.path) {
      navigate(cat.path);
      window.scrollTo(0, 0);
    } else if (onOpenBooking) {
      onOpenBooking({ category: cat.title });
    }
  };

  return (
    <section id="experts" className="maids-experts-section">
      <div className="maids-experts-container">
        {/* Section Headline (Matching Reference) */}
        <div className="maids-experts-header">
          <h2 className="maids-experts-title">
            Trained &amp; Verified <span className="maids-experts-title-purple">Home Experts</span>
          </h2>
        </div>

        {/* 3 Categories Cards Grid */}
        <div className="maids-experts-grid">
          {categories.map((cat) => (
            <div 
              key={cat.id}
              className="maids-expert-card"
              onClick={() => handleCardClick(cat)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleCardClick(cat);
                }
              }}
            >
              {/* Background Photography */}
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="maids-expert-img" 
              />

              {/* Gradient Overlays for readability */}
              <div className="maids-expert-top-overlay" />
              <div className="maids-expert-bottom-overlay" />

              {/* Card Top Header */}
              <div className="maids-expert-card-top">
                <h3 className="maids-expert-name">{cat.title}</h3>
                {cat.badge ? (
                  <span className="maids-expert-coming-soon-badge">{cat.badge}</span>
                ) : (
                  <div className="maids-expert-arrow-circle">
                    <ChevronRight size={18} color="#ffffff" />
                  </div>
                )}
              </div>

              {/* Card Bottom: Available in Pills (Hyderabad Focus) */}
              <div className="maids-expert-card-bottom">
                <span className="maids-expert-available-label">Available in</span>
                <div className="maids-expert-pills-row">
                  {cat.locations.map((loc, idx) => (
                    <span 
                      key={idx} 
                      className={`maids-expert-loc-pill ${loc === '& more' ? 'more' : ''}`}
                    >
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
