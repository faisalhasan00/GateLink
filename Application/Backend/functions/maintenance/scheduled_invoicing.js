const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

/**
 * Helper: Format month string, e.g. "September 2026"
 */
function getMonthYearString(date = new Date()) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Helper: Format YYYY-MM code for invoice numbers
 */
function getYearMonthCode(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
}

/**
 * Helper: Calculate due date ISO string
 */
function getDueDateString(date = new Date(), dueDay = 15) {
  const due = new Date(date.getFullYear(), date.getMonth(), dueDay, 23, 59, 59);
  // Format as YYYY-MM-DD
  const yyyy = due.getFullYear();
  const mm = String(due.getMonth() + 1).padStart(2, "0");
  const dd = String(due.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Core Invoicing Logic for a single society
 */
async function generateMonthlyInvoicesForSociety(societyId, options = {}) {
  const db = getFirestore();
  const now = options.targetDate ? new Date(options.targetDate) : new Date();
  const currentMonthStr = options.month || getMonthYearString(now);
  const ymCode = getYearMonthCode(now);

  console.log(`[AutoInvoicing] Processing society: ${societyId} for ${currentMonthStr}...`);

  // 1. Fetch Society & Billing Config
  const societyDoc = await db.collection("societies").doc(societyId).get();
  if (!societyDoc.exists) {
    throw new Error(`Society ${societyId} not found`);
  }
  const societyData = societyDoc.data() || {};
  const societyName = societyData.name || societyData.societyName || "GateLink Community";

  // Fetch or default billing configuration
  const configSnap = await db.doc(`societies/${societyId}/metadata/billingConfig`).get();
  const config = configSnap.exists ? configSnap.data() : {};

  if (config.isAutoBillingEnabled === false && !options.isManualTrigger) {
    console.log(`[AutoInvoicing] Auto-billing disabled for society ${societyId}. Skipping.`);
    return { skipped: true, reason: "auto_billing_disabled" };
  }

  const baseMaintenance = Number(config.baseMaintenanceCharge ?? 3500);
  const parkingCharge = Number(config.parkingCharge ?? 0);
  const waterCharge = Number(config.waterCharge ?? 0);
  const sinkingFund = Number(config.sinkingFund ?? 0);
  const penaltyFee = 0;
  const totalAmount = baseMaintenance + parkingCharge + waterCharge + sinkingFund + penaltyFee;
  const billTitle = config.billingTitle || "Monthly Maintenance & Society Facilities";
  const dueDay = Number(config.dueDayOfMonth ?? 15);
  const dueDate = options.dueDate || getDueDateString(now, dueDay);

  // 2. Query Existing Bills for this month to ensure IDEMPOTENCY
  const existingBillsSnap = await db
    .collection(`societies/${societyId}/maintenance_bills`)
    .where("month", "==", currentMonthStr)
    .get();

  const billedResidentIds = new Set();
  const billedFlats = new Set();

  existingBillsSnap.docs.forEach((d) => {
    const data = d.data();
    if (data.residentUid) billedResidentIds.add(data.residentUid);
    if (data.flatNumber) billedFlats.add(data.flatNumber.trim().toUpperCase());
  });

  // 3. Fetch Active Residents / Occupied Flats
  const usersSnap = await db
    .collection(`societies/${societyId}/users`)
    .where("status", "in", ["active", "approved"])
    .get();

  let residentsList = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Fallback: If no subcollection users, query root users with this societyId
  if (residentsList.length === 0) {
    const rootUsersSnap = await db
      .collection("users")
      .where("societyId", "==", societyId)
      .where("status", "in", ["active", "approved"])
      .get();
    residentsList = rootUsersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  // Filter for resident roles only
  const validRoles = ["resident", "owner", "tenant", "user"];
  const targetResidents = residentsList.filter((u) => {
    const role = (u.role || "resident").toLowerCase();
    return validRoles.includes(role);
  });

  if (targetResidents.length === 0) {
    console.log(`[AutoInvoicing] No active residents found for society ${societyId}.`);
    return { generatedCount: 0, totalAmount: 0, skipped: true, reason: "no_active_residents" };
  }

  // 4. Batch Create Invoices
  let batch = db.batch();
  let opCount = 0;
  let createdCount = 0;
  const createdBills = [];
  const fcmTokensToNotify = [];

  for (let i = 0; i < targetResidents.length; i++) {
    const resident = targetResidents[i];
    const residentUid = resident.id || resident.uid;
    const flatNo = (resident.flatNumber || resident.flatNo || `Flat-${i + 1}`).trim().toUpperCase();

    // Prevent duplicate billing for this resident/flat
    if (billedResidentIds.has(residentUid) || billedFlats.has(flatNo)) {
      continue;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceNo = `INV/${ymCode}/${randomSuffix}`;
    const billRef = db.collection(`societies/${societyId}/maintenance_bills`).doc();

    const newBill = {
      id: billRef.id,
      billNumber: invoiceNo,
      invoiceNumber: invoiceNo,
      title: billTitle,
      month: currentMonthStr,
      dueDate: dueDate,
      maintenanceCharge: baseMaintenance,
      parkingCharge: parkingCharge,
      waterCharge: waterCharge,
      sinkingFund: sinkingFund,
      penaltyFee: penaltyFee,
      amount: totalAmount,
      status: "pending",
      residentUid: residentUid,
      residentName: resident.name || resident.displayName || "Resident",
      flatNumber: resident.flatNumber || flatNo,
      wing: resident.wing || resident.block || "A",
      societyId: societyId,
      societyName: societyName,
      isAutoGenerated: true,
      createdAt: new Date().toISOString(),
    };

    batch.set(billRef, newBill);
    createdBills.push(newBill);
    opCount++;
    createdCount++;

    if (resident.fcmToken) {
      fcmTokensToNotify.push({
        token: resident.fcmToken,
        residentName: newBill.residentName,
        billId: billRef.id,
        amount: totalAmount,
        dueDate: dueDate,
      });
    }

    // Commit batch if reaching 450 ops (Firestore max is 500)
    if (opCount >= 450) {
      await batch.commit();
      batch = db.batch();
      opCount = 0;
    }
  }

  if (opCount > 0) {
    await batch.commit();
  }

  console.log(`[AutoInvoicing] Created ${createdCount} invoices for society ${societyId} (Total: ₹${createdCount * totalAmount}).`);

  // 5. Send FCM Push Notifications
  if (fcmTokensToNotify.length > 0) {
    const messaging = getMessaging();
    const notificationPromises = fcmTokensToNotify.map(async (item) => {
      try {
        await messaging.send({
          token: item.token,
          notification: {
            title: `💳 Maintenance Due: ₹${item.amount}`,
            body: `Maintenance invoice for ${currentMonthStr} has been generated. Due by ${item.dueDate}.`,
          },
          data: {
            type: "bill",
            billId: item.billId,
            amount: String(item.amount),
            dueDate: item.dueDate,
            click_action: "FLUTTER_NOTIFICATION_CLICK",
          },
        });
      } catch (err) {
        console.warn(`[AutoInvoicing] FCM error for resident ${item.residentName}:`, err.message);
      }
    });

    await Promise.allSettled(notificationPromises);
  }

  // 6. Record Audit Log
  if (createdCount > 0) {
    await db.collection(`societies/${societyId}/audit_logs`).add({
      action: "Automated Monthly Invoicing",
      description: `Generated ${createdCount} maintenance invoices for ${currentMonthStr} (Total: ₹${createdCount * totalAmount}). Due: ${dueDate}`,
      performedBy: options.isManualTrigger ? (options.adminUid || "Society Admin") : "System Scheduler",
      category: "billing",
      createdAt: new Date().toISOString(),
    });
  }

  return {
    success: true,
    month: currentMonthStr,
    generatedCount: createdCount,
    totalAmount: createdCount * totalAmount,
    dueDate: dueDate,
  };
}

/**
 * ⏰ Firebase Scheduled Cloud Function
 * Runs daily at 00:05 AM IST (Cron: 5 0 * * *) in Asia/Kolkata
 * Automatically generates monthly maintenance bills for societies whose billing day is today.
 */
exports.scheduledMonthlyInvoicing = onSchedule(
  {
    schedule: "5 0 * * *", // 12:05 AM every day
    timeZone: "Asia/Kolkata",
    region: "asia-south1",
  },
  async (event) => {
    console.log("⏰ Starting Scheduled Monthly Invoicing Job (Asia/Kolkata)...");
    const db = getFirestore();
    const today = new Date();
    const currentDayOfMonth = today.getDate(); // 1 - 31

    const societiesSnap = await db.collection("societies").where("status", "==", "active").get();

    if (societiesSnap.empty) {
      console.log("[AutoInvoicing] No active societies found.");
      return;
    }

    let processedCount = 0;
    let totalInvoicesCreated = 0;

    for (const socDoc of societiesSnap.docs) {
      const societyId = socDoc.id;

      try {
        // Read society billing config
        const configSnap = await db.doc(`societies/${societyId}/metadata/billingConfig`).get();
        const config = configSnap.exists ? configSnap.data() : {};

        // If auto billing disabled, skip
        if (config.isAutoBillingEnabled === false) {
          continue;
        }

        // Default billing day is the 1st of the month
        const billingDay = Number(config.billingDayOfMonth ?? 1);

        // Check if today matches the society's billing day
        if (currentDayOfMonth === billingDay) {
          const res = await generateMonthlyInvoicesForSociety(societyId, { isManualTrigger: false });
          if (res.generatedCount) {
            totalInvoicesCreated += res.generatedCount;
          }
          processedCount++;
        }
      } catch (err) {
        console.error(`[AutoInvoicing] Error processing society ${societyId}:`, err);
      }
    }

    console.log(`⏰ Scheduled Monthly Invoicing completed: Processed ${processedCount} societies, created ${totalInvoicesCreated} total invoices.`);
  }
);

/**
 * ⚡ Callable Function: Manually trigger or dry-run monthly invoice generation from Society Admin Portal
 */
exports.triggerManualMonthlyInvoicing = onCall(
  { region: "asia-south1" },
  async (request) => {
    const { auth, data } = request;
    if (!auth) {
      throw new HttpsError("unauthenticated", "Authentication required");
    }

    const { societyId, month, dueDate, forceRegenerate } = data || {};
    if (!societyId) {
      throw new HttpsError("invalid-argument", "Missing societyId");
    }

    console.log(`[ManualInvoicing] Triggered by user ${auth.uid} for society ${societyId}...`);

    try {
      const result = await generateMonthlyInvoicesForSociety(societyId, {
        isManualTrigger: true,
        adminUid: auth.uid,
        month: month,
        dueDate: dueDate,
      });

      return result;
    } catch (error) {
      console.error("[ManualInvoicing] Error:", error);
      throw new HttpsError("internal", error.message || "Failed to generate monthly invoices");
    }
  }
);

/**
 * ⚙️ Callable Function: Get society billing configuration
 */
exports.getBillingConfig = onCall(
  { region: "asia-south1" },
  async (request) => {
    const { auth, data } = request;
    if (!auth) {
      throw new HttpsError("unauthenticated", "Authentication required");
    }

    const { societyId } = data || {};
    if (!societyId) {
      throw new HttpsError("invalid-argument", "Missing societyId");
    }

    const db = getFirestore();
    const configSnap = await db.doc(`societies/${societyId}/metadata/billingConfig`).get();

    if (!configSnap.exists) {
      return {
        isAutoBillingEnabled: true,
        billingDayOfMonth: 1,
        dueDayOfMonth: 15,
        baseMaintenanceCharge: 3500,
        parkingCharge: 500,
        waterCharge: 300,
        sinkingFund: 200,
        billingTitle: "Monthly Maintenance & Society Facilities",
      };
    }

    return configSnap.data();
  }
);

/**
 * ⚙️ Callable Function: Update society billing configuration
 */
exports.updateBillingConfig = onCall(
  { region: "asia-south1" },
  async (request) => {
    const { auth, data } = request;
    if (!auth) {
      throw new HttpsError("unauthenticated", "Authentication required");
    }

    const { societyId, config } = data || {};
    if (!societyId || !config) {
      throw new HttpsError("invalid-argument", "Missing societyId or config");
    }

    const db = getFirestore();
    const updatedConfig = {
      isAutoBillingEnabled: config.isAutoBillingEnabled ?? true,
      billingDayOfMonth: Number(config.billingDayOfMonth ?? 1),
      dueDayOfMonth: Number(config.dueDayOfMonth ?? 15),
      baseMaintenanceCharge: Number(config.baseMaintenanceCharge ?? 3500),
      parkingCharge: Number(config.parkingCharge ?? 0),
      waterCharge: Number(config.waterCharge ?? 0),
      sinkingFund: Number(config.sinkingFund ?? 0),
      billingTitle: config.billingTitle || "Monthly Maintenance & Society Facilities",
      updatedAt: new Date().toISOString(),
      updatedBy: auth.uid,
    };

    await db.doc(`societies/${societyId}/metadata/billingConfig`).set(updatedConfig, { merge: true });

    // Log audit
    await db.collection(`societies/${societyId}/audit_logs`).add({
      action: "Billing Configuration Updated",
      description: `Updated auto-invoicing rules (Auto: ${updatedConfig.isAutoBillingEnabled ? 'ON' : 'OFF'}, Base: ₹${updatedConfig.baseMaintenanceCharge}, Bill Day: ${updatedConfig.billingDayOfMonth}st/th, Due: ${updatedConfig.dueDayOfMonth}th)`,
      performedBy: auth.uid,
      category: "settings",
      createdAt: new Date().toISOString(),
    });

    return { success: true, config: updatedConfig };
  }
);
