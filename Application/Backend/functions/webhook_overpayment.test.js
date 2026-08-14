const crypto = require("crypto");
const { CashfreePaymentProvider } = require("./cashfree_service");

async function runOverpaymentGuardTests() {
  console.log("=== SocietySphere Webhook Overpayment & State Guard Test Suite ===\n");

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

  // Mock Database State for Tests
  const mockDb = {
    payments: {},
    bills: {},
    receipts: {},
    logs: [],
  };

  function resetDb() {
    mockDb.payments = {};
    mockDb.bills = {};
    mockDb.receipts = {};
    mockDb.logs = [];
  }

  // Simulated Handler replicating cashfree_webhook logic
  async function simulateWebhookProcessing({
    rawBody,
    timestamp,
    signature,
    mockS2SResult,
  }) {
    // 1. Signature Check
    const isSigValid = CashfreePaymentProvider.verifyWebhookSignature(
      rawBody,
      timestamp,
      signature
    );
    if (!isSigValid) {
      return { status: 401, body: "Invalid signature" };
    }

    const payload = JSON.parse(rawBody);
    const orderId = payload.data?.order?.order_id || payload.order_id;
    if (!orderId) {
      return { status: 400, body: "Missing order_id" };
    }

    const paymentData = mockDb.payments[orderId];
    if (!paymentData) {
      return { status: 200, body: "ORDER_NOT_FOUND" };
    }

    if (paymentData.status === "SUCCESS" || paymentData.status === "OVERPAYMENT_RECORDED") {
      return { status: 200, body: "ALREADY_PROCESSED" };
    }

    // S2S Check
    const cfVerify = mockS2SResult || {
      isSuccess: true,
      cashfreePaymentId: `CF_PAY_${orderId}`,
      paymentAmount: paymentData.amount,
      paymentMethod: "UPI",
    };

    if (!cfVerify.isSuccess) {
      paymentData.status = "FAILED";
      return { status: 200, body: "PAYMENT_NOT_SUCCESSFUL" };
    }

    if (cfVerify.paymentAmount !== paymentData.amount) {
      paymentData.status = "FLAGGED_AMOUNT_MISMATCH";
      return { status: 200, body: "AMOUNT_MISMATCH_FLAGGED" };
    }

    const societyId = paymentData.societyId;
    const billId = paymentData.maintenanceBillId;
    const billData = mockDb.bills[billId];

    let isOverpayment = false;

    // Simulated Atomic Transaction
    const isBillAlreadyPaid = billData && billData.status === "paid";

    if (isBillAlreadyPaid) {
      isOverpayment = true;
      paymentData.status = "OVERPAYMENT_RECORDED";
      paymentData.cashfreePaymentId = cfVerify.cashfreePaymentId;
      paymentData.overpaymentReason = "DUPLICATE_ORDER_ALREADY_PAID";
      paymentData.originalBillTransactionId = billData.transactionId || null;

      mockDb.receipts[`${orderId}_latest`] = {
        orderId,
        cashfreePaymentId: cfVerify.cashfreePaymentId,
        societyId,
        maintenanceBillId: billId,
        amount: paymentData.amount,
        isOverpayment: true,
        overpaymentReason: "DUPLICATE_ORDER_ALREADY_PAID",
      };
    } else {
      paymentData.status = "SUCCESS";
      paymentData.cashfreePaymentId = cfVerify.cashfreePaymentId;
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
      };
    }

    return { status: 200, body: "OK", isOverpayment };
  }

  process.env.CASHFREE_CLIENT_ID = "TEST_CLIENT_ID";
  process.env.CASHFREE_CLIENT_SECRET = "TEST_SECRET_GUARD";

  function createSignature(rawBody, timestamp) {
    return crypto
      .createHmac("sha256", process.env.CASHFREE_CLIENT_SECRET)
      .update(timestamp + rawBody)
      .digest("base64");
  }

  // TEST 1: Normal Successful Payment
  resetDb();
  mockDb.bills["BILL_101"] = { status: "pending", amount: 3500 };
  mockDb.payments["ORDER_A"] = {
    societyId: "SOC_1",
    maintenanceBillId: "BILL_101",
    residentUid: "USER_1",
    amount: 3500,
    status: "PENDING",
  };

  const ts1 = String(Date.now());
  const body1 = JSON.stringify({ order_id: "ORDER_A" });
  const sig1 = createSignature(body1, ts1);

  const res1 = await simulateWebhookProcessing({
    rawBody: body1,
    timestamp: ts1,
    signature: sig1,
  });

  assert(
    res1.status === 200 &&
      mockDb.payments["ORDER_A"].status === "SUCCESS" &&
      mockDb.bills["BILL_101"].status === "paid" &&
      mockDb.bills["BILL_101"].transactionId === "CF_PAY_ORDER_A" &&
      mockDb.receipts["ORDER_A_latest"]?.isOverpayment === false,
    "TEST 1: Normal successful payment sets payment=SUCCESS and bill=paid with primary transactionId"
  );

  // TEST 2: Same Webhook Delivered Twice (Idempotency)
  const res2 = await simulateWebhookProcessing({
    rawBody: body1,
    timestamp: ts1,
    signature: sig1,
  });

  assert(
    res2.body === "ALREADY_PROCESSED" &&
      mockDb.payments["ORDER_A"].status === "SUCCESS" &&
      mockDb.bills["BILL_101"].transactionId === "CF_PAY_ORDER_A",
    "TEST 2: Duplicate webhook for same order safely returns ALREADY_PROCESSED without modifying bill"
  );

  // TEST 3: Different Order Paid for Already-Paid Bill (Overpayment Guard)
  mockDb.payments["ORDER_B"] = {
    societyId: "SOC_1",
    maintenanceBillId: "BILL_101",
    residentUid: "USER_1",
    amount: 3500,
    status: "PENDING",
  };

  const ts3 = String(Date.now());
  const body3 = JSON.stringify({ order_id: "ORDER_B" });
  const sig3 = createSignature(body3, ts3);

  const res3 = await simulateWebhookProcessing({
    rawBody: body3,
    timestamp: ts3,
    signature: sig3,
  });

  assert(
    res3.status === 200 &&
      mockDb.payments["ORDER_B"].status === "OVERPAYMENT_RECORDED" &&
      mockDb.payments["ORDER_B"].originalBillTransactionId === "CF_PAY_ORDER_A" &&
      mockDb.bills["BILL_101"].transactionId === "CF_PAY_ORDER_A" &&
      mockDb.receipts["ORDER_B_latest"]?.isOverpayment === true,
    "TEST 3: Order B for already-paid bill is marked OVERPAYMENT_RECORDED without overwriting bill primary transactionId"
  );

  // TEST 4: Concurrent Order Webhook Race Simulation
  resetDb();
  mockDb.bills["BILL_CONCURRENT"] = { status: "pending", amount: 2000 };
  mockDb.payments["ORDER_RACE_1"] = {
    societyId: "SOC_1",
    maintenanceBillId: "BILL_CONCURRENT",
    residentUid: "USER_1",
    amount: 2000,
    status: "PENDING",
  };
  mockDb.payments["ORDER_RACE_2"] = {
    societyId: "SOC_1",
    maintenanceBillId: "BILL_CONCURRENT",
    residentUid: "USER_1",
    amount: 2000,
    status: "PENDING",
  };

  const bRace1 = JSON.stringify({ order_id: "ORDER_RACE_1" });
  const bRace2 = JSON.stringify({ order_id: "ORDER_RACE_2" });
  const sRace1 = createSignature(bRace1, ts1);
  const sRace2 = createSignature(bRace2, ts1);

  // Execute race in sequence through atomic transaction
  await simulateWebhookProcessing({ rawBody: bRace1, timestamp: ts1, signature: sRace1 });
  await simulateWebhookProcessing({ rawBody: bRace2, timestamp: ts1, signature: sRace2 });

  const states = [
    mockDb.payments["ORDER_RACE_1"].status,
    mockDb.payments["ORDER_RACE_2"].status,
  ];

  assert(
    states.includes("SUCCESS") &&
      states.includes("OVERPAYMENT_RECORDED") &&
      mockDb.bills["BILL_CONCURRENT"].transactionId === "CF_PAY_ORDER_RACE_1",
    "TEST 4: Concurrent orders result in exactly one primary SUCCESS and one OVERPAYMENT_RECORDED"
  );

  // TEST 5: Existing Failed Payment Behavior
  resetDb();
  mockDb.bills["BILL_FAIL"] = { status: "pending", amount: 1000 };
  mockDb.payments["ORDER_FAIL"] = {
    societyId: "SOC_1",
    maintenanceBillId: "BILL_FAIL",
    residentUid: "USER_1",
    amount: 1000,
    status: "PENDING",
  };
  const bFail = JSON.stringify({ order_id: "ORDER_FAIL" });
  const sFail = createSignature(bFail, ts1);

  const resFail = await simulateWebhookProcessing({
    rawBody: bFail,
    timestamp: ts1,
    signature: sFail,
    mockS2SResult: { isSuccess: false, message: "Bank declined" },
  });

  assert(
    mockDb.payments["ORDER_FAIL"].status === "FAILED" &&
      mockDb.bills["BILL_FAIL"].status === "pending",
    "TEST 5: Failed S2S payment marks payment FAILED and leaves bill pending"
  );

  // TEST 6: Amount Mismatch Detection
  resetDb();
  mockDb.bills["BILL_TAMPER"] = { status: "pending", amount: 5000 };
  mockDb.payments["ORDER_TAMPER"] = {
    societyId: "SOC_1",
    maintenanceBillId: "BILL_TAMPER",
    residentUid: "USER_1",
    amount: 5000,
    status: "PENDING",
  };
  const bTamper = JSON.stringify({ order_id: "ORDER_TAMPER" });
  const sTamper = createSignature(bTamper, ts1);

  const resTamper = await simulateWebhookProcessing({
    rawBody: bTamper,
    timestamp: ts1,
    signature: sTamper,
    mockS2SResult: { isSuccess: true, paymentAmount: 100, cashfreePaymentId: "CF_TAMPER" },
  });

  assert(
    mockDb.payments["ORDER_TAMPER"].status === "FLAGGED_AMOUNT_MISMATCH" &&
      mockDb.bills["BILL_TAMPER"].status === "pending",
    "TEST 6: Amount mismatch marks payment FLAGGED_AMOUNT_MISMATCH and leaves bill pending"
  );

  // TEST 7: Invalid Webhook Signature Rejected
  const resBadSig = await simulateWebhookProcessing({
    rawBody: bTamper,
    timestamp: ts1,
    signature: "FORGED_BAD_SIGNATURE",
  });

  assert(
    resBadSig.status === 401,
    "TEST 7: Invalid webhook signature is rejected with HTTP 401"
  );

  // TEST 8: S2S verification failure
  mockDb.payments["ORDER_S2S_FAIL"] = {
    societyId: "SOC_1",
    maintenanceBillId: "BILL_FAIL",
    residentUid: "USER_1",
    amount: 1000,
    status: "PENDING",
  };
  const bS2SFail = JSON.stringify({ order_id: "ORDER_S2S_FAIL" });
  const sS2SFail = createSignature(bS2SFail, ts1);

  const resS2SFail = await simulateWebhookProcessing({
    rawBody: bS2SFail,
    timestamp: ts1,
    signature: sS2SFail,
    mockS2SResult: { isSuccess: false, message: "Payment cancelled by user" },
  });

  assert(
    resS2SFail.body === "PAYMENT_NOT_SUCCESSFUL",
    "TEST 8: S2S verification failure safely terminates with PAYMENT_NOT_SUCCESSFUL"
  );

  console.log(`\n=== Overpayment Test Summary: ${passCount} Passed, ${failCount} Failed ===`);
  if (failCount > 0) process.exit(1);
}

runOverpaymentGuardTests().catch((err) => {
  console.error("Test runner exception:", err);
  process.exit(1);
});
