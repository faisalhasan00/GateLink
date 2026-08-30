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
    { label: 'Security Center', to: '/security' },
    { label: 'Blog', to: '/blog' },
    { label: 'Privacy Policy', to: '/privacy' },
  ];

  const featureItems = [
    { label: 'All Features', to: '/features' },
    { label: 'Solutions', to: '/solutions' },
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
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.96)' : 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
        boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.02)',
        height: '74px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto',
          padding: isMobile ? '0 16px' : '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left Side: Brand Logo + Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
          <NavBrand isDark={isDark} isMobile={isMobile} />

          {!isMobile && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
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
                to="/partners"
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: isDark ? '#38BDF8' : '#0284C7',
                  textDecoration: 'none',
                  padding: '6px 2px',
                  transition: 'color 0.15s ease',
                }}
              >
                Partner & Earn
              </Link>
              <Link
                to="/contact"
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: isDark ? '#E2E8F0' : '#334155',
                  textDecoration: 'none',
                  padding: '6px 2px',
                  transition: 'color 0.15s ease',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Button
              variant="primary"
              size="small"
              onClick={handleEnrollClick}
              style={{
                height: '38px',
                padding: '0 16px',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              Enroll
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: isDark ? '#1E293B' : '#F1F5F9',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #CBD5E1',
                color: isDark ? '#FFFFFF' : '#1E3A8A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
