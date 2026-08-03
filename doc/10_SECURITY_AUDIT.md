# 10. Security Audit & Hardening Matrix

## 1. Security Enhancements Completed

- **SEC-001 (Society Read Isolation)**: Fixed in `firestore.rules`. Blocked unauthenticated and cross-tenant queries on `/societies/{societyId}`.
- **SEC-002 (Visitor & Complaint Ownership)**: Fixed in `firestore.rules`. Restricted visitor/complaint access to host flat owners, authors, or assigned guards.
- **SEC-003 (Admin Auth Guarding)**: Fixed in `society_admin` & `super_admin`. Replaced `localStorage` fallback checks with live Firebase Auth state verification.
- **SEC-004 (Public Lead Validation)**: Fixed in `firestore.rules`. Added field type, required key, and size validation for website lead form creation.
- **BUG-001 (Collection Naming)**: Fixed in `firestore.rules`. Standardized rules for `maintenance_bills`, `amenity_bookings`, `notifications`, and anti-tamper `audit_logs`.
- **BUG-002 ($O(N)$ Scanning Removal)**: Fixed in `auth_providers.dart` & `auth_service.dart`. Created root `/users/{uid}` index for $O(1)$ fast lookups.
- **BUG-003 (Plaintext Passwords Removal)**: Fixed in `auth_service.dart`. Removed legacy plaintext password checks and fields.
