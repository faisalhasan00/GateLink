import React from 'react';
import { Star, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function BazaarTestimonials() {
  const testimonials = [
    {
      name: 'Dr. Meera Iyer',
      role: 'Owner, Tower 4 - Flat 1102',
      society: 'Sobha Dream Acres, Bengaluru',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      rating: 5,
      text: 'Sold my baby’s cot and stroller in less than 40 minutes on GateLink Bazaar! The buyer was a sweet family from Tower 2 who came over, verified it, and transferred UPI on the spot. Zero courier hassle and zero scammers.'
    },
    {
      name: 'Kunal Malhotra',
      role: 'Resident, Tower B - 703',
      society: 'Godrej Woodsman Estate',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      rating: 5,
      text: 'I was relocating to Hyderabad and had to sell a 55-inch smart TV and a solid oak dining table. Posted on GateLink Bazaar in the morning, by evening both items were picked up by neighbors in the next tower. Best feature ever!'
    },
    {
      name: 'Shalini Nambiar',
      role: 'Home Baker & Resident, Tower C - 401',
      society: 'Prestige Lakeside Habitat',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
      rating: 5,
      text: 'GateLink Bazaar helped me launch my weekend home bakery! I get 20+ sourdough bread and brownie orders from fellow society residents every Friday with doorstep handover. Zero commission cuts compared to food delivery apps.'
    }
  ];

  return (
    <section className="bazaar-testimonials-section">
      <div className="bazaar-section-header">
        <div className="bazaar-section-badge">
          <Star size={14} style={{ color: '#f59e0b' }} />
          <span>Resident Stories</span>
        </div>
        <h2 className="bazaar-section-title">
          Loved by 40,000+ Gated Society Residents
        </h2>
        <p className="bazaar-section-subtitle">
          See how neighbors are trading, decluttering, and running micro-businesses safely inside their communities.
        </p>
      </div>

      <div className="bazaar-testimonials-grid">
        {testimonials.map((t, idx) => (
          <div key={idx} className="bazaar-testimonial-card">
            <div className="bazaar-test-stars">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} size={16} fill="#f59e0b" />
              ))}
            </div>

            <p className="bazaar-test-text">
              "{t.text}"
            </p>

            <div className="bazaar-test-author">
              <img src={t.avatar} alt={t.name} className="bazaar-test-avatar" />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                  <span>{t.name}</span>
                  <CheckCircle2 size={14} style={{ color: '#059669' }} />
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {t.role}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669' }}>
                  {t.society}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
