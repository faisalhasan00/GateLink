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

### Web Applications (React / Vite - Industry Standard Decoupled Monorepo):
- **Public SaaS Marketing Website** (`Application/website`):
  - Target Audience: Prospective clients, visitors, public leads (`www.societysphere.com`).
  - Run Command: `npm run dev` inside `Application/website`
- **Society Admin Dashboard** (`Application/society_admin`):
  - Target Audience: Local Society Management Committees (`app.societysphere.com`).
  - Run Command: `npm run dev` inside `Application/society_admin`
- **Super Admin Dashboard** (`Application/super_admin`):
  - Target Audience: SocietySphere System Administrators (`admin.societysphere.com`).
  - Run Command: `npm run dev` inside `Application/super_admin`
- **Rule**: Maintain strict application separation, multi-tenant isolation, and RBAC separation across all three web products.

## 2. Verification Protocol
- Whenever updating mobile application files, always run `flutter analyze` inside `Application/mobile` to verify compilation integrity.
- Whenever updating website files, verify with `npm run build` inside `Application/website`.
- Whenever updating society admin files, verify with `npm run build` inside `Application/society_admin`.
- Whenever updating super admin files, verify with `npm run build` inside `Application/super_admin`.
