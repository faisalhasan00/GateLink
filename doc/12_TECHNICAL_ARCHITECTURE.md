# 12. Technical Architecture & Repository Blueprint

## 1. Directory Structure Blueprint
```
/SocietySphere
  ├── Application/
  │     ├── website/            (Public SaaS Landing & Marketing Web App)
  │     ├── society_admin/      (Local RWA Committee Society Admin Dashboard)
  │     ├── super_admin/        (Executive SaaS Super Admin Management Dashboard)
  │     ├── mobile/             (Flutter Resident & Security Guard Mobile Apps)
  │     ├── functions/          (Node.js Cloud Functions v2)
  │     └── firestore.rules     (Hardened Multi-Tenant Security Rules)
  └── doc/                      (Comprehensive Product Architecture Documentation)
```

## 2. Platform Build Verification Commands
- **Website Build**: `npm run build` inside `Application/website` (Vite)
- **Society Admin Build**: `npm run build` inside `Application/society_admin` (Vite)
- **Super Admin Build**: `npm run build` inside `Application/super_admin` (Vite)
- **Mobile Resident App Build**: `flutter run --flavor resident -t lib/main.dart` inside `Application/mobile`
- **Mobile Guard App Build**: `flutter run --flavor guard -t lib/main_guard.dart` inside `Application/mobile`
