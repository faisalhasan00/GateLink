import React, { useState } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  Smartphone, 
  BellRing, 
  ArrowRight, 
  CheckCircle2, 
  UserCheck, 
  Lock, 
  Sparkles, 
  Car, 
  UserX, 
  HelpCircle, 
  ChevronDown, 
  Truck, 
  Users, 
  Building2, 
  Check 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';

export default function VisitorManagementLanding() {
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

  const faqItems = [
    {
      q: "How does a visitor management system work in an apartment society?",
      a: "A visitor management system replaces manual paper logbooks with a connected mobile workflow. Residents generate pre-approved QR passcodes or receive real-time push notifications when unexpected visitors arrive. Main gate security guards use a dedicated terminal app to verify the visitor's details, scan the QR code or passcode, log entry timestamps, and record vehicle numbers before allowing entry."
    },
    {
      q: "How can residents approve or invite visitors?",
      a: "Residents can pre-create digital visitor invitations directly within the GateLink resident app by entering the guest's name, phone number, and visit date. The app generates a secure QR code and 6-digit OTP passcode that can be shared via WhatsApp. When unannounced guests arrive, the guard enters their flat number, triggering an immediate approval notification on the resident's phone."
    },
    {
      q: "How are delivery and courier staff recorded at the gate?",
      a: "Security guards use a fast-track delivery logging screen on the guard terminal. Guards select the delivery partner (such as Swiggy, Zomato, Amazon, or courier services), record the flat destination, and log the delivery personnel's details. Residents receive an automated entry alert notifying them that their package or delivery is on its way."
    },
    {
      q: "Can GateLink track domestic helpers and daily staff?",
      a: "Yes. GateLink maintains dedicated profiles for daily staff including domestic maids, drivers, cooks, and tutors. When daily staff arrive at the gate, guards verify their unique passcode or entry record. The system records real-time check-in and check-out timestamps and sends an instant notification to all associated resident flats."
    },
    {
      q: "Can visitor activity be synchronized across multiple gates?",
      a: "Yes. GateLink synchronizes visitor entry and exit data in real time across all society gates using secure cloud infrastructure. If a visitor enters through Gate 1 and exits through Gate 2, guards at all terminal locations have instant visibility into active visitor sessions, parking allocations, and exit timestamps."
    }
  ];

  return (
    <div style={{ background: isDark ? '#020617' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SeoHead 
        title="Visitor Management System for Housing Societies | GateLink" 
        description="Digital visitor management system for housing societies. Verify guest QR passes, approve visitors in real time, and track delivery and daily staff with GateLink."
        canonicalUrl="https://gatelink.in/visitor-management"
        schemaData={schemaData}
      />

      <Navbar />

      {/* Hero Section */}
      <header style={{ paddingTop: '130px', paddingBottom: '70px', background: isDark ? 'linear-gradient(180deg, #0F172A 0%, #020617 100%)' : 'linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%)', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(14, 165, 233, 0.12)', border: '1px solid rgba(14, 165, 233, 0.3)', color: '#0EA5E9', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
            <QrCode size={14} /> Intelligent Gate Pass & Entry Verification
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', lineHeight: 1.18, marginBottom: '20px', maxWidth: '900px', margin: '0 auto 20px auto' }}>
            Smart Visitor Management System for Housing Societies & Apartments
          </h1>

          <p style={{ fontSize: '17px', color: isDark ? '#94A3B8' : '#475569', maxWidth: '780px', margin: '0 auto 32px auto', lineHeight: 1.65 }}>
            Eliminate unsafe paper entry registers. Pre-approve expected guests, generate instant QR gate passes, track daily service staff (maids, drivers), and receive instant push notifications on your phone.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/contact" 
              style={{ padding: '14px 28px', borderRadius: '12px', background: '#1E3A8A', color: '#FFFFFF', textDecoration: 'none', fontWeight: 800, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 6px 20px rgba(30, 58, 138, 0.35)' }}
            >
              <span>Book Visitor Demo</span>
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
          
          {/* Section 1: Entity Definition & Audience Roles */}
          <section style={{ marginBottom: '70px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '14px' }}>
                What is GateLink Visitor Management System?
              </h2>
              <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '820px', margin: '0 auto', lineHeight: 1.7 }}>
                GateLink Visitor Management System is a specialized digital gate pass and visitor entry platform engineered for housing societies, apartment complexes, and gated communities in India. It connects residents and security guards in real time to streamline visitor verification, pre-authorize guest access, log delivery personnel, and maintain accurate digital gate records.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '26px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', marginBottom: '14px' }}>
                  <Smartphone size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For Apartment Residents</h3>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65 }}>
                  Create digital guest invitations with custom validity windows, share QR passes and OTPs via WhatsApp, receive instant phone notifications when unannounced visitors arrive, and approve or deny entry with a single tap.
                </p>
              </div>

              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '26px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(30, 58, 138, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E3A8A', marginBottom: '14px' }}>
                  <ShieldCheck size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For Security Guards</h3>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65 }}>
                  Use a dedicated mobile and tablet gatekeeper terminal to scan visitor QR passes, verify 6-digit OTP passcodes, record delivery couriers, log vehicle license plate numbers, and receive instant alerts for blacklisted individuals.
                </p>
              </div>

              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '26px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', marginBottom: '14px' }}>
                  <Building2 size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For RWA Management Committees</h3>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65 }}>
                  Access centralized gate entry records, monitor daily visitor traffic trends, track domestic staff attendance patterns across all society gates, and maintain complete digital accountability across the community perimeter.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Core Verified Capabilities */}
          <section style={{ marginBottom: '70px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '12px' }}>
                Core Features of GateLink Visitor Management
              </h2>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '680px', margin: '0 auto' }}>
                Explore the verified capabilities that make GateLink a reliable digital gatekeeping solution for modern housing societies.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
              {/* Feature 1 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <QrCode size={26} color="#0EA5E9" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Pre-Approved QR &amp; OTP Guest Passes</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                  Residents can generate pre-authorized digital entry passes directly from the resident mobile app. Guests present the digital QR code or 6-digit OTP passcode to security guards at the main gate for immediate, zero-delay verification.
                </p>
                <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
                  ✓ Instant QR scan &amp; WhatsApp invite sharing
                </div>
              </div>

              {/* Feature 2 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <BellRing size={26} color="#0EA5E9" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Instant Resident Approval Notifications</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                  When unannounced visitors arrive, security guards log their details on the gate terminal. The system immediately delivers an interactive push notification to the resident's mobile phone to approve or deny entry with a single tap.
                </p>
                <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
                  ✓ 1-Tap phone approval &amp; real-time gate confirmation
                </div>
              </div>

              {/* Feature 3 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <Truck size={26} color="#0EA5E9" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Delivery &amp; Courier Entry Tracking</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                  Security staff can quickly record delivery personnel from popular e-commerce and food delivery services. Entry logs link deliveries directly to target flats, alerting residents when their packages arrive at the gate.
                </p>
                <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
                  ✓ Fast-track delivery check-in &amp; flat notifications
                </div>
              </div>

              {/* Feature 4 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <UserCheck size={26} color="#0EA5E9" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Domestic Helper &amp; Staff Attendance</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                  Manage attendance records for daily domestic staff such as maids, cooks, drivers, and tutors. The system records entry and exit timestamps, instantly notifying associated flats when their helper arrives.
                </p>
                <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
                  ✓ Staff check-in/out logging &amp; resident alerts
                </div>
              </div>

              {/* Feature 5 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <Building2 size={26} color="#0EA5E9" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Multi-Gate Visitor Synchronization</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                  Gated communities with multiple entry and exit gates benefit from synchronized cloud records. Guards at any gate can verify entry passes and log departures with real-time data consistency across all terminals.
                </p>
                <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
                  ✓ Real-time multi-terminal data synchronization
                </div>
              </div>

              {/* Feature 6 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <Car size={26} color="#0EA5E9" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Vehicle Registration Logging</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                  Record vehicle registration numbers, vehicle types (two-wheeler or four-wheeler), and temporary visitor parking assignments during gate entry to ensure perimeter security and organized parking.
                </p>
                <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
                  ✓ License plate capture &amp; parking slot mapping
                </div>
              </div>

              {/* Feature 7 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <UserX size={26} color="#0EA5E9" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Suspect &amp; Blacklisted Visitor Alerts</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                  Management committees and residents can flag unauthorized or suspicious individuals. If a flagged phone number or visitor is logged at the gate, guards receive an immediate high-priority warning popup.
                </p>
                <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
                  ✓ Automated blacklist warnings on guard devices
                </div>
              </div>

              {/* Feature 8 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <ShieldCheck size={26} color="#0EA5E9" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Guard-Side Visitor Verification</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                  A straightforward, multilingual terminal application designed for security guards to quickly look up resident flats, trigger entry approval calls, and verify passcodes without operational delays.
                </p>
                <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
                  ✓ Streamlined gatekeeper app with large touch controls
                </div>
              </div>

              {/* Feature 9 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <Users size={26} color="#0EA5E9" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Expected Guest Invitations</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                  Residents hosting gatherings or expecting family visits can pre-register multiple guests with custom valid date ranges. Guests receive personalized entry links ensuring seamless access upon arrival.
                </p>
                <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
                  ✓ Multi-guest pre-registration &amp; scheduled validity
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: How Digital Visitor Management Works at the Gate */}
          <section style={{ marginBottom: '70px', background: isDark ? '#0F172A' : '#FFFFFF', padding: '40px 32px', borderRadius: '20px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>
                How Digital Visitor Management Works at the Gate
              </h2>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
                A streamlined 4-step workflow connecting residents, security guards, and visitors for fast, verified entry.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '24px 20px', borderRadius: '14px', background: isDark ? '#020617' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0EA5E9', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', marginBottom: '14px' }}>
                  1
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>Invitation or Arrival</h3>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                  Residents share an expected QR pass via WhatsApp, or an unexpected visitor arrives directly at the security gate.
                </p>
              </div>

              <div style={{ padding: '24px 20px', borderRadius: '14px', background: isDark ? '#020617' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0EA5E9', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', marginBottom: '14px' }}>
                  2
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>Guard Verification</h3>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                  Security guards scan the QR code/passcode or enter the visitor's destination flat number into the gatekeeper terminal.
                </p>
              </div>

              <div style={{ padding: '24px 20px', borderRadius: '14px', background: isDark ? '#020617' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0EA5E9', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', marginBottom: '14px' }}>
                  3
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>Instant Approval</h3>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                  Pre-approved guests enter immediately; unexpected visitors trigger a 1-tap mobile push notification to the resident flat.
                </p>
              </div>

              <div style={{ padding: '24px 20px', borderRadius: '14px', background: isDark ? '#020617' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0EA5E9', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', marginBottom: '14px' }}>
                  4
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>Synchronized Logging</h3>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                  Entry timestamps, vehicle numbers, and visitor categories are securely logged and synced across all society gates in real time.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Problem -> Solution Comparison */}
          <section style={{ marginBottom: '70px' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>
                From Paper Visitor Registers to Digital Gate Entry
              </h2>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
                Comparing traditional manual gatekeeping methods with GateLink's digital visitor automation.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '24px', borderRadius: '16px', background: isDark ? '#0F172A' : '#FFFFFF', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '6px' }}>Manual Paper Registers</div>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '14px' }}>Handwritten entries are slow, frequently illegible, prone to fake phone numbers, and difficult to search during incident reviews.</p>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>GateLink Digital Records</div>
                <p style={{ fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 600, lineHeight: 1.5 }}>Searchable digital entry logs with accurate timestamps, pre-verified resident approvals, and multi-gate synchronization.</p>
              </div>

              <div style={{ padding: '24px', borderRadius: '16px', background: isDark ? '#0F172A' : '#FFFFFF', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '6px' }}>Manual Intercom Calls</div>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '14px' }}>Guards spend minutes dialing broken intercoms or phone numbers while delivery queues pile up at the main gate entrance.</p>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>GateLink Mobile Notifications</div>
                <p style={{ fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 600, lineHeight: 1.5 }}>Instant push notifications with 1-tap Approve/Deny buttons sent directly to residents' mobile phones regardless of location.</p>
              </div>

              <div style={{ padding: '24px', borderRadius: '16px', background: isDark ? '#0F172A' : '#FFFFFF', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '6px' }}>Unverified Helper Entry</div>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '14px' }}>Daily domestic staff enter without timestamp tracking, leaving flat owners unaware of whether their helpers have arrived.</p>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>GateLink Staff Attendance</div>
                <p style={{ fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 600, lineHeight: 1.5 }}>Passcode-based helper check-in with automated entry/exit alerts sent immediately to all associated resident apartments.</p>
              </div>
            </div>
          </section>

          {/* Section 5: Internal Cross-Linking Cluster */}
          <section style={{ background: isDark ? '#0F172A' : '#EFF6FF', padding: '36px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #DBEAFE', marginBottom: '70px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>
                Explore GateLink Society &amp; Security Solutions
              </h2>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '600px', margin: '0 auto' }}>
                Learn how GateLink connects visitor management with comprehensive society administration and security guard operations.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <Link to="/security-management" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#0EA5E9', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>apartment security and guard management</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/society-management-software" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#0EA5E9', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>complete society management software</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/maintenance-management" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#0EA5E9', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>society maintenance billing and payments</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/features" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#0EA5E9', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>All Platform Capabilities</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          {/* Section 6: FAQ Section */}
          <section style={{ marginBottom: '70px' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0EA5E9', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                <HelpCircle size={16} /> Frequently Asked Questions
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>
                Frequently Asked Questions
              </h2>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
                Common questions about GateLink visitor management system for apartment societies.
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

          {/* Section 7: Bottom CTA Banner */}
          <section style={{ background: isDark ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' : 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)', padding: '48px 32px', borderRadius: '24px', color: '#FFFFFF', textAlign: 'center', boxShadow: '0 16px 36px rgba(15, 23, 42, 0.25)' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: '#FFFFFF', marginBottom: '12px' }}>
              Upgrade Your Society's Visitor Management
            </h2>
            <p style={{ fontSize: '15px', color: '#CBD5E1', maxWidth: '640px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
              Eliminate gate queues, verify delivery staff, and secure your apartment community with GateLink's digital gatekeeping platform.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                to="/contact" 
                style={{ padding: '14px 28px', borderRadius: '12px', background: '#0EA5E9', color: '#FFFFFF', textDecoration: 'none', fontWeight: 800, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(14, 165, 233, 0.35)' }}
              >
                <span>schedule a GateLink visitor management demo</span>
                <ArrowRight size={18} />
              </Link>
              <Link 
                to="/features" 
                style={{ padding: '14px 28px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF', textDecoration: 'none', fontWeight: 700, fontSize: '15px', border: '1px solid rgba(255, 255, 255, 0.2)' }}
              >
                Browse All Features
              </Link>
            </div>
          </section>

        </div>
      </main>

      <FooterSection />
    </div>
  );
}
