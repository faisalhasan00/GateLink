# 43. AI Quick Reference & Context Cheat-Sheet

```yaml
Project Name: SocietySphere (HomeHni Hood)
Platform Type: Multi-Tenant Enterprise Gated Community SaaS
Primary Stack: React (Vite), Flutter, Firebase Auth, Firestore, Cloud Functions v2, FCM

Applications:
  - Website: Application/website (Public Landing Page)
  - Society Admin: Application/society_admin (Local RWA Panel)
  - Super Admin: Application/super_admin (Executive SaaS Console)
  - Resident Mobile: Application/mobile (--flavor resident, lib/main.dart)
  - Guard Mobile: Application/mobile (--flavor guard, lib/main_guard.dart)
  - Backend: Application/functions (Node.js Cloud Functions v2)

Key Security Rule:
  Multi-tenant data MUST reside under societies/{societyId}/* and enforce belongsToSociety(societyId).

Key Auth Rules:
  - Unapproved self-registered residents lock on PendingApprovalScreen.
  - Guards CANNOT self-register (must be RWA pre-provisioned).
  - Super Admin email: mohammedfaisalhasan@gmail.com
```
