import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import HeroQuickEnrollForm from '../../features/landing/components/HeroQuickEnrollForm';
import HeroAppStoreBadges from '../../features/landing/components/HeroAppStoreBadges';
import HeroVisualMockup from '../../features/landing/components/HeroVisualMockup';

export default function HeroSection({ onOpenDemo }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isMobileScreen, setIsMobileScreen] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobileScreen(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section
      id="home"
      style={{
        paddingTop: '96px',
        paddingBottom: '60px',
        background: '#FFFFFF',
        position: 'relative',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0'
      }}
    >
      <div
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          flexDirection: isMobileScreen ? 'column' : 'row',
          gap: '40px',
          alignItems: 'center'
        }}
      >
        {/* Mobile Top Illustration */}
        {isMobileScreen && (
          <div style={{ width: '100%', maxWidth: '380px', margin: '0 auto 10px auto', textAlign: 'center' }}>
            <img
              src="/assets/hero_illustration.png"
              alt="GateLink Management App Illustration"
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px' }}
            />
          </div>
        )}

        {/* Left Side: Copy + Form + Badges */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ flex: 1, width: '100%' }}
        >
          {/* Main Headline */}
          <h1
            style={{
              fontSize: '44px',
              fontWeight: 900,
              color: isDark ? '#FFFFFF' : '#2C2C2C',
              letterSpacing: '-1px',
              lineHeight: 1.15,
              marginBottom: '16px'
            }}
          >
            Smart Society Management Software for Gated Communities
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '16px',
              color: isDark ? '#94A3B8' : '#555555',
              lineHeight: 1.6,
              marginBottom: '16px'
            }}
          >
            The intelligent operating system for modern gated communities.
          </p>

          {/* Quick Enrollment Form Component */}
          <HeroQuickEnrollForm
            isDark={isDark}
            isMobileScreen={isMobileScreen}
            onOpenDemo={onOpenDemo}
          />

          {/* App Store Download Badges */}
          <HeroAppStoreBadges isDark={isDark} />
        </motion.div>

        {/* Right Desktop Visual Mockup Component */}
        <HeroVisualMockup isDark={isDark} isMobileScreen={isMobileScreen} />
      </div>
    </section>
  );
}
