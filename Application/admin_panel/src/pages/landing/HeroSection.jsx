import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Smartphone, Monitor, ShieldCheck, CheckCircle2, Zap, Bell, CreditCard, UserCheck, KeyRound, Star, Building2, Users } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function HeroSection({ onOpenDemo }) {
  const [activeTab, setActiveTab] = useState('resident');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const tabs = [
    { id: 'resident', label: '📱 Resident App', icon: <Smartphone size={15} /> },
    { id: 'guard', label: '👮 Guard App', icon: <Shield size={15} /> },
    { id: 'admin', label: '📊 Admin Dashboard', icon: <Monitor size={15} /> },
    { id: 'superadmin', label: '🛡️ Super Admin SaaS', icon: <ShieldCheck size={15} /> },
  ];

  return (
    <section 
      id="home"
      style={{
        paddingTop: '150px',
        paddingBottom: '80px',
        background: isDark ? '#0F172A' : '#FFFFFF',
        position: 'relative',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '50px', alignItems: 'center' }}>
        
        {/* Left Editorial Copy */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Rating Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: isDark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF',
            border: isDark ? '1px solid rgba(37, 99, 235, 0.3)' : '1px solid #BFDBFE',
            color: '#2563EB',
            fontSize: '13px',
            fontWeight: 800,
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', color: '#F59E0B' }}>
              <Star size={14} fill="#F59E0B" />
              <Star size={14} fill="#F59E0B" />
              <Star size={14} fill="#F59E0B" />
              <Star size={14} fill="#F59E0B" />
              <Star size={14} fill="#F59E0B" />
            </div>
            <span>Trusted by 500+ Housing Societies</span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: '52px',
            fontWeight: 900,
            color: isDark ? '#FFFFFF' : '#0F172A',
            letterSpacing: '-1.8px',
            lineHeight: 1.1,
            marginBottom: '20px'
          }}>
            The Complete <span style={{ color: '#2563EB' }}>Society & Gate Security</span> Operating System
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '18px',
            color: isDark ? '#94A3B8' : '#475569',
            lineHeight: 1.65,
            marginBottom: '32px',
            maxWidth: '560px'
          }}>
            Simplify Visitor Passes, Guard Verification, Maintenance Billing, Amenity Slot Bookings, and Emergency SOS from one unified enterprise cloud platform.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '36px' }}>
            <button
              onClick={onOpenDemo}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 32px',
                borderRadius: '12px',
                background: '#2563EB',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 900,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>Book Free Live Demo</span>
              <ArrowRight size={18} />
            </button>

            <a
              href="#features"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 28px',
                borderRadius: '12px',
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
                color: isDark ? '#FFFFFF' : '#0F172A',
                fontSize: '16px',
                fontWeight: 700,
                border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Play size={16} fill={isDark ? '#FFFFFF' : '#0F172A'} />
              <span>Watch 2-Min Tour</span>
            </a>
          </div>

          {/* Key Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', paddingTop: '24px', borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A' }}>250k+</div>
              <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>Active Residents</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#059669' }}>99.9%</div>
              <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>Gate Uptime SLA</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#2563EB' }}>10M+</div>
              <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>Check-ins Verified</div>
            </div>
          </div>
        </motion.div>

        {/* Right Device Screen Viewport */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Tab Switcher */}
          <div style={{ display: 'flex', gap: '6px', padding: '6px', background: isDark ? '#1E293B' : '#F1F5F9', borderRadius: '14px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0', marginBottom: '14px' }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  backgroundColor: activeTab === t.id ? '#2563EB' : 'transparent',
                  color: activeTab === t.id ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B'),
                  transition: 'all 0.2s ease'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Device Screen Preview Card */}
          <div style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '20px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
            padding: '24px',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
            minHeight: '360px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {activeTab === 'resident' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A' }}>Resident Mobile Companion</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>Flat 402 • Skyline Heights</p>
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', background: '#ECFDF5', color: '#059669', fontSize: '11px', fontWeight: 800 }}>LIVE GATE LINK</span>
                </div>

                <div style={{ background: isDark ? '#0F172A' : '#F8FAFC', borderRadius: '16px', padding: '16px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Bell size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Visitor at Main Gate</div>
                    <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>Amazon Delivery Agent • OTP: 8492</div>
                  </div>
                  <button style={{ padding: '8px 14px', borderRadius: '8px', background: '#059669', color: 'white', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '12px' }}>
                    Allow
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ background: isDark ? '#0F172A' : '#F8FAFC', padding: '14px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 700 }}>MAINTENANCE DUE</div>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', marginTop: '2px' }}>₹4,500</div>
                    <div style={{ fontSize: '11px', color: '#059669', fontWeight: 800, marginTop: '2px' }}>Paid via Razorpay</div>
                  </div>

                  <div style={{ background: isDark ? '#0F172A' : '#F8FAFC', padding: '14px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 700 }}>AMENITY BOOKED</div>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', marginTop: '2px' }}>Tennis Court</div>
                    <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: 800, marginTop: '2px' }}>Today 6:00 PM</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'guard' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A' }}>Gatekeeper Duty Console</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>Main Entry Gate 01</p>
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', background: '#ECFDF5', color: '#059669', fontSize: '11px', fontWeight: 800 }}>GUARD ON DUTY</span>
                </div>

                <div style={{ background: isDark ? '#0F172A' : '#F8FAFC', padding: '14px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>Pre-Approved Entry Pass</div>
                  <div style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#475569' }}>Guest Passcode: <strong style={{ color: '#2563EB' }}>#9012</strong> → Flat 201</div>
                </div>
              </div>
            )}

            {activeTab === 'admin' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A' }}>Society Admin Dashboard</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>July 2026 Financial Overview</p>
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', background: '#EFF6FF', color: '#2563EB', fontSize: '11px', fontWeight: 800 }}>98.4% COLLECTED</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ background: isDark ? '#0F172A' : '#F8FAFC', padding: '14px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 700 }}>COLLECTED REVENUE</div>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: '#059669', marginTop: '4px' }}>₹8,45,000</div>
                  </div>
                  <div style={{ background: isDark ? '#0F172A' : '#F8FAFC', padding: '14px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 700 }}>SLA HELP TICKETS</div>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: '#2563EB', marginTop: '4px' }}>12 Resolved</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'superadmin' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A' }}>Super Admin Multi-Tenant Portal</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>Global Township CRM</p>
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', background: '#F3E8FF', color: '#7C3AED', fontSize: '11px', fontWeight: 800 }}>HQ CONTROL</span>
                </div>

                <div style={{ background: isDark ? '#0F172A' : '#F8FAFC', padding: '14px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>500+ Societies Onboarded</div>
                  <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', marginTop: '2px' }}>Active SaaS Subscriptions Across Bengaluru, Mumbai, Delhi</div>
                </div>
              </div>
            )}

          </div>
        </motion.div>

      </div>
    </section>
  );
}
