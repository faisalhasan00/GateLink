import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  {
    q: 'Are there any hidden onboarding or setup fees?',
    a: 'No. GateLink has zero hidden onboarding fees. We provide complete digital data migration, guard training, and committee setup free of charge.'
  },
  {
    q: 'How does the Razorpay payment gateway integration work?',
    a: 'Maintenance bill payments made by residents via UPI, Credit/Debit cards, or NetBanking settle directly into your society bank account. Receipts are automatically generated and emailed to residents.'
  },
  {
    q: 'Can we upgrade or switch plans later?',
    a: 'Yes, you can upgrade your plan anytime as your housing society grows. Upgrade takes effect immediately with pro-rated billing.'
  },
  {
    q: 'Is resident and visitor data encrypted and secure?',
    a: 'Yes. All data is encrypted using 256-Bit SSL TLS v1.3 encryption and hosted on secure AWS infrastructure in India, adhering strictly to privacy compliance laws.'
  }
];

export default function PricingFaqSection() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <section style={{ padding: '80px 0 100px 0', background: '#0F172A' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#FFFFFF' }}>Frequently Asked Questions</h2>
          <p style={{ color: '#94A3B8', marginTop: '8px' }}>Have questions about plans, billing, or security? We've got answers.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {FAQS.map((f, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={f.q}
                onClick={() => setExpandedFaq(isOpen ? null : idx)}
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, color: '#FFFFFF', fontSize: '16px' }}>
                  <span>{f.q}</span>
                  {isOpen ? <ChevronUp size={20} color="#818CF8" /> : <ChevronDown size={20} color="#94A3B8" />}
                </div>
                {isOpen && (
                  <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '12px', lineHeight: 1.6, margin: '12px 0 0 0' }}>
                    {f.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
