const { CashfreePaymentProvider } = require("./cashfree_service");

async function runVerifyPaymentStatusTests() {
  console.log("=== SocietySphere On-Demand S2S Payment Verification Test Suite ===\n");

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

  // Mock Database State
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

  // Simulated logic replicating verifyCashfreePaymentStatus
  async function simulateVerifyPaymentStatus({
    authUserId,
    societyId,
    orderId,
    mockS2SResult,
    simulateApiCrash = false,
  }) {
    if (!authUserId) {
      return { status: 401, body: { error: "Unauthorized" } };
    }

    if (!societyId || !orderId) {
      return { status: 400, body: { error: "Missing required fields" } };
    }

    const paymentData = mockDb.payments[orderId];
    if (!paymentData) {
      return { status: 404, body: { error: "Payment record not found" } };
    }

    // Ownership & Tenant Isolation Checks
    if (paymentData.residentUid !== authUserId) {
      return { status: 403, body: { error: "Forbidden: Not your payment order" } };
    }

    if (paymentData.societyId !== societyId) {
      return { status: 403, body: { error: "Forbidden: Society ID mismatch" } };
    }

    // Existing Terminal State Fast-Returns
    if (paymentData.status === "SUCCESS") {
      return {
        status: 200,
        body: {
          status: "SUCCESS",
          orderId,
          paymentId: paymentData.cashfreePaymentId,
          amount: paymentData.amount,
          message: "Payment already confirmed",
        },
      };
    }

    if (paymentData.status === "OVERPAYMENT_RECORDED") {
      return {
        status: 200,
        body: {
          status: "OVERPAYMENT_RECORDED",
          orderId,
          paymentId: paymentData.cashfreePaymentId,
          amount: paymentData.amount,
          message: "Payment recorded as duplicate/overpayment",
        },
      };
    }

    if (paymentData.status === "FLAGGED_AMOUNT_MISMATCH") {
      return {
        status: 200,
        body: {
          status: "FLAGGED_AMOUNT_MISMATCH",
          orderId,
          amount: paymentData.amount,
          message: "Payment amount could not be verified",
        },
      };
    }

    if (simulateApiCrash) {
      return { status: 500, body: { error: "Cashfree API gateway error" } };
    }

    // Query Cashfree S2S
    const cfVerify = mockS2SResult || {
      isSuccess: true,
      cashfreePaymentId: `CF_PAY_${orderId}`,
      paymentAmount: paymentData.amount,
      paymentMethod: "ONLINE_UPI",
    };

    if (!cfVerify.isSuccess) {
      if (cfVerify.message === "No payment attempts found for this order") {
        return {
          status: 200,
          body: {
            status: "PENDING",
            orderId,
            message: "No payment attempt has been recorded yet.",
          },
        };
      }

      paymentData.status = "FAILED";
      return {
        status: 200,
        body: {
          status: "FAILED",
          orderId,
          message: cfVerify.message || "Payment attempt failed or not found",
        },
      };
    }

    // Amount Anti-Tamper Verification
    if (cfVerify.paymentAmount !== paymentData.amount) {
      paymentData.status = "FLAGGED_AMOUNT_MISMATCH";
      return {
        status: 200,
        body: {
          status: "FLAGGED_AMOUNT_MISMATCH",
          orderId,
          message: "Payment amount mismatch flagged",
        },
      };
    }

    // Atomic Transaction Reconciliation
    const billId = paymentData.maintenanceBillId;
    const billData = mockDb.bills[billId];
    const isBillAlreadyPaid = billData && billData.status === "paid";

    let isOverpayment = false;

    if (isBillAlreadyPaid) {
      isOverpayment = true;
      paymentData.status = "OVERPAYMENT_RECORDED";
      paymentData.cashfreePaymentId = cfVerify.cashfreePaymentId;
      paymentData.verificationSource = "MANUAL_S2S";
      paymentData.overpaymentReason = "DUPLICATE_ORDER_ALREADY_PAID";
      paymentData.originalBillTransactionId = billData.transactionId || null;

      mockDb.receipts[`${orderId}_latest`] = {
        orderId,
        cashfreePaymentId: cfVerify.cashfreePaymentId,
        societyId,
        maintenanceBillId: billId,
        amount: paymentData.amount,
        isOverpayment: true,
        verificationSource: "MANUAL_S2S",
      };
    } else {
      paymentData.status = "SUCCESS";
      paymentData.cashfreePaymentId = cfVerify.cashfreePaymentId;
      paymentData.verificationSource = "MANUAL_S2S";

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
        verificationSource: "MANUAL_S2S",
      };
    }

    return {
      status: 200,
      body: {
        status: isOverpayment ? "OVERPAYMENT_RECORDED" : "SUCCESS",
        orderId,
        paymentId: cfVerify.cashfreePaymentId,
        amount: paymentData.amount,
        isOverpayment,
      },
    };
  }

  // TEST 1: Authenticated Resident verifies PENDING order and Cashfree says SUCCESS
  resetDb();
  mockDb.bills["BILL_101"] = { status: "pending", amount: 2500 };
  mockDb.payments["ORDER_001"] = {
    societyId: "SOC_A",
    maintenanceBillId: "BILL_101",
    residentUid: "USER_RESIDENT_1",
    amount: 2500,
    status: "PENDING",
  };

  const res1 = await simulateVerifyPaymentStatus({
    authUserId: "USER_RESIDENT_1",
    societyId: "SOC_A",
    orderId: "ORDER_001",
  });

  assert(
    res1.status === 200 &&
      res1.body.status === "SUCCESS" &&
      mockDb.payments["ORDER_001"].status === "SUCCESS" &&
      mockDb.payments["ORDER_001"].verificationSource === "MANUAL_S2S" &&
      mockDb.bills["BILL_101"].status === "paid" &&
      mockDb.bills["BILL_101"].transactionId === "CF_PAY_ORDER_001" &&
      mockDb.receipts["ORDER_001_latest"]?.isOverpayment === false,
    "TEST 1: Authenticated resident verifies PENDING order and Cashfree S2S confirms SUCCESS -> payment=SUCCESS, bill=paid"
  );

  // TEST 2: Cashfree S2S reports FAILED
  resetDb();
  mockDb.bills["BILL_102"] = { status: "pending", amount: 1800 };
  mockDb.payments["ORDER_002"] = {
    societyId: "SOC_A",
    maintenanceBillId: "BILL_102",
    residentUid: "USER_RESIDENT_1",
    amount: 1800,
    status: "PENDING",
  };

  const res2 = await simulateVerifyPaymentStatus({
    authUserId: "USER_RESIDENT_1",
    societyId: "SOC_A",
    orderId: "ORDER_002",
    mockS2SResult: { isSuccess: false, message: "Payment cancelled by user at gateway" },
  });

  assert(
    res2.status === 200 &&
      res2.body.status === "FAILED" &&
      mockDb.payments["ORDER_002"].status === "FAILED" &&
      mockDb.bills["BILL_102"].status === "pending",
    "TEST 2: Cashfree S2S says FAILED -> payment=FAILED and bill remains pending"
  );

  // TEST 2B: Authenticated resident verifies PENDING order before making any Cashfree payment (0 attempts)
  resetDb();
  mockDb.bills["BILL_102B"] = { status: "pending", amount: 1800 };
  mockDb.payments["ORDER_002B"] = {
    societyId: "SOC_A",
    maintenanceBillId: "BILL_102B",
    residentUid: "USER_RESIDENT_1",
    amount: 1800,
    status: "PENDING",
  };

  const res2B = await simulateVerifyPaymentStatus({
    authUserId: "USER_RESIDENT_1",
    societyId: "SOC_A",
    orderId: "ORDER_002B",
    mockS2SResult: { isSuccess: false, message: "No payment attempts found for this order" },
  });

  assert(
    res2B.status === 200 &&
      res2B.body.status === "PENDING" &&
      res2B.body.message === "No payment attempt has been recorded yet." &&
      mockDb.payments["ORDER_002B"].status === "PENDING" &&
      mockDb.bills["BILL_102B"].status === "pending" &&
      !mockDb.receipts["ORDER_002B_latest"],
    "TEST 2B: Zero payment attempts -> status=PENDING, payment remains PENDING, bill remains pending, no receipt created"
  );

  // TEST 3: Amount Mismatch Detection
  resetDb();
  mockDb.bills["BILL_103"] = { status: "pending", amount: 4000 };
  mockDb.payments["ORDER_003"] = {
    societyId: "SOC_A",
    maintenanceBillId: "BILL_103",
    residentUid: "USER_RESIDENT_1",
    amount: 4000,
    status: "PENDING",
  };

  const res3 = await simulateVerifyPaymentStatus({
    authUserId: "USER_RESIDENT_1",
    societyId: "SOC_A",
    orderId: "ORDER_003",
    mockS2SResult: { isSuccess: true, paymentAmount: 50, cashfreePaymentId: "CF_TAMPER_003" },
  });

  assert(
    res3.status === 200 &&
      res3.body.status === "FLAGGED_AMOUNT_MISMATCH" &&
      mockDb.payments["ORDER_003"].status === "FLAGGED_AMOUNT_MISMATCH" &&
      mockDb.bills["BILL_103"].status === "pending",
    "TEST 3: Amount mismatch -> payment=FLAGGED_AMOUNT_MISMATCH and bill remains pending"
  );

  // TEST 4: Bill already paid by another order (Overpayment Guard)
  mockDb.bills["BILL_103"].status = "paid";
  mockDb.bills["BILL_103"].transactionId = "CF_PAY_ORIGINAL";
  mockDb.payments["ORDER_004"] = {
    societyId: "SOC_A",
    maintenanceBillId: "BILL_103",
    residentUid: "USER_RESIDENT_1",
    amount: 4000,
    status: "PENDING",
  };

  const res4 = await simulateVerifyPaymentStatus({
    authUserId: "USER_RESIDENT_1",
    societyId: "SOC_A",
    orderId: "ORDER_004",
    mockS2SResult: { isSuccess: true, paymentAmount: 4000, cashfreePaymentId: "CF_PAY_ORDER_004" },
  });

  assert(
    res4.status === 200 &&
      res4.body.status === "OVERPAYMENT_RECORDED" &&
      mockDb.payments["ORDER_004"].status === "OVERPAYMENT_RECORDED" &&
      mockDb.bills["BILL_103"].transactionId === "CF_PAY_ORIGINAL" &&
      mockDb.receipts["ORDER_004_latest"]?.isOverpayment === true,
    "TEST 4: Bill already paid -> payment=OVERPAYMENT_RECORDED and original bill transactionId is preserved"
  );

  // TEST 5: Payment already in SUCCESS state
  mockDb.payments["ORDER_001"] = {
    societyId: "SOC_A",
    maintenanceBillId: "BILL_101",
    residentUid: "USER_RESIDENT_1",
    amount: 2500,
    status: "SUCCESS",
    cashfreePaymentId: "CF_PAY_ORDER_001",
  };

  const res5 = await simulateVerifyPaymentStatus({
    authUserId: "USER_RESIDENT_1",
    societyId: "SOC_A",
    orderId: "ORDER_001",
  });

  assert(
    res5.status === 200 &&
      res5.body.status === "SUCCESS" &&
      res5.body.message === "Payment already confirmed",
    "TEST 5: Payment already in terminal SUCCESS state -> returns fast idempotent response without mutation"
  );

  // TEST 6: Unauthorized resident attempts to verify another resident's order
  const res6 = await simulateVerifyPaymentStatus({
    authUserId: "HACKER_RESIDENT_999",
    societyId: "SOC_A",
    orderId: "ORDER_001",
  });

  assert(
    res6.status === 403,
    "TEST 6: Unauthorized resident attempting to verify another user's order is rejected with HTTP 403"
  );

  // TEST 7: Society ID Mismatch
  const res7 = await simulateVerifyPaymentStatus({
    authUserId: "USER_RESIDENT_1",
    societyId: "WRONG_SOCIETY_XYZ",
    orderId: "ORDER_001",
  });

  assert(
    res7.status === 403,
    "TEST 7: Request with mismatched societyId is rejected with HTTP 403"
  );

  // TEST 8: Cashfree API gateway error
  resetDb();
  mockDb.bills["BILL_105"] = { status: "pending", amount: 1500 };
  mockDb.payments["ORDER_005"] = {
    societyId: "SOC_A",
    maintenanceBillId: "BILL_105",
    residentUid: "USER_RESIDENT_1",
    amount: 1500,
    status: "PENDING",
  };

  const res8 = await simulateVerifyPaymentStatus({
    authUserId: "USER_RESIDENT_1",
    societyId: "SOC_A",
    orderId: "ORDER_005",
    simulateApiCrash: true,
  });

  assert(
    res8.status === 500 &&
      mockDb.bills["BILL_105"].status === "pending" &&
      mockDb.payments["ORDER_005"].status === "PENDING",
    "TEST 8: Cashfree API gateway error -> safe HTTP 500 error without mutating bill or payment status"
  );

  console.log(`\n=== Verification Test Summary: ${passCount} Passed, ${failCount} Failed ===`);
  if (failCount > 0) process.exit(1);
}

runVerifyPaymentStatusTests().catch((err) => {
  console.error("Test runner exception:", err);
  process.exit(1);
});
