import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { db, functions, firebaseConfig } from '../../firebase';

export const residentService = {
  subscribeResidents(societyId, callback, onError) {
    if (!societyId) return () => {};
    
    let subcollectionData = [];
    let globalUsersData = [];

    const emitMerged = () => {
      const map = new Map();
      subcollectionData.forEach(item => {
        if (item.id) map.set(item.id, item);
      });
      globalUsersData.forEach(item => {
        if (item.id) map.set(item.id, { ...(map.get(item.id) || {}), ...item });
      });
      callback(Array.from(map.values()));
    };

    const q1 = query(collection(db, `societies/${societyId}/users`));
    const unsub1 = onSnapshot(q1, (snap) => {
      subcollectionData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      emitMerged();
    }, onError);

    const q2 = query(collection(db, 'users'), where('societyId', '==', societyId));
    const unsub2 = onSnapshot(q2, (snap) => {
      globalUsersData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      emitMerged();
    }, onError);

    return () => {
      unsub1();
      unsub2();
    };
  },

  async addResident(societyId, residentData) {
    if (!societyId) throw new Error('Society ID is required');
    const email = (residentData.email || '').trim().toLowerCase();
    const password = (residentData.password || '').trim();
    const name = (residentData.name || 'Resident').trim();
    const phone = (residentData.phone || '').trim();
    const flatNumber = (residentData.flatNumber || '').trim();
    const role = residentData.role || 'resident';
    const ownershipType = residentData.ownershipType || 'Owner';

    // 1. Primary: Provision user account via server-side Cloud Function (Admin SDK)
    try {
      const createStaffCallable = httpsCallable(functions, 'createStaffUser');
      const res = await createStaffCallable({
        societyId,
        email,
        password,
        name,
        phone,
        flatNumber,
        ownershipType,
        role,
        department: 'Resident',
      });
      if (res?.data?.success && res.data.uid) {
        return res.data.uid;
      }
    } catch (callableErr) {
      console.warn('createStaffUser Cloud Function call failed, trying secondaryAuth fallback:', callableErr);
    }

    // 2. Fallback: Secondary client-side Firebase Auth instance
    let userUid = null;

    if (email && password) {
      const secondaryAppName = `ResidentSecondaryApp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      let secondaryApp = null;
      try {
        secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
        const secondaryAuth = getAuth(secondaryApp);
        try {
          const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
          userUid = userCredential.user.uid;
        } catch (createErr) {
          if (createErr.code === 'auth/email-already-in-use') {
            try {
              const signInCred = await signInWithEmailAndPassword(secondaryAuth, email, password);
              userUid = signInCred.user.uid;
            } catch (signInErr) {
              throw new Error(`An account with email "${email}" already exists in Firebase Auth with a different password. Please delete the old account or use its existing credentials.`);
            }
          } else {
            throw createErr;
          }
        }
        await signOut(secondaryAuth);
      } catch (authErr) {
        console.warn('Secondary auth creation error:', authErr);
        throw new Error(`Failed to create resident login account: ${authErr.message}`);
      } finally {
        if (secondaryApp) {
          try {
            await deleteApp(secondaryApp);
          } catch (_) {}
        }
      }
    }

    if (!userUid) {
      throw new Error('Could not authenticate or create resident user. Please check email and password.');
    }

    const uid = userUid;
    const timestamp = new Date().toISOString();
    const payload = {
      ...residentData,
      id: uid,
      uid: uid,
      societyId: societyId,
      name: name,
      email: email,
      phone: phone,
      flatNumber: flatNumber,
      ownershipType: ownershipType,
      role: role,
      status: 'active',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await setDoc(doc(db, `societies/${societyId}/users`, uid), payload, { merge: true });
    try {
      await setDoc(doc(db, 'users', uid), payload, { merge: true });
    } catch (e) {
      console.warn('Could not sync to global users collection:', e);
    }
    return uid;
  },

  async updateResidentStatus(societyId, userId, status) {
    if (!societyId || !userId) throw new Error('Society ID and User ID are required');
    const timestamp = new Date().toISOString();
    const updatePayload = {
      status,
      updatedAt: timestamp,
    };

    try {
      await updateDoc(doc(db, `societies/${societyId}/users`, userId), updatePayload);
    } catch (e) {}

    try {
      await updateDoc(doc(db, 'users', userId), updatePayload);
    } catch (e) {}
  },

  async deleteResident(societyId, userId) {
    if (!societyId || !userId) throw new Error('Society ID and User ID are required');
    try {
      const deleteUserCallable = httpsCallable(functions, 'adminDeleteUser');
      await deleteUserCallable({ societyId, userId });
    } catch (e) {
      console.warn('Could not delete via adminDeleteUser Cloud Function, falling back to direct Firestore delete:', e);
      try {
        await deleteDoc(doc(db, `societies/${societyId}/users`, userId));
      } catch (_) {}
      try {
        await deleteDoc(doc(db, 'users', userId));
      } catch (_) {}
    }
  },

  subscribeHelpers(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(collection(db, `societies/${societyId}/helpers`));
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    }, onError);
  },

  subscribeStaff(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(collection(db, `societies/${societyId}/users`), where('role', '==', 'guard'));
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    }, onError);
  },

  async addStaff(societyId, staffData) {
    if (!societyId) throw new Error('Society ID is required');
    const email = (staffData.email || '').trim().toLowerCase();
    const password = (staffData.password || '').trim() || 'SecGuard@2026';
    const name = staffData.name || 'Security Guard';

    const createStaffCallable = httpsCallable(functions, 'createStaffUser');
    const res = await createStaffCallable({
      societyId,
      email,
      password,
      name,
      phone: staffData.phone || '',
      department: staffData.department || 'Security & Gate',
      role: 'guard',
    });

    if (res?.data?.success && res.data.uid) {
      return res.data.uid;
    }
    throw new Error(res?.data?.message || 'Failed to provision staff member.');
  }
};
