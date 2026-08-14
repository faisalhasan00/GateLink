import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useNavbar } from '../../features/navigation/hooks/useNavbar';
import NavBrand from '../../features/navigation/components/NavBrand';
import NavDropdown from '../../features/navigation/components/NavDropdown';
import NavActions from '../../features/navigation/components/NavActions';
import MobileMenu from '../../features/navigation/components/MobileMenu';
import Button from '../../components/ui/Button';

/**
 * GateLink Public Website Navigation Bar
 * Modular orchestrator composing NavBrand, NavDropdown, NavActions, and MobileMenu.
 */
export default function Navbar({ onOpenDemo }) {
  const {
    isScrolled,
    aboutDropdownOpen,
    setAboutDropdownOpen,
    featuresDropdownOpen,
    setFeaturesDropdownOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    isMobile,
    isDark,
    societyAdminUrl,
    handleEnrollClick,
  } = useNavbar(onOpenDemo);

  const aboutItems = [
    { label: 'About Us', to: '/about' },
    { label: 'UAE Ecosystem', to: '/ecosystem' },
    { label: 'Blog', to: '/blog' },
    { label: 'Privacy Policy', to: '/privacy' },
  ];

  const featureItems = [
    { label: 'All Features', to: '/features' },
    { label: 'Solutions', to: '/solutions' },
    { label: 'Pricing Plans', to: '/pricing' },
  ];

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
        alignItems: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '1320px',
          width: '100%',
          margin: '0 auto',
          padding: isMobile ? '0 14px' : '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left Side: Brand Logo + Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <NavBrand isDark={isDark} isMobile={isMobile} />

          {!isMobile && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <NavDropdown
                label="About Us"
                isOpen={aboutDropdownOpen}
                onOpen={() => setAboutDropdownOpen(true)}
                onClose={() => setAboutDropdownOpen(false)}
                items={aboutItems}
                isDark={isDark}
              />
              <NavDropdown
                label="Features"
                isOpen={featuresDropdownOpen}
                onOpen={() => setFeaturesDropdownOpen(true)}
                onClose={() => setFeaturesDropdownOpen(false)}
                items={featureItems}
                isDark={isDark}
              />
              <Link
                to="/contact"
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: isDark ? '#E2E8F0' : '#444444',
                  textDecoration: 'none',
                }}
              >
                Contact Us
              </Link>
            </nav>
          )}
        </div>

        {/* Right Side Actions */}
        {!isMobile ? (
          <NavActions
            isDark={isDark}
            societyAdminUrl={societyAdminUrl}
            onEnrollClick={handleEnrollClick}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button
              variant="primary"
              size="small"
              onClick={handleEnrollClick}
            >
              Enroll
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: isDark ? '#1E293B' : '#F8FAFC',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB',
                color: isDark ? '#FFFFFF' : '#1E3A8A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        isDark={isDark}
        societyAdminUrl={societyAdminUrl}
        onEnrollClick={handleEnrollClick}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
