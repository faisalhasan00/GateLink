import React from 'react';
import { Building2, TrendingUp, CreditCard } from 'lucide-react';

export default function MaintenanceRolesSection({ isDark }) {
  return (
    <section style={{ marginBottom: '70px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '14px' }}>
          What is GateLink Maintenance Management Software?
        </h2>
        <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '820px', margin: '0 auto', lineHeight: 1.7 }}>
          GateLink Maintenance Management Software is a digital society billing and accounting platform designed for apartment associations, housing societies, and Resident Welfare Associations (RWAs) in India. It automates recurring monthly maintenance invoicing, enables secure online fee collection through UPI and cards, generates official GST tax invoices, tracks outstanding dues, and maintains a centralized financial payment ledger.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '26px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', marginBottom: '14px' }}>
            <Building2 size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For RWA Management Committees</h3>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65 }}>
            Automate monthly billing schedules across all apartment blocks, eliminate paper receipt printing costs, monitor real-time collection metrics, and ensure structured financial governance for the community.
          </p>
        </div>

        <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '26px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(30, 58, 138, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E3A8A', marginBottom: '14px' }}>
            <TrendingUp size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For Society Treasurers &amp; Accountants</h3>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65 }}>
            Configure multi-charge billing parameters, review and approve offline NEFT/cheque payments, monitor defaulter lists with calculated late penalties, and reconcile bank settlements with complete payment histories.
          </p>
        </div>

        <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '26px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', marginBottom: '14px' }}>
            <CreditCard size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For Apartment Residents &amp; Flat Owners</h3>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65 }}>
            View itemized maintenance breakdowns, pay dues in seconds via UPI, Cards, or Net Banking from the resident app, download official tax receipts, and access chronological payment archives anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
