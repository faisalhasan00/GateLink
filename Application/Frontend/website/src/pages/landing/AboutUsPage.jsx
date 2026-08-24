import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import SeoHead from '../../components/seo/SeoHead';
import {
  ShieldCheck,
  Building,
  Users,
  Smartphone,
  Server,
  Layers,
  HeartHandshake,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function AboutUsPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB';
  const textColor = isDark ? '#FFFFFF' : '#1E293B';
  const subTextColor = isDark ? '#94A3B8' : '#64748B';

  const ecosystemCards = [
    {
      title: 'Resident Mobile App',
      role: 'Residents & Owners',
      desc: 'Instant visitor pre-approvals, digital passcodes, maintenance bill payments, complaint tracking, and panic SOS alerts.',
      icon: <Smartphone size={24} color="#0EA5E9" />
    },
    {
      title: 'Guard Gatekeeper App',
      role: 'Security Guards & Gatekeepers',
      desc: 'High-speed QR passcode scanning, quick entry logs for deliveries and cabs, vehicle validation, and panic broadcast alerts.',
      icon: <ShieldCheck size={24} color="#059669" />
    },
    {
      title: 'Society Admin Dashboard',
      role: 'Management Committee & Admins',
      desc: 'Tenant-isolated management of residents, flats, staff creation, maintenance billing, offline payment approvals, and notices.',
      icon: <Building size={24} color="#1E3A8A" />
    },
    {
      title: 'Super Admin Portal',
      role: 'Platform Operators',
      desc: 'Platform-wide society onboarding, CRM lead management, CMS article publication, system metrics, and partner payouts.',
      icon: <Server size={24} color="#8B5CF6" />
    },
    {
      title: 'Public SaaS Website',
      role: 'Prospective Societies & Partners',
      desc: 'Public product information, feature breakdowns, partner lead generation, help documentation, and Security Center transparency.',
      icon: <Layers size={24} color="#F59E0B" />
    }
  ];

  const approaches = [
    { title: 'Security by Design', desc: 'Server-side authorization, immutable audit trails, and strict role-based control across all APIs.' },
    { title: 'Privacy & DPDP Focus', desc: 'Explicit consent, clear data retention policies, and accessible account deletion request flows.' },
    { title: 'Multi-Tenant Isolation', desc: 'Database subcollections strictly partitioned by society ID to guarantee zero data bleeding.' },
    { title: 'Practical Automation', desc: 'Simplifying gate check-ins, automated billing, and instant push notification broadcasts.' },
    { title: 'Reliable Community Operations', desc: 'Offline-ready gate app flows to handle intermittent cellular connectivity without disruptions.' },
    { title: 'Transparent Engineering', desc: 'Clear public communication of platform capabilities, security architecture, and deployment status.' }
  ];

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <SeoHead
        title="About GateLink | Gated Community Management Operating System"
        description="Learn about GateLink, our founder leadership, mission and the platform we're building for residents, security teams and gated communities."
        canonicalUrl="https://gatelink.in/about"
      />

      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      <main style={{ paddingTop: '110px', paddingBottom: '90px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

          {/* Hero Banner */}
          <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 60px auto' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#0EA5E9', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>
              ABOUT GATELINK
            </span>
            <h1 style={{ fontSize: '40px', fontWeight: 900, color: textColor, letterSpacing: '-1px', margin: '0 0 16px 0', lineHeight: 1.15 }}>
              Building a smarter way to manage gated communities.
            </h1>
            <p style={{ fontSize: '17px', color: subTextColor, lineHeight: 1.6, margin: 0 }}>
              GateLink is a gated-community management platform connecting residents, security teams, society administrators and platform operators through one unified ecosystem.
            </p>
          </div>

          {/* Section A: Mission */}
          <section style={{ marginBottom: '60px' }}>
            <div style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, padding: '40px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: isDark ? '#1E3A8A' : '#E0F2FE', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <HeartHandshake size={26} color="#0EA5E9" />
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: 900, color: textColor, marginBottom: '12px' }}>Our Mission</h2>
              <p style={{ fontSize: '17px', color: subTextColor, maxWidth: '780px', margin: '0 auto', lineHeight: 1.65 }}>
                Make gated-community operations simpler, safer and more connected by providing residents, guards, and committee members with intuitive, secure digital workflows.
              </p>
            </div>
          </section>

          {/* Section B: What GateLink Does */}
          <section style={{ marginBottom: '60px' }}>
            <div style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, padding: '36px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: textColor, marginBottom: '20px' }}>What GateLink Does</h2>
              <p style={{ fontSize: '15px', color: subTextColor, lineHeight: 1.65, marginBottom: '24px' }}>
                GateLink digitizes and automates core gated-community activities into a paperless, reliable operating environment:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                {[
                  'Resident identity & flat allocation',
                  'Visitor invitation & passcode passes',
                  'Gatekeeper check-in & vehicle logging',
                  'Maintenance billing & offline receipts',
                  'Complaint ticketing & status tracking',
                  'Society notices & broadcast alerts',
                  'Panic & emergency SOS alerts',
                  'Staff & security guard management',
                  'Multi-tenant society administration',
                  'Real-time FCM push notifications'
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '8px', background: isDark ? '#0F172A' : '#F8FAFC', border: `1px solid ${borderColor}`, fontSize: '14px', fontWeight: 600, color: textColor }}>
                    <CheckCircle2 size={16} color="#0EA5E9" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section C: Product Ecosystem */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 900, color: textColor, textAlign: 'center', marginBottom: '32px' }}>
              The GateLink Product Ecosystem
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {ecosystemCards.map((card) => (
                <div key={card.title} style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, padding: '28px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                  <div style={{ marginBottom: '16px' }}>{card.icon}</div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.role}</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: textColor, margin: '4px 0 10px 0' }}>{card.title}</h3>
                  <p style={{ fontSize: '14px', color: subTextColor, lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section D: Founder & Leadership */}
          <section style={{ marginBottom: '60px' }}>
            <div style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, padding: '36px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <Users size={26} color="#0EA5E9" />
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: textColor, margin: 0 }}>Founder & Leadership</h2>
              </div>
              <p style={{ fontSize: '15px', color: subTextColor, lineHeight: 1.65, marginBottom: '28px' }}>
                GateLink is a founder-led technology company. Product development, architecture, security engineering, and operational growth are driven directly by its founders.
              </p>

              {/* Founder Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '28px' }}>
                
                {/* Founder 1: Mohammed Faisal Hasan */}
                <div style={{ padding: '28px', borderRadius: '14px', background: isDark ? '#0F172A' : '#F8FAFC', border: `1px solid ${borderColor}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: isDark ? '#1E3A8A' : '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UserCheck size={22} color="#0EA5E9" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '19px', fontWeight: 900, color: textColor, margin: 0 }}>Mohammed Faisal Hasan</h3>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#0EA5E9', letterSpacing: '0.5px' }}>FOUNDER & CTO / PRODUCT LEAD</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: subTextColor, lineHeight: 1.65, margin: 0 }}>
                    Directly leads GateLink's platform architecture, mobile application engineering, security design, and product development. Focused on creating a reliable, high-performance operating system that solves everyday gated-community security and administrative challenges.
                  </p>
                </div>

                {/* Founder 2: Dileep Kotha */}
                <div style={{ padding: '28px', borderRadius: '14px', background: isDark ? '#0F172A' : '#F8FAFC', border: `1px solid ${borderColor}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: isDark ? '#064E3B' : '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UserCheck size={22} color="#059669" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '19px', fontWeight: 900, color: textColor, margin: 0 }}>Dileep Kotha</h3>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', letterSpacing: '0.5px' }}>CO-FOUNDER</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: subTextColor, lineHeight: 1.65, margin: 0 }}>
                    Co-leads GateLink's community operations, growth strategy, and society partner relationships, ensuring smooth deployment, guard training, and ongoing support for housing societies.
                  </p>
                </div>

              </div>

              {/* Company & Team Structure Note */}
              <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: isDark ? '#1E293B' : '#F1F5F9', border: `1px solid ${borderColor}` }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: textColor, marginBottom: '6px' }}>Current Team & Company Structure</h4>
                <p style={{ fontSize: '14px', color: subTextColor, lineHeight: 1.6, margin: 0 }}>
                  GateLink is currently founder-led, with product engineering, security, and technology development driven directly by its founders. As platform adoption grows across gated communities, GateLink is expanding its team across software engineering, customer success, and local community operations.
                </p>
              </div>
            </div>
          </section>

          {/* Section E: Our Approach */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 900, color: textColor, textAlign: 'center', marginBottom: '32px' }}>
              Our Product & Security Philosophy
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {approaches.map((app) => (
                <div key={app.title} style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: textColor, marginBottom: '8px' }}>{app.title}</h3>
                  <p style={{ fontSize: '13px', color: subTextColor, lineHeight: 1.6, margin: 0 }}>{app.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section F: Contact & Support */}
          <section style={{ textAlign: 'center', padding: '40px', background: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}` }}>
            <h2 style={{ fontSize: '26px', fontWeight: 900, color: textColor, marginBottom: '10px' }}>Connect With Us</h2>
            <p style={{ fontSize: '15px', color: subTextColor, marginBottom: '24px' }}>
              Have questions about onboarding your housing society or partnering with GateLink?
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
              <button
                onClick={() => setIsDemoModalOpen(true)}
                style={{ padding: '12px 24px', borderRadius: '10px', backgroundColor: '#1E3A8A', color: '#FFFFFF', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}
              >
                Request Product Proposal
              </button>
              <Link
                to="/security"
                style={{ padding: '12px 24px', borderRadius: '10px', backgroundColor: isDark ? '#1E293B' : '#E0F2FE', color: isDark ? '#38BDF8' : '#0284C7', fontWeight: 700, fontSize: '14px', textDecoration: 'none', border: `1px solid ${borderColor}` }}
              >
                Visit Security Center
              </Link>
            </div>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '14px' }}>
              <a href="mailto:support@gatelink.in" style={{ color: '#0EA5E9', textDecoration: 'none', fontWeight: 600 }}>support@gatelink.in</a>
              <Link to="/privacy" style={{ color: subTextColor, textDecoration: 'none' }}>Privacy Policy</Link>
              <Link to="/terms" style={{ color: subTextColor, textDecoration: 'none' }}>Terms of Service</Link>
            </div>
          </section>

        </div>
      </main>

      <FooterSection />
      {isDemoModalOpen && <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />}
    </div>
  );
}
