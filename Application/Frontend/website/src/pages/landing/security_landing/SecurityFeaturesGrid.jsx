import React from 'react';
import { 
  Smartphone, 
  QrCode, 
  Clock, 
  AlertTriangle, 
  Car, 
  Radio 
} from 'lucide-react';

const FEATURES = [
  {
    icon: Smartphone,
    title: 'Guard Mobile Gatekeeper App',
    desc: 'A dedicated Android application built for gatekeepers with live visitor streams, active inside status indicators, on-spot walk-in photo registration, and 1-tap exit check-out recording.',
    highlight: '✓ Real-time gate dashboard & 1-tap exit check-out recording'
  },
  {
    icon: QrCode,
    title: 'QR & OTP Gate Entry Verification',
    desc: 'Guards verify pre-approved guest invites by scanning dynamic QR codes directly using device cameras or validating 6-digit numeric passcodes without requiring physical contact.',
    highlight: '✓ Camera QR pass scanning & manual 6-digit OTP verification'
  },
  {
    icon: Clock,
    title: 'Night Patrol & QR Checkpoint Tracking',
    desc: 'Ensure guard alertness during night shifts. Guards scan physical QR checkpoint tags across society towers, perimeter walls, and basements to log timestamped patrol records with admin sync.',
    highlight: '✓ Physical QR tag scanning & scheduled patrol route logging'
  },
  {
    icon: AlertTriangle,
    title: 'One-Touch Emergency SOS Siren Alerts',
    desc: 'In urgent situations—such as Medical emergencies, Fire hazards, Security Threats, or Lift breakdowns—residents and guards trigger instant siren alarms across guard terminals and RWA dashboards.',
    highlight: '✓ Categorized emergency siren broadcast & flat contact display'
  },
  {
    icon: Car,
    title: 'Vehicle License Plate & Exit Logging',
    desc: 'Guards log vehicle license plate numbers, categorize entries (2-wheeler, 4-wheeler, commercial auto), and record precise exit timestamps to keep track of external vehicles inside the community.',
    highlight: '✓ Vehicle registration number logging & exit timestamp tracking'
  },
  {
    icon: Radio,
    title: 'Multi-Gate Cloud Synchronization',
    desc: 'Real-time cloud database synchronization ensures that Main Gates, Service Entrances, and Tower Checkpoints stay aligned. Visitor entries logged at one gate are visible at all other gates instantly.',
    highlight: '✓ Real-time cross-gate synchronization across all guard devices'
  }
];

export default function SecurityFeaturesGrid({ isDark }) {
  return (
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
        {FEATURES.map((f, i) => {
          const IconComp = f.icon;
          return (
            <div 
              key={i} 
              style={{ 
                background: isDark ? '#0F172A' : '#FFFFFF', 
                padding: '28px', 
                borderRadius: '16px', 
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', 
                boxShadow: '0 4px 14px rgba(0,0,0,0.04)' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <IconComp size={26} color="#EF4444" />
                <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>{f.title}</h3>
              </div>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                {f.desc}
              </p>
              <div style={{ fontSize: '13px', color: '#EF4444', fontWeight: 700 }}>
                {f.highlight}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
