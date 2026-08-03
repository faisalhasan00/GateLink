# 08. Authentication and Permissions Architecture

## 1. Authentication Strategy

- **Firebase Authentication**: Primary identity provider handling Email/Password login and Google OAuth across mobile and web applications.
- **Root Membership Index (`/users/{uid}`)**: Stores user `societyId`, `role`, and `status` globally for $O(1)$ fast profile resolution.
- **Route Guards**:
  - `society_admin/src/App.jsx`: `ProtectedRoute` enforces non-null Firebase Auth state.
  - `super_admin/src/App.jsx`: `ProtectedSuperRoute` enforces verified email (`mohammedfaisalhasan@gmail.com`).
  - `mobile/lib/core/router/app_router.dart`: Enforces status checks and holds `pending_approval` users on `PendingApprovalScreen`.

---

## 2. Firestore Security Rules Summary

- **Multi-Tenant Read Restriction**: `/societies/{societyId}` read requires `belongsToSociety(societyId) || isSuperAdmin()`.
- **Visitor Ownership**: Visitors readable/editable by Society Admins, Guards, or residents whose `flatNumber` matches `hostFlat`.
- **Complaint Ownership**: Complaints readable/editable by Society Admins or author (`raisedBy == request.auth.uid`).
- **Immutable Audit Trail**: `audit_logs` write allowed, but update/delete is strictly prohibited (`allow update, delete: if false;`).
- **Public Lead Form Shield**: `/leads` creation requires mandatory fields (`name`, `email`, `phone`) and rejects unexpected internal admin fields.
