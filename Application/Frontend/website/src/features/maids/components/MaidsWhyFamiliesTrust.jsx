import React from 'react';
import { Sparkles, ShieldCheck, Clock, UserCheck } from 'lucide-react';

const TRUST_PILLARS = [
  {
    id: 'regular-cleaning',
    icon: Sparkles,
    title: 'Regular Cleaning Matters',
    desc: 'Consistent cleaning keeps your home hygienic, fresh and free from dust and germs.',
  },
  {
    id: 'trusted-verified',
    icon: ShieldCheck,
    title: 'Trusted & Verified',
    desc: 'Every Expert is background-checked, Aadhaar verified, and professionally trained.',
  },
  {
    id: 'hourly-pricing',
    icon: Clock,
    title: 'Hourly Based Pricing',
    desc: 'Pay only for what you need. Transparent hourly rates with no hidden fees or commitments.',
  },
  {
    id: 'female-workforce',
    icon: UserCheck,
    title: '100% Female Workforce',
    desc: 'All our Experts are trained women, trusted by families across India.',
  },
];

export default function MaidsWhyFamiliesTrust() {
  return (
    <section className="maids-trust-section">
      <div className="maids-trust-container">
        {/* Section Heading */}
        <div className="maids-trust-header">
          <h2 className="maids-trust-title">
            Why <span className="maids-trust-title-highlight">Families Trust GateLink</span> for House Help
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="maids-trust-grid">
          {TRUST_PILLARS.map((pillar) => {
            const IconComp = pillar.icon;
            return (
              <div key={pillar.id} className="maids-trust-card">
                <div className="maids-trust-icon-box">
                  <IconComp size={30} color="#7C3AED" strokeWidth={2.2} />
                </div>

                <h3 className="maids-trust-card-title">{pillar.title}</h3>

                <p className="maids-trust-card-desc">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
