# 42. AI Development Safety Guide

## Rules for AI Assistants Extending SocietySphere

1. **Before Modifying Firestore Collections**:
   - Check `Application/firestore.rules` first. Ensure new collections are declared under `societies/{societyId}/` with explicit `belongsToSociety(societyId)` or ownership checks.

2. **Before Adding Mobile Screens**:
   - Verify whether the feature belongs to Resident App (`lib/main.dart` / `app_router.dart`) or Guard App (`lib/main_guard.dart` / `guard_router.dart`).
   - NEVER mix resident and guard routes or widgets.

3. **Before Modifying User Authentication**:
   - Always update both `societies/{societyId}/users/{uid}` AND the global `/users/{uid}` direct membership mapping index to prevent $O(N)$ lookup regression.

4. **Verification Protocol**:
   - Web changes: `npm run build` in target project directory (`website`, `society_admin`, `super_admin`).
   - Mobile changes: `flutter analyze` in `Application/mobile`.
