import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ComparisonSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const traditionalIssues = [
    'Paper entry registers at main gate with illegible hand-writing',
    'Unverified visitors and delivery agents walking into towers',
    'Chasing residents on WhatsApp for overdue maintenance bills',
    'Lost delivery packages and manual gatekeeper call delays',
    'Lack of emergency siren alerts during fire or medical incidents'
  ];

  const societySphereSolutions = [
    '5-Second digital QR passcode verification on guard app',
    '1-Tap lock screen visitor approval & photo logging',
    'Automated maintenance invoices with instant PDF receipts & GST',
    'Digital package tracking with barcode scanning at gate',
    'Instant loud Emergency SOS siren broadcast to guards & family'
  ];

  return (
    <section style={{ padding: '80px 0', background: isDark ? '#0F172A' : '#FFFFFF', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 50px auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-0.5px', marginBottom: '12px' }}>
            Traditional Paper Registers vs. GateLink OS
          </h2>
          <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#555555', lineHeight: 1.6, margin: 0 }}>
            See why over 500+ forward-thinking housing societies upgraded to automated digital security.
          </p>
        </div>

        {/* Side-by-Side Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          
          {/* Traditional Way */}
          <div style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '4px',
            padding: '32px',
            border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #FCA5A5',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #FEE2E2' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '4px', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={20} color="#DC2626" />
              </div>
              <div>
                <h3 style={{ fontSize: '19px', fontWeight: 900, color: '#DC2626', margin: 0 }}>Traditional Manual Gate</h3>
                <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#666666' }}>Unsafe, Slow & Error-Prone</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {traditionalIssues.map((issue) => (
                <div key={issue} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: isDark ? '#CBD5E1' : '#555555', lineHeight: 1.5 }}>
                  <XCircle size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* GateLink OS Way */}
          <div style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '4px',
            padding: '32px',
            border: '2px solid #00B589',
            boxShadow: '0 4px 20px rgba(0, 181, 137, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #ECFDF5' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '4px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} color="#00B589" />
              </div>
              <div>
                <h3 style={{ fontSize: '19px', fontWeight: 900, color: '#00B589', margin: 0 }}>GateLink OS</h3>
                <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#666666' }}>100% Verified, Automated & Instant</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {societySphereSolutions.map((sol) => (
                <div key={sol} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#2C2C2C', lineHeight: 1.5 }}>
                  <CheckCircle2 size={18} color="#00B589" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{sol}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
