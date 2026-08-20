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

export const featureCategories = [
  'All', 
  'Security & Gate', 
  'Finance & Billing', 
  'Operations', 
  'Community', 
  'Governance'
];

export const allFeaturesData = [
  {
    id: 'visitor-mgmt',
    icon: <UserCheck size={28} color="#0EA5E9" />,
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
    icon: <Users size={28} color="#0284C7" />,
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
    icon: <ShieldCheck size={28} color="#1E3A8A" />,
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
    icon: <CreditCard size={28} color="#F59E0B" />,
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
    icon: <ShieldAlert size={28} color="#EF4444" />,
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
    icon: <Car size={28} color="#0EA5E9" />,
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
    icon: <Waves size={28} color="#0284C7" />,
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
    icon: <AlertTriangle size={28} color="#DC2626" />,
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
    icon: <Megaphone size={28} color="#F59E0B" />,
    title: 'Community Communication',
    category: 'Community',
    desc: 'Digital notice board and broadcast channel for official society announcements.',
    benefits: [
      'Instant push notification broadcasts',
      'PDF attachments for bylaws & minutes',
      'Notice read-receipt verification',
      'Emergency alert broadcast channel'
    ]
  },
  {
    id: 'self-gate',
    icon: <QrCode size={28} color="#1E3A8A" />,
    title: 'Self Gate Entry System',
    category: 'Security & Gate',
    desc: 'Automated kiosk and resident self-entry QR pass system for modern smart gates.',
    benefits: [
      'Pre-approved QR visitor passes',
      'Zero-wait kiosk check-in',
      'Resident auto-gate opening pass',
      'Contactless express delivery drop-off'
    ]
  },
  {
    id: 'financial-reports',
    icon: <BarChart3 size={28} color="#0EA5E9" />,
    title: 'Reports & Auditing',
    category: 'Governance',
    desc: 'Real-time financial analytics, audit-ready balance sheets, and collection reports.',
    benefits: [
      '1-Click AGM audit report export',
      'GST collection & ledger reconciliation',
      'Monthly expense vs collection charts',
      'Defaulter historical aging analysis'
    ]
  },
  {
    id: 'super-admin',
    icon: <Building2 size={28} color="#0284C7" />,
    title: 'Multi-Society Management',
    category: 'Governance',
    desc: 'Centralized control portal for builder groups and facility management enterprises.',
    benefits: [
      'Manage 100+ societies from one dashboard',
      'Portfolio-wide collection metrics',
      'Role-based staff access permissions',
      'Central billing & subscription control'
    ]
  }
];
