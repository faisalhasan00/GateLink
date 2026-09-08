import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Gaurav Singhal',
    society: 'Prestige Falcon City, Bangalore',
    service: 'AC Foam Jet Deep Service',
    review: 'Our living room split AC wasn’t cooling properly. The GateLink technician arrived in 20 minutes with a high-pressure foam jet machine. Cooling dropped to 18°C instantly with zero water mess on the wooden floor!',
    rating: 5,
  },
  {
    name: 'Dr. Archana Nair',
    society: 'Sobha Dream Acres, Bangalore',
    service: 'Emergency Plumber (Drain Unclog)',
    review: 'Had a sudden kitchen sink backflow at 8 PM on a Sunday. The plumber was already inside our society cluster, entered via GateLink pass in 12 minutes, and cleared the blockage cleanly.',
    rating: 5,
  },
  {
    name: 'Rajesh Varma',
    society: 'Purva Skywood, Bangalore',
    service: 'Electrician (MCB & Chandelier)',
    review: 'Fixed a persistent MCB tripping issue that two local electricians failed to solve. Standard rate card with zero extra charges for emergency night hours.',
    rating: 5,
  },
];

export default function ServicesTestimonials() {
  return (
    <section style={{ padding: '80px 24px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
      <div className="srv-section-header">
        <div className="services-badge">
          <Star size={14} />
          <span>Resident Feedback</span>
        </div>
        <h2 className="srv-section-title">
          Rated 4.9/5 by 12,000+ Society Residents
        </h2>
        <p className="srv-section-subtitle">
          Real repair experiences from gated community homeowners across Bangalore, Mumbai & NCR.
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
              border: '1px solid #E2E8F0',
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

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
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
                  color: '#BE123C',
                  background: '#FFE4E6',
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
