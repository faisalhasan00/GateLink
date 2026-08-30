import React from 'react';
import { Phone } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function NavActions({
  isDark,
  societyAdminUrl,
  onEnrollClick,
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
      {/* Phone Call Launcher */}
      <a
        href="tel:+919121863117"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '9px',
          textDecoration: 'none',
          color: isDark ? '#E2E8F0' : '#1E293B',
          fontSize: '14px',
          fontWeight: 700,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: isDark ? '#334155' : '#1E3A8A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <Phone size={13} fill="white" />
        </div>
        <span>+91 91218 63117</span>
      </a>

      {/* Outlined Society Login */}
      <a
        href={societyAdminUrl}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 20px',
          borderRadius: '12px',
          border: isDark ? '1.5px solid rgba(255,255,255,0.3)' : '1.5px solid #1E3A8A',
          backgroundColor: 'transparent',
          color: isDark ? '#FFFFFF' : '#1E3A8A',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: 700,
          fontFamily: 'Inter, sans-serif',
          height: '42px',
          boxSizing: 'border-box',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : '#F0F9FF';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        Society Login
      </a>

      {/* Primary Enroll Button */}
      <Button
        variant="primary"
        size="medium"
        onClick={onEnrollClick}
        style={{
          height: '42px',
          padding: '0 22px',
          fontSize: '14px',
          fontWeight: 700,
          borderRadius: '12px',
          boxShadow: '0 4px 14px rgba(30, 58, 138, 0.25)',
        }}
      >
        Enroll Society
      </Button>
    </div>
  );
}
