import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight } from 'lucide-react';

export default function PricingRoiCalculator({ onOpenDemo }) {
  const [flats, setFlats] = useState(150);
  const [maintenancePerFlat, setMaintenancePerFlat] = useState(4000);
  const [guards, setGuards] = useState(6);
  const [currentManualCost, setCurrentManualCost] = useState(15000);

  // Calculations
  const totalMonthlyCollection = flats * maintenancePerFlat;
  const defaulterSavedMonthly = Math.round(totalMonthlyCollection * 0.05); // 5% saved from automated reminders
  const adminSavedMonthly = Math.round(currentManualCost * 0.75); // 75% savings on manual paperwork & accounting
  const totalMonthlySavings = defaulterSavedMonthly + adminSavedMonthly;
  const totalAnnualSavings = totalMonthlySavings * 12;
  const softwareAnnualCost = 4999 * 12; // ₹59,988
  const calculatedRoi = Math.round(((totalAnnualSavings - softwareAnnualCost) / softwareAnnualCost) * 100);
  const timeSavedHours = Math.round((flats * 0.5) + (guards * 5)); // hours saved per month

  return (
    <section style={{ padding: '80px 0', background: '#090D16', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(52, 211, 153, 0.15)', color: '#34D399', fontSize: '12px', fontWeight: 800, marginBottom: '12px' }}>
            <Calculator size={14} /> INTERACTIVE FINANCIAL ROI CALCULATOR
          </div>
          <h2 style={{ fontSize: '38px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1px', margin: '0 0 12px 0' }}>
            Calculate your society's estimated annual savings
          </h2>
          <p style={{ fontSize: '16px', color: '#94A3B8', margin: 0 }}>
            Adjust the sliders below to see your automated savings, time saved, and net ROI.
          </p>
        </div>

        {/* Calculator Container */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '40px',
          alignItems: 'center'
        }}>
          
          {/* Controls Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Slider 1: Flats */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', color: '#CBD5E1', fontWeight: 700 }}>Total Number of Flats</label>
                <span style={{ fontSize: '16px', color: '#818CF8', fontWeight: 900 }}>{flats} Flats</span>
              </div>
              <input
                type="range"
                min="20"
                max="1000"
                step="10"
                value={flats}
                onChange={e => setFlats(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#4F46E5', cursor: 'pointer' }}
              />
            </div>

            {/* Slider 2: Monthly Maintenance */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', color: '#CBD5E1', fontWeight: 700 }}>Monthly Maintenance per Flat</label>
                <span style={{ fontSize: '16px', color: '#34D399', fontWeight: 900 }}>₹{maintenancePerFlat.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="20000"
                step="500"
                value={maintenancePerFlat}
                onChange={e => setMaintenancePerFlat(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10B981', cursor: 'pointer' }}
              />
            </div>

            {/* Slider 3: Security Guards */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', color: '#CBD5E1', fontWeight: 700 }}>Security Guards on Duty</label>
                <span style={{ fontSize: '16px', color: '#C084FC', fontWeight: 900 }}>{guards} Guards</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={guards}
                onChange={e => setGuards(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#C084FC', cursor: 'pointer' }}
              />
            </div>

            {/* Slider 4: Current Manual Costs */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', color: '#CBD5E1', fontWeight: 700 }}>Current Manual Admin Costs / Month</label>
                <span style={{ fontSize: '16px', color: '#FBBF24', fontWeight: 900 }}>₹{currentManualCost.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="2000"
                max="50000"
                step="1000"
                value={currentManualCost}
                onChange={e => setCurrentManualCost(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#F59E0B', cursor: 'pointer' }}
              />
            </div>

          </div>

          {/* Live Calculation Results Right Column */}
          <motion.div
            layout
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#34D399', letterSpacing: '1px', textTransform: 'uppercase' }}>ESTIMATED ANNUAL SAVINGS</div>
              <div style={{ fontSize: '42px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1px', marginTop: '4px' }}>
                ₹{totalAnnualSavings.toLocaleString()} <span style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 500 }}>/ year</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>TIME SAVED / MONTH</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#818CF8', marginTop: '4px' }}>{timeSavedHours} Hours</div>
              </div>

              <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>ESTIMATED ROI</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#34D399', marginTop: '4px' }}>{calculatedRoi}% ROI</div>
              </div>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '14px', borderRadius: '12px', fontSize: '12px', color: '#CBD5E1', lineHeight: 1.5 }}>
              💡 <strong>Breakdown:</strong> Saves ₹{defaulterSavedMonthly.toLocaleString()}/mo in avoided defaulter losses and ₹{adminSavedMonthly.toLocaleString()}/mo in reduced paperwork &amp; manual accounting.
            </div>

            <button
              onClick={onOpenDemo}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: 'white',
                fontWeight: 900,
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>Claim Your Society Savings</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
