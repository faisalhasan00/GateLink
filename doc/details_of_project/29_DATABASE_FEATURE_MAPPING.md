# 29. Database Collection to Feature Traceability

| Firestore Collection / Path | Primary Features Using Collection | Application Clients |
| :--- | :--- | :--- |
| `/leads/{leadId}` | Inbound Website Demo Request Tracking, CRM Sales Funnel | `website`, `super_admin` |
| `/societies/{societyId}` | Society Onboarding, Society Code Resolution, Tenant Metadata | `super_admin`, `society_admin`, `mobile` |
| `/users/{uid}` | $O(1)$ Direct User Membership & Role Index | `mobile`, `society_admin` |
| `societies/{id}/users/{uid}` | Resident Roster, Flat Directory, Admin Approvals, FCM Tokens | `society_admin`, `mobile` |
| `societies/{id}/visitors/{id}` | Walk-in Check-in, Resident Approvals, Guard Gate Log | `mobile` (Guard & Resident), `society_admin` |
| `societies/{id}/complaints/{id}`| Helpdesk Ticket Filing, Staff Assignment, Ticket Tracking | `mobile` (Resident), `society_admin` |
| `societies/{id}/maintenance_bills/{id}`| Monthly Maintenance Invoicing, Resident Dues, Receipt Dispatch | `society_admin`, `mobile` (Resident) |
| `societies/{id}/amenity_bookings/{id}`| Clubhouse/Pool Reservations, Slot Conflict Checking | `mobile` (Resident), `society_admin` |
| `societies/{id}/audit_logs/{id}` | Anti-Tamper Immutable Security & Financial Audit Trail | `functions`, `society_admin` |
