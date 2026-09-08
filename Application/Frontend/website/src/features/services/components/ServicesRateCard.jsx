import React, { useState } from 'react';
import { BadgeCheck, ArrowRight, ShieldCheck } from 'lucide-react';

const RATE_DATA = {
  electrical: [
    { service: 'Ceiling Fan Installation / Uninstallation', price: '₹149', warranty: '30 Days' },
    { service: 'Switch / Socket Replacement (up to 3)', price: '₹99', warranty: '30 Days' },
    { service: 'MCB Tripping / Fuse Replacement', price: '₹199', warranty: '60 Days' },
    { service: 'Chandelier / Hanging Light Mounting', price: '₹299', warranty: '30 Days' },
    { service: 'Geyser Electrical Connection Check', price: '₹149', warranty: '30 Days' },
  ],
  plumbing: [
    { service: 'Tap Repair / Cartridge Replacement', price: '₹129', warranty: '30 Days' },
    { service: 'Health Faucet / Jet Spray Installation', price: '₹99', warranty: '30 Days' },
    { service: 'Kitchen Sink / Basin Drain Unclogging', price: '₹199', warranty: '30 Days' },
    { service: 'Flush Tank Internal Valve Overhaul', price: '₹249', warranty: '60 Days' },
    { service: 'Water Purifier (RO) Inlet Plumbing', price: '₹199', warranty: '30 Days' },
  ],
  ac: [
    { service: 'Split AC Deep Foam Jet Service (Indoor + Outdoor)', price: '₹499', warranty: '90 Days' },
    { service: 'AC Gas Refill (R32 / R410A Genuine)', price: '₹1,999', warranty: '90 Days' },
    { service: 'AC Water Leakage & Drain Cleaning', price: '₹299', warranty: '30 Days' },
    { service: 'PCB Board Diagnostic & Repair', price: '₹449', warranty: '60 Days' },
  ],
  carpentry: [
    { service: 'Main Door Lock / Deadbolt Replacement', price: '₹249', warranty: '60 Days' },
    { service: 'Wardrobe Hydraulic Hinge Alignment (per pair)', price: '₹149', warranty: '30 Days' },
    { service: 'Curtain Rod / Blind Wall Drilling (per window)', price: '₹129', warranty: '30 Days' },
    { service: 'Bed Assembly / Disassembly', price: '₹499', warranty: '30 Days' },
  ],
};

export default function ServicesRateCard({ onOpenBooking }) {
  const [activeTab, setActiveTab] = useState('electrical');

  const currentList = RATE_DATA[activeTab] || RATE_DATA.electrical;

  return (
    <section id="ratecard" className="srv-ratecard-section">
      <div className="srv-section-header">
        <div className="services-badge">
          <BadgeCheck size={14} />
          <span>Standardized Rate Card</span>
        </div>
        <h2 className="srv-section-title">
          100% Fixed Pricing, Zero Haggling
        </h2>
        <p className="srv-section-subtitle">
          Transparent labor charges approved for housing societies. Genuine spare parts billed on actual MRP.
        </p>
      </div>

      <div className="ratecard-wrapper">
        {/* Category Tabs */}
        <div className="ratecard-tabs">
          <button
            type="button"
            className={`ratecard-tab-btn ${activeTab === 'electrical' ? 'active' : ''}`}
            onClick={() => setActiveTab('electrical')}
          >
            ⚡ Electrical
          </button>
          <button
            type="button"
            className={`ratecard-tab-btn ${activeTab === 'plumbing' ? 'active' : ''}`}
            onClick={() => setActiveTab('plumbing')}
          >
            🚰 Plumbing
          </button>
          <button
            type="button"
            className={`ratecard-tab-btn ${activeTab === 'ac' ? 'active' : ''}`}
            onClick={() => setActiveTab('ac')}
          >
            ❄️ AC Service
          </button>
          <button
            type="button"
            className={`ratecard-tab-btn ${activeTab === 'carpentry' ? 'active' : ''}`}
            onClick={() => setActiveTab('carpentry')}
          >
            🪚 Carpentry
          </button>
        </div>

        {/* Pricing Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="ratecard-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Standard Rate</th>
                <th>Warranty</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentList.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '600', color: '#1E293B' }}>{item.service}</td>
                  <td style={{ fontWeight: '800', color: '#BE123C', fontSize: '1.05rem' }}>{item.price}</td>
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        color: '#059669',
                        background: '#DCFCE7',
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      <ShieldCheck size={13} />
                      {item.warranty}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => onOpenBooking && onOpenBooking({ service: item.service })}
                      style={{
                        background: '#FFE4E6',
                        color: '#BE123C',
                        border: '1px solid #FECDD3',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      Book Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#94A3B8', textAlign: 'center' }}>
          💡 Inspection fee of ₹99 is adjusted against the final service invoice.
        </div>
      </div>
    </section>
  );
}
