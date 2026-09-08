import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  {
    q: 'How fast can an emergency electrician or plumber reach my apartment?',
    a: 'Because our certified technicians are already stationed within or adjacent to your gated society cluster, emergency requests are attended at your flat door in 15 to 30 minutes.',
  },
  {
    q: 'What is covered under the 30-Day Re-Work Warranty?',
    a: 'If any repaired plumbing joint, electrical switch, or AC cooling issue re-occurs within 30 days of service, we dispatch a technician back for a free re-inspection and rework with zero labor fees.',
  },
  {
    q: 'How does spare part billing work?',
    a: 'All labor charges are 100% standardized on our rate card. If replacement spare parts (e.g., MCBs, tap cartridges, fan capacitors, or locks) are required, they are billed directly at genuine manufacturer MRP with full GST invoices.',
  },
  {
    q: 'How do technicians pass through my society gate?',
    a: 'GateLink technicians carry verified digital credentials synced with the GateLink Guard Station app. The security guard verifies their identity and toolkit instantly without ringing your intercom repeatedly.',
  },
  {
    q: 'What happens if I only need an inspection?',
    a: 'A nominal inspection fee of ₹99 applies if no repair work is performed. If you proceed with the repair, the ₹99 is 100% waived and deducted from your final bill.',
  },
];

export default function ServicesFaq() {
  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? -1 : idx);
  };

  return (
    <section id="faq" style={{ padding: '80px 24px', maxWidth: '880px', margin: '0 auto' }}>
      <div className="srv-section-header">
        <div className="services-badge">
          <HelpCircle size={14} />
          <span>Got Questions?</span>
        </div>
        <h2 className="srv-section-title">
          Frequently Asked Questions
        </h2>
        <p className="srv-section-subtitle">
          Clear answers regarding technicians, rate cards, warranties, and gate clearances.
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
                border: '1px solid #E2E8F0',
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
                {isOpen ? <ChevronUp size={20} color="#E11D48" /> : <ChevronDown size={20} color="#78716C" />}
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
