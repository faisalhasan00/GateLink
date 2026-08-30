import React from 'react';
import logoImg from '../../assets/logo.png';

export default function GateLinkLogo({ isDark = false, size = 'medium', className = '' }) {
  const height = size === 'small' 
    ? '36px' 
    : size === 'large' 
    ? '68px' 
    : size === 'responsive' 
    ? 'clamp(40px, 6.5vw, 54px)' 
    : size === 'nav'
    ? '52px'
    : '50px';

  return (
    <div className={`gatelink-logo-wrap ${className}`} style={{ display: 'flex', alignItems: 'center', userSelect: 'none', maxWidth: '100%' }}>
      <img
        src={logoImg}
        alt="GateLink - Society Management Software"
        style={{
          height: height,
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block',
          filter: isDark ? 'brightness(1.15) drop-shadow(0 2px 8px rgba(255,255,255,0.2))' : 'drop-shadow(0 1px 3px rgba(0,0,0,0.08))',
          transition: 'all 0.2s ease',
        }}
      />
    </div>
  );
}

export { GateLinkLogo };
