import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Phone, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import HomeHniHoodLogo from '../../components/ui/HomeHniHoodLogo';

export default function Navbar({ onOpenDemo }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 1024 : false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const societyAdminUrl = import.meta.env.VITE_SOCIETY_ADMIN_URL || 
    (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:5174/login' 
      : 'https://app.societysphere.com/login');


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
      if (window.innerWidth > 1024) setMobileMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleEnrollClick = () => {
    setMobileMenuOpen(false);
    const formEl = document.getElementById('hero-enrollment-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (onOpenDemo) {
      onOpenDemo();
    }
  };

  return (
    <header 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.2s ease',
        backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
        boxShadow: isScrolled ? '0 2px 10px rgba(0, 0, 0, 0.06)' : 'none',
        height: '60px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div style={{ maxWidth: '1320px', width: '100%', margin: '0 auto', padding: isMobile ? '0 12px' : '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Left Side: Brand Logo + Desktop Nav Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          {/* HomeHniHood Brand Logo - Device Responsive */}
          <Link to="/landing" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <HomeHniHoodLogo isDark={isDark} size={isMobile ? 'responsive' : 'medium'} />
          </Link>

          {/* Desktop Nav Items */}
          {!isMobile && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              
              {/* About Us Dropdown */}
              <div 
                style={{ position: 'relative', cursor: 'pointer' }}
                onMouseEnter={() => setAboutDropdownOpen(true)}
                onMouseLeave={() => setAboutDropdownOpen(false)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 600, color: isDark ? '#E2E8F0' : '#444444', position: 'relative', paddingBottom: '4px' }}>
                  <span>About Us</span>
                  <ChevronDown size={15} color={isDark ? '#94A3B8' : '#666666'} />
                  {aboutDropdownOpen && (
                    <div style={{ position: 'absolute', bottom: '-4px', left: 0, right: 0, height: '2px', backgroundColor: '#FF385C' }} />
                  )}
                </div>

                {aboutDropdownOpen && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: '8px', zIndex: 100 }}>
                    <div style={{ background: isDark ? '#1E293B' : '#FFFFFF', borderRadius: '2px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB', minWidth: '170px' }}>
                      <Link to="/about" style={{ display: 'block', padding: '12px 18px', color: isDark ? '#E2E8F0' : '#444444', textDecoration: 'none', fontSize: '14px', fontWeight: 500, borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #EAEAEA' }}>About Us</Link>
                      <Link to="/ecosystem" style={{ display: 'block', padding: '12px 18px', color: isDark ? '#E2E8F0' : '#444444', textDecoration: 'none', fontSize: '14px', fontWeight: 500, borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #EAEAEA' }}>UAE</Link>
                      <Link to="/blog" style={{ display: 'block', padding: '12px 18px', color: isDark ? '#E2E8F0' : '#444444', textDecoration: 'none', fontSize: '14px', fontWeight: 500, borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #EAEAEA' }}>Blog</Link>
                      <Link to="/privacy" style={{ display: 'block', padding: '12px 18px', color: isDark ? '#E2E8F0' : '#444444', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Privacy Policy</Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Features Dropdown */}
              <div 
                style={{ position: 'relative', cursor: 'pointer' }}
                onMouseEnter={() => setFeaturesDropdownOpen(true)}
                onMouseLeave={() => setFeaturesDropdownOpen(false)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 600, color: isDark ? '#E2E8F0' : '#444444' }}>
                  <span>Features</span>
                  <ChevronDown size={15} color={isDark ? '#94A3B8' : '#666666'} />
                </div>

                {featuresDropdownOpen && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: '10px', zIndex: 100 }}>
                    <div style={{ background: isDark ? '#1E293B' : '#FFFFFF', borderRadius: '4px', boxShadow: '0 10px 25px rgba(0,0,0,0.12)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB', padding: '8px 0', minWidth: '200px' }}>
                      <Link to="/features" style={{ display: 'block', padding: '8px 16px', color: isDark ? '#E2E8F0' : '#333333', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Visitor Gatekeeper Pass</Link>
                      <Link to="/features" style={{ display: 'block', padding: '8px 16px', color: isDark ? '#E2E8F0' : '#333333', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Guard Gatekeeper App</Link>
                      <Link to="/features" style={{ display: 'block', padding: '8px 16px', color: isDark ? '#E2E8F0' : '#333333', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Razorpay Billing</Link>
                      <Link to="/download" style={{ display: 'block', padding: '8px 16px', color: isDark ? '#E2E8F0' : '#333333', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Download Apps</Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Link: Contact Us */}
              <Link to="/contact" style={{ textDecoration: 'none', fontSize: '14px', fontWeight: 600, color: isDark ? '#E2E8F0' : '#444444' }}>
                Contact Us
              </Link>
            </nav>
          )}
        </div>

        {/* Right Side Actions */}
        {!isMobile ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Phone Call Launcher */}
            <a
              href="tel:+919999999999"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: isDark ? '#E2E8F0' : '#333333', fontSize: '14px', fontWeight: 700 }}
            >
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: isDark ? '#334155' : '#4A4A4A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Phone size={13} fill="white" />
              </div>
              <span>+91 99999 99999</span>
            </a>

            {/* Outlined "Society Login" */}
            <a
              href={societyAdminUrl}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '6px 16px', borderRadius: '2px', border: isDark ? '1px solid rgba(255,255,255,0.3)' : '1px solid #707070', backgroundColor: 'transparent', color: isDark ? '#FFFFFF' : '#333333', textDecoration: 'none', fontSize: '13px', fontWeight: 600, height: '36px', boxSizing: 'border-box' }}
            >
              Society Login
            </a>

            {/* Solid Emerald Green "Enroll your society" */}
            <button
              onClick={handleEnrollClick}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '6px 20px', borderRadius: '2px', backgroundColor: '#00B589', color: '#FFFFFF', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', height: '36px', boxSizing: 'border-box', transition: 'background-color 0.2s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#009E77'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00B589'}
            >
              Enroll your society
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Mobile "Enroll your society" Button */}
            <button
              onClick={handleEnrollClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5px 10px',
                borderRadius: '2px',
                backgroundColor: '#00B589',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
                height: '32px',
                boxSizing: 'border-box',
                whiteSpace: 'nowrap'
              }}
            >
              Enroll your society
            </button>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              style={{ width: '32px', height: '32px', borderRadius: '4px', background: isDark ? '#1E293B' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB', color: isDark ? '#FFFFFF' : '#333333', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        )}

      </div>

      {/* Mobile Drawer Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
          zIndex: 999,
          padding: '20px 24px 32px 24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Quick Links Section */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 900, color: '#00B589', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>PAGES & SOLUTIONS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', fontSize: '16px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#2C2C2C' }}>About Us</Link>
                <Link to="/features" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', fontSize: '16px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#2C2C2C' }}>Features & Gatekeeper</Link>
                <Link to="/solutions" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', fontSize: '16px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#2C2C2C' }}>Role Solutions</Link>
                <Link to="/ecosystem" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', fontSize: '16px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#2C2C2C' }}>UAE Operations</Link>
                <Link to="/blog" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', fontSize: '16px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#2C2C2C' }}>Blog & Case Studies</Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', fontSize: '16px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#2C2C2C' }}>Contact Us</Link>
              </div>
            </div>

            {/* Direct Contact Phone */}
            <div style={{ padding: '16px', borderRadius: '4px', background: isDark ? '#1E293B' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Phone size={18} color="#00B589" />
              <div>
                <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#666666', fontWeight: 600 }}>Toll Free Onboarding Desk</div>
                <a href="tel:+919119300000" style={{ textDecoration: 'none', fontSize: '15px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C' }}>+91 91193 00000</a>
              </div>
            </div>

          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
            <a
              href={societyAdminUrl}
              onClick={() => setMobileMenuOpen(false)}
              style={{ width: '100%', padding: '12px', borderRadius: '2px', border: isDark ? '1px solid rgba(255,255,255,0.3)' : '1px solid #707070', backgroundColor: 'transparent', color: isDark ? '#FFFFFF' : '#333333', textAlign: 'center', textDecoration: 'none', fontSize: '15px', fontWeight: 700, boxSizing: 'border-box' }}
            >
              Society Login
            </a>

            <button
              onClick={handleEnrollClick}
              style={{ width: '100%', padding: '14px', borderRadius: '2px', backgroundColor: '#00B589', color: '#FFFFFF', border: 'none', fontSize: '15px', fontWeight: 800, cursor: 'pointer', textAlign: 'center' }}
            >
              Enroll your society
            </button>
          </div>

        </div>
      )}
    </header>
  );
}
