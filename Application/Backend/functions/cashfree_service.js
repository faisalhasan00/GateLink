const crypto = require("crypto");

/**
 * Cashfree Payment Gateway Platform Integration Service
 * Uses Cashfree PG v3 REST API (2023-08-01)
 * SEC-P0: Hardcoded fallback credentials REMOVED. Environment / Secret Manager configuration strictly enforced.
 */
class CashfreePaymentProvider {
  constructor() {
    this.env = process.env.CASHFREE_ENV || "sandbox";
    this.clientId = process.env.CASHFREE_CLIENT_ID || "";
    this.clientSecret = process.env.CASHFREE_CLIENT_SECRET || "";
    this.apiVersion = "2023-08-01";
    this.baseUrl =
      this.env === "production"
        ? "https://api.cashfree.com/pg"
        : "https://sandbox.cashfree.com/pg";
  }

  _verifyCredentials() {
    const clientId = process.env.CASHFREE_CLIENT_ID || this.clientId;
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET || this.clientSecret;

    if (!clientId || !clientSecret) {
      throw new Error(
        "Cashfree Configuration Error: CASHFREE_CLIENT_ID or CASHFREE_CLIENT_SECRET environment variable is missing. Hardcoded credentials are strictly prohibited."
      );
    }
    return { clientId, clientSecret };
  }

  getHeaders() {
    const { clientId, clientSecret } = this._verifyCredentials();
    return {
      "Content-Type": "application/json",
      "x-api-version": this.apiVersion,
      "x-client-id": clientId,
      "x-client-secret": clientSecret,
    };
  }

  /**
   * 1. Create Cashfree Order
   */
  async createPaymentOrder({ orderId, amount, customerId, customerName, customerPhone, customerEmail }) {
    this._verifyCredentials();

    const payload = {
      order_id: orderId,
      order_amount: Number(amount),
      order_currency: "INR",
      customer_details: {
        customer_id: customerId || "CUST_RESIDENT",
        customer_name: customerName || "Resident Owner",
        customer_phone: customerPhone || "9876543210",
        customer_email: customerEmail || "resident@societysphere.com",
      },
      order_meta: {
        return_url: `https://societysphere.com/payment-status?order_id=${orderId}`,
      },
    };

    const res = await fetch(`${this.baseUrl}/orders`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Cashfree Order Error: ${data.message || JSON.stringify(data)}`);
    }

    return {
      cashfreeOrderId: data.order_id,
      paymentSessionId: data.payment_session_id,
      orderStatus: data.order_status,
    };
  }

  /**
   * 2. Query Cashfree Official API to verify actual successful payment for order
   */
  async verifyPaymentWithCashfree(orderId) {
    this._verifyCredentials();

    const res = await fetch(`${this.baseUrl}/orders/${orderId}/payments`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Cashfree Payments Query Error: ${data.message || JSON.stringify(data)}`);
    }

    // Cashfree returns an array of payment attempts for the order
    if (!Array.isArray(data) || data.length === 0) {
      return { isSuccess: false, message: "No payment attempts found for this order" };
    }

    const successPayment = data.find((p) => p.payment_status === "SUCCESS");
    if (!successPayment) {
      return { isSuccess: false, message: "No successful payment attempt found" };
    }

    return {
      isSuccess: true,
      cashfreePaymentId: String(successPayment.cf_payment_id || successPayment.payment_id || ""),
      paymentAmount: Number(successPayment.order_amount || successPayment.payment_amount || 0),
      paymentMethod: String(successPayment.payment_group || "ONLINE"),
      paymentTime: String(successPayment.payment_completion_time || new Date().toISOString()),
      raw: successPayment,
    };
  }

  /**
   * 3. Verify HMAC SHA256 Webhook Signature
   */
  verifyWebhookSignature(rawBody, timestamp, signature) {
    const { clientSecret } = this._verifyCredentials();
    if (!signature || !timestamp || !rawBody) return false;

    try {
      const dataToSign = timestamp + rawBody;
      const expectedSignature = crypto
        .createHmac("sha256", clientSecret)
        .update(dataToSign)
        .digest("base64");

      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    } catch (err) {
      console.error("Webhook signature verification error:", err);
      return false;
    }
  }
}

module.exports = {
  CashfreePaymentProvider: new CashfreePaymentProvider(),
};
