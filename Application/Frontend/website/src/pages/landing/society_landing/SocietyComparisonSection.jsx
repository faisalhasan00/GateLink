import React from 'react';

export default function SocietyComparisonSection({ isDark }) {
  return (
    <section style={{ marginBottom: '70px', background: isDark ? '#0F172A' : '#FFFFFF', padding: '40px 32px', borderRadius: '20px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>
          How GateLink Transforms Everyday Society Operations
        </h2>
        <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
          Replacing traditional manual methods with digital automation creates accountability and clarity for every resident and committee member.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div style={{ padding: '20px', borderRadius: '12px', background: isDark ? '#020617' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '6px' }}>Before GateLink</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '6px' }}>Manual Paper Gate Registers</div>
          <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>Slow visitor handwriting, unverified phone numbers, and illegible entry records.</p>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>With GateLink</div>
          <p style={{ fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 600, lineHeight: 1.5 }}>Digital QR passes, instant phone approvals, and searchable entry logs.</p>
        </div>

        <div style={{ padding: '20px', borderRadius: '12px', background: isDark ? '#020617' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '6px' }}>Before GateLink</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '6px' }}>Delayed Maintenance Collections</div>
          <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>Manual cheque deposits, physical receipt writing, and unclear outstanding balances.</p>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>With GateLink</div>
          <p style={{ fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 600, lineHeight: 1.5 }}>Automated billing, instant UPI payments, and automated digital receipts.</p>
        </div>

        <div style={{ padding: '20px', borderRadius: '12px', background: isDark ? '#020617' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '6px' }}>Before GateLink</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '6px' }}>Disorganized Messaging Complaints</div>
          <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>Complaints get lost in chat groups without accountability or progress tracking.</p>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>With GateLink</div>
          <p style={{ fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 600, lineHeight: 1.5 }}>Structured helpdesk ticketing with status updates and staff assignment.</p>
        </div>
      </div>
    </section>
  );
}
