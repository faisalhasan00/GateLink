import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, ChevronLeft, ChevronRight, Shield, Building2 } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

export default function EnterpriseSidebar({ 
  isCollapsed = false, 
  setIsCollapsed, 
  navItems = [], 
  brandTitle = 'SocietySphere',
  isSuperAdmin = false,
  isOpen = false,
  setIsOpen 
}) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate(isSuperAdmin ? '/super-admin/login' : '/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <aside 
      className={`enterprise-sidebar ${isCollapsed ? 'collapsed' : ''} ${isOpen ? 'open' : ''}`}
      style={{
        width: isCollapsed ? '80px' : '280px',
        minWidth: isCollapsed ? '80px' : '280px',
        height: '100vh',
        background: 'linear-gradient(180deg, #1E1B4B 0%, #312E81 100%)',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        zIndex: 100,
        boxShadow: '4px 0 24px rgba(0,0,0,0.12)'
      }}
    >
      {/* 1. Logo Section (72px Height matching Header) */}
      <div 
        style={{
          height: '72px',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)', flexShrink: 0
          }}>
            {isSuperAdmin ? <Building2 size={20} color="#FFFFFF" /> : <Shield size={20} color="#FFFFFF" />}
          </div>
          {!isCollapsed && (
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.4px', whiteSpace: 'nowrap' }}>
              {brandTitle}
            </span>
          )}
        </div>

        {!isCollapsed && setIsCollapsed && (
          <button 
            aria-label="Collapse Sidebar"
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* 2. Scrollable Navigation List */}
      <nav 
        style={{
          flex: 1,
          padding: '16px 12px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/' || item.path === '/super-admin'}
            onClick={() => setIsOpen && setIsOpen(false)}
            className={({ isActive }) => `enterprise-nav-item ${isActive ? 'active' : ''}`}
            title={isCollapsed ? item.name : undefined}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: isCollapsed ? '12px 0' : '12px 16px',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              borderRadius: '12px',
              color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              fontWeight: isActive ? 700 : 500,
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              backdropFilter: isActive ? 'blur(4px)' : 'none',
              boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'
            })}
          >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {item.icon}
            </span>
            {!isCollapsed && (
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.name}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* 3. Fixed Bottom Footer Section */}
      <div 
        style={{
          padding: isCollapsed ? '16px 8px' : '16px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flexShrink: 0
        }}
      >
        {isCollapsed && setIsCollapsed && (
          <button 
            aria-label="Expand Sidebar"
            onClick={() => setIsCollapsed(false)}
            style={{
              width: '100%', padding: '10px 0', borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.1)', border: 'none',
              color: '#FFFFFF', cursor: 'pointer', display: 'flex', justifyContent: 'center'
            }}
          >
            <ChevronRight size={18} />
          </button>
        )}

        <button
          onClick={handleLogout}
          aria-label="Logout"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: '10px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#FCA5A5',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Logout Account</span>}
        </button>
      </div>
    </aside>
  );
}
