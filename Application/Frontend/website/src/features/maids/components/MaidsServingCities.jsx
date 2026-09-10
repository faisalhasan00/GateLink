import React from 'react';
import { ChevronRight } from 'lucide-react';

const HYDERABAD_LOCALITIES = [
  {
    id: 'gachibowli',
    name: 'Gachibowli',
    landmark: 'cyber', // tech hub skyline
    societiesCount: '120+ Gated Communities',
  },
  {
    id: 'hitec-city',
    name: 'Hitec City',
    landmark: 'towers', // cyber towers skyline
    societiesCount: '95+ Societies',
  },
  {
    id: 'kondapur',
    name: 'Kondapur',
    landmark: 'charminar', // iconic arches
    societiesCount: '110+ Societies',
  },
  {
    id: 'madhapur',
    name: 'Madhapur',
    landmark: 'fort', // heritage & modern
    societiesCount: '80+ Gated Societies',
  },
  {
    id: 'kokapet',
    name: 'Kokapet',
    landmark: 'luxury', // ultra luxury highrises
    societiesCount: '75+ Luxury Towers',
  },
  {
    id: 'financial-district',
    name: 'Financial District',
    landmark: 'charminar', // charminar & towers
    societiesCount: '85+ Premium Highrises',
  },
  {
    id: 'jubilee-hills',
    name: 'Jubilee Hills',
    landmark: 'villas', // luxury villas & greens
    societiesCount: '60+ Communities',
  },
  {
    id: 'banjara-hills',
    name: 'Banjara Hills',
    landmark: 'heritage', // arches & residences
    societiesCount: '70+ Communities',
  },
  {
    id: 'tellapur',
    name: 'Tellapur & Nallagandla',
    landmark: 'towers', // modern mega townships
    societiesCount: '140+ Gated Townships',
  },
];

/* Custom SVG Skyline / Landmark Illustrations in Royal Purple Line Art */
function LocalitySkylineSvg({ type }) {
  switch (type) {
    case 'charminar':
      return (
        <svg viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="maids-city-svg">
          {/* Charminar Iconic Silhouette & Domes */}
          <path d="M45 78V35M115 78V35M40 78V40M120 78V40" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
          {/* Main Arches */}
          <path d="M55 78V50C55 42 105 42 105 50V78" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
          <path d="M68 78V58C68 53 92 53 92 58V78" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          {/* Upper Gallery & Balconies */}
          <rect x="42" y="32" width="76" height="8" rx="2" stroke="#7C3AED" strokeWidth="1.3" opacity="0.7" />
          <rect x="50" y="24" width="60" height="8" rx="1.5" stroke="#7C3AED" strokeWidth="1.2" opacity="0.65" />
          {/* 4 Minarets */}
          <path d="M42 32V14M46 32V14M114 32V14M118 32V14" stroke="#7C3AED" strokeWidth="1.3" opacity="0.7" />
          <path d="M44 14C44 8 44 8 44 5" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <path d="M116 14C116 8 116 8 116 5" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          {/* Minaret Domes */}
          <ellipse cx="44" cy="14" rx="4" ry="3" stroke="#7C3AED" strokeWidth="1.2" opacity="0.7" />
          <ellipse cx="116" cy="14" rx="4" ry="3" stroke="#7C3AED" strokeWidth="1.2" opacity="0.7" />
          {/* Background Birds & Clouds */}
          <path d="M130 18C132 16 134 16 136 18M136 18C138 16 140 16 142 18" stroke="#7C3AED" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
          <path d="M18 25C20 23 22 23 24 25M24 25C26 23 28 23 30 25" stroke="#7C3AED" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
          {/* Base Ground */}
          <path d="M5 78H155" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        </svg>
      );
    case 'towers':
    case 'cyber':
    default:
      return (
        <svg viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="maids-city-svg">
          {/* Modern Highrises & Cyber Towers */}
          <rect x="25" y="32" width="22" height="46" rx="2" stroke="#7C3AED" strokeWidth="1.3" opacity="0.6" />
          <path d="M30 40H42M30 48H42M30 56H42M30 64H42M30 72H42" stroke="#7C3AED" strokeWidth="1" opacity="0.4" />
          {/* Tall Center Spire Tower */}
          <rect x="52" y="16" width="26" height="62" rx="3" stroke="#7C3AED" strokeWidth="1.4" opacity="0.75" />
          <path d="M65 16V4M58 8L65 4L72 8" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <path d="M58 26H72M58 34H72M58 42H72M58 50H72M58 58H72M58 66H72" stroke="#7C3AED" strokeWidth="1" opacity="0.45" />
          {/* Slanted Facet Highrise */}
          <path d="M84 78V28L106 38V78H84Z" stroke="#7C3AED" strokeWidth="1.3" opacity="0.65" />
          <path d="M90 42H100M90 50H100M90 58H100M90 66H100" stroke="#7C3AED" strokeWidth="1" opacity="0.4" />
          {/* Residential Tower Right */}
          <rect x="112" y="44" width="24" height="34" rx="2" stroke="#7C3AED" strokeWidth="1.2" opacity="0.55" />
          <path d="M117 52H131M117 60H131M117 68H131" stroke="#7C3AED" strokeWidth="0.9" opacity="0.35" />
          {/* Sun / Moon Arc */}
          <path d="M140 22C140 16 135 11 129 11" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 3" opacity="0.4" />
          {/* Birds */}
          <path d="M35 14C37 12 39 12 41 14M41 14C43 12 45 12 47 14" stroke="#7C3AED" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
          {/* Ground */}
          <path d="M5 78H155" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        </svg>
      );
  }
}

export default function MaidsServingCities({ onOpenBooking }) {
  return (
    <section className="maids-cities-section">
      <div className="maids-cities-container">
        {/* Section Headline */}
        <div className="maids-cities-header">
          <h2 className="maids-cities-title">
            Serving Homes <span className="maids-cities-title-highlight">Across Hyderabad</span>
          </h2>
        </div>

        {/* 3x3 Grid of Hyderabad Localities */}
        <div className="maids-cities-grid">
          {HYDERABAD_LOCALITIES.map((loc) => (
            <div
              key={loc.id}
              className="maids-city-card"
              onClick={() => onOpenBooking && onOpenBooking({ societyName: loc.name + ', Hyderabad' })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onOpenBooking && onOpenBooking({ societyName: loc.name + ', Hyderabad' });
                }
              }}
            >
              {/* Left Content: Name + Arrow */}
              <div className="maids-city-card-info">
                <span className="maids-city-name">{loc.name}</span>
                <ChevronRight size={18} className="maids-city-arrow" />
              </div>

              {/* Right Silhouette Illustration */}
              <div className="maids-city-card-art">
                <LocalitySkylineSvg type={loc.landmark} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
