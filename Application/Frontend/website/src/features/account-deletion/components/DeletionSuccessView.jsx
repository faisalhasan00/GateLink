import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

export function DeletionSuccessView({
  requestResult,
  darkMode,
  textColor,
  subTextColor,
  borderColor,
}) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        color: '#10B981',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px'
      }}>
        <CheckCircle size={36} />
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: 800, color: textColor, margin: '0 0 8px' }}>
        Account Deletion Request Submitted
      </h2>

      <p style={{ fontSize: '15px', color: subTextColor, maxWidth: '500px', margin: '0 auto 24px', lineHeight: 1.6 }}>
        Your account deletion request has been recorded. Your account has been soft-deactivated and scheduled for permanent processing.
      </p>

      {/* Reference Card */}
      <div style={{
        backgroundColor: darkMode ? '#0F172A' : '#F8FAFC',
        border: `1px solid ${borderColor}`,
        borderRadius: '16px',
        padding: '24px',
        textAlign: 'left',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: subTextColor, textTransform: 'uppercase', marginBottom: '4px' }}>
              Reference Request ID
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0EA5E9', fontFamily: 'monospace' }}>
              {requestResult.requestId}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: subTextColor, textTransform: 'uppercase', marginBottom: '4px' }}>
              Submission Date
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: textColor }}>
              {requestResult.requestedAt}
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: subTextColor, textTransform: 'uppercase', marginBottom: '4px' }}>
              Scheduled Erasure Date
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#EF4444' }}>
              {requestResult.scheduledDeletionAt}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: subTextColor, textTransform: 'uppercase', marginBottom: '4px' }}>
              Grace Period Status
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={16} /> 7-Day Window Active
            </div>
          </div>
        </div>
      </div>

      {/* Support Contact Box */}
      <div style={{ fontSize: '14px', color: subTextColor, marginBottom: '28px', lineHeight: 1.6 }}>
        Need to cancel this request or have questions regarding data privacy?<br />
        Contact our Data Protection Officer at{' '}
        <a href="mailto:support@gatelink.in?subject=Account%20Deletion%20Query" style={{ color: '#0EA5E9', fontWeight: 700, textDecoration: 'none' }}>
          support@gatelink.in
        </a>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <Link
          to="/"
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            backgroundColor: darkMode ? '#334155' : '#E2E8F0',
            color: textColor,
            fontWeight: 700,
            fontSize: '14px',
            textDecoration: 'none'
          }}
        >
          Return to Home
        </Link>

        <Link
          to="/privacy"
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            backgroundColor: '#0EA5E9',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '14px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          Privacy Policy <ExternalLink size={16} />
        </Link>
      </div>
    </div>
  );
}
