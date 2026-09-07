import React from 'react';

const STEPS = [
  {
    num: 1,
    title: 'Step 1: Visitor Arrival & Category Identification',
    desc: 'A visitor arrives at the gate. The security guard identifies whether they are an invited guest, delivery courier, cab driver, or service professional.'
  },
  {
    num: 2,
    title: 'Step 2: QR Scan, OTP Verification or Photo Capture',
    desc: 'Guards scan the pre-approved QR pass, verify a 6-digit OTP, or register unexpected visitors by capturing their live photo, name, phone, and vehicle details.'
  },
  {
    num: 3,
    title: 'Step 3: Resident Approval When Required',
    desc: 'For unannounced guests or deliveries, the resident app receives an instant notification with the visitor\'s photo and details to approve or deny entry.'
  },
  {
    num: 4,
    title: 'Step 4: Timestamped Gate Entry & Security Record Sync',
    desc: 'Upon approval, the gate entry is recorded with exact timestamps and synced across all gate terminals and the administrative security log.'
  }
];

export default function SecurityWorkflowSection({ isDark }) {
  return (
    <section style={{ marginBottom: '70px', background: isDark ? '#0F172A' : '#FFFFFF', padding: '40px 32px', borderRadius: '20px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>
          How Apartment Gate Security Works
        </h2>
        <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
          A streamlined 4-step security workflow connecting guards, visitors, and residents at every gate entry point.
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
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EF4444', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', marginBottom: '14px' }}>
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
