# 🧪 GateLink — Complete QA Test Cases & Results (Document 2)

**Document ID:** GL-QA-DOC-002  
**Execution Date:** August 21, 2026  
**Total Test Cases:** 60 Comprehensive Scenarios  
**Status Legend:** ✅ **PASSED** | ❌ **FAILED** | ⚠️ **BLOCKED** | ⚪ **NOT TESTED**  

---

## 1. Authentication & Security (AUTH)

| Test ID | Module | Test Scenario | Preconditions | Execution Steps | Expected Result | Actual Result | Status | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **AUTH-001** | Resident App | Resident Login with Valid Phone & Password | Registered resident exists in Firestore | 1. Open Resident App<br>2. Enter mobile number & password<br>3. Tap 'Login' | Auth token issued, profile loaded, navigated to Dashboard | User authenticated, redirected to home dashboard | ✅ PASSED | Critical |
| **AUTH-002** | Resident App | Resident Login with Invalid Password | User account exists | 1. Enter valid email/phone<br>2. Enter incorrect password<br>3. Submit | UI displays 'Invalid credentials' error snackbar; no state change | Red error banner displayed, user remains on login screen | ✅ PASSED | High |
| **AUTH-003** | Resident App | Session Persistence on App Restart | Resident logged in | 1. Kill app process<br>2. Reopen application | Auto-login through SecureStorage session token; bypass splash | Reopened directly to Home Shell without credential prompt | ✅ PASSED | High |
| **AUTH-004** | Guard App | Guard Shift Login with Gate Assignment | Guard account assigned to Gate 1 | 1. Enter guard credentials<br>2. Submit login | Guard dashboard loads with 'Gate 1 — Main Entry' shift header | Shift header loads with correct guard name & gate | ✅ PASSED | Critical |
| **AUTH-005** | Society Admin | Admin Portal Authentication | Admin user in `/users` with `society_admin` role | 1. Open `http://localhost:5174/login`<br>2. Enter admin credentials<br>3. Submit | Token stored in localStorage, redirected to society overview | Redirected to `/` with society KPI metrics loaded | ✅ PASSED | Critical |
| **AUTH-006** | Super Admin | Super Admin RBAC Gatekeeper | Non-super admin attempts access | 1. Open `http://localhost:5175/societies`<br>2. Attempt unauthenticated navigation | Guard blocks access and redirects to `/login` | Route guard redirected immediately to `/login` | ✅ PASSED | Critical |
| **AUTH-007** | Super Admin | Super Admin Login | Super Admin account provisioned | 1. Navigate to `http://localhost:5175`<br>2. Submit master credentials | Master dashboard displays total active societies and platform MRR | Overview renders with total societies and platform MRR | ✅ PASSED | Critical |

---

## 2. Visitor Management & Gate Operations (VIS & GUARD)

| Test ID | Module | Test Scenario | Preconditions | Execution Steps | Expected Result | Actual Result | Status | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **VIS-001** | Resident App | Pre-Invite Visitor with 6-Digit Passcode | Resident logged in with flat `A-101` | 1. Tap 'Invite Visitor'<br>2. Enter Name, Phone, Date, Purpose<br>3. Tap 'Generate Pass' | 6-digit numeric pass code & QR generated with 24-hr expiration | Pass code created, Firestore record written with `status: expected` | ✅ PASSED | Critical |
| **VIS-002** | Guard App | Scan Valid 6-Digit Passcode at Gate | Visitor presents 6-digit PIN `719402` | 1. Open Guard Scanner<br>2. Enter PIN or scan QR code<br>3. Tap 'Verify' | System verifies host flat `A-101`, resident name, and validity | Screen shows 'Verified', green status badge displayed | ✅ PASSED | Critical |
| **VIS-003** | Guard App | Prevent Duplicate Pass Usage | Pass marked `inside` | 1. Scan the same pass code a second time | Screen returns 'Pass Already Used' rejection | Rejection modal shown: `reason: already_used` | ✅ PASSED | High |
| **VIS-004** | Guard App | Expired QR Code Rejection | Pass created > 24 hours ago | 1. Scan expired QR pass code | System returns 'QR Code Expired' error | Validation engine returns `reason: expired` | ✅ PASSED | High |
| **VIS-005** | Guard App | Quick Entry with Smart Flat Flex-Matching | Target flat `A-101` | 1. Guard types `101`<br>2. Submits quick visitor log | Flex-matching engine resolves `101` to `Tower A, Flat 101, Resident: Raj` | Flat auto-resolved and verified against society directory | ✅ PASSED | High |
| **VIS-006** | Guard App | Check-Out Visitor & Stay Duration Calculation | Visitor inside since 14:00 | 1. Guard taps 'Mark Exit' on active visitor | Status updates to `checked_out`, duration string calculated (e.g. "1 Hr 15 Mins") | Exit timestamp stored, duration string formatted accurately | ✅ PASSED | Medium |
| **VIS-007** | Society Admin | Visitor Security Audit Stream | Real-time visitors entering gate | 1. Open `http://localhost:5174/visitors` | Table live-updates with visitor photo, gate name, and status badge | Live snapshot stream populates rows seamlessly | ✅ PASSED | Medium |

---

## 3. Maintenance, Billing & Payments (BILL)

| Test ID | Module | Test Scenario | Preconditions | Execution Steps | Expected Result | Actual Result | Status | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BILL-001** | Society Admin | Batch Generate Monthly Maintenance Bills | Active society with 100 flats | 1. Open `/maintenance`<br>2. Select month & amount (₹3,500)<br>3. Tap 'Generate Invoices' | 100 invoices generated with unique invoice numbers (`INV-2026-XXXX`) | Batch generated, bills created in `maintenance_bills` | ✅ PASSED | Critical |
| **BILL-002** | Resident App | View Pending Maintenance Dues | Resident has unpaid bill | 1. Open Maintenance screen in app | Displays total amount due, due date, breakdown of charges | Card displays ₹3,500 due with 'Pay Now' CTA | ✅ PASSED | High |
| **BILL-003** | Resident App | Cashfree Payment Flow Initiation | Bill selected for payment | 1. Tap 'Pay Now'<br>2. Select payment mode (UPI/Card) | Order session created, payment gateway interface launched | Payment order initialized with transaction ID | ✅ PASSED | High |
| **BILL-004** | Resident App | Instant Payment Reconciliation & Receipt | Payment successful | 1. Complete transaction<br>2. Verify status | Bill status changes to `Paid`, downloadable receipt added to history | Status updated to `Paid`, receipt available in tab | ✅ PASSED | High |
| **BILL-005** | Society Admin | Financial Reconciliation & Export | Multiple payments collected | 1. Navigate to `/maintenance/reports`<br>2. Export CSV summary | CSV contains flat number, payer name, transaction ID, and timestamp | CSV generated with complete transaction reconciliation | ✅ PASSED | Medium |

---

## 4. Helpdesk & Complaints Management (COMP)

| Test ID | Module | Test Scenario | Preconditions | Execution Steps | Expected Result | Actual Result | Status | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **COMP-001** | Resident App | Raise New Maintenance Complaint | Resident logged in | 1. Tap 'Raise Complaint'<br>2. Select category 'Plumbing'<br>3. Attach photo & submit | Ticket generated (`CMP-XXXXX`), status set to `Open` | Ticket created, in-app notification sent to society admin | ✅ PASSED | High |
| **COMP-002** | Society Admin | View & Assign Complaint Ticket | Complaint exists in `Open` status | 1. Open `/complaints`<br>2. Click ticket `CMP-10294`<br>3. Assign to 'Staff Electrician' | Status transitions to `In Progress`, staff notified | Status updated in Firestore, assigned staff displayed | ✅ PASSED | High |
| **COMP-003** | Society Admin | Resolve Complaint with Admin Remarks | Complaint resolved on-site | 1. Mark status as `Resolved`<br>2. Add closing remarks & submit | Status changes to `Resolved`, resident notified in app | Ticket marked `Resolved`, resident status updated live | ✅ PASSED | Medium |
| **COMP-004** | Resident App | Complaint Resolution Verification | Complaint marked resolved | 1. Resident opens complaints tab | Badge displays green 'Resolved', closing notes visible | Green 'Resolved' pill shown with resolution notes | ✅ PASSED | Medium |

---

## 5. Amenities Reservation Engine (AMEN)

| Test ID | Module | Test Scenario | Preconditions | Execution Steps | Expected Result | Actual Result | Status | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **AMEN-001** | Resident App | Book Available Amenity Slot | Clubhouse open, quota 10 | 1. Select Clubhouse<br>2. Choose date & 18:00–19:00 slot<br>3. Confirm booking | Booking confirmed, remaining slots decrease to 9 | Slot booked, `amenity_bookings` updated, slots remaining = 9 | ✅ PASSED | High |
| **AMEN-002** | Resident App | Prevent Amenity Slot Overbooking | Slot reached maximum capacity (10/10) | 1. 11th resident attempts booking the same slot | Exception thrown: "Slot Sold Out! All 10 slots booked" | Booking blocked with user-friendly capacity alert | ✅ PASSED | Critical |
| **AMEN-003** | Resident App | Cancel Existing Amenity Reservation | Booking in `confirmed` state | 1. Open 'My Bookings'<br>2. Tap 'Cancel Booking' | Status changes to `cancelled`, available slots restored to 10 | Booking cancelled, available slots incremented in Firestore | ✅ PASSED | Medium |

---

## 6. Notices & System-Wide Broadcasts (NOTIF)

| Test ID | Module | Test Scenario | Preconditions | Execution Steps | Expected Result | Actual Result | Status | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **NOTIF-001** | Society Admin | Publish Urgent Notice Broadcast | Society Admin logged in | 1. Open `/notices`<br>2. Type "Water Tank Cleaning Tomorrow"<br>3. Mark 'Urgent' & Publish | Notice published to subcollection `/notices`, pushed to residents | Notice card rendered in Resident App with Urgent red tag | ✅ PASSED | High |
| **NOTIF-002** | Super Admin | Send Hyperlocal In-App Ad Campaign | Super Admin logged in | 1. Open `/ads`<br>2. Upload banner & set target city<br>3. Set status to `Active` | Banner displays in Resident & Guard App ad carousels | Active ad stream displays promotional banner | ✅ PASSED | Medium |
| **NOTIF-003** | Super Admin | Broadcast System-Wide Emergency Alert | Master control portal | 1. Open `/notifications`<br>2. Select 'Maintenance Alert' template<br>3. Broadcast | Notification dispatched to all societies in real-time | Global notification received across all active portals | ✅ PASSED | High |

---

## 7. Public Website & Responsiveness (WEB)

| Test ID | Module | Test Scenario | Preconditions | Execution Steps | Expected Result | Actual Result | Status | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **WEB-001** | Website | Desktop Landing Page & Hero Render | `http://localhost:5173/` running | 1. Load viewport 1920x1080<br>2. Measure load time | Clean render, typography, CTA buttons, load time < 4s | Loaded in 3,360ms, H1 title rendered cleanly | ✅ PASSED | High |
| **WEB-002** | Website | Navigation Links & Feature Grid | Desktop viewport | 1. Scroll through feature showcase | 43 interactive elements loaded without broken images | Feature grid, glassmorphism cards, and icons render | ✅ PASSED | Medium |
| **WEB-003** | Website | Pricing Calculator & Tier Cards | Desktop viewport | 1. Inspect Starter, Growth, Enterprise plans | Correct currency formatting (₹), features list, and CTA buttons | Plan cards rendered with correct feature matrices | ✅ PASSED | Medium |
| **WEB-004** | Website | Lead Generation Contact Form | Desktop viewport | 1. Enter name, email, phone, society name<br>2. Submit | Form inputs validated, submission handler triggered | Form fields accept inputs with validation guards | ✅ PASSED | High |
| **WEB-005** | Website | Tablet Layout Responsiveness | Viewport 768x1024 | 1. Resize browser to tablet dimensions | Layout reflows to 2 columns, no horizontal scrollbar | Reflowed cleanly without horizontal overflow | ✅ PASSED | High |
| **WEB-006** | Website | Mobile Layout Responsiveness | Viewport 375x812 | 1. Resize to mobile viewport | Hamburger navigation active, cards stacked in single column | Mobile drawer and single-column cards fit 375px | ✅ PASSED | High |

---

## 8. Cross-System Data Synchronization (SYNC)

| Test ID | Module | Test Scenario | Preconditions | Execution Steps | Expected Result | Actual Result | Status | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SYNC-001** | Cross-System | End-to-End Visitor Security Flow | Resident + Guard + Admin active | 1. Resident invites visitor (PIN generated)<br>2. Guard verifies PIN at gate<br>3. Admin views visitor inside<br>4. Guard marks exit | All 3 surfaces synchronize status within < 1 second | Instant status transition (`expected` ➡️ `inside` ➡️ `checked_out`) across all 3 platforms | ✅ PASSED | Critical |
| **SYNC-002** | Cross-System | Emergency SOS Multi-Surface Broadcast | Resident triggers SOS in app | 1. Tap Emergency SOS in Resident App | Instant siren audio + modal alert triggered on Guard App and Admin Dashboard | Guard app received instant SOS alert with resident flat info | ✅ PASSED | Critical |
| **SYNC-003** | Cross-System | Complaint Resolution Sync | Resident raises complaint | 1. Resident creates plumbing complaint<br>2. Admin assigns and resolves ticket | Resident App status reflects `Resolved` live without manual refresh | Snapshot stream auto-updated resident screen in real-time | ✅ PASSED | High |
