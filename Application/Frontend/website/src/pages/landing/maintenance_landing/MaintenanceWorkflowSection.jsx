import React from 'react';

const STEPS = [
  {
    num: 1,
    title: 'Step 1: Configure Billing Rules & Components',
    desc: 'Society administrators set recurring billing parameters including base charges, parking slots, water utilities, sinking funds, and due dates in the admin dashboard.'
  },
  {
    num: 2,
    title: 'Step 2: Automated Monthly Invoicing',
    desc: 'On the scheduled billing day, the automated billing engine generates itemized digital invoices for all active flats and notifies residents via the mobile application.'
  },
  {
    num: 3,
    title: 'Step 3: Online Payment via UPI, Cards or Net Banking',
    desc: 'Residents review their invoice breakdown and complete payments directly through the Cashfree payment gateway or submit offline bank reference details.'
  },
  {
    num: 4,
    title: 'Step 4: Record Payments & Reconcile Transactions',
    desc: 'Online payments update invoice statuses instantly and issue printable tax receipts, while offline submissions are verified by administrators in the dashboard.'
  }
];

export default function MaintenanceWorkflowSection({ isDark }) {
  return (
    <section style={{ marginBottom: '70px', background: isDark ? '#0F172A' : '#FFFFFF', padding: '40px 32px', borderRadius: '20px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>
          How Society Maintenance Billing Works
        </h2>
        <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
          A structured 4-step workflow connecting society administrators and residents for automated monthly maintenance collections.
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
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10B981', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', marginBottom: '14px' }}>
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
