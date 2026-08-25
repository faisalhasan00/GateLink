const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');

const APP_ID = '1:43273653500:android:2d22da2625510a728f9b79';
const PROJECT_ID = 'societysphere-b2538';
const SHA1_HASH = 'E0:17:71:49:76:41:45:D5:B2:44:C8:A7:09:80:30:99:F2:D7:37:46';
const SHA256_HASH = '8B:1C:92:A3:5B:A3:E2:22:E7:DD:F2:76:6E:8E:BA:9F:77:3F:C7:44:29:1B:E6:CF:4E:8E:0F:BE:08:48:B0:85';

async function addFingerprints() {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });

  const client = await auth.getClient();
  const tokenRes = await client.getAccessToken();
  const accessToken = tokenRes.token;

  console.log('Got GCP OAuth2 Access Token.');

  // 1. Add SHA-1
  console.log('Adding SHA-1 fingerprint...');
  const sha1Res = await fetch(`https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}/androidApps/${APP_ID}/sha`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      shaHash: SHA1_HASH,
      certType: 'SHA_1'
    })
  });

  const sha1Data = await sha1Res.json();
  console.log('SHA-1 Add Response:', JSON.stringify(sha1Data, null, 2));

  // 2. Add SHA-256
  console.log('Adding SHA-256 fingerprint...');
  const sha256Res = await fetch(`https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}/androidApps/${APP_ID}/sha`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      shaHash: SHA256_HASH,
      certType: 'SHA_256'
    })
  });

  const sha256Data = await sha256Res.json();
  console.log('SHA-256 Add Response:', JSON.stringify(sha256Data, null, 2));
}

addFingerprints().catch(console.error);
