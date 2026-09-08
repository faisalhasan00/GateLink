import React from 'react';
import { Zap, Wrench, Snowflake, Hammer, Paintbrush, ShieldAlert, ArrowRight, Check } from 'lucide-react';

const TRADES = [
  {
    id: 'electrical',
    icon: Zap,
    title: 'Electrician & Lighting Services',
    desc: 'Switchboards, ceiling fans, MCB fuse tripping, smart lights, and wiring inspections.',
    price: 'Starts ₹99',
    features: ['Standardized rate card', 'Insulated safety tools', '15-min emergency response', 'Genuine branded spare parts'],
  },
  {
    id: 'plumbing',
    icon: Wrench,
    title: 'Plumbing & Sanitary Solutions',
    desc: 'Tap leakages, health faucets, drain unclogging, water purifier & geyser installation.',
    price: 'Starts ₹129',
    features: ['High-pressure drain clearance', 'Zero mess execution', 'Brass valve fittings', '30-day leakage warranty'],
  },
  {
    id: 'ac',
    icon: Snowflake,
    title: 'AC Repair & Deep Foam Jet',
    desc: 'Deep indoor & outdoor unit coil wash, refrigerant gas refilling, and cooling diagnostics.',
    price: 'Starts ₹499',
    features: ['2X deeper foam jet wash', 'Eco-friendly gas refill', 'Jet pump pressure wash', '90-day cooling guarantee'],
  },
  {
    id: 'carpentry',
    icon: Hammer,
    title: 'Carpentry & Door Lock Fitting',
    desc: 'Main door lock changes, hydraulic bed repairs, wardrobe hinge alignment, and custom drillings.',
    price: 'Starts ₹149',
    features: ['Godrej / Yale lock installation', 'Soft-close hinge adjustment', 'Precision laser level', 'Clean dust collection'],
  },
  {
    id: 'painting',
    icon: Paintbrush,
    title: 'Wall Painting & Waterproofing',
    desc: 'Wall seepage repair, ceiling spot touch-ups, balcony waterproofing, and texture accents.',
    price: 'Starts ₹999',
    features: ['Asian Paints Royale / Apex', 'Moisture meter diagnosis', 'Floor furniture masking', 'Zero splash guarantee'],
  },
  {
    id: 'pest',
    icon: ShieldAlert,
    title: 'Pest Control & Termite Shield',
    desc: 'Odorless herbal cockroach gel, bed bug removal, and long-lasting anti-termite barrier.',
    price: 'Starts ₹599',
    features: ['100% odorless & pet-safe', 'Govt approved Bayer chemicals', 'Kitchen cabinet gel dots', '6-month warranty'],
  },
];

export default function ServicesCatalog({ onOpenBooking }) {
  return (
    <section id="services" className="srv-catalog-section">
      <div className="srv-section-header">
        <div className="services-badge">
          <Wrench size={14} />
          <span>Certified Home Maintenance</span>
        </div>
        <h2 className="srv-section-title">
          Explore On-Demand Society Repairs
        </h2>
        <p className="srv-section-subtitle">
          Fixed rates with zero price haggling at your door. Certified technicians arriving in 15-30 minutes.
        </p>
      </div>

      <div className="srv-grid">
        {TRADES.map((trade) => {
          const IconComponent = trade.icon;
          return (
            <div key={trade.id} className="srv-card">
              <div className="srv-icon-box">
                <IconComponent size={26} />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1C1917', margin: '0 0 6px' }}>
                {trade.title}
              </h3>

              <p style={{ fontSize: '0.88rem', color: '#78716C', lineHeight: 1.5, margin: '0 0 12px', flex: 1 }}>
                {trade.desc}
              </p>

              <div className="srv-price-tag">
                {trade.price}
                <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748B', marginTop: '2px' }}>
                  Inspection Fee ₹99 (Waived on service)
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
                {trade.features.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#44403C' }}>
                    <Check size={14} color="#E11D48" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onOpenBooking && onOpenBooking({ service: trade.title })}
                className="services-btn-secondary"
                style={{ width: '100%', padding: '10px 16px', fontSize: '0.9rem' }}
              >
                <span>Book This Trade</span>
                <ArrowRight size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
