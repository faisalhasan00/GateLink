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

  const societyAdminUrl =
    import.meta.env.VITE_SOCIETY_ADMIN_URL ||
    (typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1')
      ? 'http://localhost:5174/login'
      : 'https://society-admin-liard.vercel.app/login');

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
