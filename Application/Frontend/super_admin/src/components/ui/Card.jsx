import React from 'react';

/**
 * GateLink Design System Generic Card Container
 * 16px corner radius, 22px padding, subtle border.
 */
export default function Card({
  children,
  isDark = false,
  padding = '22px',
  hoverable = false,
  style = {},
  className = '',
  ...props
}) {
  return (
    <div
      style={{
        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: padding,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        transition: hoverable ? 'transform 0.2s ease, box-shadow 0.2s ease' : 'none',
        boxSizing: 'border-box',
        ...style,
      }}
      className={`card-gl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
