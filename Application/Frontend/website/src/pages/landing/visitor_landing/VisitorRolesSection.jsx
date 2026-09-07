import React from 'react';
import { Smartphone, ShieldCheck, Building2 } from 'lucide-react';

export default function VisitorRolesSection({ isDark }) {
  return (
    <section style={{ marginBottom: '70px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '14px' }}>
          What is GateLink Visitor Management System?
        </h2>
        <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '820px', margin: '0 auto', lineHeight: 1.7 }}>
          GateLink Visitor Management System is a specialized digital gate pass and visitor entry platform engineered for housing societies, apartment complexes, and gated communities in India. It connects residents and security guards in real time to streamline visitor verification, pre-authorize guest access, log delivery personnel, and maintain accurate digital gate records.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '26px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', marginBottom: '14px' }}>
            <Smartphone size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For Apartment Residents</h3>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65 }}>
            Create digital guest invitations with custom validity windows, share QR passes and OTPs via WhatsApp, receive instant phone notifications when unannounced visitors arrive, and approve or deny entry with a single tap.
          </p>
        </div>

        <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '26px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(30, 58, 138, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E3A8A', marginBottom: '14px' }}>
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For Security Guards</h3>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65 }}>
            Use a dedicated mobile and tablet gatekeeper terminal to scan visitor QR passes, verify 6-digit OTP passcodes, record delivery couriers, log vehicle license plate numbers, and receive instant alerts for blacklisted individuals.
          </p>
        </div>

        <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '26px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', marginBottom: '14px' }}>
            <Building2 size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For RWA Management Committees</h3>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65 }}>
            Access centralized gate entry records, monitor daily visitor traffic trends, track domestic staff attendance patterns across all society gates, and maintain complete digital accountability across the community perimeter.
          </p>
        </div>
      </div>
    </section>
  );
}
