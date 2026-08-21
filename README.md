# GateLink — Production Software Platform

GateLink is an enterprise-grade Society, Apartment, and Gated Community Management platform (similar in category to MyGate, NoBrokerHood).

---

## 1. Monorepo Structure & Applications

GateLink is organized as a decoupled, industry-standard monorepo following `.agents/AGENTS.md` rules:

```
SocietySphere / GateLink
├── Application/
│   ├── Backend/
│   │   ├── functions/             # Firebase Cloud Functions v2 (Serverless Node.js backend)
│   │   ├── firestore.rules        # Security rules with multi-tenant societyId isolation
│   │   └── firebase.json          # Hosting & emulator configuration
│   │
│   └── Frontend/
│       ├── resident_app/          # Flutter mobile app for residents & flat owners
│       ├── guard_app/             # Flutter mobile app for security guards & gatekeepers
│       ├── partner_app/           # Flutter mobile app for GateLink partners & referral agents
│       ├── website/               # React + Vite SaaS marketing website (gatelink.in)
│       ├── society_admin/         # React + Vite society management dashboard (app.gatelink.in)
│       └── super_admin/           # React + Vite platform administration portal (admin.gatelink.in)
│
├── .agents/
│   └── AGENTS.md                  # Development & architectural rules (Source of Truth)
└── README.md                      # Developer onboarding & quick start guide
```

---

## 2. Platform Core Systems

### A. Role-Based Access Control (RBAC) & Team Management
- **Master Admin Protection**: Permanent, immutable Master Super Admin (`mohammedfaisalhasan@gmail.com`) with full system access.
- **Granular Permissions**: 14 distinct permission modules with real-time UI masking and sidebar control for staff members.
- **Secondary App Provisioning**: Uses secondary Firebase App instances to create staff accounts without terminating active admin sessions.

### B. Universal Push Notification Dispatcher (FCM)
- High-priority Google FCM push notification engine supporting Festival Wishes, Sponsored Offers, Security Alerts, and Official Announcements.
- Live mobile lockscreen preview simulator and real-time broadcast telemetry log history.

### C. Clean Feature Architecture & Domain Services
- **No Monolithic Files**: Strictly decoupled into `<300 line` single-responsibility components and hooks under `src/features/<feature-name>/`.
- **Domain Services**: `society_admin` data services structured under `src/services/domain/` (`residentService`, `maintenanceService`, `complaintService`, `facilityService`).

---

## 3. Quick Start Guide for New Developers

### Prerequisites
- **Node.js**: v18+ or v20+
- **Flutter SDK**: v3.19+ (with Android SDK setup)
- **Firebase CLI**: `npm install -g firebase-tools`

### Running the Web Applications

#### 1. Public Marketing Website (`website` - Port 5173)
```bash
cd Application/Frontend/website
npm install
npm run dev
# Accessible at http://localhost:5173
```

#### 2. Society Admin Dashboard (`society_admin` - Port 5174)
```bash
cd Application/Frontend/society_admin
npm install
npm run dev
# Accessible at http://localhost:5174
```

#### 3. Super Admin Control Portal (`super_admin` - Port 5175)
```bash
cd Application/Frontend/super_admin
npm install
npm run dev
# Accessible at http://localhost:5175
```

### Running the Mobile Applications

#### 1. Resident Mobile App (`resident_app`)
```bash
cd Application/Frontend/resident_app
flutter pub get
flutter run -t lib/main.dart
```

#### 2. Security Guard Mobile App (`guard_app`)
```bash
cd Application/Frontend/guard_app
flutter pub get
flutter run -t lib/main.dart
```

#### 3. Partner & Referral Mobile App (`partner_app`)
```bash
cd Application/Frontend/partner_app
flutter pub get
flutter run -t lib/main.dart
```

---

## 4. Architecture & Development Guidelines

Every developer must adhere to the rules in [`.agents/AGENTS.md`](file:///.agents/AGENTS.md).

### A. Clean Component Pipeline
Business logic must be kept out of raw UI components. Follow this flow:
$$\text{Component (JSX/Widget)} \longrightarrow \text{Custom Hook (State/Lifecycle)} \longrightarrow \text{Service Layer} \longrightarrow \text{Firebase / Cloud Functions}$$

### B. Shared UI Components vs Feature Modules
- **`components/ui/`**: Generic, non-business primitives (`Button`, `Input`, `Badge`, `Card`, `StateViews`).
- **`features/<feature_name>/`**: Domain-specific components, hooks, services, types, and utilities (e.g. `features/team/`, `features/notifications/`, `features/residents/`).

### C. Multi-Tenant Security & Isolation
- **Rule**: Every data-driven Firestore read/write must be scoped with the active `societyId`.
- Never fetch or mutate documents without verifying tenant authorization.

---

## 5. Design System Tokens (`gatelink_tokens.css`)

GateLink uses a strict, brand-coherent token system:

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--gl-navy` | `#1E3A8A` | Primary buttons, headers, active navigation |
| `--gl-sky` | `#0EA5E9` | Links, secondary accents, highlight backgrounds |
| `--gl-amber` | `#F59E0B` | Primary CTAs, warning/pending statuses |
| `--radius-card` | `16px` | Standard card container corner radius |
| `--radius-button` | `12px` | Buttons, text inputs, form controls |
| `--radius-badge` | `999px` | Pill-shaped status and tag badges |
| Display Font | `Manrope (800)` | Section headings, wordmarks |
| Body Font | `Inter` | Body copy, table cells, form labels |

---

## 6. Verification & Quality Assurance

Before opening a pull request or submitting code:

```bash
# Verify Web builds
cd Application/Frontend/website && npm run build
cd Application/Frontend/society_admin && npm run build
cd Application/Frontend/super_admin && npm run build

# Verify Flutter mobile apps
cd Application/Frontend/resident_app && flutter analyze
cd Application/Frontend/guard_app && flutter analyze
cd Application/Frontend/partner_app && flutter analyze
```
