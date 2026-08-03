# 03. Complete Feature Catalog

## Module Breakdown

### 1. Visitor & Gate Security Management
- **Walk-in Visitor Check-in**: Security guard enters visitor name, phone number, vehicle number, visitor type (Guest, Cab, Delivery, Helper), and target flat number.
- **Real-Time Resident Approval**: Triggers FCM push notification and in-app notification to all residents registered to the target flat.
- **1-Click Approve / Decline**: Resident approves or rejects visitor arrival directly from mobile popup or push notification action.
- **Guard Gate Dispatch**: Guard app updates in real-time with green "APPROVED" or red "DECLINED" badge.
- **Visitor Exit Tracking**: Guard logs visitor departure timestamp.

### 2. Resident Management & Onboarding Control
- **Society Code Verification**: Resident self-registration verifies entered society code against active database documents.
- **Digital Residency Proof Upload**: Resident submits rent agreement or electricity bill URL during signup.
- **Pending Approval Workflow**: Self-registered resident accounts set to `pending_approval` until RWA Admin verifies residency proof.
- **1-Click Approval Roster**: Society Admin views pending queue in `/residents` and approves/declines access.

### 3. Helpdesk & Complaint Ticket System
- **Ticket Creation**: Resident creates complaint ticket selecting category (Plumbing, Electrical, Elevator, Security, Noise), description, and optional photo attachment.
- **Staff Assignment**: Society Admin assigns ticket to specific domestic staff member or maintenance worker.
- **Status Workflow**: Ticket transitions `Open` ➔ `In Progress` ➔ `Resolved` ➔ `Closed`.

### 4. Maintenance Billing & Payment Tracking
- **Bill Generation**: Society Admin generates monthly maintenance invoice per flat (water, security, clubhouse, sinking fund).
- **Resident Bill View**: Resident inspects breakdown of pending and paid invoices in mobile app.
- **Receipt Generation**: Systems update bill status to `paid`, log transaction ID, and issue digital receipt.

### 5. Amenity Booking System
- **Slot Reservation**: Resident selects clubhouse, swimming pool, tennis court, or party hall with date and time slot.
- **Capacity & Conflict Prevention**: Validates booking slot availability before confirming.
- **Automatic Notification**: Cloud Function sends confirmation notification to resident.

### 6. Emergency SOS & Security Command
- **1-Tap Emergency Broadcast**: Resident or Guard presses SOS button (Medical, Fire, Security).
- **Broadcast Alert**: Instantly dispatches high-priority push notifications to gate guards and RWA Committee Admins.

### 7. SaaS Super Admin Executive Console
- **Society Onboarding**: Super Admin creates new society accounts, sets admin credentials, and assigns society code.
- **Website Inbound Lead Pipeline**: Real-time leads table tracking website demo requests (`New`, `Contacted`, `Demo Scheduled`, `Proposal Sent`, `Closed Won`).
