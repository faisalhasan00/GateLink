import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Home, HelpCircle, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';

export default function NotFoundPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div style={{ background: isDark ? '#020617' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SeoHead 
        title="404 - Page Not Found | GateLink" 
        description="The page you are looking for does not exist or has been moved on GateLink."
        canonicalUrl="https://gatelink.in/404"
        robots="noindex, nofollow"
      />

      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 60px 24px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ maxWidth: '560px', width: '100%', textAlign: 'center', background: isDark ? '#0F172A' : '#FFFFFF', padding: '48px 32px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
        >
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <ShieldAlert size={32} color="#EF4444" />
          </div>

          <h1 style={{ fontSize: '36px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '12px', lineHeight: 1.2 }}>
            404 — Page Not Found
          </h1>

          <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6, marginBottom: '28px' }}>
            The requested page URL could not be located. It may have been renamed, moved, or deleted.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/" 
              style={{ padding: '12px 22px', borderRadius: '12px', background: '#1E3A8A', color: '#FFFFFF', textDecoration: 'none', fontWeight: 700, fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(30, 58, 138, 0.35)' }}
            >
              <Home size={16} /> Back to Homepage
            </Link>

            <Link 
              to="/faq" 
              style={{ padding: '12px 22px', borderRadius: '12px', background: isDark ? '#1E293B' : '#F1F5F9', color: isDark ? '#FFFFFF' : '#0F172A', textDecoration: 'none', fontWeight: 700, fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #CBD5E1' }}
            >
              <HelpCircle size={16} /> Visit Help Center
            </Link>
          </div>
        </motion.div>
      </main>

      <FooterSection />
    </div>
  );
}
