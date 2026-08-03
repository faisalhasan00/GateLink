# 16. Complete System Architecture & High-Level Blueprint

## 1. High-Level Architecture Flow

```mermaid
flowchart TD
    subgraph FrontendClients["Frontend Client Layer"]
        PublicWeb["Public SaaS Website\n(Application/website)"]
        SocietyAdmin["Society Admin Dashboard\n(Application/society_admin)"]
        SuperAdmin["Super Admin Dashboard\n(Application/super_admin)"]
        ResidentApp["HomeHni Residency App\n(Application/mobile resident)"]
        GuardApp["HomeHni Guard App\n(Application/mobile guard)"]
    end

    subgraph AuthLayer["Authentication & Security"]
        FA["Firebase Authentication\n(Email/Password & Google OAuth)"]
        FR["Firestore Security Rules\n(Application/firestore.rules)"]
        IndexMapping["Global Direct Mapping Index\n(/users/{uid})"]
    end

    subgraph DatabaseLayer["Data & Backend Services"]
        FS[(Firebase Cloud Firestore)]
        CF["Cloud Functions v2\n(Application/functions)"]
        FCM["Firebase Cloud Messaging\n(Push Notifications)"]
    end

    FrontendClients --> FA
    FrontendClients --> FR
    FR --> FS
    FS --> CF
    CF --> FCM
    CF --> FS
    FA --> IndexMapping
```

---

## 2. Component Integration Matrix

- **Public Website (`Application/website`)**: Submits lead documents directly to `/leads` collection in Firestore.
- **Society Admin Panel (`Application/society_admin`)**: Reads and writes to `societies/{societyId}/*` collections. Uses `getSocietyAdminSession` and Firebase Auth token state.
- **Super Admin Panel (`Application/super_admin`)**: Accesses executive collections `/leads`, `/societies`, `/ad_campaigns`.
- **Resident Mobile App (`Application/mobile` - Resident)**: Uses `auth_service.dart` for self-registration, reads `userProfileProvider` via `/users/{uid}` mapping index, listens to `societies/{societyId}/visitors` and `notifications`.
- **Guard Security App (`Application/mobile` - Guard)**: Performs walk-in visitor entry on `societies/{societyId}/visitors`, scans QR codes, and logs vehicle entries.
- **Cloud Functions (`Application/functions`)**: Triggers on `visitors`, `amenity_bookings`, `maintenance_bills`, and `complaints` updates to send in-app and FCM push notifications.
