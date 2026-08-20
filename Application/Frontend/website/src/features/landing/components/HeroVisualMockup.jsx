import React from 'react';
import { motion } from 'framer-motion';

export default function HeroVisualMockup({ isDark, isMobileScreen }) {
  if (isMobileScreen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}
    >
      <div style={{ position: 'relative', width: '100%', maxWidth: '560px' }}>
        <img
          src="/assets/hero_illustration.png"
          alt="GateLink Management App Illustration"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            borderRadius: '16px',
            boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.5)' : '0 20px 50px rgba(0,0,0,0.08)'
          }}
        />

        {/* Floating Verified Trust Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '-15px',
            right: '20px',
            background: isDark ? '#0F172A' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '10px 16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)'
            }}
          />
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>99.9% UPTIME</div>
            <div style={{ fontSize: '10px', color: isDark ? '#94A3B8' : '#64748B' }}>50,000+ Gate Passes Today</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
