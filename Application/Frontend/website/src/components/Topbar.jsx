import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

import GlobalSearchModal from './GlobalSearchModal';

export default function Topbar({ title, toggleSidebar }) {
  const [society, setSociety] = useState({ name: 'SocietySphere SaaS', code: 'WWW', plan: 'ENTERPRISE', city: 'Global' });
  const [userEmail, setUserEmail] = useState('Visitor');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email || 'User');
    }
  }, []);

  return (
    <header className="topbar">
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="hamburger-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="topbar-title">{title}</div>
      </div>

      <div className="topbar-actions">
        <div 
          onClick={() => setIsSearchOpen(true)}
          style={{ 
            position: 'relative', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Search size={18} style={{ position: 'absolute', left: 12, color: 'var(--text-secondary)' }} />
          <input 
            readOnly
            type="text" 
            placeholder="Search residents, visitors, bills... (Ctrl+K)" 
            style={{ 
              padding: '10px 16px 10px 40px', 
              borderRadius: '20px', 
              border: '1px solid var(--border-color)',
              background: 'var(--bg-color)',
              outline: 'none',
              width: '280px',
              cursor: 'pointer',
              fontSize: '13px'
            }} 
          />
        </div>

        {/* Society Subscription Tag */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.5px'
        }}>
          <span>{society.plan} PLAN</span>
        </div>
        
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', position: 'relative' }}>
          <Bell size={22} />
          <span style={{ 
            position: 'absolute', top: -2, right: 0, width: 8, height: 8, 
            backgroundColor: 'var(--danger)', borderRadius: '50%' 
          }}></span>
        </button>

        <div className="profile-btn">
          <div className="avatar">{userEmail.charAt(0).toUpperCase()}</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{userEmail}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{society.name} ({society.code})</span>
          </div>
        </div>
      </div>
    </header>
  );
}
