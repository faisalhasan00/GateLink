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
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/ecosystem" element={<EcosystemPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<LeadGenerationPage />} />
            <Route path="/book-demo" element={<LeadGenerationPage />} />
            <Route path="/download" element={<DownloadAppPage />} />

            {/* SEO Knowledge Base & Legal Pages */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiePolicyPage />} />
          </Routes>
        </Suspense>

        {/* Global Floating Widgets */}
        <BackToTopButton />
        <LiveChatWidget />
      </BrowserRouter>
    </ThemeProvider>
  );
}
