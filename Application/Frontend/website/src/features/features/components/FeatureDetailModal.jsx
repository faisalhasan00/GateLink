import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, X } from 'lucide-react';

export default function FeatureDetailModal({ feature, isDark, onClose, onOpenDemo }) {
  if (!feature) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          background: isDark ? '#1E293B' : '#FFFFFF',
          borderRadius: '24px',
          padding: '36px',
          maxWidth: '560px',
          width: '100%',
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          color: isDark ? '#FFFFFF' : '#1E293B'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: isDark ? 'rgba(14, 165, 233, 0.15)' : '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {feature.icon}
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                {feature.category}
              </span>
              <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '2px 0 0 0' }}>{feature.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: isDark ? '#94A3B8' : '#64748B',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
          {feature.desc}
        </p>

        <h4 style={{ fontSize: '14px', fontWeight: 800, color: isDark ? '#E2E8F0' : '#334155', marginBottom: '12px' }}>
          KEY ENTERPRISE CAPABILITIES
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
          {feature.benefits.map((b, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '14px',
                color: isDark ? '#CBD5E1' : '#475569',
                background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                padding: '10px 14px',
                borderRadius: '10px',
                border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0'
              }}
            >
              <CheckCircle2 size={16} color="#0EA5E9" style={{ flexShrink: 0 }} />
              <span>{b}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => {
              onClose();
              onOpenDemo();
            }}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1E3A8A 0%, #0EA5E9 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>Book Live Demo for {feature.title}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
