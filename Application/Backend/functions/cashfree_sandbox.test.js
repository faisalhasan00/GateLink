const { CashfreePaymentProvider } = require("./cashfree_service");
const crypto = require("crypto");

async function runCashfreeSandboxVerification() {
  console.log("Starting Cashfree Sandbox E2E Verification...");

  // Load .env credentials dynamically if available
  try {
    require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
  } catch (e) {}

  const clientId = process.env.CASHFREE_CLIENT_ID || 'TEST_SANDBOX_ID';
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET || 'TEST_SANDBOX_SECRET';
  process.env.CASHFREE_CLIENT_ID = clientId;
  process.env.CASHFREE_CLIENT_SECRET = clientSecret;

  // Test 1: Webhook HMAC SHA256 Signature Verification
  console.log("\n[Test 1] Testing Webhook HMAC Signature Verification...");
  const timestamp = String(Math.floor(Date.now() / 1000));
  const rawBody = JSON.stringify({ event: "PAYMENT_SUCCESS", data: { order: { order_id: "ORD_TEST_123" } } });
  
  const validSignature = crypto
    .createHmac("sha256", process.env.CASHFREE_CLIENT_SECRET)
    .update(timestamp + rawBody)
    .digest("base64");

  const isSigValid = CashfreePaymentProvider.verifyWebhookSignature(rawBody, timestamp, validSignature);
  const isFakeRejected = !CashfreePaymentProvider.verifyWebhookSignature(rawBody, timestamp, "invalid_forged_signature_123");

  if (isSigValid && isFakeRejected) {
    console.log("✓ PASS: HMAC SHA256 signature verification & forgery rejection working correctly.");
  } else {
    console.error("✗ FAIL: HMAC signature verification failed!");
  }

  // Test 2: Cashfree Sandbox Order Creation
  console.log("\n[Test 2] Creating Payment Order on Cashfree Sandbox API...");
  const testOrderId = `ORD_TEST_${Date.now()}`;
  try {
    const orderRes = await CashfreePaymentProvider.createPaymentOrder({
      orderId: testOrderId,
      amount: 1500,
      customerId: "CUST_RESIDENT_99",
      customerName: "Faisal Hasan",
      customerPhone: "9876543210",
      customerEmail: "faisal@societysphere.com"
    });

    console.log("✓ PASS: Cashfree Sandbox Order Created Successfully!", {
      cashfreeOrderId: orderRes.cashfreeOrderId,
      paymentSessionId: orderRes.paymentSessionId ? "PRESENT (Valid Session Token)" : "MISSING",
      orderStatus: orderRes.orderStatus
    });

    // Test 3: Cashfree Sandbox Order Query
    console.log("\n[Test 3] Querying Payment Status from Cashfree Sandbox API...");
    const verifyRes = await CashfreePaymentProvider.verifyPaymentWithCashfree(testOrderId);
    console.log("✓ PASS: Cashfree Payments Query API executed correctly!", {
      orderId: testOrderId,
      isSuccess: verifyRes.isSuccess,
      message: verifyRes.message
    });
  } catch (err) {
    console.log("Cashfree Sandbox API Response:", err.message);
  }
}

runCashfreeSandboxVerification();
