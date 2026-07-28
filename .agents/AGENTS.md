# SocietySphere Workspace Rules & Architectural Boundaries

## 1. Application Separation & Isolation Rules

### Mobile Applications (Flutter - `Application/mobile`):
- **Resident App**:
  - Entry point: `lib/main.dart`
  - App Class: `SocietySphereApp`
  - Target Audience: Society residents, flat owners, tenants.
  - Run Command: `flutter run --flavor resident -t lib/main.dart` or `.\run_mobile.ps1`
- **Guard / Security App**:
  - Entry point: `lib/main_guard.dart`
  - App Class: `SocietySphereGuardApp`
  - Target Audience: Gate security guards and gatekeepers.
  - Run Command: `flutter run --flavor guard -t lib/main_guard.dart` or `.\run_guard.ps1`
- **Rule**: NEVER mix logic, routes, or UI components between the Resident App and Guard App. Keep entrypoints, routes (`app_router.dart` vs `guard_router.dart`), and feature scopes strictly decoupled. MUST use `--flavor` parameter when running/building Flutter apps because Gradle defines productFlavors `resident` and `guard`.

### Web Dashboards (React / Vite - `Application/admin_panel`):
- **Society Admin Dashboard**:
  - Route: `/`
  - Target Audience: Local Society Management Committee (Presidents, Secretaries, Treasurers).
- **Super Admin Dashboard**:
  - Route: `/super-admin`
  - Target Audience: SocietySphere System Administrators managing licensing, onboarded societies, and global CRM/Ads.
- **Rule**: Maintain strict multi-tenant isolation and RBAC separation between Society Admin features and Super Admin features.

## 2. Verification Protocol
- Whenever updating mobile application files, always run `flutter analyze` inside `Application/mobile` to verify compilation integrity.
- Whenever updating admin panel files, verify with `npm run build` inside `Application/admin_panel`.
