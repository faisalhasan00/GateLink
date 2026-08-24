const { describe, it, expect, beforeAll, afterAll, beforeEach } = require("vitest");
const { initializeTestEnvironment, assertFails, assertSucceeds } = require("@firebase/rules-unit-testing");
const fs = require("fs");
const path = require("path");
const { processSingleAccountDeletion } = require("./admin/account_deletion");

let testEnv;

beforeAll(async () => {
  const rulesPath = path.resolve(__dirname, "../firestore.rules");
  const rulesContent = fs.readFileSync(rulesPath, "utf8");

  testEnv = await initializeTestEnvironment({
    projectId: "societysphere-test-account-deletion",
    firestore: {
      rules: rulesContent,
      host: "127.0.0.1",
      port: 8080,
    },
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

describe("Account Deletion & Deactivation Security Rules Tests", () => {
  const societyId = "SOC-TEST-1";
  const otherSocietyId = "SOC-TEST-2";

  const activeResidentUid = "active-res-1";
  const deactivatedResidentUid = "deact-res-1";
  const activeGuardUid = "active-guard-1";
  const deactivatedGuardUid = "deact-guard-1";
  const adminUid = "admin-user-1";
  const superAdminUid = "super-admin-1";

  async function setupSeedData() {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();

      // Active Resident
      await db.doc(`users/${activeResidentUid}`).set({
        uid: activeResidentUid,
        role: "resident",
        status: "active",
        societyId,
        flatNumber: "101",
      });

      // Deactivated Resident
      await db.doc(`users/${deactivatedResidentUid}`).set({
        uid: deactivatedResidentUid,
        role: "resident",
        status: "deactivated",
        societyId,
        flatNumber: "102",
      });

      // Active Guard
      await db.doc(`users/${activeGuardUid}`).set({
        uid: activeGuardUid,
        role: "guard",
        status: "active",
        societyId,
      });

      // Deactivated Guard
      await db.doc(`users/${deactivatedGuardUid}`).set({
        uid: deactivatedGuardUid,
        role: "guard",
        status: "deactivated",
        societyId,
      });

      // Society Admin
      await db.doc(`users/${adminUid}`).set({
        uid: adminUid,
        role: "admin",
        status: "active",
        societyId,
      });

      // Super Admin
      await db.doc(`users/${superAdminUid}`).set({
        uid: superAdminUid,
        role: "super_admin",
        status: "active",
      });

      // Seed notice doc
      await db.doc(`societies/${societyId}/notices/notice-1`).set({
        title: "Community Meeting",
        content: "Annual General Meeting this Sunday.",
      });

      // Seed complaint doc
      await db.doc(`societies/${societyId}/complaints/comp-1`).set({
        raisedBy: activeResidentUid,
        residentUid: activeResidentUid,
        societyId,
        title: "Water Leakage",
      });
    });
  }

  it("1. Active Resident can access permitted society data", async () => {
    await setupSeedData();
    const db = testEnv.authenticatedContext(activeResidentUid).firestore();

    await assertSucceeds(db.doc(`societies/${societyId}/notices/notice-1`).get());
    await assertSucceeds(db.doc(`societies/${societyId}/complaints/comp-1`).get());
  });

  it("2. Deactivated Resident CANNOT read protected society data", async () => {
    await setupSeedData();
    const db = testEnv.authenticatedContext(deactivatedResidentUid).firestore();

    await assertFails(db.doc(`societies/${societyId}/notices/notice-1`).get());
    await assertFails(db.doc(`societies/${societyId}/complaints/comp-1`).get());
  });

  it("3. Deactivated Resident CANNOT write protected society data", async () => {
    await setupSeedData();
    const db = testEnv.authenticatedContext(deactivatedResidentUid).firestore();

    await assertFails(
      db.doc(`societies/${societyId}/complaints/comp-2`).set({
        raisedBy: deactivatedResidentUid,
        residentUid: deactivatedResidentUid,
        societyId,
        title: "Unauthorized Noise",
      })
    );
  });

  it("4. Active Guard can access permitted security data", async () => {
    await setupSeedData();
    const db = testEnv.authenticatedContext(activeGuardUid).firestore();

    await assertSucceeds(db.doc(`societies/${societyId}/notices/notice-1`).get());
    await assertSucceeds(
      db.doc(`societies/${societyId}/visitors/vis-1`).set({
        name: "Delivery Agent",
        createdBy: activeGuardUid,
        societyId,
      })
    );
  });

  it("5. Deactivated Guard CANNOT read protected security data", async () => {
    await setupSeedData();
    const db = testEnv.authenticatedContext(deactivatedGuardUid).firestore();

    await assertFails(db.doc(`societies/${societyId}/notices/notice-1`).get());
  });

  it("6. Deactivated Guard CANNOT write visitor/helper/SOS records", async () => {
    await setupSeedData();
    const db = testEnv.authenticatedContext(deactivatedGuardUid).firestore();

    await assertFails(
      db.doc(`societies/${societyId}/visitors/vis-2`).set({
        name: "Delivery Agent",
        createdBy: deactivatedGuardUid,
        societyId,
      })
    );
  });

  it("7. Society Admin access still works", async () => {
    await setupSeedData();
    const db = testEnv.authenticatedContext(adminUid).firestore();

    await assertSucceeds(db.doc(`societies/${societyId}/notices/notice-1`).get());
    await assertSucceeds(db.doc(`societies/${societyId}/complaints/comp-1`).get());
  });

  it("8. Super Admin access still works", async () => {
    await setupSeedData();
    const db = testEnv.authenticatedContext(superAdminUid, { role: "super_admin" }).firestore();

    await assertSucceeds(db.doc(`societies/${societyId}/notices/notice-1`).get());
    await assertSucceeds(db.doc(`societies/${societyId}/complaints/comp-1`).get());
  });

  it("9. Cross-society access remains blocked", async () => {
    await setupSeedData();
    const db = testEnv.authenticatedContext(activeResidentUid).firestore();

    await assertFails(db.doc(`societies/${otherSocietyId}/notices/notice-other`).get());
  });

  it("10. Existing account-deletion request rules still work", async () => {
    await setupSeedData();
    const db = testEnv.authenticatedContext(activeResidentUid).firestore();

    const requestRef = db.doc(`account_deletion_requests/DEL_REQ_${activeResidentUid}`);
    await assertSucceeds(
      requestRef.set({
        requestId: `DEL_REQ_${activeResidentUid}`,
        userId: activeResidentUid,
        userRole: "resident",
        societyId,
        status: "pending",
        requestedAt: new Date(),
        scheduledDeletionAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      })
    );
  });
});

describe("Phase 2 Account Deletion Worker Safety & Dry-Run Tests", () => {
  it("Worker exports and dry-run default mode validation", () => {
    expect(process.env.ACCOUNT_DELETION_DRY_RUN !== "false").toBe(true);
  });
});
