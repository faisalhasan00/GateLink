# 22. Authorization Architecture & RBAC Layers

## 1. Authorization Enforcement Layers

```
Client UI Level (Route Guards in React / GoRouter in Flutter)
        │
        ▼
Service Layer (AuthService / SessionManager)
        │
        ▼
Database Level (Firestore Security Rules in firestore.rules)
```

---

## 2. Resource Access Control Rules

- **Resident Access Limit**: A resident can only read/modify visitor records for their specific `flatNumber` and complaints authored by their `uid`.
- **Guard Access Limit**: Security guards can log new walk-in visitors and update entry/exit status for their assigned society. They cannot access financial bills or audit logs.
- **Admin Access Limit**: Society Admins can approve resident registrations, generate bills, assign staff, and read audit logs within their assigned `societyId`.
- **Super Admin Access**: Full system access to `/leads`, `/societies`, and platform settings.
