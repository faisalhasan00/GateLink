# 14. SocietySphere AI Master Context

## Critical Rules for AI Agents Working on SocietySphere

1. **Multi-Tenant Isolation Protocol**:
   - ALWAYS scope queries under `societies/{societyId}/...`.
   - NEVER query root collections directly for user data except the `/users/{uid}` membership mapping index.

2. **Mobile Flavor Rules**:
   - `Application/mobile` contains TWO distinct apps using Gradle productFlavors.
   - Resident App: `flutter run --flavor resident -t lib/main.dart`
   - Guard App: `flutter run --flavor guard -t lib/main_guard.dart`
   - NEVER mix logic or routes between Resident App and Guard App.

3. **Web Applications**:
   - `Application/website`: Public SaaS landing page (`npm run dev`).
   - `Application/society_admin`: Local RWA Committee Admin Dashboard (`npm run dev`).
   - `Application/super_admin`: Master SaaS Executive Dashboard (`npm run dev`).

4. **Security Rules Integrity**:
   - ALWAYS verify changes with `firestore.rules`.
   - NEVER loosen permissions or expose root collections to unauthenticated queries.
