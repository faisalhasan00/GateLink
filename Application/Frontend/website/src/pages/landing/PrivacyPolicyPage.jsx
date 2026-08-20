import React, { useState } from 'react';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import SeoHead from '../../components/seo/SeoHead';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function PrivacyPolicyPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Dynamic SEO Head */}
      <SeoHead
        title="Privacy Policy & DPDP Compliance - GateLink"
        description="GateLink Privacy Policy detailing ISO 27001 security, DPDP compliance, resident data protection, and 256-Bit SSL encryption."
        canonicalUrl="https://gatelink.in/privacy"
      />

      {/* Navbar */}
      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      {/* Main Privacy Policy Container */}
      <main style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              <ShieldCheck size={16} /> DATA PROTECTION & TRUST
            </div>
            <h1 style={{ fontSize: '38px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-0.5px', marginBottom: '12px' }}>
              Privacy Policy & Data Security Standards
            </h1>
            <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#666666', margin: 0 }}>
              Last updated: July 2026 • DPDP Act 2023 & ISO 27001 Certified
            </p>
          </div>

          {/* Privacy Content Card */}
          <div style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '16px',
            padding: '40px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            lineHeight: 1.7,
            fontSize: '15px',
            color: isDark ? '#E2E8F0' : '#444444'
          }}>
            <p style={{ marginTop: 0 }}>
              <strong>GateLink</strong> ("we", "our", "us") is dedicated to safeguarding the personal information of housing society management committees, flat owners, residents, security guards, and visitors. This Privacy Policy details our data collection practices, encryption standards, and your rights under India’s Digital Personal Data Protection (DPDP) Act 2023.
            </p>

            <h3 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginTop: '32px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} color="#0EA5E9" /> 1. Information We Collect
            </h3>
            <p>
              To operate our gated community security and society management system, we collect:
            </p>
            <ul style={{ paddingLeft: '24px', margin: '10px 0' }}>
              <li><strong>Resident & Flat Data:</strong> Name, phone number, email address, flat number, and vehicle registration numbers.</li>
              <li><strong>Gatekeeper Entry Logs:</strong> Visitor entry timestamp, OTP passcodes, photo verification logs, and delivery courier details.</li>
              <li><strong>Maintenance Billing Data:</strong> Payment transaction history, UPI transaction IDs, and GST tax invoice details.</li>
            </ul>

            <h3 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginTop: '32px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#0EA5E9" /> 2. Data Encryption & Storage Security
            </h3>
            <p>
              All personal data transmitted between resident mobile apps, guard tablets, and society admin web consoles is protected using <strong>256-Bit SSL TLS v1.3 encryption</strong> in transit and AES-256 encryption at rest. All database servers are hosted in secure MeitY-empaneled tier-4 data centers within India.
            </p>

            <h3 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginTop: '32px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={18} color="#0EA5E9" /> 3. Data Protection Rights & Erasure
            </h3>
            <p>
              Under DPDP regulations, flat owners and residents retain full control over their personal profile records. You may request profile data correction, access export logs, or submit erasure requests upon moving out of the housing society by contacting your RWA admin or emailing our Data Officer at <a href="mailto:gatelink.in@gmail.com" style={{ color: '#0EA5E9', textDecoration: 'none', fontWeight: 700 }}>gatelink.in@gmail.com</a>.
            </p>

            <h3 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginTop: '32px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#0EA5E9" /> 4. Third-Party Sharing Restrictions
            </h3>
            <p>
              We maintain a strict zero-selling policy. GateLink <strong>never sells, rents, or monetizes resident personal contact information</strong> or gate traffic logs to third-party telemarketers or advertisers.
            </p>

            <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: isDark ? '#94A3B8' : '#666666' }}>
              <CheckCircle2 size={16} color="#0EA5E9" />
              <span>For questions regarding our privacy practices, contact Data Protection Officer at gatelink.in@gmail.com</span>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <FooterSection />

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
