import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export default function PartnerTierGrid({ onSelectTier }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const tiers = [
    {
      id: 'referral',
      tag: 'Tier 1',
      title: 'Referral Partner',
      subtitle: 'For residents & casual friends who introduce a society committee',
      badgeColor: '#059669',
      badgeBg: '#ECFDF5',
      m1Rate: '5%',
      m1Desc: 'One-time bonus on Month 1',
      recurring: '2%',
      duration: '12 Months (1 Year)',
      features: [
        'Just submit Society Name & Secretary phone',
        'GateLink enterprise team conducts demo & contract',
        'Direct UPI cash transfer on first bill clearance'
      ]
    },
    {
      id: 'onboarding',
      tag: 'Tier 2',
      title: 'Onboarding Partner',
      subtitle: 'For champions who introduce and help collect flat/resident rosters',
      badgeColor: '#0284C7',
      badgeBg: '#E0F2FE',
      m1Rate: '10%',
      m1Desc: 'Doubled bonus on Month 1',
      recurring: '2%',
      duration: '24 Months (2 Full Years)',
      features: [
        'Introduce committee & assist with tower/flat lists',
        'Doubled 10% cash bonus on first invoice',
        '2 Full Years of recurring passive monthly payouts'
      ]
    },
    {
      id: 'growth',
      tag: 'Tier 3',
      title: 'Growth Partner',
      subtitle: 'For property brokers, facility vendors & promoters managing 3+ societies',
      badgeColor: '#1E3A8A',
      badgeBg: '#EFF6FF',
      isPro: true,
      m1Rate: '10%',
      m1Desc: 'Full 10% bonus on Month 1',
      recurring: '2%',
      duration: 'LIFETIME (Active Soc.)',
      features: [
        'Permanent 2% recurring monthly revenue share',
        'Dedicated Partner Relationship Manager',
        'Automated monthly UPI payouts with invoice statements'
      ]
    }
  ];

  return (
    <section style={{ padding: '70px 0', maxWidth: '1320px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 50px auto' }}>
        <span style={{ fontSize: '12px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '1px' }}>
          PARTNERSHIP TIERS
        </span>
        <h2 style={{ fontSize: '32px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-0.5px', margin: '10px 0 14px 0' }}>
          Choose Your Level of Engagement
        </h2>
        <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#555555', margin: 0, lineHeight: 1.6 }}>
          From casual resident referrals to professional real estate brokerage — earn recurring revenue with zero capital risk.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'stretch' }}>
        {tiers.map((t) => (
          <div
            key={t.id}
            style={{
              background: isDark ? '#1E293B' : '#FFFFFF',
              borderRadius: '16px',
              padding: '36px',
              border: t.isPro ? '2px solid #1E3A8A' : (isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB'),
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            {t.isPro && (
              <span style={{
                position: 'absolute',
                top: '-12px',
                right: '24px',
                backgroundColor: '#1E3A8A',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 900,
                padding: '4px 12px',
                borderRadius: '999px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                PRO BROKER
              </span>
            )}

            <div>
              <div style={{
                display: 'inline-block',
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: t.badgeBg,
                color: t.badgeColor,
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                marginBottom: '14px'
              }}>
                {t.tag}
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '0 0 6px 0' }}>
                {t.title}
              </h3>
              <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.5, margin: '0 0 24px 0' }}>
                {t.subtitle}
              </p>

              {/* Earnings Box */}
              <div style={{
                backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                borderRadius: '12px',
                padding: '18px',
                border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E5E7EB',
                marginBottom: '24px'
              }}>
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94A3B8' : '#666666', textTransform: 'uppercase' }}>MONTH 1 COMMISSION</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '2px 0' }}>
                    {t.m1Rate} <span style={{ fontSize: '12px', fontWeight: 500, color: isDark ? '#94A3B8' : '#666666' }}>({t.m1Desc})</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94A3B8' : '#666666', textTransform: 'uppercase' }}>RECURRING SHARE</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: t.badgeColor, margin: '2px 0' }}>
                    {t.recurring} <span style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#444444' }}>for {t.duration}</span>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {t.features.map((f, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: isDark ? '#CBD5E1' : '#555555', lineHeight: 1.5 }}>
                    <CheckCircle2 size={16} color={t.badgeColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="#lead-form"
              onClick={() => onSelectTier(t.id)}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                backgroundColor: t.isPro ? '#1E3A8A' : (isDark ? '#334155' : '#F1F5F9'),
                color: t.isPro ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#2C2C2C'),
                border: t.isPro ? 'none' : (isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #CCCCCC'),
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'block'
              }}
            >
              Apply as {t.title}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
