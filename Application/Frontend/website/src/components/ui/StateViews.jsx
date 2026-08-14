import React from 'react';
import { AlertCircle, Inbox } from 'lucide-react';
import Button from './Button';

/**
 * GateLink Design System Generic State Handlers:
 * LoadingState, EmptyState, ErrorState
 */
export function LoadingState({ message = 'Loading content...', height = '200px' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: height, gap: '12px', padding: '24px' }}>
      <div style={{ width: '32px', height: '32px', border: '3px solid #E0F2FE', borderTopColor: '#1E3A8A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
        {message}
      </span>
    </div>
  );
}

export function EmptyState({
  title = 'No items found',
  description = 'There are no records in this section yet.',
  actionLabel,
  onAction,
  icon: Icon = Inbox,
  height = '240px'
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: height, textAlign: 'center', padding: '32px 20px' }}>
      <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', marginBottom: '14px' }}>
        <Icon size={26} />
      </div>
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '4px', fontFamily: 'Inter, sans-serif' }}>
        {title}
      </h3>
      <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '360px', marginBottom: actionLabel ? '18px' : '0', lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="medium" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Could not load data. Please try again.',
  onRetry,
  height = '220px'
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: height, textAlign: 'center', padding: '24px 20px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626', marginBottom: '12px' }}>
        <AlertCircle size={24} />
      </div>
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
        {title}
      </h3>
      <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '340px', marginBottom: onRetry ? '16px' : '0' }}>
        {description}
      </p>
      {onRetry && (
        <Button variant="outline" size="small" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

export default { LoadingState, EmptyState, ErrorState };
