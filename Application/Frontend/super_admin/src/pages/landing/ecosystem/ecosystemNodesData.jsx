import React from 'react';
import { UserCheck, ShieldCheck, User, Building, Wrench, Truck, Globe } from 'lucide-react';

export const ECOSYSTEM_NODES = [
  {
    id: 'visitor',
    title: 'Visitor',
    role: 'Guest / Cab / Delivery Agent',
    icon: <UserCheck size={28} color="#818CF8" />,
    color: '#818CF8',
    desc: 'Initiates entry request at gate via QR passcode scan or gatekeeper log.',
    dataInput: 'Pre-approved pass code or visitor phone/photo entry request',
    dataOutput: 'Transmits visitor credentials & gate pass token to Guard App',
    details: [
      '1-Tap QR passcode scanning at entry gates',
      'Automatic cab (Uber/Ola) and delivery (Amazon/Flipkart) classification',
      'Instant photo capture & blacklist cross-check',
      'Zero-wait pre-approved visitor entry'
    ]
  },
  {
    id: 'guard',
    title: 'Security Guard',
    role: 'Gatekeeper & Duty Officer',
    icon: <ShieldCheck size={28} color="#34D399" />,
    color: '#34D399',
    desc: 'Verifies visitor credentials and triggers real-time push alert to resident.',
    dataInput: 'Visitor request token & vehicle number plate log',
    dataOutput: 'Triggers high-priority push notification signal to Resident App',
    details: [
      'Multilingual Guard App (English, Hindi, Kannada, Tamil, etc.)',
      '5-second average gate entry verification',
      'Daily helper (Maid/Cook/Driver) attendance check-in',
      'Instant Emergency SOS siren receiver'
    ]
  },
  {
    id: 'resident',
    title: 'Resident',
    role: 'Flat Owner & Tenant',
    icon: <User size={28} color="#C084FC" />,
    color: '#C084FC',
    desc: 'Approves visitor entry, pays maintenance via Razorpay, & logs tickets.',
    dataInput: 'Visitor arrival push alert & monthly maintenance invoice',
    dataOutput: 'Transmits 1-tap entry approval, payment confirmation, or SOS panic alert',
    details: [
      '1-Tap visitor approval from lock screen notification',
      'Razorpay UPI/Card maintenance payment & instant PDF receipt',
      'Clubhouse, pool & tennis court slot reservation',
      '1-Tap Emergency SOS alert button for family safety'
    ]
  },
  {
    id: 'admin',
    title: 'Admin',
    role: 'Management Committee',
    icon: <Building size={28} color="#FBBF24" />,
    color: '#FBBF24',
    desc: 'Oversees financial ledgers, staff RBAC permissions, & helpdesk tickets.',
    dataInput: 'Razorpay settlement reports, complaint tickets, and gate traffic logs',
    dataOutput: 'Issues work-order tasks to staff, generates GST invoices, & publishes notices',
    details: [
      'Real-time society financial dashboard & 98%+ collection efficiency',
      'RBAC staff permission matrix for committee members',
      'Automated helpdesk ticket SLA management',
      'Centralized legal document vault & audit logs'
    ]
  },
  {
    id: 'staff',
    title: 'Maintenance Staff',
    role: 'Technician / Electrician / Plumber',
    icon: <Wrench size={28} color="#F87171" />,
    color: '#F87171',
    desc: 'Executes assigned work orders, resolves resident complaints, & orders vendor parts.',
    dataInput: 'Assigned complaint work order & technician SLA timer',
    dataOutput: 'Transmits ticket resolution status & requests vendor gate entry pass',
    details: [
      'Mobile work-order dispatch & technician SLA tracking',
      'Direct resident rating & work photo verification',
      'Inventory & spare parts request workflow',
      'Facility preventive asset maintenance checklist'
    ]
  },
  {
    id: 'vendor',
    title: 'Vendor',
    role: 'Contractor & Service Provider',
    icon: <Truck size={28} color="#38BDF8" />,
    color: '#38BDF8',
    desc: 'Fulfills facility contracts, Elevator/DG maintenance, & enters gate with QR badge.',
    dataInput: 'Vendor QR gate badge & servicing work order contract',
    dataOutput: 'Submits completed servicing logs & digital invoice to Admin',
    details: [
      'Time-bounded vendor QR entry pass verification',
      'Scheduled elevator, DG set, and water pump servicing logs',
      'Vendor GST invoice submission & approval pipeline',
      'Verified vendor badge credentials'
    ]
  },
  {
    id: 'society',
    title: 'Society OS',
    role: 'Unified RWA Platform',
    icon: <Globe size={28} color="#A7F3D0" />,
    color: '#A7F3D0',
    desc: 'Aggregates data signals from all 6 stakeholders into a 100% secure governance platform.',
    dataInput: 'Real-time telemetry & data events from all 6 ecosystem nodes',
    dataOutput: '100% Audit compliance, 24x7 gate security, & maximum property valuation',
    details: [
      '256-Bit SSL Data Encryption & AWS Cloud Infrastructure',
      'Multi-tenant data isolation & GDPR/DPDP privacy compliance',
      '1-Click automated PDF/Excel/CSV data exports',
      '99.9% Platform SLA availability guaranteed'
    ]
  }
];
