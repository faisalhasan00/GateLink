# 04. Screen-by-Screen Inventory

## 1. Society Admin Panel (`Application/society_admin`)

| Screen Name | Route | Access Role | Primary Components & Buttons | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Admin Login** | `/login` | Public / Admin | Email input, Password input, "Sign In" button | Authenticate Society Admin into workspace |
| **Dashboard** | `/` | Society Admin | Metric cards, Recent activity feed, Quick action bar | Overview of active residents, gate logs, complaints |
| **Residents** | `/residents` | Society Admin | Roster table, "🔥 Pending Approvals" tab, Approve/Decline buttons, "Add Resident" modal | Manage flat directory and verify self-registered mobile accounts |
| **Visitor Logs** | `/visitors` | Society Admin | Gate entry table, status filter (`pending`, `approved`, `exited`), Date picker | Audit historical and active gate visitor entries |
| **Amenities** | `/amenities` | Society Admin | Amenity grid, "Add Amenity" modal, Booking list | Manage society clubhouses, pools, and reservations |
| **Maintenance** | `/maintenance` | Society Admin | Invoices table, "Generate Monthly Bill" modal, Payment status badge | Manage maintenance dues and view receipts |
| **Complaints** | `/complaints` | Society Admin | Ticket Kanban/Table, Assign Staff dropdown, Resolution modal | Track and resolve resident maintenance tickets |
| **Notices** | `/notices` | Society Admin | Notice board feed, "Publish Notice" modal | Broadcast official announcements to mobile app |
| **Staff Management** | `/staff` | Society Admin | Staff list, "Add Staff / Guard" modal | Onboard security guards and domestic workers |
| **Emergency SOS** | `/sos` | Society Admin | SOS alert feed, Acknowledge button | Monitor emergency alarms triggered by residents |

---

## 2. Super Admin Panel (`Application/super_admin`)

| Screen Name | Route | Access Role | Primary Components & Buttons | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin Login** | `/login` | Super Admin | Email & Password form | Executive portal authentication |
| **Dashboard** | `/` | Super Admin | Society stats, Revenue overview, Lead pipeline summary | SaaS executive overview |
| **Society Management**| `/societies` | Super Admin | Societies data table, "Onboard New Society" modal | Create and manage client housing societies |
| **CRM Leads** | `/crm` | Super Admin | Leads table, Pipeline stage dropdown, Lead details modal | Track website inbound demo inquiries |

---

## 3. Resident Mobile App (`Application/mobile` - Resident Flavor)

| Screen Name | Route | Access Role | Purpose |
| :--- | :--- | :--- | :--- |
| **Splash Screen** | `/splash` | All | App initialization and auth routing check |
| **Login Screen** | `/login` | Public | Authenticate resident via Email/Password or Google |
| **Register Screen** | `/register` | Public | Register resident with Society Code and digital proof |
| **Pending Approval** | `/pending-approval`| Unverified | Hold screen with status re-checker button |
| **Home Dashboard** | `/home` | Verified Resident | Quick visitor approval, quick SOS button, notice carousel |
| **Visitor Management**| `/visitors` | Verified Resident | View pending gate requests and historical visitors |
| **Maintenance Bills** | `/maintenance` | Verified Resident | Inspect pending dues and payment history |
| **Complaints Ticket** | `/complaints` | Verified Resident | Raise helpdesk tickets with photos |
| **Amenity Booking** | `/amenities` | Verified Resident | Reserve clubhouse or pool time slots |

---

## 4. Guard Security Mobile App (`Application/mobile` - Guard Flavor)

| Screen Name | Route | Access Role | Purpose |
| :--- | :--- | :--- | :--- |
| **Guard Login** | `/guard/login` | Security Guard | Authenticate gate guard with passcode |
| **Gate Console** | `/guard/home` | Security Guard | Check-in walk-in visitor, view real-time approvals |
| **Vehicle Logs** | `/guard/vehicles` | Security Guard | Scan and log resident/guest vehicle entry |
