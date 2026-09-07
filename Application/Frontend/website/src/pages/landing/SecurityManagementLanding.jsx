import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';
import SecurityHeroSection from './security_landing/SecurityHeroSection';
import SecurityRolesSection from './security_landing/SecurityRolesSection';
import SecurityFeaturesGrid from './security_landing/SecurityFeaturesGrid';
import SecurityWorkflowSection from './security_landing/SecurityWorkflowSection';
import SecurityComparisonSection from './security_landing/SecurityComparisonSection';
import SecurityLinksAndFaq from './security_landing/SecurityLinksAndFaq';

export default function SecurityManagementLanding() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://gatelink.in/security-management#webpage",
        "url": "https://gatelink.in/security-management",
        "name": "Apartment Security Management & Guard App | GateLink",
        "description": "Apartment security management software for gated communities. Manage guard gate entry, QR/OTP verification, patrol checkpoints, SOS alerts, and vehicle logs with GateLink.",
        "isPartOf": {
          "@id": "https://gatelink.in/#website"
        },
        "about": {
          "@id": "https://gatelink.in/security-management#software"
        },
        "breadcrumb": {
          "@id": "https://gatelink.in/security-management#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://gatelink.in/security-management#breadcrumb",
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
            "name": "Security Management",
            "item": "https://gatelink.in/security-management"
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://gatelink.in/security-management#software",
        "name": "GateLink Security Management Software",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, Android, iOS",
        "url": "https://gatelink.in/security-management",
        "description": "Apartment security management software for gated communities that helps security teams manage gate verification, guard operations, patrol checkpoints, emergency alerts, vehicle logs, and multi-gate security records.",
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
          "Guard Mobile Gatekeeper App",
          "QR & OTP Gate Entry Verification",
          "Night Patrol & QR Checkpoint Tracking",
          "One-Touch Emergency SOS Siren Alerts",
          "Vehicle License Plate & Exit Logging",
          "Multi-Gate Cloud Synchronization"
        ]
      }
    ]
  };

  return (
    <div style={{ background: isDark ? '#020617' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SeoHead 
        title="Apartment Security Management & Guard App | GateLink" 
        description="Apartment security management software for gated communities. Manage guard gate entry, QR/OTP verification, patrol checkpoints, SOS alerts, and vehicle logs with GateLink."
        canonicalUrl="https://gatelink.in/security-management"
        schemaData={schemaData}
      />

      <Navbar />

      <SecurityHeroSection isDark={isDark} />

      <main style={{ flex: 1, padding: '60px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <SecurityRolesSection isDark={isDark} />
          <SecurityFeaturesGrid isDark={isDark} />
          <SecurityWorkflowSection isDark={isDark} />
          <SecurityComparisonSection isDark={isDark} />
          <SecurityLinksAndFaq isDark={isDark} />
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
