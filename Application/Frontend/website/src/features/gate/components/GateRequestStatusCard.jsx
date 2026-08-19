import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function GateRequestStatusCard({ requestStatus, flatNumber, visitorName, visitorType }) {
  return (
    <div style={{
      background: '#1E293B',
      borderRadius: '16px',
      padding: '28px',
      border: '1px solid #334155',
      textAlign: 'center',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
    }}>
      {requestStatus === 'pending' && (
        <>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Clock size={32} color="#F59E0B" className="animate-spin" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#F8FAFC', margin: '0 0 8px' }}>
            Entry Request Sent!
          </h2>
          <p style={{ fontSize: '14px', color: '#94A3B8', margin: '0 0 20px' }}>
            Awaiting resident approval for <strong>Flat {flatNumber}</strong>. Please show your phone to the Security Guard.
          </p>
          <div style={{
            padding: '12px',
            borderRadius: '10px',
            backgroundColor: '#0F172A',
            border: '1px solid #334155',
            fontSize: '13px',
            color: '#CBD5E1'
          }}>
            Visitor: <strong>{visitorName}</strong> ({visitorType})
          </div>
        </>
      )}

      {requestStatus === 'approved' && (
        <>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <CheckCircle2 size={36} color="#10B981" />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#10B981', margin: '0 0 8px' }}>
            Gate Entry Approved!
          </h2>
          <p style={{ fontSize: '14px', color: '#CBD5E1', margin: '0 0 20px' }}>
            You are cleared to proceed to <strong>Flat {flatNumber}</strong>. Have a great visit!
          </p>
        </>
      )}

      {requestStatus === 'denied' && (
        <>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <AlertCircle size={36} color="#EF4444" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#EF4444', margin: '0 0 8px' }}>
            Entry Request Declined
          </h2>
          <p style={{ fontSize: '14px', color: '#94A3B8', margin: '0 0 20px' }}>
            Resident at Flat {flatNumber} declined entry. Please speak with Security Guard.
          </p>
        </>
      )}
    </div>
  );
}
