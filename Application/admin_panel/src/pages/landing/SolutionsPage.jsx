import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import { 
  User, 
  Shield, 
  Building, 
  Briefcase, 
  Wrench, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Layers, 
  TrendingUp, 
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Monitor
} from 'lucide-react';

export default function SolutionsPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [activePersona, setActivePersona] = useState('resident');

  const personas = [
    {
      id: 'resident',
      title: 'Residents & Flat Owners',
      roleTag: 'RESIDENT MOBILE COMPANION',
      icon: <User size={24} color="#818CF8" />,
      tagline: '1-Tap Convenience, Seamless Approvals & Ultimate Peace of Mind',
      problems: [
        'Frequent disturbing intercom calls for routine deliveries and cabs',
        'Manual cash payments and untracked maintenance receipts',
        'Long waiting queues and disputes over clubhouse and amenity bookings',
        'Lack of an emergency panic button when family members need urgent help'
      ],
      solutions: [
        'Instant 1-tap visitor push notifications with pre-approval QR codes',
        'Seamless Razorpay UPI payments with instant GST PDF receipts',
        'Real-time amenity booking calendar with slot reservation passes',
        '1-Tap Emergency SOS alert broadcasting loud sirens to gate guards & family'
      ],
      benefits: [
        '90% reduction in gate intercom noise',
        '100% digital payment tracking & receipts',
        'Instant emergency response within 30 seconds'
      ],
      workflow: [
        { step: '01', title: 'Visitor Arrives at Gate', desc: 'Guard enters cab/delivery details at security gate.' },
        { step: '02', title: 'Push Alert Received', desc: 'Resident gets instant notification on smartphone.' },
        { step: '03', title: '1-Tap Approval', desc: 'Tap "Allow" or "Deny" from app or lock screen.' },
        { step: '04', title: 'Pass Logged', desc: 'Gate pass generated and recorded in digital log.' }
      ],
      screenPreview: {
        title: 'Resident Companion Screen',
        badge: 'ACTIVE RESIDENT',
        items: [
          { icon: '🟢', label: 'Delivery Pre-Approved', sub: 'Amazon Logistics • OTP: 8492' },
          { icon: '💳', label: 'Maintenance Payment', sub: '₹4,500 Paid via UPI (Receipt #892)' },
          { icon: '🏊', label: 'Swimming Pool Slot', sub: 'Today 6:00 PM - 7:00 PM' }
        ]
      }
    },
    {
      id: 'guard',
      title: 'Security Guards & Gatekeepers',
      roleTag: 'MULTILINGUAL GUARD GATEKEEPER',
      icon: <Shield size={24} color="#34D399" />,
      tagline: 'Fortress-Level Security Gate Operations Made 5x Faster',
      problems: [
        'Messy paper registers that get damaged, lost, or tampered with',
        'Long vehicular bottlenecks at entry gates during peak hours',
        'Difficulty verifying daily maids, cooks, drivers, and delivery agents',
        'No emergency protocol during fire, medical, or security incidents'
      ],
      solutions: [
        'Fast 5-second digital check-in app with OTP and QR code scanning',
        'Pre-approved visitor passes reducing gate queues to zero',
        'Daily helper attendance logging with resident notification',
        'Instant emergency siren alarms sounding loudly on guard devices'
      ],
      benefits: [
        '5-second average gate entry time',
        '100% paperless gate logs & photo records',
        'Zero unauthorized entries past the gate'
      ],
      workflow: [
        { step: '01', title: 'Guest Arrives', desc: 'Guest presents QR code or 4-digit passcode.' },
        { step: '02', title: 'Instant Scan', desc: 'Guard scans QR or inputs passcode on Guard App.' },
        { step: '03', title: 'Pre-Approval Match', desc: 'App verifies resident pre-approval automatically.' },
        { step: '04', title: 'Gate Opens', desc: 'Vehicle/Guest cleared for entry in under 5 seconds.' }
      ],
      screenPreview: {
        title: 'Gatekeeper Duty Console',
        badge: 'GATE 1 SECURE',
        items: [
          { icon: '🛡️', label: 'Pre-Approved Entry', sub: 'Uber Cab (MH 12 AB 9421) → Flat 201' },
          { icon: '🧹', label: 'Maid Attendance', sub: 'Sunita (Cook) checked in at 8:15 AM' },
          { icon: '🚨', label: 'Emergency Siren Test', sub: 'All gate sensors active & online' }
        ]
      }
    },
    {
      id: 'committee',
      title: 'Committee Members & Presidents',
      roleTag: 'SOCIETY COMMITTEE CONSOLE',
      icon: <Building size={24} color="#C084FC" />,
      tagline: 'Complete Administrative Governance & 100% Financial Auditability',
      problems: [
        'Persistent maintenance fee defaulters and poor cash flow',
        'Unorganized resident complaints leading to committee friction',
        'Lack of transparency in vendor contracts and society expenses',
        'Risks of non-compliance with local society registrar bylaws'
      ],
      solutions: [
        'Automated monthly maintenance invoicing with late fee enforcement',
        'Helpdesk ticket SLA management with automated staff assignment',
        'Role-Based Access Control (RBAC) restricting sensitive financial actions',
        'Centralized legal document vault with full audit logs'
      ],
      benefits: [
        '98%+ maintenance collection efficiency',
        '100% audit-ready financial ledgers',
        'Zero lost complaint tickets'
      ],
      workflow: [
        { step: '01', title: 'Auto-Bill Generation', desc: 'System generates monthly bills on the 1st of every month.' },
        { step: '02', title: 'Payment Collection', desc: 'Residents pay online; funds settle to society bank account.' },
        { step: '03', title: 'SLA Helpdesk', desc: 'Complaints auto-assigned to staff with SLA tracking.' },
        { step: '04', title: 'Audit Reporting', desc: 'Export monthly P&L and balance sheets with 1 click.' }
      ],
      screenPreview: {
        title: 'Management Committee Dashboard',
        badge: 'SKYLINE TOWERS',
        items: [
          { icon: '📊', label: 'Monthly Collection', sub: '₹8.4 Lakhs Collected (98.4% Efficiency)' },
          { icon: '🔧', label: 'Helpdesk Tickets', sub: '12 Resolved, 0 SLA Breached' },
          { icon: '📜', label: 'Bylaw Compliance', sub: 'Audit Vault Verified & Logged' }
        ]
      }
    },
    {
      id: 'manager',
      title: 'Society Managers & Accountants',
      roleTag: 'FINANCIAL & ACCOUNTING SUITE',
      icon: <Briefcase size={24} color="#FBBF24" />,
      tagline: 'Automated Ledger Reconciliation & 80% Time Saved on Billing',
      problems: [
        'Manual Excel reconciliation taking days at the end of every month',
        'Delayed GST invoicing and manual calculation of late penalties',
        'Difficulty matching bank statements with individual flat payments',
        'Complicated vendor bill tracking and physical cheque management'
      ],
      solutions: [
        'Automated Razorpay bank statement reconciliation engine',
        'Instant GST-compliant invoice generation with automated PDF receipts',
        'Real-time defaulter roster with 1-click WhatsApp/Email reminders',
        'Tally & Excel export integration for effortless tax filing'
      ],
      benefits: [
        '80% accounting time saved',
        'Zero manual payment matching errors',
        'Instant Tally & GST export'
      ],
      workflow: [
        { step: '01', title: 'Online Settlement', desc: 'Payments collected via Razorpay gateway.' },
        { step: '02', title: 'Auto-Matching', desc: 'System matches transaction IDs with flat ledger.' },
        { step: '03', title: 'GST Invoice Issued', desc: 'Automated GST invoice and receipt emailed to resident.' },
        { step: '04', title: 'Tally Export', desc: 'Export sanitized ledger data directly into Tally ERP.' }
      ],
      screenPreview: {
        title: 'Accountant Reconciliation Desk',
        badge: 'RAZORPAY LINKED',
        items: [
          { icon: '✅', label: 'Auto-Reconciled', sub: '142 Flat Payments matched in 2 seconds' },
          { icon: '📄', label: 'GST Receipts Sent', sub: '142 PDF receipts emailed automatically' },
          { icon: '📑', label: 'Tally File Ready', sub: 'Exported Tally XML for July 2026' }
        ]
      }
    },
    {
      id: 'builder',
      title: 'Builders & Real Estate Developers',
      roleTag: 'BUILDER HANDOVER & MULTI-TOWNSHIP',
      icon: <Layers size={24} color="#38BDF8" />,
      tagline: 'Seamless Possession Handovers & Multi-Project Portfolio Management',
      problems: [
        'Chaos and disorganization during multi-flat possession handovers',
        'Inability to maintain builder brand value after project completion',
        'Lack of centralized visibility across multiple township developments',
        'Slow transition of administrative control to newly formed RWAs'
      ],
      solutions: [
        'Super Admin SaaS platform for batch-importing flat and owner data',
        'White-labeled digital onboarding experience for premium home buyers',
        'Centralized dashboard tracking multi-society subscription licenses',
        'Smooth digital handover of RWA administrative rights'
      ],
      benefits: [
        '1-Click batch possession onboarding',
        'Enhanced premium builder brand perception',
        'Centralized multi-project SaaS control'
      ],
      workflow: [
        { step: '01', title: 'Project Creation', desc: 'Developer provisions new society in Super Admin.' },
        { step: '02', title: 'Batch Data Import', desc: 'Import flat inventory & buyer contact rosters.' },
        { step: '03', title: 'Digital Handover', desc: 'Grant digital access credentials to home buyers.' },
        { step: '04', title: 'RWA Transfer', desc: 'Seamlessly transfer committee privileges upon RWA formation.' }
      ],
      screenPreview: {
        title: 'Developer Portfolio Dashboard',
        badge: 'MULTI-TOWNSHIP SaaS',
        items: [
          { icon: '🏢', label: 'Active Projects', sub: '5 Townships (2,400 Total Units)' },
          { icon: '🗝️', label: 'Possession Status', sub: '92% Digital Handovers Completed' },
          { icon: '📈', label: 'RWA Satisfaction', sub: '4.9/5 Rating Across Projects' }
        ]
      }
    },
    {
      id: 'facility',
      title: 'Facility Managers & Maintenance Teams',
      roleTag: 'WORK-ORDER & ASSET MANAGEMENT',
      icon: <Wrench size={24} color="#F472B6" />,
      tagline: 'Zero SLA Breaches, Verified Vendors & Proactive Asset Maintenance',
      problems: [
        'Untracked work orders causing delayed maintenance repairs',
        'Unverified third-party vendors walking around society premises',
        'Frequent breakdown of elevators, DG sets, and water pumps due to missed servicing',
        'Parking slot disputes caused by unmapped vehicle badges'
      ],
      solutions: [
        'Digital work-order ticketing with technician SLA tracking',
        'Vendor QR badge verification at security gate before entry',
        'Scheduled preventive maintenance reminders for critical assets',
        'Digital vehicle badge scanner for instant parking verification'
      ],
      benefits: [
        '50% faster SLA ticket resolution',
        '100% verified vendor entry',
        'Zero unexpected asset breakdowns'
      ],
      workflow: [
        { step: '01', title: 'Ticket Logged', desc: 'Resident reports plumbing/electrical issue on app.' },
        { step: '02', title: 'Technician Assigned', desc: 'Ticket auto-assigned to technician with SLA timer.' },
        { step: '03', title: 'Vendor Gate Verification', desc: 'Vendor scans QR code badge at security gate.' },
        { step: '04', title: 'Work Resolved', desc: 'Resident inspects work and rates service 5 stars.' }
      ],
      screenPreview: {
        title: 'Facility Operations Console',
        badge: 'WORK-ORDER ENGINE',
        items: [
          { icon: '⚡', label: 'DG Set Servicing', sub: 'Preventive Servicing Completed (Log #491)' },
          { icon: '🚰', label: 'Plumbing SLA', sub: 'Resolved in 24 mins • Resident Rating 5★' },
          { icon: '🏷️', label: 'Vendor QR Check', sub: 'Otis Elevator Engineer Verified at Gate' }
        ]
      }
    }
  ];

  const current = personas.find(p => p.id === activePersona);

  return (
    <div style={{ backgroundColor: '#020617', color: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      {/* Header Banner */}
      <section style={{
        paddingTop: '160px',
        paddingBottom: '60px',
        background: 'radial-gradient(circle at 50% 20%, #1E1B4B 0%, #0F172A 70%, #020617 100%)',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', fontSize: '13px', fontWeight: 800, marginBottom: '16px' }}>
              <Sparkles size={14} /> PERSONA-BASED SOLUTIONS
            </div>
            <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1.5px', margin: '0 0 16px 0' }}>
              How SocietySphere Serves Every User Role
            </h1>
            <p style={{ fontSize: '18px', color: '#94A3B8', maxWidth: '720px', margin: '0 auto 40px auto', lineHeight: 1.6 }}>
              Select a user role below to see how SocietySphere solves specific daily pain points with automated workflows, live screens, and measurable outcomes.
            </p>

            {/* Persona Selector Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {personas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePersona(p.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 20px',
                    borderRadius: '14px',
                    border: '1px solid',
                    borderColor: activePersona === p.id ? '#6366F1' : 'rgba(255, 255, 255, 0.1)',
                    backgroundColor: activePersona === p.id ? '#4F46E5' : 'rgba(255, 255, 255, 0.05)',
                    color: activePersona === p.id ? '#FFFFFF' : '#94A3B8',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: activePersona === p.id ? '0 8px 20px rgba(79, 70, 229, 0.4)' : 'none'
                  }}
                >
                  {p.icon}
                  <span>{p.title}</span>
                </button>
              ))}
            </div>

          </motion.div>
        </div>
      </section>

      {/* Main Persona Detail Workspace */}
      <section style={{ padding: '60px 0 100px 0', background: '#020617' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}
            >
              
              {/* Top Summary Card & Interactive Screen Preview */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.95) 100%)',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                display: 'grid',
                gridTemplateColumns: '1.2fr 0.8fr',
                gap: '40px',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#818CF8', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                    {current.roleTag}
                  </span>
                  <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#FFFFFF', margin: '8px 0 16px 0', lineHeight: 1.1 }}>
                    {current.title}
                  </h2>
                  <p style={{ fontSize: '16px', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '28px', fontWeight: 600 }}>
                    "{current.tagline}"
                  </p>

                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setIsDemoModalOpen(true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '14px 28px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '14px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(79, 70, 229, 0.4)'
                      }}
                    >
                      <span>Book Free Live Demo</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Glassmorphic UI Screen Preview */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ color: 'white', fontWeight: 800, fontSize: '14px' }}>{current.screenPreview.title}</div>
                    <span style={{ fontSize: '10px', fontWeight: 900, background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '3px 8px', borderRadius: '10px' }}>
                      {current.screenPreview.badge}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {current.screenPreview.items.map((item, idx) => (
                      <div key={idx} style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '20px' }}>{item.icon}</span>
                        <div>
                          <div style={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>{item.label}</div>
                          <div style={{ color: '#94A3B8', fontSize: '11px' }}>{item.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Problems vs Solutions Comparison Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Problems Card */}
                <div style={{ background: 'rgba(239, 68, 68, 0.05)', borderRadius: '20px', padding: '32px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#FCA5A5', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>PAIN POINTS BEFORE SOCIETASPHERE</div>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', marginBottom: '20px' }}>Legacy Friction & Frustration</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {current.problems.map((prob) => (
                      <div key={prob} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#CBD5E1', fontSize: '13px', lineHeight: 1.5 }}>
                        <span style={{ color: '#EF4444', fontWeight: 900, fontSize: '16px' }}>✕</span>
                        <span>{prob}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Solutions Card */}
                <div style={{ background: 'rgba(16, 185, 129, 0.05)', borderRadius: '20px', padding: '32px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#34D399', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>TRANSFORMATION WITH SOCIETASPHERE</div>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', marginBottom: '20px' }}>Automated Intelligent Workflows</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {current.solutions.map((sol) => (
                      <div key={sol} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#E2E8F0', fontSize: '13px', lineHeight: 1.5, fontWeight: 600 }}>
                        <CheckCircle2 size={18} color="#34D399" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{sol}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Measurable Outcomes & Benefits */}
              <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '20px', padding: '28px 32px', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                {current.benefits.map((b, idx) => (
                  <div key={b} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#818CF8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>KEY METRIC OUTCOME #{idx + 1}</div>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF' }}>{b}</div>
                  </div>
                ))}
              </div>

              {/* Step-by-Step Workflow Timeline */}
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '24px', padding: '36px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#38BDF8', letterSpacing: '1px', textTransform: 'uppercase' }}>DAILY USAGE TIMELINE</span>
                  <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#FFFFFF', marginTop: '6px' }}>Step-by-Step {current.title} Workflow</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                  {current.workflow.map((w, idx) => (
                    <motion.div
                      key={w.step}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', position: 'relative' }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: 900, color: '#818CF8', background: 'rgba(99, 102, 241, 0.2)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                        {w.step}
                      </div>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0' }}>{w.title}</h4>
                      <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>{w.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* Footer */}
      <FooterSection />

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
