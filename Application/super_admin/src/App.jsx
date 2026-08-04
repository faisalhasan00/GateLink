import React, { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

import { ThemeProvider } from './context/ThemeContext'
import SkeletonLoader from './components/ui/SkeletonLoader'
import { getSuperAdminSession } from './services/sessionManager'
import './index.css'

// Lazy Loaded Super Admin Pages & Layouts
const SuperAdminLayout = lazy(() => import('./components/SuperAdminLayout'))
const SuperAdminDashboard = lazy(() => import('./pages/superadmin/SuperAdminDashboard'))
const SocietyManagement = lazy(() => import('./pages/superadmin/SocietyManagement'))
const CrmLeads = lazy(() => import('./pages/superadmin/CrmLeads'))
const AdCampaigns = lazy(() => import('./pages/superadmin/AdCampaigns'))
const SuperAdminProfile = lazy(() => import('./pages/superadmin/SuperAdminProfile'))
const SuperAdminLogin = lazy(() => import('./pages/superadmin/SuperAdminLogin'))

function ProtectedSuperRoute({ user, children }) {
  if (user === undefined) return <SkeletonLoader />;
  const session = getSuperAdminSession();
  const isSuperUser = (user && user.email?.toLowerCase() === 'mohammedfaisalhasan@gmail.com') || (session && session.email?.toLowerCase() === 'mohammedfaisalhasan@gmail.com');
  if (!isSuperUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<SkeletonLoader />}>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<SuperAdminLogin />} />

            {/* Protected Super Admin Dashboard Routes */}
            <Route path="/" element={
              <ProtectedSuperRoute user={user}>
                <SuperAdminLayout />
              </ProtectedSuperRoute>
            }>
              <Route index element={<SuperAdminDashboard />} />
              <Route path="societies" element={<SocietyManagement />} />
              <Route path="crm" element={<CrmLeads />} />
              <Route path="ads" element={<AdCampaigns />} />
              <Route path="profile" element={<SuperAdminProfile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
