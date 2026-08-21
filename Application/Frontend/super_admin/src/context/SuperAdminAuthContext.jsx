import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { getSuperAdminSession, clearSuperAdminSession, performCentralizedLogout } from '../services/sessionManager';

export const MASTER_SUPER_ADMIN_EMAIL = 'mohammedfaisalhasan@gmail.com';

export const ALL_PERMISSIONS = {
  overview: true,
  societies: true,
  delete_society: true,
  crm: true,
  partners: true,
  approve_payout: true,
  notifications: true,
  ads: true,
  team: true,
};

const SuperAdminAuthContext = createContext({
  user: undefined,
  isMasterAdmin: false,
  permissions: ALL_PERMISSIONS,
  hasPermission: () => true,
  staffProfile: null,
  loading: true,
});

export function SuperAdminAuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading
  const [staffProfile, setStaffProfile] = useState(null);
  const [permissions, setPermissions] = useState(ALL_PERMISSIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (!firebaseUser) {
        clearSuperAdminSession();
        setUser(null);
        setStaffProfile(null);
        setPermissions(ALL_PERMISSIONS);
        setLoading(false);
        return;
      }

      const email = (firebaseUser.email || '').toLowerCase();
      const isMaster = email === MASTER_SUPER_ADMIN_EMAIL.toLowerCase();

      if (isMaster) {
        // Master Super Admin has full, unconditional access
        setUser(firebaseUser);
        setStaffProfile({
          name: 'Master Administrator',
          email: MASTER_SUPER_ADMIN_EMAIL,
          role: 'Super Admin (Owner)',
          isMaster: true,
          status: 'Active',
        });
        setPermissions(ALL_PERMISSIONS);
        setLoading(false);
        return;
      }

      // Staff Member — listen to real-time status and permissions in Firestore
      const staffDocRef = doc(db, 'super_admin_team', firebaseUser.uid);
      unsubscribeDoc = onSnapshot(
        staffDocRef,
        async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() || {};
            if (data.status === 'Suspended' || data.status === 'inactive' || data.status === 'deleted') {
              console.warn('Staff member account suspended or deleted. Logging out...');
              await performCentralizedLogout(auth);
              setUser(null);
              setStaffProfile(null);
              setPermissions({});
            } else {
              setUser(firebaseUser);
              setStaffProfile(data);
              setPermissions(data.permissions || {});
            }
          } else {
            // Check fallback in /users collection
            try {
              const userSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
              if (userSnap.exists()) {
                const uData = userSnap.data() || {};
                if (uData.role === 'super_admin' || uData.role === 'employee' || uData.role === 'staff') {
                  setUser(firebaseUser);
                  setStaffProfile(uData);
                  setPermissions(uData.permissions || ALL_PERMISSIONS);
                } else {
                  console.warn('User does not have Super Admin permissions.');
                  await performCentralizedLogout(auth);
                  setUser(null);
                }
              } else {
                console.warn('Staff record not found in database.');
                await performCentralizedLogout(auth);
                setUser(null);
              }
            } catch (err) {
              console.error('Error verifying staff access:', err);
              setUser(null);
            }
          }
          setLoading(false);
        },
        (err) => {
          console.error('Real-time staff permissions listener error:', err);
          setUser(firebaseUser);
          setLoading(false);
        }
      );
    });

    return () => {
      if (unsubscribeDoc) unsubscribeDoc();
      unsubscribeAuth();
    };
  }, []);

  const isMasterAdmin = (user?.email || '').toLowerCase() === MASTER_SUPER_ADMIN_EMAIL.toLowerCase();

  const hasPermission = (permissionKey) => {
    if (!permissionKey) return true;
    if (isMasterAdmin) return true;
    return Boolean(permissions && permissions[permissionKey]);
  };

  return (
    <SuperAdminAuthContext.Provider
      value={{
        user,
        isMasterAdmin,
        permissions: isMasterAdmin ? ALL_PERMISSIONS : permissions,
        hasPermission,
        staffProfile,
        loading,
      }}
    >
      {children}
    </SuperAdminAuthContext.Provider>
  );
}

export function useSuperAdminAuth() {
  return useContext(SuperAdminAuthContext);
}
