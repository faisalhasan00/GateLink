import React from 'react';

export default function HomeHniHoodLogo({ isDark = false, size = 'medium' }) {
  const iconHeight = size === 'small' ? '28px' : size === 'large' ? '44px' : '34px';
  const fontSize = size === 'small' ? '18px' : size === 'large' ? '28px' : '22px';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', userSelect: 'none' }}>
      {/* SVG House Icon replica matching reference image */}
      <svg 
        height={iconHeight} 
        viewBox="0 0 120 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Orange Roof with Chimney */}
        <path d="M15 48L60 12L105 48H92V82H28V48H15Z" fill="#F97316" />
        <rect x="75" y="16" width="10" height="22" fill="#F97316" />
        
        {/* White / Navy Window Panes */}
        <rect x="42" y="44" width="16" height="16" fill="#FFFFFF" rx="1" />
        <rect x="62" y="44" width="16" height="16" fill="#FFFFFF" rx="1" />
        <rect x="42" y="64" width="16" height="16" fill="#FFFFFF" rx="1" />
        <rect x="62" y="64" width="16" height="16" fill="#FFFFFF" rx="1" />
        
        {/* Navy Foundation Swoop Curve */}
        <path d="M5 88C35 72 85 72 115 88C85 82 35 82 5 88Z" fill="#0F2C59" />
      </svg>

      {/* Typography: Home in Navy, HNI in Orange, Hood in Navy/Orange */}
      <div style={{ display: 'flex', alignItems: 'center', fontSize: fontSize, fontWeight: 900, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.5px' }}>
        <span style={{ color: isDark ? '#FFFFFF' : '#0F2C59' }}>Home</span>
        <span style={{ color: '#F97316', marginLeft: '3px' }}>Hni</span>
        <span style={{ color: isDark ? '#38BDF8' : '#0F2C59', marginLeft: '3px' }}>Hood</span>
      </div>
    </div>
  );
}
