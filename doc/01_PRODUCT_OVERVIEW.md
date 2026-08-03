# 01. Product Overview — SocietySphere (HomeHni Hood)

## Executive Summary
**SocietySphere** (branded as **HomeHni Hood**) is an enterprise multi-tenant SaaS gated-community management ecosystem designed to digitize, secure, and streamline residential housing society operations across India and global urban markets.

---

## 1. Primary Problem Solved
1. **Unverified Gate Entries & Security Risk**: Manual paper registers at security gates lead to unverified visitor entries, unauthorized vehicle access, and lack of real-time approval from residents.
2. **Fragmented Society Operations**: RWA (Resident Welfare Association) management committees struggle with disjointed maintenance billing, unorganized complaint tracking, offline amenity booking, and slow notice distribution.
3. **Multi-Tenant Data Security**: Traditional web portals leak cross-society data due to weak role-based boundaries. SocietySphere enforces zero-trust tenant isolation across all applications.

---

## 2. Target Customers & Users
- **Prospective Clients / RWA Committees**: Housing society board members, estate managers, and facility management companies.
- **Society Admins**: Local RWA President, Secretary, and Treasurer managing day-to-day operations.
- **Residents (Owners & Tenants)**: Flat occupants requiring instant visitor approval, digital billing, gate pass generation, and community helpdesk access.
- **Security Guards**: Gate personnel performing walk-in visitor entry, QR scanning, vehicle tracking, and SOS dispatch.
- **Super Admins**: Executive SaaS administrators managing multi-tenant onboarding, billing plans, and system analytics.

---

## 3. Product Architecture & Ecosystem

```mermaid
flowchart TD
    subgraph Clients["Applications & User Interfaces"]
        A[Public Marketing Website\nApplication/website] -->|Inbound Leads| Firestore[(Firebase Firestore)]
        B[Society Admin Panel\nApplication/society_admin] -->|Web Management| Firestore
        C[Super Admin Executive Panel\nApplication/super_admin] -->|Platform Controls| Firestore
        D[Resident Mobile App\nApplication/mobile --flavor resident] -->|FCM / Realtime| Firestore
        E[Guard Mobile App\nApplication/mobile --flavor guard] -->|Gate Operations| Firestore
    end

    subgraph Backend["Cloud & Backend Infrastructure"]
        Firestore <-->|Document Triggers| CloudFunctions[Firebase Cloud Functions v2\nApplication/functions]
        CloudFunctions -->|Push Alerts| FCM[Firebase Cloud Messaging]
        CloudFunctions -->|Audit Trail| AuditLogs[societies/{id}/audit_logs]
    end
```

---

## 4. Multi-Tenant SaaS Hierarchy
```
Platform Super Admin (HQ-GLOBAL)
└── Housing Society (e.g. SOC-001 - Greenwood Estate)
    ├── Towers / Blocks
    ├── Flats / Units (e.g. A-101)
    ├── Users (Admins, Residents, Guards, Staff)
    ├── Visitors (Walk-in, Pre-approved, Delivery, Cab)
    ├── Maintenance Bills & Receipts
    ├── Complaints & Helpdesk Tickets
    ├── Amenity Bookings & Parking Slots
    └── Immutable Audit Logs
```
