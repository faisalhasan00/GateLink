import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

const getValidEnv = (val, fallback) => {
  if (!val || typeof val !== 'string') return fallback;
  const clean = val.trim();
  if (clean.includes('YOUR_') || clean.includes('PLACEHOLDER') || clean.length < 20) {
    return fallback;
  }
  return clean;
};

const firebaseConfig = {
  apiKey: getValidEnv(import.meta.env.VITE_FIREBASE_API_KEY, "AIzaSyAEqP0hDR5zhpflZ7zTgwk5RxSulpyEwtA"),
  authDomain: getValidEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, "societysphere-b2538.firebaseapp.com"),
  projectId: getValidEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID, "societysphere-b2538"),
  storageBucket: getValidEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, "societysphere-b2538.firebasestorage.app"),
  messagingSenderId: getValidEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, "43273653500"),
  appId: getValidEnv(import.meta.env.VITE_FIREBASE_APP_ID, "1:43273653500:web:9c2c8c55c64a7b7f8f9b79"),
  measurementId: getValidEnv(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, "G-V5C3WYBEXT"),
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase App Check safely if reCAPTCHA Enterprise site key is provided
if (typeof window !== 'undefined') {
  const recaptchaKey = import.meta.env.VITE_RECAPTCHA_ENTERPRISE_KEY || import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  if (recaptchaKey && recaptchaKey.length > 10 && !recaptchaKey.includes('PLACEHOLDER')) {
    try {
      initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(recaptchaKey),
        isTokenAutoRefreshEnabled: true,
      });
    } catch (e) {
      console.warn('App Check initialization note:', e.message);
    }
  }
}

import { getFunctions, httpsCallable } from 'firebase/functions';

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, "us-central1");
export { httpsCallable };

