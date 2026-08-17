import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Contact, Gift, Megaphone, ArrowLeft, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { clearSuperAdminSession } from '../services/sessionManager';

export default function SuperAdminSidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      clearSuperAdminSession();
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 
    (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:5173'
      : 'https://society-sphere-two.vercel.app');

  const navItems = [
    { name: 'SaaS Overview', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Societies & Licenses', path: '/societies', icon: <Building2 size={20} /> },
    { name: 'CRM & Sales Leads', path: '/crm', icon: <Contact size={20} /> },
    { name: 'Partner & Referral Leads', path: '/partners', icon: <Gift size={20} /> },
    { name: 'Ad & Campaigns', path: '/ads', icon: <Megaphone size={20} /> },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} style={{ borderRight: '1px solid #C7D2FE' }}>
      <div className="sidebar-logo" style={{ background: 'linear-gradient(135deg, #3730A3, #4F46E5)', color: 'white' }}>
        <span style={{ color: 'white' }}>Owner Portal</span>
      </div>
      
      <div className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>

      <div style={{ padding: '16px' }}>
        <a 
          href={websiteUrl} 
          className="nav-item" 
          style={{ marginBottom: '8px', color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={18} />
          Back to Website
        </a>

        <button 
          className="nav-item" 
          onClick={handleLogout}
          style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--danger)' }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
