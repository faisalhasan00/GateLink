import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import SeoHead from '../../components/seo/SeoHead';
import {
  ShieldCheck,
  Lock,
  Users,
  CreditCard,
  FileText,
  CloudUpload,
  Mail,
  CheckCircle2,
  Clock,
  Building,
  Server
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function SecurityCenterPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB';
  const textColor = isDark ? '#FFFFFF' : '#1E293B';
  const subTextColor = isDark ? '#94A3B8' : '#64748B';

  const statusBadge = (type) => {
    switch (type) {
      case 'verified':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#166534' }}>
            <CheckCircle2 size={13} /> 🟢 Verified / Implemented
          </span>
        );
      case 'pending':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, backgroundColor: '#FEF3C7', color: '#92400E' }}>
            <Clock size={13} /> 🟡 Production Activation Pending
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <SeoHead
        title="GateLink Security Center | Security & Trust"
        description="GateLink Trust Center: Learn how GateLink protects community data, controls access, secures payments and supports reliable gated-community operations."
        canonicalUrl="https://gatelink.in/security"
      />

      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      <main style={{ paddingTop: '110px', paddingBottom: '90px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

          {/* Hero Banner */}
          <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 50px auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', backgroundColor: isDark ? '#1E3A8A' : '#E0F2FE', color: isDark ? '#38BDF8' : '#0284C7', fontSize: '13px', fontWeight: 800, marginBottom: '16px' }}>
              <ShieldCheck size={16} /> GATELINK TRUST CENTER
            </div>
            <h1 style={{ fontSize: '38px', fontWeight: 900, color: textColor, letterSpacing: '-1px', margin: '0 0 16px 0', lineHeight: 1.15 }}>
              Security, privacy and trust built into GateLink.
            </h1>
            <p style={{ fontSize: '17px', color: subTextColor, lineHeight: 1.6, margin: 0 }}>
              GateLink is designed to protect community data, control access and support reliable gated-community operations.
            </p>
          </div>

          {/* Card 1: 🔐 Security Architecture */}
          <section style={{ marginBottom: '32px' }}>
            <div style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Server size={24} color="#0EA5E9" />
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: textColor, margin: 0 }}>🔐 Security Architecture</h2>
                <div style={{ marginLeft: 'auto' }}>{statusBadge('verified')}</div>
              </div>
              <p style={{ fontSize: '15px', color: subTextColor, lineHeight: 1.65, margin: '0 0 20px 0' }}>
                GateLink is built on modern multi-tenant cloud architecture. Authorization, tenant data isolation, and sensitive data workflows are enforced strictly on authenticated backend servers and security rules.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '18px', borderRadius: '10px', background: isDark ? '#0F172A' : '#F8FAFC', border: `1px solid ${borderColor}` }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: textColor, marginBottom: '6px' }}>Multi-Tenant Architecture</h3>
                  <p style={{ fontSize: '13px', color: subTextColor, lineHeight: 1.5, margin: 0 }}>Designed from the ground up to support multiple societies with strict digital segregation.</p>
                </div>
                <div style={{ padding: '18px', borderRadius: '10px', background: isDark ? '#0F172A' : '#F8FAFC', border: `1px solid ${borderColor}` }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: textColor, marginBottom: '6px' }}>Server-Side Authorization</h3>
                  <p style={{ fontSize: '13px', color: subTextColor, lineHeight: 1.5, margin: 0 }}>All privilege checks and data mutations execute strictly on secure backend components.</p>
                </div>
                <div style={{ padding: '18px', borderRadius: '10px', background: isDark ? '#0F172A' : '#F8FAFC', border: `1px solid ${borderColor}` }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: textColor, marginBottom: '6px' }}>Firebase Security Controls</h3>
                  <p style={{ fontSize: '13px', color: subTextColor, lineHeight: 1.5, margin: 0 }}>Leveraging enterprise-grade identity authentication and server-enforced security rules.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Card 2: 🛡️ Access Control & User Roles */}
          <section style={{ marginBottom: '32px' }}>
            <div style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Users size={24} color="#1E3A8A" />
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: textColor, margin: 0 }}>🛡️ Access Control & User Roles</h2>
                <div style={{ marginLeft: 'auto' }}>{statusBadge('verified')}</div>
              </div>
              <p style={{ fontSize: '15px', color: subTextColor, lineHeight: 1.65, marginBottom: '20px' }}>
                GateLink enforces strict role-based access control (RBAC). Each user operates within scoped permission boundaries based on their verified identity:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div style={{ padding: '16px', borderRadius: '10px', border: `1px solid ${borderColor}` }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#0EA5E9', textTransform: 'uppercase' }}>RESIDENT</span>
                  <p style={{ fontSize: '13px', color: subTextColor, margin: '4px 0 0 0', lineHeight: 1.45 }}>Access restricted to flat information, visitor invites, maintenance bills, and personal complaints.</p>
                </div>
                <div style={{ padding: '16px', borderRadius: '10px', border: `1px solid ${borderColor}` }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#0EA5E9', textTransform: 'uppercase' }}>SECURITY GUARD</span>
                  <p style={{ fontSize: '13px', color: subTextColor, margin: '4px 0 0 0', lineHeight: 1.45 }}>Scoped to gate visitor entry/exit logs, passcode validation, and panic alert triggers.</p>
                </div>
                <div style={{ padding: '16px', borderRadius: '10px', border: `1px solid ${borderColor}` }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#0EA5E9', textTransform: 'uppercase' }}>SOCIETY ADMIN</span>
                  <p style={{ fontSize: '13px', color: subTextColor, margin: '4px 0 0 0', lineHeight: 1.45 }}>Scoped strictly to single-society management (resident approvals, staff, maintenance billing).</p>
                </div>
                <div style={{ padding: '16px', borderRadius: '10px', border: `1px solid ${borderColor}` }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#0EA5E9', textTransform: 'uppercase' }}>SUPER ADMIN</span>
                  <p style={{ fontSize: '13px', color: subTextColor, margin: '4px 0 0 0', lineHeight: 1.45 }}>Protected platform oversight tier for society provisioning, CRM management, and partner payouts.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Card 3: 🏢 Multi-Tenant Data Isolation */}
          <section style={{ marginBottom: '32px' }}>
            <div style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <Building size={24} color="#059669" />
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: textColor, margin: 0 }}>🏢 Multi-Tenant Data Isolation</h2>
                <div style={{ marginLeft: 'auto' }}>{statusBadge('verified')}</div>
              </div>
              <p style={{ fontSize: '15px', color: subTextColor, lineHeight: 1.65, margin: 0 }}>
                Every housing society operates within an isolated data partition. Server-enforced checks ensure that residents, security guards, and administrators can only view data belonging strictly to their assigned society.
              </p>
            </div>
          </section>

          {/* Card 4: 🔏 Privacy & Data Protection */}
          <section style={{ marginBottom: '32px' }}>
            <div style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <FileText size={24} color="#0EA5E9" />
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: textColor, margin: 0 }}>🔏 Privacy & Data Protection</h2>
                <div style={{ marginLeft: 'auto' }}>{statusBadge('verified')}</div>
              </div>
              <p style={{ fontSize: '15px', color: subTextColor, lineHeight: 1.65, marginBottom: '18px' }}>
                GateLink is designed with India's Digital Personal Data Protection (DPDP) Act 2023 requirements in mind, including explicit consent, privacy documentation and an account deletion request process.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to="/privacy" style={{ color: '#0EA5E9', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>Privacy Policy →</Link>
                <Link to="/terms" style={{ color: '#0EA5E9', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>Terms of Service →</Link>
                <a href="mailto:support@gatelink.in" style={{ color: subTextColor, fontSize: '14px', textDecoration: 'none' }}>Data Protection Contact: support@gatelink.in</a>
              </div>
            </div>
          </section>

          {/* Card 5: 💳 Payment Security */}
          <section style={{ marginBottom: '32px' }}>
            <div style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <CreditCard size={24} color="#F59E0B" />
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: textColor, margin: 0 }}>💳 Payment Security</h2>
                <div style={{ marginLeft: 'auto' }}>{statusBadge('verified')}</div>
              </div>
              <p style={{ fontSize: '15px', color: subTextColor, lineHeight: 1.65, marginBottom: '16px' }}>
                GateLink uses server-authoritative financial billing workflows. Official maintenance bill amounts are calculated directly from verified database records; client-side payment amounts are never trusted. Webhook payment signatures are cryptographically verified before ledger updates.
              </p>
              <div style={{ padding: '14px 18px', borderRadius: '10px', backgroundColor: isDark ? '#332E1E' : '#FEF3C7', border: '1px solid #F59E0B' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#FDE68A' : '#92400E', margin: 0 }}>
                  🟡 Production activation pending: Cashfree production merchant account activation is currently pending final deployment.
                </p>
              </div>
            </div>
          </section>

          {/* Card 6: 💾 Reliability & Backup */}
          <section style={{ marginBottom: '32px' }}>
            <div style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <CloudUpload size={24} color="#0EA5E9" />
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: textColor, margin: 0 }}>💾 Reliability & Backup</h2>
                <div style={{ marginLeft: 'auto' }}>{statusBadge('pending')}</div>
              </div>
              <p style={{ fontSize: '15px', color: subTextColor, lineHeight: 1.65, marginBottom: '16px' }}>
                GateLink's automated database backup and disaster recovery architecture has been fully implemented and validated at the code level to ensure data durability and system recovery.
              </p>
              <div style={{ padding: '14px 18px', borderRadius: '10px', backgroundColor: isDark ? '#332E1E' : '#FEF3C7', border: '1px solid #F59E0B' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#FDE68A' : '#92400E', margin: 0 }}>
                  🟡 Production activation pending: Automated cloud backup execution is pending final cloud infrastructure activation.
                </p>
              </div>
            </div>
          </section>

          {/* Third-Party Certification Disclaimer */}
          <div style={{ padding: '16px 20px', borderRadius: '12px', backgroundColor: isDark ? '#1E293B' : '#F1F5F9', border: `1px solid ${borderColor}`, marginBottom: '40px' }}>
            <p style={{ fontSize: '13px', color: subTextColor, margin: 0, lineHeight: 1.5, textAlign: 'center' }}>
              ℹ️ <em>Internal engineering verification is performed as part of GateLink's continuous development process and is not a substitute for independent third-party certification or VAPT.</em>
            </p>
          </div>

          {/* Security Contact / Responsible Disclosure */}
          <section style={{ textAlign: 'center', padding: '36px', background: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}` }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: textColor, marginBottom: '10px' }}>Security Questions & Responsible Disclosure</h2>
            <p style={{ fontSize: '15px', color: subTextColor, marginBottom: '20px' }}>
              Have a security question or vulnerability report? Our team responds promptly to security inquiries.
            </p>
            <a
              href="mailto:support@gatelink.in"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '10px',
                backgroundColor: '#1E3A8A',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none'
              }}
            >
              <Mail size={16} /> Contact Security Team (support@gatelink.in)
            </a>
          </section>

        </div>
      </main>

      <FooterSection />
      {isDemoModalOpen && <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />}
    </div>
  );
}
