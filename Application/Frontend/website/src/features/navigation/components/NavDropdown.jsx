import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export default function NavDropdown({
  label,
  isOpen,
  onOpen,
  onClose,
  items,
  isDark,
}) {
  return (
    <div
      style={{ position: 'relative', cursor: 'pointer' }}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '15px',
          fontWeight: 600,
          color: isDark ? '#E2E8F0' : '#334155',
          position: 'relative',
          padding: '6px 4px',
          fontFamily: 'Inter, sans-serif',
          transition: 'color 0.15s ease',
        }}
      >
        <span>{label}</span>
        <ChevronDown size={16} color={isDark ? '#94A3B8' : '#64748B'} />
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: '-4px',
              left: 0,
              right: 0,
              height: '2px',
              backgroundColor: '#1E3A8A',
            }}
          />
        )}
      </div>

      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: '8px', zIndex: 100 }}>
          <div
            style={{
              background: isDark ? '#1E293B' : '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB',
              minWidth: '180px',
              overflow: 'hidden',
            }}
          >
            {items.map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                style={{
                  display: 'block',
                  padding: '12px 18px',
                  color: isDark ? '#E2E8F0' : '#444444',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                  borderBottom:
                    idx < items.length - 1
                      ? isDark
                        ? '1px solid rgba(255,255,255,0.08)'
                        : '1px solid #F1F5F9'
                      : 'none',
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
