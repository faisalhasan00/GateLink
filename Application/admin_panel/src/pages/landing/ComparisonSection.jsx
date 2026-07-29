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
    'Automated Razorpay invoices with instant PDF receipts & GST',
    'Digital package tracking with barcode scanning at gate',
    'Instant loud Emergency SOS siren broadcast to guards & family'
  ];

  return (
    <section style={{ padding: '90px 0', background: isDark ? '#0F172A' : '#F8FAFC', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px auto' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563EB', letterSpacing: '1px', textTransform: 'uppercase' }}>THE TRANSFORMATION</span>
          <h2 style={{ fontSize: '38px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', letterSpacing: '-1px', marginTop: '8px' }}>
            Traditional Paper Registers vs. SocietySphere OS
          </h2>
          <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#475569', marginTop: '8px', lineHeight: 1.6 }}>
            See why over 500+ forward-thinking housing societies upgraded to automated digital security.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          
          {/* Traditional Way */}
          <div style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '24px',
            padding: '36px',
            border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #FCA5A5',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '16px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #FEE2E2' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={22} color="#DC2626" />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#DC2626', margin: 0 }}>Traditional Manual Gate</h3>
                <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>Unsafe, Slow & Error-Prone</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {traditionalIssues.map((issue) => (
                <div key={issue} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: isDark ? '#CBD5E1' : '#475569', lineHeight: 1.5 }}>
                  <XCircle size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SocietySphere Way */}
          <div style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '24px',
            padding: '36px',
            border: '2px solid #2563EB',
            boxShadow: '0 10px 30px rgba(37, 99, 235, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '16px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #EFF6FF' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={22} color="#2563EB" />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#2563EB', margin: 0 }}>SocietySphere OS</h3>
                <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>100% Verified, Automated & Instant</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {societySphereSolutions.map((sol) => (
                <div key={sol} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A', lineHeight: 1.5 }}>
                  <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
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
