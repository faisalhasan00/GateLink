import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import SearchBar from './SearchBar';
import SubscriptionBadge from './SubscriptionBadge';
import NotificationMenu from './NotificationMenu';
import ProfileDropdown from './ProfileDropdown';
import Breadcrumb from './Breadcrumb';

export default function EnterpriseHeader({ title, subtitle, toggleSidebar, isSuperAdmin = false }) {
  const [userEmail, setUserEmail] = useState('admin@skyline.com');
  const [societyInfo, setSocietyInfo] = useState({ code: 'SOC-001', plan: 'ENTERPRISE' });

  useEffect(() => {
    const user = auth.currentUser;
    if (user && user.email) {
      setUserEmail(user.email);
    }

    const fetchSociety = async () => {
      try {
        const docRef = doc(db, 'societies', 'SOC-001');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSocietyInfo({
            code: data.code || 'SOC-001',
            plan: data.plan || 'ENTERPRISE',
          });
        }
      } catch (e) {
        console.error('Error fetching society:', e);
      }
    };
    fetchSociety();
  }, []);

  return (
    <header 
      className="enterprise-header"
      style={{
        height: '72px',
        padding: '0 24px',
        backgroundColor: '#FFFFFF',
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

      {/* Right Section: Subscription Badge + Notification + Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
        <div style={{ marginRight: '8px' }}>
          <SubscriptionBadge plan={isSuperAdmin ? 'SUPER ADMIN' : societyInfo.plan} />
        </div>

        <NotificationMenu />

        <div style={{ height: '28px', width: '1px', backgroundColor: 'var(--border-color)', margin: '0 4px' }} />

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
