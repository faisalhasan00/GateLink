import React, { useState, useEffect } from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import SearchBar from './SearchBar';
import SubscriptionBadge from './SubscriptionBadge';
import NotificationMenu from './NotificationMenu';
import ProfileDropdown from './ProfileDropdown';
import Breadcrumb from './Breadcrumb';
import { useTheme } from '../../context/ThemeContext';

import { onAuthStateChanged } from 'firebase/auth';
import { getSocietyAdminSession, getSuperAdminSession } from '../../services/sessionManager';

export default function EnterpriseHeader({ title, subtitle, toggleSidebar, isSuperAdmin = false }) {
  const getRoleEmail = () => {
    if (isSuperAdmin) {
      const session = getSuperAdminSession();
      return session?.email || (auth.currentUser?.email === 'mohammedfaisalhasan@gmail.com' ? auth.currentUser.email : 'mohammedfaisalhasan@gmail.com');
    } else {
      const session = getSocietyAdminSession();
      if (session?.email) return session.email;
      if (auth.currentUser && auth.currentUser.email !== 'mohammedfaisalhasan@gmail.com') {
        return auth.currentUser.email;
      }
      return 'admin@society.com';
    }
  };

  const [userEmail, setUserEmail] = useState(getRoleEmail);
  const [societyInfo, setSocietyInfo] = useState({ code: isSuperAdmin ? 'HQ-GLOBAL' : 'SOC-001', plan: 'ENTERPRISE' });

  useEffect(() => {
    setUserEmail(getRoleEmail());

    const handleStorageChange = () => {
      setUserEmail(getRoleEmail());
    };
    window.addEventListener('storage', handleStorageChange);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(getRoleEmail());
    });

    const fetchSociety = async () => {
      if (isSuperAdmin) return;
      try {
        const session = getSocietyAdminSession();
        const activeSocId = session?.societyId || 'SOC-001';
        const docRef = doc(db, 'societies', activeSocId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSocietyInfo({
            code: data.code || activeSocId,
            plan: data.plan || 'ENTERPRISE',
          });
        }
      } catch (e) {
        console.error('Error fetching society:', e);
      }
    };
    fetchSociety();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      unsubscribe();
    };
  }, [isSuperAdmin]);

  const { theme, toggleTheme } = useTheme();

  return (
    <header 
      className="enterprise-header"
      style={{
        height: '72px',
        padding: '0 24px',
        backgroundColor: 'var(--surface-color)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      {/* Left Section: Hamburger + Title & Subtitle + Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
        <button 
          aria-label="Toggle Sidebar Navigation"
          className="hamburger-btn" 
          onClick={toggleSidebar}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}
        >
          <Menu size={24} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>
              {title}
            </h1>
          </div>
          <Breadcrumb />
        </div>
      </div>

      {/* Center Section: Global Search Bar */}
      <div className="enterprise-header-center" style={{ flex: 1, maxWidth: '400px', margin: '0 24px', display: 'flex', justifyContent: 'center' }}>
        <SearchBar />
      </div>

      {/* Right Section: Subscription Badge + Notification + Theme Toggle + Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <div style={{ marginRight: '4px' }}>
          <SubscriptionBadge plan={isSuperAdmin ? 'SUPER ADMIN' : societyInfo.plan} />
        </div>

        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          style={{
            background: 'var(--bg-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '8px',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
          }}
        >
          {theme === 'dark' ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#4F46E5" />}
        </button>

        <NotificationMenu />

        <div style={{ height: '28px', width: '1px', backgroundColor: 'var(--border-color)', margin: '0 2px' }} />

        <ProfileDropdown 
          userEmail={userEmail} 
          role={isSuperAdmin ? 'System Administrator' : 'Society Admin'} 
          societyCode={societyInfo.code} 
          isSuperAdmin={isSuperAdmin}
        />
      </div>
    </header>
  );
}
