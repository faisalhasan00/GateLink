import React from 'react';
import { Award, Clock, Sparkles } from 'lucide-react';

const COOK_TRUST_PILLARS = [
  {
    id: 'trained-only-cooking',
    icon: Award,
    title: 'Trained Only For Cooking',
    desc: 'Every GateLink Home Cook is a specially trained Expert dedicated only to cooking, for taste, hygiene and consistency.',
  },
  {
    id: 'pay-by-duration',
    icon: Clock,
    title: 'Pay By The Duration',
    desc: 'Pricing is based on how long you book, shown in the app before you confirm, with no hidden fees.',
  },
  {
    id: 'cleanup-included',
    icon: Sparkles,
    title: 'Cooking Cleanup Included',
    desc: 'The Expert cleans the utensils used during cooking before the session ends.',
  },
];

export default function CookWhyFamiliesTrust() {
  return (
    <section className="maids-trust-section">
      <div className="maids-trust-container">
        {/* Section Heading */}
        <div className="maids-trust-header">
          <h2 className="maids-trust-title">
            Why <span className="maids-trust-title-highlight">Families Trust GateLink</span> for Home Cook
          </h2>
          <p className="maids-trust-subtitle">
            Trusted by thousands of families for reliable, quality home cooks.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="maids-trust-grid three-cards">
          {COOK_TRUST_PILLARS.map((pillar) => {
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
