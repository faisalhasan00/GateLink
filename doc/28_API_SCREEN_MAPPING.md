# 28. API to Screen Traceability Mapping

| Application & Screen | User Action | API / Firestore Call | Target Database Entity |
| :--- | :--- | :--- | :--- |
| **Public Web (`DemoModal`)** | Click "Submit Demo Request" | `addDoc(collection(db, 'leads'))` | `/leads/{leadId}` |
| **Society Admin (`Residents`)** | Click "Approve Access" | `updateDoc(doc(db, 'societies/.../users', id))` | `societies/{id}/users/{uid}` |
| **Society Admin (`Maintenance`)**| Click "Generate Monthly Bill" | `setDoc(doc(db, 'societies/.../maintenance_bills', id))` | `societies/{id}/maintenance_bills/{id}` |
| **Super Admin (`CrmLeads`)** | Change Lead Stage dropdown | `updateDoc(doc(db, 'leads', leadId))` | `/leads/{leadId}` |
| **Mobile Resident (`Register`)** | Click "Create Account" | `AuthService.registerWithEmail()` | Firebase Auth & `/users/{uid}` |
| **Mobile Resident (`Visitors`)** | Click "Approve Visitor" | `updateDoc(doc(db, 'societies/.../visitors', id))` | `societies/{id}/visitors/{id}` |
| **Mobile Guard (`Gate Console`)** | Click "Check-In Visitor" | `addDoc(collection(db, 'societies/.../visitors'))` | `societies/{id}/visitors/{id}` |
