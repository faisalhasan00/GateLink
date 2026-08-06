import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Initialize Firebase Admin
const serviceAccount = JSON.parse(readFileSync('./societysphere-firebase-adminsdk.json', 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
const auth = admin.auth();

async function createTestGuard() {
  const email = 'guard@society.com';
  const password = 'password123';
  const name = 'Main Gate Guard';

  try {
    console.log('1. Looking for Society...');
    const societyQuery = await db.collection('societies').where('code', '==', 'SOC-001').limit(1).get();
    if (societyQuery.empty) {
      console.log('Society not found! Run seedDatabase.js first.');
      process.exit(1);
    }
    const societyId = societyQuery.docs[0].id;
    console.log(`Found Society: ${societyId}`);

    console.log('2. Creating Firebase Auth User...');
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      console.log('User already exists in Auth, updating password...');
      await auth.updateUser(userRecord.uid, { password, displayName: name });
    } catch (e) {
      userRecord = await auth.createUser({
        email,
        password,
        displayName: name,
      });
      console.log('Created new Auth User.');
    }

    console.log('3. Saving Guard Profile to Firestore...');
    await db.collection(`societies/${societyId}/users`).doc(userRecord.uid).set({
      uid: userRecord.uid,
      name: name,
      email: email,
      role: 'guard',
      societyId: societyId,
      status: 'active',
      createdAt: new Date().toISOString()
    });

    console.log('\n✅ Test Guard Created Successfully!');
    console.log('-----------------------------------');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('-----------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Error creating guard:', error);
    process.exit(1);
  }
}

createTestGuard();
