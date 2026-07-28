import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function Topbar({ title, toggleSidebar }) {
  const [society, setSociety] = useState({ name: 'Society Admin', code: 'SOC-001', plan: 'ENTERPRISE', city: 'Mumbai' });
  const [userEmail, setUserEmail] = useState('Admin');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email || 'Admin User');
    }

    // Fetch Society details dynamically
    const fetchSociety = async () => {
      try {
        const docRef = doc(db, 'societies', 'SOC-001');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSociety({
            name: data.name || 'Greenwood Heights',
            code: data.code || 'SOC-001',
            plan: data.plan || 'ENTERPRISE',
            city: data.city || 'Mumbai',
          });
        }
      } catch (e) {
        console.error('Error fetching society info:', e);
      }
    };
    fetchSociety();
  }, []);

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="hamburger-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="topbar-title">{title}</div>
      </div>

      <div className="topbar-actions">
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search residents, visitors, bills..." 
            style={{ 
              padding: '10px 16px 10px 40px', 
              borderRadius: '20px', 
              border: '1px solid var(--border-color)',
              background: 'var(--bg-color)',
              outline: 'none',
              width: '260px'
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
