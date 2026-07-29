import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X, ArrowRight, Sparkles, User, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onOpenDemo }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { name: 'Pricing', href: '/landing#pricing' },
    { name: 'Contact', href: '/landing#contact' },
  ];

  return (
    <header 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: isScrolled ? 'rgba(15, 23, 42, 0.85)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
        boxShadow: isScrolled ? '0 10px 30px -10px rgba(0, 0, 0, 0.5)' : 'none',
        padding: '16px 0'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <Link to="/landing" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Shield size={24} color="#FFFFFF" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
              Society<span style={{ color: '#818CF8' }}>Sphere</span>
            </span>
            <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600, letterSpacing: '1px' }}>
              ENTERPRISE OS
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
                color: '#CBD5E1',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'color 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#CBD5E1'}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions & Portal Access */}
        <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link 
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#E2E8F0',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 700,
              padding: '8px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
          >
            <User size={14} /> Admin Portal
          </Link>

          <Link 
            to="/super-admin/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#A7F3D0',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 700,
              padding: '8px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)'}
          >
            <Lock size={14} /> Super Admin
          </Link>

          <button
            onClick={onOpenDemo}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(79, 70, 229, 0.4)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(79, 70, 229, 0.4)';
            }}
          >
            <Sparkles size={16} /> Book Demo
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
          className="mobile-toggle"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '10px',
            padding: '8px',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'none'
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              backgroundColor: '#0F172A',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#F1F5F9', textDecoration: 'none', fontSize: '16px', fontWeight: 600 }}
              >
                {link.name}
              </a>
            ))}
            <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '8px 0' }} />
            <Link to="/login" style={{ color: '#E2E8F0', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
              Society Admin Login →
            </Link>
            <Link to="/super-admin/login" style={{ color: '#10B981', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
              Super Admin Portal →
            </Link>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenDemo(); }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                color: 'white',
                fontWeight: 700,
                border: 'none',
                marginTop: '8px'
              }}
            >
              Book Free Demo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
