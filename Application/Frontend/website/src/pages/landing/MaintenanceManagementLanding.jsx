import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';
import MaintenanceHeroSection from './maintenance_landing/MaintenanceHeroSection';
import MaintenanceRolesSection from './maintenance_landing/MaintenanceRolesSection';
import MaintenanceFeaturesGrid from './maintenance_landing/MaintenanceFeaturesGrid';
import MaintenanceWorkflowSection from './maintenance_landing/MaintenanceWorkflowSection';
import MaintenanceComparisonSection from './maintenance_landing/MaintenanceComparisonSection';
import MaintenanceLinksAndFaq from './maintenance_landing/MaintenanceLinksAndFaq';

export default function MaintenanceManagementLanding() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://gatelink.in/maintenance-management#webpage",
        "url": "https://gatelink.in/maintenance-management",
        "name": "Society Maintenance Billing & Accounting Software | GateLink",
        "description": "Maintenance billing software for housing societies. Automate recurring bills, UPI/card payments, GST invoices, overdue tracking, and payment records with GateLink.",
        "isPartOf": {
          "@id": "https://gatelink.in/#website"
        },
        "about": {
          "@id": "https://gatelink.in/maintenance-management#software"
        },
        "breadcrumb": {
          "@id": "https://gatelink.in/maintenance-management#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://gatelink.in/maintenance-management#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://gatelink.in/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Maintenance Management",
            "item": "https://gatelink.in/maintenance-management"
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://gatelink.in/maintenance-management#software",
        "name": "GateLink Maintenance Management Software",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, Android, iOS",
        "url": "https://gatelink.in/maintenance-management",
        "description": "Maintenance billing and payment management software for housing societies and RWAs, with recurring invoicing, online payments, GST tax invoices, overdue tracking, and payment records.",
        "author": {
          "@type": "Organization",
          "@id": "https://gatelink.in/#organization",
          "name": "GateLink Technologies Private Limited",
          "url": "https://gatelink.in"
        },
        "publisher": {
          "@type": "Organization",
          "@id": "https://gatelink.in/#organization",
          "name": "GateLink Technologies Private Limited",
          "url": "https://gatelink.in"
        },
        "featureList": [
          "Automated Multi-Component Invoicing",
          "Cashfree UPI & Card Payments",
          "GST Tax Invoices & Digital Receipts",
          "Overdue Dues & Defaulter Tracking",
          "Offline Cheque & NEFT Payment Recording",
          "Financial Payment History & Ledger Records"
        ]
      }
    ]
  };

  return (
    <div style={{ background: isDark ? '#020617' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SeoHead 
        title="Society Maintenance Billing & Accounting Software | GateLink" 
        description="Maintenance billing software for housing societies. Automate recurring bills, UPI/card payments, GST invoices, overdue tracking, and payment records with GateLink."
        canonicalUrl="https://gatelink.in/maintenance-management"
        schemaData={schemaData}
      />

      <Navbar />

      <MaintenanceHeroSection isDark={isDark} />

      <main style={{ flex: 1, padding: '60px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <MaintenanceRolesSection isDark={isDark} />
          <MaintenanceFeaturesGrid isDark={isDark} />
          <MaintenanceWorkflowSection isDark={isDark} />
          <MaintenanceComparisonSection isDark={isDark} />
          <MaintenanceLinksAndFaq isDark={isDark} />
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
