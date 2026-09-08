import React, { useState } from 'react';
import { Zap, ShieldCheck, Clock, CheckCircle2, ArrowRight, Sparkles, UserCheck } from 'lucide-react';

export default function MaidsHero({ onOpenBooking, onScrollToServices }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'Daily House Help (Cleaning & Dishes)',
    timeSlot: 'Instant (Next 15-30 Mins)',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.phone || formData.phone.length < 10) return;
    if (onOpenBooking) {
      onOpenBooking(formData);
    }
  };

  return (
    <section className="maids-hero">
      <div className="maids-hero-grid">
        {/* Left Column */}
        <div>
          <div className="maids-badge">
            <Zap size={14} />
            <span>15-Minute Rapid Gate Delivery</span>
          </div>

          <h1 className="maids-hero-title">
            Reliable House Help & Cleaning{' '}
            <span className="maids-hero-highlight">at Your Society Gate</span>
          </h1>

          <p className="maids-hero-subtitle">
            Police-verified, background-checked daily maids, cooks, and cleaning professionals already stationed inside your gated community. Pre-cleared gate passes with zero broker fees.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onOpenBooking && onOpenBooking()}
              className="maids-btn-primary"
              style={{ fontSize: '1rem', padding: '14px 26px' }}
            >
              <Zap size={18} />
              <span>Book Instant Helper</span>
            </button>

            <button
              onClick={onScrollToServices}
              className="maids-btn-secondary"
              style={{ fontSize: '1rem', padding: '14px 26px' }}
            >
              <span>Explore Services & Rates</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Guarantees Row */}
          <div className="maids-guarantee-row">
            <div className="maids-guarantee-item">
              <UserCheck size={18} color="#059669" />
              <span>100% Police Verified</span>
            </div>
            <div className="maids-guarantee-item">
              <Clock size={18} color="#D97706" />
              <span>15-Min Rapid Arrival</span>
            </div>
            <div className="maids-guarantee-item">
              <ShieldCheck size={18} color="#0284C7" />
              <span>30-Min Backup Replacement</span>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Booking Widget */}
        <div>
          <div className="maids-hero-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: '0 0 4px', color: '#1C1917' }}>
                  Quick Service Booking
                </h3>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#78716C' }}>
                  Verified helpers assigned in your society
                </p>
              </div>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  color: '#0369A1',
                  background: '#E0F2FE',
                  padding: '4px 10px',
                  borderRadius: '999px',
                }}
              >
                Zero Brokerage
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#44403C' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shalini Mehta"
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
                  Service Required
                </label>
                <select
                  className="modal-input"
                  style={{ marginBottom: '12px' }}
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                >
                  <option value="Daily House Help (Cleaning & Dishes)">Daily House Help (Cleaning & Dishes)</option>
                  <option value="Home Cook (North / South Indian)">Home Cook (North / South Indian)</option>
                  <option value="Full Apartment Deep Cleaning">Full Apartment Deep Cleaning</option>
                  <option value="Bathroom Sanitization">Bathroom Sanitization</option>
                  <option value="At-Home Salon & Beautician">At-Home Salon & Beautician</option>
                  <option value="Babysitter & Child Care">Babysitter & Child Care</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#44403C' }}>
                  Required Timing
                </label>
                <select
                  className="modal-input"
                  style={{ marginBottom: 0 }}
                  value={formData.timeSlot}
                  onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                >
                  <option value="Instant (Next 15-30 Mins)">⚡ Instant (Next 15-30 Mins)</option>
                  <option value="Today Evening (4 PM - 7 PM)">Today Evening (4 PM - 7 PM)</option>
                  <option value="Tomorrow Morning (7 AM - 10 AM)">Tomorrow Morning (7 AM - 10 AM)</option>
                  <option value="Monthly Recurring Subscription">Monthly Recurring Subscription</option>
                </select>
              </div>

              <button
                type="submit"
                className="maids-btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                <Zap size={18} />
                <span>Reserve Verified Helper</span>
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#A8A29E', marginTop: '12px', marginBottom: 0 }}>
                ⚡ Auto-connected with verified staff in your society.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
