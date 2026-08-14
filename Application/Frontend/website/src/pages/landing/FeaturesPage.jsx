import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import SeoHead from '../../components/seo/SeoHead';
import { 
  UserCheck, 
  Users, 
  ShieldCheck, 
  CreditCard, 
  ShieldAlert, 
  Car, 
  Waves, 
  AlertTriangle, 
  Megaphone, 
  QrCode, 
  BarChart3, 
  Building2, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function FeaturesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFeatureDetail, setSelectedFeatureDetail] = useState(null);

  const categories = ['All', 'Security & Gate', 'Finance & Billing', 'Operations', 'Community', 'Governance'];

  const allFeatures = [
    {
      id: 'visitor-mgmt',
      icon: <UserCheck size={28} color="#0EA5E9" />,
      title: 'Visitor Management',
      category: 'Security & Gate',
      desc: 'Real-time visitor tracking with instant resident approval notifications on mobile devices.',
      benefits: [
        '1-Tap resident mobile approval & rejection',
        'Delivery & cab auto-entry approvals',
        'Searchable historical gate entry logs',
        'Blacklist & suspect visitor alerts'
      ]
    },
    {
      id: 'resident-mgmt',
      icon: <Users size={28} color="#0284C7" />,
      title: 'Resident Management',
      category: 'Operations',
      desc: 'Comprehensive resident directory for flat owners, tenants, and family members.',
      benefits: [
        'Owner & tenant profile verification',
        'Privacy settings & directory visibility control',
        'Roster management by block/flat',
        'Digital resident ID cards'
      ]
    },
    {
      id: 'guard-app',
      icon: <ShieldCheck size={28} color="#1E3A8A" />,
      title: 'Guard Gatekeeper App',
      category: 'Security & Gate',
      desc: 'Multilingual gatekeeper application for security guards at society entry/exit gates.',
      benefits: [
        'Fast OTP & passcode verification',
        'Vehicle plate logging & gatekeeper records',
        'Daily maid/cook check-in & check-out',
        'Guard shift duty management'
      ]
    },
    {
      id: 'maintenance-billing',
      icon: <CreditCard size={28} color="#F59E0B" />,
      title: 'Pay Maintenance Bill Online',
      category: 'Finance & Billing',
      desc: 'Automated monthly maintenance generation with online payment gateway integration.',
      benefits: [
        'Instant UPI & Card maintenance payments',
        'Automated GST invoicing & PDF receipts',
        'Automated payment reminders via SMS/WhatsApp',
        'Defaulter list tracking & late fee rules'
      ]
    },
    {
      id: 'complaints',
      icon: <ShieldAlert size={28} color="#EF4444" />,
      title: 'Complaints & Helpdesk',
      category: 'Operations',
      desc: 'Helpdesk ticketing system for resolving resident complaints and maintenance issues.',
      benefits: [
        'Plumbing, Electrical & General categories',
        'SLA tracking & escalation matrix',
        'Staff assignment & progress updates',
        'Resident satisfaction ratings'
      ]
    },
    {
      id: 'parking',
      icon: <Car size={28} color="#0EA5E9" />,
      title: 'Parking Management',
      category: 'Operations',
      desc: 'Intelligent parking slot allocation and visitor parking management system.',
      benefits: [
        'Resident vehicle RFID & slot mapping',
        'Visitor parking pass allocation',
        'Unauthorized vehicle alert system',
        'EV charging slot management'
      ]
    },
    {
      id: 'amenities',
      icon: <Waves size={28} color="#0284C7" />,
      title: 'Amenities & Clubhouse',
      category: 'Community',
      desc: 'Slot booking engine for clubhouse, swimming pool, tennis court, and banquet hall.',
      benefits: [
        'Conflict-free slot booking calendar',
        'Online amenity fee collection',
        'Capacity caps & slot usage rules',
        'Instant booking confirmation pass'
      ]
    },
    {
      id: 'emergency-sos',
      icon: <AlertTriangle size={28} color="#DC2626" />,
      title: 'Emergency SOS Panic Siren',
      category: 'Security & Gate',
      desc: 'Critical emergency alert system triggering loud sirens on guard devices and committee alerts.',
      benefits: [
        '1-Tap resident panic button',
        'Instant loud sirens on guard devices',
        'GPS location & flat number sharing',
        'Emergency contact auto-alert'
      ]
    },
    {
      id: 'communication',
      icon: <Megaphone size={28} color="#F59E0B" />,
      title: 'Community Communication',
      category: 'Community',
      desc: 'Digital notice board and broadcast channel for official society announcements.',
      benefits: [
        'Instant push notification broadcasts',
        'PDF attachments for bylaws & minutes',
        'Read receipts for critical notices',
        'Categorized announcements board'
      ]
    },
    {
      id: 'qr-pass',
      icon: <QrCode size={28} color="#1E3A8A" />,
      title: 'Visitor QR Pass',
      category: 'Security & Gate',
      desc: 'Pre-approved digital QR and passcode passes for guests, cabs, and delivery agents.',
      benefits: [
        'Zero wait time at security gates',
        '1-Click WhatsApp pass sharing',
        'Time-bounded & single/multi-use passes',
        'Instant gatekeeper QR scanning'
      ]
    },
    {
      id: 'reports-analytics',
      icon: <BarChart3 size={28} color="#0EA5E9" />,
      title: 'Reports & Analytics',
      category: 'Governance',
      desc: 'Executive reports dashboard with financial collection trends and CSV/PDF data export.',
      benefits: [
        'Monthly collection & revenue charts',
        'Gate traffic & visitor frequency metrics',
        '1-Click Excel, CSV, and PDF exports',
        'Scheduled automated reports'
      ]
    },
    {
      id: 'multi-society',
      icon: <Building2 size={28} color="#1E3A8A" />,
      title: 'Multi-Society Township CRM',
      category: 'Governance',
      desc: 'Super Admin dashboard for managing multiple societies, licensing, and builder handovers.',
      benefits: [
        'Multi-tenant society onboarding',
        'Subscription tier & licensing manager',
        'Global CRM & sales lead pipeline',
        'Cross-society ad campaign manager'
      ]
    }
  ];

  // Filter features based on search & category
  const filteredFeatures = allFeatures.filter(f => {
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.benefits.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#2C2C2C', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Dynamic SEO Head */}
      <SeoHead
        title="All Features & Capabilities - GateLink"
        description="Explore GateLink core modules designed to digitize visitor security, maintenance billing, complaints, amenities, and RWA governance."
        canonicalUrl="https://gatelink.in/features"
      />

      {/* Sticky Navbar */}
      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      {/* Header Banner */}
      <section style={{
        paddingTop: '120px',
        paddingBottom: '50px',
        background: isDark ? '#0F172A' : '#FFFFFF',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px' }}>
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '1px' }}>
            COMPLETE FEATURE MATRIX
          </span>
          <h1 style={{ fontSize: '40px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-1px', margin: '10px 0 16px 0' }}>
            Intelligent Features for Modern Communities
          </h1>
          <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#555555', maxWidth: '750px', margin: '0 auto 30px auto', lineHeight: 1.6 }}>
            Explore the 12 core modules designed to digitize visitor security, maintenance billing, complaints, amenities, and multi-tenant governance.
          </p>

          {/* Search & Category Filter Bar */}
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={18} color={isDark ? '#94A3B8' : '#666666'} style={{ position: 'absolute', left: '16px' }} />
              <input
                type="text"
                placeholder="Search features (e.g. Visitor, Billing, QR Pass, SOS, Parking)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '12px 14px 12px 48px', borderRadius: '12px', border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #CCCCCC', background: isDark ? '#1E293B' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '8px 18px', borderRadius: '12px', border: '1px solid',
                      borderColor: isSelected ? '#1E3A8A' : (isDark ? 'rgba(255,255,255,0.1)' : '#CCCCCC'),
                      backgroundColor: isSelected ? '#1E3A8A' : 'transparent',
                      color: isSelected ? '#FFFFFF' : (isDark ? '#94A3B8' : '#444444'), fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section style={{ padding: '60px 0 100px 0' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px' }}>
          
          {filteredFeatures.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: isDark ? '#94A3B8' : '#666666' }}>
              <h3>No features found matching "{searchQuery}"</h3>
              <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} style={{ marginTop: '12px', padding: '8px 20px', borderRadius: '12px', background: '#1E3A8A', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              {filteredFeatures.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFeatureDetail(f)}
                  style={{
                    background: isDark ? '#1E293B' : '#FFFFFF',
                    borderRadius: '16px',
                    padding: '28px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.05)' : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {f.icon}
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 900, padding: '4px 10px', borderRadius: '6px', background: '#EFF6FF', color: '#1E3A8A' }}>
                        {f.category}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '19px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '0 0 10px 0' }}>
                      {f.title}
                    </h3>

                    <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                      {f.desc}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {f.benefits.map((b) => (
                        <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: isDark ? '#E2E8F0' : '#444444' }}>
                          <CheckCircle2 size={15} color="#0EA5E9" style={{ flexShrink: 0 }} />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: '24px', paddingTop: '14px', borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: '#0EA5E9' }}>
                    <span>Learn More</span>
                    <ArrowRight size={15} />
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Feature Detail Modal */}
      {selectedFeatureDetail && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: isDark ? '#1E293B' : '#FFFFFF', borderRadius: '16px', maxWidth: '600px', width: '100%', padding: '32px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB', position: 'relative' }}>
            <button onClick={() => setSelectedFeatureDetail(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: isDark ? '#FFFFFF' : '#333333' }}>
              <X size={20} />
            </button>
            <span style={{ fontSize: '11px', fontWeight: 900, background: '#EFF6FF', color: '#1E3A8A', padding: '4px 10px', borderRadius: '6px' }}>{selectedFeatureDetail.category}</span>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '14px 0 8px 0' }}>{selectedFeatureDetail.title}</h2>
            <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.65, marginBottom: '20px' }}>{selectedFeatureDetail.desc}</p>
            
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#2C2C2C', marginBottom: '12px' }}>Core Capabilities:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {selectedFeatureDetail.benefits.map((b) => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: isDark ? '#E2E8F0' : '#444444' }}>
                  <CheckCircle2 size={16} color="#0EA5E9" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setSelectedFeatureDetail(null); setIsDemoModalOpen(true); }}
              style={{ 
                width: '100%', 
                padding: '14px', 
                borderRadius: '12px', 
                backgroundColor: '#1E3A8A', 
                color: '#FFFFFF', 
                border: 'none', 
                fontSize: '14px', 
                fontWeight: 700, 
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#172554'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1E3A8A'}
            >
              Request Onboarding Proposal for {selectedFeatureDetail.title}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <FooterSection />

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
