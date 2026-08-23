import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Smartphone, AlertTriangle, UserX, ArrowRight, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';

export default function SecurityManagementLanding() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "GateLink Apartment Security & Guard App",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web, Android, iOS",
    "url": "https://gatelink.in/security-management",
    "description": "Smart gate security and guard management system for residential complexes and gated communities. Instant SOS alerts, guard patrol tracking, and blacklisted entry alerts.",
    "author": {
      "@type": "Organization",
      "name": "GateLink Technologies Private Limited",
      "url": "https://gatelink.in"
    }
  };

  return (
    <div style={{ background: isDark ? '#020617' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SeoHead 
        title="Apartment Security Management & Guard App | GateLink" 
        description="GateLink Guard App empowers security guards with instant visitor verification, blacklisted entry alerts, emergency SOS panic buttons, and main gate access control."
        canonicalUrl="https://gatelink.in/security-management"
        schemaData={schemaData}
      />

      <Navbar />

      <header style={{ paddingTop: '130px', paddingBottom: '70px', background: isDark ? 'linear-gradient(180deg, #0F172A 0%, #020617 100%)' : 'linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%)', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
            <ShieldCheck size={14} /> Multi-Layer Main Gate Protection
          </div>

          <h1 style={{ fontSize: '42px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', lineHeight: 1.18, marginBottom: '20px', maxWidth: '900px', margin: '0 auto 20px auto' }}>
            Apartment Security Management & Gate Guard Automation System
          </h1>

          <p style={{ fontSize: '17px', color: isDark ? '#94A3B8' : '#475569', maxWidth: '780px', margin: '0 auto 32px auto', lineHeight: 1.65 }}>
            Empower your gate security guards with an intuitive Android/iOS mobile application. Instant visitor verification, blacklisted individual alerts, and one-touch emergency SOS panic buttons.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/contact" 
              style={{ padding: '14px 28px', borderRadius: '12px', background: '#1E3A8A', color: '#FFFFFF', textDecoration: 'none', fontWeight: 800, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 6px 20px rgba(30, 58, 138, 0.35)' }}
            >
              <span>Get Security Proposal</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: '60px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '50px' }}>
            <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
              <AlertTriangle size={28} color="#EF4444" style={{ marginBottom: '14px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>One-Touch Emergency SOS</h3>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                In case of medical emergencies, lift breakdown, or fire incidents, residents or guards can trigger instant siren alerts to all guards and RWA committee members.
              </p>
            </div>

            <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
              <UserX size={28} color="#EF4444" style={{ marginBottom: '14px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>Blacklisted Entry Warning</h3>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                Prevent unauthorized or previously evicted personnel from entering the complex with automatic guard app phone number lookup warnings.
              </p>
            </div>

            <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
              <Smartphone size={28} color="#EF4444" style={{ marginBottom: '14px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>Multi-Lingual Guard App UI</h3>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                Designed for extreme ease of use in English, Hindi, Telugu, and regional languages with large touch buttons for fast gate processing.
              </p>
            </div>
          </div>

          {/* Internal Cross-Linking Section */}
          <section style={{ background: isDark ? '#0F172A' : '#EFF6FF', padding: '32px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #DBEAFE' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '12px' }}>Related GateLink Solutions</h3>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <Link to="/visitor-management" style={{ color: '#EF4444', fontWeight: 700, textDecoration: 'none' }}>
                → Visitor Management System
              </Link>
              <Link to="/society-management-software" style={{ color: '#EF4444', fontWeight: 700, textDecoration: 'none' }}>
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
