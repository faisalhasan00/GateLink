import React from 'react';
import { Compass, Palette, Cog, KeyRound, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: Compass,
    title: 'Consult & 3D Discovery',
    desc: 'Meet our senior interior architect for laser site measurements, floor plan analysis, and custom 3D layout simulation.',
  },
  {
    step: '02',
    icon: Palette,
    title: 'Material Selection & Quote',
    desc: 'Touch and select acrylics, laminates, and hardware. We lock your exact project budget with zero hidden fees.',
  },
  {
    step: '03',
    icon: Cog,
    title: 'German Factory Production',
    desc: 'Precision CNC cutting, zero-dust edge banding, and quality inspections executed in our mechanized facility.',
  },
  {
    step: '04',
    icon: KeyRound,
    title: '45-Day Move-in Handover',
    desc: 'Silent modular on-site assembly, thorough post-installation deep cleaning, and 10-year warranty certificate handover.',
  },
];

export default function InteriorsProcess({ onOpenConsultation }) {
  return (
    <section id="process" className="interiors-process-section">
      <div className="interiors-section-header">
        <div className="interiors-badge">
          <Compass size={14} />
          <span>Simple 4-Step Journey</span>
        </div>
        <h2 className="interiors-section-title">
          From Concept to Move-In in 45 Days
        </h2>
        <p className="interiors-section-subtitle">
          A seamless, transparent design-to-delivery lifecycle designed to keep your home quiet and clean.
        </p>
      </div>

      <div className="process-steps-grid">
        {STEPS.map((stepItem, idx) => {
          const IconComp = stepItem.icon;
          return (
            <div key={idx} className="process-card">
              <div className="process-step-num">{stepItem.step}</div>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#FDF1EC',
                  color: '#E25B38',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                <IconComp size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1C1917', margin: '0 0 8px' }}>
                {stepItem.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                {stepItem.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
