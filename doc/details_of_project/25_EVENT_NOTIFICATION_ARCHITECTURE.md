# 25. Event & Notification Architecture

## Event Dispatch Matrix

| System Event | Event Producer | Event Consumer | Notification Medium | Data Payload |
| :--- | :--- | :--- | :--- | :--- |
| **Visitor Arrival** | Guard App | Resident App | FCM Push & In-App Doc | `visitorId`, `hostFlat`, `societyId` |
| **Visitor Decision**| Resident App | Guard App / Audit Log | Real-time Firestore & Audit Log | `status`, `approvedBy`, `visitorId` |
| **Amenity Booking** | Resident App | Resident App | FCM Push & In-App Doc | `bookingId`, `amenityName`, `timeSlot` |
| **Bill Payment** | Admin / Resident App | Resident App / Audit Log | FCM Receipt Push & Audit Log | `billId`, `amount`, `transactionId` |
| **Complaint Update**| Admin Panel | Resident App | FCM Push & In-App Doc | `complaintId`, `status`, `assignedTo` |
