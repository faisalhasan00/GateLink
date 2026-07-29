import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, Shield, User, Briefcase, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SolutionsSection({ onOpenDemo }) {
  const [activePersona, setActivePersona] = useState('committee');

  const personas = [
    {
      id: 'committee',
      label: 'Management Committee',
      icon: <Building size={18} />,
      title: 'Complete Financial & Administrative Control',
      desc: 'Automate maintenance collection, streamline vendor payments, track complaints, and issue notices to residents instantly.',
      points: [
        'Automated Monthly Maintenance Invoicing & Receipts',
        'Staff Role-Based Matrix Access (RBAC)',
        'Complaint Helpdesk Ticketing & SLA Escalation',
        'Society Audit Logs & Legal Compliance Vault'
      ],
      cta: 'Request Committee Demo'
    },
    {
      id: 'security',
      label: 'Security & Gate Staff',
      icon: <Shield size={18} />,
      title: 'Fortress-Level Gate Operations Made Simple',
      desc: 'Empower security guards with a fast, multilingual app to verify visitors, delivery personnel, and daily helpers without long queues.',
      points: [
        '1-Tap Pre-Approved Entry Verification',
        'Automatic OTP & Passcode Scanning',
        'Instant Siren Sound on Emergency SOS Alerts',
        'Daily Maid & Cook Attendance Check-In'
      ],
      cta: 'Explore Security Workflow'
    },
    {
      id: 'resident',
      label: 'Residents & Flat Owners',
      icon: <User size={18} />,
      title: 'Convenient Living at Your Fingertips',
      desc: 'Experience seamless living with instant visitor alerts, maintenance bill payments via Razorpay, amenity reservations, and SOS support.',
      points: [
        '1-Tap Visitor & Delivery Approval',
        'Instant Maintenance Payment & GST Receipts',
        'Clubhouse, Pool & Gym Slot Reservation',
        'Emergency SOS Alert Button for Family Safety'
      ],
      cta: 'View Resident Experience'
    },
    {
      id: 'builder',
      label: 'Property Managers / Builders',
      icon: <Briefcase size={18} />,
      title: 'Multi-Society SaaS Portfolio Management',
      desc: 'Manage multiple housing societies, commercial complexes, and builder handovers from a central Super Admin portal.',
      points: [
        'Centralized Multi-Tenant Society Onboarding',
        'Global CRM & Lead Conversion Tracking',
        'Automated Subscription & License Management',
        'Ad Broadcast & Promotional Manager'
      ],
      cta: 'Schedule Enterprise Call'
    }
  ];

  const current = personas.find(p => p.id === activePersona);

  return (
    <section id="solutions" style={{ padding: '100px 0', background: '#090D16', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#C084FC', letterSpacing: '1px', textTransform: 'uppercase' }}>TAILORED SOLUTIONS</span>
          <h2 style={{ fontSize: '38px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1px', marginTop: '8px' }}>
            Built specifically for every stakeholder in your community
          </h2>
        </div>

        {/* Persona Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePersona(p.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '14px',
                border: '1px solid',
                borderColor: activePersona === p.id ? '#6366F1' : 'rgba(255, 255, 255, 0.1)',
                backgroundColor: activePersona === p.id ? '#4F46E5' : 'rgba(255, 255, 255, 0.03)',
                color: activePersona === p.id ? '#FFFFFF' : '#94A3B8',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {p.icon}
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Selected Persona Content Box */}
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            alignItems: 'center'
          }}
        >
          <div>
            <h3 style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF', marginBottom: '16px', lineHeight: 1.2 }}>
              {current.title}
            </h3>
            <p style={{ fontSize: '15px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '28px' }}>
              {current.desc}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
              {current.points.map((pt) => (
                <div key={pt} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2E8F0', fontSize: '14px', fontWeight: 600 }}>
                  <CheckCircle2 size={18} color="#34D399" style={{ flexShrink: 0 }} />
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onOpenDemo}
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
              <span>{current.cta}</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '18px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            minHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ fontSize: '12px', color: '#818CF8', fontWeight: 800, letterSpacing: '1px', marginBottom: '8px' }}>KEY OUTCOMES</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>90% Reduction in Gate Waiting Times</div>
            <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
              "SocietySphere transformed our 400-flat complex within 48 hours. Visitors enter seamlessly, residents pay maintenance on time, and our committee has 100% financial transparency."
            </p>
            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#4F46E5', color: 'white', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>S</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>President, Skyline Towers</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>Society of 400+ Units</div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
