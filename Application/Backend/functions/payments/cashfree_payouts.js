const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { CashfreePayoutProvider } = require("../cashfree_payout_service");

/**
 * Super Admin Callable Cloud Function to trigger 1-Click Instant Cashfree UPI Payout
 */
exports.triggerCashfreePayout = onCall(
  { region: "asia-south1", cors: true },
  async (request) => {
    // 1. Verify Authentication
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Authentication required.");
    }

    const { leadId, amount, upiId, notes } = request.data || {};

    if (!leadId || !amount) {
      throw new HttpsError("invalid-argument", "Missing required leadId or amount parameters.");
    }

    const db = getFirestore();
    const leadRef = db.collection("partner_leads").doc(leadId);
    const leadDoc = await leadRef.get();

    if (!leadDoc.exists) {
      throw new HttpsError("not-found", `Partner lead document ${leadId} does not exist.`);
    }

    const leadData = leadDoc.data();
    finalUpi = upiId || leadData.partnerUpi;

    if (!finalUpi) {
      throw new HttpsError(
        "failed-precondition",
        "Partner UPI ID is missing. Please provide a valid UPI ID before initiating payout."
      );
    }

    try {
      const payoutRes = await CashfreePayoutProvider.requestInstantPayout({
        transferId: `PAYOUT_${leadId.slice(0, 8)}_${Date.now()}`,
        amount: Number(amount),
        upiId: finalUpi,
        phone: leadData.partnerPhone || "9876543210",
        name: leadData.partnerName || "Partner",
        remarks: notes || `GateLink Commission Payout for ${leadData.targetSocietyName || "Society"}`,
      });

      // Update Firestore Partner Lead record
      await leadRef.set(
        {
          payoutStatus: "paid",
          payoutTotal: Number(amount),
          utrNumber: payoutRes.utrNumber,
          payoutMethod: "CASHFREE_UPI",
          payoutNotes: notes || "Instant Cashfree UPI Payout",
          paidAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      return {
        success: true,
        utrNumber: payoutRes.utrNumber,
        payoutTotal: Number(amount),
        partnerUpi: finalUpi,
        message: payoutRes.message || "Payout transferred successfully via Cashfree UPI!",
      };
    } catch (err) {
      console.error("Cashfree Instant Payout Error:", err);
      throw new HttpsError("internal", err.message || "Failed to process instant payout.");
    }
  }
);
