import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Replace these with the actual config keys from the Firebase console later
 apiKey: "AIzaSyAEqP0hDR5zhpflZ7zTgwk5RxSulpyEwtA",
  authDomain: "societysphere-b2538.firebaseapp.com",
  projectId: "societysphere-b2538",
  storageBucket: "societysphere-b2538.firebasestorage.app",
  messagingSenderId: "43273653500",
  appId: "1:43273653500:web:9c2c8c55c64a7b7f8f9b79",
  measurementId: "G-V5C3WYBEXT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
