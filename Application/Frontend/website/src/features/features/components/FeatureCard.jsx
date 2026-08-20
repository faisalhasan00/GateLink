import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function FeatureCard({ feature, isDark, onSelectDetail }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      style={{
        background: isDark ? '#1E293B' : '#FFFFFF',
        borderRadius: '20px',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.04)',
        transition: 'transform 0.2s ease, border-color 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = '#0EA5E9';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0';
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: isDark ? 'rgba(14, 165, 233, 0.15)' : '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: isDark ? '1px solid rgba(14, 165, 233, 0.3)' : '1px solid #DBEAFE'
            }}
          >
            {feature.icon}
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '999px',
              background: isDark ? '#0F172A' : '#F1F5F9',
              color: isDark ? '#94A3B8' : '#64748B',
              border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0'
            }}
          >
            {feature.category}
          </span>
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#1E293B', marginBottom: '10px' }}>
          {feature.title}
        </h3>
        <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6, marginBottom: '20px' }}>
          {feature.desc}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {feature.benefits.slice(0, 3).map((b, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: isDark ? '#CBD5E1' : '#475569' }}>
              <CheckCircle2 size={14} color="#0EA5E9" style={{ flexShrink: 0 }} />
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => onSelectDetail(feature)}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '10px',
          background: 'transparent',
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
          color: isDark ? '#38BDF8' : '#0284C7',
          fontWeight: 700,
          fontSize: '13px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          transition: 'background 0.2s ease'
        }}
      >
        <span>Explore Full Capability</span>
        <ArrowRight size={14} />
      </button>
    </motion.div>
  );
}
