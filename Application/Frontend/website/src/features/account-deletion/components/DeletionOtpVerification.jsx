import React from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  ArrowLeft, 
  AlertTriangle, 
  RefreshCw 
} from 'lucide-react';

export function DeletionOtpVerification({
  phoneNumber,
  formatPhoneNumber,
  otpCode,
  setOtpCode,
  loading,
  errorMessage,
  onSubmit,
  onBack,
  darkMode,
  textColor,
  subTextColor,
  borderColor,
}) {
  return (
    <form onSubmit={onSubmit}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          color: '#0EA5E9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px'
        }}>
          <KeyRound size={28} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: textColor, margin: '0 0 6px' }}>
          Enter Verification Code
        </h2>
        <p style={{ fontSize: '14px', color: subTextColor, margin: 0 }}>
          We sent a 6-digit OTP code to <strong>{formatPhoneNumber(phoneNumber)}</strong>
        </p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          required
          maxLength={6}
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 6-digit OTP"
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            border: `2px solid ${borderColor}`,
            backgroundColor: darkMode ? '#0F172A' : '#F8FAFC',
            color: textColor,
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '8px',
            textAlign: 'center',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#EF4444',
          padding: '14px 16px',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertTriangle size={18} />
          {errorMessage}
        </div>
      )}

      {/* Verify & Submit Button */}
      <button
        type="submit"
        disabled={loading || otpCode.length !== 6}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: '#EF4444',
          color: '#FFFFFF',
          border: 'none',
          fontSize: '16px',
          fontWeight: 800,
          cursor: (loading || otpCode.length !== 6) ? 'not-allowed' : 'pointer',
          opacity: (loading || otpCode.length !== 6) ? 0.7 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
          marginBottom: '16px',
          transition: 'all 0.2s ease',
        }}
      >
        {loading ? <RefreshCw className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
        {loading ? 'Verifying & Submitting...' : 'Verify OTP & Confirm Deletion Request'}
      </button>

      {/* Back to Phone Form */}
      <button
        type="button"
        onClick={onBack}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '12px',
          backgroundColor: 'transparent',
          color: subTextColor,
          border: `1px solid ${borderColor}`,
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}
      >
        <ArrowLeft size={16} /> Back to Phone Number
      </button>
    </form>
  );
}
