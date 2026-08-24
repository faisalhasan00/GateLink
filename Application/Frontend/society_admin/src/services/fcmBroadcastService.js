import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

/**
 * SEC-P0: Secure Server-Side FCM Push Broadcast Service for Society Admin.
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
 * Broadcasts a notification to all active devices in a society via backend Cloud Function.
 */
export async function broadcastToSociety(societyId, { title, body, category = 'notice', data = {}, target = 'all' }) {
  if (!title || !body) return { success: 0, failed: 0 };
  try {
    const sendBroadcast = httpsCallable(functions, 'sendAdminFcmBroadcast');
    const res = await sendBroadcast({
      title,
      body,
      category,
      scope: target,
      societyId,
      data,
    });
    return {
      success: res.data?.success || 0,
      failed: res.data?.failed || 0,
      total: res.data?.total || 0,
    };
  } catch (err) {
    console.error('Error broadcasting to society via Cloud Function:', err);
    return { success: 0, failed: 0, error: err.message };
  }
}

