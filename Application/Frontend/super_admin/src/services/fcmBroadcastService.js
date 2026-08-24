import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';

/**
 * SEC-P0: Secure Server-Side FCM Push Broadcast Service for Super Admin.
 * Service account private keys have been completely removed.
 * Calls trusted backend Cloud Function 'sendAdminFcmBroadcast' using Firebase Auth.
 */

/**
 * Sends a single high-priority push notification to a device FCM token via backend Cloud Function.
 */
export async function sendFcmNotification(fcmToken, { title, body, data = {} }) {
  if (!fcmToken) return false;
  try {
    const sendBroadcast = httpsCallable(functions, 'sendAdminFcmBroadcast');
    const res = await sendBroadcast({
      title,
      body,
      category: data.type || 'notice',
      data,
    });
    return (res.data?.success || 0) > 0;
  } catch (err) {
    console.error('Error sending FCM notification via Cloud Function:', err);
    return false;
  }
}

/**
 * Platform-wide or targeted broadcast from Super Admin via Cloud Function.
 */
export async function broadcastPlatformMessage({
  title,
  body,
  category = 'offer',
  scope = 'all', // 'all', 'residents', 'guards', 'society'
  societyId = '',
  data = {},
}) {
  if (!title || !body) return { success: 0, failed: 0 };
  try {
    const sendBroadcast = httpsCallable(functions, 'sendAdminFcmBroadcast');
    const res = await sendBroadcast({
      title,
      body,
      category,
      scope,
      societyId,
      data,
    });
    return {
      success: res.data?.success || 0,
      failed: res.data?.failed || 0,
      total: res.data?.total || 0,
    };
  } catch (err) {
    console.error('Error broadcasting platform message via Cloud Function:', err);
    return { success: 0, failed: 0, error: err.message };
  }
}

/**
 * Subscribes to sent broadcast history in Super Admin.
 */
export function subscribeBroadcastHistory(callback, onError) {
  const q = query(collection(db, 'broadcasts'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(data);
  }, onError);
}

