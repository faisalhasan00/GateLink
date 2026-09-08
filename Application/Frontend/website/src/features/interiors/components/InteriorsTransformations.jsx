import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Ananya & Vikram Kulkarni',
    society: 'Godrej Woodsman Estate, Bangalore',
    flat: '3 BHK • 1,450 sq.ft',
    quote: 'GateLink Interiors managed everything from society entry passes to modular kitchen fitting seamlessly. The 45-day handover was spot on with zero noise complaints from our RWA committee!',
    rating: 5,
    package: 'Bespoke Luxury',
  },
  {
    name: 'Rohit Deshmukh',
    society: 'Prestige Lakeside Habitat, Bangalore',
    flat: '2 BHK • 1,120 sq.ft',
    quote: 'The price estimator on the website was extremely accurate. There were zero mid-project price bumps, and the acrylic finish on the wardrobes is top notch.',
    rating: 5,
    package: 'Premium Contemporary',
  },
  {
    name: 'Sneha & Amit Iyer',
    society: 'DLF Westend Heights, Bangalore',
    flat: '3 BHK • 1,600 sq.ft',
    quote: 'The 3D discovery session gave us a virtual look at our exact flat layout before we paid a single rupee. The project manager was always available on WhatsApp.',
    rating: 5,
    package: 'Scandinavian Luxe',
  },
];

export default function InteriorsTransformations() {
  return (
    <section style={{ padding: '80px 24px', background: '#FFFFFF', borderTop: '1px solid #E8E2D9' }}>
      <div className="interiors-section-header">
        <div className="interiors-badge">
          <Star size={14} />
          <span>Real Resident Stories</span>
        </div>
        <h2 className="interiors-section-title">
          Transformed Homes, Delighted Families
        </h2>
        <p className="interiors-section-subtitle">
          Over 1,200+ gated community apartments designed, crafted, and delivered with precision.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        {REVIEWS.map((rev, idx) => (
          <div
            key={idx}
            style={{
              background: '#FAF7F2',
              border: '1px solid #E8E2D9',
              borderRadius: '20px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>

              <p style={{ fontSize: '0.94rem', color: '#44403C', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '20px' }}>
                "{rev.quote}"
              </p>
            </div>

            <div style={{ borderTop: '1px solid #E8E2D9', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontWeight: '800', color: '#1C1917', fontSize: '0.98rem' }}>
                  {rev.name}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#78716C', marginTop: '2px' }}>
                  {rev.society}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#A8A29E' }}>
                  {rev.flat}
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#9A3412',
                  background: '#FFEDD5',
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}
              >
                {rev.package}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
