import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../firebase';

export const amenityService = {
  subscribeAmenities(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(collection(db, `societies/${societyId}/amenities`));
    return onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        callback(data);
      },
      onError
    );
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
    const q = query(
      collection(db, `societies/${societyId}/amenity_bookings`),
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

  async updateAmenityBookingStatus(societyId, bookingId, status) {
    if (!societyId || !bookingId) {
      throw new Error('Society ID and Booking ID are required');
    }
    await updateDoc(
      doc(db, `societies/${societyId}/amenity_bookings`, bookingId),
      {
        status,
        updatedAt: new Date().toISOString(),
      }
    );
  },
};
