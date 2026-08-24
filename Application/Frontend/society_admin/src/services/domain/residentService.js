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
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../../firebase';

export const residentService = {
  subscribeResidents(societyId, callback, onError) {
    if (!societyId) return () => {};
    
    let subcollectionData = [];
    let globalUsersData = [];

    const emitMerged = () => {
      const map = new Map();
      subcollectionData.forEach(item => {
        const key = item.uid || item.id;
        if (key) map.set(key, { id: key, ...item });
      });

      globalUsersData.forEach(item => {
        const key = item.uid || item.id;
        if (key) {
          const existing = map.get(key) || {};
          map.set(key, { ...existing, id: key, ...item });
        }
      });

      const mergedList = Array.from(map.values()).filter(u => u.role !== 'super_admin');
      mergedList.sort((a, b) => {
        const timeA = new Date(a.createdAt || a.createdDate || a.updatedAt || 0).getTime();
        const timeB = new Date(b.createdAt || b.createdDate || b.updatedAt || 0).getTime();
        return timeB - timeA;
      });

      callback(mergedList);
    };

    const unsub1 = onSnapshot(collection(db, `societies/${societyId}/users`), (snap) => {
      subcollectionData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      emitMerged();
    }, onError);

    let unsub2 = () => {};
    try {
      const qGlobal = query(collection(db, 'users'), where('societyId', '==', societyId));
      unsub2 = onSnapshot(qGlobal, (snap) => {
        globalUsersData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        emitMerged();
      }, (err) => {
        console.warn('Global users query notice:', err);
      });
    } catch (e) {
      console.warn('Could not attach global users listener:', e);
    }

    return () => {
      unsub1();
      unsub2();
    };
  },

  async addResident(societyId, residentData) {
    if (!societyId) throw new Error('Society ID is required');
    const timestamp = new Date().toISOString();
    const docRef = doc(collection(db, `societies/${societyId}/users`));
    const payload = {
      ...residentData,
      id: docRef.id,
      uid: docRef.id,
      societyId: societyId,
      role: residentData.role || 'resident',
      status: 'active',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await setDoc(docRef, payload);
    try {
      await setDoc(doc(db, 'users', docRef.id), payload, { merge: true });
    } catch (e) {
      console.warn('Could not sync to global users collection:', e);
    }
    return docRef.id;
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
      await deleteDoc(doc(db, `societies/${societyId}/users`, userId));
    } catch (e) {}
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (e) {}
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
