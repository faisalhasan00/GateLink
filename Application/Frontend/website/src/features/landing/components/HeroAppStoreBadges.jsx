import React from 'react';
import { Apple, Play, Globe } from 'lucide-react';

export default function HeroAppStoreBadges({ isDark }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <a
          href="https://apps.apple.com"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '8px',
            background: isDark ? '#020617' : '#0F172A',
            color: '#FFFFFF',
            textDecoration: 'none',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '12px',
            fontWeight: 700
          }}
        >
          <Apple size={16} />
          <span>App Store</span>
        </a>

        <a
          href="https://play.google.com/store/apps"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '8px',
            background: isDark ? '#020617' : '#0F172A',
            color: '#FFFFFF',
            textDecoration: 'none',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '12px',
            fontWeight: 700
          }}
        >
          <Play size={15} color="#0EA5E9" fill="#0EA5E9" />
          <span>Google Play</span>
        </a>

        <a
          href="https://app.gatelink.in"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '8px',
            background: isDark ? 'rgba(14, 165, 233, 0.1)' : '#E0F2FE',
            color: '#0EA5E9',
            textDecoration: 'none',
            border: '1px solid rgba(14, 165, 233, 0.3)',
            fontSize: '12px',
            fontWeight: 800
          }}
        >
          <Globe size={15} />
          <span>Web Portal</span>
        </a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
        <span>✔ 100% Free Setup & Onboarding</span>
        <span>•</span>
        <span>✔ No Credit Card Required</span>
        <span>•</span>
        <span>✔ 24/7 Dedicated Support</span>
      </div>
    </div>
  );
}
