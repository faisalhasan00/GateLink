const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { db, auth, FieldValue } = require("../config/firebase");

/**
 * 3. Approve Offline UTR Payment (Society Admin)
 */
const approveOfflinePayment = onRequest({ cors: true }, async (req, res) => {
  try {
    let authUser = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const idToken = authHeader.split("Bearer ")[1];
      try {
        authUser = await auth.verifyIdToken(idToken);
      } catch (authErr) {
        logger.error("Auth token verification error", {
          functionName: "approveOfflinePayment",
          error: authErr.message,
        });
      }
    }

    if (!authUser) {
      return res.status(401).json({ error: "Unauthorized: Admin auth required" });
    }

    const { societyId, maintenanceBillId } = req.body || {};
    if (!societyId || !maintenanceBillId) {
      return res.status(400).json({ error: "Missing parameters: societyId, maintenanceBillId" });
    }

    const billRef = db.doc(`societies/${societyId}/maintenance_bills/${maintenanceBillId}`);
    const billDoc = await billRef.get();

    if (!billDoc.exists) {
      return res.status(404).json({ error: "Bill not found" });
    }

    await billRef.update({
      status: "paid",
      approvedByAdminUid: authUser.uid,
      approvedAt: new Date().toISOString(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    logger.info("Offline UTR payment approved by admin", {
      functionName: "approveOfflinePayment",
      societyId,
      maintenanceBillId,
      adminUid: authUser.uid,
    });

    return res.status(200).json({ status: "SUCCESS", message: "Offline UTR payment approved successfully" });
  } catch (err) {
    logger.error("approveOfflinePayment error", {
      functionName: "approveOfflinePayment",
      error: err.message,
    });
    return res.status(500).json({ error: err.message });
  }
});

/**
 * 4. Reject Offline UTR Payment (Society Admin)
 */
const rejectOfflinePayment = onRequest({ cors: true }, async (req, res) => {
  try {
    let authUser = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const idToken = authHeader.split("Bearer ")[1];
      try {
        authUser = await auth.verifyIdToken(idToken);
      } catch (authErr) {
        logger.error("Auth token verification error", {
          functionName: "rejectOfflinePayment",
          error: authErr.message,
        });
      }
    }

    if (!authUser) {
      return res.status(401).json({ error: "Unauthorized: Admin auth required" });
    }

    const { societyId, maintenanceBillId, rejectionReason } = req.body || {};
    if (!societyId || !maintenanceBillId) {
      return res.status(400).json({ error: "Missing parameters: societyId, maintenanceBillId" });
    }

    const billRef = db.doc(`societies/${societyId}/maintenance_bills/${maintenanceBillId}`);
    const billDoc = await billRef.get();

    if (!billDoc.exists) {
      return res.status(404).json({ error: "Bill not found" });
    }

    await billRef.update({
      status: "pending",
      rejectionReason: rejectionReason || "UTR Reference verification failed",
      rejectedByAdminUid: authUser.uid,
      rejectedAt: new Date().toISOString(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    logger.info("Offline UTR payment rejected by admin", {
      functionName: "rejectOfflinePayment",
      societyId,
      maintenanceBillId,
      adminUid: authUser.uid,
      rejectionReason,
    });

    return res.status(200).json({ status: "SUCCESS", message: "Offline UTR payment reference rejected" });
  } catch (err) {
    logger.error("rejectOfflinePayment error", {
      functionName: "rejectOfflinePayment",
      error: err.message,
    });
    return res.status(500).json({ error: err.message });
  }
});

module.exports = {
  approveOfflinePayment,
  rejectOfflinePayment,
};
