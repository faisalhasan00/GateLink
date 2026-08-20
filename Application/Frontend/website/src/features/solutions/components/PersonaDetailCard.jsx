import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function PersonaDetailCard({ current, isDark, onDemoClick }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        background: isDark ? '#0F172A' : '#FFFFFF',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
        borderRadius: '24px',
        padding: '36px',
        boxShadow: isDark ? '0 12px 36px rgba(0,0,0,0.3)' : '0 12px 36px rgba(0,0,0,0.05)',
        marginBottom: '32px'
      }}
    >
      {/* Left Details */}
      <div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(14, 165, 233, 0.1)',
            border: '1px solid rgba(14, 165, 233, 0.3)',
            borderRadius: '999px',
            padding: '4px 14px',
            fontSize: '11px',
            fontWeight: 800,
            color: '#0EA5E9',
            letterSpacing: '0.8px',
            marginBottom: '16px'
          }}
        >
          {current.roleTag}
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '12px', lineHeight: 1.2 }}>
          {current.title}
        </h2>
        <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#475569', lineHeight: 1.6, marginBottom: '28px' }}>
          {current.tagline}
        </p>

        {/* Problems vs Solutions Matrix */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '28px' }}>
          {/* Problems */}
          <div
            style={{
              background: isDark ? 'rgba(239, 68, 68, 0.08)' : '#FEF2F2',
              border: isDark ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid #FEE2E2',
              borderRadius: '16px',
              padding: '18px 20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '13px', fontWeight: 800, color: '#EF4444' }}>
              <AlertTriangle size={16} /> BEFORE GATELINK (CHALLENGES)
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {current.problems.map((p, idx) => (
                <li key={idx} style={{ fontSize: '13px', color: isDark ? '#FCA5A5' : '#991B1B', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span>✕</span> <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div
            style={{
              background: isDark ? 'rgba(16, 185, 129, 0.08)' : '#F0FDF4',
              border: isDark ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid #DCFCE7',
              borderRadius: '16px',
              padding: '18px 20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '13px', fontWeight: 800, color: '#10B981' }}>
              <CheckCircle2 size={16} /> WITH GATELINK (THE SOLUTION)
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {current.solutions.map((s, idx) => (
                <li key={idx} style={{ fontSize: '13px', color: isDark ? '#86EFAC' : '#166534', display: 'flex', alignItems: 'flex-start', gap: '8px', fontWeight: 600 }}>
                  <span>✔</span> <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Benefits Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
          {current.benefits.map((b, idx) => (
            <div
              key={idx}
              style={{
                background: isDark ? '#1E293B' : '#F1F5F9',
                border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                color: isDark ? '#38BDF8' : '#0369A1'
              }}
            >
              ★ {b}
            </div>
          ))}
        </div>

        <button
          onClick={onDemoClick}
          style={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #0EA5E9 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(14, 165, 233, 0.3)'
          }}
        >
          <span>Schedule {current.title.split('&')[0]} Demo</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Right Screen Mockup */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div
          style={{
            background: isDark ? '#020617' : '#0F172A',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            color: '#FFFFFF'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>LIVE INTERFACE MOCKUP</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>{current.screenPreview.title}</div>
            </div>
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34D399',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '999px',
                padding: '3px 10px',
                fontSize: '10px',
                fontWeight: 800
              }}
            >
              {current.screenPreview.badge}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {current.screenPreview.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{item.label}</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Workflow Stepper in Mockup */}
          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, marginBottom: '12px' }}>HOW IT WORKS STEP-BY-STEP:</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {current.workflow.map((w, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '10px', color: '#0EA5E9', fontWeight: 800 }}>STEP {w.step}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>{w.title}</div>
                  <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>{w.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
