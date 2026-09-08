import React from 'react';
import { ShieldCheck, Clock, CheckCircle2, ShieldAlert, Award, FileCheck2, Sparkles, Building2 } from 'lucide-react';

const ADVANTAGES = [
  {
    icon: Building2,
    title: 'Pre-Approved Gate Clearances',
    desc: 'Trucks, carpenters, and raw materials enter without guard hassles. Everything is pre-verified via GateLink security.',
  },
  {
    icon: ShieldAlert,
    title: 'Zero Society Noise Violations',
    desc: 'Work is strictly scheduled within society-permitted hours (10 AM – 5 PM). 90% of cutting and drilling is done in our off-site factory.',
  },
  {
    icon: Clock,
    title: '45-Day Move-in Guarantee',
    desc: 'We guarantee on-time handover. In the rare event of a delay, you receive ₹1,000/day compensation directly into your account.',
  },
  {
    icon: ShieldCheck,
    title: 'Flat 10-Year Warranty',
    desc: 'Built with Boiling Waterproof Plywood (BWP IS:710) and certified hardware from Blum, Hettich, and Hafele.',
  },
  {
    icon: FileCheck2,
    title: 'Fixed Price Contract',
    desc: 'Once you sign off on your 3D walkthrough, the price is locked. Zero unexpected mid-project cost escalations.',
  },
  {
    icon: Award,
    title: '146-Point Quality Checklist',
    desc: 'Multi-stage quality audits covering edge-banding adhesion, hinge alignment, plumbing seals, and electrical safety.',
  },
];

export default function InteriorsWhyGateLink({ onOpenConsultation }) {
  return (
    <section id="why-us" className="interiors-why-section">
      <div className="interiors-section-header">
        <div className="interiors-badge">
          <ShieldCheck size={14} />
          <span>The GateLink Advantage</span>
        </div>
        <h2 className="interiors-section-title">
          Why Gated Community Residents Choose Us
        </h2>
        <p className="interiors-section-subtitle">
          Unlike independent contractors or fragmented marketplaces, GateLink Interiors is purpose-built for apartment living.
        </p>
      </div>

      <div className="why-cards-grid">
        {ADVANTAGES.map((adv, idx) => {
          const IconComponent = adv.icon;
          return (
            <div key={idx} className="why-card">
              <div className="why-icon-box">
                <IconComponent size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1C1917', margin: '0 0 8px' }}>
                {adv.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                {adv.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Trust Banner */}
      <div
        style={{
          maxWidth: '1240px',
          margin: '48px auto 0',
          background: 'linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%)',
          borderRadius: '20px',
          border: '1px solid #FED7AA',
          padding: '28px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#9A3412', margin: '0 0 4px' }}>
            Planning interiors for your new flat?
          </h4>
          <p style={{ fontSize: '0.92rem', color: '#7C2D12', margin: 0 }}>
            Get a personalized 3D VR walkthrough of your exact floor plan before making any commitment.
          </p>
        </div>

        <button
          onClick={() => onOpenConsultation && onOpenConsultation()}
          className="interiors-btn-primary"
          style={{ padding: '12px 24px' }}
        >
          <Sparkles size={16} />
          <span>Schedule Free Consultation</span>
        </button>
      </div>
    </section>
  );
}
