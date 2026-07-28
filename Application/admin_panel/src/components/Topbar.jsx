import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function Topbar({ title, toggleSidebar }) {
  const [societyName, setSocietyName] = useState('Society Admin');
  const [userEmail, setUserEmail] = useState('Admin');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email || 'Admin User');
    }

    // Fetch Society Name dynamically
    const fetchSociety = async () => {
      try {
        const docRef = doc(db, 'societies', 'SOC-001');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSocietyName(docSnap.data().name || 'Society Admin');
        }
      } catch (e) {
        console.error(e);
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
            placeholder="Search..." 
            style={{ 
              padding: '10px 16px 10px 40px', 
              borderRadius: '20px', 
              border: '1px solid var(--border-color)',
              background: 'var(--bg-color)',
              outline: 'none',
              width: '250px'
            }} 
          />
        </div>
        
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', position: 'relative' }}>
          <Bell size={24} />
          <span style={{ 
            position: 'absolute', top: -2, right: 0, width: 8, height: 8, 
            backgroundColor: 'var(--danger)', borderRadius: '50%' 
          }}></span>
        </button>

        <div className="profile-btn">
          <div className="avatar">{userEmail.charAt(0).toUpperCase()}</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{userEmail}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{societyName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
