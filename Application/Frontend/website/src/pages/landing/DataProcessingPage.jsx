import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Database, Lock, Eye, FileCheck2, UserCheck, AlertTriangle, ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';

export default function DataProcessingPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div style={{ background: isDark ? '#020617' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SeoHead 
        title="Data Processing & Resident Privacy Addendum (DPA) - GateLink" 
        description="GateLink Data Processing Addendum (DPA) compliant with the Digital Personal Data Protection (DPDP) Act 2023 for housing societies and RWAs."
        canonicalUrl="https://gatelink.in/data-processing"
      />

      <Navbar />

      {/* Hero Header */}
      <header style={{ paddingTop: '120px', paddingBottom: '50px', background: isDark ? 'linear-gradient(180deg, #0F172A 0%, #020617 100%)' : 'linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%)', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#0EA5E9', textDecoration: 'none', marginBottom: '16px' }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10B981', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>
            <ShieldCheck size={14} /> DPDP Act 2023 Compliant
          </div>
          <h1 style={{ fontSize: '38px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', lineHeight: 1.2, marginBottom: '12px' }}>
            Data Processing & Resident Privacy Addendum
          </h1>
          <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#475569', maxWidth: '720px', lineHeight: 1.6 }}>
            Binding data protection terms establishing GateLink Technologies as a Data Processor and Housing Societies (RWAs) as Data Fiduciaries under Indian law.
          </p>
          <div style={{ marginTop: '16px', fontSize: '12px', color: isDark ? '#64748B' : '#94A3B8', fontWeight: 600 }}>
            Last Revised: August 2026 • Statutory Compliance Release
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '50px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', padding: '36px', boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.05)', fontSize: '15px', lineHeight: 1.7, color: isDark ? '#CBD5E1' : '#334155' }}>
            
            {/* Preamble */}
            <div style={{ padding: '20px', borderRadius: '12px', background: isDark ? 'rgba(14, 165, 233, 0.08)' : '#F0F9FF', border: '1px solid rgba(14, 165, 233, 0.2)', marginBottom: '32px' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0EA5E9', marginBottom: '6px' }}>STATUTORY PURPOSE</div>
              <div style={{ fontSize: '14px', lineHeight: 1.6 }}>
                Because GateLink processes resident profiles, gate visitor logs, vehicular records, and maintenance ledgers, this document establishes strict technical and organizational safeguards required by the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> and the <strong>Information Technology Act, 2000</strong>.
              </div>
            </div>

            {/* Section 1: Roles & Ownership */}
            <h2 style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginTop: '32px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserCheck size={20} color="#0EA5E9" /> 1. Data Fiduciary vs. Data Processor Roles
            </h2>
            <ul style={{ paddingLeft: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Housing Society / RWA (Data Fiduciary):</strong> The RWA remains the exclusive owner and Data Fiduciary of all resident records, flat mappings, visitor entry logs, and staff data uploaded to the GateLink platform.</li>
              <li><strong>GateLink Technologies (Data Processor):</strong> GateLink acts solely as an authorized Data Processor executing digital operations on behalf of the RWA. GateLink never claims ownership or third-party rights over society data.</li>
            </ul>

            {/* Section 2: Technical Safeguards */}
            <h2 style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginTop: '32px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={20} color="#0EA5E9" /> 2. Security & Encryption Standards
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ padding: '16px', borderRadius: '12px', background: isDark ? '#020617' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 800, color: '#0EA5E9', marginBottom: '4px' }}>TLS 1.3 Encryption</div>
                <div style={{ fontSize: '13px' }}>All data transferred between mobile apps, web browsers, and backend servers is encrypted using TLS 1.3 protocols.</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '12px', background: isDark ? '#020617' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 800, color: '#0EA5E9', marginBottom: '4px' }}>AES-256 Storage</div>
                <div style={{ fontSize: '13px' }}>Firestore databases, user credentials, and media files are encrypted at rest using industry-standard AES-256 bit encryption.</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '12px', background: isDark ? '#020617' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 800, color: '#0EA5E9', marginBottom: '4px' }}>Multi-Tenant Isolation</div>
                <div style={{ fontSize: '13px' }}>Firestore security rules enforce complete multi-tenant isolation, guaranteeing Society A cannot read or mutate Society B data.</div>
              </div>
            </div>

            {/* Section 3: Data Retention & Auto-Purging */}
            <h2 style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginTop: '32px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Database size={20} color="#0EA5E9" /> 3. Visitor Log Retention & Data Purging
            </h2>
            <p style={{ marginBottom: '12px' }}>
              To prevent indefinite storage of guest entry logs and personal phone numbers:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Default Retention Period:</strong> Gate visitor logs and entry photos are automatically archived or purged after 180 days, unless an RWA explicitly requests extended retention for security audits.</li>
              <li><strong>Resident Move-Out Erasure:</strong> When a tenant or owner moves out, their personal contact record is unlinked from the flat address and archived or erased upon RWA admin approval.</li>
            </ul>

            {/* Section 4: Resident Rights & Sub-Processors */}
            <h2 style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginTop: '32px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileCheck2 size={20} color="#0EA5E9" /> 4. Authorized Cloud Sub-Processors
            </h2>
            <p style={{ marginBottom: '12px' }}>
              GateLink utilizes verified enterprise cloud infrastructure providers bound by strict data processing contracts:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Google Cloud Platform & Firebase:</strong> Cloud database, authentication, and serverless hosting (Asia-South1 / Mumbai Data Region).</li>
              <li><strong>Cashfree Payments India:</strong> Payment gateway processing for maintenance collections (RBI-licensed Payment Aggregator).</li>
              <li><strong>Twilio / Gupshup:</strong> Transactional SMS and WhatsApp visitor OTP delivery.</li>
            </ul>

            {/* Section 5: Breach Notification */}
            <h2 style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginTop: '32px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={20} color="#F59E0B" /> 5. Data Breach Notification Protocol
            </h2>
            <p style={{ marginBottom: '24px' }}>
              In the unlikely event of a security incident affecting resident data, GateLink will notify affected RWA administrators and statutory authorities within <strong>72 hours</strong> of confirmation, detailing the scope, corrective measures taken, and mitigation steps.
            </p>

            {/* Contact Box */}
            <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Mail size={20} color="#0EA5E9" />
              <span>For DPA queries or security compliance requests, contact our Data Protection Officer at <a href="mailto:support@gatelink.in" style={{ color: '#0EA5E9', fontWeight: 700, textDecoration: 'none' }}>support@gatelink.in</a> or <a href="mailto:admin@gatelink.in" style={{ color: '#0EA5E9', fontWeight: 700, textDecoration: 'none' }}>admin@gatelink.in</a>.</span>
            </div>

          </div>

        </div>
      </main>

      <FooterSection />
    </div>
  );
}
