# 33. Deployment Architecture & Hosting

## 1. Hosting Infrastructure & CDN
- **Public Website (`Application/website`)**: Deployed to Vercel / Firebase Hosting (`https://society-sphere-two.vercel.app`).
- **Society Admin Panel (`Application/society_admin`)**: Deployed to Vercel / Firebase Hosting (`app.societysphere.com`).
- **Super Admin Dashboard (`Application/super_admin`)**: Deployed to Vercel / Firebase Hosting (`admin.societysphere.com`).
- **Cloud Functions (`Application/functions`)**: Deployed via `firebase deploy --only functions` to Google Cloud Platform / Firebase region `us-central1`.
- **Firestore Security Rules**: Deployed via `firebase deploy --only firestore:rules`.
- **Mobile Apps (`Application/mobile`)**: Release APKs compiled via Gradle productFlavors (`app-resident-release.apk` & `app-guard-release.apk`).
