const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const fs = require('fs');
const path = require('path');

let testEnv;

beforeAll(async () => {
  const rulesPath = path.resolve(__dirname, '../firestore.rules');
  const rulesContent = fs.readFileSync(rulesPath, 'utf8');

  testEnv = await initializeTestEnvironment({
    projectId: 'societysphere-test-project',
    firestore: {
      rules: rulesContent,
      host: '127.0.0.1',
      port: 8080
    }
  });
});

afterAll(async () => {
  if (testEnv) {
    await testEnv.cleanup();
  }
});

beforeEach(async () => {
  if (testEnv) {
    await testEnv.clearFirestore();
  }
});

describe('Firestore Rules Emulator Security Tests', () => {
  const societyA = 'SOC-ALPHA';
  const societyB = 'SOC-BETA';

  const residentAContext = { uid: 'res-a-uid', role: 'resident', societyId: societyA, flatNumber: '101' };
  const residentBContext = { uid: 'res-b-uid', role: 'resident', societyId: societyB, flatNumber: '202' };
  const adminAContext = { uid: 'admin-a-uid', role: 'admin', societyId: societyA };
  const guardAContext = { uid: 'guard-a-uid', role: 'guard', societyId: societyA };
  const superAdminContext = { uid: 'super-admin-uid', role: 'super_admin' };

  // Setup seed documents using admin context
  async function setupSeedData() {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      
      // Society A membership doc
      await db.doc(`societies/${societyA}/users/res-a-uid`).set({
        role: 'resident',
        societyId: societyA,
        flatNumber: '101'
      });

      // Society B membership doc
      await db.doc(`societies/${societyB}/users/res-b-uid`).set({
        role: 'resident',
        societyId: societyB,
        flatNumber: '202'
      });

      // Admin A doc
      await db.doc(`societies/${societyA}/users/admin-a-uid`).set({
        role: 'admin',
        societyId: societyA
      });

      // Guard A doc
      await db.doc(`societies/${societyA}/users/guard-a-uid`).set({
        role: 'guard',
        societyId: societyA
      });

      // Root users docs
      await db.doc('users/res-a-uid').set({ role: 'resident', societyId: societyA, flatNumber: '101' });
      await db.doc('users/res-b-uid').set({ role: 'resident', societyId: societyB, flatNumber: '202' });
      await db.doc('users/admin-a-uid').set({ role: 'admin', societyId: societyA });
      await db.doc('users/guard-a-uid').set({ role: 'guard', societyId: societyA });

      // Maintenance bill in Society A
      await db.doc(`societies/${societyA}/maintenance_bills/bill-100`).set({
        amount: 3000,
        status: 'unpaid',
        societyId: societyA
      });

      // Parking in Society A
      await db.doc(`societies/${societyA}/parking/slot-101`).set({
        assignedTo: 'res-a-uid',
        residentUid: 'res-a-uid',
        slotNumber: 'P-101'
      });

      // SOS in Society A
      await db.doc(`societies/${societyA}/sos_alerts/sos-100`).set({
        residentUid: 'res-a-uid',
        userId: 'res-a-uid',
        triggeredBy: 'res-a-uid',
        status: 'ACTIVE'
      });
    });
  }

  // 1. Cross-Tenant Isolation
  it('1. Blocks Resident A from reading Society B data', async () => {
    await setupSeedData();
    const clientDb = testEnv.authenticatedContext('res-a-uid').firestore();
    await assertFails(clientDb.doc(`societies/${societyB}/users/res-b-uid`).get());
  });

  // 2. Private User Data Access
  it('2. Blocks Resident A from accessing Resident B root user document', async () => {
    await setupSeedData();
    const clientDb = testEnv.authenticatedContext('res-a-uid').firestore();
    await assertFails(clientDb.doc('users/res-b-uid').get());
  });

  // 3. Guard Cross-Society Isolation
  it('3. Blocks Guard A from writing/updating data in Society B', async () => {
    await setupSeedData();
    const clientDb = testEnv.authenticatedContext('guard-a-uid').firestore();
    await assertFails(clientDb.doc(`societies/${societyB}/helper_logs/log-1`).set({ action: 'checkin' }));
  });

  // 4. Admin Society Restriction
  it('4. Restricts Society Admin A from deleting records in Society B', async () => {
    await setupSeedData();
    const clientDb = testEnv.authenticatedContext('admin-a-uid').firestore();
    await assertFails(clientDb.doc(`societies/${societyB}/users/res-b-uid`).delete());
  });

  // 5. Super Admin Privileges
  it('5. Allows Super Admin global access to leads and ad campaigns', async () => {
    const clientDb = testEnv.authenticatedContext('super-admin-uid', { role: 'super_admin' }).firestore();
    await assertSucceeds(clientDb.doc('ad_campaigns/campaign-1').set({ title: 'Global Promo', active: true }));
  });

  // 6. Parking Ownership & Reassignment Prevention
  it('6. Blocks Resident A from reassigning parking slot to Resident B', async () => {
    await setupSeedData();
    const clientDb = testEnv.authenticatedContext('res-a-uid').firestore();
    await assertFails(clientDb.doc(`societies/${societyA}/parking/slot-101`).update({
      assignedTo: 'res-b-uid'
    }));
  });

  // 7. Maintenance Bill Direct Payment Prevention
  it('7. Blocks Resident A from directly marking maintenance bill as paid', async () => {
    await setupSeedData();
    const clientDb = testEnv.authenticatedContext('res-a-uid').firestore();
    await assertFails(clientDb.doc(`societies/${societyA}/maintenance_bills/bill-100`).update({
      status: 'paid'
    }));
  });

  // 8. Client Payments & Receipts Write Lock
  it('8. Prohibits direct client writes to /payments collection', async () => {
    const clientDb = testEnv.authenticatedContext('res-a-uid').firestore();
    await assertFails(clientDb.doc('payments/pay-123').set({ amount: 1000, status: 'SUCCESS' }));
  });

  // 9. Self-Only SOS Triggering
  it('9. Allows Resident A to create SOS alert for self', async () => {
    await setupSeedData();
    const clientDb = testEnv.authenticatedContext('res-a-uid').firestore();
    await assertSucceeds(clientDb.doc(`societies/${societyA}/sos_alerts/sos-101`).set({
      residentUid: 'res-a-uid',
      userId: 'res-a-uid',
      triggeredBy: 'res-a-uid',
      status: 'ACTIVE'
    }));
  });

  // 10. SOS Manipulation Prevention
  it('10. Blocks Resident B from modifying Resident A active SOS alert', async () => {
    await setupSeedData();
    const clientDb = testEnv.authenticatedContext('res-b-uid').firestore();
    await assertFails(clientDb.doc(`societies/${societyA}/sos_alerts/sos-100`).update({
      status: 'RESOLVED'
    }));
  });
});
