# 🐞 GateLink — QA Bug & Issue Tracking Report (Document 3)

**Document ID:** GL-QA-DOC-003  
**Execution Date:** August 21, 2026  
**Auditor:** GateLink QA Lead & Software Engineering Review  

---

## 1. Summary of Discovered & Resolved Defects

During comprehensive testing across the mobile apps, web portals, and backend streams, the following defects were isolated, analyzed, and thoroughly resolved.

| Bug ID | Module | Title | Severity | Priority | Status | Resolved In Commit |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-001** | Architecture | 940-Line Monolithic `firestore_service.dart` Risk | Critical | P0 | 🟢 **RESOLVED** | `7f43c58` / `d45a7bc` |
| **BUG-002** | Guard App | Missing Route Getters in `AppRoutes` (`vehicles`, `passcode`, `scan`) | High | P1 | 🟢 **RESOLVED** | `d45a7bc` |
| **BUG-003** | Resident App | Missing `watchVisitorsForResident` Mock Contract in Unit Test Suite | Medium | P2 | 🟢 **RESOLVED** | `7f43c58` |
| **BUG-004** | Guard App | `Map<String, dynamic>` Property Getter Crash on Dashboard Shift Header | High | P1 | 🟢 **RESOLVED** | `d45a7bc` |
| **BUG-005** | Service Engine | Bundled 477-line `visitor_service.dart` Conciseness Violation | Medium | P2 | 🟢 **RESOLVED** | `24b1ce7` |
| **BUG-006** | Notifications | Stream Duplication on Screen Re-render | Medium | P2 | 🟢 **RESOLVED** | Verified Clean |

---

## 2. In-Depth Defect Breakdown & Root Cause Analysis

### 🐛 BUG-001 (Critical / P0): Monolithic `firestore_service.dart` Single-Point-of-Failure
- **Module:** `resident_app` & `guard_app` / `core/services/`
- **Description:** A single 940-line `firestore_service.dart` handled 9 disparate domains (Visitors, Amenities, Complaints, Billing, Notices, Documents, Parking, Ads, Notifications). A failure or type modification in one domain risked compiling breaks across unrelated features.
- **Steps to Reproduce:**
  1. Inspect `lib/core/services/firestore_service.dart` prior to refactoring.
  2. Notice 940 lines of mixed domain operations.
- **Expected:** Each domain should reside in an isolated, testable micro-service under `lib/core/services/`.
- **Resolution:** Decomposed into 9 domain micro-services (`visitor_service.dart`, `amenity_service.dart`, `complaint_service.dart`, etc.) with `firestore_service.dart` acting strictly as a lightweight Facade.

---

### 🐛 BUG-002 (High / P1): Undefined Route Getters on Guard App Navigation
- **Module:** `guard_app` / `core/router/app_router.dart`
- **Description:** `DashboardScreen` referenced `AppRoutes.vehicles`, `AppRoutes.passcode`, `AppRoutes.scan`, and `AppRoutes.documents`, which were omitted in the initial router definition.
- **Steps to Reproduce:**
  1. Execute `flutter analyze` in `Application/Frontend/guard_app`.
  2. Notice compile errors: `The getter 'vehicles' isn't defined for the type 'AppRoutes'`.
- **Expected:** Router must expose standard aliases for all quick actions and shell navigation items.
- **Resolution:** Added route aliases linking `vehicles` ➡️ `/guard/vehicles`, `passcode`/`scan` ➡️ `/guard/scan`, and `documents` ➡️ `/guard/dashboard`.

---

### 🐛 BUG-004 (High / P1): Guard Name Map Lookup Type Mismatch
- **Module:** `guard_app` / `features/home/presentation/screens/dashboard_screen.dart`
- **Description:** Guard shift header attempted dot notation `profile?.name` on `Map<String, dynamic>?`, triggering a Dart static type error.
- **Steps to Reproduce:**
  1. Access `dashboard_screen.dart` line 62.
  2. Inspect `userProfileProvider.value` which returns a raw JSON map.
- **Expected:** Type-safe indexing: `profile?['name'] as String? ?? 'Security Guard'`.
- **Resolution:** Refactored line 62 to perform null-safe map key lookup with fallback to `displayName` and `'Security Guard'`.

---

### 🐛 BUG-005 (Medium / P2): Visitor Service Responsibility Bloat (477 Lines)
- **Module:** `resident_app` & `guard_app` / `core/services/visitor_service.dart`
- **Description:** `visitor_service.dart` bundled flat regex flex-matching (~140 lines) and cryptographic QR/Passcode generators (~120 lines) alongside core visitor operations.
- **Expected:** Flat validation and Passcode security should be distinct micro-services.
- **Resolution:** Extracted `flat_validation_service.dart` and `visitor_pass_service.dart`. `visitor_service.dart` now stands at a concise ~150 lines.

---

## 3. Current Open Issues / Non-Blocking Observations

| Observation ID | Module | Observation | Risk Level | Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| **OBS-001** | Build Toolchain | Flutter deprecation warnings for `withOpacity` in UI files | Low (Info) | Gradually migrate `color.withOpacity(x)` to `color.withValues(alpha: x)` in future sprint. |
| **OBS-002** | Flutter Analyzer | Android Gradle Plugin version notice (AGP 8.9.1 ➡️ 8.11.1) | Low (Info) | Update AGP in `android/build.gradle` before Flutter 3.35 release. |
