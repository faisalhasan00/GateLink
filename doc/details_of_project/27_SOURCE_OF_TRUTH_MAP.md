# 27. Authoritative Source of Truth Map

| Entity Domain | Primary Authoritative Source | Read Location | Sync / Trigger Mechanisms |
| :--- | :--- | :--- | :--- |
| **User Identity & Credentials** | Firebase Authentication | Firebase Auth SDK | `onAuthStateChanged` stream |
| **User Membership & Role Index** | Firestore `/users/{uid}` | Firestore Direct Read | `AuthService.registerWithEmail` / `signInWithEmail` |
| **Society Metadata & Code** | Firestore `/societies/{societyId}` | Firestore Document | `EnterpriseHeader.jsx` & `auth_service.dart` |
| **Resident Account Status** | Firestore `societies/{id}/users/{uid}` | Firestore Document | `userStatusProvider` in Riverpod |
| **Gate Visitor Log & Status** | Firestore `societies/{id}/visitors/{id}` | Firestore Real-Time Query | Cloud Function `notifyResidentOnVisitorArrival` |
| **System Financial Audit Trail** | Firestore `societies/{id}/audit_logs` | Firestore Query (Read-only) | Immutable Cloud Function triggers |
