import React from 'react';

export default function InteriorsTrustStrip() {
  const trustItems = [
    {
      id: 1,
      title: '20% Extra Storage',
      desc: 'Smart Modular Space Optimization',
      icon: (
        <svg width="28" height="28" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 4L6 18v24a2 2 0 0 0 2 2h32a2 2 0 0 0 2-2V18L24 4z" />
          <rect x="18" y="19" width="12" height="9" rx="1" />
          <line x1="24" y1="19" x2="24" y2="28" />
          <rect x="12" y="28" width="12" height="11" rx="1" />
          <line x1="18" y1="28" x2="18" y2="39" />
          <rect x="24" y="28" width="12" height="11" rx="1" />
          <line x1="30" y1="28" x2="30" y2="39" />
        </svg>
      )
    },
    {
      id: 2,
      title: '10-Year Warranty',
      desc: 'Flat Replacement Guarantee on Hardware',
      icon: (
        <svg width="28" height="28" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 6s14-3 16 9c0 15-16 23-16 23S8 30 8 15c2-12 16-9 16-9z" />
          <polyline points="18 24 22 28 30 18" strokeWidth="2.4" />
          <path d="M38 8l1.5 3.5L43 13l-3.5 1.5L38 18l-1.5-3.5L33 13l3.5-1.5z" fill="currentColor" stroke="none" />
          <path d="M7 32l1 2.5L10.5 35.5 8 36.5 7 39l-1-2.5L3.5 35.5 6 34.5z" fill="currentColor" stroke="none" />
        </svg>
      )
    },
    {
      id: 3,
      title: '45-Day Move-In',
      desc: 'Guaranteed Handover or Rent on Us',
      icon: (
        <svg width="28" height="28" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="24" cy="26" r="16" />
          <polyline points="24 16 24 26 31 26" />
          <line x1="24" y1="4" x2="24" y2="8" />
          <line x1="18" y1="6" x2="30" y2="6" />
          <path d="M36 12l2.5-2.5" />
          <path d="M12 12l-2.5-2.5" />
        </svg>
      )
    },
    {
      id: 4,
      title: 'Pre-Cleared Gate Passes',
      desc: 'Seamless Entry for Verified Craftsmen',
      icon: (
        <svg width="28" height="28" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 42V14a6 6 0 0 1 6-6h20a6 6 0 0 1 6 6v28" />
          <path d="M16 42V20a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v22" />
          <line x1="4" y1="42" x2="44" y2="42" strokeWidth="2.4" />
          <circle cx="24" cy="11" r="2" fill="currentColor" stroke="none" />
        </svg>
      )
    },
    {
      id: 5,
      title: '146 Quality Checks',
      desc: 'Factory Precision Engineered Finish',
      icon: (
        <svg width="28" height="28" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="24" cy="20" r="12" />
          <polyline points="19 20 22.5 23.5 29 16" strokeWidth="2.4" />
          <path d="M18 31l-3 11 9-4 9 4-3-11" />
        </svg>
      )
    }
  ];

  return (
    <section className="interiors-trust-strip-section">
      <div className="interiors-trust-strip-container">
        {trustItems.map((item) => (
          <div key={item.id} className="interiors-trust-strip-item">
            {/* Elevated White Circular Icon Badge */}
            <div className="interiors-trust-circle-badge">
              <div className="interiors-trust-circle-icon">
                {item.icon}
              </div>
            </div>

            {/* Title Label */}
            <h3 className="interiors-trust-item-title">
              {item.title}
            </h3>

            {/* Subtle Subtext */}
            <p className="interiors-trust-item-desc">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
