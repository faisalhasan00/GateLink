import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function PersonaDetailWorkspace({ currentPersona, onOpenDemo, isDark }) {
  return (
    <section style={{ padding: '60px 0 100px 0' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          background: isDark ? '#1E293B' : '#FFFFFF',
          borderRadius: '4px',
          padding: '40px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 900, color: '#00B589', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
            {currentPersona.roleTag}
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '0 0 12px 0' }}>
            {currentPersona.title}
          </h2>
          <p style={{ fontSize: '16px', color: isDark ? '#94A3B8' : '#555555', marginBottom: '36px', lineHeight: 1.6 }}>
            {currentPersona.tagline}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
            {/* Problems Column */}
            <div style={{
              background: isDark ? '#0F172A' : '#FEF2F2',
              padding: '24px',
              borderRadius: '4px',
              border: isDark ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid #FCA5A5'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#EF4444', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} /> Traditional Pain Points
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentPersona.problems.map((prob, idx) => (
                  <div key={idx} style={{ fontSize: '14px', color: isDark ? '#E2E8F0' : '#444444', lineHeight: 1.5, display: 'flex', gap: '10px' }}>
                    <span style={{ color: '#EF4444', fontWeight: 900 }}>✕</span>
                    <span>{prob}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Solutions Column */}
            <div style={{
              background: isDark ? '#0F172A' : '#ECFDF5',
              padding: '24px',
              borderRadius: '4px',
              border: isDark ? '1px solid rgba(0, 181, 137, 0.2)' : '1px solid #6EE7B7'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#00B589', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} /> GateLink Solution
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentPersona.solutions.map((sol, idx) => (
                  <div key={idx} style={{ fontSize: '14px', color: isDark ? '#E2E8F0' : '#444444', lineHeight: 1.5, display: 'flex', gap: '10px' }}>
                    <CheckCircle2 size={16} color="#00B589" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{sol}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Workflow Steps */}
          <div style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB', paddingTop: '32px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', marginBottom: '20px' }}>
              4-Step Operational Workflow
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              {currentPersona.workflow.map((wf) => (
                <div key={wf.step} style={{
                  background: isDark ? '#0F172A' : '#F8FAFC',
                  padding: '20px',
                  borderRadius: '4px',
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E7EB'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 900, color: '#00B589', marginBottom: '6px' }}>STEP {wf.step}</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#2C2C2C', marginBottom: '6px' }}>{wf.title}</div>
                  <div style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.45 }}>{wf.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div style={{ textAlign: 'center', paddingTop: '16px' }}>
            <button
              onClick={onOpenDemo}
              style={{
                padding: '12px 32px',
                borderRadius: '2px',
                backgroundColor: '#00B589',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Schedule Onboarding Proposal for {currentPersona.title}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
