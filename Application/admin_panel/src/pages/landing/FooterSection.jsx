import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer style={{ background: '#020617', borderTop: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8', paddingTop: '60px', paddingBottom: '30px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.2fr', gap: '32px', marginBottom: '50px' }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Shield size={20} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
                Society<span style={{ color: '#818CF8' }}>Sphere</span>
              </span>
            </div>

            <p style={{ fontSize: '13px', lineHeight: 1.6, maxWidth: '280px', color: '#64748B' }}>
              The complete enterprise operating system for modern housing societies, apartment complexes, and gated communities across India.
            </p>
          </div>

          {/* Platform Pages */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 800, marginBottom: '16px' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <Link to="/features" style={{ color: '#94A3B8', textDecoration: 'none' }}>12 Core Features</Link>
              <Link to="/solutions" style={{ color: '#94A3B8', textDecoration: 'none' }}>User Personas</Link>
              <Link to="/ecosystem" style={{ color: '#94A3B8', textDecoration: 'none' }}>Data Ecosystem</Link>
              <Link to="/pricing" style={{ color: '#94A3B8', textDecoration: 'none' }}>SaaS Pricing</Link>
            </div>
          </div>

          {/* Resources & Knowledge */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 800, marginBottom: '16px' }}>Resources</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <Link to="/blog" style={{ color: '#818CF8', textDecoration: 'none', fontWeight: 700 }}>Blog & Insights</Link>
              <Link to="/faq" style={{ color: '#94A3B8', textDecoration: 'none' }}>FAQ Directory</Link>
              <Link to="/help" style={{ color: '#94A3B8', textDecoration: 'none' }}>Help Center</Link>
              <Link to="/docs" style={{ color: '#94A3B8', textDecoration: 'none' }}>API Documentation</Link>
            </div>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 800, marginBottom: '16px' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <Link to="/privacy" style={{ color: '#94A3B8', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link to="/terms" style={{ color: '#94A3B8', textDecoration: 'none' }}>Terms of Service</Link>
              <Link to="/cookies" style={{ color: '#94A3B8', textDecoration: 'none' }}>Cookie Policy</Link>
              <Link to="/contact" style={{ color: '#34D399', textDecoration: 'none', fontWeight: 700 }}>Book Demo</Link>
            </div>
          </div>

          {/* Portals & Security */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 800, marginBottom: '16px' }}>Portals</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <Link to="/login" style={{ color: '#818CF8', textDecoration: 'none', fontWeight: 700 }}>Society Admin Login</Link>
              <Link to="/super-admin/login" style={{ color: '#34D399', textDecoration: 'none', fontWeight: 700 }}>Super Admin Portal</Link>
            </div>
            <div style={{ marginTop: '16px', fontSize: '11px', color: '#34D399', fontWeight: 700 }}>
              ✓ 256-Bit SSL Encrypted Uptime
            </div>
          </div>

        </div>

        <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', marginBottom: '24px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748B' }}>
          <div>
            © 2026 SocietySphere Inc. All rights reserved. Built with precision for Indian Societies.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Made with <Heart size={12} color="#EF4444" fill="#EF4444" /> for Modern Housing Communities
          </div>
        </div>

      </div>
    </footer>
  );
}
