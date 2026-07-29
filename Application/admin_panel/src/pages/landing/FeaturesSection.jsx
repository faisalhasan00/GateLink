import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck, 
  ShieldCheck, 
  CreditCard, 
  ShieldAlert, 
  Car, 
  Waves, 
  Users, 
  FileText,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function FeaturesSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section id="features" style={{ padding: '90px 0', background: isDark ? '#0F172A' : '#F8FAFC', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: isDark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF', color: '#2563EB', fontSize: '12px', fontWeight: 800, marginBottom: '12px' }}>
            <Sparkles size={14} /> ENTERPRISE CAPABILITIES
          </div>
          <h2 style={{ fontSize: '40px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', letterSpacing: '-1px', margin: '0 0 16px 0' }}>
            Everything Your Society Needs to Run Digitally
          </h2>
          <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#475569', margin: 0, lineHeight: 1.6 }}>
            Eliminate paper registers, manual WhatsApp payment chasing, and security loopholes.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
          
          {/* Bento Item 1: Large Featured Card with Screenshot (Span 7) */}
          <div className="hover-card-elevate" style={{
            gridColumn: 'span 7',
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '24px',
            padding: '36px',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '12px', background: '#EFF6FF', color: '#2563EB', fontSize: '11px', fontWeight: 900, marginBottom: '16px' }}>
                VISITOR SECURITY & PASSES
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '12px' }}>
                1-Tap Lock Screen Approvals & QR Visitor Passes
              </h3>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
                Residents receive instant push notifications with photo & details when cabs, delivery agents, or guests arrive at the main gate. Approve or deny in 1 tap.
              </p>
            </div>

            <div style={{ borderRadius: '16px', overflow: 'hidden', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0' }}>
              <img src="/assets/resident_app_mockup.png" alt="Resident Approval UI" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            </div>
          </div>

          {/* Bento Item 2: Medium Card (Span 5) */}
          <div className="hover-card-elevate" style={{
            gridColumn: 'span 5',
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '24px',
            padding: '36px',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '12px', background: '#ECFDF5', color: '#059669', fontSize: '11px', fontWeight: 900, marginBottom: '16px' }}>
                GATEKEEPER APP
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '12px' }}>
                5-Second Fast Gate Verification
              </h3>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
                Multilingual app for gatekeepers. Verify pre-approved resident passcodes, log domestic help attendance, and scan delivery barcodes.
              </p>
            </div>

            <div style={{ borderRadius: '16px', overflow: 'hidden', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0' }}>
              <img src="/assets/guard_app_mockup.png" alt="Guard App UI" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            </div>
          </div>

          {/* Bento Item 3: Wide Financial Card (Span 12) */}
          <div className="hover-card-elevate" style={{
            gridColumn: 'span 12',
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '24px',
            padding: '36px',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '32px',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '12px', background: '#FEF3C7', color: '#D97706', fontSize: '11px', fontWeight: 900, marginBottom: '16px' }}>
                AUTOMATED FINANCES & RAZORPAY BILLING
              </div>
              <h3 style={{ fontSize: '26px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '12px' }}>
                Automated Monthly Maintenance Invoicing & Online Collection
              </h3>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
                Generate monthly maintenance bills automatically, accept instant payments via Razorpay UPI & Cards, issue GST receipts, and track overdue payment ledgers in real time.
              </p>
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', fontWeight: 800, color: '#059669' }}>
                <span>✓ 98.4% On-Time Maintenance Collection Rate</span>
                <span>✓ Instant PDF Receipts</span>
              </div>
            </div>

            <div style={{ borderRadius: '16px', overflow: 'hidden', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0' }}>
              <img src="/assets/admin_dashboard_mockup.png" alt="Maintenance Accounting Dashboard" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
