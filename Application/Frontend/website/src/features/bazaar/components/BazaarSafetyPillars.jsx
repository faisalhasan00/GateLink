import React from 'react';
import { ShieldCheck, Check, X, Sparkles, Building, Lock } from 'lucide-react';

export default function BazaarSafetyPillars() {
  const comparisonRows = [
    {
      feature: 'User Identity & Trust',
      gatelink: '100% GateLink & RWA Verified Residents (Flat & Tower tagged)',
      external: 'Anonymous accounts, fake profiles & non-resident spammers'
    },
    {
      feature: 'Inspection & Pickup',
      gatelink: '1-minute walk to neighbor’s flat or society clubhouse',
      external: 'Drive across traffic or deal with expensive courier hassles'
    },
    {
      feature: 'Payment Safety & Scams',
      gatelink: 'Safe face-to-face handover or direct UPI after physical check',
      external: 'Common advance token scams & fake QR code phishing'
    },
    {
      feature: 'Gate Security & Strangers',
      gatelink: 'Zero strangers entering society gate for product testing',
      external: 'Unknown buyers arguing with security guards at the entry gate'
    },
    {
      feature: 'Platform Fees & Commission',
      gatelink: '0% Lifetime Commission — 100% Free for all residents',
      external: 'Paid feature boosts, hidden promotion charges & noisy spam'
    }
  ];

  return (
    <section id="why-bazaar" className="bazaar-safety-section">
      <div className="bazaar-safety-container">
        <div className="bazaar-section-header">
          <div className="bazaar-section-badge">
            <Lock size={14} />
            <span>Why GateLink Bazaar</span>
          </div>
          <h2 className="bazaar-section-title">
            The Safe Way to Buy & Sell in Gated Communities
          </h2>
          <p className="bazaar-section-subtitle">
            Why deal with strangers and scam risks when you can buy from neighbors living just three floors away?
          </p>
        </div>

        <div className="bazaar-comparison-card">
          <div className="bazaar-comparison-grid">
            <div className="bazaar-comp-header" style={{ color: '#0f172a' }}>
              Safety & Convenience Matrix
            </div>
            <div className="bazaar-comp-header gatelink-bazaar">
              ✨ GateLink Bazaar
            </div>
            <div className="bazaar-comp-header external-apps">
              ⚠️ OLX / Facebook Marketplace
            </div>

            {comparisonRows.map((row, idx) => (
              <div key={idx} className="bazaar-comp-row">
                <div className="bazaar-comp-cell feature-name">
                  {row.feature}
                </div>
                <div className="bazaar-comp-cell gatelink-val">
                  <Check size={18} style={{ color: '#059669', flexShrink: 0 }} />
                  <span>{row.gatelink}</span>
                </div>
                <div className="bazaar-comp-cell external-val">
                  <X size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
                  <span>{row.external}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
