import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

export default function PartnerFaq() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const faqs = [
    {
      q: 'Who is eligible to become a GateLink Partner?',
      a: 'Anyone! Real estate brokers, apartment owners, tenants, independent house owners, social media creators, freelancers, and security agencies can partner and earn recurring commission.'
    },
    {
      q: 'When and how is the commission paid?',
      a: 'Commissions are calculated monthly and transferred directly to your registered UPI ID (Google Pay, PhonePe, Paytm, BHIM) once the society clears their monthly SaaS maintenance invoice.'
    },
    {
      q: 'How does the Freelancer / Social Media Referral Link work?',
      a: 'When you share your personal referral code (e.g. gatelink.in/partners?ref=YOURCODE), anyone who signs up using your link is linked to your profile. When they onboard a paying society, you earn sub-partner override commission on that deal!'
    },
    {
      q: 'What does "Lifetime Commission" mean for Growth Partners?',
      a: 'As long as the society you onboarded remains active and pays their GateLink subscription, you receive 2% recurring revenue share every single month with no expiration date.'
    }
  ];

  return (
    <section style={{ padding: '0 0 100px 0', maxWidth: '850px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span style={{ fontSize: '12px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '1px' }}>
          PARTNER QUESTIONS
        </span>
        <h2 style={{ fontSize: '28px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-0.5px', margin: '8px 0 10px 0' }}>
          Frequently Asked Questions
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {faqs.map((f, idx) => (
          <div
            key={idx}
            style={{
              background: isDark ? '#1E293B' : '#FFFFFF',
              padding: '24px',
              borderRadius: '16px',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB'
            }}
          >
            <h4 style={{ fontSize: '16px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '0 0 8px 0' }}>
              {f.q}
            </h4>
            <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.6, margin: 0 }}>
              {f.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
