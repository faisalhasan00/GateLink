import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Pooja Agarwal',
    society: 'Brigade Gateway, Bangalore',
    service: 'Daily House Help & Utensils',
    review: 'Our previous maid would take sudden leaves without informing. With GateLink Maids, when our helper was unwell, a replacement arrived within 25 minutes! Best feature ever.',
    rating: 5,
  },
  {
    name: 'Karthik Ramanathan',
    society: 'Sobha City, Bangalore',
    service: 'North Indian Cook (Breakfast & Dinner)',
    review: 'Healthy, homestyle rotis and dal. The cook is polite, wears a hairnet, and clean up the kitchen platform completely before leaving. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Meera Sen',
    society: 'Prestige Shantiniketan, Bangalore',
    service: 'Deep Bathroom & Kitchen Clean',
    review: 'Removed 2-year-old hard water stains from our glass shower partition in 45 minutes flat. Acid-free chemicals with zero fumes.',
    rating: 5,
  },
];

export default function MaidsTestimonials() {
  return (
    <section style={{ padding: '80px 24px', background: '#FFFFFF', borderTop: '1px solid #E7E5E4' }}>
      <div className="maids-section-header">
        <div className="maids-badge">
          <Star size={14} />
          <span>Resident Experiences</span>
        </div>
        <h2 className="maids-section-title">
          Trusted by 5,000+ Society Families
        </h2>
        <p className="maids-section-subtitle">
          Real feedback from apartment residents who rely on GateLink verified staff every day.
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
              background: '#FAFAF9',
              border: '1px solid #E7E5E4',
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
                "{rev.review}"
              </p>
            </div>

            <div style={{ borderTop: '1px solid #E7E5E4', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontWeight: '800', color: '#1C1917', fontSize: '0.98rem' }}>
                  {rev.name}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#78716C', marginTop: '2px' }}>
                  {rev.society}
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#6D28D9',
                  background: '#F3E8FF',
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}
              >
                {rev.service}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
