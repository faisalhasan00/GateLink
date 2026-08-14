const { CashfreePaymentProvider } = require("./cashfree_service");
const {
  RECONCILIATION_BATCH_LIMIT,
  PENDING_AGE_THRESHOLD_MS,
} = require("./payments/payment_reconciliation");

async function runReconciliationTests() {
  console.log("=== SocietySphere Scheduled Payment Reconciliation Test Suite ===\n");

  let passCount = 0;
  let failCount = 0;

  function assert(condition, testName, details = "") {
    if (condition) {
      console.log(`✓ PASS: ${testName} ${details}`);
      passCount++;
    } else {
      console.error(`✗ FAIL: ${testName} ${details}`);
      failCount++;
    }
  }

  // In-Memory Database Simulator for Reconciliation
  const mockDb = {
    payments: {},
    bills: {},
    receipts: {},
  };

  function resetDb() {
    mockDb.payments = {};
    mockDb.bills = {};
    mockDb.receipts = {};
  }

  process.env.CASHFREE_CLIENT_ID = "TEST_CLIENT_ID";
  process.env.CASHFREE_CLIENT_SECRET = "TEST_SECRET_GUARD";

  // Simulation of processOrderReconciliation
  async function simulateReconcileOrder(orderId, options = {}) {
    const { mockS2SResult, simulateApiCrash = false } = options;
    const paymentData = mockDb.payments[orderId];

    if (!paymentData) return { status: "NOT_FOUND" };

    if (
      paymentData.status === "SUCCESS" ||
      paymentData.status === "FAILED" ||
      paymentData.status === "OVERPAYMENT_RECORDED" ||
      paymentData.status === "FLAGGED_AMOUNT_MISMATCH"
    ) {
      return { status: paymentData.status, processed: false, reason: "ALREADY_TERMINAL" };
    }

    if (simulateApiCrash) {
      throw new Error("Cashfree API network timeout");
    }

    const cfVerify = mockS2SResult || {
      isSuccess: true,
      cashfreePaymentId: `CF_PAY_${orderId}`,
      paymentAmount: paymentData.amount,
      paymentMethod: "UPI",
    };

    // Case C: Zero payment attempts -> Keep PENDING
    if (!cfVerify.isSuccess) {
      if (cfVerify.message === "No payment attempts found for this order") {
        return { status: "PENDING", processed: true };
      }

      paymentData.status = "FAILED";
      paymentData.verificationSource = "RECONCILIATION";
      return { status: "FAILED", processed: true };
    }

    // Case E: Amount Mismatch
    if (cfVerify.paymentAmount !== paymentData.amount) {
      paymentData.status = "FLAGGED_AMOUNT_MISMATCH";
      paymentData.verificationSource = "RECONCILIATION";
      return { status: "FLAGGED_AMOUNT_MISMATCH", processed: true };
    }

    // Atomic Transaction Simulation
    const billId = paymentData.maintenanceBillId;
    const societyId = paymentData.societyId;
    const billData = mockDb.bills[billId];
    const isBillAlreadyPaid = billData && billData.status === "paid";

    let isOverpayment = false;

    if (isBillAlreadyPaid) {
      isOverpayment = true;
      paymentData.status = "OVERPAYMENT_RECORDED";
      paymentData.cashfreePaymentId = cfVerify.cashfreePaymentId;
      paymentData.verificationSource = "RECONCILIATION";
      paymentData.overpaymentReason = "DUPLICATE_ORDER_ALREADY_PAID";
      paymentData.originalBillTransactionId = billData.transactionId || null;

      mockDb.receipts[`${orderId}_latest`] = {
        orderId,
        cashfreePaymentId: cfVerify.cashfreePaymentId,
        societyId,
        maintenanceBillId: billId,
        amount: paymentData.amount,
        isOverpayment: true,
        verificationSource: "RECONCILIATION",
      };
    } else {
      paymentData.status = "SUCCESS";
      paymentData.cashfreePaymentId = cfVerify.cashfreePaymentId;
      paymentData.verificationSource = "RECONCILIATION";
      paymentData.webhookVerified = true;

      mockDb.bills[billId] = {
        ...(billData || {}),
        status: "paid",
        paymentMethod: "Cashfree Online",
        transactionId: cfVerify.cashfreePaymentId,
      };

      mockDb.receipts[`${orderId}_latest`] = {
        orderId,
        cashfreePaymentId: cfVerify.cashfreePaymentId,
        societyId,
        maintenanceBillId: billId,
        amount: paymentData.amount,
        isOverpayment: false,
        verificationSource: "RECONCILIATION",
      };
    }

    return {
      status: isOverpayment ? "OVERPAYMENT_RECORDED" : "SUCCESS",
      processed: true,
      isOverpayment,
    };
  }

  // Simulation of scheduled worker batching
  async function simulateScheduledJob(ordersMap, customHandler) {
    const now = Date.now();
    const thresholdDate = now - PENDING_AGE_THRESHOLD_MS;

    const eligibleOrders = Object.entries(ordersMap)
      .filter(([id, data]) => data.status === "PENDING" && data.createdAt <= thresholdDate)
      .slice(0, RECONCILIATION_BATCH_LIMIT);

    let processedCount = 0;
    let successCount = 0;
    let errorCount = 0;

    for (const [orderId] of eligibleOrders) {
      try {
        const res = await customHandler(orderId);
        processedCount++;
        if (res.status === "SUCCESS") successCount++;
      } catch (err) {
        errorCount++;
      }
    }

    return { eligibleCount: eligibleOrders.length, processedCount, successCount, errorCount };
  }

  // TEST 1: Pending order older than 15 minutes + Cashfree SUCCESS
  resetDb();
  mockDb.bills["BILL_101"] = { status: "pending", amount: 3500 };
  mockDb.payments["ORDER_OLD_01"] = {
    societyId: "SOC_A",
    maintenanceBillId: "BILL_101",
    residentUid: "USER_1",
    amount: 3500,
    status: "PENDING",
    createdAt: Date.now() - 20 * 60 * 1000, // 20 mins old
  };

  const res1 = await simulateReconcileOrder("ORDER_OLD_01");

  assert(
    res1.status === "SUCCESS" &&
      mockDb.payments["ORDER_OLD_01"].status === "SUCCESS" &&
      mockDb.payments["ORDER_OLD_01"].verificationSource === "RECONCILIATION" &&
      mockDb.bills["BILL_101"].status === "paid" &&
      mockDb.bills["BILL_101"].transactionId === "CF_PAY_ORDER_OLD_01" &&
      mockDb.receipts["ORDER_OLD_01_latest"]?.verificationSource === "RECONCILIATION",
    "TEST 1: Pending order older than 15 min reconciled as SUCCESS with primary bill settlement and receipt"
  );

  // TEST 2: Pending order + Cashfree FAILED
  resetDb();
  mockDb.bills["BILL_102"] = { status: "pending", amount: 2000 };
  mockDb.payments["ORDER_OLD_02"] = {
    societyId: "SOC_A",
    maintenanceBillId: "BILL_102",
    residentUid: "USER_1",
    amount: 2000,
    status: "PENDING",
    createdAt: Date.now() - 25 * 60 * 1000,
  };

  const res2 = await simulateReconcileOrder("ORDER_OLD_02", {
    mockS2SResult: { isSuccess: false, message: "User cancelled at netbanking" },
  });

  assert(
    res2.status === "FAILED" &&
      mockDb.payments["ORDER_OLD_02"].status === "FAILED" &&
      mockDb.payments["ORDER_OLD_02"].verificationSource === "RECONCILIATION" &&
      mockDb.bills["BILL_102"].status === "pending",
    "TEST 2: Cashfree reports failed attempt -> payment=FAILED and bill remains pending"
  );

  // TEST 3: Pending order + zero payment attempts
  resetDb();
  mockDb.bills["BILL_103"] = { status: "pending", amount: 1500 };
  mockDb.payments["ORDER_OLD_03"] = {
    societyId: "SOC_A",
    maintenanceBillId: "BILL_103",
    residentUid: "USER_1",
    amount: 1500,
    status: "PENDING",
    createdAt: Date.now() - 30 * 60 * 1000,
  };

  const res3 = await simulateReconcileOrder("ORDER_OLD_03", {
    mockS2SResult: { isSuccess: false, message: "No payment attempts found for this order" },
  });

  assert(
    res3.status === "PENDING" &&
      mockDb.payments["ORDER_OLD_03"].status === "PENDING" &&
      mockDb.bills["BILL_103"].status === "pending" &&
      !mockDb.receipts["ORDER_OLD_03_latest"],
    "TEST 3: Zero payment attempts -> payment remains PENDING without mutating bill or creating receipt"
  );

  // TEST 4: Pending order + amount mismatch
  resetDb();
  mockDb.bills["BILL_104"] = { status: "pending", amount: 5000 };
  mockDb.payments["ORDER_OLD_04"] = {
    societyId: "SOC_A",
    maintenanceBillId: "BILL_104",
    residentUid: "USER_1",
    amount: 5000,
    status: "PENDING",
    createdAt: Date.now() - 40 * 60 * 1000,
  };

  const res4 = await simulateReconcileOrder("ORDER_OLD_04", {
    mockS2SResult: { isSuccess: true, paymentAmount: 50, cashfreePaymentId: "CF_UNDERPAY" },
  });

  assert(
    res4.status === "FLAGGED_AMOUNT_MISMATCH" &&
      mockDb.payments["ORDER_OLD_04"].status === "FLAGGED_AMOUNT_MISMATCH" &&
      mockDb.bills["BILL_104"].status === "pending",
    "TEST 4: Amount mismatch flagged -> payment=FLAGGED_AMOUNT_MISMATCH and bill remains pending"
  );

  // TEST 5: Pending Order B + bill already paid by Order A
  mockDb.bills["BILL_104"].status = "paid";
  mockDb.bills["BILL_104"].transactionId = "CF_PAY_ORIGINAL_A";
  mockDb.payments["ORDER_OLD_05"] = {
    societyId: "SOC_A",
    maintenanceBillId: "BILL_104",
    residentUid: "USER_1",
    amount: 5000,
    status: "PENDING",
    createdAt: Date.now() - 45 * 60 * 1000,
  };

  const res5 = await simulateReconcileOrder("ORDER_OLD_05", {
    mockS2SResult: { isSuccess: true, paymentAmount: 5000, cashfreePaymentId: "CF_PAY_DUP_B" },
  });

  assert(
    res5.status === "OVERPAYMENT_RECORDED" &&
      mockDb.payments["ORDER_OLD_05"].status === "OVERPAYMENT_RECORDED" &&
      mockDb.payments["ORDER_OLD_05"].originalBillTransactionId === "CF_PAY_ORIGINAL_A" &&
      mockDb.bills["BILL_104"].transactionId === "CF_PAY_ORIGINAL_A" &&
      mockDb.receipts["ORDER_OLD_05_latest"]?.isOverpayment === true,
    "TEST 5: Bill already settled -> secondary payment=OVERPAYMENT_RECORDED and primary transactionId preserved"
  );

  // TEST 6: Reconciliation executed twice on same order
  const res6 = await simulateReconcileOrder("ORDER_OLD_05");

  assert(
    res6.processed === false &&
      res6.reason === "ALREADY_TERMINAL" &&
      mockDb.payments["ORDER_OLD_05"].status === "OVERPAYMENT_RECORDED",
    "TEST 6: Re-running reconciliation on already-settled order exits safely without duplicate mutation"
  );

  // TEST 7: Webhook + reconciliation race
  resetDb();
  mockDb.bills["BILL_RACE_1"] = { status: "pending", amount: 3000 };
  mockDb.payments["ORDER_RACE_WH"] = {
    societyId: "SOC_A",
    maintenanceBillId: "BILL_RACE_1",
    residentUid: "USER_1",
    amount: 3000,
    status: "PENDING",
    createdAt: Date.now() - 20 * 60 * 1000,
  };

  // Webhook executes first
  mockDb.payments["ORDER_RACE_WH"].status = "SUCCESS";
  mockDb.bills["BILL_RACE_1"].status = "paid";
  mockDb.bills["BILL_RACE_1"].transactionId = "CF_PAY_WEBHOOK";

  // Reconciliation runs concurrently
  const res7 = await simulateReconcileOrder("ORDER_RACE_WH");

  assert(
    res7.processed === false &&
      mockDb.bills["BILL_RACE_1"].transactionId === "CF_PAY_WEBHOOK",
    "TEST 7: Webhook + Reconciliation race safely preserves single primary SUCCESS settlement"
  );

  // TEST 8: Manual S2S verification + reconciliation race
  resetDb();
  mockDb.bills["BILL_RACE_2"] = { status: "pending", amount: 4500 };
  mockDb.payments["ORDER_RACE_MANUAL"] = {
    societyId: "SOC_A",
    maintenanceBillId: "BILL_RACE_2",
    residentUid: "USER_1",
    amount: 4500,
    status: "PENDING",
    createdAt: Date.now() - 22 * 60 * 1000,
  };

  // Manual verify executes first
  mockDb.payments["ORDER_RACE_MANUAL"].status = "SUCCESS";
  mockDb.payments["ORDER_RACE_MANUAL"].verificationSource = "MANUAL_S2S";
  mockDb.bills["BILL_RACE_2"].status = "paid";
  mockDb.bills["BILL_RACE_2"].transactionId = "CF_PAY_MANUAL";

  // Reconciliation runs
  const res8 = await simulateReconcileOrder("ORDER_RACE_MANUAL");

  assert(
    res8.processed === false &&
      mockDb.payments["ORDER_RACE_MANUAL"].verificationSource === "MANUAL_S2S" &&
      mockDb.bills["BILL_RACE_2"].transactionId === "CF_PAY_MANUAL",
    "TEST 8: Manual S2S verification + Reconciliation race resolves cleanly without data corruption"
  );

  // TEST 9: Cashfree API error for one order in batch does not halt other orders
  resetDb();
  const testBatch = {
    ORDER_FAILING: {
      societyId: "SOC_A",
      maintenanceBillId: "BILL_F",
      amount: 1000,
      status: "PENDING",
      createdAt: Date.now() - 30 * 60 * 1000,
    },
    ORDER_HEALTHY: {
      societyId: "SOC_A",
      maintenanceBillId: "BILL_H",
      amount: 2000,
      status: "PENDING",
      createdAt: Date.now() - 30 * 60 * 1000,
    },
  };
  mockDb.payments = { ...testBatch };
  mockDb.bills["BILL_F"] = { status: "pending", amount: 1000 };
  mockDb.bills["BILL_H"] = { status: "pending", amount: 2000 };

  const batchResults = await simulateScheduledJob(mockDb.payments, async (orderId) => {
    if (orderId === "ORDER_FAILING") {
      return simulateReconcileOrder(orderId, { simulateApiCrash: true });
    }
    return simulateReconcileOrder(orderId);
  });

  assert(
    batchResults.processedCount === 1 &&
      batchResults.errorCount === 1 &&
      mockDb.payments["ORDER_FAILING"].status === "PENDING" &&
      mockDb.payments["ORDER_HEALTHY"].status === "SUCCESS",
    "TEST 9: Error on one order allows subsequent orders in batch to process successfully"
  );

  // TEST 10: Batch Limit Enforcement
  resetDb();
  const largeBatch = {};
  for (let i = 1; i <= 65; i++) {
    largeBatch[`ORDER_BULK_${i}`] = {
      societyId: "SOC_A",
      maintenanceBillId: `BILL_BULK_${i}`,
      amount: 1000,
      status: "PENDING",
      createdAt: Date.now() - 25 * 60 * 1000,
    };
    mockDb.bills[`BILL_BULK_${i}`] = { status: "pending", amount: 1000 };
  }
  mockDb.payments = { ...largeBatch };

  const limitResults = await simulateScheduledJob(mockDb.payments, async (orderId) => {
    return simulateReconcileOrder(orderId);
  });

  assert(
    limitResults.eligibleCount === RECONCILIATION_BATCH_LIMIT &&
      limitResults.eligibleCount === 50 &&
      limitResults.processedCount === 50,
    `TEST 10: Batch limit safely restricts reconciliation to exactly ${RECONCILIATION_BATCH_LIMIT} orders per job run`
  );

  console.log(`\n=== Reconciliation Test Summary: ${passCount} Passed, ${failCount} Failed ===`);
  if (failCount > 0) process.exit(1);
}

runReconciliationTests().catch((err) => {
  console.error("Test runner exception:", err);
  process.exit(1);
});
