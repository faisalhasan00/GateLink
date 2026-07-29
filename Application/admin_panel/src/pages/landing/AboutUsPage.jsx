import React, { useState } from 'react';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import { ShieldCheck, Globe, Users, Building, CheckCircle2, Award, HeartHandshake, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function AboutUsPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const pillars = [
    {
      icon: <ShieldCheck size={28} color="#00B589" />,
      title: 'ISO 27001 & PCI DSS Security',
      desc: 'Bank-grade encryption protecting resident contact data, visitor photo logs, and automated online maintenance transactions.'
    },
    {
      icon: <Award size={28} color="#00B589" />,
      title: '99.9% Gatekeeper Uptime',
      desc: 'High-speed offline-first guard app built for uninterrupted gate operations even in weak cellular signal areas.'
    },
    {
      icon: <HeartHandshake size={28} color="#00B589" />,
      title: 'Dedicated Society Onboarding',
      desc: 'On-site security guard training in local languages, flat owner data migration from Excel, and 24/7 helpline support.'
    }
  ];

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Sticky Header */}
      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      {/* Main Container */}
      <main style={{ paddingTop: '110px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Header Banner */}
          <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 60px auto' }}>
            <span style={{ fontSize: '12px', fontWeight: 900, color: '#00B589', letterSpacing: '1px', textTransform: 'uppercase' }}>
              ABOUT SOCIETYYSPHERE
            </span>
            <h1 style={{ fontSize: '42px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-1px', margin: '12px 0 16px 0', lineHeight: 1.15 }}>
              Pioneering Gated Community & Gatekeeper Security OS
            </h1>
            <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#555555', lineHeight: 1.6, margin: 0 }}>
              SocietySphere is designed to simplify daily apartment living, replace paper gate registers, eliminate payment chasing, and protect housing societies across India and UAE.
            </p>
          </div>

          {/* Mission & Vision Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '70px' }}>
            <div style={{
              background: isDark ? '#1E293B' : '#FFFFFF',
              borderRadius: '4px',
              padding: '36px',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building size={22} color="#00B589" />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: 0 }}>Our Mission</h2>
              </div>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.65, margin: 0 }}>
                To empower residents, security guards, and society management committees with simple, intelligent, and affordable digital tools that guarantee safety, transparency, and effortless daily operations.
              </p>
            </div>

            <div style={{
              background: isDark ? '#1E293B' : '#FFFFFF',
              borderRadius: '4px',
              padding: '36px',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={22} color="#00B589" />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: 0 }}>Our Vision</h2>
              </div>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.65, margin: 0 }}>
                To become the most trusted security and administrative operating system for over 100,000+ residential townships, gated communities, and commercial complexes globally.
              </p>
            </div>
          </div>

          {/* Three Company Pillars Grid */}
          <div style={{ marginBottom: '70px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', textAlign: 'center', marginBottom: '40px' }}>
              Why Housing Societies Trust SocietySphere
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
              {pillars.map((p) => (
                <div key={p.title} style={{
                  background: isDark ? '#1E293B' : '#FFFFFF',
                  borderRadius: '4px',
                  padding: '30px',
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                }}>
                  <div style={{ marginBottom: '16px' }}>{p.icon}</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginBottom: '10px' }}>{p.title}</h3>
                  <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action Banner */}
          <div style={{
            background: isDark ? '#1E293B' : '#F8FAFC',
            borderRadius: '4px',
            padding: '40px',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <h3 style={{ fontSize: '26px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginBottom: '12px' }}>
              Ready to Enroll Your Housing Society?
            </h3>
            <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#666666', marginBottom: '24px' }}>
              Get a customized onboarding proposal, 14-day free trial, and full data migration support.
            </p>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              style={{
                padding: '12px 28px',
                borderRadius: '2px',
                backgroundColor: '#00B589',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Enroll your society</span>
              <ArrowRight size={16} />
            </button>
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
