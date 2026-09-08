import React from 'react';
import { 
  PackageCheck, 
  ShieldCheck, 
  Clock, 
  Building2, 
  CheckCircle, 
  Sparkles,
  Layers,
  Award
} from 'lucide-react';

export default function InteriorsTrustStrip() {
  const trustItems = [
    {
      id: 1,
      title: '20% Extra Storage',
      desc: 'Smart Modular Space Optimization',
      icon: <PackageCheck size={36} strokeWidth={1.75} />
    },
    {
      id: 2,
      title: '10-Year Warranty',
      desc: 'Flat Replacement Guarantee on Hardware',
      icon: <ShieldCheck size={36} strokeWidth={1.75} />
    },
    {
      id: 3,
      title: '45-Day Move-In',
      desc: 'Guaranteed Handover or Rent on Us',
      icon: <Clock size={36} strokeWidth={1.75} />
    },
    {
      id: 4,
      title: 'Pre-Cleared Gate Passes',
      desc: 'Seamless Entry for Verified Craftsmen',
      icon: <Building2 size={36} strokeWidth={1.75} />
    },
    {
      id: 5,
      title: '146 Quality Checks',
      desc: 'Factory Precision Engineered Finish',
      icon: <Award size={36} strokeWidth={1.75} />
    }
  ];

  return (
    <section className="interiors-trust-strip-section">
      <div className="interiors-trust-strip-container">
        {trustItems.map((item) => (
          <div key={item.id} className="interiors-trust-strip-item">
            {/* Elevated White Circular Icon Badge */}
            <div className="interiors-trust-circle-badge">
              <div className="interiors-trust-circle-icon">
                {item.icon}
              </div>
            </div>

            {/* Title Label */}
            <h3 className="interiors-trust-item-title">
              {item.title}
            </h3>

            {/* Subtle Subtext */}
            <p className="interiors-trust-item-desc">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
