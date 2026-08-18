import React from 'react';
import { TrendingUp, ShieldCheck, DollarSign, Zap } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export default function PartnerMetrics() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const metrics = [
    {
      icon: <TrendingUp size={20} color="#1E3A8A" />,
      bg: '#EFF6FF',
      value: '10% + 2%',
      label: 'Month 1 + Lifetime Share',
      color: isDark ? '#FFFFFF' : '#2C2C2C'
    },
    {
      icon: <ShieldCheck size={20} color="#059669" />,
      bg: '#ECFDF5',
      value: 'Zero Cost',
      label: '100% Free to Partner',
      color: '#059669'
    },
    {
      icon: <DollarSign size={20} color="#D97706" />,
      bg: '#FEF3C7',
      value: 'Direct UPI',
      label: 'Monthly Automated Payouts',
      color: '#D97706'
    },
    {
      icon: <Zap size={20} color="#0EA5E9" />,
      bg: '#E0F2FE',
      value: 'Live Updates',
      label: 'Real-time WhatsApp Status',
      color: '#0EA5E9'
    }
  ];

  return (
    <div style={{
      maxWidth: '1320px',
      margin: '40px auto 0 auto',
      padding: '0 24px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
      textAlign: 'left'
    }}>
      {metrics.map((m, idx) => (
        <div
          key={idx}
          style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: m.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            {m.icon}
          </div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: m.color }}>
            {m.value}
          </div>
          <div style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#666666', marginTop: '4px' }}>
            {m.label}
          </div>
        </div>
      ))}
    </div>
  );
}
