import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function SubscriptionBadge({ plan = 'ENTERPRISE' }) {
  return (
    <div 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        color: '#FFFFFF',
        fontSize: '11px',
        fontWeight: 800,
        letterSpacing: '0.6px',
        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
        flexShrink: 0,
        height: '32px',
        whiteSpace: 'nowrap'
      }}
    >
      <ShieldCheck size={14} />
      <span>{plan} PLAN</span>
    </div>
  );
}
