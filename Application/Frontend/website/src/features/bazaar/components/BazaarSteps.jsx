import React from 'react';
import { Camera, BellRing, Users, Wallet } from 'lucide-react';

export default function BazaarSteps() {
  const steps = [
    {
      number: '1',
      icon: '📸',
      title: 'Snap & Post in 60s',
      desc: 'Take 2-3 photos of your item, set your price, and list it with your verified flat number with zero listing fees.'
    },
    {
      number: '2',
      icon: '🔔',
      title: 'Neighbors Get Notified',
      desc: 'Your listing instantly broadcasts to all verified residents in your society app feed and interest groups.'
    },
    {
      number: '3',
      icon: '🤝',
      title: '2-Min Lobby Handover',
      desc: 'Meet in the lobby or clubhouse. The buyer inspects the product in person with zero shipping or transit risk.'
    },
    {
      number: '4',
      icon: '💸',
      title: 'Instant Direct Payment',
      desc: 'Get paid instantly via UPI or cash directly to your bank account. 100% of the money stays with you.'
    }
  ];

  return (
    <section id="how-it-works" className="bazaar-steps-section">
      <div className="bazaar-section-header">
        <div className="bazaar-section-badge">
          <span>Simple 4-Step Process</span>
        </div>
        <h2 className="bazaar-section-title">
          How Buying & Selling Works on GateLink Bazaar
        </h2>
        <p className="bazaar-section-subtitle">
          Hyper-local commerce designed for speed, safety, and community trust.
        </p>
      </div>

      <div className="bazaar-steps-grid">
        {steps.map((step) => (
          <div key={step.number} className="bazaar-step-card">
            <div className="bazaar-step-number">{step.number}</div>
            <div className="bazaar-step-icon">{step.icon}</div>
            <h3 className="bazaar-step-title">{step.title}</h3>
            <p className="bazaar-step-desc">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
