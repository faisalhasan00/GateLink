# 17. Frontend Web Application Architecture

## 1. Web Technology Stack
- **Framework**: React 18 with Vite 8 bundler.
- **Routing**: `react-router-dom` v6 with `lazy()` code-splitting and `Suspense` fallback loaders.
- **Iconography**: `lucide-react` uniform icon library.
- **Styling**: Vanilla CSS design system (`index.css`) with predefined cards, stat grids, badges, tables, and modal overlay utilities.

---

## 2. Web Projects Overview

### A. Society Admin Panel (`Application/society_admin`)
- **Entry Point**: `src/main.jsx` -> `src/App.jsx`
- **Layout**: `src/components/layout/EnterpriseLayout.jsx` with persistent header (`EnterpriseHeader.jsx`) and sidebar (`EnterpriseSidebar.jsx`).
- **Authentication Guard**: `ProtectedRoute` in `App.jsx` validates Firebase Auth state (`onAuthStateChanged`).
- **Dynamic Tenant Context**: `sessionManager.js` and `AdminLogin.jsx` store the logged-in admin's `societyId` (e.g. `SOC-001`, `SOC-002`) to dynamically fetch society sub-collections.

### B. Super Admin Dashboard (`Application/super_admin`)
- **Entry Point**: `src/main.jsx` -> `src/App.jsx`
- **Layout**: `src/components/SuperAdminLayout.jsx` with red executive theme header.
- **Authentication Guard**: `ProtectedSuperRoute` enforces verified email (`mohammedfaisalhasan@gmail.com`).

### C. Public Marketing Website (`Application/website`)
- **Entry Point**: `src/main.jsx` -> `src/App.jsx`
- **Features**: Responsive SaaS hero, pricing calculator, ecosystem showcase, contact forms, interactive demo modal (`DemoModal.jsx`).
