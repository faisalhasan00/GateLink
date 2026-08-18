import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export default function PartnerHero() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section style={{
      paddingTop: '120px',
      paddingBottom: '40px',
      background: isDark ? '#0F172A' : '#FFFFFF',
      borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px' }}>
        <span style={{
          fontSize: '12px',
          fontWeight: 900,
          color: '#0EA5E9',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          GATELINK PARTNER & REVENUE SHARE ENGINE
        </span>

        <h1 style={{
          fontSize: '42px',
          fontWeight: 900,
          color: isDark ? '#FFFFFF' : '#2C2C2C',
          letterSpacing: '-1px',
          margin: '12px 0 16px 0',
          lineHeight: 1.15
        }}>
          Earn Recurring Monthly Passive Income <br />
          <span style={{ color: '#0EA5E9' }}>By Onboarding Residential Societies</span>
        </h1>

        <p style={{
          fontSize: '16px',
          color: isDark ? '#94A3B8' : '#555555',
          maxWidth: '780px',
          margin: '0 auto 30px auto',
          lineHeight: 1.6
        }}>
          Whether you are a real estate broker, flat resident, social media promoter, or freelancer — partner with GateLink and earn up to <strong>10% Month 1 Bonus + 2% Lifetime Recurring Commission</strong> on every paying society.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <a
            href="#lead-form"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 28px',
              borderRadius: '12px',
              backgroundColor: '#1E3A8A',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            <span>Submit a Society Lead</span>
            <ArrowRight size={16} />
          </a>
          <a
            href="#calculator"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 24px',
              borderRadius: '12px',
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              color: isDark ? '#FFFFFF' : '#2C2C2C',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #CCCCCC',
              fontSize: '14px',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            Calculate Your Earnings
          </a>
        </div>
      </div>
    </section>
  );
}
