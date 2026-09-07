import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { societyOnboardingService } from './societyOnboardingService';
import { noticeService } from './noticeService';
import { amenityService } from './amenityService';
import { searchService } from './searchService';

export const facilityService = {
  // Society details & batch onboarding
  getSocietyDetails: societyOnboardingService.getSocietyDetails,
  onboardSocietyBatch: societyOnboardingService.onboardSocietyBatch,

  // Visitors
  subscribeVisitors(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(
      collection(db, `societies/${societyId}/visitors`),
      orderBy('entryTime', 'desc')
    );
    return onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        callback(data);
      },
      onError
    );
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
    if (!societyId || !visitorId) {
      throw new Error('Society ID and Visitor ID are required');
    }
    await updateDoc(doc(db, `societies/${societyId}/visitors`, visitorId), {
      status,
      updatedAt: new Date().toISOString(),
    });
  },

  // Amenities
  subscribeAmenities: amenityService.subscribeAmenities,
  createAmenity: amenityService.createAmenity,
  subscribeAmenityBookings: amenityService.subscribeAmenityBookings,
  updateAmenityBookingStatus: amenityService.updateAmenityBookingStatus,

  // Notices
  subscribeNotices: noticeService.subscribeNotices,
  createNotice: noticeService.createNotice,
  deleteNotice: noticeService.deleteNotice,

  // Documents
  subscribeDocuments(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(
      collection(db, `societies/${societyId}/documents`),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        callback(data);
      },
      onError
    );
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
    return onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        callback(data);
      },
      onError
    );
  },

  async assignParkingSlot(societyId, slotId, assignedData) {
    if (!societyId || !slotId) {
      throw new Error('Society ID and Slot ID are required');
    }
    await setDoc(
      doc(db, `societies/${societyId}/parking`, slotId),
      {
        ...assignedData,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  },

  // Notifications
  subscribeNotifications(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(
      collection(db, `societies/${societyId}/notifications`),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        callback(data);
      },
      onError
    );
  },

  async markNotificationRead(societyId, notificationId) {
    if (!societyId || !notificationId) return;
    await updateDoc(
      doc(db, `societies/${societyId}/notifications`, notificationId),
      { read: true }
    );
  },

  async markAllNotificationsRead(societyId, notificationIds) {
    if (!societyId || !notificationIds || notificationIds.length === 0) return;
    const batch = writeBatch(db);
    notificationIds.forEach((id) => {
      const ref = doc(db, `societies/${societyId}/notifications`, id);
      batch.update(ref, { read: true });
    });
    await batch.commit();
  },

  // Global Search
  searchSocietyData: searchService.searchSocietyData,

  async createLead(leadData) {
    const docRef = doc(collection(db, 'leads'));
    await setDoc(docRef, {
      ...leadData,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  },
};
