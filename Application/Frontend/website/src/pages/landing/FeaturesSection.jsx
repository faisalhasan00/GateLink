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
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function FeaturesSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section id="features" style={{ padding: '80px 0', background: isDark ? '#0F172A' : '#FFFFFF', position: 'relative', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 50px auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-0.5px', marginBottom: '12px' }}>
            Everything Your Society Needs to Run Digitally
          </h2>
          <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#555555', lineHeight: 1.6, margin: 0 }}>
            Eliminate paper registers, manual WhatsApp payment chasing, and security loopholes with automated society operating system.
          </p>
        </div>

        {/* Feature Cards Grid (NoBrokerHood Style) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {/* Card 1: Visitor Security */}
          <div style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '4px',
            padding: '30px',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ width: '100%', height: '180px', marginBottom: '20px', borderRadius: '4px', overflow: 'hidden', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9' }}>
                <img src="/assets/resident_app_mockup.png" alt="GateLink Resident Mobile App Lock Screen 1-Tap Visitor Approvals Interface" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginBottom: '10px' }}>
                1-Tap Lock Screen Approvals
              </h3>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.6, margin: 0 }}>
                Residents receive instant push notifications with photo & details when cabs, delivery agents, or guests arrive at main gate.
              </p>
            </div>
          </div>

          {/* Card 2: Gatekeeper App */}
          <div style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '4px',
            padding: '30px',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ width: '100%', height: '180px', marginBottom: '20px', borderRadius: '4px', overflow: 'hidden', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9' }}>
                <img src="/assets/guard_app_mockup.png" alt="GateLink Security Guard Gatekeeper Mobile Interface" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginBottom: '10px' }}>
                5-Second Fast Gate Verification
              </h3>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.6, margin: 0 }}>
                Multilingual app for gatekeepers. Verify pre-approved resident passcodes, log maid attendance, and scan courier barcodes.
              </p>
            </div>
          </div>

          {/* Card 3: Pay Maintenance Bill Online */}
          <div style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '4px',
            padding: '30px',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ width: '100%', height: '180px', marginBottom: '20px', borderRadius: '4px', overflow: 'hidden', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F1F5F9' }}>
                <img src="/assets/admin_dashboard_mockup.png" alt="GateLink Society Administration Dashboard & Maintenance Billing System" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginBottom: '10px' }}>
                Pay Maintenance Bill Online
              </h3>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.6, margin: 0 }}>
                Generate monthly maintenance bills automatically, accept instant payments via UPI & Cards, and receive GST receipts.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
