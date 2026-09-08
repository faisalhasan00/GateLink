import React, { useState, useMemo } from 'react';
import { Calculator, Home, Utensils, Box, Sparkles, ArrowRight, Check } from 'lucide-react';

const BHK_OPTIONS = [
  { id: '1bhk', label: '1 BHK', area: '450 - 650 sq.ft', baseMultiplier: 1.0 },
  { id: '2bhk', label: '2 BHK', area: '800 - 1100 sq.ft', baseMultiplier: 1.6 },
  { id: '3bhk', label: '3 BHK', area: '1200 - 1650 sq.ft', baseMultiplier: 2.3 },
  { id: '4bhk', label: '4 BHK / Villa', area: '1800+ sq.ft', baseMultiplier: 3.2 },
];

const SCOPE_OPTIONS = [
  { id: 'full', label: 'Full Home', desc: 'Kitchen + Wardrobes + Living + False Ceiling', factor: 1.0 },
  { id: 'kitchen', label: 'Modular Kitchen', desc: 'Cabinets, Countertop, Chimney, Baskets', factor: 0.42 },
  { id: 'wardrobes', label: 'Wardrobes & Beds', desc: 'Sliding/Hinged wardrobes + Storage beds', factor: 0.38 },
  { id: 'living', label: 'Living & Decor', desc: 'TV unit, Foyer, Wall panels, Lighting', factor: 0.35 },
];

const TIER_OPTIONS = [
  {
    id: 'essential',
    name: 'Essential',
    tag: 'Smart & Functional',
    desc: 'Commercial Ply (IS:303), High-gloss Laminate, Standard Soft-Close',
    pricePerUnit: 240000,
  },
  {
    id: 'premium',
    name: 'Premium',
    tag: 'Most Popular',
    desc: 'Boiling Waterproof Ply (IS:710), Anti-fingerprint Acrylic, Hettich / Hafele Hardware',
    pricePerUnit: 360000,
  },
  {
    id: 'luxury',
    name: 'Bespoke Luxury',
    tag: 'Ultra Premium',
    desc: 'Marine BWP Ply, PU Lacquer & Fluted Panels, Blum Motion Hardware + Smart Lighting',
    pricePerUnit: 520000,
  },
];

export default function InteriorsPriceEstimator({ onOpenConsultation }) {
  const [selectedBhk, setSelectedBhk] = useState('2bhk');
  const [selectedScope, setSelectedScope] = useState('full');
  const [selectedTier, setSelectedTier] = useState('premium');

  const { minPrice, maxPrice, timelineDays } = useMemo(() => {
    const bhkObj = BHK_OPTIONS.find((b) => b.id === selectedBhk) || BHK_OPTIONS[1];
    const scopeObj = SCOPE_OPTIONS.find((s) => s.id === selectedScope) || SCOPE_OPTIONS[0];
    const tierObj = TIER_OPTIONS.find((t) => t.id === selectedTier) || TIER_OPTIONS[1];

    const raw = tierObj.pricePerUnit * bhkObj.baseMultiplier * scopeObj.factor;
    const min = Math.round(raw * 0.95 / 10000) * 10000;
    const max = Math.round(raw * 1.15 / 10000) * 10000;

    let days = 45;
    if (selectedBhk === '3bhk') days = 48;
    if (selectedBhk === '4bhk') days = 55;
    if (selectedScope !== 'full') days = 28;

    return { minPrice: min, maxPrice: max, timelineDays: days };
  }, [selectedBhk, selectedScope, selectedTier]);

  const formatLakhs = (amount) => {
    return `₹${(amount / 100000).toFixed(2)} Lakhs`;
  };

  const handleConsult = () => {
    const bhkLabel = BHK_OPTIONS.find((b) => b.id === selectedBhk)?.label;
    const scopeLabel = SCOPE_OPTIONS.find((s) => s.id === selectedScope)?.label;
    const tierLabel = TIER_OPTIONS.find((t) => t.id === selectedTier)?.name;

    if (onOpenConsultation) {
      onOpenConsultation({
        bhk: bhkLabel,
        scope: scopeLabel,
        tier: tierLabel,
        estimatedBudget: `${formatLakhs(minPrice)} - ${formatLakhs(maxPrice)}`,
      });
    }
  };

  return (
    <section id="estimator" className="interiors-estimator-section">
      <div className="interiors-section-header">
        <div className="interiors-badge">
          <Calculator size={14} />
          <span>Interactive Cost Estimator</span>
        </div>
        <h2 className="interiors-section-title">
          Estimate Your Interior Project Cost in Seconds
        </h2>
        <p className="interiors-section-subtitle">
          Transparent, factory-direct pricing with zero hidden charges. Tailored for apartments and villas.
        </p>
      </div>

      <div className="estimator-card">
        {/* Step 1: BHK */}
        <div>
          <div className="estimator-step-label">Step 1: Select Apartment Layout</div>
          <div className="estimator-options-grid">
            {BHK_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`estimator-option-btn ${selectedBhk === opt.id ? 'active' : ''}`}
                onClick={() => setSelectedBhk(opt.id)}
              >
                <span style={{ fontSize: '1.05rem', fontWeight: '700' }}>{opt.label}</span>
                <span style={{ fontSize: '0.75rem', color: '#78716C' }}>{opt.area}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Scope */}
        <div>
          <div className="estimator-step-label">Step 2: Choose Project Scope</div>
          <div className="estimator-options-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            {SCOPE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`estimator-option-btn ${selectedScope === opt.id ? 'active' : ''}`}
                onClick={() => setSelectedScope(opt.id)}
                style={{ textAlign: 'center', padding: '16px 12px' }}
              >
                <span style={{ fontSize: '0.98rem', fontWeight: '700' }}>{opt.label}</span>
                <span style={{ fontSize: '0.74rem', color: '#78716C', marginTop: '4px' }}>{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Finish & Material Tier */}
        <div>
          <div className="estimator-step-label">Step 3: Select Material & Finish Tier</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            {TIER_OPTIONS.map((tier) => (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                style={{
                  background: '#FFFFFF',
                  border: selectedTier === tier.id ? '2px solid #E25B38' : '1.5px solid #E8E2D9',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedTier === tier.id ? '0 4px 16px rgba(226, 91, 56, 0.12)' : 'none',
                }}
              >
                {selectedTier === tier.id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: '#E25B38',
                      color: '#FFFFFF',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={14} />
                  </div>
                )}
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: tier.id === 'premium' ? '#B45309' : '#64748B',
                    background: tier.id === 'premium' ? '#FEF3C7' : '#F1F5F9',
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                >
                  {tier.tag}
                </span>
                <h4 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '8px 0 6px', color: '#1C1917' }}>
                  {tier.name}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#78716C', margin: 0, lineHeight: 1.4 }}>
                  {tier.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Estimated Output Box */}
        <div className="estimator-result-box">
          <div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              Estimated Investment Range
            </div>
            <div className="estimator-price-val">
              {formatLakhs(minPrice)} – {formatLakhs(maxPrice)}*
            </div>
            <div style={{ fontSize: '0.82rem', color: '#CBD5E1', marginTop: '4px' }}>
              ⚡ Includes 3D Design, Materials, Precision Factory Assembly, & On-Site Installation.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'right', marginRight: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Delivery Timeline</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFFFFF' }}>{timelineDays} Days Guaranteed</div>
            </div>

            <button
              onClick={handleConsult}
              className="interiors-btn-primary"
              style={{ padding: '14px 24px', fontSize: '0.95rem' }}
            >
              <Sparkles size={18} />
              <span>Get Detailed 3D Quote</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
