# 07. API Reference & Services Catalog

## Firebase Cloud Functions v2 Endpoints (`Application/functions/index.js`)

### 1. `notifyResidentOnVisitorArrival`
- **Trigger**: Firestore Document Creation on `societies/{societyId}/visitors/{visitorId}`
- **Condition**: Executes if `visitor.status == 'pending'`
- **Actions**:
  1. Queries residents registered to `visitor.hostFlat`.
  2. Creates in-app notification document under `societies/{id}/users/{uid}/notifications`.
  3. Dispatches high-priority FCM Push Notification payload to resident device token (`fcmToken`).

### 2. `notifyGuardOnVisitorDecision`
- **Trigger**: Firestore Document Update on `societies/{societyId}/visitors/{visitorId}`
- **Condition**: Executes if `beforeData.status != afterData.status`
- **Actions**:
  1. Writes immutable audit log entry to `societies/{id}/audit_logs` (`action: VISITOR_APPROVED / REJECTED`).

### 3. `notifyResidentOnAmenityBooking`
- **Trigger**: Firestore Document Creation on `societies/{societyId}/amenity_bookings/{bookingId}`
- **Actions**: Creates booking confirmation in-app notification and dispatches FCM push notification.

### 4. `notifyResidentOnPaymentSuccess`
- **Trigger**: Firestore Document Update on `societies/{societyId}/maintenance_bills/{billId}`
- **Condition**: Executes when status changes to `'paid'`.
- **Actions**: Writes payment audit log, creates in-app notification, and dispatches FCM receipt notification.

### 5. `notifyResidentOnComplaintUpdate`
- **Trigger**: Firestore Document Update on `societies/{societyId}/complaints/{complaintId}`
- **Actions**: Logs ticket status change audit entry and dispatches FCM notification to ticket author.
