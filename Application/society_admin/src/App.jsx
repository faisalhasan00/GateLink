import React, { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

import { ThemeProvider } from './context/ThemeContext'
import SkeletonLoader from './components/ui/SkeletonLoader'
import { getSocietyAdminSession } from './services/sessionManager'
import './index.css'

// Lazy Loaded Society Admin Pages
const Layout = lazy(() => import('./components/Layout'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Residents = lazy(() => import('./pages/Residents'))
const Visitors = lazy(() => import('./pages/Visitors'))
const Complaints = lazy(() => import('./pages/Complaints'))
const Amenities = lazy(() => import('./pages/Amenities'))
const Maintenance = lazy(() => import('./pages/Maintenance'))
const Documents = lazy(() => import('./pages/Documents'))
const Parking = lazy(() => import('./pages/Parking'))
const Notices = lazy(() => import('./pages/Notices'))
const Staff = lazy(() => import('./pages/Staff'))
const HelpersDeliveries = lazy(() => import('./pages/HelpersDeliveries'))
const EmergencySos = lazy(() => import('./pages/EmergencySos'))
const Reports = lazy(() => import('./pages/Reports'))
const Legal = lazy(() => import('./pages/Legal'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminProfile = lazy(() => import('./pages/AdminProfile'))

function ProtectedRoute({ user, children }) {
  if (user === undefined) return <SkeletonLoader />;
  const session = getSocietyAdminSession();
  if (!user && !session) {
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
            {/* Login Route */}
            <Route path="/login" element={<AdminLogin />} />

            {/* Protected Society Admin Dashboard Routes */}
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

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
