import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import SeoHead from '../../components/seo/SeoHead';
import { useTheme } from '../../context/ThemeContext';
import { 
  Smartphone, 
  ShieldCheck, 
  Download, 
  QrCode, 
  CheckCircle2, 
  Apple, 
  Play, 
  UserCheck,
  Zap,
  Bell,
  CreditCard,
  AlertTriangle
} from 'lucide-react';

export default function DownloadAppPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('resident'); // 'resident' or 'guard'
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#F8FAFC' : '#1E293B', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <SeoHead
        title="Download Mobile Apps - GateLink Resident & Guard App"
        description="Download GateLink Resident App for iOS & Android, and GateLink Guard App for gated community security."
        canonicalUrl="https://gatelink.in/download"
      />

      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      {/* Header Banner */}
      <section style={{
        paddingTop: '130px',
        paddingBottom: '50px',
        background: isDark 
          ? 'radial-gradient(circle at 50% 10%, #1E3A8A33 0%, #0F172A 80%)' 
          : 'radial-gradient(circle at 50% 10%, #EFF6FF 0%, #FFFFFF 80%)',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E5E7EB',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: isDark ? 'rgba(14, 165, 233, 0.15)' : '#EFF6FF',
              color: isDark ? '#38BDF8' : '#1E3A8A',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '16px'
            }}>
              <Smartphone size={14} /> NATIVE iOS & ANDROID MOBILE APPS
            </div>
            
            <h1 style={{
              fontSize: '44px',
              fontWeight: 900,
              color: isDark ? '#FFFFFF' : '#1E293B',
              letterSpacing: '-1.5px',
              margin: '0 0 16px 0',
              lineHeight: 1.15
            }}>
              Download GateLink Apps
            </h1>
            
            <p style={{
              fontSize: '17px',
              color: isDark ? '#94A3B8' : '#64748B',
              maxWidth: '680px',
              margin: '0 auto 32px auto',
              lineHeight: 1.6
            }}>
              Get instant visitor approvals, pay maintenance online with GST receipts, and protect your gated community on your smartphone.
            </p>

            {/* App Selection Tabs */}
            <div style={{
              display: 'inline-flex',
              padding: '4px',
              borderRadius: '14px',
              background: isDark ? '#1E293B' : '#F1F5F9',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
              gap: '6px'
            }}>
              <button
                onClick={() => setActiveTab('resident')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: activeTab === 'resident' ? '#1E3A8A' : 'transparent',
                  color: activeTab === 'resident' ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B'),
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <UserCheck size={18} /> Resident & Owner App
              </button>

              <button
                onClick={() => setActiveTab('guard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: activeTab === 'guard' ? '#1E3A8A' : 'transparent',
                  color: activeTab === 'guard' ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B'),
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <ShieldCheck size={18} /> Gate Security Guard App
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Download Card Section */}
      <section style={{ padding: '60px 0 100px 0', backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px' }}>
          
          {activeTab === 'resident' ? (
            /* Resident App Card */
            <motion.div
              key="resident"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                background: isDark ? '#1E293B' : '#FFFFFF',
                borderRadius: '16px',
                padding: '40px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.3)' : '0 10px 30px rgba(30, 58, 138, 0.06)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '40px',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 900,
                  color: '#1E3A8A',
                  background: '#EFF6FF',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}>
                  FOR RESIDENTS, OWNERS & TENANTS
                </span>
                
                <h2 style={{ fontSize: '30px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#1E293B', margin: '14px 0 12px 0' }}>
                  GateLink Resident Mobile App
                </h2>
                
                <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
                  Approve visitors with 1 tap, pay monthly maintenance bills online, reserve clubhouse amenities, and trigger Emergency SOS panic sirens.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: isDark ? '#E2E8F0' : '#334155', fontSize: '14px', fontWeight: 600 }}>
                    <CheckCircle2 size={18} color="#0EA5E9" style={{ flexShrink: 0 }} />
                    <span>1-Tap Lock Screen Visitor Approvals & Pre-Approved QR Passes</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: isDark ? '#E2E8F0' : '#334155', fontSize: '14px', fontWeight: 600 }}>
                    <CheckCircle2 size={18} color="#0EA5E9" style={{ flexShrink: 0 }} />
                    <span>Online Maintenance Payments with Instant GST PDF Receipts</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: isDark ? '#E2E8F0' : '#334155', fontSize: '14px', fontWeight: 600 }}>
                    <CheckCircle2 size={18} color="#0EA5E9" style={{ flexShrink: 0 }} />
                    <span>Instant Emergency SOS Siren Broadcasting Flat Details to Guards</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: isDark ? '#E2E8F0' : '#334155', fontSize: '14px', fontWeight: 600 }}>
                    <CheckCircle2 size={18} color="#0EA5E9" style={{ flexShrink: 0 }} />
                    <span>Clubhouse & Amenity Conflict-Free Slot Booking Engine</span>
                  </div>
                </div>

                {/* Store Buttons */}
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <a
                    href="https://apps.apple.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 22px',
                      borderRadius: '12px',
                      background: '#0F172A',
                      color: 'white',
                      textDecoration: 'none',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      fontWeight: 700,
                      transition: 'transform 0.2s ease, opacity 0.2s ease'
                    }}
                  >
                    <Apple size={24} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#94A3B8' }}>Download on the</div>
                      <div style={{ fontSize: '15px', fontWeight: 900 }}>App Store</div>
                    </div>
                  </a>

                  <a
                    href="https://play.google.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 22px',
                      borderRadius: '12px',
                      background: '#0F172A',
                      color: 'white',
                      textDecoration: 'none',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      fontWeight: 700,
                      transition: 'transform 0.2s ease, opacity 0.2s ease'
                    }}
                  >
                    <Play size={24} color="#0EA5E9" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#94A3B8' }}>GET IT ON</div>
                      <div style={{ fontSize: '15px', fontWeight: 900 }}>Google Play</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* QR Scan Box */}
              <div style={{
                background: isDark ? '#0F172A' : '#F8FAFC',
                borderRadius: '16px',
                padding: '36px 24px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '140px',
                  height: '140px',
                  backgroundColor: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '14px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px'
                }}>
                  <QrCode size={116} color="#1E3A8A" />
                </div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#1E293B' }}>Scan to Install Resident App</div>
                <div style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', marginTop: '6px' }}>Compatible with iOS 15.0+ and Android 8.0+</div>
              </div>
            </motion.div>
          ) : (
            /* Guard App Card */
            <motion.div
              key="guard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                background: isDark ? '#1E293B' : '#FFFFFF',
                borderRadius: '16px',
                padding: '40px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.3)' : '0 10px 30px rgba(30, 58, 138, 0.06)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '40px',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 900,
                  color: '#1E3A8A',
                  background: '#EFF6FF',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}>
                  FOR GATEKEEPERS & SECURITY GUARDS
                </span>
                
                <h2 style={{ fontSize: '30px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#1E293B', margin: '14px 0 12px 0' }}>
                  GateLink Guard Gatekeeper App
                </h2>
                
                <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
                  Fast 5-second entry verification, QR passcode scanning, daily staff attendance logging, and loud Emergency SOS siren alarms.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: isDark ? '#E2E8F0' : '#334155', fontSize: '14px', fontWeight: 600 }}>
                    <CheckCircle2 size={18} color="#0EA5E9" style={{ flexShrink: 0 }} />
                    <span>Multilingual UI (English, Hindi, Kannada, Tamil, Telugu, Marathi)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: isDark ? '#E2E8F0' : '#334155', fontSize: '14px', fontWeight: 600 }}>
                    <CheckCircle2 size={18} color="#0EA5E9" style={{ flexShrink: 0 }} />
                    <span>5-Second Fast Gate Verification & QR Passcode Scanner</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: isDark ? '#E2E8F0' : '#334155', fontSize: '14px', fontWeight: 600 }}>
                    <CheckCircle2 size={18} color="#0EA5E9" style={{ flexShrink: 0 }} />
                    <span>High-Priority Loud SOS Siren Alerts with Exact Flat Location</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: isDark ? '#E2E8F0' : '#334155', fontSize: '14px', fontWeight: 600 }}>
                    <CheckCircle2 size={18} color="#0EA5E9" style={{ flexShrink: 0 }} />
                    <span>Offline-First Sync Built for Weak Cellular Network Gate Areas</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <a
                    href="https://play.google.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 28px',
                      borderRadius: '12px',
                      background: '#1E3A8A',
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight: 800,
                      fontSize: '15px',
                      boxShadow: '0 4px 16px rgba(30, 58, 138, 0.25)',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#172554'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1E3A8A'}
                  >
                    <Download size={20} />
                    <span>Download Guard Android APK</span>
                  </a>
                </div>
              </div>

              {/* QR Scan Box */}
              <div style={{
                background: isDark ? '#0F172A' : '#F8FAFC',
                borderRadius: '16px',
                padding: '36px 24px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '140px',
                  height: '140px',
                  backgroundColor: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '14px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px'
                }}>
                  <QrCode size={116} color="#1E3A8A" />
                </div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#1E293B' }}>Scan to Install Guard App</div>
                <div style={{ fontSize: '13px', color: '#0EA5E9', marginTop: '6px', fontWeight: 600 }}>Optimized for Tablets & Mobile Devices</div>
              </div>
            </motion.div>
          )}

        </div>
      </section>

      {/* Footer */}
      <FooterSection />

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
