import { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';

/**
 * Hook for Navbar lifecycle, scroll detection, and mobile responsiveness
 */
export function useNavbar(onOpenDemo) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 1024 : false
  );
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getSocietyAdminLoginUrl = () => {
    if (import.meta.env.VITE_SOCIETY_ADMIN_URL) {
      const base = import.meta.env.VITE_SOCIETY_ADMIN_URL;
      return base.endsWith('/login') ? base : `${base}/login`;
    }
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      if (host === 'localhost' || host === '127.0.0.1') {
        return 'http://localhost:5174/login';
      }
      if (host.includes('web.app') || host.includes('firebaseapp.com')) {
        return 'https://gatelink-app-staging.web.app/login';
      }
    }
    return 'https://app.gatelink.in/login';
  };

  const societyAdminUrl = getSocietyAdminLoginUrl();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileMenuOpen(false);
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

  return {
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
  };
}
