import React, { useState } from 'react';
import { 
  CreditCard, 
  FileText, 
  Receipt, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  IndianRupee, 
  Clock, 
  Building2, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  Users, 
  TrendingUp, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import SeoHead from '../../components/seo/SeoHead';

export default function MaintenanceManagementLanding() {
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

  const faqItems = [
    {
      q: "How does maintenance billing software work for housing societies?",
      a: "Maintenance billing software automates the monthly invoicing cycle for housing societies and RWAs. Society administrators configure recurring billing rules—such as base maintenance, parking charges, water fees, and sinking funds. On the scheduled billing date, the system automatically generates itemized invoices for all flats, notifies residents via the mobile app, collects online payments, and updates the society ledger in real time."
    },
    {
      q: "Can society maintenance bills include multiple billing components?",
      a: "Yes. GateLink supports itemized billing configurations where committees can define separate line items including base maintenance charges, fixed vehicle parking fees, water consumption charges, and long-term sinking funds. Each component is clearly detailed on the resident's digital invoice and printable tax receipt."
    },
    {
      q: "How do residents pay maintenance fees online?",
      a: "Residents can review their monthly maintenance invoice in the GateLink resident app and make secure payments through the integrated Cashfree payment gateway. The app supports popular Indian payment methods including UPI apps (Google Pay, PhonePe, Paytm), Debit and Credit Cards, and Net Banking. Payment confirmation is recorded instantly."
    },
    {
      q: "Can societies record offline payments such as cheques or NEFT transfers?",
      a: "Yes. For residents who pay via bank NEFT transfer, RTGS, cheque, or direct deposit, residents can submit their transaction reference (UTR) number through the app. Society administrators and treasurers can review the submitted payment details in the admin dashboard, verify the bank credit, and approve the offline payment record to issue an official receipt."
    },
    {
      q: "How does GateLink track overdue maintenance dues and defaulters?",
      a: "GateLink maintains a real-time status tracker for all society flats categorized by paid, unpaid, and overdue records. The administrative dashboard displays cumulative outstanding balances, identifies pending flats past the due date, computes configured late penalty fees, and allows administrators to review defaulter records for committee review."
    }
  ];

  return (
    <div style={{ background: isDark ? '#020617' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SeoHead 
        title="Society Maintenance Billing & Accounting Software | GateLink" 
        description="Maintenance billing software for housing societies. Automate recurring bills, UPI/card payments, GST invoices, overdue tracking, and payment records with GateLink."
        canonicalUrl="https://gatelink.in/maintenance-management"
        schemaData={schemaData}
      />

      <Navbar />

      {/* Hero Section */}
      <header style={{ paddingTop: '130px', paddingBottom: '70px', background: isDark ? 'linear-gradient(180deg, #0F172A 0%, #020617 100%)' : 'linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%)', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10B981', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
            <CreditCard size={14} /> Automated Cashfree Gateway Integration
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', lineHeight: 1.18, marginBottom: '20px', maxWidth: '900px', margin: '0 auto 20px auto' }}>
            Society Maintenance Software &amp; Apartment Billing Platform
          </h1>

          <p style={{ fontSize: '17px', color: isDark ? '#94A3B8' : '#475569', maxWidth: '780px', margin: '0 auto 32px auto', lineHeight: 1.65 }}>
            Say goodbye to late payments and manual receipt books. Generate automated monthly maintenance bills, collect digital payments via UPI/Card, and access real-time financial audit reports.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/contact" 
              style={{ padding: '14px 28px', borderRadius: '12px', background: '#1E3A8A', color: '#FFFFFF', textDecoration: 'none', fontWeight: 800, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 6px 20px rgba(30, 58, 138, 0.35)' }}
            >
              <span>Get Billing Demo</span>
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
                What is GateLink Maintenance Management Software?
              </h2>
              <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '820px', margin: '0 auto', lineHeight: 1.7 }}>
                GateLink Maintenance Management Software is a digital society billing and accounting platform designed for apartment associations, housing societies, and Resident Welfare Associations (RWAs) in India. It automates recurring monthly maintenance invoicing, enables secure online fee collection through UPI and cards, generates official GST tax invoices, tracks outstanding dues, and maintains a centralized financial payment ledger.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '26px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', marginBottom: '14px' }}>
                  <Building2 size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For RWA Management Committees</h3>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65 }}>
                  Automate monthly billing schedules across all apartment blocks, eliminate paper receipt printing costs, monitor real-time collection metrics, and ensure structured financial governance for the community.
                </p>
              </div>

              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '26px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(30, 58, 138, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E3A8A', marginBottom: '14px' }}>
                  <TrendingUp size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For Society Treasurers &amp; Accountants</h3>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65 }}>
                  Configure multi-charge billing parameters, review and approve offline NEFT/cheque payments, monitor defaulter lists with calculated late penalties, and reconcile bank settlements with complete payment histories.
                </p>
              </div>

              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '26px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', marginBottom: '14px' }}>
                  <CreditCard size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>For Apartment Residents &amp; Flat Owners</h3>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65 }}>
                  View itemized maintenance breakdowns, pay dues in seconds via UPI, Cards, or Net Banking from the resident app, download official tax receipts, and access chronological payment archives anytime.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Core Verified Capabilities */}
          <section style={{ marginBottom: '70px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '12px' }}>
                Core Features of GateLink Maintenance &amp; Billing
              </h2>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '680px', margin: '0 auto' }}>
                Explore the verified billing, payment collection, and accounting features engineered into the GateLink platform.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
              {/* Feature 1 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <FileText size={26} color="#10B981" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Automated Multi-Component Invoicing</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                  Society administrators can configure itemized recurring billing parameters including base maintenance charges, fixed vehicle parking fees, water utility charges, and dedicated sinking funds for automated monthly generation.
                </p>
                <div style={{ fontSize: '13px', color: '#10B981', fontWeight: 700 }}>
                  ✓ Recurring monthly billing cycles &amp; itemized charge breakdowns
                </div>
              </div>

              {/* Feature 2 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <CreditCard size={26} color="#10B981" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Integrated Cashfree UPI &amp; Card Payments</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: 12 }}>
                  Direct payment gateway integration via Cashfree enables residents to pay their maintenance dues seamlessly through UPI intent (GPay, PhonePe, Paytm), Credit/Debit Cards, and Net Banking with immediate status updates.
                </p>
                <div style={{ fontSize: '13px', color: '#10B981', fontWeight: 700 }}>
                  ✓ In-app UPI, Card &amp; Net Banking payment gateway checkout
                </div>
              </div>

              {/* Feature 3 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <Receipt size={26} color="#10B981" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>GST Tax Invoices &amp; Digital Receipts</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                  Generate official tax invoices with society GSTIN, registration numbers, unique invoice sequences, and itemized component breakdowns. Residents can view, print, or download authentic A4 PDF receipts instantly.
                </p>
                <div style={{ fontSize: '13px', color: '#10B981', fontWeight: 700 }}>
                  ✓ Printable PDF tax invoice generation &amp; GSTIN declaration
                </div>
              </div>

              {/* Feature 4 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <AlertCircle size={26} color="#10B981" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Overdue Dues &amp; Defaulter Tracking</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                  Track flat-wise payment statuses with clear paid, unpaid, and overdue indicators. The system automatically computes configured late penalty fees when invoices exceed due dates and provides clear overdue summaries.
                </p>
                <div style={{ fontSize: '13px', color: '#10B981', fontWeight: 700 }}>
                  ✓ Status filtering, overdue visibility &amp; late penalty computation
                </div>
              </div>

              {/* Feature 5 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <CheckCircle2 size={26} color="#10B981" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Offline Cheque &amp; NEFT Payment Reconciliation</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                  Accommodate traditional payment preferences. Residents submit offline bank transfer UTR numbers, cheques, or cash details through the app, allowing society admins to review and approve payments with official records.
                </p>
                <div style={{ fontSize: '13px', color: '#10B981', fontWeight: 700 }}>
                  ✓ Offline UTR reference submission &amp; admin verification
                </div>
              </div>

              {/* Feature 6 */}
              <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <Clock size={26} color="#10B981" />
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Financial Payment History &amp; Ledger Records</h3>
                </div>
                <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                  Maintain chronological transaction logs for every apartment unit. Treasurers and residents can inspect historical payment records, transaction reference IDs, and payment methods for transparent society audits.
                </p>
                <div style={{ fontSize: '13px', color: '#10B981', fontWeight: 700 }}>
                  ✓ Chronological transaction logs &amp; resident billing archives
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: How Society Maintenance Billing Works */}
          <section style={{ marginBottom: '70px', background: isDark ? '#0F172A' : '#FFFFFF', padding: '40px 32px', borderRadius: '20px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>
                How Society Maintenance Billing Works
              </h2>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
                A structured 4-step workflow connecting society administrators and residents for automated monthly maintenance collections.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '24px 20px', borderRadius: '14px', background: isDark ? '#020617' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10B981', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', marginBottom: '14px' }}>
                  1
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>Step 1: Configure Billing Rules &amp; Components</h3>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                  Society administrators set recurring billing parameters including base charges, parking slots, water utilities, sinking funds, and due dates in the admin dashboard.
                </p>
              </div>

              <div style={{ padding: '24px 20px', borderRadius: '14px', background: isDark ? '#020617' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10B981', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', marginBottom: '14px' }}>
                  2
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>Step 2: Automated Monthly Invoicing</h3>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                  On the scheduled billing day, the automated billing engine generates itemized digital invoices for all active flats and notifies residents via the mobile application.
                </p>
              </div>

              <div style={{ padding: '24px 20px', borderRadius: '14px', background: isDark ? '#020617' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10B981', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', marginBottom: '14px' }}>
                  3
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>Step 3: Online Payment via UPI, Cards or Net Banking</h3>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                  Residents review their invoice breakdown and complete payments directly through the Cashfree payment gateway or submit offline bank reference details.
                </p>
              </div>

              <div style={{ padding: '24px 20px', borderRadius: '14px', background: isDark ? '#020617' : '#F8FAFC', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10B981', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', marginBottom: '14px' }}>
                  4
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>Step 4: Record Payments &amp; Reconcile Transactions</h3>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                  Online payments update invoice statuses instantly and issue printable tax receipts, while offline submissions are verified by administrators in the dashboard.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Problem -> Solution Comparison */}
          <section style={{ marginBottom: '70px' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>
                From Manual Receipt Books to Digital Society Accounting
              </h2>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
                Comparing traditional manual society collection methods with GateLink's digital billing platform.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '24px', borderRadius: '16px', background: isDark ? '#0F172A' : '#FFFFFF', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>Manual Receipt Books vs. Digital Invoices</h3>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '4px' }}>Manual Paper Invoicing</div>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>Handwritten receipt books take hours to write, get lost easily, and require physical distribution across hundreds of flats.</p>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>GateLink Digital Invoices</div>
                <p style={{ fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 600, lineHeight: 1.5 }}>Automated digital invoices with itemized charge breakdowns, GSTIN declarations, and instant printable PDF receipts.</p>
              </div>

              <div style={{ padding: '24px', borderRadius: '16px', background: isDark ? '#0F172A' : '#FFFFFF', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>Cheque Collections vs. Online Payments</h3>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '4px' }}>Physical Cheque Collection</div>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>Collecting paper cheques requires physical drop boxes, manual bank visits, clearance delays, and risk of cheque bounces.</p>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>GateLink Online Payments</div>
                <p style={{ fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 600, lineHeight: 1.5 }}>Secure Cashfree payment gateway supporting UPI (GPay, PhonePe), Debit/Credit Cards, Net Banking, and offline UTR recording.</p>
              </div>

              <div style={{ padding: '24px', borderRadius: '16px', background: isDark ? '#0F172A' : '#FFFFFF', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>Scattered Spreadsheets vs. Centralized Dues Records</h3>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '4px' }}>Unorganized Spreadsheets</div>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>Spreadsheets lead to version conflicts, unrecorded payments, disputed balances, and tedious manual accounting audits.</p>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>GateLink Centralized Ledger</div>
                <p style={{ fontSize: '13px', color: isDark ? '#E2E8F0' : '#334155', fontWeight: 600, lineHeight: 1.5 }}>Real-time paid/unpaid/overdue status filtering, automatic late penalty tracking, and verifiable transaction records.</p>
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
                Learn how GateLink connects financial maintenance billing with comprehensive society management and gate security.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <Link to="/society-management-software" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#10B981', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>complete society management software for housing societies</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/visitor-management" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#10B981', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>visitor management and gate pass system</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/security-management" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#10B981', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>apartment security and guard management</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/features" style={{ background: isDark ? '#020617' : '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: '#10B981', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>explore GateLink billing and platform features</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          {/* Section 6: FAQ Section */}
          <section style={{ marginBottom: '70px' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10B981', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                <HelpCircle size={16} /> Frequently Asked Questions
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '10px' }}>
                Frequently Asked Questions
              </h2>
              <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '640px', margin: '0 auto' }}>
                Common questions about GateLink maintenance billing and accounting software for housing societies.
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
                        color="#10B981" 
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
          <section style={{ background: isDark ? 'linear-gradient(135deg, #0F172A 0%, #064E3B 100%)' : 'linear-gradient(135deg, #064E3B 0%, #0F172A 100%)', padding: '48px 32px', borderRadius: '24px', color: '#FFFFFF', textAlign: 'center', boxShadow: '0 16px 36px rgba(15, 23, 42, 0.25)' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: '#FFFFFF', marginBottom: '12px' }}>
              Modernize Your Society's Maintenance &amp; Billing
            </h2>
            <p style={{ fontSize: '15px', color: '#CBD5E1', maxWidth: '640px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
              Automate recurring invoice generation, collect digital maintenance payments via Cashfree, and maintain transparent financial records with GateLink.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                to="/contact" 
                style={{ padding: '14px 28px', borderRadius: '12px', background: '#10B981', color: '#FFFFFF', textDecoration: 'none', fontWeight: 800, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)' }}
              >
                <span>schedule a live maintenance billing demo</span>
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
