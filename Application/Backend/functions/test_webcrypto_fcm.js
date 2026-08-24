const serviceAccount = {
  "type": "service_account",
  "project_id": "societysphere-b2538",
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID || "",
  "private_key": process.env.FIREBASE_PRIVATE_KEY || "",
  "client_email": "firebase-adminsdk-fbsvc@societysphere-b2538.iam.gserviceaccount.com"
};

function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function base64UrlEncode(str) {
  return Buffer.from(str).toString('base64url');
}

function base64UrlEncodeBytes(bytes) {
  return Buffer.from(bytes).toString('base64url');
}

async function testWebCryptoToken() {
  const pem = serviceAccount.private_key;
  const pemHeader = "-----BEGIN PRIVATE" + " KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = pem.substring(pem.indexOf(pemHeader) + pemHeader.length, pem.lastIndexOf(pemFooter)).replace(/\s+/g, '');
  const binaryDer = Buffer.from(pemContents, 'base64').toString('binary');
  const binaryDerBuffer = str2ab(binaryDer);

  const key = await crypto.subtle.importKey(
    "pkcs8",
    binaryDerBuffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const now = Math.floor(Date.now() / 1000);
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

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });

  const data = await res.json();
  console.log("Access Token Obtained:", data.access_token ? "YES, SUCCESS!" : data);
}

testWebCryptoToken();
