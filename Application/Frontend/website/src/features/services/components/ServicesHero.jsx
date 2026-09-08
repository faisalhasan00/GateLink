import React, { useState } from 'react';
import { Wrench, ShieldCheck, Clock, CheckCircle2, ArrowRight, Zap, BadgeCheck } from 'lucide-react';

export default function ServicesHero({ onOpenBooking, onScrollToCatalog }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'Electrician (Fan / Switchboard / Wiring)',
    timing: 'Emergency (Next 15-30 Mins)',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.phone || formData.phone.length < 10) return;
    if (onOpenBooking) {
      onOpenBooking(formData);
    }
  };

  return (
    <section className="services-hero">
      <div className="services-hero-grid">
        {/* Left Column */}
        <div>
          <div className="services-badge">
            <Zap size={14} />
            <span>15-Minute Rapid Doorstep Assistance</span>
          </div>

          <h1 className="services-hero-title">
            Certified Electricians & Plumbers{' '}
            <span className="services-hero-highlight">at Your Society Gate</span>
          </h1>

          <p className="services-hero-subtitle">
            Skip the hassle of calling unverified local repairmen. Get background-verified technicians with standardized rate cards, pre-approved gate passes, and a 30-day rework warranty.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onOpenBooking && onOpenBooking()}
              className="services-btn-primary"
              style={{ fontSize: '1rem', padding: '14px 26px' }}
            >
              <Wrench size={18} />
              <span>Book Expert Technician</span>
            </button>

            <button
              onClick={onScrollToCatalog}
              className="services-btn-secondary"
              style={{ fontSize: '1rem', padding: '14px 26px' }}
            >
              <span>View Transparent Rates</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Guarantees Row */}
          <div className="services-guarantee-row">
            <div className="services-guarantee-item">
              <Clock size={18} color="#E11D48" />
              <span>15-Min Rapid Arrival</span>
            </div>
            <div className="services-guarantee-item">
              <ShieldCheck size={18} color="#059669" />
              <span>30-Day Rework Warranty</span>
            </div>
            <div className="services-guarantee-item">
              <BadgeCheck size={18} color="#0284C7" />
              <span>Standardized Rate Card</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Quick Booking Card */}
        <div>
          <div className="services-hero-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: '0 0 4px', color: '#1C1917' }}>
                  Emergency Technician
                </h3>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#78716C' }}>
                  Stationed inside or near your gated complex
                </p>
              </div>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  color: '#BE123C',
                  background: '#FFE4E6',
                  padding: '4px 10px',
                  borderRadius: '999px',
                }}
              >
                Inspection ₹99
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#44403C' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Anand Kumar"
                  className="modal-input"
                  style={{ marginBottom: '12px' }}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#44403C' }}>
                  WhatsApp Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  className="modal-input"
                  style={{ marginBottom: '12px' }}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#44403C' }}>
                  Select Service Trade
                </label>
                <select
                  className="modal-input"
                  style={{ marginBottom: '12px' }}
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                >
                  <option value="Electrician (Fan / Switchboard / Wiring)">⚡ Electrician (Fan / Switchboard / Wiring)</option>
                  <option value="Plumber (Leakage / Jet Spray / Tap)">🚰 Plumber (Leakage / Jet Spray / Tap)</option>
                  <option value="AC Repair & Gas Refill / Service">❄️ AC Repair & Foam Jet Service</option>
                  <option value="Carpenter (Lock / Hinge / Furniture)">🪚 Carpenter (Lock / Hinge / Furniture)</option>
                  <option value="Wall Painting & Waterproofing">🎨 Wall Painting & Waterproofing</option>
                  <option value="Pest Control & Anti-Termite">🛡️ Pest Control & Termite Shield</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#44403C' }}>
                  Preferred Arrival Time
                </label>
                <select
                  className="modal-input"
                  style={{ marginBottom: 0 }}
                  value={formData.timing}
                  onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                >
                  <option value="Emergency (Next 15-30 Mins)">⚡ Emergency (Next 15-30 Mins)</option>
                  <option value="Today Evening (4 PM - 7 PM)">Today Evening (4 PM - 7 PM)</option>
                  <option value="Tomorrow Morning (9 AM - 12 PM)">Tomorrow Morning (9 AM - 12 PM)</option>
                  <option value="Weekend Slot">Weekend Slot</option>
                </select>
              </div>

              <button
                type="submit"
                className="services-btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                <Wrench size={18} />
                <span>Confirm Technician Request</span>
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#A8A29E', marginTop: '12px', marginBottom: 0 }}>
                ⚡ Inspection fee ₹99 adjusted against final repair cost.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
