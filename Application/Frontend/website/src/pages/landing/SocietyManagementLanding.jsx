import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';
import SocietyHeroSection from './society_landing/SocietyHeroSection';
import SocietyRolesSection from './society_landing/SocietyRolesSection';
import SocietyModulesGrid from './society_landing/SocietyModulesGrid';
import SocietyComparisonSection from './society_landing/SocietyComparisonSection';
import SocietyLinksAndFaq from './society_landing/SocietyLinksAndFaq';

export default function SocietyManagementLanding() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://gatelink.in/society-management-software#webpage",
        "url": "https://gatelink.in/society-management-software",
        "name": "Society Management Software for Housing Societies & RWAs | GateLink",
        "description": "All-in-one society management software for housing societies and RWAs. Automate maintenance billing, resident directories, visitor gate security, and complaints with GateLink.",
        "isPartOf": {
          "@id": "https://gatelink.in/#website"
        },
        "about": {
          "@id": "https://gatelink.in/society-management-software#software"
        },
        "breadcrumb": {
          "@id": "https://gatelink.in/society-management-software#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://gatelink.in/society-management-software#breadcrumb",
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
            "name": "Society Management Software",
            "item": "https://gatelink.in/society-management-software"
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://gatelink.in/society-management-software#software",
        "name": "GateLink Society Management Software",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, Android, iOS",
        "url": "https://gatelink.in/society-management-software",
        "description": "Complete society management software for housing societies and RWAs in India.",
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
          "Resident & Property Directory",
          "Automated Maintenance Billing",
          "Gate Security & Visitor Control",
          "Helpdesk & Complaint Ticketing",
          "Digital Notice Board & Broadcasts",
          "Clubhouse & Amenity Booking"
        ]
      }
    ]
  };

  return (
    <div style={{ background: isDark ? '#020617' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SeoHead 
        title="Society Management Software for Housing Societies & RWAs | GateLink" 
        description="All-in-one society management software for housing societies and RWAs. Automate maintenance billing, resident directories, visitor gate security, and complaints with GateLink."
        canonicalUrl="https://gatelink.in/society-management-software"
        schemaData={schemaData}
      />

      <Navbar />

      <SocietyHeroSection isDark={isDark} />

      <main style={{ flex: 1, padding: '60px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <SocietyRolesSection isDark={isDark} />
          <SocietyModulesGrid isDark={isDark} />
          <SocietyComparisonSection isDark={isDark} />
          <SocietyLinksAndFaq isDark={isDark} />
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
