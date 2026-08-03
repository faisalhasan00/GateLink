# 09. External Integrations & Notification Architecture

## 1. Third-Party Integrations
- **Firebase Authentication**: Email/Password and Google OAuth.
- **Firebase Cloud Firestore**: Multi-tenant NoSQL document storage.
- **Firebase Cloud Messaging (FCM)**: Push notification service for Android/iOS mobile devices.
- **Firebase Cloud Functions (v2 Node.js)**: Serverless event handlers.
- **Lucide Icons**: Unified iconography across Web and Mobile UI components.
- **Google Fonts**: `Plus Jakarta Sans` / `Inter` typography.

---

## 2. Notification Dispatch Channels

| Channel | Trigger Event | Payload / Target |
| :--- | :--- | :--- |
| **FCM Push Notification** | Visitor arrival at gate | Title: "🔔 Visitor at Gate", Body: "{visitorName} for Flat {hostFlat}" |
| **In-App Notification** | Visitor, Booking, Complaint, Payment | Document in `societies/{id}/users/{uid}/notifications` |
| **Audit Log Entry** | Visitor status change, Bill paid | Document in `societies/{id}/audit_logs` |
