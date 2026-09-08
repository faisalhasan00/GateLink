import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Clock, Calculator, ArrowRight, CheckCircle2, Home } from 'lucide-react';

export default function InteriorsHero({ onOpenConsultation, onScrollToEstimator }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    society: '',
    bhk: '2 BHK',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.phone || formData.phone.length < 10) return;
    setSubmitted(true);
    if (onOpenConsultation) {
      onOpenConsultation(formData);
    }
  };

  return (
    <section className="interiors-hero">
      <div className="interiors-hero-grid">
        {/* Left Column: Headline & Value Prop */}
        <div>
          <div className="interiors-badge">
            <Sparkles size={14} />
            <span>GateLink Verified Home Interiors</span>
          </div>

          <h1 className="interiors-hero-title">
            Designer Home Interiors for{' '}
            <span className="interiors-hero-highlight">Gated Communities</span>
          </h1>

          <p className="interiors-hero-subtitle">
            Experience bespoke, stress-free interior transformations. Tailored for society apartments with pre-cleared gate passes, 45-day move-in guarantee, and flat 10-year warranty.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={onScrollToEstimator}
              className="interiors-btn-primary"
              style={{ fontSize: '1rem', padding: '14px 26px' }}
            >
              <Calculator size={18} />
              <span>Calculate Your Cost</span>
            </button>

            <button
              onClick={() => onOpenConsultation && onOpenConsultation()}
              className="interiors-btn-secondary"
              style={{ fontSize: '1rem', padding: '14px 26px' }}
            >
              <span>Book Free 3D Design</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Guarantees Row */}
          <div className="interiors-guarantee-row">
            <div className="interiors-guarantee-item">
              <ShieldCheck size={18} color="#059669" />
              <span>10-Year Warranty</span>
            </div>
            <div className="interiors-guarantee-item">
              <Clock size={18} color="#D97706" />
              <span>45-Day Handover Guarantee</span>
            </div>
            <div className="interiors-guarantee-item">
              <CheckCircle2 size={18} color="#E25B38" />
              <span>146 Quality Checks</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Consultation Card */}
        <div>
          <div className="interiors-hero-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: '0 0 4px', color: '#1C1917' }}>
                  Get Free 3D Design
                </h3>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#78716C' }}>
                  Consult with senior architect + instant budget quote
                </p>
              </div>
              <span className="interiors-badge-gold" style={{ fontSize: '0.78rem' }}>
                100% Free
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#44403C' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  className="modal-input"
                  style={{ marginBottom: '12px' }}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#44403C' }}>
                  Mobile Number (for WhatsApp Estimate)
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#44403C' }}>
                    Apartment Type
                  </label>
                  <select
                    className="modal-input"
                    style={{ marginBottom: 0, padding: '11px 12px' }}
                    value={formData.bhk}
                    onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                  >
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4 BHK / Villa">4 BHK / Villa</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#44403C' }}>
                    Society / City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Prestige Lake"
                    className="modal-input"
                    style={{ marginBottom: 0 }}
                    value={formData.society}
                    onChange={(e) => setFormData({ ...formData, society: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="interiors-btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                <Sparkles size={18} />
                <span>Book Free Design Session</span>
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#A8A29E', marginTop: '12px', marginBottom: 0 }}>
                🔒 Zero spam. We never share your contact details.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
