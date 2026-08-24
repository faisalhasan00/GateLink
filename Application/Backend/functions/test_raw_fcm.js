const { GoogleAuth } = require('google-auth-library');
const https = require('https');

const serviceAccount = {
  "type": "service_account",
  "project_id": "societysphere-b2538",
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID || "",
  "private_key": process.env.FIREBASE_PRIVATE_KEY || "",
  "client_email": "firebase-adminsdk-fbsvc@societysphere-b2538.iam.gserviceaccount.com"
};

async function testRawFcm() {
  const auth = new GoogleAuth({
    credentials: {
      client_email: serviceAccount.client_email,
      private_key: serviceAccount.private_key
    },
    scopes: ['https://www.googleapis.com/auth/firebase.messaging']
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();

  const tokenStr = 'fhxA9iELSxuFKvXke6MmOl:APA91bFwlePzU6bPfk9kMDWayq5VPWO36NlrXG6Gqa0Msv8o-o6AAmpD_4UHkpUBPJQ6MoeNhuZcurI4iYb92VXmIMEGNR444iACU__LcxyQNrNqi97l20k';

  const body = JSON.stringify({
    message: {
      token: tokenStr,
      notification: {
        title: '🚪 Visitor at Gate — Flat A-102',
        body: 'Rahul Kumar (Guest) is waiting for entry approval.'
      },
      data: {
        type: 'visitor_pending',
        visitorId: 'test_vis_raw',
        societyId: 'SOC-FAI919',
        hostFlat: 'A-102',
        visitorName: 'Rahul Kumar',
        visitorType: 'Guest',
        click_action: 'FLUTTER_NOTIFICATION_CLICK'
      },
      android: {
        priority: 'HIGH',
        notification: {
          channel_id: 'gate_security_channel',
          notification_priority: 'PRIORITY_MAX',
          default_sound: true,
          default_vibrate_timings: true,
          visibility: 'PUBLIC'
        }
      }
    }
  });

  const options = {
    hostname: 'fcm.googleapis.com',
    port: 443,
    path: '/v1/projects/societysphere-b2538/messages:send',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token.token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (d) => data += d);
    res.on('end', () => {
      console.log('HTTP Status:', res.statusCode);
      console.log('Response:', data);
    });
  });

  req.on('error', (e) => console.error('Req error:', e));
  req.write(body);
  req.end();
}

testRawFcm();
