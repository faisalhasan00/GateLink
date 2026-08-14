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
  Contact 
} from 'lucide-react';
import EnterpriseHeader from './EnterpriseHeader';
import EnterpriseSidebar from './EnterpriseSidebar';

// 1. Navigation Configuration for Society Admin
const SOCIETY_ADMIN_NAV = [
  { name: 'Dashboard', path: '/app', icon: <LayoutDashboard size={20} /> },
  { name: 'Residents', path: '/app/residents', icon: <Users size={20} /> },
  { name: 'Visitor Logs', path: '/app/visitors', icon: <UserCheck size={20} /> },
  { name: 'Amenities', path: '/app/amenities', icon: <Waves size={20} /> },
  { name: 'Maintenance', path: '/app/maintenance', icon: <Wrench size={20} /> },
  { name: 'Documents', path: '/app/documents', icon: <FileText size={20} /> },
  { name: 'Parking', path: '/app/parking', icon: <CarFront size={20} /> },
  { name: 'Complaints', path: '/app/complaints', icon: <ShieldAlert size={20} /> },
  { name: 'Notices', path: '/app/notices', icon: <Megaphone size={20} /> },
  { name: 'Staff Management', path: '/app/staff', icon: <UserCheck size={20} /> },
  { name: 'Helpers & Deliveries', path: '/app/helpers', icon: <Truck size={20} /> },
  { name: 'Emergency SOS', path: '/app/sos', icon: <ShieldAlert size={20} /> },
  { name: 'Reports & Analytics', path: '/app/reports', icon: <BarChart2 size={20} /> },
  { name: 'Terms & Legal', path: '/app/legal', icon: <FileText size={20} /> },
  { name: 'Profile & Settings', path: '/app/profile', icon: <Settings size={20} /> },
];

// 2. Navigation Configuration for Super Admin
const SUPER_ADMIN_NAV = [
  { name: 'SaaS Overview', path: '/super-admin', icon: <LayoutDashboard size={20} /> },
  { name: 'Societies & Licenses', path: '/super-admin/societies', icon: <Building2 size={20} /> },
  { name: 'CRM & Sales Leads', path: '/super-admin/crm', icon: <Contact size={20} /> },
  { name: 'Ad & Campaigns', path: '/super-admin/ads', icon: <Megaphone size={20} /> },
  { name: 'System Settings', path: '/super-admin/profile', icon: <Settings size={20} /> },
];

// 3. Page Title & Subtitle Configuration
const PAGE_TITLES = {
  '/app': { title: 'Dashboard Overview', subtitle: 'Real-time society analytics & operational metrics' },
  '/app/residents': { title: 'Resident Directory', subtitle: 'Manage society residents, owners, tenants and flat rosters' },
  '/app/visitors': { title: 'Visitor Gate Logs', subtitle: 'Track gate entries, visitor approvals, and security passes' },
  '/app/amenities': { title: 'Amenity Bookings', subtitle: 'Manage clubhouse, gym, pool, and hall reservations' },
  '/app/maintenance': { title: 'Maintenance & Billing', subtitle: 'Generate monthly maintenance bills and Razorpay receipts' },
  '/app/documents': { title: 'Document Repository', subtitle: 'Store society bylaws, meeting minutes, and financial reports' },
  '/app/parking': { title: 'Parking Allocation', subtitle: 'Manage parking slots, resident vehicles, and visitor parking' },
  '/app/complaints': { title: 'Helpdesk Complaints', subtitle: 'Track resident complaints, ticketing workflow, and staff assignment' },
  '/app/notices': { title: 'Notice Board', subtitle: 'Publish community announcements and official notices' },
  '/app/staff': { title: 'Staff Management', subtitle: 'Onboard society personnel and configure RBAC roles' },
  '/app/helpers': { title: 'Helpers & Deliveries', subtitle: 'Track domestic helpers, maids, cooks, and delivery entries' },
  '/app/sos': { title: 'Emergency SOS Command', subtitle: 'Real-time emergency SOS broadcast and response tracking' },
  '/app/reports': { title: 'Reports & Analytics', subtitle: 'Executive society reports, financial trends, and CSV/PDF export' },
  '/app/legal': { title: 'Terms & Compliance', subtitle: 'Privacy policies, terms of service, and 24x7 support details' },
  '/app/profile': { title: 'Admin Profile', subtitle: 'Manage personal account details and credentials' },
  '/app/settings': { title: 'Society Settings', subtitle: 'Configure society metadata, gates, and operational rules' },
  
  // Super Admin Routes
  '/super-admin': { title: 'SaaS Platform Overview', subtitle: 'Global analytics, total societies, revenue, and active subscriptions' },
  '/super-admin/societies': { title: 'Society Onboarding & Licensing', subtitle: 'Onboard new societies and manage subscription tiers' },
  '/super-admin/crm': { title: 'Sales CRM & Lead Pipeline', subtitle: 'Track society onboarding leads, inquiries, and demo requests' },
  '/super-admin/ads': { title: 'Ad Banners & Broadcast Manager', subtitle: 'Manage promotional banners and cross-society announcements' },
  '/super-admin/profile': { title: 'Super Admin Profile', subtitle: 'System administrator credentials and security settings' },
};

export default function EnterpriseLayout({ isSuperAdmin = false }) {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const currentRouteMeta = PAGE_TITLES[location.pathname] || {
    title: isSuperAdmin ? 'Super Admin Portal' : 'Society Admin Panel',
    subtitle: 'Enterprise Management System'
  };

  const navItems = isSuperAdmin ? SUPER_ADMIN_NAV : SOCIETY_ADMIN_NAV;
  const brandTitle = isSuperAdmin ? 'GateLink' : 'GateLink';

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
          toggleSidebar={() => setIsMobileOpen(!isMobileOpen)}
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
