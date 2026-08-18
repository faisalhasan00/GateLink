import React from 'react';
import { Zap, Sparkles } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

export default function PartnerFormTierToggle({ selectedTier, onSelectTier }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const isGrowth = selectedTier === 'growth';

  return (
    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
      <span style={{ fontSize: '12px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '1px' }}>
        PARTNERSHIP REGISTRATION
      </span>
      <h2 style={{ fontSize: '30px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-0.5px', margin: '8px 0 14px 0' }}>
        {isGrowth ? 'Pro Broker & Channel Partner Application' : 'Submit a Society Lead & Partner'}
      </h2>
      <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#555555', margin: '0 auto 20px auto', maxWidth: '640px', lineHeight: 1.5 }}>
        {isGrowth
          ? 'For real estate brokers, property managers & agencies managing multiple societies with permanent lifetime recurring share.'
          : 'For residents, flat owners & friends introducing a housing society. GateLink conducts the demo and sends your cash payout upon billing.'}
      </p>

      {/* Clean 2-Way Switcher */}
      <div style={{
        display: 'inline-flex',
        backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
        padding: '5px',
        borderRadius: '14px',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
        gap: '6px'
      }}>
        <button
          type="button"
          onClick={() => onSelectTier('referral')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: !isGrowth ? '#1E3A8A' : 'transparent',
            color: !isGrowth ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B'),
            fontWeight: !isGrowth ? 800 : 600,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Zap size={15} /> Society Referral (Tier 1 & 2)
        </button>

        <button
          type="button"
          onClick={() => onSelectTier('growth')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: isGrowth ? '#1E3A8A' : 'transparent',
            color: isGrowth ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B'),
            fontWeight: isGrowth ? 800 : 600,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Sparkles size={15} /> Pro Broker Agency (Tier 3 Lifetime)
        </button>
      </div>
    </div>
  );
}
