import React from 'react';
import { User, Shield, Building, Briefcase, Wrench } from 'lucide-react';

export const personasData = [
  {
    id: 'resident',
    title: 'Residents & Flat Owners',
    roleTag: 'RESIDENT MOBILE COMPANION',
    icon: <User size={24} color="#0EA5E9" />,
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
    icon: <Shield size={24} color="#0EA5E9" />,
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
    icon: <Building size={24} color="#0EA5E9" />,
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
      'Digital accounting ledger with 1-click audit report downloads',
      'Official digital notice board with confirmed read receipts'
    ],
    benefits: [
      '98% on-time maintenance collections',
      '75% faster complaint turnaround',
      '100% audit-compliant financial reports'
    ],
    workflow: [
      { step: '01', title: 'Auto-Invoice Generation', desc: 'Monthly dues auto-calculated & dispatched on 1st of month.' },
      { step: '02', title: 'Automated Reminders', desc: 'Smart WhatsApp & App alerts sent before due date.' },
      { step: '03', title: 'Instant Reconciliation', desc: 'Payments reconciled into society bank ledger in real-time.' },
      { step: '04', title: '1-Click Audit Report', desc: 'Download GST & income reports for AGM presentation.' }
    ],
    screenPreview: {
      title: 'Management Committee Dashboard',
      badge: 'RWA COMMAND',
      items: [
        { icon: '💰', label: 'March Maintenance Dues', sub: '₹4,85,000 / ₹5,10,000 Collected (95%)' },
        { icon: '📢', label: 'AGM Notice Dispatched', sub: '284 / 300 Residents Confirmed' },
        { icon: '🛠️', label: 'Lift Repair SLA', sub: 'Ticket #492 Assigned to Otis Engg' }
      ]
    }
  },
  {
    id: 'partners',
    title: 'Growth Partners & Affiliates',
    roleTag: 'PARTNER & AFFILIATE PORTAL',
    icon: <Briefcase size={24} color="#0EA5E9" />,
    tagline: 'Earn Up to ₹35,000/Month by Recommending GateLink to RWAs',
    problems: [
      'Hard to monetize relationships with housing societies and apartment committees',
      'Unclear commission payouts and delay in lead tracking',
      'Lack of professional pitch materials and live demo credentials'
    ],
    solutions: [
      'Dedicated partner dashboard with 60-second society lead submission',
      'Transparent tiered payouts: ₹5,000/society + recurring monthly revenue share',
      'Complete marketing toolkit with co-branded brochures, decks, and contracts'
    ],
    benefits: [
      'Up to ₹5,000 per signed society',
      'Recurring 10% monthly revenue share',
      'Real-time lead status & wallet payouts'
    ],
    workflow: [
      { step: '01', title: 'Register as Partner', desc: 'Sign up in 30 seconds and get your referral link.' },
      { step: '02', title: 'Submit Society Lead', desc: 'Enter RWA contact info or share your partner code.' },
      { step: '03', title: 'Demo & Closing', desc: 'GateLink sales team handles live demo & contract signing.' },
      { step: '04', title: 'Instant Payout', desc: 'Commission credited directly to your bank account / UPI.' }
    ],
    screenPreview: {
      title: 'Partner Earnings Console',
      badge: 'ACTIVE PARTNER',
      items: [
        { icon: '💸', label: 'Total Earnings', sub: '₹42,500 Withdrawn to HDFC Bank' },
        { icon: '📈', label: 'Leads in Pipeline', sub: '4 Societies Demo Scheduled' },
        { icon: '🏢', label: 'Active Societies', sub: '8 Communities Live & Transacting' }
      ]
    }
  },
  {
    id: 'vendors',
    title: 'Facility & Security Vendors',
    roleTag: 'FACILITY & VENDOR OPERATIONS',
    icon: <Wrench size={24} color="#0EA5E9" />,
    tagline: 'Streamline Field Staff Attendance, Rostering & Service SLAs',
    problems: [
      'Guards and housekeeping staff marking proxy or ghost attendance',
      'No audit trail of technician visits or ticket resolution times',
      'Slow payment approvals from society management committees'
    ],
    solutions: [
      'Biometric and QR-based shift check-in with GPS verification',
      'Work order ticket dispatch directly to technician smartphones',
      'Digital service completion sign-off with customer feedback rating'
    ],
    benefits: [
      'Zero proxy attendance',
      '100% SLA compliance visibility',
      'Fast invoice approval & payout'
    ],
    workflow: [
      { step: '01', title: 'Shift Punch-In', desc: 'Staff marks attendance at gate terminal via QR code.' },
      { step: '02', title: 'Task Dispatch', desc: 'Assigned maintenance tasks appear on mobile phone.' },
      { step: '03', title: 'Job Completion', desc: 'Technician takes photo proof & obtains resident OTP.' },
      { step: '04', title: 'Invoice Clearance', desc: 'Society admin verifies job & clears monthly vendor bill.' }
    ],
    screenPreview: {
      title: 'Vendor Staff Command',
      badge: 'VENDOR VERIFIED',
      items: [
        { icon: '⏱️', label: 'Shift Attendance', sub: '18 / 18 Security Guards On-Duty' },
        { icon: '🔧', label: 'Plumbing SLA', sub: 'Ticket #301 Cleared in 22 mins' },
        { icon: '⭐', label: 'Resident Rating', sub: '4.9 / 5.0 Average Service Score' }
      ]
    }
  }
];
