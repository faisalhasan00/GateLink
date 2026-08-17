import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';

export default function PartnerEarningsCalculator({ selectedTier }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [flatCount, setFlatCount] = useState(200);

  // Math Calculations (@ ₹25/flat/month net SaaS fee)
  const monthlySaaSRevenue = flatCount * 25;
  const m1Rate = selectedTier === 'referral' ? 0.05 : 0.10;
  const m1Bonus = Math.round(monthlySaaSRevenue * m1Rate);
  const recurringMonthly = Math.round(monthlySaaSRevenue * 0.02);
  const annualTotal = m1Bonus + (recurringMonthly * 11);

  return (
    <section id="calculator" style={{
      padding: '70px 0',
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
      borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB',
      borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '1px' }}>
            ROI SIMULATOR
          </span>
          <h2 style={{ fontSize: '30px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-0.5px', margin: '8px 0 10px 0' }}>
            Interactive Earnings Calculator
          </h2>
          <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#555555', margin: 0 }}>
            Slide to simulate your monthly & annual passive income based on society flat count.
          </p>
        </div>

        <div style={{
          background: isDark ? '#1E293B' : '#FFFFFF',
          borderRadius: '16px',
          padding: '36px',
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          {/* Slider */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#E2E8F0' : '#444444' }}>Flats in Referred Society:</span>
              <span style={{ fontSize: '22px', fontWeight: 900, color: '#1E3A8A' }}>{flatCount} Flats</span>
            </div>
            <input
              type="range"
              min="50"
              max="1500"
              step="25"
              value={flatCount}
              onChange={(e) => setFlatCount(Number(e.target.value))}
              style={{ width: '100%', height: '8px', borderRadius: '4px', cursor: 'pointer', accentColor: '#1E3A8A' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: isDark ? '#64748B' : '#999999', marginTop: '6px' }}>
              <span>50 Flats</span>
              <span>500 Flats</span>
              <span>1,000 Flats</span>
              <span>1,500+ Flats</span>
            </div>
          </div>

          {/* Calculated Output */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: isDark ? '#0F172A' : '#F8FAFC', padding: '18px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E5E7EB' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94A3B8' : '#666666', textTransform: 'uppercase' }}>ESTIMATED MONTHLY BILL</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '4px 0' }}>₹{monthlySaaSRevenue.toLocaleString('en-IN')}</div>
              <div style={{ fontSize: '11px', color: isDark ? '#64748B' : '#999999' }}>@ ₹25/flat/mo net SaaS</div>
            </div>

            <div style={{ background: isDark ? '#0F172A' : '#F8FAFC', padding: '18px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E5E7EB' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94A3B8' : '#666666', textTransform: 'uppercase' }}>MONTH 1 CASH BONUS</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#059669', margin: '4px 0' }}>₹{m1Bonus.toLocaleString('en-IN')}</div>
              <div style={{ fontSize: '11px', color: isDark ? '#64748B' : '#999999' }}>{selectedTier === 'referral' ? '5%' : '10%'} on first invoice</div>
            </div>

            <div style={{ background: isDark ? '#0F172A' : '#F8FAFC', padding: '18px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E5E7EB' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94A3B8' : '#666666', textTransform: 'uppercase' }}>MONTHLY RECURRING SHARE</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#1E3A8A', margin: '4px 0' }}>₹{recurringMonthly.toLocaleString('en-IN')} <span style={{ fontSize: '12px', fontWeight: 500, color: isDark ? '#94A3B8' : '#666666' }}>/mo</span></div>
              <div style={{ fontSize: '11px', color: isDark ? '#64748B' : '#999999' }}>2% every month to UPI</div>
            </div>
          </div>

          {/* Annual Summary */}
          <div style={{
            background: '#EFF6FF',
            borderRadius: '12px',
            padding: '18px 24px',
            border: '1px solid #BFDBFE',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#1E3A8A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ESTIMATED YEAR 1 EARNINGS (PER SOCIETY)
              </div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#1E3A8A', margin: '2px 0 0 0' }}>
                ₹{annualTotal.toLocaleString('en-IN')}
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#1E3A8A', fontWeight: 600 }}>
              💡 10 societies = ₹{(annualTotal * 10).toLocaleString('en-IN')} / year passive income
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
