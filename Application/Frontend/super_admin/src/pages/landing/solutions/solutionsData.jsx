import React from 'react';
import { User, Shield, Building, Briefcase, Layers, Wrench } from 'lucide-react';

export const SOLUTIONS_PERSONAS = [
  {
    id: 'resident',
    title: 'Residents & Flat Owners',
    roleTag: 'RESIDENT MOBILE COMPANION',
    icon: <User size={24} color="#00B589" />,
    tagline: '1-Tap Convenience, Seamless Approvals & Ultimate Peace of Mind',
    problems: [
      'Frequent disturbing intercom calls for routine deliveries and cabs',
      'Manual cash payments and untracked maintenance receipts',
      'Long waiting queues and disputes over clubhouse and amenity bookings',
      'Lack of an emergency panic button when family members need urgent help'
    ],
    solutions: [
      'Instant 1-tap visitor push notifications with pre-approval QR codes',
      'Seamless online maintenance payments with instant GST PDF receipts',
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
    icon: <Shield size={24} color="#00B589" />,
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
    icon: <Building size={24} color="#00B589" />,
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
    icon: <Briefcase size={24} color="#00B589" />,
    tagline: 'Automated Ledger Reconciliation & 80% Time Saved on Billing',
    problems: [
      'Manual Excel reconciliation taking days at the end of every month',
      'Delayed GST invoicing and manual calculation of late penalties',
      'Difficulty matching bank statements with individual flat payments',
      'Complicated vendor bill tracking and physical cheque management'
    ],
    solutions: [
      'Automated payment gateway bank statement reconciliation engine',
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
      { step: '01', title: 'Online Settlement', desc: 'Payments collected via online payment gateway.' },
      { step: '02', title: 'Auto-Matching', desc: 'System matches transaction IDs with flat ledger.' },
      { step: '03', title: 'GST Invoice Issued', desc: 'Automated GST invoice and receipt emailed to resident.' },
      { step: '04', title: 'Tally Export', desc: 'Export sanitized ledger data directly into Tally ERP.' }
    ],
    screenPreview: {
      title: 'Accountant Reconciliation Desk',
      badge: 'GATEWAY LINKED',
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
    icon: <Layers size={24} color="#00B589" />,
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
    icon: <Wrench size={24} color="#00B589" />,
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
      { step: '02', title: 'Tech Assigned', desc: 'System assigns ticket to duty technician with SLA timer.' },
      { step: '03', title: 'Vendor Check-In', desc: 'Technician scans QR pass at security gate.' },
      { step: '04', title: 'Closure Rating', desc: 'Resident confirms completion and rates service on app.' }
    ],
    screenPreview: {
      title: 'Facility Work-Order Center',
      badge: 'SLA COMPLIANT',
      items: [
        { icon: '🚰', label: 'Plumbing Repair #104', sub: 'Tech Assigned • SLA: 45 Mins Remaining' },
        { icon: '🛗', label: 'Elevator Maintenance', sub: 'Preventive Servicing Scheduled for 3 PM' },
        { icon: '🚗', label: 'Parking Slot Scan', sub: 'Slot B-402 Verified for Flat 402' }
      ]
    }
  }
];
