# 41. Current Limitations & Operational Boundaries

1. **Android Physical Device Requirement**: Building release APKs requires a configured Android SDK and Java JDK 17 environment.
2. **Third-Party Payment Webhooks**: Payment gateways currently process simulated transaction IDs. Production integration requires configuring serverless webhook handlers for Razorpay / Stripe.
3. **APNs Certificate Setup**: iOS FCM push notifications require uploading APNs certificates to the Firebase Console.
