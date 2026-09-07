import React from 'react';
import { SOLUTIONS_PERSONAS } from './solutionsData';

export default function SolutionsHeroSection({ activePersona, onSelectPersona, isDark }) {
  return (
    <section style={{
      paddingTop: '120px',
      paddingBottom: '40px',
      background: isDark ? '#0F172A' : '#FFFFFF',
      borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px' }}>
        <span style={{ fontSize: '12px', fontWeight: 900, color: '#00B589', textTransform: 'uppercase', letterSpacing: '1px' }}>
          TAILORED SOLUTIONS BY ROLE
        </span>
        <h1 style={{ fontSize: '40px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', letterSpacing: '-1px', margin: '10px 0 16px 0' }}>
          GateLink for Every Stakeholder
        </h1>
        <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#555555', maxWidth: '750px', margin: '0 auto 30px auto', lineHeight: 1.6 }}>
          Select your role below to explore tailored workflows, features, and operational benefits built for your needs.
        </p>

        {/* Role Switcher Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {SOLUTIONS_PERSONAS.map((p) => {
            const isSelected = activePersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPersona(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '2px',
                  border: '1px solid',
                  borderColor: isSelected ? '#00B589' : (isDark ? 'rgba(255,255,255,0.1)' : '#CCCCCC'),
                  backgroundColor: isSelected ? '#00B589' : 'transparent',
                  color: isSelected ? '#FFFFFF' : (isDark ? '#94A3B8' : '#444444'),
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {p.icon} {p.title}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
