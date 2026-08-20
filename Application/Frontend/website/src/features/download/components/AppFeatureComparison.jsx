import React from 'react';
import { Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AppFeatureComparison({ isDark }) {
  const features = [
    { name: '1-Tap Visitor Approval & Push Alerts', resident: true, guard: true },
    { name: 'Visitor Entry Passcode & QR Code Scanner', resident: true, guard: true },
    { name: 'Online Maintenance Invoicing & Cashfree UPI', resident: true, guard: false },
    { name: 'Amenity & Clubhouse Slot Booking', resident: true, guard: false },
    { name: 'Domestic Helper Attendance Punch-In', resident: true, guard: true },
    { name: 'Emergency SOS Broadcast & Siren', resident: true, guard: true },
    { name: 'Vehicle Plate Logging & Blacklist Alerts', resident: false, guard: true },
    { name: 'Multilingual Voice & Hindi Interface', resident: true, guard: true },
    { name: 'Offline Mode Gate Entry Caching', resident: false, guard: true },
  ];

  return (
    <section style={{ padding: '0 0 100px 0', backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#1E293B', marginBottom: '10px' }}>
            Compare Resident vs. Guard App Capabilities
          </h2>
          <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B' }}>
            Both native mobile applications are synchronized in real-time with zero latency.
          </p>
        </div>

        <div
          style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '20px',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
            overflow: 'hidden',
            boxShadow: isDark ? '0 12px 30px rgba(0,0,0,0.3)' : '0 12px 30px rgba(0,0,0,0.04)'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: isDark ? '#0F172A' : '#F1F5F9', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0' }}>
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 800, color: isDark ? '#94A3B8' : '#64748B' }}>CORE MOBILE CAPABILITY</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 800, color: '#0EA5E9', textAlign: 'center' }}>RESIDENT APP</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 800, color: '#10B981', textAlign: 'center' }}>GUARD APP</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={i} style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 24px', fontSize: '14px', fontWeight: 600, color: isDark ? '#E2E8F0' : '#334155' }}>
                    {f.name}
                  </td>
                  <td style={{ padding: '14px 24px', textAlign: 'center' }}>
                    {f.resident ? <CheckCircle2 size={18} color="#0EA5E9" style={{ display: 'inline' }} /> : <span style={{ color: isDark ? '#475569' : '#CBD5E1' }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 24px', textAlign: 'center' }}>
                    {f.guard ? <CheckCircle2 size={18} color="#10B981" style={{ display: 'inline' }} /> : <span style={{ color: isDark ? '#475569' : '#CBD5E1' }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
