# 18. Backend Cloud Functions Architecture

## 1. Node.js Firebase Cloud Functions v2 Architecture (`Application/functions/index.js`)

```mermaid
flowchart LR
    FS[(Firestore Event)] -->|onDocumentCreated / Updated| CF[Cloud Function]
    CF -->|Fetch User Doc| USERS[(societies/{id}/users)]
    CF -->|Set In-App Notification| NOTIF[(societies/{id}/users/{uid}/notifications)]
    CF -->|Send FCM Push| FCM[Firebase Cloud Messaging]
    CF -->|Append Audit Log| AUDIT[(societies/{id}/audit_logs)]
```

---

## 2. Serverless Function Triggers

1. **`notifyResidentOnVisitorArrival`**: Triggers when a new visitor is created with `status == 'pending'`. Fetches resident `fcmToken`, writes in-app notification document, and dispatches high-priority push message.
2. **`notifyGuardOnVisitorDecision`**: Triggers when visitor status changes to `approved` or `rejected`. Writes audit trail entry to `audit_logs`.
3. **`notifyResidentOnAmenityBooking`**: Triggers on new amenity booking creation. Sends booking confirmation notification.
4. **`notifyResidentOnPaymentSuccess`**: Triggers when a maintenance bill changes to `paid`. Creates payment receipt notification and logs financial audit record.
5. **`notifyResidentOnComplaintUpdate`**: Triggers on ticket status or assignment changes. Dispatches push notification to complaint author.
