import React, { useState } from 'react';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import SeoHead from '../../components/seo/SeoHead';
import { Search, LifeBuoy, BookOpen, Shield, CreditCard, Users, MessageSquare, ArrowRight } from 'lucide-react';

export default function HelpCenterPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const helpTopics = [
    {
      icon: <Users size={28} color="#818CF8" />,
      title: 'Resident Mobile App Guide',
      desc: 'How to approve visitors, generate pre-approval QR codes, pay maintenance via UPI, and trigger Emergency SOS.'
    },
    {
      icon: <Shield size={28} color="#34D399" />,
      title: 'Security Guard Gatekeeper Setup',
      desc: 'Configuring the multilingual Guard App, logging daily helper attendance, scanning guest passcodes, and siren tests.'
    },
    {
      icon: <CreditCard size={28} color="#FBBF24" />,
      title: 'Maintenance Billing & Razorpay',
      desc: 'Setting up automated monthly billing schedules, Razorpay API key configuration, GST invoicing, and Tally exports.'
    },
    {
      icon: <BookOpen size={28} color="#C084FC" />,
      title: 'Society Admin & RBAC Matrix',
      desc: 'Managing role permissions for committee treasurers, secretaries, and supervisors with legal audit trails.'
    }
  ];

  return (
    <div style={{ backgroundColor: '#020617', color: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <SeoHead
        title="Help Center & Knowledge Base - GateLink"
        description="Get technical assistance and user guides for GateLink Resident App, Guard Gatekeeper App, and Admin Panel."
        canonicalUrl="https://gatelink.in/help"
      />

      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      <section style={{ paddingTop: '160px', paddingBottom: '50px', background: 'radial-gradient(circle at 50% 20%, #1E1B4B 0%, #0F172A 70%, #020617 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', fontSize: '13px', fontWeight: 800, marginBottom: '16px' }}>
            <LifeBuoy size={14} /> 24/7 SUPPORT & KNOWLEDGE BASE
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1.5px', margin: '0 0 16px 0' }}>
            GateLink Help Center
          </h1>
          <p style={{ fontSize: '18px', color: '#94A3B8', maxWidth: '650px', margin: '0 auto 30px auto' }}>
            Browse user guides, technical documentation, and setup tutorials.
          </p>

          <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
            <Search size={20} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '16px' }} />
            <input
              type="text"
              placeholder="Search help articles (e.g. Razorpay, SOS Siren, Maid Entry)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '14px 14px 14px 50px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(30, 41, 59, 0.8)', color: '#FFFFFF', fontSize: '15px', outline: 'none' }}
            />
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 0 100px 0', background: '#020617' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '28px' }}>
            {helpTopics.map(t => (
              <div key={t.title} style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '20px', padding: '28px', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(16px)' }}>
                <div style={{ marginBottom: '16px' }}>{t.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px 0' }}>{t.title}</h3>
                <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, margin: '0 0 20px 0' }}>{t.desc}</p>
                <a href="/docs" style={{ color: '#818CF8', fontWeight: 800, fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>View Knowledge Base</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
