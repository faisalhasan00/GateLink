import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { SuperAdminAuthProvider, useSuperAdminAuth } from './context/SuperAdminAuthContext'
import SkeletonLoader from './components/ui/SkeletonLoader'
import { ShieldAlert } from 'lucide-react'
import './index.css'

// Lazy Loaded Super Admin Pages & Layouts
const SuperAdminLayout = lazy(() => import('./components/SuperAdminLayout'))
const SuperAdminDashboard = lazy(() => import('./pages/superadmin/SuperAdminDashboard'))
const SocietyManagement = lazy(() => import('./pages/superadmin/SocietyManagement'))
const CrmLeads = lazy(() => import('./pages/superadmin/CrmLeads'))
const AdCampaigns = lazy(() => import('./pages/superadmin/AdCampaigns'))
const PartnerLeads = lazy(() => import('./pages/superadmin/PartnerLeads'))
const SuperAdminProfile = lazy(() => import('./pages/superadmin/SuperAdminProfile'))
const SuperAdminLogin = lazy(() => import('./pages/superadmin/SuperAdminLogin'))
const PushNotifications = lazy(() => import('./pages/superadmin/PushNotifications'))
const TeamManagement = lazy(() => import('./pages/superadmin/TeamManagement'))
const CmsArticles = lazy(() => import('./pages/superadmin/CmsArticles'))
const CmsArticleEditor = lazy(() => import('./pages/superadmin/CmsArticleEditor'))
const CmsCategories = lazy(() => import('./pages/superadmin/CmsCategories'))
const CmsMedia = lazy(() => import('./pages/superadmin/CmsMedia'))

function ProtectedSuperRoute({ children }) {
  const { user, loading } = useSuperAdminAuth();

  if (loading) return <SkeletonLoader />;

  if (!user || !user.email) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PermissionGuard({ permission, children }) {
  const { hasPermission, isMasterAdmin } = useSuperAdminAuth();

  if (isMasterAdmin || hasPermission(permission)) {
    return children;
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '60px auto',
      textAlign: 'center',
      padding: '40px',
      backgroundColor: 'var(--surface-color)',
      borderRadius: '16px',
      border: '1px solid var(--border-color)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: '#EF4444',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px'
      }}>
        <ShieldAlert size={32} />
      </div>
      <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
        Access Restricted
      </h2>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
        Your staff account does not have permission to view or manage this module. Please contact the Master Super Administrator to request access.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SuperAdminAuthProvider>
        <BrowserRouter>
          <Suspense fallback={<SkeletonLoader />}>
            <Routes>
              {/* Public Login Route */}
              <Route path="/login" element={<SuperAdminLogin />} />

              {/* Protected Super Admin Dashboard Routes */}
              <Route path="/" element={
                <ProtectedSuperRoute>
                  <SuperAdminLayout />
                </ProtectedSuperRoute>
              }>
                <Route index element={
                  <PermissionGuard permission="overview">
                    <SuperAdminDashboard />
                  </PermissionGuard>
                } />
                <Route path="societies" element={
                  <PermissionGuard permission="societies">
                    <SocietyManagement />
                  </PermissionGuard>
                } />
                <Route path="crm" element={
                  <PermissionGuard permission="crm">
                    <CrmLeads />
                  </PermissionGuard>
                } />
                <Route path="partners" element={
                  <PermissionGuard permission="partners">
                    <PartnerLeads />
                  </PermissionGuard>
                } />
                <Route path="ads" element={
                  <PermissionGuard permission="ads">
                    <AdCampaigns />
                  </PermissionGuard>
                } />
                <Route path="notifications" element={
                  <PermissionGuard permission="notifications">
                    <PushNotifications />
                  </PermissionGuard>
                } />
                <Route path="team" element={
                  <PermissionGuard permission="team">
                    <TeamManagement />
                  </PermissionGuard>
                } />

                {/* CMS & Content Management Routes */}
                <Route path="cms" element={
                  <PermissionGuard permission="content.view">
                    <CmsArticles />
                  </PermissionGuard>
                } />
                <Route path="cms/editor" element={
                  <PermissionGuard permission="content.view">
                    <CmsArticleEditor />
                  </PermissionGuard>
                } />
                <Route path="cms/editor/:articleId" element={
                  <PermissionGuard permission="content.view">
                    <CmsArticleEditor />
                  </PermissionGuard>
                } />
                <Route path="cms/categories" element={
                  <PermissionGuard permission="content.categories">
                    <CmsCategories />
                  </PermissionGuard>
                } />
                <Route path="cms/media" element={
                  <PermissionGuard permission="content.media">
                    <CmsMedia />
                  </PermissionGuard>
                } />

                <Route path="profile" element={<SuperAdminProfile />} />

                {/* Path Aliases for /super-admin/* routes */}
                <Route path="super-admin" element={
                  <PermissionGuard permission="overview">
                    <SuperAdminDashboard />
                  </PermissionGuard>
                } />
                <Route path="super-admin/societies" element={
                  <PermissionGuard permission="societies">
                    <SocietyManagement />
                  </PermissionGuard>
                } />
                <Route path="super-admin/crm" element={
                  <PermissionGuard permission="crm">
                    <CrmLeads />
                  </PermissionGuard>
                } />
                <Route path="super-admin/partners" element={
                  <PermissionGuard permission="partners">
                    <PartnerLeads />
                  </PermissionGuard>
                } />
                <Route path="super-admin/ads" element={
                  <PermissionGuard permission="ads">
                    <AdCampaigns />
                  </PermissionGuard>
                } />
                <Route path="super-admin/notifications" element={
                  <PermissionGuard permission="notifications">
                    <PushNotifications />
                  </PermissionGuard>
                } />
                <Route path="super-admin/team" element={
                  <PermissionGuard permission="team">
                    <TeamManagement />
                  </PermissionGuard>
                } />
                <Route path="super-admin/cms" element={
                  <PermissionGuard permission="content.view">
                    <CmsArticles />
                  </PermissionGuard>
                } />
                <Route path="super-admin/cms/editor" element={
                  <PermissionGuard permission="content.view">
                    <CmsArticleEditor />
                  </PermissionGuard>
                } />
                <Route path="super-admin/cms/editor/:articleId" element={
                  <PermissionGuard permission="content.view">
                    <CmsArticleEditor />
                  </PermissionGuard>
                } />
                <Route path="super-admin/cms/categories" element={
                  <PermissionGuard permission="content.categories">
                    <CmsCategories />
                  </PermissionGuard>
                } />
                <Route path="super-admin/cms/media" element={
                  <PermissionGuard permission="content.media">
                    <CmsMedia />
                  </PermissionGuard>
                } />
                <Route path="super-admin/profile" element={<SuperAdminProfile />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </SuperAdminAuthProvider>
    </ThemeProvider>
  );
}
