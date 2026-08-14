import React, { useState } from 'react';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import SeoHead from '../../components/seo/SeoHead';
import { FileText, ShieldCheck, CheckCircle2, Scale } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function TermsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Dynamic SEO Head */}
      <SeoHead
        title="Terms of Service & SaaS Agreement - GateLink"
        description="GateLink Terms of Service detailing society onboarding licenses, 99.9% uptime SLA, user obligations, and payment terms."
        canonicalUrl="https://gatelink.in/terms"
      />

      {/* Navbar */}
      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      {/* Main Content */}
      <main style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              <Scale size={16} /> LEGAL & SERVICE AGREEMENT
            </div>
            <h1 style={{ fontSize: '38px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-0.5px', marginBottom: '12px' }}>
              Terms of Service & Licensing Terms
            </h1>
            <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#666666', margin: 0 }}>
              Last updated: July 2026 • Enterprise SaaS Agreement
            </p>
          </div>

          {/* Terms Content Card */}
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
              Welcome to <strong>GateLink</strong>. By registering your housing society, subscribing to our management services, or downloading our Resident App and Guard App, your Resident Welfare Association (RWA) or Management Committee agrees to be bound by these Terms of Service.
            </p>

            <h3 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginTop: '32px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#0EA5E9" /> 1. SaaS License & Platform Access
            </h3>
            <p>
              GateLink grants your housing society a non-exclusive, non-transferable subscription license to access our cloud-based society management software, security gatekeeper apps, and payment reconciliation engines.
            </p>

            <h3 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginTop: '32px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#0EA5E9" /> 2. 99.9% Uptime SLA & Gate Security Guarantee
            </h3>
            <p>
              We guarantee a <strong>99.9% uptime SLA</strong> for core gatekeeper services, emergency SOS alerts, and resident approval channels. In the event of temporary internet outages at security gates, the Guard App operates seamlessly offline to ensure continuous entry logging.
            </p>

            <h3 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginTop: '32px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#0EA5E9" /> 3. Resident & Committee Responsibilities
            </h3>
            <p>
              Committees are responsible for maintaining accurate flat owner rosters and role-based admin access privileges. Residents agree to provide accurate guest pass details and adhere to society bylaws when utilizing clubhouse amenity bookings.
            </p>

            <h3 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginTop: '32px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Scale size={18} color="#0EA5E9" /> 4. Payment Gateway & Invoicing Terms
            </h3>
            <p>
              Online maintenance bill payments processed via integrated payment gateways are deposited directly into the society's registered bank account. Transaction fees and GST invoicing details are generated automatically in compliance with Indian banking laws.
            </p>

            <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB', fontSize: '13px', color: isDark ? '#94A3B8' : '#666666' }}>
              For legal inquiries or enterprise agreement terms, contact legal@gatelink.in
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
