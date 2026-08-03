# 32. Configuration Architecture & Environment Variables

## 1. Environment Configuration Variables

- **`VITE_FIREBASE_API_KEY`**: Web Firebase API Key.
- **`VITE_FIREBASE_AUTH_DOMAIN`**: Web Firebase Auth domain.
- **`VITE_FIREBASE_PROJECT_ID`**: Firebase project ID (`society-sphere-two` / `societysphere`).
- **`VITE_FIREBASE_STORAGE_BUCKET`**: Firebase Storage bucket location.
- **`VITE_FIREBASE_MESSAGING_SENDER_ID`**: FCM messaging sender ID.
- **`VITE_FIREBASE_APP_ID`**: Web application ID.
- **`VITE_WEBSITE_URL`**: Canonical public marketing website URL (`https://www.societysphere.com`).

---

## 2. Workspace Rules & Commands Summary
- **Mobile Resident App**: `flutter run --flavor resident -t lib/main.dart`
- **Mobile Guard App**: `flutter run --flavor guard -t lib/main_guard.dart`
- **Society Admin Panel**: `npm run dev` in `Application/society_admin`
- **Super Admin Panel**: `npm run dev` in `Application/super_admin`
- **Website**: `npm run dev` in `Application/website`
