import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X, ArrowRight, User, Sun, Moon, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar({ onOpenDemo }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/landing' },
    { name: 'Features', href: '/features' },
    { name: 'Solutions', href: '/solutions' },
    { name: 'Ecosystem', href: '/ecosystem' },
    { name: 'Proposal', href: '/landing#proposal' },
    { name: 'Contact', href: '/contact' },
  ];

  const isDark = theme === 'dark';

  return (
    <header 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.25s ease',
        backgroundColor: isScrolled ? (isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)') : (isDark ? '#0F172A' : '#FFFFFF'),
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        borderBottom: isScrolled ? (isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0') : '1px solid transparent',
        boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none',
        padding: '16px 0'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <Link to="/landing" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
          }}>
            <Shield size={22} color="#FFFFFF" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
              Society<span style={{ color: '#2563EB' }}>Sphere</span>
            </span>
            <span style={{ fontSize: '10px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 700, letterSpacing: '1px' }}>
              SOCIETY OS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              style={{
                color: isDark ? '#CBD5E1' : '#475569',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 700,
                transition: 'color 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#2563EB'}
              onMouseLeave={(e) => e.currentTarget.style.color = isDark ? '#CBD5E1' : '#475569'}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions & Theme Switcher */}
        <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #E2E8F0',
              color: isDark ? '#FFFFFF' : '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isDark ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#2563EB" />}
          </button>

          {/* Download App Button */}
          <Link
            to="/download"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: isDark ? '#34D399' : '#059669',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 800,
              padding: '8px 16px',
              borderRadius: '10px',
              border: isDark ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #A7F3D0',
              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : '#ECFDF5',
              transition: 'all 0.2s ease'
            }}
          >
            <Smartphone size={14} /> Mobile Apps
          </Link>

          {/* Admin Portal Button */}
          <Link 
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: isDark ? '#FFFFFF' : '#0F172A',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 700,
              padding: '8px 16px',
              borderRadius: '10px',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
              transition: 'all 0.2s ease'
            }}
          >
            <User size={14} /> Admin Portal
          </Link>

          {/* Book Demo Button */}
          <button
            onClick={onOpenDemo}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '10px',
              background: '#2563EB',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <span>Book Demo</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </header>
  );
}
