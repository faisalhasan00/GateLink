import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { auth } from '../../firebase';
import SearchBar from './SearchBar';
import SubscriptionBadge from './SubscriptionBadge';
import NotificationMenu from './NotificationMenu';
import ProfileDropdown from './ProfileDropdown';
import Breadcrumb from './Breadcrumb';
import { onAuthStateChanged } from 'firebase/auth';
import { getSocietyAdminSession, getSuperAdminSession } from '../../services/sessionManager';
import { societyAdminService } from '../../services/societyAdminService';

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
  const [societyInfo, setSocietyInfo] = useState({ code: isSuperAdmin ? 'HQ-GLOBAL' : (getSocietyAdminSession()?.societyId || 'SOC-ADMIN'), plan: 'ENTERPRISE' });

  useEffect(() => {
    setUserEmail(getRoleEmail());

    const handleStorageChange = () => {
      setUserEmail(getRoleEmail());
    };
    window.addEventListener('storage', handleStorageChange);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(getRoleEmail());
    });

    if (!isSuperAdmin) {
      const session = getSocietyAdminSession();
      const activeSocId = session?.societyId;
      if (activeSocId) {
        societyAdminService.getSocietyDetails(activeSocId).then(data => {
          if (data) {
            setSocietyInfo({
              code: data.code || activeSocId,
              plan: data.plan || 'ENTERPRISE',
            });
          }
        }).catch(e => console.error('Error fetching society:', e));
      }
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      unsubscribe();
    };
  }, [isSuperAdmin]);

  return (
    <header 
      className="enterprise-header"
      style={{
        height: '72px',
        padding: '0 24px',
        backgroundColor: 'var(--surface-color)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
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

      <div className="enterprise-header-center" style={{ flex: 1, maxWidth: '400px', margin: '0 24px', display: 'flex', justifyContent: 'center' }}>
        <SearchBar />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <div style={{ marginRight: '4px' }}>
          <SubscriptionBadge plan={isSuperAdmin ? 'SUPER ADMIN' : societyInfo.plan} />
        </div>

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
