import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  {
    q: 'How is GateLink Interiors different from local contractors or marketplaces?',
    a: 'GateLink Interiors is built specifically for gated societies. We pre-clear all material entries at your society gate, perform 90% of cutting and drilling off-site in precision factories to avoid noise violations, and back every project with a guaranteed 45-day move-in commitment and a flat 10-year warranty.',
  },
  {
    q: 'Is the 3D design session and initial price estimate really 100% free?',
    a: 'Yes! Our senior interior architect visits your flat, takes laser measurements, and provides an immersive 3D walkthrough along with an itemized budget quote at zero cost with no obligation to book.',
  },
  {
    q: 'What is covered under the 10-Year Warranty?',
    a: 'Our warranty covers all structural Boiling Waterproof Plywood (BWP IS:710), anti-termite degradation, delamination of laminates/acrylics, and certified German hardware (hinges, soft-close channels, hydraulic lifts from Blum, Hettich, and Hafele).',
  },
  {
    q: 'How do you prevent society fines and noise complaints?',
    a: 'We strictly operate within standard society work hours (10:00 AM to 5:00 PM, Monday through Saturday). Because all cutting, routing, and edge-banding is completed at our mechanized factory, on-site work is limited to clean, silent modular assembly.',
  },
  {
    q: 'What happens if the project is delayed beyond 45 days?',
    a: 'We provide a legally binding 45-Day Handover Guarantee. In the unlikely event of an installation delay on our end, we compensate you ₹1,000 per day for every day of delay directly.',
  },
];

export default function InteriorsFaq() {
  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? -1 : idx);
  };

  return (
    <section id="faq" style={{ padding: '80px 24px', maxWidth: '880px', margin: '0 auto' }}>
      <div className="interiors-section-header">
        <div className="interiors-badge">
          <HelpCircle size={14} />
          <span>Got Questions?</span>
        </div>
        <h2 className="interiors-section-title">
          Frequently Asked Questions
        </h2>
        <p className="interiors-section-subtitle">
          Everything you need to know about designing your dream home with GateLink Interiors.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E8E2D9',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
              }}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                style={{
                  width: '100%',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '1.05rem',
                  fontWeight: '700',
                  color: '#1C1917',
                }}
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp size={20} color="#E25B38" /> : <ChevronDown size={20} color="#78716C" />}
              </button>

              {isOpen && (
                <div style={{ padding: '0 24px 20px', fontSize: '0.92rem', color: '#57534E', lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
