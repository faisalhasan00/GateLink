# 37. Domain Model & Business Entity Mapping

```
Housing Society (Tenant Context: SOC-001)
 ├── RWA Admin (Managing User)
 ├── Flat Roster (Unit A-101)
 │     ├── Primary Owner / Tenant (Resident User)
 │     ├── Gate Visitors (Guests, Cabs, Delivery)
 │     ├── Maintenance Invoices & Receipts
 │     ├── Helpdesk Tickets
 │     └── Amenity Bookings
 ├── Security Gate (Guard Users)
 └── Society Audit Log (Immutable Event Trail)
```
