import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileDropdown({ userEmail, role = 'Society Admin', societyCode = '', isSuperAdmin = false }) {
  const navigate = useNavigate();
  const effectiveEmail = userEmail || (isSuperAdmin ? 'superadmin@societysphere.com' : 'admin@societysphere.com');
  const initial = effectiveEmail ? effectiveEmail.charAt(0).toUpperCase() : 'A';
  const name = effectiveEmail ? effectiveEmail.split('@')[0].replace('.', ' ') : 'Administrator';

  const handleClick = () => {
    navigate('/profile');
  };

  return (
    <div 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="User Profile Options"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        padding: '4px 8px 4px 4px',
        borderRadius: '12px',
        transition: 'background-color 0.2s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {/* Avatar (48x48 Circular) */}
      <div 
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '18px',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
          flexShrink: 0
        }}
      >
        {initial}
      </div>

      {/* User Info Block */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, textTransform: 'capitalize' }}>
          {name}
        </div>
        <div 
          title={effectiveEmail}
          style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            maxWidth: '180px',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            marginTop: '2px'
          }}
        >
          {effectiveEmail}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700, marginTop: '2px', display: 'flex', gap: '4px' }}>
          <span>{role}</span>
          <span>•</span>
          <code>{societyCode}</code>
        </div>
      </div>
    </div>
  );
}
