import React from 'react';

/**
 * GateLink Design System Generic Button Component
 * Adheres to Design System Tokens: 12px radius, Navy primary, Amber accent, Inter font.
 */
export default function Button({
  children,
  variant = 'primary', // 'primary' | 'accent' | 'outline' | 'ghost' | 'danger'
  size = 'medium',      // 'small' | 'medium' | 'large'
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  style = {},
  className = '',
  ...props
}) {
  const variantStyles = {
    primary: {
      backgroundColor: '#1E3A8A',
      color: '#FFFFFF',
      border: 'none',
    },
    accent: {
      backgroundColor: '#F59E0B',
      color: '#FFFFFF',
      border: 'none',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#1E3A8A',
      border: '1.5px solid #1E3A8A',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#475569',
      border: 'none',
    },
    danger: {
      backgroundColor: '#DC2626',
      color: '#FFFFFF',
      border: 'none',
    },
  };

  const sizeStyles = {
    small: {
      padding: '6px 14px',
      fontSize: '12px',
      height: '32px',
    },
    medium: {
      padding: '8px 20px',
      fontSize: '14px',
      height: '38px',
    },
    large: {
      padding: '12px 26px',
      fontSize: '16px',
      height: '46px',
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.primary;
  const currentSize = sizeStyles[size] || sizeStyles.medium;

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '12px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxSizing: 'border-box',
    textDecoration: 'none',
    ...currentVariant,
    ...currentSize,
    ...style,
  };

  const handleMouseEnter = (e) => {
    if (disabled || loading) return;
    if (variant === 'primary') e.currentTarget.style.backgroundColor = '#172554';
    if (variant === 'accent') e.currentTarget.style.backgroundColor = '#D97706';
    if (variant === 'outline') e.currentTarget.style.backgroundColor = '#E0F2FE';
    if (variant === 'ghost') e.currentTarget.style.backgroundColor = '#F1F5F9';
  };

  const handleMouseLeave = (e) => {
    if (disabled || loading) return;
    if (variant === 'primary') e.currentTarget.style.backgroundColor = '#1E3A8A';
    if (variant === 'accent') e.currentTarget.style.backgroundColor = '#F59E0B';
    if (variant === 'outline') e.currentTarget.style.backgroundColor = 'transparent';
    if (variant === 'ghost') e.currentTarget.style.backgroundColor = 'transparent';
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={baseStyle}
      className={`btn-gl ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (React.isValidElement(Icon) ? Icon : <Icon size={size === 'small' ? 14 : size === 'large' ? 18 : 16} />)}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && (React.isValidElement(Icon) ? Icon : <Icon size={size === 'small' ? 14 : size === 'large' ? 18 : 16} />)}
        </>
      )}
    </button>
  );
}
