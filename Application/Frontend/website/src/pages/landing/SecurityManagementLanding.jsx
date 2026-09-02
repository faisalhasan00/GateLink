import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  AlertTriangle, 
  UserCheck, 
  ArrowRight, 
  CheckCircle2, 
  QrCode, 
  Car, 
  Building2, 
  Clock, 
  HelpCircle, 
  ChevronDown, 
  Users, 
  MapPin, 
  ShieldAlert, 
  Radio 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';

export default function SecurityManagementLanding() {
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

  const faqItems = [
    {
      q: "How does security management software help apartment gate guards?",
      a: "GateLink equips security guards with a dedicated mobile and tablet application that replaces physical paper registers. Guards can scan dynamic QR codes, verify 6-digit OTP passcodes, capture visitor photos on the spot, log vehicle numbers, record exit timestamps, and conduct scheduled patrol rounds with timestamped QR checkpoint verification."
    },
    {
      q: "How does GateLink verify visitors at the gate?",
      a: "Gate guards have three verified verification paths: scanning pre-approved digital QR passes generated on the resident app, validating 6-digit numeric OTP passcodes, or performing quick on-the-spot registration by capturing the visitor's photo and details, which sends a real-time approval notification to the resident."
    },
    {
      q: "How does the guard night patrol and QR checkpoint feature work?",
      a: "Society administrators configure physical QR checkpoint tags at strategic locations across the premises (such as basements, perimeter gates, clubhouses, and rooftop access). During patrol shifts, guards scan each checkpoint tag with their mobile app. The system logs exact scan timestamps and enables guards to log incident reports with severity details for administrative review."
    },
    {
      q: "Who receives emergency SOS alerts when triggered?",
      a: "When a resident or guard triggers an emergency SOS siren from the app (categorized under Medical, Fire, Security Threat, or Lift/Accident), instant audible siren notifications are broadcast across active guard terminal devices and RWA committee dashboards with flat numbers and contact details for rapid community coordination."
    },
    {
      q: "Can GateLink synchronize security operations across multiple gates?",
      a: "Yes. GateLink uses cloud-based real-time synchronization so that all entry points—such as Main Gate, Service Gate, and Tower Checkpoints—share synchronized visitor logs. A visitor who enters through the Main Gate can be checked out at the Service Gate with updated status records visible instantly across all security terminals."
    }
  ];

  return (
    <div style={{ background: isDark ? '#020617' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SeoHead 
        title="Apartment Security Management & Guard App | GateLink" 
        description="Apartment security management software for gated communities. Manage guard gate entry, QR/OTP verification, patrol checkpoints, SOS alerts, and vehicle logs with GateLink."
        canonicalUrl="https://gatelink.in/security-management"
        schemaData={schemaData}
      />

      <Navbar />

      {/* Hero Section */}
      <header style={{ paddingTop: '130px', paddingBottom: '70px', background: isDark ? 'linear-gradient(180deg, #0F172A 0%, #020617 100%)' : 'linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%)', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
            <ShieldCheck size={14} /> Multi-Layer Main Gate Protection
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', lineHeight: 1.18, marginBottom: '20px', maxWidth: '900px', margin: '0 auto 20px auto' }}>
            Apartment Security Management &amp; Gate Guard Automation System
          </h1>

          <p style={{ fontSize: '17px', color: isDark ? '#94A3B8' : '#475569', maxWidth: '780px', margin: '0 auto 32px auto', lineHeight: 1.65 }}>
            Empower your gate security guards with an intuitive Android/iOS mobile application. Instant visitor verification, blacklisted individual alerts, and one-touch emergency SOS panic buttons.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/contact" 
              style={{ padding: '14px 28px', borderRadius: '12px', background: '#1E3A8A', color: '#FFFFFF', textDecoration: 'none', fontWeight: 800, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 6px 20px rgba(30, 58, 138, 0.35)' }}
            >
              <span>Get Security Proposal</span>
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

      {/* Main Content */}
      <main style={{ flex: 1, padding: '60px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Section 1: Entity Definition & Audience Roles */}
          <section style={{ marginBottom: '70px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '14px' }}>
                What is GateLink Security Management Software?
              </h2>
              <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '820px', margin: '0 auto', lineHeight: 1.7 }}>
                GateLink Security Management Software is a digital gatekeeper and security-operations platform engineered for residential apartment societies and gated communities in India. It bridges security personnel, facility managers, and residents with real-time gate entry verification, QR checkpoint patrol tracking, incident logging, emergency SOS broadcasting, vehicle logging, and multi-gate synchronization.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '26px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', marginBottom: '14px' }}>
                  <Building2 size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For RWA Management Committees</h3>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65 }}>
                  Gain a real-time administrative view of gate security operations, monitor guard patrol checkpoint compliance, review logged security incidents, and maintain verified digital visitor archives.
                </p>
              </div>

              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '26px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(30, 58, 138, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E3A8A', marginBottom: '14px' }}>
                  <Smartphone size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For Security Supervisors &amp; Gate Guards</h3>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65 }}>
                  Process gate entries faster with high-speed QR and OTP verification, capture walk-in visitor photos, manage real-time entry and check-out feeds, scan patrol tags, and report hazard incidents.
                </p>
              </div>

              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '26px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', marginBottom: '14px' }}>
                  <Users size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For Apartment Residents &amp; Families</h3>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65 }}>
                  Receive immediate push notifications when visitors or delivery staff arrive at the gate, approve entries with 1 tap, and access one-touch emergency SOS panic alerts in critical situations.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Core Verified Capabilities */}
          <section style={{ marginBottom: '70px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '12px' }}>
                Core Apartment Security &amp; Guard Features
              </h2>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '680px', margin: '0 auto' }}>
                Explore the verified gate operations, guard mobile tools, and incident monitoring capabilities built into GateLink.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
              {/* Feature 1 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <Smartphone size={26} color="#EF4444" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Guard Mobile Gatekeeper App</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                  A dedicated Android application built for gatekeepers with live visitor streams, active inside status indicators, on-spot walk-in photo registration, and 1-tap exit check-out recording.
                </p>
                <div style={{ fontSize: '13px', color: '#EF4444', fontWeight: 700 }}>
                  ✓ Real-time gate dashboard &amp; 1-tap exit check-out recording
                </div>
              </div>

              {/* Feature 2 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <QrCode size={26} color="#EF4444" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>QR &amp; OTP Gate Entry Verification</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                  Guards verify pre-approved guest invites by scanning dynamic QR codes directly using device cameras or validating 6-digit numeric passcodes without requiring physical contact.
                </p>
                <div style={{ fontSize: '13px', color: '#EF4444', fontWeight: 700 }}>
                  ✓ Camera QR pass scanning &amp; manual 6-digit OTP verification
                </div>
              </div>

              {/* Feature 3 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <Clock size={26} color="#EF4444" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Night Patrol &amp; QR Checkpoint Tracking</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                  Ensure guard alertness during night shifts. Guards scan physical QR checkpoint tags across society towers, perimeter walls, and basements to log timestamped patrol records with admin sync.
                </p>
                <div style={{ fontSize: '13px', color: '#EF4444', fontWeight: 700 }}>
                  ✓ Physical QR tag scanning &amp; scheduled patrol route logging
                </div>
              </div>

              {/* Feature 4 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <AlertTriangle size={26} color="#EF4444" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>One-Touch Emergency SOS Siren Alerts</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                  In urgent situations—such as Medical emergencies, Fire hazards, Security Threats, or Lift breakdowns—residents and guards trigger instant siren alarms across guard terminals and RWA dashboards.
                </p>
                <div style={{ fontSize: '13px', color: '#EF4444', fontWeight: 700 }}>
                  ✓ Categorized emergency siren broadcast &amp; flat contact display
                </div>
              </div>

              {/* Feature 5 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <Car size={26} color="#EF4444" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Vehicle License Plate &amp; Exit Logging</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                  Guards log vehicle license plate numbers, categorize entries (2-wheeler, 4-wheeler, commercial auto), and record precise exit timestamps to keep track of external vehicles inside the community.
                </p>
                <div style={{ fontSize: '13px', color: '#EF4444', fontWeight: 700 }}>
                  ✓ Vehicle registration number logging &amp; exit timestamp tracking
                </div>
              </div>

              {/* Feature 6 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <Radio size={26} color="#EF4444" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Multi-Gate Cloud Synchronization</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                  Real-time cloud database synchronization ensures that Main Gates, Service Entrances, and Tower Checkpoints stay aligned. Visitor entries logged at one gate are visible at all other gates instantly.
                </p>
                <div style={{ fontSize: '13px', color: '#EF4444', fontWeight: 700 }}>
                  ✓ Real-time cross-gate synchronization across all guard devices
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: How Apartment Gate Security Works */}
          <section style={{ marginBottom: '70px', background: isDark ? '#0F172A' : '#FFFFFF', padding: '40px 32px', borderRadius: '20px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>
                How Apartment Gate Security Works
              </h2>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
                A streamlined 4-step security workflow connecting guards, visitors, and residents at every gate entry point.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '24px 20px', borderRadius: '14px', background: isDark ? '#020617' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EF4444', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', marginBottom: '14px' }}>
                  1
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>Step 1: Visitor Arrival &amp; Category Identification</h3>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                  A visitor arrives at the gate. The security guard identifies whether they are an invited guest, delivery courier, cab driver, or service professional.
                </p>
              </div>

              <div style={{ padding: '24px 20px', borderRadius: '14px', background: isDark ? '#020617' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EF4444', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', marginBottom: '14px' }}>
                  2
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>Step 2: QR Scan, OTP Verification or Photo Capture</h3>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                  Guards scan the pre-approved QR pass, verify a 6-digit OTP, or register unexpected visitors by capturing their live photo, name, phone, and vehicle details.
                </p>
              </div>

              <div style={{ padding: '24px 20px', borderRadius: '14px', background: isDark ? '#020617' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EF4444', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', marginBottom: '14px' }}>
                  3
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>Step 3: Resident Approval When Required</h3>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                  For unannounced guests or deliveries, the resident app receives an instant notification with the visitor's photo and details to approve or deny entry.
                </p>
              </div>

              <div style={{ padding: '24px 20px', borderRadius: '14px', background: isDark ? '#020617' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EF4444', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', marginBottom: '14px' }}>
                  4
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>Step 4: Timestamped Gate Entry &amp; Security Record Sync</h3>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                  Upon approval, the gate entry is recorded with exact timestamps and synced across all gate terminals and the administrative security log.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Problem -> Solution Comparison */}
          <section style={{ marginBottom: '70px' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>
                From Manual Paper Registers to Digital Gate Security
              </h2>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
                Compare outdated paper-based physical security books with GateLink's digital security management system.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '24px', borderRadius: '16px', background: isDark ? '#0F172A' : '#FFFFFF', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>Illegible Paper Registers vs Digital Visitor &amp; Gate Records</h3>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '4px' }}>Paper Logbooks</div>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>Visitors scribble fake names and illegible phone numbers in physical books with zero photo proof and slow lookups.</p>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>GateLink Digital Guard App</div>
                <p style={{ fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 600, lineHeight: 1.5 }}>Digital photo capture, verified OTP/QR credentials, and searchable entry logs accessible across all security devices.</p>
              </div>

              <div style={{ padding: '24px', borderRadius: '16px', background: isDark ? '#0F172A' : '#FFFFFF', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>Unverified Phone Calls vs QR &amp; OTP Verification</h3>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '4px' }}>Intercom &amp; Phone Hassle</div>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>Guards waste time dialing intercoms or mobile numbers that ring unanswered, causing long traffic queues at the gate.</p>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>Instant QR &amp; App Approvals</div>
                <p style={{ fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 600, lineHeight: 1.5 }}>Pre-approved QR passes scan in under 3 seconds, and unannounced visitors trigger 1-tap in-app approval prompts.</p>
              </div>

              <div style={{ padding: '24px', borderRadius: '16px', background: isDark ? '#0F172A' : '#FFFFFF', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>Unmonitored Night Patrols vs QR Patrol Checkpoints</h3>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '4px' }}>Unverified Patrolling</div>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>Committees have no way to verify whether night guards actually complete scheduled patrol rounds across dark corners.</p>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>QR Checkpoint Verification</div>
                <p style={{ fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 600, lineHeight: 1.5 }}>Physical QR checkpoints logged with exact timestamps and incident reporting capabilities synced directly with RWA admins.</p>
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
                Discover how GateLink connects guard operations with comprehensive visitor management, billing, and community administration.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <Link to="/visitor-management" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#EF4444', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>visitor management and digital gate pass system</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/society-management-software" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#EF4444', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>complete society management software for housing societies</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/maintenance-management" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#EF4444', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>society maintenance billing and payment management</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/features" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#EF4444', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>explore all GateLink security and society features</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          {/* Section 6: FAQ Section */}
          <section style={{ marginBottom: '70px' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#EF4444', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                <HelpCircle size={16} /> Frequently Asked Questions
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>
                Frequently Asked Questions
              </h2>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
                Common questions regarding GateLink apartment security management, guard operations, and gate automation.
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
                        color="#EF4444" 
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

          {/* Section 7: Final Call to Action */}
          <section style={{ background: isDark ? 'linear-gradient(135deg, #0F172A 0%, #450A0A 100%)' : 'linear-gradient(135deg, #450A0A 0%, #0F172A 100%)', padding: '48px 32px', borderRadius: '24px', color: '#FFFFFF', textAlign: 'center', boxShadow: '0 16px 36px rgba(15, 23, 42, 0.25)' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: '#FFFFFF', marginBottom: '12px' }}>
              Modernize Your Gated Community's Security Operations
            </h2>
            <p style={{ fontSize: '15px', color: '#CBD5E1', maxWidth: '640px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
              Equip your security team with smart gatekeeper apps, QR patrol tracking, and real-time emergency SOS alerts with GateLink.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                to="/contact" 
                style={{ padding: '14px 28px', borderRadius: '12px', background: '#EF4444', color: '#FFFFFF', textDecoration: 'none', fontWeight: 800, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(239, 68, 68, 0.35)' }}
              >
                <span>schedule a GateLink security management demo</span>
                <ArrowRight size={18} />
              </Link>
              <Link 
                to="/features" 
                style={{ padding: '14px 28px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF', textDecoration: 'none', fontWeight: 700, fontSize: '15px', border: '1px solid rgba(255, 255, 255, 0.2)' }}
              >
                Explore All Features
              </Link>
            </div>
          </section>

        </div>
      </main>

      <FooterSection />
    </div>
  );
}
