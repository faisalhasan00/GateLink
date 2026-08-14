const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const { getMessaging } = require("firebase-admin/messaging");

// Initialize single Firebase Admin instance
initializeApp();

const db = getFirestore();
const auth = getAuth();
const messaging = getMessaging();

module.exports = {
  db,
  auth,
  messaging,
  FieldValue,
};
