# 30. Code Location & File Reference Map

| Feature Module | Primary Source Files |
| :--- | :--- |
| **Authentication & Registration** | `Application/mobile/lib/core/services/auth_service.dart`<br/>`Application/mobile/lib/core/providers/auth_providers.dart`<br/>`Application/society_admin/src/pages/AdminLogin.jsx`<br/>`Application/super_admin/src/pages/superadmin/SuperAdminLogin.jsx` |
| **Multi-Tenant Security Rules** | `Application/firestore.rules` |
| **Visitor Gate Management** | `Application/mobile/lib/features/visitors/`<br/>`Application/society_admin/src/pages/Visitors.jsx`<br/>`Application/functions/index.js` (line 12) |
| **Resident Directory & Approvals** | `Application/society_admin/src/pages/Residents.jsx`<br/>`Application/mobile/lib/features/auth/presentation/screens/pending_approval_screen.dart` |
| **Helpdesk & Complaints** | `Application/society_admin/src/pages/Complaints.jsx`<br/>`Application/functions/index.js` (line 250) |
| **Maintenance & Billing** | `Application/society_admin/src/pages/Maintenance.jsx`<br/>`Application/functions/index.js` (line 184) |
| **Amenity Booking** | `Application/society_admin/src/pages/Amenities.jsx`<br/>`Application/functions/index.js` (line 131) |
| **Super Admin CRM & Society Management**| `Application/super_admin/src/pages/superadmin/SuperAdminDashboard.jsx`<br/>`Application/super_admin/src/pages/superadmin/CrmLeads.jsx`<br/>`Application/super_admin/src/pages/superadmin/SocietyManagement.jsx` |
| **Public Lead Generation** | `Application/website/src/components/DemoModal.jsx`<br/>`Application/website/src/pages/LeadGenerationPage.jsx` |
