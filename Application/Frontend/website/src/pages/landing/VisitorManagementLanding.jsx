import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, QrCode, Smartphone, BellRing, ArrowRight, CheckCircle2, UserCheck, Lock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';

export default function VisitorManagementLanding() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "GateLink Visitor Management System",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web, Android, iOS",
    "url": "https://gatelink.in/visitor-management",
    "description": "Digital visitor management system for apartment societies and gated communities in India. Pre-approve guests, track delivery personnel, and verify entry with QR passes.",
    "author": {
      "@type": "Organization",
      "name": "GateLink Technologies Private Limited",
      "url": "https://gatelink.in"
    }
  };

  return (
    <div style={{ background: isDark ? '#020617' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SeoHead 
        title="Visitor Management System for Housing Societies & Apartments | GateLink" 
        description="GateLink Visitor Management System replaces manual paper registers with digital QR passes, real-time resident approval notifications, delivery staff tracking, and gate security automation."
        canonicalUrl="https://gatelink.in/visitor-management"
        schemaData={schemaData}
      />

      <Navbar />

      <header style={{ paddingTop: '130px', paddingBottom: '70px', background: isDark ? 'linear-gradient(180deg, #0F172A 0%, #020617 100%)' : 'linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%)', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(14, 165, 233, 0.12)', border: '1px solid rgba(14, 165, 233, 0.3)', color: '#0EA5E9', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
            <QrCode size={14} /> Intelligent Gate Pass & Entry Verification
          </div>

          <h1 style={{ fontSize: '42px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', lineHeight: 1.18, marginBottom: '20px', maxWidth: '900px', margin: '0 auto 20px auto' }}>
            Smart Visitor Management System for Housing Societies & Apartments
          </h1>

          <p style={{ fontSize: '17px', color: isDark ? '#94A3B8' : '#475569', maxWidth: '780px', margin: '0 auto 32px auto', lineHeight: 1.65 }}>
            Eliminate unsafe paper entry registers. Pre-approve expected guests, generate instant QR gate passes, track daily service staff (maids, drivers), and receive instant push notifications on your phone.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/contact" 
              style={{ padding: '14px 28px', borderRadius: '12px', background: '#1E3A8A', color: '#FFFFFF', textDecoration: 'none', fontWeight: 800, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 6px 20px rgba(30, 58, 138, 0.35)' }}
            >
              <span>Book Visitor Demo</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: '60px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '50px' }}>
            <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
              <BellRing size={28} color="#0EA5E9" style={{ marginBottom: '14px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>Instant Resident Approval Call</h3>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                When an unannounced guest arrives at the gate, guards trigger an instant mobile notification/call to the resident flat owner before allowing entry.
              </p>
            </div>

            <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
              <QrCode size={28} color="#0EA5E9" style={{ marginBottom: '14px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>Pre-Approved QR Invite Passes</h3>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                Residents can share digital QR passes with party guests, family members, and cab drivers via WhatsApp for seamless, zero-wait gate entry.
              </p>
            </div>

            <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
              <UserCheck size={28} color="#0EA5E9" style={{ marginBottom: '14px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>Daily Staff Attendance & Logs</h3>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                Track entry and exit timestamps for domestic help, cooks, drivers, and maintenance staff with real-time resident alert notifications.
              </p>
            </div>
          </div>

          {/* Internal Cross-Linking Section */}
          <section style={{ background: isDark ? '#0F172A' : '#EFF6FF', padding: '32px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #DBEAFE' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '12px' }}>Related GateLink Solutions</h3>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <Link to="/security-management" style={{ color: '#0EA5E9', fontWeight: 700, textDecoration: 'none' }}>
                → Apartment Security & Guard System
              </Link>
              <Link to="/society-management-software" style={{ color: '#0EA5E9', fontWeight: 700, textDecoration: 'none' }}>
                → Society Management Software OS
              </Link>
            </div>
          </section>

        </div>
      </main>

      <FooterSection />
    </div>
  );
}
