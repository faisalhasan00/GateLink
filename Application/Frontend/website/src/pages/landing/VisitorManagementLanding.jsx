import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';
import VisitorHeroSection from './visitor_landing/VisitorHeroSection';
import VisitorRolesSection from './visitor_landing/VisitorRolesSection';
import VisitorFeaturesGrid from './visitor_landing/VisitorFeaturesGrid';
import VisitorWorkflowSection from './visitor_landing/VisitorWorkflowSection';
import VisitorComparisonSection from './visitor_landing/VisitorComparisonSection';
import VisitorLinksAndFaq from './visitor_landing/VisitorLinksAndFaq';

export default function VisitorManagementLanding() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://gatelink.in/visitor-management#webpage",
        "url": "https://gatelink.in/visitor-management",
        "name": "Visitor Management System for Housing Societies | GateLink",
        "description": "Digital visitor management system for housing societies. Verify guest QR passes, approve visitors in real time, and track delivery and daily staff with GateLink.",
        "isPartOf": {
          "@id": "https://gatelink.in/#website"
        },
        "about": {
          "@id": "https://gatelink.in/visitor-management#software"
        },
        "breadcrumb": {
          "@id": "https://gatelink.in/visitor-management#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://gatelink.in/visitor-management#breadcrumb",
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
            "name": "Visitor Management System",
            "item": "https://gatelink.in/visitor-management"
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://gatelink.in/visitor-management#software",
        "name": "GateLink Visitor Management System",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, Android, iOS",
        "url": "https://gatelink.in/visitor-management",
        "description": "Digital visitor management system for apartment societies and gated communities in India. Pre-approve guests, track delivery personnel, and verify entry with QR passes.",
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
          "Pre-Approved QR & OTP Guest Passes",
          "Instant Resident Approval Notifications",
          "Delivery & Courier Entry Tracking",
          "Domestic Helper & Staff Attendance",
          "Multi-Gate Visitor Synchronization",
          "Vehicle Registration Logging",
          "Suspect & Blacklisted Visitor Alerts",
          "Guard-Side Visitor Verification",
          "Expected Guest Invitations"
        ]
      }
    ]
  };

  return (
    <div style={{ background: isDark ? '#020617' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SeoHead 
        title="Visitor Management System for Housing Societies | GateLink" 
        description="Digital visitor management system for housing societies. Verify guest QR passes, approve visitors in real time, and track delivery and daily staff with GateLink."
        canonicalUrl="https://gatelink.in/visitor-management"
        schemaData={schemaData}
      />

      <Navbar />

      <VisitorHeroSection isDark={isDark} />

      <main style={{ flex: 1, padding: '60px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <VisitorRolesSection isDark={isDark} />
          <VisitorFeaturesGrid isDark={isDark} />
          <VisitorWorkflowSection isDark={isDark} />
          <VisitorComparisonSection isDark={isDark} />
          <VisitorLinksAndFaq isDark={isDark} />
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
