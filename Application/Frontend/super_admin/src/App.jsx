import React, { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from './firebase'

import { ThemeProvider } from './context/ThemeContext'
import SkeletonLoader from './components/ui/SkeletonLoader'
import { getSuperAdminSession, performCentralizedLogout, clearSuperAdminSession } from './services/sessionManager'
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

  // Authoritative Check: Must have a validated Firebase User. Stale localStorage is blocked.
  if (!user || !user.email) {
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
        clearSuperAdminSession();
        setUser(null);
        return;
      }

      // Real-Time Authoritative Account Presence Listener for Super Admin
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      unsubscribeSnapshot = onSnapshot(
        userDocRef,
        async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() || {};
            if (data.status === 'deleted' || data.status === 'suspended' || data.status === 'inactive') {
              console.warn('Super Admin account status inactive/suspended in database. Logging out...');
              await performCentralizedLogout(auth);
              setUser(null);
              return;
            }
          }
          setUser(firebaseUser);
        },
        async (err) => {
          console.warn('Super admin session snapshot notice:', err);
          setUser(firebaseUser);
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

              {/* Path Aliases for /super-admin/* routes */}
              <Route path="super-admin" element={<SuperAdminDashboard />} />
              <Route path="super-admin/societies" element={<SocietyManagement />} />
              <Route path="super-admin/crm" element={<CrmLeads />} />
              <Route path="super-admin/ads" element={<AdCampaigns />} />
              <Route path="super-admin/profile" element={<SuperAdminProfile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
