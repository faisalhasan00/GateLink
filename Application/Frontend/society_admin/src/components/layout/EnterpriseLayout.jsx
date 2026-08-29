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

  // Match current route for dynamic titles
  const currentPath = location.pathname;
  const pageMeta = PAGE_TITLES[currentPath] || {
    title: 'Society Admin Portal',
    subtitle: 'Manage and monitor your gated society operations',
  };

  const navLinks = SOCIETY_ADMIN_NAV;

  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased overflow-hidden">
      {/* ── 1. SIDEBAR (Collapsible Desktop + Drawer Mobile) ───────────────── */}
      <EnterpriseSidebar
        navLinks={navLinks}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isSuperAdmin={isSuperAdmin}
      />

      {/* ── 2. MAIN CONTENT AREA ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky Header */}
        <EnterpriseHeader
          title={pageMeta.title}
          subtitle={pageMeta.subtitle}
          onMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
        />

        {/* Dynamic Page Outlet with Custom Scrollbar */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
