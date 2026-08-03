# 36. Enums, Statuses & Domain Constants Catalog

## 1. Account Roles (`role`)
- `super_admin`: Platform Executive Administrator
- `admin`: Local Society RWA Committee Admin
- `resident`: Verified Flat Occupant (Owner or Tenant)
- `guard`: Security Gate personnel

## 2. Resident Account Statuses (`status`)
- `pending_approval`: Newly registered mobile user awaiting RWA Admin review
- `active`: Verified resident with full app access
- `suspended`: Account temporarily locked by Society Admin
- `rejected`: Registration request declined by Society Admin

## 3. Visitor Statuses (`status`)
- `pending`: Walk-in visitor waiting at gate for resident approval
- `approved`: Resident approved visitor entry
- `rejected`: Resident declined visitor entry
- `exited`: Visitor departure recorded by gate guard

## 4. CRM Lead Stages (`status`)
- `New`, `Contacted`, `Demo Scheduled`, `Proposal Sent`, `Closed Won`
