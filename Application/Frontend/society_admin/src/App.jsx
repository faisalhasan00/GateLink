import React, { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

import { ThemeProvider } from './context/ThemeContext'
import SkeletonLoader from './components/ui/SkeletonLoader'
import { getSocietyAdminSession, performCentralizedLogout, clearSocietyAdminSession } from './services/sessionManager'
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
const PollsPage = lazy(() => import('./pages/PollsPage'))
const Staff = lazy(() => import('./pages/Staff'))
const PatrolManagement = lazy(() => import('./pages/PatrolManagement'))
const HelpersDeliveries = lazy(() => import('./pages/HelpersDeliveries'))
const EmergencySos = lazy(() => import('./pages/EmergencySos'))
const Reports = lazy(() => import('./pages/Reports'))
const Legal = lazy(() => import('./pages/Legal'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const ActivateSociety = lazy(() => import('./pages/ActivateSociety'))
const AdminProfile = lazy(() => import('./pages/AdminProfile'))

function ProtectedRoute({ user, children }) {
  // undefined = Auth verification in-flight
  if (user === undefined) return <SkeletonLoader />;
  
  // Authoritative Check: Must have a validated Firebase User. Stale localStorage is blocked.
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (!firebaseUser) {
        clearSocietyAdminSession();
        setUser(null);
        return;
      }

      // Real-Time Authoritative Account Presence Listener
      // If user document is deleted or status changed in database, auto-logout instantly
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      unsubscribeSnapshot = onSnapshot(
        userDocRef,
        async (docSnap) => {
          if (!docSnap.exists()) {
            console.warn('Authoritative verification failed: User account deleted in database. Logging out...');
            await performCentralizedLogout(auth);
            setUser(null);
            return;
          }

          const data = docSnap.data() || {};
          const status = (data.status || 'active').toLowerCase();
          const role = data.role;

          if (status === 'deleted' || status === 'suspended' || status === 'inactive' ||
              (role !== 'admin' && role !== 'society_admin' && role !== 'super_admin')) {
            console.warn('Authoritative verification failed: Account inactive/unauthorized. Logging out...');
            await performCentralizedLogout(auth);
            setUser(null);
            return;
          }

          // Verify associated society actually exists in database
          const targetSocietyId = data.societyId || getSocietyAdminSession()?.societyId;
          if (!targetSocietyId || targetSocietyId === 'SOC-ADMIN') {
            console.warn('Authoritative verification failed: Invalid society ID. Logging out...');
            await performCentralizedLogout(auth);
            setUser(null);
            return;
          }

          try {
            const socSnap = await getDoc(doc(db, 'societies', targetSocietyId));
            if (!socSnap.exists() || socSnap.data()?.status === 'deleted') {
              console.warn('Authoritative verification failed: Society document deleted in database. Logging out...');
              await performCentralizedLogout(auth);
              setUser(null);
              return;
            }
          } catch (socErr) {
            console.warn('Society verification check error:', socErr);
          }

          setUser(firebaseUser);
        },
        async (err) => {
          console.warn('Real-time session snapshot error:', err);
          await performCentralizedLogout(auth);
          setUser(null);
        }
      );
    });

    return () => {
      if (unsubscribeSnapshot) unsubscribeSnapshot();
      unsubscribeAuth();
    };
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<SkeletonLoader />}>
          <Routes>
            {/* Login & Activation Routes */}
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/activate" element={<ActivateSociety />} />

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
              <Route path="polls" element={<PollsPage />} />
              <Route path="staff" element={<Staff />} />
              <Route path="patrol" element={<PatrolManagement />} />
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
