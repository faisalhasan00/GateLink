import React from 'react';
import { ShieldCheck, QrCode, Clock, BadgeCheck, Wrench, ShieldAlert } from 'lucide-react';

const ADVANTAGES = [
  {
    icon: QrCode,
    title: 'Pre-Approved Gate Passes',
    desc: 'Technicians enter with digital GateLink credentials. Security guards verify their toolkits and identity instantly without bothering residents.',
  },
  {
    icon: ShieldCheck,
    title: '30-Day Re-Work Warranty',
    desc: 'If a tap leaks or a switch malfunctions within 30 days of repair, we send a technician back for free with zero labor charge.',
  },
  {
    icon: Clock,
    title: '15-Minute Rapid Response',
    desc: 'Technicians are pre-stationed near your gated cluster, ensuring rapid emergency attendance for water overflows or power trips.',
  },
  {
    icon: BadgeCheck,
    title: 'Fixed Rate Transparency',
    desc: 'No on-the-spot price inflation. All labor and repair fees are standardized and visible before booking.',
  },
  {
    icon: Wrench,
    title: 'Genuine Spares on MRP',
    desc: 'We only use certified original parts from Havells, Anchor, Jaguar, and Godrej with manufacturer bills.',
  },
  {
    icon: ShieldAlert,
    title: 'Safety & Cleanliness Protocol',
    desc: 'Technicians wear shoe covers, carry floor mats, and clean up all drill dust and wire debris before leaving.',
  },
];

export default function ServicesWhyGateLink() {
  return (
    <section id="why-us" className="srv-why-section">
      <div className="srv-section-header">
        <div className="services-badge">
          <ShieldCheck size={14} />
          <span>The GateLink Service Guarantee</span>
        </div>
        <h2 className="srv-section-title">
          Why Society Residents Trust GateLink Technicians
        </h2>
        <p className="srv-section-subtitle">
          Engineered to give apartment owners peace of mind with verified safety, speed, and clean execution.
        </p>
      </div>

      <div className="why-srv-grid">
        {ADVANTAGES.map((adv, idx) => {
          const IconComp = adv.icon;
          return (
            <div key={idx} className="why-srv-card">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: '#FFE4E6',
                  color: '#E11D48',
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
