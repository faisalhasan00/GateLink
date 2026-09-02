import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  KeyRound, 
  Lock, 
  AlertTriangle, 
  RefreshCw 
} from 'lucide-react';

export function DeletionRequestForm({
  accountType,
  setAccountType,
  phoneNumber,
  setPhoneNumber,
  societyName,
  setSocietyName,
  flatDetails,
  setFlatDetails,
  reason,
  setReason,
  loading,
  errorMessage,
  onSubmit,
  darkMode,
  textColor,
  subTextColor,
  borderColor,
}) {
  return (
    <form onSubmit={onSubmit}>
      {/* Account Type Selection */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: textColor, marginBottom: '10px' }}>
          Select Account Type <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <button
            type="button"
            onClick={() => setAccountType('resident')}
            style={{
              padding: '16px',
              borderRadius: '16px',
              border: `2px solid ${accountType === 'resident' ? '#0EA5E9' : borderColor}`,
              backgroundColor: accountType === 'resident' ? (darkMode ? 'rgba(14, 165, 233, 0.15)' : '#F0F9FF') : 'transparent',
              color: accountType === 'resident' ? '#0EA5E9' : textColor,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '4px' }}>🏠 GateLink Resident</div>
            <div style={{ fontSize: '12px', color: subTextColor }}>Flat Owner, Tenant, or Family Member</div>
          </button>

          <button
            type="button"
            onClick={() => setAccountType('guard')}
            style={{
              padding: '16px',
              borderRadius: '16px',
              border: `2px solid ${accountType === 'guard' ? '#0EA5E9' : borderColor}`,
              backgroundColor: accountType === 'guard' ? (darkMode ? 'rgba(14, 165, 233, 0.15)' : '#F0F9FF') : 'transparent',
              color: accountType === 'guard' ? '#0EA5E9' : textColor,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '4px' }}>🛡️ GateLink Guard</div>
            <div style={{ fontSize: '12px', color: subTextColor }}>Security Guard or Gate Staff</div>
          </button>
        </div>
      </div>

      {/* Registered Mobile Number */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: textColor, marginBottom: '8px' }}>
          Registered Mobile Number <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: subTextColor,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Smartphone size={18} />
            <span style={{ fontSize: '14px', fontWeight: 700 }}>+91</span>
          </div>
          <input
            type="tel"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter 10-digit mobile number"
            style={{
              width: '100%',
              padding: '14px 16px 14px 80px',
              borderRadius: '12px',
              border: `1px solid ${borderColor}`,
              backgroundColor: darkMode ? '#0F172A' : '#F8FAFC',
              color: textColor,
              fontSize: '15px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Optional Society Name & Flat Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: subTextColor, marginBottom: '6px' }}>
            Society Name (Optional)
          </label>
          <input
            type="text"
            value={societyName}
            onChange={(e) => setSocietyName(e.target.value)}
            placeholder="e.g. Royal Heights"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '12px',
              border: `1px solid ${borderColor}`,
              backgroundColor: darkMode ? '#0F172A' : '#F8FAFC',
              color: textColor,
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: subTextColor, marginBottom: '6px' }}>
            {accountType === 'resident' ? 'Flat / Unit Number (Optional)' : 'Gate Assignment (Optional)'}
          </label>
          <input
            type="text"
            value={flatDetails}
            onChange={(e) => setFlatDetails(e.target.value)}
            placeholder={accountType === 'resident' ? 'e.g. A-402' : 'e.g. Main Gate'}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '12px',
              border: `1px solid ${borderColor}`,
              backgroundColor: darkMode ? '#0F172A' : '#F8FAFC',
              color: textColor,
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Optional Reason Dropdown */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: subTextColor, marginBottom: '6px' }}>
          Reason for Account Deletion (Optional)
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: '12px',
            border: `1px solid ${borderColor}`,
            backgroundColor: darkMode ? '#0F172A' : '#F8FAFC',
            color: textColor,
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        >
          <option value="">Select a reason (optional)</option>
          <option value="moved_out">I have moved out of the housing society</option>
          <option value="no_longer_using">I no longer require the app</option>
          <option value="privacy_concerns">Privacy or data concerns</option>
          <option value="duplicate_account">Duplicate account created by mistake</option>
          <option value="other">Other reason</option>
        </select>
      </div>

      {/* Data Retention & Privacy Disclaimer Box */}
      <div style={{
        backgroundColor: darkMode ? 'rgba(30, 58, 138, 0.2)' : '#EFF6FF',
        border: '1px solid rgba(14, 165, 233, 0.3)',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0EA5E9', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>
          <Lock size={16} /> Data Protection &amp; Grace Period Disclosure
        </div>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: subTextColor, lineHeight: 1.6 }}>
          <li>Your account will be <strong>soft-deactivated immediately</strong> upon submission.</li>
          <li>A <strong>7-day grace period</strong> applies, during which you can cancel your request.</li>
          <li>Personal profile data, photos, notifications, and FCM tokens will be permanently erased.</li>
          <li>Society security logs (visitor history) and statutory accounting invoices (GST receipts) are retained or anonymized as required by Indian law.</li>
        </ul>
        <div style={{ marginTop: '10px', fontSize: '12px' }}>
          Read our full <Link to="/privacy" style={{ color: '#0EA5E9', fontWeight: 700, textDecoration: 'none' }}>Privacy Policy (DPDP Act)</Link>.
        </div>
      </div>

      {/* Error Message Alert */}
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

      {/* Submit / Send OTP Button */}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: '#0EA5E9',
          color: '#FFFFFF',
          border: 'none',
          fontSize: '16px',
          fontWeight: 800,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 4px 14px rgba(14, 165, 233, 0.3)',
          transition: 'all 0.2s ease',
        }}
      >
        {loading ? <RefreshCw className="animate-spin" size={18} /> : <KeyRound size={18} />}
        {loading ? 'Sending OTP Verification...' : 'Send Verification OTP'}
      </button>
    </form>
  );
}
