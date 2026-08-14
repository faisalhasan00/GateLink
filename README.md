# GateLink — Production Software Platform

GateLink is an enterprise-grade Society, Apartment, and Gated Community Management platform (similar in category to MyGate, NoBrokerHood).

---

## 1. Monorepo Structure & Applications

GateLink is organized as a decoupled, industry-standard monorepo:

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
│       ├── website/               # React + Vite SaaS marketing website (gatelink.in)
│       ├── society_admin/         # React + Vite society management dashboard (app.gatelink.in)
│       └── super_admin/           # React + Vite platform administration portal (admin.gatelink.in)
│
├── .agents/
│   └── AGENTS.md                  # Development & architectural rules (Source of Truth)
└── README.md                      # Developer onboarding & quick start guide
```

---

## 2. Quick Start Guide for New Developers

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

#### 1. Resident Mobile App
```bash
cd Application/Frontend/resident_app
flutter pub get
flutter run -t lib/main.dart
```

#### 2. Security Guard Mobile App
```bash
cd Application/Frontend/guard_app
flutter pub get
flutter run -t lib/main.dart
```

---

## 3. Architecture & Development Guidelines

Every developer must adhere to the rules in [`.agents/AGENTS.md`](file:///.agents/AGENTS.md).

### A. Clean Component Pipeline
Business logic must be kept out of raw UI components. Follow this flow:
$$\text{Component (JSX/Widget)} \longrightarrow \text{Custom Hook (State/Lifecycle)} \longrightarrow \text{Service Layer} \longrightarrow \text{Firebase / Cloud Functions}$$

### B. Shared UI Components vs Feature Modules
- **`components/ui/`**: Generic, non-business primitives (`Button`, `Input`, `Badge`, `Card`, `StateViews`).
- **`features/<feature_name>/`**: Domain-specific components, hooks, services, types, and utilities (e.g. `features/navigation/`, `features/residents/`, `features/visitors/`).

### C. Multi-Tenant Security & Isolation
- **Rule**: Every data-driven Firestore read/write must be scoped with the active `societyId`.
- Never fetch or mutate documents without verifying tenant authorization.

---

## 4. Design System Tokens (`gatelink_tokens.css`)

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

## 5. Verification & Quality Assurance

Before opening a pull request or submitting code:

```bash
# Verify Web builds
cd Application/Frontend/website && npm run build
cd Application/Frontend/society_admin && npm run build
cd Application/Frontend/super_admin && npm run build

# Verify Flutter mobile apps
cd Application/Frontend/resident_app && flutter analyze
cd Application/Frontend/guard_app && flutter analyze
```

---

## 6. How to Write Code Comments
- **Explain the WHY, not the WHAT**:
  - ❌ `// Fetch residents`
  - ✅ `// Scoped by societyId to enforce multi-tenant isolation.`
  - ✅ `// Uses 12px radius and GateLink Navy token to maintain design system consistency.`
