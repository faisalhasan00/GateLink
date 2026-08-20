const admin = require('firebase-admin');
const serviceAccount = {
  "type": "service_account",
  "project_id": "societysphere-b2538",
  "private_key_id": "27cf2c457830f74dffcb36a7c987a84575867896",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDE3ulHiNYfXECM\nc3kN7iFQCHs0ceBzER6hVNA0N6tD61la4tuXcyvfBCDIiTrO2mMluf5CQL5X97hX\n9rY/qznIvXqhXGT51x4bh6xRRhpq4CF+Fw9VeXj9RwBZhncNhlIPNo0TjFzMQ1JG\nX4zTQnQhx3Zt4JMeG5tHXl/7vEzrb5Gqi88m7gu4JTSBxdWlYluRWM+0ev5zvkO5\nPW+clETapDW3HHTNxfDELz8NQ5UX97mkvIdGg/BuCxDJ9VpZpQzbkOycBU8E7qvr\ntufN9dchImdGI1AWVx4Wsf4xPiYp/KZIOWLFh0KkGcVoYB/SKBKXZQ8HvhZVglln\nyK8ea3k3AgMBAAECggEADIQZc51M86BzUBqVQx/1CTgI0Sw+N0KK3nncZL13S3Ge\ndCtBB69gRiTmiqlCzlzO+dqJwh+ImmIa26jJLGIP4eW98p1DpCibdueYunAJBOtr\n5a7EoEwBN6T4bjigwADena37qRb+3VOYWvX/J30tkeoy6shgwgTCSfbDhmcRwtPv\n81T5TT1ANR6yZyw260Ryjxst2blIWKUpmxjKzF2giFmx4Ro0/CvH1AXnCoRdrqgr\n8E1NS73L5h4FJqBJs44s24yD92Ps+C92BY8TfTDneuujnK8Sd8YJOYc2CvQiRuhw\nWaiTR7aJ33KS72KIi5veMW+++RZRbEwUevmYQaLXmQKBgQDlBEHv+06nDDEwPcvl\nMYZB8KhoNYp7bGClEb621Wxs/kD3Ulyh1W3y5VnIcFDhQJziGT65ilQawCguizNf\ncL2G//jU+K2NKmhctr/sRE7h87kLj5aolTVN6QzaWCauiiE9PgBZ8UCRa8niRGpX\ndv8E1ltbOA2R88DY5aty8GkcPwKBgQDcEQyqt1bs1gwR6ezYrOrThL+0xAX7TovW\n+ye5yDRqGGcpdEIbgqpDX7nXTDfnulzs1hk3YfvQpXFiETOwoq7otHaLN5RRQORd\nddeNQ0bCUFWSYITHxWzVpIpJCpKdURr06F9g28iD0Jm3tAOMz0LfKXaNopKny93m\n7fDrvMPFCQKBgFTeugzURfaUBxqInCooq0d+hvpvdQ1+QWaK5/FbsF3H7414IUn8\nDU3pftdQADkpt7n2fw9FWxu6wGlXPseMwT/pVm6eZbqdz6UkOIW3XsBPkPDe2odJ\nHELuLcwwxM0D9YN7mae7RyFdH6jRj9MwDxvc0GhCoozHF12J53ql614DAoGBAKVc\nFlWNMD8EU8t+KB9kR4uq21ZcWVZN3hwrWt1px6DVN2dZ2XbMh13a500VE4kHa133\nPrlz4gEU4A7deCbJB38KY20W1Vb82Nw1eUPHgrruHG7CIePuwGoEmnhp/mNBl2zh\n0xF39MK/k1ILbQN4lfoUMOYae/Kj6NjmgDrS+5PpAoGADe98EOT0uTMpSi3Z1PUU\nNbt8xg6MQ8XmS3EXaOUmgbBvdjQl/j5eGB44ofoL2v7e9Eay1DqLW16c2LjQrS1Q\ngoToKANEOPazfXWK8cYGbS1jq/7L/SPqZ4wH5Y0m9Gd5RXRNfs+XQKQgq7PPYtm1\nbRSKKJW8JY5I1s79Mdb8eR4=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@societysphere-b2538.iam.gserviceaccount.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const messaging = admin.messaging();

async function runTest() {
  console.log('Fetching users to find FCM tokens...');
  const usersSnap = await db.collection('users').get();
  let targetToken = null;
  let targetUser = null;

  usersSnap.forEach(doc => {
    const data = doc.data();
    console.log(`User: ${doc.id}, Name: ${data.name || data.displayName}, Role: ${data.role}, Flat: ${data.flatNumber}, Token: ${data.fcmToken ? data.fcmToken.substring(0, 20) + '...' : 'NONE'}`);
    if (data.fcmToken && !targetToken) {
      targetToken = data.fcmToken;
      targetUser = data;
    }
  });

  if (!targetToken) {
    console.log('Searching in societies/*/users...');
    const socSnap = await db.collection('societies').get();
    for (const s of socSnap.docs) {
      const uSnap = await db.collection(`societies/${s.id}/users`).get();
      uSnap.forEach(doc => {
        const data = doc.data();
        console.log(`[Soc ${s.id}] User: ${doc.id}, Flat: ${data.flatNumber}, Token: ${data.fcmToken ? data.fcmToken.substring(0, 20) + '...' : 'NONE'}`);
        if (data.fcmToken && !targetToken) {
          targetToken = data.fcmToken;
          targetUser = data;
        }
      });
    }
  }

  if (!targetToken) {
    console.error('ERROR: No FCM token found in database!');
    return;
  }

  console.log(`\nSending FCM message to token: ${targetToken.substring(0, 25)}...`);
  const payload = {
    token: targetToken,
    notification: {
      title: '🚪 Visitor at Gate — Flat 101',
      body: 'Test Visitor (Guest) is waiting for entry approval.',
    },
    data: {
      type: 'visitor_pending',
      visitorId: 'test_vis_123',
      societyId: 'SOC-FAI919',
      hostFlat: '101',
      visitorName: 'Test Visitor',
      visitorType: 'Guest',
      click_action: 'FLUTTER_NOTIFICATION_CLICK'
    },
    android: {
      priority: 'high',
      notification: {
        channelId: 'gate_security_channel',
        priority: 'max',
        defaultSound: true,
        defaultVibrateTimings: true,
        visibility: 'public'
      }
    }
  };

  const response = await messaging.send(payload);
  console.log('SUCCESS! FCM Message ID:', response);
}

runTest().then(() => process.exit(0)).catch(e => { console.error('FCM Error:', e); process.exit(1); });
