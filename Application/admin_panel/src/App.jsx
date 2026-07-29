import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { auth } from './firebase'

import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Residents from './pages/Residents'
import Visitors from './pages/Visitors'
import Complaints from './pages/Complaints'
import Amenities from './pages/Amenities'
import Maintenance from './pages/Maintenance'
import Documents from './pages/Documents'
import Parking from './pages/Parking'
import Notices from './pages/Notices'
import Staff from './pages/Staff'
import HelpersDeliveries from './pages/HelpersDeliveries'
import EmergencySos from './pages/EmergencySos'
import Reports from './pages/Reports'
import Legal from './pages/Legal'
import AdminLogin from './pages/AdminLogin'
import AdminProfile from './pages/AdminProfile'

import SuperAdminLayout from './components/SuperAdminLayout'
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard'
import SocietyManagement from './pages/superadmin/SocietyManagement'
import CrmLeads from './pages/superadmin/CrmLeads'
import AdCampaigns from './pages/superadmin/AdCampaigns'
import SuperAdminProfile from './pages/superadmin/SuperAdminProfile'
import SuperAdminLogin from './pages/superadmin/SuperAdminLogin'

import LandingPage from './pages/landing/LandingPage'
import { getSocietyAdminSession, getSuperAdminSession } from './services/sessionManager'

import './index.css'

// Protected Route: Redirect to login if not authenticated in role-isolated session namespace
function ProtectedRoute({ user, children, loginPath = '/login', requireSuperAdmin = false }) {
  if (requireSuperAdmin) {
    const superSession = getSuperAdminSession();
    const isFirebaseSuperUser = user && user.email?.toLowerCase() === 'mohammedfaisalhasan@gmail.com';
    if (!superSession && !isFirebaseSuperUser) {
      return <Navigate to="/super-admin/login" replace />;
    }
  } else {
    const socSession = getSocietyAdminSession();
    if (!socSession && !user) {
      return <Navigate to={loginPath} replace />;
    }
  }
  return children;
}

function App() {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public SaaS Landing Page */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/website" element={<LandingPage />} />

        {/* Public Login Pages */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />

        {/* Society Admin Routes (Protected) */}
        <Route path="/" element={
          <ProtectedRoute user={user}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="residents" element={<Residents />} />
          <Route path="visitors" element={<Visitors />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="amenities" element={<Amenities />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="documents" element={<Documents />} />
          <Route path="parking" element={<Parking />} />
          <Route path="notices" element={<Notices />} />
          <Route path="staff" element={<Staff />} />
          <Route path="helpers" element={<HelpersDeliveries />} />
          <Route path="sos" element={<EmergencySos />} />
          <Route path="reports" element={<Reports />} />
          <Route path="legal" element={<Legal />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Super Admin Routes (Protected) */}
        <Route path="/super-admin" element={
          <ProtectedRoute user={user} loginPath="/super-admin/login" requireSuperAdmin={true}>
            <SuperAdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="societies" element={<SocietyManagement />} />
          <Route path="crm" element={<CrmLeads />} />
          <Route path="ads" element={<AdCampaigns />} />
          <Route path="profile" element={<SuperAdminProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
