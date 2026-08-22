import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAEqP0hDR5zhpflZ7zTgwk5RxSulpyEwtA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "societysphere-b2538.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "societysphere-b2538",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "societysphere-b2538.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "43273653500",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:43273653500:web:9c2c8c55c64a7b7f8f9b79",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-V5C3WYBEXT",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
