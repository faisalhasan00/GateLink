import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, Mail, MapPin, Apple, Play, Heart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function FooterSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer style={{
      background: isDark ? '#020617' : '#0F172A',
      color: '#94A3B8',
      paddingTop: '80px',
      paddingBottom: '40px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr', gap: '40px', marginBottom: '60px' }}>
          
          {/* Col 1: Brand Info */}
          <div>
            <Link to="/landing" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{
                background: '#FF385C',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 900,
                padding: '1px 6px',
                borderRadius: '2px',
                letterSpacing: '0.5px',
                lineHeight: '13px'
              }}>
                HomeHni
              </div>
              <div style={{
                color: '#FFFFFF',
                fontSize: '20px',
                fontWeight: 900,
                letterSpacing: '0.5px',
                lineHeight: '20px',
                marginTop: '1px'
              }}>
                Hood
              </div>
            </Link>
            <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#94A3B8', marginBottom: '20px', maxWidth: '320px' }}>
              India’s intelligent society management operating system. Empowering gated communities, residents, and gate security staff with real-time digital automation.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#CBD5E1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} color="#00B589" /> +91 (800) 456-7890 (Toll Free)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} color="#00B589" /> support@societysphere.com
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={14} color="#00B589" /> HSR Layout, Bengaluru, Karnataka
              </div>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 800, marginBottom: '16px', letterSpacing: '0.5px' }}>PLATFORM</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li><Link to="/features" style={{ color: '#94A3B8', textDecoration: 'none' }}>Visitor Pass</Link></li>
              <li><Link to="/features" style={{ color: '#94A3B8', textDecoration: 'none' }}>Guard Gatekeeper</Link></li>
              <li><Link to="/features" style={{ color: '#94A3B8', textDecoration: 'none' }}>Pay Maintenance Bill Online</Link></li>
              <li><Link to="/features" style={{ color: '#94A3B8', textDecoration: 'none' }}>Emergency SOS</Link></li>
              <li><Link to="/ecosystem" style={{ color: '#94A3B8', textDecoration: 'none' }}>Connected Ecosystem</Link></li>
            </ul>
          </div>

          {/* Col 3: Solutions Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 800, marginBottom: '16px', letterSpacing: '0.5px' }}>SOLUTIONS</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li><Link to="/solutions" style={{ color: '#94A3B8', textDecoration: 'none' }}>For Residents</Link></li>
              <li><Link to="/solutions" style={{ color: '#94A3B8', textDecoration: 'none' }}>For Security Guards</Link></li>
              <li><Link to="/solutions" style={{ color: '#94A3B8', textDecoration: 'none' }}>For Committee Members</Link></li>
              <li><Link to="/solutions" style={{ color: '#94A3B8', textDecoration: 'none' }}>For Property Managers</Link></li>
              <li><Link to="/pricing" style={{ color: '#94A3B8', textDecoration: 'none' }}>ROI Calculator</Link></li>
            </ul>
          </div>

          {/* Col 4: Knowledge Hub */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 800, marginBottom: '16px', letterSpacing: '0.5px' }}>RESOURCES</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li><Link to="/blog" style={{ color: '#94A3B8', textDecoration: 'none' }}>Society Insights Blog</Link></li>
              <li><Link to="/faq" style={{ color: '#94A3B8', textDecoration: 'none' }}>Help & FAQ</Link></li>
              <li><Link to="/docs" style={{ color: '#94A3B8', textDecoration: 'none' }}>API & Audit Docs</Link></li>
              <li><Link to="/privacy" style={{ color: '#94A3B8', textDecoration: 'none' }}>Privacy Policy</Link></li>
              <li><Link to="/terms" style={{ color: '#94A3B8', textDecoration: 'none' }}>Terms of Service</Link></li>
            </ul>
          </div>

          {/* Col 5: App Download Badges */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 800, marginBottom: '16px', letterSpacing: '0.5px' }}>GET MOBILE APPS</h4>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '16px' }}>
              Install SocietySphere Resident App and Guard App on your devices.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/download" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderRadius: '10px', background: '#1E293B', color: 'white', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', fontWeight: 700 }}>
                <Apple size={18} /> iOS Resident App
              </Link>
              <Link to="/download" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderRadius: '10px', background: '#1E293B', color: 'white', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', fontWeight: 700 }}>
                <Play size={18} color="#059669" /> Android Guard & Resident
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div style={{ paddingTop: '30px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748B' }}>
          <div>
            © {new Date().getFullYear()} SocietySphere OS. All rights reserved. Built for Indian Housing Societies.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/privacy" style={{ color: '#64748B', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: '#64748B', textDecoration: 'none' }}>Terms of Service</Link>
            <Link to="/cookies" style={{ color: '#64748B', textDecoration: 'none' }}>Cookie Preferences</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
