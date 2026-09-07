import React from 'react';
import { Building2, Smartphone, Users } from 'lucide-react';

export default function SecurityRolesSection({ isDark }) {
  return (
    <section style={{ marginBottom: '70px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '14px' }}>
          What is GateLink Security Management Software?
        </h2>
        <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '820px', margin: '0 auto', lineHeight: 1.7 }}>
          GateLink Security Management Software is a digital gatekeeper and security-operations platform engineered for residential apartment societies and gated communities in India. It bridges security personnel, facility managers, and residents with real-time gate entry verification, QR checkpoint patrol tracking, incident logging, emergency SOS broadcasting, vehicle logging, and multi-gate synchronization.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '26px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', marginBottom: '14px' }}>
            <Building2 size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For RWA Management Committees</h3>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65 }}>
            Gain a real-time administrative view of gate security operations, monitor guard patrol checkpoint compliance, review logged security incidents, and maintain verified digital visitor archives.
          </p>
        </div>

        <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '26px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(30, 58, 138, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E3A8A', marginBottom: '14px' }}>
            <Smartphone size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For Security Supervisors &amp; Gate Guards</h3>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65 }}>
            Process gate entries faster with high-speed QR and OTP verification, capture walk-in visitor photos, manage real-time entry and check-out feeds, scan patrol tags, and report hazard incidents.
          </p>
        </div>

        <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '26px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', marginBottom: '14px' }}>
            <Users size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For Apartment Residents &amp; Families</h3>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65 }}>
            Receive immediate push notifications when visitors or delivery staff arrive at the gate, approve entries with 1 tap, and access one-touch emergency SOS panic alerts in critical situations.
          </p>
        </div>
      </div>
    </section>
  );
}
