import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';

export default function FeatureDetailModal({
  selectedFeature,
  onClose,
  onOpenDemo,
  isDark
}) {
  if (!selectedFeature) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        background: isDark ? '#1E293B' : '#FFFFFF',
        borderRadius: '4px',
        maxWidth: '600px',
        width: '100%',
        padding: '32px',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: isDark ? '#FFFFFF' : '#333333'
          }}
        >
          <X size={20} />
        </button>
        <span style={{
          fontSize: '11px',
          fontWeight: 900,
          background: '#ECFDF5',
          color: '#00B589',
          padding: '4px 10px',
          borderRadius: '2px'
        }}>
          {selectedFeature.category}
        </span>
        <h2 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '14px 0 8px 0' }}>
          {selectedFeature.title}
        </h2>
        <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#666666', lineHeight: 1.65, marginBottom: '20px' }}>
          {selectedFeature.desc}
        </p>

        <h4 style={{ fontSize: '14px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#2C2C2C', marginBottom: '12px' }}>
          Core Capabilities:
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {selectedFeature.benefits.map((b) => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: isDark ? '#E2E8F0' : '#444444' }}>
              <CheckCircle2 size={16} color="#00B589" />
              <span>{b}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            onClose();
            onOpenDemo();
          }}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '2px',
            backgroundColor: '#00B589',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Request Onboarding Proposal for {selectedFeature.title}
        </button>
      </div>
    </div>
  );
}
