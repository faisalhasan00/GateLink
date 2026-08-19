const { onSchedule } = require("firebase-functions/v2/scheduler");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { CashfreePayoutProvider } = require("../cashfree_payout_service");

/**
 * Firebase Scheduled Cloud Function
 * Runs automatically on the 10th of EVERY MONTH at 9:00 AM IST (Cron: 0 9 10 * *)
 * Calculates 2% Monthly Recurring Passive Income for active societies and disburses via Cashfree UPI.
 */
exports.scheduledMonthlyPartnerPayouts = onSchedule(
  {
    schedule: "0 9 10 * *", // 9:00 AM on the 10th day of every month
    timeZone: "Asia/Kolkata",
    region: "asia-south1",
  },
  async (event) => {
    console.log("⏰ Running Monthly Automated Partner Recurring Payout Job (10th of Month)...");

    const db = getFirestore();
    const leadsSnapshot = await db
      .collection("partner_leads")
      .where("status", "==", "won")
      .get();

    if (leadsSnapshot.empty) {
      console.log("No active won partner leads found for recurring payouts.");
      return;
    }

    let successCount = 0;
    let failedCount = 0;

    for (const leadDoc of leadsSnapshot.docs) {
      const lead = leadDoc.data();
      const leadId = leadDoc.id;

      // Ensure partner has a valid UPI ID
      if (!lead.partnerUpi) {
        console.warn(`Skipping lead ${leadId} (${lead.targetSocietyName}): Missing partner UPI ID.`);
        continue;
      }

      // Calculate monthly fee & 2% recurring commission
      const flatsCount = Number(lead.approxFlats || 100);
      let monthlyFee = Number(lead.monthlyFee || 5000);

      // Default 2% recurring rate
      const recurringPercent = Number(lead.monthlyRecurringPercent || 2.0);
      const payoutAmount = Math.round(monthlyFee * (recurringPercent / 100)) || 100;

      try {
        console.log(`Disbursing ₹${payoutAmount} to ${lead.partnerName} (${lead.partnerUpi}) for ${lead.targetSocietyName}...`);

        const transferRes = await CashfreePayoutProvider.requestInstantPayout({
          transferId: `REC_${leadId.slice(0, 6)}_${Date.now()}`,
          amount: payoutAmount,
          upiId: lead.partnerUpi,
          phone: lead.partnerPhone || "9876543210",
          name: lead.partnerName || "Partner",
          remarks: `GateLink 2% Monthly Passive Income (${lead.targetSocietyName})`,
        });

        // 1. Record individual payout in audit ledger sub-collection
        await db.collection("partner_leads").doc(leadId).collection("payout_history").add({
          type: "monthly_recurring",
          amount: payoutAmount,
          utrNumber: transferRes.utrNumber,
          partnerUpi: lead.partnerUpi,
          status: "SUCCESS",
          monthPeriod: new Date().toISOString().substring(0, 7), // e.g. "2026-08"
          processedAt: FieldValue.serverTimestamp(),
        });

        // 2. Update master lead total earnings
        await db.collection("partner_leads").doc(leadId).set(
          {
            lastRecurringPayoutAt: FieldValue.serverTimestamp(),
            totalRecurringEarned: FieldValue.increment(payoutAmount),
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

        successCount++;
      } catch (err) {
        console.error(`Error processing recurring payout for lead ${leadId}:`, err);
        failedCount++;
      }
    }

    console.log(`✅ Automated Monthly Payout Job Completed. Success: ${successCount}, Failures: ${failedCount}`);
  }
);
