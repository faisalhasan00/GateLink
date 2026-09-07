import React from 'react';
import { Building2, Users, ShieldCheck } from 'lucide-react';

export default function SocietyRolesSection({ isDark }) {
  return (
    <section style={{ marginBottom: '70px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '14px' }}>
          What is GateLink Society Management Software?
        </h2>
        <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '820px', margin: '0 auto', lineHeight: 1.7 }}>
          GateLink is a unified cloud-based operating system engineered specifically for residential gated communities, housing societies, and apartment associations across India. It bridges the communication and operational gap between management committee members, resident flat owners, tenants, and on-duty gate security guards.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '24px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', marginBottom: '14px' }}>
            <Building2 size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For RWA Management Committees</h3>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
            Gain real-time financial oversight, automate monthly dues invoicing, track resolution of resident complaints, and broadcast verified official circulars without WhatsApp chaos.
          </p>
        </div>

        <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '24px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(30, 58, 138, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E3A8A', marginBottom: '14px' }}>
            <Users size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For Apartment Residents &amp; Owners</h3>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
            Approve guest visits with one tap, pay maintenance fees securely online, book clubhouse amenities, and trigger instant emergency SOS sirens whenever assistance is required.
          </p>
        </div>

        <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '24px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', marginBottom: '14px' }}>
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For Gate Security Guards</h3>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
            Operate a straightforward tablet and mobile gatekeeper app for verifying delivery agents, scanning visitor passcodes, logging daily domestic helpers, and managing duty shifts.
          </p>
        </div>
      </div>
    </section>
  );
}
