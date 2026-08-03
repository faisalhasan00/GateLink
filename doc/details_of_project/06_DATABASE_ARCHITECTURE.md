# 06. Database Architecture & Complete Data Model

## Firestore Collection Schema & Hierarchy

```
/users/{userId} (Global Direct Membership Mapping)
  ├── uid: string
  ├── email: string
  ├── societyId: string
  ├── role: string ('admin' | 'resident' | 'guard' | 'super_admin')
  └── status: string ('active' | 'pending_approval' | 'suspended')

/leads/{leadId} (Website Inbound Leads)
  ├── name: string
  ├── email: string
  ├── phone: string
  ├── societyName: string
  ├── flatCount: string
  ├── status: string ('New' | 'Contacted' | 'Demo Scheduled' | 'Closed Won')
  └── createdAt: timestamp

/societies/{societyId} (Multi-Tenant Core Collection)
  ├── code: string (e.g. 'SOC-001')
  ├── name: string
  ├── address: string
  ├── city: string
  ├── totalFlats: number
  ├── adminEmail: string
  ├── plan: string ('ENTERPRISE' | 'PRO')
  │
  ├── /users/{userId}
  │     ├── uid: string
  │     ├── name: string
  │     ├── email: string
  │     ├── flatNumber: string
  │     ├── role: string
  │     ├── ownershipType: string ('Owner' | 'Tenant')
  │     ├── status: string ('active' | 'pending_approval')
  │     ├── documentProofUrl: string
  │     ├── fcmToken: string
  │     └── /notifications/{notifId}
  │
  ├── /visitors/{visitorId}
  │     ├── name: string
  │     ├── phone: string
  │     ├── visitorType: string ('Guest' | 'Delivery' | 'Cab' | 'Helper')
  │     ├── hostFlat: string
  │     ├── vehicleNumber: string
  │     ├── status: string ('pending' | 'approved' | 'rejected' | 'exited')
  │     ├── entryTime: timestamp
  │     └── exitTime: timestamp
  │
  ├── /complaints/{complaintId}
  │     ├── title: string
  │     ├── category: string
  │     ├── description: string
  │     ├── flatNumber: string
  │     ├── raisedBy: string (uid)
  │     ├── assignedTo: string (staffId)
  │     └── status: string ('Open' | 'In Progress' | 'Resolved')
  │
  ├── /maintenance_bills/{billId}
  │     ├── invoiceNumber: string
  │     ├── residentUid: string
  │     ├── flatNumber: string
  │     ├── month: string
  │     ├── amount: number
  │     ├── status: string ('pending' | 'paid')
  │     └── paymentMethod: string
  │
  ├── /amenity_bookings/{bookingId}
  │     ├── amenityName: string
  │     ├── uid: string
  │     ├── date: string
  │     └── timeSlot: string
  │
  └── /audit_logs/{logId} [IMMUTABLE]
        ├── action: string
        ├── targetType: string
        ├── targetId: string
        ├── updatedBy: string
        └── timestamp: timestamp
```
