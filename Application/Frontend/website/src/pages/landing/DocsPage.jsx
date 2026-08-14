import React, { useState } from 'react';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import SeoHead from '../../components/seo/SeoHead';
import { Code, Terminal, Shield, Key, Layers, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function DocsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Dynamic SEO Head */}
      <SeoHead
        title="Developer & Admin API Docs - GateLink"
        description="Comprehensive developer documentation for GateLink REST APIs, Gate Pass Webhooks, Online Payment Gateway, and RBAC matrix schema."
        canonicalUrl="https://gatelink.in/docs"
      />

      {/* Navbar */}
      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      {/* Header Banner */}
      <section style={{
        paddingTop: '120px',
        paddingBottom: '40px',
        background: isDark ? '#0F172A' : '#FFFFFF',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px' }}>
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#00B589', textTransform: 'uppercase', letterSpacing: '1px' }}>
            DEVELOPER & ADMIN API SPECIFICATION
          </span>
          <h1 style={{ fontSize: '40px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-1px', margin: '10px 0 16px 0' }}>
            GateLink Developer Documentation
          </h1>
          <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#555555', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
            REST API endpoints, webhook telemetry events, authentication headers, and role-based access matrix schemas.
          </p>
        </div>
      </section>

      {/* Main Workspace */}
      <section style={{ padding: '60px 0 100px 0' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '40px' }}>
          
          {/* Left Docs Nav */}
          <div style={{ background: isDark ? '#1E293B' : '#F8FAFC', padding: '24px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB', height: 'fit-content' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, color: '#00B589', letterSpacing: '1px', marginBottom: '16px' }}>DOCS NAVIGATION</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: isDark ? '#CBD5E1' : '#444444', fontWeight: 700 }}>
              <a href="#auth" style={{ color: '#00B589', textDecoration: 'none' }}>1. Authentication & Bearer Tokens</a>
              <a href="#gate-api" style={{ color: isDark ? '#94A3B8' : '#555555', textDecoration: 'none' }}>2. Gate Pass & QR Verification API</a>
              <a href="#billing-api" style={{ color: isDark ? '#94A3B8' : '#555555', textDecoration: 'none' }}>3. Online Payment Webhooks & Invoicing</a>
              <a href="#rbac" style={{ color: isDark ? '#94A3B8' : '#555555', textDecoration: 'none' }}>4. RBAC Permission Matrix</a>
            </div>
          </div>

          {/* Right Docs Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Section 1 */}
            <div id="auth" style={{ background: isDark ? '#1E293B' : '#FFFFFF', padding: '32px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginBottom: '12px' }}>1. Authentication & Bearer Tokens</h2>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.6, marginBottom: '16px' }}>
                All API requests require an HTTP Authorization Bearer token header obtained via Firebase Auth ID Token exchange.
              </p>
              <div style={{ background: isDark ? '#0F172A' : '#F1F5F9', padding: '16px', borderRadius: '4px', fontFamily: 'monospace', color: '#00B589', fontSize: '13px', fontWeight: 700 }}>
                Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6...
              </div>
            </div>

            {/* Section 2 */}
            <div id="gate-api" style={{ background: isDark ? '#1E293B' : '#FFFFFF', padding: '32px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginBottom: '12px' }}>2. Gate Pass & QR Verification API</h2>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.6, marginBottom: '16px' }}>
                Verify a visitor pass token scanned by security guards at the entry gate.
              </p>
              <div style={{ background: isDark ? '#0F172A' : '#F1F5F9', padding: '16px', borderRadius: '4px', fontFamily: 'monospace', color: '#00B589', fontSize: '13px', marginBottom: '12px', fontWeight: 700 }}>
                POST /api/v1/gate/verify-passcode
              </div>
              <div style={{ background: isDark ? '#0F172A' : '#F1F5F9', padding: '16px', borderRadius: '4px', fontFamily: 'monospace', color: isDark ? '#E2E8F0' : '#333333', fontSize: '13px' }}>
                {`{\n  "passcode": "8492",\n  "gateId": "GATE_01",\n  "guardId": "GUARD_9012"\n}`}
              </div>
            </div>

            {/* Section 3 */}
            <div id="billing-api" style={{ background: isDark ? '#1E293B' : '#FFFFFF', padding: '32px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginBottom: '12px' }}>3. Online Payment Webhooks & Invoicing</h2>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.6, marginBottom: '16px' }}>
                Listen for real-time payment webhook events when residents complete maintenance billing payments online.
              </p>
              <div style={{ background: isDark ? '#0F172A' : '#F1F5F9', padding: '16px', borderRadius: '4px', fontFamily: 'monospace', color: '#00B589', fontSize: '13px', fontWeight: 700 }}>
                POST /api/v1/webhooks/payment-captured
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <FooterSection />

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
