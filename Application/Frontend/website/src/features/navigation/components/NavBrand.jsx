import React from 'react';
import { Link } from 'react-router-dom';
import GateLinkLogo from '../../../components/ui/GateLinkLogo';

export default function NavBrand({ isDark, isMobile }) {
  return (
    <Link to="/landing" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
      <GateLinkLogo isDark={isDark} size={isMobile ? 'responsive' : 'nav'} />
    </Link>
  );
}
