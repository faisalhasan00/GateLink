import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck, 
  ShieldCheck, 
  Building, 
  CheckCircle2, 
  ArrowRight,
  User,
  Wrench
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function SolutionsSection({ onOpenDemo }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activePersona, setActivePersona] = useState('residents');

  const personas = [
    {
      id: 'residents',
      name: 'Residents & Flat Owners',
      icon: <UserCheck size={18} />,
      badge: 'FOR RESIDENTS',
      title: 'Effortless Living, Total Security & Convenience',
      desc: 'Approve guests with 1 tap, pay monthly maintenance bills via Razorpay, track domestic helper attendance, and raise emergency SOS siren alerts.',
      benefits: [
        '1-Tap Visitor Lock Screen Approval & Pre-Approved Guest Passes',
        'Instant Razorpay Maintenance Payments with Automated Receipts',
        'Amenity & Clubhouse Slot Reservations in Seconds',
        '1-Tap Emergency SOS Siren Broadcast to Security & Family'
      ]
    },
    {
      id: 'guards',
      name: 'Security Guards',
      icon: <ShieldCheck size={18} />,
      badge: 'FOR SECURITY',
      title: '5-Second Gate Verification & Incident Reporting',
      desc: 'High-speed multilingual smartphone app for security guards. Verify visitors by OTP, log daily staff entries, and receive instant gate panic sirens.',
      benefits: [
        'Multilingual UI (English, Hindi, Kannada, Tamil, Telugu, Marathi)',
        '5-Second Entry Authorization & QR Passcode Reader',
        'Daily Maid, Cook & Delivery Driver Attendance Verification',
        'Instant Gate Siren Alert Launcher for Emergency Situations'
      ]
    },
    {
      id: 'committee',
      name: 'Management Committee',
      icon: <Building size={18} />,
      badge: 'FOR COMMITTEE',
      title: 'Automated Accounting, Vendor RBAC & Digital Audits',
      desc: 'Take complete control over society finances, track pending maintenance dues, issue digitally signed broadcast notices, and manage vendor SLAs.',
      benefits: [
        'Real-Time Collection Analytics & GST Compliant Accounting',
        'Automated Overdue Reminders via WhatsApp & Mobile Push',
        'Granular Role-Based Permissions for Treasurer & Secretary',
        'Digital Notice Board & Resident Grievance Ticket Management'
      ]
    }
  ];

  const current = personas.find(p => p.id === activePersona);

  return (
    <section id="solutions" style={{ padding: '90px 0', background: isDark ? '#0F172A' : '#FFFFFF', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 50px auto' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563EB', letterSpacing: '1px', textTransform: 'uppercase' }}>TAILORED WORKFLOWS</span>
          <h2 style={{ fontSize: '40px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', letterSpacing: '-1px', marginTop: '8px' }}>
            Built Specifically for Every Stakeholder
          </h2>
        </div>

        {/* Persona Selector Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px' }}>
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePersona(p.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '12px',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
                backgroundColor: activePersona === p.id ? '#2563EB' : (isDark ? '#1E293B' : '#F8FAFC'),
                color: activePersona === p.id ? '#FFFFFF' : (isDark ? '#94A3B8' : '#475569'),
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {p.icon}
              <span>{p.name}</span>
            </button>
          ))}
        </div>

        {/* Workspace Display Card */}
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: isDark ? '#1E293B' : '#F8FAFC',
            borderRadius: '24px',
            padding: '40px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '40px',
            alignItems: 'center'
          }}
        >
          <div>
            <span style={{ fontSize: '11px', fontWeight: 900, color: '#2563EB', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {current.badge}
            </span>
            <h3 style={{ fontSize: '32px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', margin: '8px 0 16px 0' }}>
              {current.title}
            </h3>
            <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#475569', lineHeight: 1.65, marginBottom: '28px' }}>
              {current.desc}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {current.benefits.map((b) => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B' }}>
                  <CheckCircle2 size={18} color="#059669" />
                  <span>{b}</span>
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
                background: '#2563EB',
                color: 'white',
                fontWeight: 900,
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
              }}
            >
              <span>Schedule Live Walkthrough</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Right Visual Highlight Box */}
          <div style={{
            background: isDark ? '#0F172A' : '#FFFFFF',
            borderRadius: '20px',
            padding: '32px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', marginBottom: '12px' }}>
              REAL-TIME WORKFLOW
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '12px' }}>
              Zero Friction Communication
            </div>
            <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6, margin: 0 }}>
              Connect Guard Gatekeepers, Society Residents, and Management Committee Treasurers instantly over encrypted Firebase websockets.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
