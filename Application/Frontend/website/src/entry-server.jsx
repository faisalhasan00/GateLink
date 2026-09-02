import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Direct Page Component Imports for Server-Side Rendering
import LandingPage from './pages/landing/LandingPage';
import AboutUsPage from './pages/landing/AboutUsPage';
import FeaturesPage from './pages/landing/FeaturesPage';
import SolutionsPage from './pages/landing/SolutionsPage';
import LeadGenerationPage from './pages/landing/LeadGenerationPage';
import DownloadAppPage from './pages/landing/DownloadAppPage';
import BlogPage from './pages/landing/BlogPage';
import ArticleDetailPage from './pages/landing/ArticleDetailPage';
import FaqPage from './pages/landing/FaqPage';
import HelpCenterPage from './pages/landing/HelpCenterPage';
import DocsPage from './pages/landing/DocsPage';
import PrivacyPolicyPage from './pages/landing/PrivacyPolicyPage';
import AccountDeletionPage from './pages/landing/AccountDeletionPage';
import TermsPage from './pages/landing/TermsPage';
import CookiePolicyPage from './pages/landing/CookiePolicyPage';
import RefundPolicyPage from './pages/landing/RefundPolicyPage';
import DataProcessingPage from './pages/landing/DataProcessingPage';
import GrievancePolicyPage from './pages/landing/GrievancePolicyPage';
import PartnersPage from './pages/landing/PartnersPage';
import SocietyManagementLanding from './pages/landing/SocietyManagementLanding';
import VisitorManagementLanding from './pages/landing/VisitorManagementLanding';
import MaintenanceManagementLanding from './pages/landing/MaintenanceManagementLanding';
import SecurityManagementLanding from './pages/landing/SecurityManagementLanding';
import SecurityCenterPage from './pages/landing/SecurityCenterPage';
import NotFoundPage from './pages/landing/NotFoundPage';

export function render(url = '/') {
  return renderToString(
    <ThemeProvider>
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          {/* Public Marketing & Product Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/security" element={<SecurityCenterPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/contact" element={<LeadGenerationPage />} />
          <Route path="/download" element={<DownloadAppPage />} />
          <Route path="/partners" element={<PartnersPage />} />

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
          <Route path="/delete-account" element={<AccountDeletionPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookies" element={<CookiePolicyPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/data-processing" element={<DataProcessingPage />} />
          <Route path="/grievance" element={<GrievancePolicyPage />} />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );
}
