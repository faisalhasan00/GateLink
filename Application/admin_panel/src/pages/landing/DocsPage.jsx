import React from 'react';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';
import { Code, Terminal, Cpu, Shield, Key, Layers } from 'lucide-react';

export default function DocsPage() {
  return (
    <div style={{ backgroundColor: '#020617', color: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <SeoHead
        title="Developer & Admin Documentation - SocietySphere APIs"
        description="Comprehensive developer documentation for SocietySphere REST APIs, Webhooks, Razorpay Payment Gateway, and RBAC matrix schema."
        canonicalUrl="https://societysphere.com/docs"
      />

      <Navbar onOpenDemo={() => {}} />

      <section style={{ paddingTop: '160px', paddingBottom: '40px', background: 'radial-gradient(circle at 50% 20%, #1E1B4B 0%, #0F172A 70%, #020617 100%)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', fontSize: '13px', fontWeight: 800, marginBottom: '16px' }}>
            <Code size={14} /> DEVELOPER & ADMIN API SPECIFICATION
          </div>
          <h1 style={{ fontSize: '44px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1.5px', margin: '0 0 12px 0' }}>
            SocietySphere Documentation
          </h1>
          <p style={{ fontSize: '16px', color: '#94A3B8', maxWidth: '650px' }}>
            REST API endpoints, webhook telemetry events, authentication headers, and role-based matrix schemas.
          </p>
        </div>
      </section>

      <section style={{ padding: '40px 0 100px 0', background: '#020617' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '40px' }}>
          
          {/* Left Docs Nav */}
          <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', height: 'fit-content' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, color: '#818CF8', letterSpacing: '1px', marginBottom: '12px' }}>DOCS NAVIGATION</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#CBD5E1', fontWeight: 600 }}>
              <a href="#auth" style={{ color: '#818CF8', textDecoration: 'none' }}>1. Authentication & Bearer Tokens</a>
              <a href="#gate-api" style={{ color: '#CBD5E1', textDecoration: 'none' }}>2. Gate Pass & QR Verification API</a>
              <a href="#razorpay" style={{ color: '#CBD5E1', textDecoration: 'none' }}>3. Razorpay Webhooks & Invoicing</a>
              <a href="#rbac" style={{ color: '#CBD5E1', textDecoration: 'none' }}>4. RBAC Permission Matrix</a>
            </div>
          </div>

          {/* Right Docs Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* Section 1 */}
            <div id="auth" style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '32px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', marginBottom: '12px' }}>1. Authentication & Bearer Tokens</h2>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '16px' }}>
                All API requests require a HTTP Authorization Bearer token header obtained via Firebase Auth ID Token exchange.
              </p>
              <div style={{ background: '#090D16', padding: '16px', borderRadius: '12px', fontFamily: 'monospace', color: '#34D399', fontSize: '13px' }}>
                Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6...
              </div>
            </div>

            {/* Section 2 */}
            <div id="gate-api" style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '32px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', marginBottom: '12px' }}>2. Gate Pass & QR Verification API</h2>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '16px' }}>
                Verify a visitor pass token scanned by security guards at the entry gate.
              </p>
              <div style={{ background: '#090D16', padding: '16px', borderRadius: '12px', fontFamily: 'monospace', color: '#818CF8', fontSize: '13px', marginBottom: '12px' }}>
                POST /api/v1/gate/verify-passcode
              </div>
              <div style={{ background: '#090D16', padding: '16px', borderRadius: '12px', fontFamily: 'monospace', color: '#CBD5E1', fontSize: '12px' }}>
                {`{\n  "passcode": "8492",\n  "gateId": "GATE_01",\n  "guardId": "GUARD_9012"\n}`}
              </div>
            </div>

          </div>

        </div>
      </section>

      <FooterSection />
    </div>
  );
}
