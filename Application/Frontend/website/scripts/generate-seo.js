import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

// Define metadata matrix for all public SEO routes
const SEO_ROUTES = [
  {
    path: '',
    title: 'GateLink – Smart Society Management Software for Gated Communities',
    description: 'GateLink is India’s intelligent society management operating system. Automate visitor entry, resident management, maintenance billing, gate security, parking, and complaints.',
    canonicalUrl: 'https://gatelink.in/',
    ogImage: 'https://gatelink.in/logo.png',
    schemaData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "GateLink",
      "alternateName": ["GateLink India", "GateLink Society Management"],
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web, Android, iOS",
      "url": "https://gatelink.in/",
      "author": {
        "@type": "Organization",
        "name": "GateLink Technologies Private Limited",
        "url": "https://gatelink.in/",
        "logo": "https://gatelink.in/logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-9121863117",
          "contactType": "customer service",
          "email": "support@gatelink.in",
          "areaServed": "IN"
        }
      },
      "description": "Smart Society Management Operating System for Gated Communities, RWAs, and Gate Security in India."
    }
  },
  {
    path: 'society-management-software',
    title: 'Society Management Software for Housing Societies & RWAs | GateLink',
    description: 'GateLink is India’s leading society management software. Streamline RWA administration, maintenance billing collections, resident registries, visitor entry, and gate security.',
    canonicalUrl: 'https://gatelink.in/society-management-software',
    ogImage: 'https://gatelink.in/logo.png',
    schemaData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "GateLink Society Management Software",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web, Android, iOS",
      "url": "https://gatelink.in/society-management-software",
      "description": "Complete society management software for housing societies and RWAs in India.",
      "author": {
        "@type": "Organization",
        "name": "GateLink Technologies Private Limited",
        "url": "https://gatelink.in"
      }
    }
  },
  {
    path: 'visitor-management',
    title: 'Visitor Management System for Housing Societies & Apartments | GateLink',
    description: 'GateLink Visitor Management System replaces manual paper registers with digital QR passes, real-time resident approval notifications, delivery staff tracking, and gate security automation.',
    canonicalUrl: 'https://gatelink.in/visitor-management',
    ogImage: 'https://gatelink.in/logo.png',
    schemaData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "GateLink Visitor Management System",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web, Android, iOS",
      "url": "https://gatelink.in/visitor-management",
      "description": "Digital visitor management system for apartment societies and gated communities in India.",
      "author": {
        "@type": "Organization",
        "name": "GateLink Technologies Private Limited",
        "url": "https://gatelink.in"
      }
    }
  },
  {
    path: 'maintenance-management',
    title: 'Society Maintenance Billing & Accounting Software | GateLink',
    description: 'GateLink automates housing society maintenance billing, UPI/Card online payments via Cashfree, automated WhatsApp receipts, GST invoice calculations, and default tracking.',
    canonicalUrl: 'https://gatelink.in/maintenance-management',
    ogImage: 'https://gatelink.in/logo.png',
    schemaData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "GateLink Society Maintenance & Billing Software",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web, Android, iOS",
      "url": "https://gatelink.in/maintenance-management",
      "description": "Automated maintenance billing software for housing societies and RWAs in India.",
      "author": {
        "@type": "Organization",
        "name": "GateLink Technologies Private Limited",
        "url": "https://gatelink.in"
      }
    }
  },
  {
    path: 'security-management',
    title: 'Apartment Security Management & Guard App | GateLink',
    description: 'GateLink Guard App empowers security guards with instant visitor verification, blacklisted entry alerts, emergency SOS panic buttons, and main gate access control.',
    canonicalUrl: 'https://gatelink.in/security-management',
    ogImage: 'https://gatelink.in/logo.png',
    schemaData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "GateLink Apartment Security & Guard App",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web, Android, iOS",
      "url": "https://gatelink.in/security-management",
      "description": "Smart gate security and guard management system for residential complexes and gated communities.",
      "author": {
        "@type": "Organization",
        "name": "GateLink Technologies Private Limited",
        "url": "https://gatelink.in"
      }
    }
  },
  {
    path: 'security',
    title: 'GateLink Security Center | Security & Trust',
    description: 'Learn how GateLink safeguards housing society data with 256-bit encryption, DPDP compliance, AWS cloud security, and zero unauthorized data access.',
    canonicalUrl: 'https://gatelink.in/security',
    ogImage: 'https://gatelink.in/logo.png'
  },
  {
    path: 'about',
    title: 'About GateLink - Smart Society Management Operating System',
    description: 'Learn about GateLink\'s mission to digitize 100,000+ housing societies across India with transparent RWA governance, automated billing, and smart gate security.',
    canonicalUrl: 'https://gatelink.in/about',
    ogImage: 'https://gatelink.in/logo.png'
  },
  {
    path: 'features',
    title: 'Features & Capabilities - GateLink Society OS',
    description: 'Explore all features of GateLink: digital gate passes, maintenance collection, amenity booking, RWA accounting, resident registry, and emergency panic sirens.',
    canonicalUrl: 'https://gatelink.in/features',
    ogImage: 'https://gatelink.in/logo.png'
  },
  {
    path: 'solutions',
    title: 'GateLink Solutions for Residents, Guards & RWAs',
    description: 'Tailored society management solutions for apartment residents, security gatekeepers, management committees, and multi-society builders in India.',
    canonicalUrl: 'https://gatelink.in/solutions',
    ogImage: 'https://gatelink.in/logo.png'
  },
  {
    path: 'contact',
    title: 'Contact Us & Book Demo - GateLink',
    description: 'Get in touch with GateLink team or schedule a free live demo for your housing society RWA committee. Experience smart gate security today.',
    canonicalUrl: 'https://gatelink.in/contact',
    ogImage: 'https://gatelink.in/logo.png'
  },
  {
    path: 'partners',
    title: 'Partner & Referral Program - GateLink Society OS',
    description: 'Join the GateLink Partner Program. Earn recurring revenue and referral rewards by introducing smart society management software to housing societies in your city.',
    canonicalUrl: 'https://gatelink.in/partners',
    ogImage: 'https://gatelink.in/logo.png'
  },
  {
    path: 'download',
    title: 'Download GateLink Apps - Resident & Security Guard',
    description: 'Download official GateLink Resident App and GateLink Guard App for Android and iOS. Manage visitor entries, pay maintenance bills, and receive gate alerts.',
    canonicalUrl: 'https://gatelink.in/download',
    ogImage: 'https://gatelink.in/logo.png'
  },
  {
    path: 'blog',
    title: 'GateLink Blog - Society Management, RWA Governance & Gate Security',
    description: 'Explore expert insights, housing society management guides, RWA accounting rules, visitor safety best practices, and community living tips.',
    canonicalUrl: 'https://gatelink.in/blog',
    ogImage: 'https://gatelink.in/logo.png'
  },
  {
    path: 'faq',
    title: 'Frequently Asked Questions (FAQ) - GateLink',
    description: 'Find answers to common questions about GateLink society management software, security guard app, maintenance bill payment, pricing, and onboarding.',
    canonicalUrl: 'https://gatelink.in/faq',
    ogImage: 'https://gatelink.in/logo.png'
  },
  {
    path: 'help',
    title: 'Help Center & Knowledge Base - GateLink',
    description: 'Access user guides, step-by-step documentation, and support resources for GateLink Resident App, Guard App, and Society Admin Dashboard.',
    canonicalUrl: 'https://gatelink.in/help',
    ogImage: 'https://gatelink.in/logo.png'
  },
  {
    path: 'docs',
    title: 'GateLink Platform Documentation & User Guides',
    description: 'Comprehensive documentation and API references for GateLink society management platform, RWA integration, and security guard workflows.',
    canonicalUrl: 'https://gatelink.in/docs',
    ogImage: 'https://gatelink.in/logo.png'
  },
  {
    path: 'privacy',
    title: 'Privacy Policy & DPDP Compliance - GateLink',
    description: 'GateLink Privacy Policy detailing data collection, encryption, DPDP compliance, and privacy rights for residents and society administration.',
    canonicalUrl: 'https://gatelink.in/privacy',
    ogImage: 'https://gatelink.in/logo.png'
  },
  {
    path: 'terms',
    title: 'Terms of Service & SaaS Agreement - GateLink',
    description: 'Terms of Service and SaaS Agreement governing the use of GateLink society management platform, mobile apps, and administrative services.',
    canonicalUrl: 'https://gatelink.in/terms',
    ogImage: 'https://gatelink.in/logo.png'
  },
  {
    path: 'refund-policy',
    title: 'Refund & Cancellation Policy - GateLink',
    description: 'GateLink Refund and Cancellation Policy for society maintenance billing transactions, subscription plans, and fee adjustments.',
    canonicalUrl: 'https://gatelink.in/refund-policy',
    ogImage: 'https://gatelink.in/logo.png'
  },
  {
    path: 'data-processing',
    title: 'Data Processing Agreement (DPA) - GateLink',
    description: 'GateLink Data Processing Agreement detailing tenant data isolation, subprocessor management, security controls, and privacy governance.',
    canonicalUrl: 'https://gatelink.in/data-processing',
    ogImage: 'https://gatelink.in/logo.png'
  },
  {
    path: 'grievance',
    title: 'Grievance Redressal Policy - GateLink',
    description: 'GateLink Grievance Redressal Mechanism and Officer contact details under Indian Information Technology and DPDP rules.',
    canonicalUrl: 'https://gatelink.in/grievance',
    ogImage: 'https://gatelink.in/logo.png'
  },
  {
    path: 'cookies',
    title: 'Cookie Policy - GateLink',
    description: 'GateLink Cookie Policy explaining essential cookies, local storage usage, and preferences on gatelink.in.',
    canonicalUrl: 'https://gatelink.in/cookies',
    ogImage: 'https://gatelink.in/logo.png'
  },
  // Published Blog Articles
  {
    path: 'blog/top-5-security-measures-every-indian-housing-society-must-implement-in-2026',
    title: 'Top 5 Security Measures Every Indian Housing Society Must Implement in 2026 | GateLink Blog',
    description: 'From 1-tap QR gate passes to emergency SOS siren alerts, discover how modern apartment complexes are eliminating gate queues and unauthorized entries.',
    canonicalUrl: 'https://gatelink.in/blog/top-5-security-measures-every-indian-housing-society-must-implement-in-2026',
    ogImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&auto=format&fit=crop&q=80',
    schemaData: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "Top 5 Security Measures Every Indian Housing Society Must Implement in 2026",
      "description": "From 1-tap QR gate passes to emergency SOS siren alerts, discover how modern apartment complexes are eliminating gate queues and unauthorized entries.",
      "image": "https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&auto=format&fit=crop&q=80",
      "datePublished": "2026-07-24",
      "author": {
        "@type": "Person",
        "name": "Mohammed Faisal Hasan"
      },
      "publisher": {
        "@type": "Organization",
        "name": "GateLink Technologies Private Limited",
        "logo": "https://gatelink.in/logo.png"
      }
    }
  },
  {
    path: 'blog/how-automated-maintenance-invoicing-online-gateway-boosts-collection-to-98',
    title: 'How Automated Maintenance Invoicing & Online Gateway Boosts Collection to 98%+ | GateLink Blog',
    description: 'Say goodbye to manual WhatsApp payment chasers. Learn how automated monthly invoicing and auto-reconciliation streamline society treasury ledgers.',
    canonicalUrl: 'https://gatelink.in/blog/how-automated-maintenance-invoicing-online-gateway-boosts-collection-to-98',
    ogImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80',
    schemaData: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "How Automated Maintenance Invoicing & Online Gateway Boosts Collection to 98%+",
      "description": "Say goodbye to manual WhatsApp payment chasers. Learn how automated monthly invoicing and auto-reconciliation streamline society treasury ledgers.",
      "image": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80",
      "datePublished": "2026-07-18",
      "author": {
        "@type": "Person",
        "name": "Priya Sharma"
      },
      "publisher": {
        "@type": "Organization",
        "name": "GateLink Technologies Private Limited",
        "logo": "https://gatelink.in/logo.png"
      }
    }
  },
  {
    path: 'blog/the-ultimate-guide-to-rwa-bylaw-compliance-digital-audit-vaults',
    title: 'The Ultimate Guide to RWA Bylaw Compliance & Digital Audit Vaults | GateLink Blog',
    description: 'Ensure your management committee stays 100% compliant with local state society registrar regulations using cloud audit logs and RBAC matrix controls.',
    canonicalUrl: 'https://gatelink.in/blog/the-ultimate-guide-to-rwa-bylaw-compliance-digital-audit-vaults',
    ogImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1200&auto=format&fit=crop&q=80',
    schemaData: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "The Ultimate Guide to RWA Bylaw Compliance & Digital Audit Vaults",
      "description": "Ensure your management committee stays 100% compliant with local state society registrar regulations using cloud audit logs and RBAC matrix controls.",
      "image": "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1200&auto=format&fit=crop&q=80",
      "datePublished": "2026-07-12",
      "author": {
        "@type": "Person",
        "name": "Anand Verma"
      },
      "publisher": {
        "@type": "Organization",
        "name": "GateLink Technologies Private Limited",
        "logo": "https://gatelink.in/logo.png"
      }
    }
  }
];

function injectSeoMetadata(html, route) {
  let result = html;

  // 1. Replace <title>
  if (route.title) {
    result = result.replace(/<title>[\s\S]*?<\/title>/i, `<title>${route.title}</title>`);
  }

  // 2. Replace meta name="description"
  if (route.description) {
    result = result.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${route.description}" />`);
  }

  // 3. Replace link rel="canonical"
  if (route.canonicalUrl) {
    result = result.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${route.canonicalUrl}" />`);
  }

  // 4. Replace OG Tags
  if (route.title) {
    result = result.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${route.title}" />`);
    result = result.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${route.title}" />`);
  }
  if (route.description) {
    result = result.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${route.description}" />`);
    result = result.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${route.description}" />`);
  }
  if (route.canonicalUrl) {
    result = result.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${route.canonicalUrl}" />`);
    result = result.replace(/<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:url" content="${route.canonicalUrl}" />`);
  }
  if (route.ogImage) {
    result = result.replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${route.ogImage}" />`);
    result = result.replace(/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${route.ogImage}" />`);
  }

  // 5. Replace / Inject JSON-LD Schema
  if (route.schemaData) {
    const schemaJson = JSON.stringify(route.schemaData);
    if (result.includes('<script type="application/ld+json">')) {
      result = result.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, `<script type="application/ld+json" id="seo-schema-jsonld">\n${schemaJson}\n</script>`);
    } else {
      result = result.replace('</head>', `<script type="application/ld+json" id="seo-schema-jsonld">\n${schemaJson}\n</script>\n</head>`);
    }
  }

  return result;
}

function main() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error('Error: dist/index.html template not found. Run vite build first.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  console.log(`Starting SEO Prerendering for ${SEO_ROUTES.length} routes...`);

  let prerenderedCount = 0;

  for (const route of SEO_ROUTES) {
    const preRenderedHtml = injectSeoMetadata(baseHtml, route);

    if (route.path === '') {
      // Root index.html
      fs.writeFileSync(TEMPLATE_PATH, preRenderedHtml, 'utf8');
      console.log(`[SSG] Processed Root '/' -> dist/index.html`);
    } else {
      // Sub-route dist/<path>/index.html
      const targetDir = path.join(DIST_DIR, route.path);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const targetFilePath = path.join(targetDir, 'index.html');
      fs.writeFileSync(targetFilePath, preRenderedHtml, 'utf8');
      console.log(`[SSG] Generated Route '/${route.path}' -> dist/${route.path}/index.html`);
    }
    prerenderedCount++;
  }

  console.log(`Successfully pre-rendered static HTML metadata for ${prerenderedCount} routes!`);
}

main();
