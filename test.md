# SocietySphere: Complete Feature & Testing Guide (Phases 1-8)

This document contains a detailed breakdown of all features implemented across both the **Guard App** and the **Resident App**, along with specific step-by-step test flows.

---

## 🏗️ Phases 1-4: Core Foundation & Manual Visitor Flow
**Overview:** We set up Firebase Authentication, Firestore databases, and the core Guard-to-Resident communication loop for unexpected visitors.

### Feature: Manual Visitor Entry (Guard to Resident)
When a delivery person or guest arrives unannounced, the guard enters their details, and the resident approves or denies them.

**Test Flow:**
1. **[Guard App]** Open the app and tap the **"+" (Add Visitor)** floating button.
2. **[Guard App]** Enter details: Name (e.g., "Amazon Delivery"), Phone, Purpose ("Delivery"), and Flat Number ("101").
3. **[Guard App]** Tap **Log Visitor**. The visitor will appear on the Guard Dashboard with a **yellow "Pending"** status.
4. **[Resident App]** Open the app. Look at the Dashboard under **"Pending Visitor Approvals"**.
5. **[Resident App]** The "Amazon Delivery" visitor will appear there in real-time. Tap **Approve**.
6. **[Guard App]** Look back at the Guard Dashboard. The visitor's status will instantly change to **green "Inside"**, instructing the guard to let them in!

---

## 🔔 Phase 5: Push Notifications
**Overview:** Local push notifications were added to alert residents even if they aren't actively staring at the app.

### Feature: Real-time Heads-up Alerts
When a guard logs a visitor, the resident gets a phone notification.

**Test Flow:**
1. **[Resident App]** Ensure the app is installed and notification permissions were granted on startup. You can minimize the app or leave it open.
2. **[Guard App]** Log a new visitor manually (just like in Phase 1-4).
3. **[Resident Phone]** A push notification will immediately pop up at the top of your screen saying: *"New Visitor: [Name] is waiting at the gate for [Purpose]"*.
4. **[Resident Phone]** Tap the notification to open the app and approve them.

---

## 📷 Phase 6: QR Gate Passes
**Overview:** Residents can pre-invite guests, generating a QR code that the guard scans for instant, frictionless entry.

### Feature: Pre-Inviting & Scanning
**Test Flow:**
1. **[Resident App]** Open the app and tap **Invite Visitor** (from Quick Actions or the floating button in the Visitors tab).
2. **[Resident App]** Enter the guest's details (e.g., "Uncle John") and tap **Generate Visitor Pass**.
3. **[Resident App]** A QR Code will pop up on your screen. (Keep this screen open, or take a screenshot).
4. **[Guard App]** Open the app and tap the **Scan QR** button on the dashboard.
5. **[Guard App]** Point your phone's camera at the QR code displayed on the Resident App.
6. **[Guard App]** The app will instantly read the database, verify the code, and pop up a bottom sheet with Uncle John's details.
7. **[Guard App]** Tap **ALLOW ENTRY**. The visitor is now checked in!

---

## 📢 Phase 7: Notice Board & Complaints
**Overview:** Society management tools for broadcasting information and handling resident issues.

### Feature A: Notice Board
**Test Flow:**
1. **[Resident App]** Open the Dashboard.
2. **[Resident App]** Scroll down to **Recent Notices**. You will see the "Welcome to SocietySphere" notice (which was seeded automatically).
3. **[Resident App]** Tap **View All** to see the dedicated Notice Board screen, where notices are categorized (Important, Event, General).

### Feature B: Complaints Helpdesk
**Test Flow:**
1. **[Resident App]** Tap **Raise Complaint** from the Quick Actions grid.
2. **[Resident App]** Select a category (e.g., "Plumbing").
3. **[Resident App]** Enter a Title ("Leaking pipe") and Description ("Water leaking under kitchen sink"). Select "High" priority.
4. **[Resident App]** Tap **Submit Complaint**.
5. **[Resident App]** You will be redirected to the "My Complaints" screen, and your new complaint will instantly appear in the **Open** tab!

---

## 🏊 Phase 8: Amenities Booking
**Overview:** A booking system for residents to reserve time slots for common society facilities.

### Feature: Reserving an Amenity
**Test Flow:**
1. **[Resident App]** Tap **Book Amenity** from the Quick Actions grid on the Dashboard.
2. **[Resident App]** If the screen says "No amenities available", tap the temporary **Seed Amenities (Test)** button to populate the database.
3. **[Resident App]** The Swimming Pool and Fitness Center will appear. Tap **Book** next to the Swimming Pool.
4. **[Resident App]** Tap the calendar to select a date.
5. **[Resident App]** Tap an available time slot (e.g., "7:00 AM"). Note that booked slots will be greyed out.
6. **[Resident App]** Increase the Guest count to 2, then tap **Confirm Booking**.
7. **[Resident App]** A success screen appears. Tap **View My Bookings** to see your confirmed reservation in the system.
