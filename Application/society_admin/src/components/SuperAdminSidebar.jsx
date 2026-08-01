import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Contact, Megaphone, ArrowLeft, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function SuperAdminSidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/super-admin/login');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  const navItems = [
    { name: 'SaaS Overview', path: '/super-admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Societies & Licenses', path: '/super-admin/societies', icon: <Building2 size={20} /> },
    { name: 'CRM & Sales Leads', path: '/super-admin/crm', icon: <Contact size={20} /> },
    { name: 'Ad & Campaigns', path: '/super-admin/ads', icon: <Megaphone size={20} /> },
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
            end={item.path === '/super-admin'}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>

      <div style={{ padding: '16px' }}>
        <NavLink 
          to="/" 
          className="nav-item" 
          style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={18} />
          Back to Society App
        </NavLink>

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
