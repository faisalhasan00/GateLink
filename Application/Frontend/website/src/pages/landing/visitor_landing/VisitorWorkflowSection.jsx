import React from 'react';

const STEPS = [
  {
    num: 1,
    title: 'Invitation or Arrival',
    desc: 'Residents share an expected QR pass via WhatsApp, or an unexpected visitor arrives directly at the security gate.'
  },
  {
    num: 2,
    title: 'Guard Verification',
    desc: 'Security guards scan the QR code/passcode or enter the visitor\'s destination flat number into the gatekeeper terminal.'
  },
  {
    num: 3,
    title: 'Instant Approval',
    desc: 'Pre-approved guests enter immediately; unexpected visitors trigger a 1-tap mobile push notification to the resident flat.'
  },
  {
    num: 4,
    title: 'Synchronized Logging',
    desc: 'Entry timestamps, vehicle numbers, and visitor categories are securely logged and synced across all society gates in real time.'
  }
];

export default function VisitorWorkflowSection({ isDark }) {
  return (
    <section style={{ marginBottom: '70px', background: isDark ? '#0F172A' : '#FFFFFF', padding: '40px 32px', borderRadius: '20px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>
          How Digital Visitor Management Works at the Gate
        </h2>
        <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
          A streamlined 4-step workflow connecting residents, security guards, and visitors for fast, verified entry.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {STEPS.map((s) => (
          <div 
            key={s.num} 
            style={{ 
              padding: '24px 20px', 
              borderRadius: '14px', 
              background: isDark ? '#020617' : '#F8FAFC', 
              border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0' 
            }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0EA5E9', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', marginBottom: '14px' }}>
              {s.num}
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>{s.title}</h3>
            <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
