import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CreditCard, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Bell, 
  Sparkles, 
  HelpCircle, 
  Wrench, 
  Megaphone, 
  Waves, 
  AlertTriangle, 
  ChevronDown, 
  Check 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';

export default function SocietyManagementLanding() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };

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

  const faqItems = [
    {
      q: "What is society management software and why do housing societies need it?",
      a: "Society management software is an integrated digital platform designed for apartment associations, housing societies, and Resident Welfare Associations (RWAs). It centralizes critical daily operations—such as resident directory management, online maintenance bill collections, visitor entry verification at security gates, complaint ticketing, and community broadcasts—into one cohesive system, eliminating error-prone paper logs and unorganized messaging groups."
    },
    {
      q: "How does GateLink simplify monthly maintenance bill collection?",
      a: "GateLink automates the entire maintenance cycle. Management committees can configure custom billing formulas (flat rates or area-based rates), generate itemized monthly invoices, and enable residents to pay securely online via UPI, credit/debit cards, and net banking with instant digital receipts. Treasurers gain real-time visibility into collection statuses, pending dues, and defaulter records."
    },
    {
      q: "How does GateLink secure society gates and handle visitors?",
      a: "GateLink equips security guards at the main gate with a dedicated mobile application. When guests, delivery agents, or service providers arrive, guards verify their entry via pre-approved QR passcodes or trigger real-time resident approval notifications. Residents can also pre-authorize expected visitors directly from their mobile app for zero-wait gate entry."
    },
    {
      q: "How do residents raise maintenance complaints and book society amenities?",
      a: "Residents can log maintenance complaints (such as plumbing, electrical, or general issues) directly through the resident application with photos and descriptions. The management committee can assign tickets to maintenance staff and track resolution statuses. Similarly, residents can view real-time availability and reserve society amenities like the clubhouse, party hall, or sports facilities without scheduling conflicts."
    },
    {
      q: "Who has access to the GateLink society management portal?",
      a: "GateLink features role-based access control tailored for all stakeholders in a gated community. RWA committee members and estate administrators manage accounting, directory records, and notices via the administrative dashboard; residents manage visitors, pay bills, and log requests via the resident app; and security staff operate the streamlined guard terminal at the gate."
    }
  ];

  return (
    <div style={{ background: isDark ? '#020617' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SeoHead 
        title="Society Management Software for Housing Societies & RWAs | GateLink" 
        description="All-in-one society management software for housing societies and RWAs. Automate maintenance billing, resident directories, visitor gate security, and complaints with GateLink."
        canonicalUrl="https://gatelink.in/society-management-software"
        schemaData={schemaData}
      />

      <Navbar />

      {/* Hero Section */}
      <header style={{ paddingTop: '130px', paddingBottom: '70px', background: isDark ? 'linear-gradient(180deg, #0F172A 0%, #020617 100%)' : 'linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%)', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(30, 58, 138, 0.12)', border: '1px solid rgba(30, 58, 138, 0.3)', color: '#0EA5E9', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
            <Sparkles size={14} /> Enterprise RWA Operating System
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', lineHeight: 1.18, marginBottom: '20px', maxWidth: '900px', margin: '0 auto 20px auto' }}>
            Smart Society Management Software for Housing Societies & RWAs
          </h1>

          <p style={{ fontSize: '17px', color: isDark ? '#94A3B8' : '#475569', maxWidth: '780px', margin: '0 auto 32px auto', lineHeight: 1.65 }}>
            Transform your Resident Welfare Association (RWA) operations with an integrated digital platform. Manage maintenance billing, visitor entry verification, resident registries, staff attendance, and facility bookings seamlessly.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/contact" 
              style={{ padding: '14px 28px', borderRadius: '12px', background: '#1E3A8A', color: '#FFFFFF', textDecoration: 'none', fontWeight: 800, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 6px 20px rgba(30, 58, 138, 0.35)' }}
            >
              <span>Get Free Society Proposal</span>
              <ArrowRight size={18} />
            </Link>

            <Link 
              to="/features" 
              style={{ padding: '14px 28px', borderRadius: '12px', background: isDark ? '#1E293B' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#0F172A', textDecoration: 'none', fontWeight: 700, fontSize: '15px', border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #CBD5E1' }}
            >
              Explore All Features
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main style={{ flex: 1, padding: '60px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Section 1: What is GateLink & Audience Overview */}
          <section style={{ marginBottom: '70px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '14px' }}>
                What is GateLink Society Management Software?
              </h2>
              <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '820px', margin: '0 auto', lineHeight: 1.7 }}>
                GateLink is a unified cloud-based operating system engineered specifically for residential gated communities, housing societies, and apartment associations across India. It bridges the communication and operational gap between management committee members, resident flat owners, tenants, and on-duty gate security guards.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '24px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', marginBottom: '14px' }}>
                  <Building2 size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For RWA Management Committees</h3>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                  Gain real-time financial oversight, automate monthly dues invoicing, track resolution of resident complaints, and broadcast verified official circulars without WhatsApp chaos.
                </p>
              </div>

              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '24px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(30, 58, 138, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E3A8A', marginBottom: '14px' }}>
                  <Users size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For Apartment Residents & Owners</h3>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                  Approve guest visits with one tap, pay maintenance fees securely online, book clubhouse amenities, and trigger instant emergency SOS sirens whenever assistance is required.
                </p>
              </div>

              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '24px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', marginBottom: '14px' }}>
                  <ShieldCheck size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For Gate Security Guards</h3>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                  Operate a straightforward tablet and mobile gatekeeper app for verifying delivery agents, scanning visitor passcodes, logging daily domestic helpers, and managing duty shifts.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Key Modules for RWA Management */}
          <section style={{ marginBottom: '70px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '12px' }}>
                Key Modules for RWA Management
              </h2>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '680px', margin: '0 auto' }}>
                GateLink replaces disjointed spreadsheets, paper registers, and manual tracking with dedicated modules built specifically for housing society administration.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
              {/* Module 1 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <Building2 size={26} color="#0EA5E9" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Resident & Property Directory</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '14px' }}>
                  Maintain a centralized database of flat owners, verified tenants, family members, and assigned parking slots. Manage occupancy records, flat handovers, and emergency contact details with role-based privacy controls.
                </p>
                <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
                  ✓ Flat-wise member roster & parking slot allocation
                </div>
              </div>

              {/* Module 2 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <CreditCard size={26} color="#0EA5E9" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Automated Maintenance Billing</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '14px' }}>
                  Generate automated monthly invoices, enable instant UPI and card payments with digital receipts, and track collection dues in real time. Learn more about our <Link to="/maintenance-management" style={{ color: '#0EA5E9', fontWeight: 700, textDecoration: 'none' }}>society maintenance billing software</Link>.
                </p>
                <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
                  ✓ Online payments, auto receipts & defaulter tracking
                </div>
              </div>

              {/* Module 3 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <ShieldCheck size={26} color="#0EA5E9" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Gate Security & Visitor Control</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '14px' }}>
                  Equip security staff with our digital gatekeeper terminal to verify guests, scan QR passes, and log deliveries. Explore our dedicated <Link to="/visitor-management" style={{ color: '#0EA5E9', fontWeight: 700, textDecoration: 'none' }}>visitor management system</Link> and <Link to="/security-management" style={{ color: '#0EA5E9', fontWeight: 700, textDecoration: 'none' }}>guard security app</Link>.
                </p>
                <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
                  ✓ QR guest passes, delivery verification & SOS sirens
                </div>
              </div>

              {/* Module 4 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <Wrench size={26} color="#0EA5E9" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Helpdesk & Complaint Ticketing</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '14px' }}>
                  Enable residents to register maintenance requests for plumbing, electrical, and general issues directly from their phone. Management committees can assign tickets to staff and monitor resolution status transparently.
                </p>
                <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
                  ✓ Ticket categorization, photo attachments & status updates
                </div>
              </div>

              {/* Module 5 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <Megaphone size={26} color="#0EA5E9" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Digital Notice Board & Broadcasts</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '14px' }}>
                  Publish official society announcements, meeting minutes, and maintenance schedules directly to resident mobile apps. Maintain an organized digital archive of society documents and circulars.
                </p>
                <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
                  ✓ Instant circular alerts & digital document repository
                </div>
              </div>

              {/* Module 6 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <Waves size={26} color="#0EA5E9" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Clubhouse & Amenity Booking</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '14px' }}>
                  Avoid booking conflicts for shared society amenities. Residents can view real-time slot availability and reserve the clubhouse, party hall, swimming pool, or sports courts with instant confirmation.
                </p>
                <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
                  ✓ Conflict-free slot scheduling & transparent guidelines
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Problem -> Solution Workflow */}
          <section style={{ marginBottom: '70px', background: isDark ? '#0F172A' : '#FFFFFF', padding: '40px 32px', borderRadius: '20px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>
                How GateLink Transforms Everyday Society Operations
              </h2>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
                Replacing traditional manual methods with digital automation creates accountability and clarity for every resident and committee member.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '20px', borderRadius: '12px', background: isDark ? '#020617' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '6px' }}>Before GateLink</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '6px' }}>Manual Paper Gate Registers</div>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>Slow visitor handwriting, unverified phone numbers, and illegible entry records.</p>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>With GateLink</div>
                <p style={{ fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 600, lineHeight: 1.5 }}>Digital QR passes, instant phone approvals, and searchable entry logs.</p>
              </div>

              <div style={{ padding: '20px', borderRadius: '12px', background: isDark ? '#020617' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '6px' }}>Before GateLink</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '6px' }}>Delayed Maintenance Collections</div>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>Manual cheque deposits, physical receipt writing, and unclear outstanding balances.</p>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>With GateLink</div>
                <p style={{ fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 600, lineHeight: 1.5 }}>Automated billing, instant UPI payments, and automated digital receipts.</p>
              </div>

              <div style={{ padding: '20px', borderRadius: '12px', background: isDark ? '#020617' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '6px' }}>Before GateLink</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '6px' }}>Disorganized Messaging Complaints</div>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>Complaints get lost in chat groups without accountability or progress tracking.</p>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>With GateLink</div>
                <p style={{ fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 600, lineHeight: 1.5 }}>Structured helpdesk ticketing with status updates and staff assignment.</p>
              </div>
            </div>
          </section>

          {/* Section 4: Specialized Modules Cluster Navigation */}
          <section style={{ background: isDark ? '#0F172A' : '#EFF6FF', padding: '36px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #DBEAFE', marginBottom: '70px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>
                Explore Specialized Platform Capabilities
              </h2>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '600px', margin: '0 auto' }}>
                Discover how each dedicated GateLink module streamlines specific areas of your apartment complex.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <Link to="/visitor-management" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#0EA5E9', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Visitor Management System</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/maintenance-management" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#0EA5E9', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Maintenance & Billing System</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/security-management" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#0EA5E9', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Guard & Security System</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/features" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#0EA5E9', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>All Platform Features</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          {/* Section 5: FAQ Section */}
          <section style={{ marginBottom: '70px' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0EA5E9', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                <HelpCircle size={16} /> Got Questions?
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>
                Frequently Asked Questions
              </h2>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
                Common questions about GateLink society management software for apartment complexes and RWAs.
              </p>
            </div>

            <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {faqItems.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div 
                    key={idx} 
                    style={{ 
                      background: isDark ? '#0F172A' : '#FFFFFF', 
                      borderRadius: '14px', 
                      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', 
                      overflow: 'hidden',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <button 
                      onClick={() => toggleFaq(idx)} 
                      style={{ 
                        width: '100%', 
                        padding: '20px 24px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        gap: '16px', 
                        background: 'transparent', 
                        border: 'none', 
                        cursor: 'pointer', 
                        textAlign: 'left' 
                      }}
                    >
                      <span style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', fontFamily: 'Manrope, sans-serif' }}>
                        {item.q}
                      </span>
                      <ChevronDown 
                        size={20} 
                        color="#0EA5E9" 
                        style={{ 
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                          transition: 'transform 0.2s ease', 
                          flexShrink: 0 
                        }} 
                      />
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 24px 20px 24px', fontSize: '14px', color: isDark ? '#94A3B8' : '#475569', lineHeight: 1.7, borderTop: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #F1F5F9', paddingTop: '14px' }}>
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 6: Bottom Call to Action */}
          <section style={{ background: isDark ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' : 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)', padding: '48px 32px', borderRadius: '24px', color: '#FFFFFF', textAlign: 'center', boxShadow: '0 16px 36px rgba(15, 23, 42, 0.25)' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: '#FFFFFF', marginBottom: '12px' }}>
              Modernize Your Housing Society with GateLink
            </h2>
            <p style={{ fontSize: '15px', color: '#CBD5E1', maxWidth: '640px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
              Join forward-thinking residential communities and management committees. Streamline dues billing, improve gate security, and foster transparent community living.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                to="/contact" 
                style={{ padding: '14px 28px', borderRadius: '12px', background: '#0EA5E9', color: '#FFFFFF', textDecoration: 'none', fontWeight: 800, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(14, 165, 233, 0.35)' }}
              >
                <span>Schedule a Free Demo</span>
                <ArrowRight size={18} />
              </Link>
              <Link 
                to="/features" 
                style={{ padding: '14px 28px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF', textDecoration: 'none', fontWeight: 700, fontSize: '15px', border: '1px solid rgba(255, 255, 255, 0.2)' }}
              >
                Browse All Modules
              </Link>
            </div>
          </section>

        </div>
      </main>

      <FooterSection />
    </div>
  );
}
