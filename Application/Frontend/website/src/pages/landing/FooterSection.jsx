import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Apple, Play } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import GateLinkLogo from '../../components/ui/GateLinkLogo';

export default function FooterSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer style={{
      background: isDark ? '#020617' : '#0F172A',
      color: '#94A3B8',
      paddingTop: '60px',
      paddingBottom: '36px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Responsive Grid Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '48px' }}>
          
          {/* Col 1: Brand Info & Social Media */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link to="/landing" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>
              <GateLinkLogo isDark={true} size="medium" />
            </Link>
            <p style={{ fontSize: '13px', lineHeight: 1.65, color: '#94A3B8', marginBottom: '18px', maxWidth: '320px' }}>
              India’s intelligent society management operating system. Empowering gated communities, residents, and gate security staff with real-time digital automation.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#CBD5E1', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} color="#0EA5E9" /> <a href="tel:+919999999999" style={{ color: '#CBD5E1', textDecoration: 'none' }}>+91 99999 99999</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} color="#0EA5E9" /> <a href="mailto:support@gatelink.in" style={{ color: '#CBD5E1', textDecoration: 'none' }}>support@gatelink.in</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={14} color="#0EA5E9" /> HITEC City, Hyderabad, Telangana
              </div>
            </div>

            {/* Social Media Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" style={{ width: '32px', height: '32px', borderRadius: '4px', background: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/></svg>
              </a>
              {/* Twitter / X */}
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" style={{ width: '32px', height: '32px', borderRadius: '4px', background: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" style={{ width: '32px', height: '32px', borderRadius: '4px', background: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/></svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/gatelink.in?igsi=MWpoNXVsbDF2czQ2Ng==" target="_blank" rel="noreferrer" aria-label="Instagram" style={{ width: '32px', height: '32px', borderRadius: '4px', background: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 800, marginBottom: '14px', letterSpacing: '0.5px' }}>PLATFORM</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px' }}>
              <li><Link to="/features" style={{ color: '#94A3B8', textDecoration: 'none' }}>Visitor Pass</Link></li>
              <li><Link to="/features" style={{ color: '#94A3B8', textDecoration: 'none' }}>Guard Gatekeeper</Link></li>
              <li><Link to="/features" style={{ color: '#94A3B8', textDecoration: 'none' }}>Pay Maintenance Bill Online</Link></li>
              <li><Link to="/features" style={{ color: '#94A3B8', textDecoration: 'none' }}>Emergency SOS</Link></li>
            </ul>
          </div>

          {/* Col 3: Solutions Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 800, marginBottom: '14px', letterSpacing: '0.5px' }}>SOLUTIONS</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px' }}>
              <li><Link to="/solutions" style={{ color: '#94A3B8', textDecoration: 'none' }}>For Residents</Link></li>
              <li><Link to="/solutions" style={{ color: '#94A3B8', textDecoration: 'none' }}>For Security Guards</Link></li>
              <li><Link to="/solutions" style={{ color: '#94A3B8', textDecoration: 'none' }}>For Committee Members</Link></li>
              <li><Link to="/solutions" style={{ color: '#94A3B8', textDecoration: 'none' }}>For Property Managers</Link></li>
              <li><Link to="/partners" style={{ color: '#94A3B8', textDecoration: 'none' }}>Partner Program</Link></li>
              <li><Link to="/contact" style={{ color: '#94A3B8', textDecoration: 'none' }}>Get Custom Proposal</Link></li>
            </ul>
          </div>

          {/* Col 4: Knowledge Hub */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 800, marginBottom: '14px', letterSpacing: '0.5px' }}>RESOURCES</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px' }}>
              <li><Link to="/blog" style={{ color: '#94A3B8', textDecoration: 'none' }}>Society Insights Blog</Link></li>
              <li><Link to="/faq" style={{ color: '#94A3B8', textDecoration: 'none' }}>Help & FAQ</Link></li>
              <li><Link to="/docs" style={{ color: '#94A3B8', textDecoration: 'none' }}>API & Audit Docs</Link></li>
              <li><Link to="/privacy" style={{ color: '#94A3B8', textDecoration: 'none' }}>Privacy Policy</Link></li>
              <li><Link to="/terms" style={{ color: '#94A3B8', textDecoration: 'none' }}>Terms of Service</Link></li>
            </ul>
          </div>

          {/* Col 5: App Download Badges */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 800, marginBottom: '14px', letterSpacing: '0.5px' }}>GET MOBILE APPS</h4>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '14px', lineHeight: 1.5 }}>
              Install GateLink Resident App and Guard App on your mobile devices.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/download" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '4px', background: '#1E293B', color: 'white', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', fontWeight: 700 }}>
                <Apple size={16} /> iOS Resident App
              </Link>
              <Link to="/download" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '4px', background: '#1E293B', color: 'white', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', fontWeight: 700 }}>
                <Play size={16} color="#0EA5E9" /> Android Guard & Resident
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Policy Bar */}
        <div style={{
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          fontSize: '12px',
          color: '#64748B'
        }}>
          <div>
            © {new Date().getFullYear()} GateLink. All rights reserved. Built for Modern Housing Societies & Gated Communities.
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/privacy" style={{ color: '#64748B', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: '#64748B', textDecoration: 'none' }}>Terms of Service</Link>
            <Link to="/cookies" style={{ color: '#64748B', textDecoration: 'none' }}>Cookie Preferences</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
