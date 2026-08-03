# 40. Architectural Decisions Record (ADR)

## ADR 1: Sub-Collection Multi-Tenancy Strategy
- **Decision**: Store all society operational records under `societies/{societyId}/*` rather than top-level collections with a `societyId` field.
- **Rationale**: Enforces explicit, bulletproof tenant boundary checks in Firestore security rules (`belongsToSociety(societyId)`) and prevents accidental cross-tenant leaks.

## ADR 2: Global Membership Index (`/users/{uid}`)
- **Decision**: Maintain a global root index document at `/users/{uid}` mapping `uid ➔ societyId, role, status`.
- **Rationale**: Eliminates expensive $O(N)$ linear society scans during mobile app initialization, allowing 1-step profile resolution.

## ADR 3: Flutter ProductFlavors for Application Isolation
- **Decision**: Maintain distinct entrypoints (`main.dart` vs `main_guard.dart`) and Gradle productFlavors (`resident` vs `guard`).
- **Rationale**: Prevents mixing resident and guard UI logic, security permissions, or route definitions in mobile builds.
