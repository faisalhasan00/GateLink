import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  ShieldAlert, 
  Settings, 
  FileText, 
  Wrench, 
  CarFront, 
  Waves, 
  Megaphone, 
  Truck, 
  BarChart2, 
  Building2, 
  Contact,
  Vote 
} from 'lucide-react';
import EnterpriseHeader from './EnterpriseHeader';
import EnterpriseSidebar from './EnterpriseSidebar';

// 1. Navigation Configuration for Society Admin
const SOCIETY_ADMIN_NAV = [
  { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  { name: 'Residents', path: '/residents', icon: <Users size={20} /> },
  { name: 'Visitor Logs', path: '/visitors', icon: <UserCheck size={20} /> },
  { name: 'Amenities', path: '/amenities', icon: <Waves size={20} /> },
  { name: 'Maintenance', path: '/maintenance', icon: <Wrench size={20} /> },
  { name: 'Documents', path: '/documents', icon: <FileText size={20} /> },
  { name: 'Parking', path: '/parking', icon: <CarFront size={20} /> },
  { name: 'Complaints', path: '/complaints', icon: <ShieldAlert size={20} /> },
  { name: 'Notices', path: '/notices', icon: <Megaphone size={20} /> },
  { name: 'AGM & Polls', path: '/polls', icon: <Vote size={20} /> },
  { name: 'Staff Management', path: '/staff', icon: <UserCheck size={20} /> },
  { name: 'Helpers & Deliveries', path: '/helpers', icon: <Truck size={20} /> },
  { name: 'Emergency SOS', path: '/sos', icon: <ShieldAlert size={20} /> },
  { name: 'Reports & Analytics', path: '/reports', icon: <BarChart2 size={20} /> },
  { name: 'Terms & Legal', path: '/legal', icon: <FileText size={20} /> },
  { name: 'Profile & Settings', path: '/profile', icon: <Settings size={20} /> },
];

// 2. Page Title & Subtitle Configuration
const PAGE_TITLES = {
  '/': { title: 'Dashboard Overview', subtitle: 'Real-time society analytics & operational metrics' },
  '/residents': { title: 'Resident Directory', subtitle: 'Manage society residents, owners, tenants and flat rosters' },
  '/visitors': { title: 'Visitor Gate Logs', subtitle: 'Track gate entries, visitor approvals, and security passes' },
  '/amenities': { title: 'Amenity Bookings', subtitle: 'Manage clubhouse, gym, pool, and hall reservations' },
  '/maintenance': { title: 'Maintenance & Billing', subtitle: 'Generate monthly maintenance bills and Razorpay receipts' },
  '/documents': { title: 'Document Repository', subtitle: 'Store society bylaws, meeting minutes, and financial reports' },
  '/parking': { title: 'Parking Allocation', subtitle: 'Manage parking slots, resident vehicles, and visitor parking' },
  '/complaints': { title: 'Helpdesk Complaints', subtitle: 'Track resident complaints, ticketing workflow, and staff assignment' },
  '/notices': { title: 'Notice Board', subtitle: 'Publish community announcements and official notices' },
  '/polls': { title: 'AGM Voting & Polls', subtitle: 'Manage constitutional resolutions, facility voting, and opinion polls' },
  '/staff': { title: 'Staff Management', subtitle: 'Onboard society personnel and configure RBAC roles' },
  '/helpers': { title: 'Helpers & Deliveries', subtitle: 'Track domestic helpers, maids, cooks, and delivery entries' },
  '/sos': { title: 'Emergency SOS Command', subtitle: 'Real-time emergency SOS broadcast and response tracking' },
  '/reports': { title: 'Reports & Analytics', subtitle: 'Executive society reports, financial trends, and CSV/PDF export' },
  '/legal': { title: 'Terms & Compliance', subtitle: 'Privacy policies, terms of service, and 24x7 support details' },
  '/profile': { title: 'Admin Profile', subtitle: 'Manage personal account details and credentials' },
  '/settings': { title: 'Society Settings', subtitle: 'Configure society metadata, gates, and operational rules' },
};

export default function EnterpriseLayout({ isSuperAdmin = false }) {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const currentRouteMeta = PAGE_TITLES[location.pathname] || {
    title: 'Society Admin Panel',
    subtitle: 'Enterprise Management System'
  };

  const navItems = SOCIETY_ADMIN_NAV;
  const brandTitle = 'GateLink';

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(prev => !prev);
    } else {
      setIsSidebarCollapsed(prev => !prev);
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: 'var(--bg-color)' }}>
      {/* Reusable Enterprise Sidebar */}
      <EnterpriseSidebar 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        navItems={navItems}
        brandTitle={brandTitle}
        isSuperAdmin={isSuperAdmin}
        isOpen={isMobileOpen}
        setIsOpen={setIsMobileOpen}
      />

      {/* Main Content Workspace */}
      <main className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Reusable Enterprise Header */}
        <EnterpriseHeader 
          title={currentRouteMeta.title}
          subtitle={currentRouteMeta.subtitle}
          toggleSidebar={handleToggleSidebar}
          isSuperAdmin={isSuperAdmin}
        />

        {/* Dynamic Page Content */}
        <div className="page-content" style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsMobileOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 99 }}
        />
      )}
    </div>
  );
}
