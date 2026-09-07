import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../firebase';

export const noticeService = {
  subscribeNotices(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(
      collection(db, `societies/${societyId}/notices`),
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

  async createNotice(societyId, noticeData) {
    if (!societyId) throw new Error('Society ID is required');
    const docRef = doc(collection(db, `societies/${societyId}/notices`));
    const payload = {
      ...noticeData,
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload);

    import('../fcmBroadcastService')
      .then(({ broadcastToSociety }) => {
        const categoryIcon =
          noticeData.category === 'Emergency'
            ? '🚨'
            : noticeData.category === 'Maintenance'
            ? '🔧'
            : '📢';
        broadcastToSociety(societyId, {
          title: `${categoryIcon} ${noticeData.title}`,
          body:
            noticeData.body || 'New official notice posted by Society Admin.',
          category: 'notice',
          data: {
            noticeId: docRef.id,
            category: noticeData.category || 'General',
          },
        }).catch((err) => console.warn('FCM broadcast notice warning:', err));
      })
      .catch((err) => console.warn('FCM module load warning:', err));

    return docRef.id;
  },

  async deleteNotice(societyId, noticeId) {
    if (!societyId || !noticeId) {
      throw new Error('Society ID and Notice ID are required');
    }
    await deleteDoc(doc(db, `societies/${societyId}/notices`, noticeId));
  },
};
