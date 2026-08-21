# 📋 GateLink — Official QA Master Test Plan (Document 1)

**Document ID:** GL-QA-DOC-001  
**Project:** GateLink (SocietySphere Ecosystem)  
**Version:** 2.4.0-PROD  
**Lead QA Specialist:** Antigravity Senior QA & Software Testing Team  
**Date of Execution:** August 21, 2026  
**Confidentiality:** Internal Engineering & Executive Review  

---

## 1. Executive Summary & Objective

GateLink is a comprehensive, production-grade SaaS smart community and gate security management platform. The objective of this QA Testing Plan is to systematically validate the integrity, responsiveness, security, fault tolerance, and cross-system data synchronization across all four primary client surfaces:
1. **GateLink Resident Mobile App** (Flutter — iOS & Android)
2. **GateLink Security Guard Mobile App** (Flutter — Android Gate POS/Smartphones)
3. **GateLink Society Admin Portal** (React 19 / Vite — `app.gatelink.in`)
4. **GateLink Super Admin Control Portal** (React 19 / Vite — `admin.gatelink.in`)
5. **GateLink Marketing & SaaS Website** (React 19 / Vite — `gatelink.in`)

---

## 2. Scope of Testing

```
GateLink Ecosystem Scope
├── Web Surfaces
│   ├── gatelink.in (Public Marketing, Pricing Calculator, Lead Gen, Responsive UX)
│   ├── app.gatelink.in (Society Admin Portal: Residents, Gates, Complaints, Dues, Notices)
│   └── admin.gatelink.in (Super Admin: Multi-Tenant Provisioning, MRR KPIs, Global Ads)
│
├── Mobile Surfaces
│   ├── Resident App (Auth, Passes, 6-Digit PIN, Dues, Amenity Slots, SOS)
│   └── Guard App (Quick Entry, QR/Passcode Scanning, Exit Duration, Overstay Alerts)
│
└── Backend & Infrastructure
    ├── Cloud Firestore v12 Security Rules & Multi-Tenant Isolation
    ├── Cashfree Payment Gateway Webhook & Reconciliation Pipeline
    └── Cloud Functions Serverless Event Dispatchers
```

### In-Scope Modules:
- **Authentication & RBAC**: Firebase Auth, role isolation (`super_admin`, `society_admin`, `resident`, `guard`), session persistence, token refresh.
- **Visitor Security Engine**: Resident pre-invites with 24-hr TTL 6-digit numeric passcodes & QR codes, Guard rapid entry flex-matching, check-in validation, exit duration timers.
- **Maintenance & Invoicing**: Automated bill batch generation, Cashfree order tokens, payment receipts, instant dues reconciliation.
- **Helpdesk & Complaints**: Ticket lifecycle (`Open` ➡️ `In Progress` ➡️ `Resolved`), priority routing, photo attachments.
- **Amenities Booking Engine**: Real-time slot reservation, capacity quotas, duplicate time conflict prevention, cancellations.
- **Emergency SOS Broadcast**: Trigger propagation across Resident App ➡️ Guard Tablet ➡️ Admin Helpdesk with zero latency.
- **Cross-Surface Synchronization**: Immediate stream updates between Resident Flutter App, Guard Flutter App, and React Admin Portals.

---

## 3. Testing Strategy & Methodology

| Test Type | Description | Tools & Frameworks |
| :--- | :--- | :--- |
| **Unit & Contract Testing** | Validating domain models, state controllers, and service isolation | Flutter Test, Riverpod Container, Mockito |
| **End-to-End Automated UI** | Headless Chrome browser testing across Desktop, Tablet, and Mobile viewports | Puppeteer v24, Node.js Test Runner |
| **Physical Device Testing** | Native APK validation on Android 14 hardware | Samsung SM-S721B (`RZCY90G2W8H`), ADB Bridge |
| **Security & RBAC Auditing** | Verifying tenant boundary isolation and unauthenticated route guards | Network Interceptors, Direct Route Navigation |
| **Cross-System Sync Testing** | Multi-device concurrent workflow execution (Resident ↔ Guard ↔ Admin) | Firestore Snapshot Streams & WebSocket Watchers |

---

## 4. Test Environments & Devices

| Surface | Target Environment | Host / Device | Viewport / OS |
| :--- | :--- | :--- | :--- |
| **Website** | Local Dev / Staging | `http://localhost:5173` | Desktop (1920x1080), Tablet (768x1024), Mobile (375x812) |
| **Society Admin** | Local Dev / Staging | `http://localhost:5174` | Desktop (1920x1080), 1080p Chrome 134 |
| **Super Admin** | Local Dev / Staging | `http://localhost:5175` | Desktop (1920x1080), 1080p Chrome 134 |
| **Resident App** | Android Debug APK | Samsung SM-S721B (`RZCY90G2W8H`) | Android 14 (OneUI 6.1, DPI 420) |
| **Guard App** | Android Debug APK | Samsung SM-S721B (`RZCY90G2W8H`) | Android 14 (OneUI 6.1, DPI 420) |

---

## 5. Risk Assessment & Mitigation Matrix

| Identified Risk | Severity | Mitigation Strategy |
| :--- | :--- | :--- |
| **Duplicate Visitor Check-in Scans** | High | Implemented strict status check (`inside`, `checked_out`, `denied`) before granting entry in `visitor_pass_service.dart`. |
| **Amenity Overbooking Race Conditions** | High | Capacity quota verified against active count (`approved` + `pending`) prior to Firestore document creation in `amenity_service.dart`. |
| **Monolithic Service Single-Point-of-Failure** | Critical | Decomposed 940-line `firestore_service.dart` into 9 decoupled domain micro-services with facade abstraction. |
| **Stale Cross-App State** | Medium | Riverpod StreamProviders listening directly to real-time subcollections with automatic reactive lifecycle teardown. |

---

## 6. Exit Criteria for Quality Gate

1. **100% Pass Rate** on all core unit test suites (`flutter test`).
2. **Zero Uncaught Console Errors** across all React Web applications.
3. **Verified Cross-System Data Synchronization** for the complete Visitor and Complaint lifecycles.
4. **Clean Code Quality**: All static analysis warnings addressed; zero compilation blocking errors.
