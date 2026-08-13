const crypto = require("crypto");

/**
 * Cashfree Payment Gateway Platform Integration Service
 * Uses Cashfree PG v3 REST API (2023-08-01)
 */
class CashfreePaymentProvider {
  constructor() {
    this.env = process.env.CASHFREE_ENV || "sandbox";
    this.clientId = process.env.CASHFREE_CLIENT_ID || "TEST_1048602692c8bdcf8998ef47d25e60268401";
    this.clientSecret = process.env.CASHFREE_CLIENT_SECRET || "cfsk_ma_test_c4013ba0c3791054ee4ddbdbeeb61e38_eb3d2dd9";
    this.apiVersion = "2023-08-01";
    this.baseUrl =
      this.env === "production"
        ? "https://api.cashfree.com/pg"
        : "https://sandbox.cashfree.com/pg";
  }

  getHeaders() {
    return {
      "Content-Type": "application/json",
      "x-api-version": this.apiVersion,
      "x-client-id": this.clientId,
      "x-client-secret": this.clientSecret,
    };
  }

  /**
   * 1. Create Cashfree Order
   */
  async createPaymentOrder({ orderId, amount, customerId, customerName, customerPhone, customerEmail }) {
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
      return { isSuccess: false, reason: "No payment attempts found for order" };
    }

    const successPayment = data.find((p) => p.payment_status === "SUCCESS");
    if (!successPayment) {
      return { isSuccess: false, reason: "No successful payment attempt found" };
    }

    return {
      isSuccess: true,
      cashfreePaymentId: String(successPayment.cf_payment_id || successPayment.payment_id || ""),
      paymentAmount: Number(successPayment.payment_amount),
      paymentCurrency: successPayment.payment_currency || "INR",
      paymentStatus: successPayment.payment_status,
      paymentMethod: successPayment.payment_group || "ONLINE",
    };
  }

  /**
   * 3. Verify Webhook Signature (HMAC SHA256)
   */
  verifyWebhookSignature(rawBody, timestamp, signature) {
    if (!timestamp || !signature) return false;
    try {
      const dataToSign = timestamp + rawBody;
      const computedSig = crypto
        .createHmac("sha256", this.clientSecret)
        .update(dataToSign)
        .digest("base64");
      return computedSig === signature;
    } catch (e) {
      console.error("Signature compute error:", e);
      return false;
    }
  }

  /**
   * 4. Refund Service Stubs (Prepared for future refund implementation)
   */
  async createRefund({ orderId, refundId, amount, remark }) {
    return { refundId, status: "PENDING_STUB", message: "Refund abstraction stub initialized." };
  }

  async getRefundStatus(orderId, refundId) {
    return { refundId, status: "STUB", message: "Refund status stub initialized." };
  }
}

/**
 * Settlement Service Abstract Stub
 * Keeps society-wise settlement logic decoupled per requirement #6
 */
class SettlementService {
  async processSocietySettlement(societyId, paymentRecord) {
    return { status: "STUB_PENDING_CONFIRMATION", societyId };
  }
}

module.exports = {
  CashfreePaymentProvider: new CashfreePaymentProvider(),
  SettlementService: new SettlementService(),
};
