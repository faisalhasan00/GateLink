# 02. Applications and User Roles Inventory

## 1. Application Inventory

| Application | Path | Purpose | Target Users | Tech Stack | Entry Point |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Public Website** | `Application/website` | Lead generation, demo booking, SaaS feature showcase | Prospective Clients & Public Visitors | React, Vite, Lucide | `src/main.jsx` |
| **Society Admin Panel** | `Application/society_admin` | RWA committee operations, resident approvals, billing, helpdesk | Society Admins & Committee Members | React, Vite, Lucide, Firestore | `src/main.jsx` |
| **Super Admin Dashboard**| `Application/super_admin` | Multi-tenant SaaS management, society onboarding, leads CRM | Executive System Admins | React, Vite, Lucide, Firestore | `src/main.jsx` |
| **Resident Mobile App** | `Application/mobile` | Visitor approval, bill payment, SOS, amenity booking, notices | Society Residents (Owners & Tenants) | Flutter (`--flavor resident`) | `lib/main.dart` |
| **Guard Security App** | `Application/mobile` | Gate visitor check-in, QR verification, vehicle tracking | Security Guards & Gatekeepers | Flutter (`--flavor guard`) | `lib/main_guard.dart` |
| **Backend Functions** | `Application/functions` | Real-time push notifications, audit logging, payment handlers | Serverless Automation | Node.js, Firebase Functions v2 | `index.js` |

---

## 2. Complete User Role Inventory & Authorization Matrix

### Roles & Responsibilities

1. **Super Admin (`super_admin`)**:
   - Master executive system controller (`mohammedfaisalhasan@gmail.com`).
   - Access to `/super-admin/*` dashboard, society onboarding, inbound leads CRM, platform campaigns.

2. **Society Admin (`admin`)**:
   - Local RWA Committee Administrator.
   - Access to Society Admin Panel (`/app/*`), resident approval workflow, bill generation, staff onboarding.

3. **Resident (`resident`)**:
   - Verified flat occupant (Owner or Tenant).
   - Access to Resident Mobile App (`HomeHni Residency`), visitor approval popups, maintenance receipts, SOS.

4. **Security Guard (`guard`)**:
   - Gatekeeper security staff.
   - Access to Guard Mobile App (`HomeHni Guard`), walk-in visitor entry, QR scanner, vehicle logs.

---

## 3. Role-Permission Matrix

| Permission / Action | Super Admin | Society Admin | Resident | Security Guard | Unauthenticated Public |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Submit Public Lead** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View Website Content** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Onboard New Society** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Approve Pending Resident**| ✅ | ✅ | ❌ | ❌ | ❌ |
| **View All Residents Roster**| ✅ | ✅ | ❌ | ❌ | ❌ |
| **Approve Gate Visitor** | ✅ | ✅ | ✅ (Own Flat) | ❌ | ❌ |
| **Check-in Walk-in Visitor** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Create Maintenance Bill** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Pay Maintenance Bill** | ❌ | ❌ | ✅ (Own Bill) | ❌ | ❌ |
| **Trigger Emergency SOS** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **View Audit Trail Logs** | ✅ | ✅ | ❌ | ❌ | ❌ |
