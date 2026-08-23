import React from 'react';
import { motion } from 'framer-motion';
import { Building2, ShieldCheck, CreditCard, Users, ArrowRight, CheckCircle2, FileText, Bell, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';

export default function SocietyManagementLanding() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "GateLink Society Management Software",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web, Android, iOS",
    "url": "https://gatelink.in/society-management-software",
    "description": "Complete society management software for housing societies and RWAs in India. Automate maintenance billing, resident registry, visitor entry, and gate security.",
    "author": {
      "@type": "Organization",
      "name": "GateLink Technologies Private Limited",
      "url": "https://gatelink.in"
    }
  };

  return (
    <div style={{ background: isDark ? '#020617' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SeoHead 
        title="Society Management Software for Housing Societies & RWAs | GateLink" 
        description="GateLink is India’s leading society management software. Streamline RWA administration, maintenance billing collections, resident registries, visitor entry, and gate security."
        canonicalUrl="https://gatelink.in/society-management-software"
        schemaData={schemaData}
      />

      <Navbar />

      {/* Hero Section */}
      <header style={{ paddingTop: '130px', paddingBottom: '70px', background: isDark ? 'linear-gradient(180deg, #0F172A 0%, #020617 100%)' : 'linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%)', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(30, 58, 138, 0.12)', border: '1px solid rgba(30, 58, 138, 0.3)', color: '#0EA5E9', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
            <Sparkles size={14} /> Enterprise RWA Operating System
          </div>

          <h1 style={{ fontSize: '42px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', lineHeight: 1.18, marginBottom: '20px', maxWidth: '900px', margin: '0 auto 20px auto' }}>
            Smart Society Management Software for Housing Societies & RWAs
          </h1>

          <p style={{ fontSize: '17px', color: isDark ? '#94A3B8' : '#475569', maxWidth: '780px', margin: '0 auto 32px auto', lineHeight: 1.65 }}>
            Transform your Resident Welfare Association (RWA) operations with an integrated digital platform. Manage maintenance billing, visitor entry verification, resident registries, staff payroll, and facility bookings seamlessly.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/contact" 
              style={{ padding: '14px 28px', borderRadius: '12px', background: '#1E3A8A', color: '#FFFFFF', textDecoration: 'none', fontWeight: 800, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 6px 20px rgba(30, 58, 138, 0.35)' }}
            >
              <span>Get Free Society Proposal</span>
              <ArrowRight size={18} />
            </Link>

            <Link 
              to="/features" 
              style={{ padding: '14px 28px', borderRadius: '12px', background: isDark ? '#1E293B' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#0F172A', textDecoration: 'none', fontWeight: 700, fontSize: '15px', border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #CBD5E1' }}
            >
              Explore All Features
            </Link>
          </div>
        </div>
      </header>

      {/* Main Feature Sections */}
      <main style={{ flex: 1, padding: '60px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Section 1: Core Modules */}
          <section style={{ marginBottom: '60px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '30px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '12px' }}>
                Complete Digital Control for RWA Management Committees
              </h2>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
                Replace manual paper registers, disjointed accounting spreadsheets, and messy WhatsApp groups with a single secure dashboard.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <Building2 size={28} color="#0EA5E9" style={{ marginBottom: '14px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>Resident & Flat Directory</h3>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                  Maintain an updated database of flat owners, tenant move-ins, parking slot assignments, and emergency contact details with role-based privacy controls.
                </p>
              </div>

              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <CreditCard size={28} color="#0EA5E9" style={{ marginBottom: '14px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>Automated Maintenance Billing</h3>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                  Generate monthly maintenance invoices, accept online UPI/card payments via Cashfree, send instant WhatsApp receipts, and track defaulters automatically.
                </p>
              </div>

              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <ShieldCheck size={28} color="#0EA5E9" style={{ marginBottom: '14px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>Gate Guard Access Control</h3>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                  Equip main gate security guards with a tablet/mobile app to verify guest entry, scan delivery QR passes, and trigger real-time resident approval calls.
                </p>
              </div>
            </div>
          </section>

          {/* Internal Cross-Linking Section */}
          <section style={{ background: isDark ? '#0F172A' : '#EFF6FF', padding: '36px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #DBEAFE', marginTop: '40px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '16px' }}>Explore Specialized Modules</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <Link to="/visitor-management" style={{ color: '#0EA5E9', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                → Visitor Management System
              </Link>
              <Link to="/maintenance-management" style={{ color: '#0EA5E9', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                → Maintenance & Billing System
              </Link>
              <Link to="/security-management" style={{ color: '#0EA5E9', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                → Guard & Security System
              </Link>
            </div>
          </section>

        </div>
      </main>

      <FooterSection />
    </div>
  );
}
