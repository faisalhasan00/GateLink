import React from 'react';
import { Apple, Play, Globe } from 'lucide-react';

export default function HeroAppStoreBadges({ isDark }) {
  const getSocietyAdminUrl = () => {
    if (import.meta.env.VITE_SOCIETY_ADMIN_URL) return import.meta.env.VITE_SOCIETY_ADMIN_URL;
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      const host = window.location.hostname;
      if (host === 'localhost' || host === '127.0.0.1') return 'http://localhost:5174';
    }
    return 'https://app.gatelink.in';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '8px',
            background: isDark ? '#020617' : '#0F172A',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '12px',
            fontWeight: 700
          }}
        >
          <Apple size={16} />
          <span>App Store</span>
          <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: '#F59E0B', color: '#000000', fontWeight: 800, marginLeft: '2px' }}>
            Coming Soon
          </span>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '8px',
            background: isDark ? '#020617' : '#0F172A',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '12px',
            fontWeight: 700
          }}
        >
          <Play size={15} color="#0EA5E9" fill="#0EA5E9" />
          <span>Google Play</span>
          <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: '#F59E0B', color: '#000000', fontWeight: 800, marginLeft: '2px' }}>
            Coming Soon
          </span>
        </div>

        <a
          href={getSocietyAdminUrl()}
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
