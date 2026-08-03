# 39. Technical Debt & Refactoring Map

## Resolved Technical Debt
1. **Plaintext Passwords**: Removed legacy plaintext `password` comparisons in `auth_service.dart` and stripped plaintext password fields from pre-provisioned user documents.
2. **$O(N)$ Linear Scan**: Replaced $O(N)$ looping across societies on app launch with direct $O(1)$ read from root `/users/{uid}` membership mapping index.
3. **`localStorage` Session Overwrites**: Replaced unverified timestamp strings in route guards with live Firebase Auth state verification (`onAuthStateChanged`).

---

## Low Priority Refactoring Opportunities
1. **Dynamic Code Splitting**: Web bundles (`index-BYZtOj1w.js` ~948kB) emit a Vite chunk size warning (>500kB). Can be optimized with dynamic `import()` for heavy charting libraries.
2. **Centralized Route Constant Builder**: Further centralize route strings across web app dialogs into a single helper module.
