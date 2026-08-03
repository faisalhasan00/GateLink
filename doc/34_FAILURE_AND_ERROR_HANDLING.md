# 34. Failure & Error Handling Architecture

## 1. Network & Auth Failure Strategies
- **Firebase Auth Failure**: Caught in `signInWithEmailAndPassword` try-catch block. Falls back to checking pre-provisioned RWA Admin user docs before displaying formatted error alerts.
- **Unverified Mobile Account**: Captured by `userStatusProvider` and `app_router.dart`. Redirects user to `PendingApprovalScreen` until approved.
- **Firestore Permission Failure**: Caught by React error boundaries and Flutter Riverpod `AsyncError` state. Displays safe fallback messages without exposing internal stack traces.
- **FCM Token Delivery Failure**: Wrapped in `messaging.send().catch((err) => console.error("FCM Error:", err))` in Cloud Functions to prevent function execution crashes if a device token is expired or invalid.
