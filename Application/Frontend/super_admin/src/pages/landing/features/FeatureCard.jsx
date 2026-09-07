import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function FeatureCard({ feature, onClick, isDark }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: isDark ? '#1E293B' : '#FFFFFF',
        borderRadius: '4px',
        padding: '28px',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer'
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '4px',
            background: isDark ? 'rgba(255,255,255,0.05)' : '#ECFDF5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {feature.icon}
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: 900,
            padding: '4px 10px',
            borderRadius: '2px',
            background: '#ECFDF5',
            color: '#00B589'
          }}>
            {feature.category}
          </span>
        </div>

        <h3 style={{ fontSize: '19px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '0 0 10px 0' }}>
          {feature.title}
        </h3>

        <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.6, margin: '0 0 20px 0' }}>
          {feature.desc}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {feature.benefits.map((b) => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: isDark ? '#E2E8F0' : '#444444' }}>
              <CheckCircle2 size={15} color="#00B589" style={{ flexShrink: 0 }} />
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: '24px',
        paddingTop: '14px',
        borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #F1F5F9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '13px',
        fontWeight: 700,
        color: '#00B589'
      }}>
        <span>Learn More</span>
        <ArrowRight size={15} />
      </div>
    </div>
  );
}
