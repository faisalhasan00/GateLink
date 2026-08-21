import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  writeBatch 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { generateUUID } from '../../utils/security';

export const facilityService = {
  // Society details & batch onboarding
  async getSocietyDetails(societyId) {
    if (!societyId) return null;
    const docRef = doc(db, 'societies', societyId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
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

  // Visitors
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

  // Amenities
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

  // Notices
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
    const payload = {
      ...noticeData,
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload);

    import('../fcmBroadcastService').then(({ broadcastToSociety }) => {
      const categoryIcon = noticeData.category === 'Emergency' ? '🚨' : noticeData.category === 'Maintenance' ? '🔧' : '📢';
      broadcastToSociety(societyId, {
        title: `${categoryIcon} ${noticeData.title}`,
        body: noticeData.body || 'New official notice posted by Society Admin.',
        category: 'notice',
        data: {
          noticeId: docRef.id,
          category: noticeData.category || 'General',
        },
      }).catch(err => console.warn('FCM broadcast notice warning:', err));
    }).catch(err => console.warn('FCM module load warning:', err));

    return docRef.id;
  },

  async deleteNotice(societyId, noticeId) {
    if (!societyId || !noticeId) throw new Error('Society ID and Notice ID are required');
    await deleteDoc(doc(db, `societies/${societyId}/notices`, noticeId));
  },

  // Documents
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

  // Parking
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

  // Notifications
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

  // Global Search
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

  async createLead(leadData) {
    const docRef = doc(collection(db, 'leads'));
    await setDoc(docRef, {
      ...leadData,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  }
};
