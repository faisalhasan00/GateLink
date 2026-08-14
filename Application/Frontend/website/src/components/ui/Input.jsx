import React from 'react';

/**
 * GateLink Design System Generic Input Field Component
 * Adheres to Design System Tokens: 12px radius, Inter font, smooth focus outline.
 */
export default function Input({
  label,
  error,
  icon: Icon,
  fullWidth = true,
  isDark = false,
  className = '',
  style = {},
  ...props
}) {
  return (
    <div style={{ width: fullWidth ? '100%' : 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#E2E8F0' : '#334155' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: '14px', color: '#94A3B8', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
            <Icon size={18} />
          </div>
        )}
        <input
          style={{
            width: '100%',
            padding: Icon ? '11px 14px 11px 42px' : '11px 14px',
            borderRadius: '12px',
            border: error ? '1.5px solid #DC2626' : isDark ? '1px solid rgba(255,255,255,0.2)' : '1.5px solid #E2E8F0',
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            color: isDark ? '#FFFFFF' : '#0F172A',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            boxSizing: 'border-box',
            ...style,
          }}
          className={`input-gl ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  );
}
