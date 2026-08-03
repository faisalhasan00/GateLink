# 21. Authentication Architecture & Identity Flows

## Authentication Flow Diagrams

### Resident Mobile Sign-In & Onboarding

```mermaid
sequenceDiagram
    autonumber
    actor Resident
    participant MobileApp as Resident App
    participant FA as Firebase Auth
    participant FS as Firestore Database

    Resident->>MobileApp: Enter Email, Password, Society Code (SOC-001)
    MobileApp->>FS: Verify Society Code exists in /societies
    MobileApp->>FA: createUserWithEmailAndPassword()
    FA-->>MobileApp: Return Auth Credential (uid)
    MobileApp->>FS: Write profile to societies/SOC-001/users/{uid} (status: pending_approval)
    MobileApp->>FS: Write global index to /users/{uid}
    MobileApp->>MobileApp: Router locks user on PendingApprovalScreen
```

---

### Society Admin Login Flow

1. Admin submits credentials on `/login` page of Society Admin Panel.
2. Web app authenticates user with Firebase Auth (`signInWithEmailAndPassword`).
3. Queries `societies` collection where `adminEmail == user.email` to resolve matching `societyId`.
4. Saves `societyId` in `sessionManager.js` and initializes dashboard views.
