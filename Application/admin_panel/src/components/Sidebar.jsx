import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, ShieldAlert, Settings, LogOut, FileText, Wrench, CarFront, Waves, Megaphone, Truck, BarChart2 } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Residents', path: '/residents', icon: <Users size={20} /> },
    { name: 'Visitor Logs', path: '/visitors', icon: <UserCheck size={20} /> },
    { name: 'Amenities', path: '/amenities', icon: <Waves size={20} /> },
    { name: 'Maintenance', path: '/maintenance', icon: <Wrench size={20} /> },
    { name: 'Documents', path: '/documents', icon: <FileText size={20} /> },
    { name: 'Parking', path: '/parking', icon: <CarFront size={20} /> },
    { name: 'Complaints', path: '/complaints', icon: <ShieldAlert size={20} /> },
    { name: 'Notices', path: '/notices', icon: <Megaphone size={20} /> },
    { name: 'Staff Management', path: '/staff', icon: <UserCheck size={20} /> },
    { name: 'Helpers & Deliveries', path: '/helpers', icon: <Truck size={20} /> },
    { name: 'Emergency SOS', path: '/sos', icon: <ShieldAlert size={20} /> },
    { name: 'Reports & Analytics', path: '/reports', icon: <BarChart2 size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <span>SocietySphere</span>
      </div>
      
      <div className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >

            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>

      <div style={{ padding: '24px 16px' }}>
        <button 
          className="nav-item" 
          onClick={handleLogout}
          style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--danger)' }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
