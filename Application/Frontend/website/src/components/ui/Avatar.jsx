import React from 'react';

/**
 * Reusable Avatar / Profile Photo Component
 * Supports network image, initials fallback, status dot, and size variants.
 */
export const Avatar = ({
  src,
  name = 'User',
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  isOnline = false,
  showStatus = false,
  className = '',
  onClick,
  ...props
}) => {
  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const sizeStyles = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base font-bold',
    xl: 'w-20 h-20 text-xl font-bold',
    '2xl': 'w-24 h-24 text-2xl font-extrabold',
  };

  const statusSizeStyles = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  };

  const currentSizeClass = sizeStyles[size] || sizeStyles.md;
  const currentStatusSize = statusSizeStyles[size] || statusSizeStyles.md;

  const content = src ? (
    <img
      src={src}
      alt={name}
      className="w-full h-full object-cover rounded-full"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        if (e.currentTarget.nextSibling) {
          e.currentTarget.nextSibling.style.display = 'flex';
        }
      }}
    />
  ) : null;

  return (
    <div
      className={`relative inline-flex flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-900 font-semibold select-none shadow-sm ${currentSizeClass} ${
        onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
      } ${className}`}
      onClick={onClick}
      {...props}
    >
      {content}
      <span
        className={`w-full h-full flex items-center justify-center rounded-full ${
          src ? 'hidden' : 'flex'
        }`}
      >
        {getInitials(name)}
      </span>

      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-2 ring-white ${
            isOnline ? 'bg-emerald-500' : 'bg-slate-400'
          } ${currentStatusSize}`}
        />
      )}
    </div>
  );
};

export default Avatar;
