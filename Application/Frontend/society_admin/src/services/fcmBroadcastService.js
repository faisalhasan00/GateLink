import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const serviceAccount = {
  "type": "service_account",
  "project_id": "societysphere-b2538",
  "private_key_id": "27cf2c457830f74dffcb36a7c987a84575867896",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDE3ulHiNYfXECM\nc3kN7iFQCHs0ceBzER6hVNA0N6tD61la4tuXcyvfBCDIiTrO2mMluf5CQL5X97hX\n9rY/qznIvXqhXGT51x4bh6xRRhpq4CF+Fw9VeXj9RwBZhncNhlIPNo0TjFzMQ1JG\nX4zTQnQhx3Zt4JMeG5tHXl/7vEzrb5Gqi88m7gu4JTSBxdWlYluRWM+0ev5zvkO5\nPW+clETapDW3HHTNxfDELz8NQ5UX97mkvIdGg/BuCxDJ9VpZpQzbkOycBU8E7qvr\ntufN9dchImdGI1AWVx4Wsf4xPiYp/KZIOWLFh0KkGcVoYB/SKBKXZQ8HvhZVglln\nyK8ea3k3AgMBAAECggEADIQZc51M86BzUBqVQx/1CTgI0Sw+N0KK3nncZL13S3Ge\ndCtBB69gRiTmiqlCzlzO+dqJwh+ImmIa26jJLGIP4eW98p1DpCibdueYunAJBOtr\n5a7EoEwBN6T4bjigwADena37qRb+3VOYWvX/J30tkeoy6shgwgTCSfbDhmcRwtPv\n81T5TT1ANR6yZyw260Ryjxst2blIWKUpmxjKzF2giFmx4Ro0/CvH1AXnCoRdrqgr\n8E1NS73L5h4FJqBJs44s24yD92Ps+C92BY8TfTDneuujnK8Sd8YJOYc2CvQiRuhw\nWaiTR7aJ33KS72KIi5veMW+++RZRbEwUevmYQaLXmQKBgQDlBEHv+06nDDEwPcvl\nMYZB8KhoNYp7bGClEb621Wxs/kD3Ulyh1W3y5VnIcFDhQJziGT65ilQawCguizNf\ncL2G//jU+K2NKmhctr/sRE7h87kLj5aolTVN6QzaWCauiiE9PgBZ8UCRa8niRGpX\ndv8E1ltbOA2R88DY5aty8GkcPwKBgQDcEQyqt1bs1gwR6ezYrOrThL+0xAX7TovW\n+ye5yDRqGGcpdEIbgqpDX7nXTDfnulzs1hk3YfvQpXFiETOwoq7otHaLN5RRQORd\nddeNQ0bCUFWSYITHxWzVpIpJCpKdURr06F9g28iD0Jm3tAOMz0LfKXaNopKny93m\n7fDrvMPFCQKBgFTeugzURfaUBxqInCooq0d+hvpvdQ1+QWaK5/FbsF3H7414IUn8\nDU3pftdQADkpt7n2fw9FWxu6wGlXPseMwT/pVm6eZbqdz6UkOIW3XsBPkPDe2odJ\nHELuLcwwxM0D9YN7mae7RyFdH6jRj9MwDxvc0GhCoozHF12J53ql614DAoGBAKVc\nFlWNMD8EU8t+KB9kR4uq21ZcWVZN3hwrWt1px6DVN2dZ2XbMh13a500VE4kHa133\nPrlz4gEU4A7deCbJB38KY20W1Vb82Nw1eUPHgrruHG7CIePuwGoEmnhp/mNBl2zh\n0xF39MK/k1ILbQN4lfoUMOYae/Kj6NjmgDrS+5PpAoGADe98EOT0uTMpSi3Z1PUU\nNbt8xg6MQ8XmS3EXaOUmgbBvdjQl/j5eGB44ofoL2v7e9Eay1DqLW16c2LjQrS1Q\ngoToKANEOPazfXWK8cYGbS1jq/7L/SPqZ4wH5Y0m9Gd5RXRNfs+XQKQgq7PPYtm1\nbRSKKJW8JY5I1s79Mdb8eR4=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@societysphere-b2538.iam.gserviceaccount.com"
};

let cachedToken = null;
let tokenExpiry = 0;

function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function base64UrlEncode(str) {
  const b64 = btoa(str);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlEncodeBytes(bytes) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getOAuth2AccessToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && tokenExpiry > now + 60) {
    return cachedToken;
  }

  try {
    const pem = serviceAccount.private_key;
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = pem.substring(pem.indexOf(pemHeader) + pemHeader.length, pem.lastIndexOf(pemFooter)).replace(/\s+/g, '');
    const binaryDer = atob(pemContents);
    const binaryDerBuffer = str2ab(binaryDer);

    const key = await crypto.subtle.importKey(
      "pkcs8",
      binaryDerBuffer,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const header = { alg: "RS256", typ: "JWT" };
    const claims = {
      iss: serviceAccount.client_email,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedClaims = base64UrlEncode(JSON.stringify(claims));
    const message = `${encodedHeader}.${encodedClaims}`;
    const messageBuffer = new TextEncoder().encode(message);

    const signature = await crypto.subtle.sign(
      { name: "RSASSA-PKCS1-v1_5" },
      key,
      messageBuffer
    );

    const jwt = `${message}.${base64UrlEncodeBytes(new Uint8Array(signature))}`;

    const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const oauthUrl = isDev ? '/api/google-oauth/token' : 'https://oauth2.googleapis.com/token';

    const res = await fetch(oauthUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    });

    const data = await res.json();
    if (data.access_token) {
      cachedToken = data.access_token;
      tokenExpiry = now + (data.expires_in || 3600);
      return cachedToken;
    }
    console.error("Failed to obtain OAuth2 token from Google:", data);
    return null;
  } catch (err) {
    console.error("Error signing Google OAuth2 JWT in browser:", err);
    return null;
  }
}

/**
 * Sends a single high-priority push notification to a device FCM token.
 */
export async function sendFcmNotification(fcmToken, { title, body, data = {} }) {
  if (!fcmToken) return false;

  const accessToken = await getOAuth2AccessToken();
  if (!accessToken) return false;

  const payload = {
    message: {
      token: fcmToken,
      notification: {
        title,
        body,
      },
      data: {
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
        ...data,
      },
      android: {
        priority: 'HIGH',
        notification: {
          channel_id: 'gate_security_channel',
          notification_priority: 'PRIORITY_MAX',
          default_sound: true,
          default_vibrate_timings: true,
          visibility: 'PUBLIC',
        },
      },
    },
  };

  try {
    const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const fcmUrl = isDev
      ? `/api/fcm-send/v1/projects/${serviceAccount.project_id}/messages:send`
      : `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`;

    const res = await fetch(fcmUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (err) {
    console.error("Error sending FCM notification:", err);
    return false;
  }
}

/**
 * Broadcasts a notification to all active devices in a society (residents, guards, or all).
 */
export async function broadcastToSociety(societyId, { title, body, category = 'notice', data = {}, target = 'all' }) {
  if (!societyId) return { success: 0, failed: 0 };

  const tokens = new Set();

  // 1. Fetch from global users where societyId matches
  try {
    const usersQuery = query(collection(db, 'users'), where('societyId', '==', societyId));
    const userDocs = await getDocs(usersQuery);
    userDocs.forEach(docSnap => {
      const userData = docSnap.data();
      if (userData.fcmToken && typeof userData.fcmToken === 'string' && userData.fcmToken.trim().length > 10) {
        if (target === 'residents' && userData.role && userData.role !== 'resident') return;
        if (target === 'guards' && userData.role && userData.role !== 'guard') return;
        tokens.add(userData.fcmToken.trim());
      }
    });
  } catch (err) {
    console.warn('Could not query root /users for FCM tokens:', err.message);
  }

  // 2. Fetch from society subcollection users
  try {
    const socUsersQuery = query(collection(db, `societies/${societyId}/users`));
    const socUserDocs = await getDocs(socUsersQuery);
    socUserDocs.forEach(docSnap => {
      const userData = docSnap.data();
      if (userData.fcmToken && typeof userData.fcmToken === 'string' && userData.fcmToken.trim().length > 10) {
        tokens.add(userData.fcmToken.trim());
      }
    });
  } catch (err) {
    console.warn('Could not query subcollection users for FCM tokens:', err.message);
  }

  // 3. Fetch guards from society guards subcollection if targeted
  if (target === 'all' || target === 'guards') {
    try {
      const guardsQuery = query(collection(db, `societies/${societyId}/guards`));
      const guardDocs = await getDocs(guardsQuery);
      guardDocs.forEach(docSnap => {
        const guardData = docSnap.data();
        if (guardData.fcmToken && typeof guardData.fcmToken === 'string' && guardData.fcmToken.trim().length > 10) {
          tokens.add(guardData.fcmToken.trim());
        }
      });
    } catch (err) {
      console.warn('Could not query guards for FCM tokens:', err.message);
    }
  }

  try {
    const tokenList = Array.from(tokens);
    if (tokenList.length === 0) {
      console.log('No active FCM tokens found in society:', societyId);
      return { success: 0, failed: 0, total: 0 };
    }

    let successCount = 0;
    let failCount = 0;

    await Promise.all(
      tokenList.map(async (token) => {
        const sent = await sendFcmNotification(token, {
          title,
          body,
          data: {
            type: category,
            societyId,
            ...data,
          },
        });
        if (sent) successCount++;
        else failCount++;
      })
    );

    return { success: successCount, failed: failCount, total: tokenList.length };
  } catch (err) {
    console.error('Error broadcasting to society:', err);
    return { success: 0, failed: 0, error: err.message };
  }
}
