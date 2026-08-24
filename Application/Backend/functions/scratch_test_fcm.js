const admin = require('firebase-admin');
const serviceAccount = {
  "type": "service_account",
  "project_id": "societysphere-b2538",
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID || "",
  "private_key": process.env.FIREBASE_PRIVATE_KEY || "",
  "client_email": "firebase-adminsdk-fbsvc@societysphere-b2538.iam.gserviceaccount.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const messaging = admin.messaging();

async function runTest() {
  const userDoc = await db.collection('users').doc('aHIPtouYwqOo9z3Ywux78hhw7zy1').get();
  const data = userDoc.data();
  console.log('Target User:', data.name, 'Flat:', data.flatNumber, 'FCM Token:', data.fcmToken);

  const payload = {
    token: data.fcmToken,
    notification: {
      title: '🚪 Visitor at Gate — Flat A-102',
      body: 'Rahul Kumar (Guest) is waiting for entry approval.',
    },
    data: {
      type: 'visitor_pending',
      visitorId: 'test_vis_real',
      societyId: 'SOC-FAI919',
      hostFlat: 'A-102',
      visitorName: 'Rahul Kumar',
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
  console.log('SUCCESS! Real phone notification delivered with ID:', response);
}

runTest().then(() => process.exit(0)).catch(e => { console.error('FCM Error:', e); process.exit(1); });
