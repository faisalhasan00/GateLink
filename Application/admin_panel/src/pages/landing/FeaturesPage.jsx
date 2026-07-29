import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
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
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  X,
  SlidersHorizontal
} from 'lucide-react';

export default function FeaturesPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFeatureDetail, setSelectedFeatureDetail] = useState(null);

  const categories = ['All', 'Security & Gate', 'Finance & Billing', 'Operations', 'Community', 'SaaS Governance'];

  const allFeatures = [
    {
      id: 'visitor-mgmt',
      icon: <UserCheck size={32} color="#818CF8" />,
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
      icon: <Users size={32} color="#34D399" />,
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
      icon: <ShieldCheck size={32} color="#C084FC" />,
      title: 'Guard App',
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
      icon: <CreditCard size={32} color="#FBBF24" />,
      title: 'Maintenance Billing',
      category: 'Finance & Billing',
      desc: 'Automated monthly maintenance generation with Razorpay payment gateway integration.',
      benefits: [
        'Instant Razorpay UPI/Card payments',
        'Automated GST invoicing & PDF receipts',
        'Automated payment reminders via SMS/Email',
        'Defaulter list tracking & late fee rules'
      ]
    },
    {
      id: 'complaints',
      icon: <ShieldAlert size={32} color="#F87171" />,
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
      icon: <Car size={32} color="#38BDF8" />,
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
      icon: <Waves size={32} color="#A7F3D0" />,
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
      icon: <AlertTriangle size={32} color="#EF4444" />,
      title: 'Emergency SOS',
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
      icon: <Megaphone size={32} color="#F472B6" />,
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
      icon: <QrCode size={32} color="#60A5FA" />,
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
      icon: <BarChart3 size={32} color="#FBBF24" />,
      title: 'Reports & Analytics',
      category: 'SaaS Governance',
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
      icon: <Building2 size={32} color="#818CF8" />,
      title: 'Multi Society Management',
      category: 'SaaS Governance',
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
    <div style={{ backgroundColor: '#020617', color: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Sticky Navbar */}
      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      {/* Header Banner */}
      <section style={{
        paddingTop: '160px',
        paddingBottom: '60px',
        background: 'radial-gradient(circle at 50% 20%, #1E1B4B 0%, #0F172A 70%, #020617 100%)',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', fontSize: '13px', fontWeight: 800, marginBottom: '16px' }}>
              <Sparkles size={14} /> COMPLETE FEATURE MATRIX
            </div>
            <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1.5px', margin: '0 0 16px 0' }}>
              Intelligent Features for Modern Communities
            </h1>
            <p style={{ fontSize: '18px', color: '#94A3B8', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: 1.6 }}>
              Explore the 12 core modules designed to digitize visitor security, maintenance billing, complaints, amenities, and multi-tenant governance.
            </p>

            {/* Search & Category Filter Bar */}
            <div style={{
              maxWidth: '800px',
              margin: '0 auto',
              background: 'rgba(30, 41, 59, 0.8)',
              borderRadius: '20px',
              padding: '16px 20px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {/* Search Bar */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={20} color="#94A3B8" style={{ position: 'absolute', left: '16px' }} />
                <input
                  type="text"
                  placeholder="Search features (e.g. Visitor, Billing, QR Pass, SOS, Parking)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 14px 14px 50px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Category Pills */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '12px',
                      border: '1px solid',
                      borderColor: selectedCategory === cat ? '#6366F1' : 'rgba(255, 255, 255, 0.1)',
                      backgroundColor: selectedCategory === cat ? '#4F46E5' : 'rgba(255, 255, 255, 0.05)',
                      color: selectedCategory === cat ? '#FFFFFF' : '#94A3B8',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section style={{ padding: '60px 0 100px 0', background: '#020617' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          
          {filteredFeatures.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
              <h3>No features match "{searchQuery}"</h3>
              <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} style={{ marginTop: '12px', padding: '8px 20px', borderRadius: '10px', background: '#4F46E5', color: 'white', border: 'none', cursor: 'pointer' }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
              {filteredFeatures.map((feat, idx) => (
                <motion.div
                  key={feat.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    borderRadius: '24px',
                    padding: '32px 26px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(16px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                    e.currentTarget.style.boxShadow = '0 20px 40px -15px rgba(79, 70, 229, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        {feat.icon}
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 12px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8' }}>
                        {feat.category}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 10px 0' }}>
                      {feat.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                      {feat.desc}
                    </p>

                    {/* Key Benefits List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                      {feat.benefits.map((b) => (
                        <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#CBD5E1', fontWeight: 600 }}>
                          <CheckCircle2 size={14} color="#34D399" style={{ flexShrink: 0 }} />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => setSelectedFeatureDetail(feat)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.3)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'}
                  >
                    <span>Learn More</span>
                    <ArrowRight size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Feature Detail Modal */}
      <AnimatePresence>
        {selectedFeatureDetail && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)',
            zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                borderRadius: '24px',
                padding: '36px',
                maxWidth: '560px',
                width: '100%',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)',
                position: 'relative'
              }}
            >
              <button
                onClick={() => setSelectedFeatureDetail(null)}
                aria-label="Close"
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedFeatureDetail.icon}
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#818CF8' }}>{selectedFeatureDetail.category}</span>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>{selectedFeatureDetail.title}</h3>
                </div>
              </div>

              <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                {selectedFeatureDetail.desc}
              </p>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>KEY ENTERPRISE CAPABILITIES</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedFeatureDetail.benefits.map((b) => (
                    <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#E2E8F0', fontWeight: 600 }}>
                      <CheckCircle2 size={16} color="#34D399" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setSelectedFeatureDetail(null)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                  Close
                </button>
                <button onClick={() => { setSelectedFeatureDetail(null); setIsDemoModalOpen(true); }} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                  Book Demo For This Feature
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <FooterSection />

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
