# 20. Multi-Tenant Architecture & Data Isolation

## 1. Tenant Separation Model

SocietySphere implements a **Sub-Collection Multi-Tenancy Architecture** within Firebase Cloud Firestore:

- **Root Document per Tenant**: Each society is assigned a unique `societyId` (e.g. `SOC-001`, `SOC-002`, `SOC-003`).
- **Sub-Collection Isolation**: All operational data (users, visitors, complaints, bills, amenities, audit logs) reside strictly within sub-collections under `societies/{societyId}/`.
- **Global Membership Index**: A root-level collection `/users/{uid}` contains an index mapping user UIDs to their assigned `societyId` and `role`.

---

## 2. Multi-Tenant Security Enforcement

```mermaid
flowchart TD
    Request[Client Request to societies/SOC-002/users] --> Rules{Firestore Security Rules}
    Rules -->|Check belongsToSociety('SOC-002')| CheckUser[Verify request.auth.uid exists in societies/SOC-002/users OR users/{uid}.societyId == 'SOC-002']
    CheckUser -->|Matched| Allow[ALLOW ACCESS]
    CheckUser -->|Not Matched| Deny[DENY: Permission Error]
```

### Key Rules
1. `belongsToSociety(societyId)` verifies the user belongs to `societyId`.
2. Cross-tenant reads are blocked at the database level by Firestore rules.
3. Super Admins bypass tenant boundaries via `isSuperAdmin()` verification.
