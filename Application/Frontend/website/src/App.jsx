import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { ThemeProvider } from './context/ThemeContext'
import ScrollProgressBar from './components/ui/ScrollProgressBar'
import BackToTopButton from './components/ui/BackToTopButton'
import LiveChatWidget from './components/ui/LiveChatWidget'
import SkeletonLoader from './components/ui/SkeletonLoader'

import './index.css'

// Lazy Loaded Marketing & SaaS Website Pages
const LandingPage = lazy(() => import('./pages/landing/LandingPage'))
const AboutUsPage = lazy(() => import('./pages/landing/AboutUsPage'))
const FeaturesPage = lazy(() => import('./pages/landing/FeaturesPage'))
const SolutionsPage = lazy(() => import('./pages/landing/SolutionsPage'))
const LeadGenerationPage = lazy(() => import('./pages/landing/LeadGenerationPage'))
const DownloadAppPage = lazy(() => import('./pages/landing/DownloadAppPage'))
const BlogPage = lazy(() => import('./pages/landing/BlogPage'))
const ArticleDetailPage = lazy(() => import('./pages/landing/ArticleDetailPage'))
const FaqPage = lazy(() => import('./pages/landing/FaqPage'))
const HelpCenterPage = lazy(() => import('./pages/landing/HelpCenterPage'))
const DocsPage = lazy(() => import('./pages/landing/DocsPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/landing/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('./pages/landing/TermsPage'))
const CookiePolicyPage = lazy(() => import('./pages/landing/CookiePolicyPage'))
const RefundPolicyPage = lazy(() => import('./pages/landing/RefundPolicyPage'))
const DataProcessingPage = lazy(() => import('./pages/landing/DataProcessingPage'))
const GrievancePolicyPage = lazy(() => import('./pages/landing/GrievancePolicyPage'))
const PartnersPage = lazy(() => import('./pages/landing/PartnersPage'))
const GateSelfEntryPage = lazy(() => import('./pages/gate/GateSelfEntryPage'))

// Dedicated Product SEO Landing Pages
const SocietyManagementLanding = lazy(() => import('./pages/landing/SocietyManagementLanding'))
const VisitorManagementLanding = lazy(() => import('./pages/landing/VisitorManagementLanding'))
const MaintenanceManagementLanding = lazy(() => import('./pages/landing/MaintenanceManagementLanding'))
const SecurityManagementLanding = lazy(() => import('./pages/landing/SecurityManagementLanding'))
const SecurityCenterPage = lazy(() => import('./pages/landing/SecurityCenterPage'))
const NotFoundPage = lazy(() => import('./pages/landing/NotFoundPage'))

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* Global Reading Scroll Progress Indicator Bar */}
        <ScrollProgressBar />

        {/* Suspense Loading Boundary */}
        <Suspense fallback={<SkeletonLoader />}>
          <Routes>
            {/* Public SaaS Landing & Product Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/security" element={<SecurityCenterPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/contact" element={<LeadGenerationPage />} />
            <Route path="/book-demo" element={<LeadGenerationPage />} />
            <Route path="/download" element={<DownloadAppPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/refer" element={<PartnersPage />} />
            <Route path="/gate" element={<GateSelfEntryPage />} />

            {/* Dedicated High-Value Feature SEO Landing Pages */}
            <Route path="/society-management-software" element={<SocietyManagementLanding />} />
            <Route path="/visitor-management" element={<VisitorManagementLanding />} />
            <Route path="/maintenance-management" element={<MaintenanceManagementLanding />} />
            <Route path="/security-management" element={<SecurityManagementLanding />} />

            {/* SEO Knowledge Base & Legal Trust Pages */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<ArticleDetailPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiePolicyPage />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />
            <Route path="/refunds" element={<RefundPolicyPage />} />
            <Route path="/data-processing" element={<DataProcessingPage />} />
            <Route path="/dpa" element={<DataProcessingPage />} />
            <Route path="/grievance" element={<GrievancePolicyPage />} />
            <Route path="/grievance-redressal" element={<GrievancePolicyPage />} />

            {/* 404 Catch-All Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>

        {/* Global Floating Widgets */}
        <BackToTopButton />
        <LiveChatWidget />
      </BrowserRouter>
    </ThemeProvider>
  );
}
