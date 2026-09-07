import React from 'react';

export default function MaintenanceComparisonSection({ isDark }) {
  return (
    <section style={{ marginBottom: '70px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>
          From Manual Receipt Books to Digital Society Accounting
        </h2>
        <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
          Comparing traditional manual society collection methods with GateLink's digital billing platform.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div style={{ padding: '24px', borderRadius: '16px', background: isDark ? '#0F172A' : '#FFFFFF', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>Manual Receipt Books vs. Digital Invoices</h3>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '4px' }}>Manual Paper Invoicing</div>
          <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>Handwritten receipt books take hours to write, get lost easily, and require physical distribution across hundreds of flats.</p>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>GateLink Digital Invoices</div>
          <p style={{ fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 600, lineHeight: 1.5 }}>Automated digital invoices with itemized charge breakdowns, GSTIN declarations, and instant printable PDF receipts.</p>
        </div>

        <div style={{ padding: '24px', borderRadius: '16px', background: isDark ? '#0F172A' : '#FFFFFF', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>Cheque Collections vs. Online Payments</h3>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '4px' }}>Physical Cheque Collection</div>
          <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>Collecting paper cheques requires physical drop boxes, manual bank visits, clearance delays, and risk of cheque bounces.</p>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>GateLink Online Payments</div>
          <p style={{ fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 600, lineHeight: 1.5 }}>Secure Cashfree payment gateway supporting UPI (GPay, PhonePe), Debit/Credit Cards, Net Banking, and offline UTR recording.</p>
        </div>

        <div style={{ padding: '24px', borderRadius: '16px', background: isDark ? '#0F172A' : '#FFFFFF', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>Scattered Spreadsheets vs. Centralized Dues Records</h3>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '4px' }}>Unorganized Spreadsheets</div>
          <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>Spreadsheets lead to version conflicts, unrecorded payments, disputed balances, and tedious manual accounting audits.</p>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>GateLink Centralized Ledger</div>
          <p style={{ fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 600, lineHeight: 1.5 }}>Real-time paid/unpaid/overdue status filtering, automatic late penalty tracking, and verifiable transaction records.</p>
        </div>
      </div>
    </section>
  );
}
