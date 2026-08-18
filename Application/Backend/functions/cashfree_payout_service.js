/**
 * Cashfree Payouts Integration Service
 * SEC-P0: Uses Cashfree Payouts API v1/v1.2 for instant UPI & Bank account payouts
 */
class CashfreePayoutProvider {
  constructor() {
    this.env = process.env.CASHFREE_ENV || "sandbox";
    this.clientId = process.env.CASHFREE_PAYOUT_CLIENT_ID || process.env.CASHFREE_CLIENT_ID || "";
    this.clientSecret = process.env.CASHFREE_PAYOUT_CLIENT_SECRET || process.env.CASHFREE_CLIENT_SECRET || "";
    this.baseUrl =
      this.env === "production"
        ? "https://payout-api.cashfree.com/payout/v1"
        : "https://sandbox.cashfree.com/payout/v1";
    this._token = null;
    this._tokenExpiry = 0;
  }

  _verifyCredentials() {
    const clientId = process.env.CASHFREE_PAYOUT_CLIENT_ID || process.env.CASHFREE_CLIENT_ID || this.clientId;
    const clientSecret = process.env.CASHFREE_PAYOUT_CLIENT_SECRET || process.env.CASHFREE_CLIENT_SECRET || this.clientSecret;

    if (!clientId || !clientSecret) {
      throw new Error(
        "Cashfree Payout Configuration Error: CASHFREE_PAYOUT_CLIENT_ID or CASHFREE_CLIENT_ID is missing."
      );
    }
    return { clientId, clientSecret };
  }

  /**
   * 1. Obtain Bearer Token from Cashfree Payouts Authorization Endpoint
   */
  async getAuthToken() {
    const now = Date.now();
    if (this._token && this._tokenExpiry > now) {
      return this._token;
    }

    const { clientId, clientSecret } = this._verifyCredentials();

    const res = await fetch(`${this.baseUrl}/authorize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": clientId,
        "X-Client-Secret": clientSecret,
      },
    });

    const data = await res.json();
    if (!res.ok || data.status !== "SUCCESS" || !data.data?.token) {
      throw new Error(`Cashfree Payout Auth Error: ${data.message || JSON.stringify(data)}`);
    }

    this._token = data.data.token;
    // Token is valid for 5 minutes (300 seconds)
    this._tokenExpiry = now + 4 * 60 * 1000;
    return this._token;
  }

  /**
   * 2. Request Instant Direct UPI / Bank Payout
   */
  async requestInstantPayout({ transferId, amount, upiId, phone, name, email, remarks }) {
    const token = await this.getAuthToken();

    const payload = {
      transferId: transferId || `PAYOUT_${Date.now()}`,
      amount: Number(amount),
      transferMode: "upi",
      vpa: upiId,
      name: name || "GateLink Partner",
      phone: phone || "9876543210",
      email: email || "partner@gatelink.in",
      remarks: remarks || "GateLink Partner Commission Payout",
    };

    const res = await fetch(`${this.baseUrl}/requestTransfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    // Handle mock/sandbox response for dev testing if credentials are sandbox
    if (!res.ok) {
      // If Cashfree sandbox credentials return demo response or simulated error
      if (this.env === "sandbox") {
        const mockUtr = `CF-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
        return {
          isSuccess: true,
          isSimulated: true,
          transferId: payload.transferId,
          utrNumber: mockUtr,
          amount: payload.amount,
          status: "SUCCESS",
          message: "Instant UPI Payout Processed (Sandbox Simulated)",
        };
      }
      throw new Error(`Cashfree Transfer Error: ${data.message || JSON.stringify(data)}`);
    }

    const transferData = data.data || {};
    const utr = transferData.utr || transferData.referenceId || `CF-${Date.now()}`;

    return {
      isSuccess: true,
      isSimulated: false,
      transferId: payload.transferId,
      utrNumber: String(utr),
      amount: payload.amount,
      status: data.status || "SUCCESS",
      message: data.message || "Payout Transferred Successfully",
      raw: data,
    };
  }
}

module.exports = {
  CashfreePayoutProvider: new CashfreePayoutProvider(),
};
