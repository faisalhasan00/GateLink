import React from 'react';
import {
  UserCheck,
  Users,
  ShieldCheck,
  CreditCard,
  ShieldAlert,
  Car,
  Waves,
  AlertTriangle,
  Megaphone,
  QrCode,
  BarChart3,
  Building2
} from 'lucide-react';

export const FEATURE_CATEGORIES = [
  'All',
  'Security & Gate',
  'Finance & Billing',
  'Operations',
  'Community',
  'Governance'
];

export const ALL_FEATURES = [
  {
    id: 'visitor-mgmt',
    icon: <UserCheck size={28} color="#00B589" />,
    title: 'Visitor Management',
    category: 'Security & Gate',
    desc: 'Real-time visitor tracking with instant resident approval notifications on mobile devices.',
    benefits: [
      '1-Tap resident mobile approval & rejection',
      'Delivery & cab auto-entry approvals',
      'Searchable historical gate entry logs',
      'Blacklist & suspect visitor alerts'
    ]
  },
  {
    id: 'resident-mgmt',
    icon: <Users size={28} color="#00B589" />,
    title: 'Resident Management',
    category: 'Operations',
    desc: 'Comprehensive resident directory for flat owners, tenants, and family members.',
    benefits: [
      'Owner & tenant profile verification',
      'Privacy settings & directory visibility control',
      'Roster management by block/flat',
      'Digital resident ID cards'
    ]
  },
  {
    id: 'guard-app',
    icon: <ShieldCheck size={28} color="#00B589" />,
    title: 'Guard Gatekeeper App',
    category: 'Security & Gate',
    desc: 'Multilingual gatekeeper application for security guards at society entry/exit gates.',
    benefits: [
      'Fast OTP & passcode verification',
      'Vehicle plate logging & gatekeeper records',
      'Daily maid/cook check-in & check-out',
      'Guard shift duty management'
    ]
  },
  {
    id: 'maintenance-billing',
    icon: <CreditCard size={28} color="#00B589" />,
    title: 'Pay Maintenance Bill Online',
    category: 'Finance & Billing',
    desc: 'Automated monthly maintenance generation with online payment gateway integration.',
    benefits: [
      'Instant UPI & Card maintenance payments',
      'Automated GST invoicing & PDF receipts',
      'Automated payment reminders via SMS/WhatsApp',
      'Defaulter list tracking & late fee rules'
    ]
  },
  {
    id: 'complaints',
    icon: <ShieldAlert size={28} color="#00B589" />,
    title: 'Complaints & Helpdesk',
    category: 'Operations',
    desc: 'Helpdesk ticketing system for resolving resident complaints and maintenance issues.',
    benefits: [
      'Plumbing, Electrical & General categories',
      'SLA tracking & escalation matrix',
      'Staff assignment & progress updates',
      'Resident satisfaction ratings'
    ]
  },
  {
    id: 'parking',
    icon: <Car size={28} color="#00B589" />,
    title: 'Parking Management',
    category: 'Operations',
    desc: 'Intelligent parking slot allocation and visitor parking management system.',
    benefits: [
      'Resident vehicle RFID & slot mapping',
      'Visitor parking pass allocation',
      'Unauthorized vehicle alert system',
      'EV charging slot management'
    ]
  },
  {
    id: 'amenities',
    icon: <Waves size={28} color="#00B589" />,
    title: 'Amenities & Clubhouse',
    category: 'Community',
    desc: 'Slot booking engine for clubhouse, swimming pool, tennis court, and banquet hall.',
    benefits: [
      'Conflict-free slot booking calendar',
      'Online amenity fee collection',
      'Capacity caps & slot usage rules',
      'Instant booking confirmation pass'
    ]
  },
  {
    id: 'emergency-sos',
    icon: <AlertTriangle size={28} color="#00B589" />,
    title: 'Emergency SOS Panic Siren',
    category: 'Security & Gate',
    desc: 'Critical emergency alert system triggering loud sirens on guard devices and committee alerts.',
    benefits: [
      '1-Tap resident panic button',
      'Instant loud sirens on guard devices',
      'GPS location & flat number sharing',
      'Emergency contact auto-alert'
    ]
  },
  {
    id: 'communication',
    icon: <Megaphone size={28} color="#00B589" />,
    title: 'Community Communication',
    category: 'Community',
    desc: 'Digital notice board and broadcast channel for official society announcements.',
    benefits: [
      'Instant push notification broadcasts',
      'PDF attachments for bylaws & minutes',
      'Read receipts for critical notices',
      'Categorized announcements board'
    ]
  },
  {
    id: 'qr-pass',
    icon: <QrCode size={28} color="#00B589" />,
    title: 'Visitor QR Pass',
    category: 'Security & Gate',
    desc: 'Pre-approved digital QR and passcode passes for guests, cabs, and delivery agents.',
    benefits: [
      'Zero wait time at security gates',
      '1-Click WhatsApp pass sharing',
      'Time-bounded & single/multi-use passes',
      'Instant gatekeeper QR scanning'
    ]
  },
  {
    id: 'reports-analytics',
    icon: <BarChart3 size={28} color="#00B589" />,
    title: 'Reports & Analytics',
    category: 'Governance',
    desc: 'Executive reports dashboard with financial collection trends and CSV/PDF data export.',
    benefits: [
      'Monthly collection & revenue charts',
      'Gate traffic & visitor frequency metrics',
      '1-Click Excel, CSV, and PDF exports',
      'Scheduled automated reports'
    ]
  },
  {
    id: 'multi-society',
    icon: <Building2 size={28} color="#00B589" />,
    title: 'Multi-Society Township CRM',
    category: 'Governance',
    desc: 'Super Admin dashboard for managing multiple societies, licensing, and builder handovers.',
    benefits: [
      'Multi-tenant society onboarding',
      'Subscription tier & licensing manager',
      'Global CRM & sales lead pipeline',
      'Cross-society ad campaign manager'
    ]
  }
];
