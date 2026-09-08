import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  {
    q: 'How fast does an on-demand helper arrive at my flat?',
    a: 'Because our verified staff are already active within or adjacent to your gated society, instant on-demand helpers arrive at your flat door in 15 to 30 minutes after booking.',
  },
  {
    q: 'How do you verify the background and police records of helpers?',
    a: 'Every helper undergoes a rigorous 4-step verification: Government Aadhaar biometric verification, local police station record clearance, permanent address physical verification, and past society reference checks.',
  },
  {
    q: 'What happens if my monthly helper is absent or on leave?',
    a: 'You never have to clean or wash dishes yourself. Simply tap "Request Backup" in the GateLink app, and a pre-verified substitute helper arrives at your door within 30 minutes at zero extra cost.',
  },
  {
    q: 'Is there any broker commission or registration fee?',
    a: 'No! Unlike traditional maid agencies that charge ₹3,000 to ₹5,000 in upfront commission, GateLink charges zero middleman fees. 100% of the calculated compensation goes directly to support your helper.',
  },
  {
    q: 'Can I interview the cook or helper before confirming a monthly plan?',
    a: 'Yes! For monthly cooking and full-time daily help, we schedule a free 1-day trial or consultation so you can test cooking flavors, hygiene, and timing before confirming your monthly subscription.',
  },
];

export default function MaidsFaq() {
  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? -1 : idx);
  };

  return (
    <section id="faq" style={{ padding: '80px 24px', maxWidth: '880px', margin: '0 auto' }}>
      <div className="maids-section-header">
        <div className="maids-badge">
          <HelpCircle size={14} />
          <span>Got Questions?</span>
        </div>
        <h2 className="maids-section-title">
          Frequently Asked Questions
        </h2>
        <p className="maids-section-subtitle">
          Everything you need to know about booking verified house help with GateLink.
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
                border: '1px solid #E7E5E4',
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
                {isOpen ? <ChevronUp size={20} color="#D97706" /> : <ChevronDown size={20} color="#78716C" />}
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
