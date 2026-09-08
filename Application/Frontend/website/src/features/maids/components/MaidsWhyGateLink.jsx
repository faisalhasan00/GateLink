import React from 'react';
import { ShieldCheck, UserCheck, Clock, RefreshCw, BadgePercent, QrCode } from 'lucide-react';

const ADVANTAGES = [
  {
    icon: QrCode,
    title: 'Pre-Approved Gate Passes',
    desc: 'Helpers carry digital GateLink RFID & QR credentials. Guards allow frictionless entry without calling residents every single morning.',
  },
  {
    icon: UserCheck,
    title: '100% Police & Aadhaar Verified',
    desc: 'Thorough background checks including criminal record clearance, government ID verification, and society reference audits.',
  },
  {
    icon: RefreshCw,
    title: '30-Minute Backup Replacement',
    desc: 'Helper unwell or on sudden leave? Request a free backup in the app, and a trained replacement arrives at your door within 30 minutes.',
  },
  {
    icon: BadgePercent,
    title: 'Zero Brokerage / Agent Fees',
    desc: 'Skip paying ₹3,000 - ₹5,000 in predatory middleman broker commissions. 100% transparent direct compensation.',
  },
  {
    icon: ShieldCheck,
    title: 'Standardized Hygiene Training',
    desc: 'Trained in surface disinfection, separate mop usage for washroom vs living areas, and careful glassware handling.',
  },
  {
    icon: Clock,
    title: 'Live App Attendance Tracking',
    desc: 'Know exactly when your helper enters the gate and completes their tasks via instant GateLink notification alerts.',
  },
];

export default function MaidsWhyGateLink({ onOpenBooking }) {
  return (
    <section id="why-us" className="maids-why-section">
      <div className="maids-section-header">
        <div className="maids-badge">
          <ShieldCheck size={14} />
          <span>The GateLink Trust Guarantee</span>
        </div>
        <h2 className="maids-section-title">
          Why Society Residents Prefer GateLink Maids
        </h2>
        <p className="maids-section-subtitle">
          Unlike unverified informal contacts or expensive agencies, GateLink integrates safety directly with your society gate.
        </p>
      </div>

      <div className="why-maids-grid">
        {ADVANTAGES.map((adv, idx) => {
          const IconComp = adv.icon;
          return (
            <div key={idx} className="why-maid-card">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <IconComp size={24} />
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1C1917', margin: '0 0 8px' }}>
                {adv.title}
              </h3>

              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                {adv.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
