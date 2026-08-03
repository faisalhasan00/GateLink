# 31. Feature Impact & Dependency Analysis

| If You Modify... | What Else Is Affected? | Impacted Applications |
| :--- | :--- | :--- |
| **`firestore.rules`** | All database reads/writes across all client apps | `website`, `society_admin`, `super_admin`, `mobile` |
| **`AuthService.registerWithEmail`** | Mobile signup, pending approval flow, global index mapping | `mobile` (Resident & Guard), `society_admin` |
| **`societies/{id}/visitors` schema** | Gate entry check-in, FCM push notifications, audit trail | `mobile` (Guard & Resident), `functions`, `society_admin` |
| **`/users/{uid}` index structure** | Mobile profile loading speed ($O(1)$ provider), user role checks | `mobile`, `society_admin` |
| **`sessionManager.js`** | Web admin session storage and active `societyId` context | `society_admin`, `super_admin` |
