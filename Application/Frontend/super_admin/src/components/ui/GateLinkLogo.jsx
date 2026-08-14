import React from 'react';
import logoImg from '../../assets/logo.png';

export default function GateLinkLogo({ isDark = false, size = 'medium' }) {
  const height = size === 'small' ? '28px' : size === 'large' ? '46px' : size === 'responsive' ? 'clamp(24px, 5vw, 36px)' : '32px';

  return (
    <div style={{ display: 'flex', alignItems: 'center', userSelect: 'none', maxWidth: '100%' }}>
      <img
        src={logoImg}
        alt="GateLink"
        style={{
          height: height,
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          filter: isDark ? 'brightness(0) invert(1)' : 'none',
          display: 'block',
        }}
      />
    </div>
  );
}

export { GateLinkLogo };
