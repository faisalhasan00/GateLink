import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const prodConfig = {
  apiKey: "AIzaSyAEqP0hDR5zhpflZ7zTgwk5RxSulpyEwtA",
  authDomain: "societysphere-b2538.firebaseapp.com",
  projectId: "societysphere-b2538",
  storageBucket: "societysphere-b2538.firebasestorage.app",
  messagingSenderId: "43273653500",
  appId: "1:43273653500:web:9c2c8c55c64a7b7f8f9b79"
};

const app = initializeApp(prodConfig);
const auth = getAuth(app);

const email = 'mohammedfaisalhasan@gmail.com';
const password = 'Raj786f@';

async function setupProdAdmin() {
  console.log(`Creating Super Admin account on production project societysphere-b2538 for ${email}...`);
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    console.log(`SUCCESS! Created Super Admin user on production! UID: ${cred.user.uid}`);
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      console.log(`Account ${email} already exists on production project. Signing in...`);
      try {
        const signCred = await signInWithEmailAndPassword(auth, email, password);
        console.log(`SUCCESS! Signed into Super Admin on production! UID: ${signCred.user.uid}`);
      } catch (signErr) {
        console.error(`FAILED to sign into production:`, signErr.message);
      }
    } else {
      console.error(`FAILED to create account on production:`, err.code, err.message);
    }
  }
}

setupProdAdmin();
