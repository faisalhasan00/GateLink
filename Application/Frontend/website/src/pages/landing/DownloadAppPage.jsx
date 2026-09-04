import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import SeoHead from '../../components/seo/SeoHead';
import { useTheme } from '../../context/ThemeContext';
import { Smartphone, UserCheck, ShieldCheck } from 'lucide-react';
import ResidentDownloadCard from '../../features/download/components/ResidentDownloadCard';
import GuardDownloadCard from '../../features/download/components/GuardDownloadCard';
import AppFeatureComparison from '../../features/download/components/AppFeatureComparison';

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
      <section
        style={{
          paddingTop: '130px',
          paddingBottom: '50px',
          background: isDark
            ? 'radial-gradient(circle at 50% 10%, #1E3A8A33 0%, #0F172A 80%)'
            : 'radial-gradient(circle at 50% 10%, #EFF6FF 0%, #FFFFFF 80%)',
          borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E5E7EB',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7',
                color: isDark ? '#FBBF24' : '#D97706',
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}
            >
              <Smartphone size={14} /> NATIVE iOS & ANDROID MOBILE APPS — COMING SOON
            </div>

            <h1
              style={{
                fontSize: '44px',
                fontWeight: 900,
                color: isDark ? '#FFFFFF' : '#1E293B',
                letterSpacing: '-1.5px',
                margin: '0 0 16px 0',
                lineHeight: 1.15
              }}
            >
              GateLink Mobile Apps — Launching Soon
            </h1>

            <p
              style={{
                fontSize: '17px',
                color: isDark ? '#94A3B8' : '#64748B',
                maxWidth: '680px',
                margin: '0 auto 32px auto',
                lineHeight: 1.6
              }}
            >
              Our native iOS and Android apps for residents and gate security guards are coming soon! In the meantime, access all society management features via our Web Portal.
            </p>

            {/* App Selection Tabs */}
            <div
              style={{
                display: 'inline-flex',
                padding: '4px',
                borderRadius: '14px',
                background: isDark ? '#1E293B' : '#F1F5F9',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                gap: '6px'
              }}
            >
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
                  color: activeTab === 'resident' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B',
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
                  color: activeTab === 'guard' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B',
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
      <section style={{ padding: '60px 0 60px 0', backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px' }}>
          {activeTab === 'resident' ? (
            <ResidentDownloadCard isDark={isDark} onOpenDemo={() => setIsDemoModalOpen(true)} />
          ) : (
            <GuardDownloadCard isDark={isDark} onOpenDemo={() => setIsDemoModalOpen(true)} />
          )}
        </div>
      </section>

      {/* Feature Comparison Table Component */}
      <AppFeatureComparison isDark={isDark} />

      <FooterSection />

      {isDemoModalOpen && (
        <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
      )}
    </div>
  );
}
