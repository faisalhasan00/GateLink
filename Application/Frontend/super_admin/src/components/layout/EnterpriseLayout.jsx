import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  Megaphone, 
  Building2, 
  Contact, 
  Handshake, 
  Bell,
  Users
} from 'lucide-react';
import EnterpriseHeader from './EnterpriseHeader';
import EnterpriseSidebar from './EnterpriseSidebar';
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext';

// Navigation Configuration for Super Admin with Permission Keys
const SUPER_ADMIN_NAV = [
  { name: 'SaaS Overview', path: '/', permissionKey: 'overview', icon: <LayoutDashboard size={20} /> },
  { name: 'Societies & Licenses', path: '/societies', permissionKey: 'societies', icon: <Building2 size={20} /> },
  { name: 'CRM & Sales Leads', path: '/crm', permissionKey: 'crm', icon: <Contact size={20} /> },
  { name: 'Partners & Payouts', path: '/partners', permissionKey: 'partners', icon: <Handshake size={20} /> },
  { name: 'Push Notifications', path: '/notifications', permissionKey: 'notifications', icon: <Bell size={20} /> },
  { name: 'Ad & Campaigns', path: '/ads', permissionKey: 'ads', icon: <Megaphone size={20} /> },
  { name: 'Team & Staff', path: '/team', permissionKey: 'team', icon: <Users size={20} /> },
  { name: 'System Settings', path: '/profile', permissionKey: 'overview', icon: <Settings size={20} /> },
];

// Page Title & Subtitle Configuration
const PAGE_TITLES = {
  '/': { title: 'SaaS Platform Overview', subtitle: 'Global analytics, total societies, revenue, and active subscriptions' },
  '/societies': { title: 'Society Onboarding & Licensing', subtitle: 'Onboard new societies and manage subscription tiers' },
  '/crm': { title: 'Sales CRM & Lead Pipeline', subtitle: 'Track society onboarding leads, inquiries, and demo requests' },
  '/partners': { title: 'Partner & Referral Deals CRM', subtitle: 'Manage broker leads, track conversions, and approve monthly recurring UPI payouts' },
  '/notifications': { title: 'Universal Push Notification Dispatcher', subtitle: 'Send targeted and platform-wide mobile alerts to residents & guards' },
  '/ads': { title: 'Ad Banners & In-App Promotions', subtitle: 'Manage promotional banners and cross-society announcements' },
  '/team': { title: 'Team & Staff Management', subtitle: 'Manage employee accounts and granular role permissions' },
  '/profile': { title: 'Super Admin Profile', subtitle: 'System administrator credentials and security settings' },
};

export default function EnterpriseLayout({ isSuperAdmin = true }) {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { hasPermission } = useSuperAdminAuth();

  const currentRouteMeta = PAGE_TITLES[location.pathname] || {
    title: 'Super Admin Portal',
    subtitle: 'Enterprise Management System'
  };

  // Filter navigation items based on current user's role/permissions
  const navItems = SUPER_ADMIN_NAV.filter(item => !item.permissionKey || hasPermission(item.permissionKey));
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
