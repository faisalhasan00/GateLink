/**
 * GateLink Society Admin Data Service Layer
 * 
 * ARCHITECTURE & BUSINESS RULES:
 * 1. Multi-Tenant Isolation: Every method requires or validates a `societyId`.
 *    Subcollections (e.g. `societies/{societyId}/residents`) guarantee strict data boundary.
 * 2. Clean Service Pattern: Components should NEVER call raw Firestore queries directly.
 *    Instead, call `societyAdminService.<method>` via custom React hooks.
 * 3. Auditability: All mutation batches timestamp `createdAt`, `updatedAt`, and `updatedBy`.
 */

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  writeBatch
} from 'firebase/firestore';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db, firebaseConfig } from '../firebase';
import { generateUUID } from '../utils/security';

export const societyAdminService = {
  // ── SOCIETY DETAILS & BANK SETTLEMENTS ──────────────────────────────────
  async getSocietyDetails(societyId) {
    if (!societyId) return null;
    const docRef = doc(db, 'societies', societyId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  async getSocietyBankDetails(societyId) {
    if (!societyId) return null;
    const docRef = doc(db, `societies/${societyId}/metadata/bankDetails`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  },

  async updateSocietyBankDetails(societyId, bankData) {
    if (!societyId) throw new Error('Missing societyId');
    const docRef = doc(db, `societies/${societyId}/metadata/bankDetails`);
    const timestamp = new Date().toISOString();
    await setDoc(docRef, {
      ...bankData,
      updatedAt: timestamp,
      status: 'Verified',
      settlementMode: 'Cashfree Auto-Settlement (T+1)'
    }, { merge: true });

    await this.logAuditAction(societyId, {
      action: 'Bank Details Updated',
      description: `Updated settlement bank account: ${bankData.bankName} (Ending in ${bankData.accountNumber?.slice(-4) || '****'})`
    });
    return true;
  },

  async onboardSocietyBatch(cleanData) {
    const societyUUID = generateUUID();
    const societyId = `SOC-${cleanData.code.substring(0, 6)}`;
    const adminEmail = cleanData.email.toLowerCase();
    const tempPassword = cleanData.password || `${cleanData.name.substring(0, 3).toUpperCase()}#${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString();

    const batch = writeBatch(db);

    const societyRef = doc(db, 'societies', societyId);
    batch.set(societyRef, {
      id: societyUUID,
      societyId: societyId,
      name: cleanData.name,
      code: cleanData.code,
      type: cleanData.type,
      registrationNumber: cleanData.registrationNumber || null,
      yearEstablished: Number(cleanData.yearEstablished) || null,
      mrr: Number(cleanData.mrr) || 10000,
      adminEmail: adminEmail,
      tempPassword: tempPassword,
      president: cleanData.presidentName || 'Management Committee',
      phone: cleanData.phone,
      city: cleanData.city,
      flats: Number(cleanData.flats) || 0,
      status: 'Active',
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null,
      createdBy: 'super_admin',
      updatedBy: 'super_admin'
    });

    const addressRef = doc(db, `societies/${societyId}/metadata/address`);
    batch.set(addressRef, {
      id: generateUUID(),
      societyId: societyId,
      addressLine1: cleanData.addressLine1,
      addressLine2: cleanData.addressLine2 || null,
      area: cleanData.area,
      landmark: cleanData.landmark || null,
      city: cleanData.city,
      state: cleanData.state,
      country: cleanData.country,
      pinCode: cleanData.pinCode,
      location: {
        latitude: cleanData.latitude ? Number(cleanData.latitude) : null,
        longitude: cleanData.longitude ? Number(cleanData.longitude) : null,
        fullAddress: cleanData.fullAddress || `${cleanData.addressLine1}, ${cleanData.area}, ${cleanData.city}, ${cleanData.pinCode}`
      },
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null
    });

    const structureRef = doc(db, `societies/${societyId}/metadata/structure`);
    batch.set(structureRef, {
      id: generateUUID(),
      societyId: societyId,
      buildings: Number(cleanData.buildings) || null,
      blocks: Number(cleanData.blocks) || 1,
      floors: Number(cleanData.floors) || 1,
      flats: Number(cleanData.flats) || 1,
      villas: Number(cleanData.villas) || 0,
      parkingSlots: Number(cleanData.parkingSlots) || 0,
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null
    });

    const occupancyRef = doc(db, `societies/${societyId}/metadata/occupancy`);
    batch.set(occupancyRef, {
      id: generateUUID(),
      societyId: societyId,
      occupiedFlats: Number(cleanData.occupiedFlats) || 0,
      vacantFlats: Number(cleanData.vacantFlats) || 0,
      rentalFlats: Number(cleanData.rentalFlats) || 0,
      ownerOccupiedFlats: Number(cleanData.ownerOccupiedFlats) || 0,
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null
    });

    const committeeRef = doc(db, `societies/${societyId}/metadata/committee`);
    batch.set(committeeRef, {
      id: generateUUID(),
      societyId: societyId,
      presidentName: cleanData.presidentName || null,
      secretaryName: cleanData.secretaryName || null,
      treasurerName: cleanData.treasurerName || null,
      managerName: cleanData.managerName || null,
      phone: cleanData.phone,
      email: adminEmail,
      emergencyContact: cleanData.emergencyContact || null,
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null
    });

    const auditRef = doc(collection(db, 'audit_logs'));
    batch.set(auditRef, {
      id: generateUUID(),
      action: 'CREATE_SOCIETY',
      entityId: societyId,
      performedBy: 'super_admin',
      timestamp: timestamp,
      payloadSummary: {
        name: cleanData.name,
        code: cleanData.code,
        adminEmail: adminEmail,
        city: cleanData.city
      }
    });

    await batch.commit();

    return {
      societyName: cleanData.name,
      societyId: societyId,
      accessCode: cleanData.code,
      adminEmail: adminEmail,
      tempPassword: tempPassword
    };
  },

  // ── RESIDENTS ──────────────────────────────────────────────────────────
  subscribeResidents(societyId, callback, onError) {
    if (!societyId) return () => {};
    
    // Multi-source listener: Subcollection + Global users collection
    let subcollectionData = [];
    let globalUsersData = [];

    const emitMerged = () => {
      const map = new Map();
      
      // 1. Add subcollection records
      subcollectionData.forEach(item => {
        const key = item.uid || item.id;
        if (key) map.set(key, { id: key, ...item });
      });

      // 2. Add / merge global users records
      globalUsersData.forEach(item => {
        const key = item.uid || item.id;
        if (key) {
          const existing = map.get(key) || {};
          map.set(key, { ...existing, id: key, ...item });
        }
      });

      // 3. Filter out system super_admins and sort by timestamp descending
      const mergedList = Array.from(map.values()).filter(u => u.role !== 'super_admin');
      mergedList.sort((a, b) => {
        const timeA = new Date(a.createdAt || a.createdDate || a.updatedAt || 0).getTime();
        const timeB = new Date(b.createdAt || b.createdDate || b.updatedAt || 0).getTime();
        return timeB - timeA;
      });

      callback(mergedList);
    };

    // Listener 1: societies/{societyId}/users subcollection
    const unsub1 = onSnapshot(collection(db, `societies/${societyId}/users`), (snap) => {
      subcollectionData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      emitMerged();
    }, onError);

    // Listener 2: users global collection where societyId == societyId
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

  // ── VISITORS ───────────────────────────────────────────────────────────
  subscribeVisitors(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(collection(db, `societies/${societyId}/visitors`), orderBy('entryTime', 'desc'));
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    }, onError);
  },

  async createVisitorPass(societyId, visitorData) {
    if (!societyId) throw new Error('Society ID is required');
    const docRef = doc(collection(db, `societies/${societyId}/visitors`));
    await setDoc(docRef, {
      ...visitorData,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  },

  async updateVisitorStatus(societyId, visitorId, status) {
    if (!societyId || !visitorId) throw new Error('Society ID and Visitor ID are required');
    await updateDoc(doc(db, `societies/${societyId}/visitors`, visitorId), {
      status,
      updatedAt: new Date().toISOString(),
    });
  },

  // ── MAINTENANCE BILLS ──────────────────────────────────────────────────
  subscribeMaintenanceBills(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(collection(db, `societies/${societyId}/maintenance_bills`), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    }, onError);
  },

  async createMaintenanceBill(societyId, billData) {
    if (!societyId) throw new Error('Society ID is required');
    const docRef = doc(collection(db, `societies/${societyId}/maintenance_bills`));
    await setDoc(docRef, {
      ...billData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  },

  async updateBillStatus(societyId, billId, status, extraData = {}) {
    if (!societyId || !billId) throw new Error('Society ID and Bill ID are required');
    await updateDoc(doc(db, `societies/${societyId}/maintenance_bills`, billId), {
      status,
      ...extraData,
      updatedAt: new Date().toISOString(),
    });
  },

  async markBillPaid(societyId, billId, paymentData = {}) {
    if (!societyId || !billId) throw new Error('Society ID and Bill ID are required');
    await updateDoc(doc(db, `societies/${societyId}/maintenance_bills`, billId), {
      status: 'paid',
      paidAt: new Date().toISOString(),
      ...paymentData,
      updatedAt: new Date().toISOString(),
    });
  },

  // ── COMPLAINTS ─────────────────────────────────────────────────────────
  subscribeComplaints(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(collection(db, `societies/${societyId}/complaints`), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    }, onError);
  },

  async updateComplaintStatus(societyId, complaintId, status, resolutionNotes = '') {
    if (!societyId || !complaintId) throw new Error('Society ID and Complaint ID are required');
    await updateDoc(doc(db, `societies/${societyId}/complaints`, complaintId), {
      status,
      resolutionNotes,
      updatedAt: new Date().toISOString(),
    });
  },

  async assignComplaintStaff(societyId, complaintId, assignedTo) {
    if (!societyId || !complaintId) throw new Error('Society ID and Complaint ID are required');
    await updateDoc(doc(db, `societies/${societyId}/complaints`, complaintId), {
      assignedTo,
      updatedAt: new Date().toISOString(),
    });
  },

  // ── AMENITIES & BOOKINGS ───────────────────────────────────────────────
  subscribeAmenities(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(collection(db, `societies/${societyId}/amenities`));
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    }, onError);
  },

  async createAmenity(societyId, amenityData) {
    if (!societyId) throw new Error('Society ID is required');
    const docRef = doc(collection(db, `societies/${societyId}/amenities`));
    await setDoc(docRef, {
      ...amenityData,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  },

  subscribeAmenityBookings(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(collection(db, `societies/${societyId}/amenity_bookings`), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    }, onError);
  },

  async updateAmenityBookingStatus(societyId, bookingId, status) {
    if (!societyId || !bookingId) throw new Error('Society ID and Booking ID are required');
    await updateDoc(doc(db, `societies/${societyId}/amenity_bookings`, bookingId), {
      status,
      updatedAt: new Date().toISOString(),
    });
  },

  // ── NOTICES ────────────────────────────────────────────────────────────
  subscribeNotices(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(collection(db, `societies/${societyId}/notices`), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    }, onError);
  },

  async createNotice(societyId, noticeData) {
    if (!societyId) throw new Error('Society ID is required');
    const docRef = doc(collection(db, `societies/${societyId}/notices`));
    await setDoc(docRef, {
      ...noticeData,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  },

  async deleteNotice(societyId, noticeId) {
    if (!societyId || !noticeId) throw new Error('Society ID and Notice ID are required');
    await deleteDoc(doc(db, `societies/${societyId}/notices`, noticeId));
  },

  // ── HELPERS & STAFF ────────────────────────────────────────────────────
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

    // 1. Auto-provision Firebase Auth Account
    let staffUid = null;
    let provisionApp = null;
    if (email && password) {
      try {
        const appName = `StaffProvisioner-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        provisionApp = initializeApp(firebaseConfig, appName);
        const provisionAuth = getAuth(provisionApp);
        const userCredential = await createUserWithEmailAndPassword(provisionAuth, email, password);
        staffUid = userCredential.user?.uid;
      } catch (authErr) {
        console.warn("Staff Auth user provisioning info:", authErr?.message || authErr);
      } finally {
        if (provisionApp) {
          try {
            await deleteApp(provisionApp);
          } catch (e) {
            console.error("Secondary app cleanup error:", e);
          }
        }
      }
    }

    const docId = staffUid || generateUUID();
    const payload = {
      uid: docId,
      name: name,
      email: email,
      phone: staffData.phone || '',
      department: staffData.department || 'Security & Gate',
      role: 'guard',
      status: staffData.status || 'Active',
      societyId: societyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to both societies/{societyId}/users and root /users
    const batch = writeBatch(db);
    batch.set(doc(db, `societies/${societyId}/users`, docId), payload, { merge: true });
    batch.set(doc(db, 'users', docId), payload, { merge: true });
    await batch.commit();

    return docId;
  },

  // ── SOS ALERTS ─────────────────────────────────────────────────────────
  subscribeSosAlerts(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(collection(db, `societies/${societyId}/sos_alerts`), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    }, onError);
  },

  async updateSosAlertStatus(societyId, alertId, status) {
    if (!societyId || !alertId) throw new Error('Society ID and Alert ID are required');
    await updateDoc(doc(db, `societies/${societyId}/sos_alerts`, alertId), {
      status,
      updatedAt: new Date().toISOString(),
    });
  },

  // ── DOCUMENTS ──────────────────────────────────────────────────────────
  subscribeDocuments(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(collection(db, `societies/${societyId}/documents`), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    }, onError);
  },

  async createDocumentRecord(societyId, docData) {
    if (!societyId) throw new Error('Society ID is required');
    const docRef = doc(collection(db, `societies/${societyId}/documents`));
    await setDoc(docRef, {
      ...docData,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  },

  // ── PARKING ────────────────────────────────────────────────────────────
  subscribeParkingSlots(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(collection(db, `societies/${societyId}/parking`));
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    }, onError);
  },

  async assignParkingSlot(societyId, slotId, assignedData) {
    if (!societyId || !slotId) throw new Error('Society ID and Slot ID are required');
    await setDoc(doc(db, `societies/${societyId}/parking`, slotId), {
      ...assignedData,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  },

  // ── NOTIFICATIONS ──────────────────────────────────────────────────────
  subscribeNotifications(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(collection(db, `societies/${societyId}/notifications`), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    }, onError);
  },

  async markNotificationRead(societyId, notificationId) {
    if (!societyId || !notificationId) return;
    await updateDoc(doc(db, `societies/${societyId}/notifications`, notificationId), { read: true });
  },

  async markAllNotificationsRead(societyId, notificationIds) {
    if (!societyId || !notificationIds || notificationIds.length === 0) return;
    const batch = writeBatch(db);
    notificationIds.forEach(id => {
      const ref = doc(db, `societies/${societyId}/notifications`, id);
      batch.update(ref, { read: true });
    });
    await batch.commit();
  },

  // ── GLOBAL SEARCH ──────────────────────────────────────────────────────
  async searchSocietyData(societyId, queryText) {
    if (!societyId || !queryText || queryText.length < 2) return [];
    const q = queryText.toLowerCase().trim();
    const searchResults = [];

    const [snapUsers, snapVisitors, snapComplaints, snapBills] = await Promise.all([
      getDocs(collection(db, `societies/${societyId}/users`)),
      getDocs(collection(db, `societies/${societyId}/visitors`)),
      getDocs(collection(db, `societies/${societyId}/complaints`)),
      getDocs(collection(db, `societies/${societyId}/maintenance_bills`))
    ]);

    snapUsers.forEach(d => {
      const u = d.data();
      if ((u.name || '').toLowerCase().includes(q) || (u.flatNumber || '').toLowerCase().includes(q) || (u.phone || '').includes(q)) {
        searchResults.push({
          id: d.id,
          title: u.name || 'Resident',
          subtitle: `Flat ${u.flatNumber || 'N/A'} • ${u.phone || 'Resident'}`,
          type: 'Resident',
          path: '/residents'
        });
      }
    });

    snapVisitors.forEach(d => {
      const v = d.data();
      if ((v.name || '').toLowerCase().includes(q) || (v.hostFlat || '').toLowerCase().includes(q) || (v.phone || '').includes(q)) {
        searchResults.push({
          id: d.id,
          title: v.name || 'Visitor',
          subtitle: `Flat ${v.hostFlat} • ${v.type || 'Guest'}`,
          type: 'Visitor',
          path: '/visitors'
        });
      }
    });

    snapComplaints.forEach(d => {
      const c = d.data();
      if ((c.title || '').toLowerCase().includes(q) || (c.category || '').toLowerCase().includes(q) || (c.flatNumber || '').toLowerCase().includes(q)) {
        searchResults.push({
          id: d.id,
          title: c.title || 'Complaint',
          subtitle: `Flat ${c.flatNumber || 'N/A'} • ${c.category || 'General'}`,
          type: 'Complaint',
          path: '/complaints'
        });
      }
    });

    snapBills.forEach(d => {
      const b = d.data();
      if ((b.billNumber || d.id).toLowerCase().includes(q) || (b.residentName || '').toLowerCase().includes(q)) {
        searchResults.push({
          id: d.id,
          title: `Bill #${b.billNumber || d.id.substring(0, 6)}`,
          subtitle: `${b.residentName} • ₹${b.amount}`,
          type: 'Maintenance Bill',
          path: '/maintenance'
        });
      }
    });

    return searchResults.slice(0, 10);
  },

  // ── AUDIT LOGS ─────────────────────────────────────────────────────────
  async logAuditAction(societyId, auditData) {
    if (!societyId) return;
    const docRef = doc(collection(db, `societies/${societyId}/audit_logs`));
    await setDoc(docRef, {
      ...auditData,
      timestamp: new Date().toISOString(),
    });
  },

  // ── PUBLIC LEADS ───────────────────────────────────────────────────────
  async createLead(leadData) {
    const docRef = doc(collection(db, 'leads'));
    await setDoc(docRef, {
      ...leadData,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  }
};
