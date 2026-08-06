import React from 'react';
import { Building2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ClientLogosSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const clientSocieties = [
    'Prestige Lakeside Habitat',
    'Brigade Gateway Towers',
    'Sobha Elanza Emerald',
    'DLF Phase 5 Cybercity',
    'Godrej Palm Grove',
    'Puravankara Blu Waters',
    'Salarpuria Sattva Luxuria'
  ];

  return (
    <section style={{ padding: '36px 0', background: isDark ? '#020617' : '#FFFFFF', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 800, color: isDark ? '#94A3B8' : '#64748B', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px' }}>
          POWERING LEADING RESIDENTIAL TOWNSHIPS & GATED COMMUNITIES ACROSS INDIA
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px', opacity: 0.85 }}>
          {clientSocieties.map((society) => (
            <div key={society} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 800, color: isDark ? '#CBD5E1' : '#334155' }}>
              <Building2 size={16} color="#2563EB" />
              <span>{society}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
