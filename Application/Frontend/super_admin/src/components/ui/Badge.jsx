import React from 'react';

/**
 * GateLink Design System Generic Badge Component
 * Status tokens: Pending (Amber), Success (Green), Danger (Red), Info (Sky)
 * Full pill radius (999px), Inter font.
 */
export default function Badge({
  children,
  variant = 'info', // 'pending' | 'success' | 'danger' | 'info' | 'neutral'
  size = 'medium',   // 'small' | 'medium'
  style = {},
  className = '',
  ...props
}) {
  const variantStyles = {
    pending: {
      backgroundColor: '#FEF3C7',
      color: '#F59E0B',
    },
    success: {
      backgroundColor: '#DCFCE7',
      color: '#16A34A',
    },
    danger: {
      backgroundColor: '#FEE2E2',
      color: '#DC2626',
    },
    info: {
      backgroundColor: '#E0F2FE',
      color: '#0369A1',
    },
    neutral: {
      backgroundColor: '#F1F5F9',
      color: '#475569',
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.info;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: size === 'small' ? '2px 8px' : '4px 12px',
        borderRadius: '999px',
        fontSize: size === 'small' ? '11px' : '12px',
        fontWeight: 600,
        fontFamily: 'Inter, sans-serif',
        lineHeight: 1.4,
        ...currentVariant,
        ...style,
      }}
      className={`badge-gl ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
