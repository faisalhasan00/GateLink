import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Phone, Shield, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar({ onOpenDemo }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        height: '64px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div style={{ maxWidth: '1320px', width: '100%', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Left Side: Brand Logo + Nav Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          
          {/* Stacked Red/Dark Brand Badge */}
          <Link to="/landing" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
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
              color: isDark ? '#FFFFFF' : '#2C2C2C',
              fontSize: '18px',
              fontWeight: 900,
              letterSpacing: '0.5px',
              lineHeight: '18px',
              marginTop: '1px'
            }}>
              Hood
            </div>
          </Link>

          {/* Nav Items Center */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            
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
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  paddingTop: '8px',
                  zIndex: 100
                }}>
                  <div style={{
                    background: isDark ? '#1E293B' : '#FFFFFF',
                    borderRadius: '2px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB',
                    minWidth: '170px'
                  }}>
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
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  paddingTop: '10px',
                  zIndex: 100
                }}>
                  <div style={{
                    background: isDark ? '#1E293B' : '#FFFFFF',
                    borderRadius: '4px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB',
                    padding: '8px 0',
                    minWidth: '200px'
                  }}>
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

        </div>

        {/* Right Side: Phone Number + Society Login + Enroll your society */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          {/* Phone Call Launcher */}
          <a
            href="tel:+919119300000"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: isDark ? '#E2E8F0' : '#333333',
              fontSize: '14px',
              fontWeight: 700
            }}
          >
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: isDark ? '#334155' : '#4A4A4A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Phone size={13} fill="white" />
            </div>
            <span>+91 91193 00000</span>
          </a>

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #E2E8F0',
              color: isDark ? '#FFFFFF' : '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isDark ? <Sun size={15} color="#FBBF24" /> : <Moon size={15} color="#2563EB" />}
          </button>

          {/* Outlined "Society Login" Button */}
          <Link
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 20px',
              borderRadius: '2px',
              border: isDark ? '1px solid rgba(255,255,255,0.3)' : '1px solid #707070',
              backgroundColor: 'transparent',
              color: isDark ? '#FFFFFF' : '#333333',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              height: '38px',
              boxSizing: 'border-box'
            }}
          >
            Society Login
          </Link>

          {/* Solid Emerald Green "Enroll your society" Button */}
          <button
            onClick={onOpenDemo}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 24px',
              borderRadius: '2px',
              backgroundColor: '#00B589',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              height: '38px',
              boxSizing: 'border-box',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#009E77'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00B589'}
          >
            Enroll your society
          </button>

        </div>

      </div>
    </header>
  );
}
