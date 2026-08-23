import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, FileText, DollarSign, Receipt, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';

export default function MaintenanceManagementLanding() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "GateLink Society Maintenance & Billing Software",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web, Android, iOS",
    "url": "https://gatelink.in/maintenance-management",
    "description": "Automated maintenance billing software for housing societies and RWAs in India. Online UPI and Card payments, GST invoice generation, and ledger accounting.",
    "author": {
      "@type": "Organization",
      "name": "GateLink Technologies Private Limited",
      "url": "https://gatelink.in"
    }
  };

  return (
    <div style={{ background: isDark ? '#020617' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SeoHead 
        title="Society Maintenance Billing & Accounting Software | GateLink" 
        description="GateLink automates housing society maintenance billing, UPI/Card online payments via Cashfree, automated WhatsApp receipts, GST invoice calculations, and default tracking."
        canonicalUrl="https://gatelink.in/maintenance-management"
        schemaData={schemaData}
      />

      <Navbar />

      <header style={{ paddingTop: '130px', paddingBottom: '70px', background: isDark ? 'linear-gradient(180deg, #0F172A 0%, #020617 100%)' : 'linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%)', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10B981', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
            <CreditCard size={14} /> Automated Cashfree Gateway Integration
          </div>

          <h1 style={{ fontSize: '42px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', lineHeight: 1.18, marginBottom: '20px', maxWidth: '900px', margin: '0 auto 20px auto' }}>
            Automated Society Maintenance Billing & Financial Ledger Accounting
          </h1>

          <p style={{ fontSize: '17px', color: isDark ? '#94A3B8' : '#475569', maxWidth: '780px', margin: '0 auto 32px auto', lineHeight: 1.65 }}>
            Say goodbye to late payments and manual receipt books. Generate automated monthly maintenance bills, collect digital payments via UPI/Card, and access real-time financial audit reports.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/contact" 
              style={{ padding: '14px 28px', borderRadius: '12px', background: '#1E3A8A', color: '#FFFFFF', textDecoration: 'none', fontWeight: 800, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 6px 20px rgba(30, 58, 138, 0.35)' }}
            >
              <span>Get Billing Demo</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: '60px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '50px' }}>
            <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
              <Receipt size={28} color="#10B981" style={{ marginBottom: '14px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>Instant Digital Receipts</h3>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                As soon as a resident pays via UPI, Net Banking, or Credit Card, GateLink issues an instant GST-compliant PDF payment receipt via WhatsApp and email.
              </p>
            </div>

            <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
              <CreditCard size={28} color="#10B981" style={{ marginBottom: '14px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>Direct RWA Bank Settlement</h3>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                Maintenance collections settle directly into your housing society's official bank account with automated ledger entries and zero manual reconciliation.
              </p>
            </div>

            <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
              <FileText size={28} color="#10B981" style={{ marginBottom: '14px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>Audit-Ready Financial Reports</h3>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                Export monthly income vs. expense statements, defaulter list reports, and GST summaries in Excel/PDF format for annual RWA general body audits.
              </p>
            </div>
          </div>

        </div>
      </main>

      <FooterSection />
    </div>
  );
}
