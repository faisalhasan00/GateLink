import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Parse .env if present in current directory
const envPath = resolve(process.cwd(), '.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...rest] = trimmed.split('=');
      const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
      if (key && !process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  });
}

const prodConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyAEqP0hDR5zhpflZ7zTgwk5RxSulpyEwtA",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "societysphere-b2538.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "societysphere-b2538",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "societysphere-b2538.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "43273653500",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:43273653500:web:9c2c8c55c64a7b7f8f9b79"
};

const app = initializeApp(prodConfig);
const auth = getAuth(app);

const email = process.env.SUPER_ADMIN_EMAIL || process.argv[2];
const password = process.env.SUPER_ADMIN_PASSWORD || process.argv[3];

if (!email || !password) {
  console.error('Error: SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be provided via .env file or command-line arguments.');
  console.error('Usage: node create_prod_admin.mjs [email] [password]');
  process.exit(1);
}

async function setupProdAdmin() {
  console.log(`Setting up Super Admin account on production project for ${email}...`);
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    console.log(`SUCCESS! Created Super Admin user on production! UID: ${cred.user.uid}`);
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      console.log(`Account ${email} already exists on production project. Signing in to verify...`);
      try {
        const signCred = await signInWithEmailAndPassword(auth, email, password);
        console.log(`SUCCESS! Verified Super Admin on production! UID: ${signCred.user.uid}`);
      } catch (signErr) {
        console.error(`FAILED to sign into production:`, signErr.message);
      }
    } else {
      console.error(`FAILED to create account on production:`, err.code, err.message);
    }
  }
}

setupProdAdmin();

