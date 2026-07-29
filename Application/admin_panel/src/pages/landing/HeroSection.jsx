import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Smartphone, Monitor, ShieldCheck, CheckCircle2, Zap, Bell, CreditCard, UserCheck, KeyRound } from 'lucide-react';

export default function HeroSection({ onOpenDemo }) {
  const [activeTab, setActiveTab] = useState('resident');

  const tabs = [
    { id: 'resident', label: '📱 Resident App', icon: <Smartphone size={16} /> },
    { id: 'guard', label: '👮 Security Guard App', icon: <Shield size={16} /> },
    { id: 'admin', label: '📊 Society Admin Panel', icon: <Monitor size={16} /> },
    { id: 'superadmin', label: '🛡️ Super Admin SaaS', icon: <ShieldCheck size={16} /> },
  ];

  return (
    <section 
      id="home"
      style={{
        paddingTop: '160px',
        paddingBottom: '90px',
        background: 'radial-gradient(circle at 50% 20%, #1E1B4B 0%, #0F172A 70%, #020617 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Gradient Orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '15%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.25) 0%, rgba(0, 0, 0, 0) 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '30%', right: '10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, rgba(0, 0, 0, 0) 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        
        {/* Left Text Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <div className="hero-editorial-badge" style={{ marginBottom: '24px' }}>
            <Zap size={14} color="#818CF8" />
            <span>Enterprise OS Version 3.0 • Verified Security</span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: '54px',
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-1.8px',
            lineHeight: 1.08,
            marginBottom: '24px'
          }}>
            The Complete <span style={{ background: 'linear-gradient(135deg, #818CF8 0%, #C084FC 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Operating System</span> for Modern Gated Communities
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '18px',
            color: '#94A3B8',
            lineHeight: 1.65,
            marginBottom: '36px',
            maxWidth: '560px'
          }}>
            Unify Visitor Approvals, Gatekeeper Verification, Maintenance Invoicing, Emergency SOS, and Community Living in one intelligent platform.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={onOpenDemo}
              className="hover-elevate"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 32px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(79, 70, 229, 0.5)'
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
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 700,
                border: '1px solid rgba(255, 255, 255, 0.15)',
                textDecoration: 'none',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
            >
              <Play size={16} fill="#FFFFFF" />
              <span>Explore Features</span>
            </a>
          </div>

          {/* Guarantee checklist */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '36px', color: '#64748B', fontSize: '13px', fontWeight: 600, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#CBD5E1' }}>
              <CheckCircle2 size={16} color="#34D399" /> Free 14-Day Trial
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#CBD5E1' }}>
              <CheckCircle2 size={16} color="#34D399" /> Zero Setup Fees
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#CBD5E1' }}>
              <CheckCircle2 size={16} color="#34D399" /> 24/7 Onboarding Support
            </span>
          </div>

        </motion.div>

        {/* Right Interactive Mockup Column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Tab Selector */}
          <div style={{ display: 'flex', gap: '8px', padding: '6px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '16px', backdropFilter: 'blur(12px)', overflowX: 'auto' }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  backgroundColor: activeTab === t.id ? '#4F46E5' : 'transparent',
                  color: activeTab === t.id ? '#FFFFFF' : '#94A3B8'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Interactive Screen Preview Container */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '24px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative'
          }}>
            {/* Screen Content Render */}
            {activeTab === 'resident' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Resident Companion</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>Flat 402 • Skyline Towers</p>
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', fontSize: '11px', fontWeight: 800 }}>LIVE CONNECTED</span>
                </div>

                {/* Floating Notification */}
                <div style={{ background: 'rgba(15, 23, 42, 0.9)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Bell size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>Delivery Gate Pre-Approval</div>
                    <div style={{ color: '#94A3B8', fontSize: '11px' }}>Amazon Logistics • OTP: 8492</div>
                  </div>
                  <button style={{ background: '#10B981', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '8px', fontWeight: 800, fontSize: '11px', cursor: 'pointer' }}>ALLOW</button>
                </div>

                {/* Resident Action Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <CreditCard size={18} color="#818CF8" style={{ marginBottom: '6px' }} />
                    <div style={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>Maintenance</div>
                    <div style={{ color: '#34D399', fontWeight: 800, fontSize: '12px' }}>Paid ₹4,500</div>
                  </div>
                  <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <KeyRound size={18} color="#C084FC" style={{ marginBottom: '6px' }} />
                    <div style={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>Visitor Passes</div>
                    <div style={{ color: '#94A3B8', fontSize: '12px' }}>3 Active Passes</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'guard' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Gate 1 Guard Duty</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>Guard Ramesh • Gatekeeper App</p>
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(239, 68, 68, 0.2)', color: '#FCA5A5', fontSize: '11px', fontWeight: 800 }}>SECURE GATE</span>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.9)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <UserCheck size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>Cab Verification Successful</div>
                    <div style={{ color: '#94A3B8', fontSize: '11px' }}>Uber MH 12 AB 9421 • Flat 201</div>
                  </div>
                  <span style={{ color: '#10B981', fontWeight: 800, fontSize: '12px' }}>PASSED ✓</span>
                </div>
              </div>
            )}

            {activeTab === 'admin' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ color: 'white' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Society Committee Console</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>Skyline Heights • 180 Flats</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>COLLECTION</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#34D399' }}>98.4%</div>
                  </div>
                  <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>VISITORS</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#818CF8' }}>1,240</div>
                  </div>
                  <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>HELPDESK</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#FBBF24' }}>0 Pending</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'superadmin' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ color: 'white' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Owner Command Center</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>SocietySphere SaaS Global Directory</p>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
                    <span>Active Societies</span>
                    <span style={{ color: '#818CF8' }}>500+ Onboarded</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: '12px' }}>
                    <span>Monthly ARR Growth</span>
                    <span style={{ color: '#34D399', fontWeight: 800 }}>+28% YoY</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </motion.div>

      </div>
    </section>
  );
}
