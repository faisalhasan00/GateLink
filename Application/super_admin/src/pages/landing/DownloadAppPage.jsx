import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import SeoHead from '../../components/seo/SeoHead';
import { 
  Smartphone, 
  ShieldCheck, 
  Download, 
  QrCode, 
  CheckCircle2, 
  Apple, 
  Play, 
  Sparkles, 
  ArrowRight,
  Shield,
  UserCheck
} from 'lucide-react';

export default function DownloadAppPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('resident'); // resident or guard

  return (
    <div style={{ backgroundColor: '#020617', color: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <SeoHead
        title="Download Mobile Apps - SocietySphere Resident & Guard App"
        description="Download SocietySphere Resident App for iOS & Android, and SocietySphere Guard App for gatekeepers."
        canonicalUrl="https://societysphere.com/download"
      />

      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      {/* Header Banner */}
      <section style={{
        paddingTop: '160px',
        paddingBottom: '50px',
        background: 'radial-gradient(circle at 50% 20%, #1E1B4B 0%, #0F172A 70%, #020617 100%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', fontSize: '13px', fontWeight: 800, marginBottom: '16px' }}>
              <Smartphone size={14} /> NATIVE iOS & ANDROID MOBILE APPS
            </div>
            <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1.5px', margin: '0 0 16px 0' }}>
              Download SocietySphere Apps
            </h1>
            <p style={{ fontSize: '18px', color: '#94A3B8', maxWidth: '700px', margin: '0 auto 30px auto', lineHeight: 1.6 }}>
              Get instant visitor approvals, maintenance bill payments, and gate security controls directly on your smartphone.
            </p>

            {/* App Selection Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={() => setActiveTab('resident')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '14px',
                  border: '1px solid', borderColor: activeTab === 'resident' ? '#6366F1' : 'rgba(255, 255, 255, 0.1)',
                  backgroundColor: activeTab === 'resident' ? '#4F46E5' : 'rgba(255, 255, 255, 0.05)',
                  color: activeTab === 'resident' ? '#FFFFFF' : '#94A3B8', fontWeight: 800, fontSize: '14px', cursor: 'pointer'
                }}
              >
                <UserCheck size={18} /> Resident & Owner App
              </button>

              <button
                onClick={() => setActiveTab('guard')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '14px',
                  border: '1px solid', borderColor: activeTab === 'guard' ? '#34D399' : 'rgba(255, 255, 255, 0.1)',
                  backgroundColor: activeTab === 'guard' ? '#10B981' : 'rgba(255, 255, 255, 0.05)',
                  color: activeTab === 'guard' ? '#FFFFFF' : '#94A3B8', fontWeight: 800, fontSize: '14px', cursor: 'pointer'
                }}
              >
                <ShieldCheck size={18} /> Gate Security Guard App
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Download Cards Grid */}
      <section style={{ padding: '60px 0 100px 0', background: '#020617' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          
          {activeTab === 'resident' ? (
            /* Resident App Card */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 25px 50px -12px rgba(79, 70, 229, 0.3)',
                display: 'grid',
                gridTemplateColumns: '1.2fr 0.8fr',
                gap: '40px',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 900, color: '#818CF8', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  FOR RESIDENTS, OWNERS & TENANTS
                </span>
                <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#FFFFFF', margin: '8px 0 16px 0' }}>
                  SocietySphere Resident Mobile App
                </h2>
                <p style={{ fontSize: '15px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '24px' }}>
                  Approve visitors with 1 tap, pay monthly maintenance via Razorpay, reserve clubhouse slots, and trigger Emergency SOS sirens.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2E8F0', fontSize: '13px', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="#34D399" />
                    <span>1-Tap Lock Screen Visitor Approval & Pre-Approved Passes</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2E8F0', fontSize: '13px', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="#34D399" />
                    <span>Razorpay Maintenance Payments with Instant GST PDF Receipts</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2E8F0', fontSize: '13px', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="#34D399" />
                    <span>1-Tap Emergency SOS Siren for Family Safety</span>
                  </div>
                </div>

                {/* Download Store Buttons */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <a
                    href="https://apps.apple.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 24px',
                      borderRadius: '14px',
                      background: '#000000',
                      color: 'white',
                      textDecoration: 'none',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      fontWeight: 700
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
                      padding: '12px 24px',
                      borderRadius: '14px',
                      background: '#000000',
                      color: 'white',
                      textDecoration: 'none',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      fontWeight: 700
                    }}
                  >
                    <Play size={24} color="#34D399" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#94A3B8' }}>GET IT ON</div>
                      <div style={{ fontSize: '15px', fontWeight: 900 }}>Google Play</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* QR Scanner Card */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.95)',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                textAlign: 'center'
              }}>
                <div style={{ width: '120px', height: '120px', backgroundColor: 'white', padding: '10px', borderRadius: '16px', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode size={100} color="#020617" />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>Scan to Install Resident App</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>Compatible with iOS 15.0+ and Android 8.0+</div>
              </div>
            </motion.div>
          ) : (
            /* Guard App Card */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.2)',
                display: 'grid',
                gridTemplateColumns: '1.2fr 0.8fr',
                gap: '40px',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 900, color: '#34D399', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  FOR GATEKEEPERS & SECURITY GUARDS
                </span>
                <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#FFFFFF', margin: '8px 0 16px 0' }}>
                  SocietySphere Guard App
                </h2>
                <p style={{ fontSize: '15px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '24px' }}>
                  Fast 5-second entry verification, QR passcode scanning, daily maid/cook attendance logging, and loud Emergency SOS sirens.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2E8F0', fontSize: '13px', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="#34D399" />
                    <span>Multilingual UI (English, Hindi, Kannada, Tamil, Telugu, Marathi)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2E8F0', fontSize: '13px', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="#34D399" />
                    <span>5-Second Fast Gate Verification & Passcode Reader</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2E8F0', fontSize: '13px', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="#34D399" />
                    <span>Instant Gate Siren Receiver for Emergency Incidents</span>
                  </div>
                </div>

                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 28px',
                    borderRadius: '14px',
                    background: '#10B981',
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: 900,
                    fontSize: '15px',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <Download size={20} />
                  <span>Download Guard APK / Play Store</span>
                </a>
              </div>

              {/* QR Scanner Card */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.95)',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                textAlign: 'center'
              }}>
                <div style={{ width: '120px', height: '120px', backgroundColor: 'white', padding: '10px', borderRadius: '16px', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode size={100} color="#020617" />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>Scan to Install Guard App</div>
                <div style={{ fontSize: '12px', color: '#34D399', marginTop: '4px' }}>Optimized for Gatekeeper Tablets & Smartphones</div>
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
