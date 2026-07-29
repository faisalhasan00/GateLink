import React, { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

import { ThemeProvider } from './context/ThemeContext'
import ScrollProgressBar from './components/ui/ScrollProgressBar'
import BackToTopButton from './components/ui/BackToTopButton'
import LiveChatWidget from './components/ui/LiveChatWidget'
import SkeletonLoader from './components/ui/SkeletonLoader'

import { getSocietyAdminSession, getSuperAdminSession } from './services/sessionManager'
import './index.css'

// Lazy Loaded Pages & Components
const Layout = lazy(() => import('./components/Layout'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Residents = lazy(() => import('./pages/Residents'))
const Visitors = lazy(() => import('./pages/Visitors'))
const Complaints = lazy(() => import('./pages/Complaints'))
const Amenities = lazy(() => import('./pages/Amenities'))
const Maintenance = lazy(() => import('./pages/Maintenance'))
const Documents = lazy(() => import('./pages/Documents'))
const Parking = lazy(() => import('./pages/Parking'))
const Notices = lazy(() => import('./pages/Notices'))
const Staff = lazy(() => import('./pages/Staff'))
const HelpersDeliveries = lazy(() => import('./pages/HelpersDeliveries'))
const EmergencySos = lazy(() => import('./pages/EmergencySos'))
const Reports = lazy(() => import('./pages/Reports'))
const Legal = lazy(() => import('./pages/Legal'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminProfile = lazy(() => import('./pages/AdminProfile'))

const SuperAdminLayout = lazy(() => import('./components/SuperAdminLayout'))
const SuperAdminDashboard = lazy(() => import('./pages/superadmin/SuperAdminDashboard'))
const SocietyManagement = lazy(() => import('./pages/superadmin/SocietyManagement'))
const CrmLeads = lazy(() => import('./pages/superadmin/CrmLeads'))
const AdCampaigns = lazy(() => import('./pages/superadmin/AdCampaigns'))
const SuperAdminProfile = lazy(() => import('./pages/superadmin/SuperAdminProfile'))
const SuperAdminLogin = lazy(() => import('./pages/superadmin/SuperAdminLogin'))

const LandingPage = lazy(() => import('./pages/landing/LandingPage'))
const AboutUsPage = lazy(() => import('./pages/landing/AboutUsPage'))
const FeaturesPage = lazy(() => import('./pages/landing/FeaturesPage'))
const SolutionsPage = lazy(() => import('./pages/landing/SolutionsPage'))
const EcosystemPage = lazy(() => import('./pages/landing/EcosystemPage'))
const PricingPage = lazy(() => import('./pages/landing/PricingPage'))
const LeadGenerationPage = lazy(() => import('./pages/landing/LeadGenerationPage'))
const DownloadAppPage = lazy(() => import('./pages/landing/DownloadAppPage'))
const BlogPage = lazy(() => import('./pages/landing/BlogPage'))
const FaqPage = lazy(() => import('./pages/landing/FaqPage'))
const HelpCenterPage = lazy(() => import('./pages/landing/HelpCenterPage'))
const DocsPage = lazy(() => import('./pages/landing/DocsPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/landing/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('./pages/landing/TermsPage'))
const CookiePolicyPage = lazy(() => import('./pages/landing/CookiePolicyPage'))

// Protected Route Handler
function ProtectedRoute({ user, children, loginPath = '/login', requireSuperAdmin = false }) {
  if (requireSuperAdmin) {
    const superSession = getSuperAdminSession();
    const isFirebaseSuperUser = user && user.email?.toLowerCase() === 'mohammedfaisalhasan@gmail.com';
    if (!superSession && !isFirebaseSuperUser) {
      return <Navigate to="/super-admin/login" replace />;
    }
  } else {
    const socSession = getSocietyAdminSession();
    if (!socSession && !user) {
      return <Navigate to={loginPath} replace />;
    }
  }
  return children;
}

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* Global Reading Scroll Progress Indicator Bar */}
        <ScrollProgressBar />

        {/* Suspense Loading Boundary with Skeleton Fallback */}
        <Suspense fallback={<SkeletonLoader />}>
          <Routes>
            {/* Public SaaS Landing, Features, Solutions, Ecosystem, Pricing & Lead Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/website" element={<LandingPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/ecosystem" element={<EcosystemPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<LeadGenerationPage />} />
            <Route path="/book-demo" element={<LeadGenerationPage />} />
            <Route path="/download" element={<DownloadAppPage />} />

            {/* SEO & Knowledge Base Pages */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiePolicyPage />} />

            {/* Public Login Pages */}
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/super-admin/login" element={<SuperAdminLogin />} />

            {/* Society Admin Routes (Protected) */}
            <Route path="/app" element={
              <ProtectedRoute user={user}>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="residents" element={<Residents />} />
              <Route path="visitors" element={<Visitors />} />
              <Route path="complaints" element={<Complaints />} />
              <Route path="amenities" element={<Amenities />} />
              <Route path="maintenance" element={<Maintenance />} />
              <Route path="documents" element={<Documents />} />
              <Route path="parking" element={<Parking />} />
              <Route path="notices" element={<Notices />} />
              <Route path="staff" element={<Staff />} />
              <Route path="helpers" element={<HelpersDeliveries />} />
              <Route path="sos" element={<EmergencySos />} />
              <Route path="reports" element={<Reports />} />
              <Route path="legal" element={<Legal />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>

            {/* Super Admin Routes (Protected) */}
            <Route path="/super-admin" element={
              <ProtectedRoute user={user} loginPath="/super-admin/login" requireSuperAdmin={true}>
                <SuperAdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<SuperAdminDashboard />} />
              <Route path="societies" element={<SocietyManagement />} />
              <Route path="crm" element={<CrmLeads />} />
              <Route path="ads" element={<AdCampaigns />} />
              <Route path="profile" element={<SuperAdminProfile />} />
            </Route>
          </Routes>
        </Suspense>

        {/* Global Floating Widgets */}
        <BackToTopButton />
        <LiveChatWidget />
      </BrowserRouter>
    </ThemeProvider>
  );
}
