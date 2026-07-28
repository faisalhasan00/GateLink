import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SuperAdminSidebar from './SuperAdminSidebar';
import Topbar from './Topbar';

export default function SuperAdminLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/super-admin': return 'Super Admin - Platform Overview';
      case '/super-admin/societies': return 'Society Onboarding & Licensing';
      case '/super-admin/crm': return 'Sales CRM & Lead Pipeline';
      case '/super-admin/ads': return 'Ad Banners & Broadcast Manager';
      default: return 'Super Admin Portal';
    }
  };

  return (
    <div className="app-container">
      <SuperAdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="main-content">
        <Topbar title={getPageTitle()} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="page-content">
          <Outlet />
        </div>
      </main>
      
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
