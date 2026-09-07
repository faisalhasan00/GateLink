import React from 'react';
import { 
  QrCode, 
  BellRing, 
  Truck, 
  UserCheck, 
  Building2, 
  Car, 
  UserX, 
  ShieldCheck, 
  Users 
} from 'lucide-react';

const FEATURES = [
  {
    icon: QrCode,
    title: 'Pre-Approved QR & OTP Guest Passes',
    desc: 'Residents can generate pre-authorized digital entry passes directly from the resident mobile app. Guests present the digital QR code or 6-digit OTP passcode to security guards at the main gate for immediate, zero-delay verification.',
    highlight: '✓ Instant QR scan & WhatsApp invite sharing'
  },
  {
    icon: BellRing,
    title: 'Instant Resident Approval Notifications',
    desc: 'When unannounced visitors arrive, security guards log their details on the gate terminal. The system immediately delivers an interactive push notification to the resident\'s mobile phone to approve or deny entry with a single tap.',
    highlight: '✓ 1-Tap phone approval & real-time gate confirmation'
  },
  {
    icon: Truck,
    title: 'Delivery & Courier Entry Tracking',
    desc: 'Security staff can quickly record delivery personnel from popular e-commerce and food delivery services. Entry logs link deliveries directly to target flats, alerting residents when their packages arrive at the gate.',
    highlight: '✓ Fast-track delivery check-in & flat notifications'
  },
  {
    icon: UserCheck,
    title: 'Domestic Helper & Staff Attendance',
    desc: 'Manage attendance records for daily domestic staff such as maids, cooks, drivers, and tutors. The system records entry and exit timestamps, instantly notifying associated flats when their helper arrives.',
    highlight: '✓ Staff check-in/out logging & resident alerts'
  },
  {
    icon: Building2,
    title: 'Multi-Gate Visitor Synchronization',
    desc: 'Gated communities with multiple entry and exit gates benefit from synchronized cloud records. Guards at any gate can verify entry passes and log departures with real-time data consistency across all terminals.',
    highlight: '✓ Real-time multi-terminal data synchronization'
  },
  {
    icon: Car,
    title: 'Vehicle Registration Logging',
    desc: 'Record vehicle registration numbers, vehicle types (two-wheeler or four-wheeler), and temporary visitor parking assignments during gate entry to ensure perimeter security and organized parking.',
    highlight: '✓ License plate capture & parking slot mapping'
  },
  {
    icon: UserX,
    title: 'Suspect & Blacklisted Visitor Alerts',
    desc: 'Management committees and residents can flag unauthorized or suspicious individuals. If a flagged phone number or visitor is logged at the gate, guards receive an immediate high-priority warning popup.',
    highlight: '✓ Automated blacklist warnings on guard devices'
  },
  {
    icon: ShieldCheck,
    title: 'Guard-Side Visitor Verification',
    desc: 'A straightforward, multilingual terminal application designed for security guards to quickly look up resident flats, trigger entry approval calls, and verify passcodes without operational delays.',
    highlight: '✓ Streamlined gatekeeper app with large touch controls'
  },
  {
    icon: Users,
    title: 'Expected Guest Invitations',
    desc: 'Residents hosting gatherings or expecting family visits can pre-register multiple guests with custom valid date ranges. Guests receive personalized entry links ensuring seamless access upon arrival.',
    highlight: '✓ Multi-guest pre-registration & scheduled validity'
  }
];

export default function VisitorFeaturesGrid({ isDark }) {
  return (
    <section style={{ marginBottom: '70px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '12px' }}>
          Core Features of GateLink Visitor Management
        </h2>
        <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '680px', margin: '0 auto' }}>
          Explore the verified capabilities that make GateLink a reliable digital gatekeeping solution for modern housing societies.
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
                <IconComp size={26} color="#0EA5E9" />
                <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>{f.title}</h3>
              </div>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '12px' }}>
                {f.desc}
              </p>
              <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
                {f.highlight}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
