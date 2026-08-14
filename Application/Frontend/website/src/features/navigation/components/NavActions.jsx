import React from 'react';
import { Phone } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function NavActions({
  isDark,
  societyAdminUrl,
  onEnrollClick,
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      {/* Phone Call Launcher */}
      <a
        href="tel:+919999999999"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          color: isDark ? '#E2E8F0' : '#333333',
          fontSize: '14px',
          fontWeight: 700,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: isDark ? '#334155' : '#4A4A4A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <Phone size={13} fill="white" />
        </div>
        <span>+91 99999 99999</span>
      </a>

      {/* Outlined Society Login */}
      <a
        href={societyAdminUrl}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px 18px',
          borderRadius: '12px',
          border: isDark ? '1.5px solid rgba(255,255,255,0.3)' : '1.5px solid #1E3A8A',
          backgroundColor: 'transparent',
          color: isDark ? '#FFFFFF' : '#1E3A8A',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 700,
          fontFamily: 'Inter, sans-serif',
          height: '38px',
          boxSizing: 'border-box',
          transition: 'all 0.2s ease',
        }}
      >
        Society Login
      </a>

      {/* Primary Navy "Enroll your society" */}
      <Button variant="primary" size="medium" onClick={onEnrollClick}>
        Enroll your society
      </Button>
    </div>
  );
}
