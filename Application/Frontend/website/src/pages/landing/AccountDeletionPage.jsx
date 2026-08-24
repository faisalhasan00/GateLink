import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  Smartphone, 
  KeyRound, 
  Building2, 
  HelpCircle, 
  ArrowLeft, 
  RefreshCw, 
  Mail, 
  Lock, 
  ExternalLink 
} from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth, functions, httpsCallable } from '../../firebase';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import { useTheme } from '../../context/ThemeContext';

export default function AccountDeletionPage() {
  const { darkMode } = useTheme();

  // Form State
  const [accountType, setAccountType] = useState('resident'); // 'resident' | 'guard'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [societyName, setSocietyName] = useState('');
  const [flatDetails, setFlatDetails] = useState('');
  const [reason, setReason] = useState('');

  // UI Step State: 1 = Form & Terms, 2 = OTP Verification, 3 = Confirmation
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Result Metadata after successful submission
  const [requestResult, setRequestResult] = useState(null);

  const recaptchaVerifierRef = useRef(null);

  // Setup reCAPTCHA Verifier for Phone Auth
  const setupRecaptcha = () => {
    if (!recaptchaVerifierRef.current && typeof window !== 'undefined') {
      try {
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          auth,
          'recaptcha-container',
          {
            size: 'invisible',
            callback: () => {
              // reCAPTCHA solved silently
            },
            'expired-callback': () => {
              setErrorMessage('reCAPTCHA verification expired. Please try sending OTP again.');
            },
          }
        );
      } catch (err) {
        console.warn('reCAPTCHA initialization:', err.message);
      }
    }
  };

  useEffect(() => {
    setupRecaptcha();
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (_) {}
      }
    };
  }, []);

  // Phone Number formatting & validation (+91 standard)
  const formatPhoneNumber = (phone) => {
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('91') && clean.length === 12) {
      return '+' + clean;
    }
    if (clean.length === 10) {
      return '+91' + clean;
    }
    if (phone.startsWith('+')) {
      return phone.trim();
    }
    return '+91' + clean;
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const formatted = formatPhoneNumber(phoneNumber);
    if (!formatted || formatted.length < 12) {
      setErrorMessage('Please enter a valid 10-digit mobile number registered with your GateLink account.');
      return;
    }

    setLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = recaptchaVerifierRef.current;
      const result = await signInWithPhoneNumber(auth, formatted, appVerifier);
      setConfirmationResult(result);
      setStep(2);
    } catch (err) {
      console.error('Phone OTP error:', err);
      if (err.code === 'auth/invalid-phone-number') {
        setErrorMessage('The mobile number format is invalid. Please check and try again.');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMessage('Too many OTP attempts from this device. Please wait a few minutes before trying again.');
      } else {
        setErrorMessage('Unable to send verification OTP. Please verify your mobile number and try again.');
      }
      // Reset reCAPTCHA container on error
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
          recaptchaVerifierRef.current = null;
        } catch (_) {}
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Submit Deletion Request via Cloud Function
  const handleVerifyOtpAndSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit OTP code sent to your mobile number.');
      return;
    }

    if (!confirmationResult) {
      setErrorMessage('Verification session expired. Please request a new OTP.');
      setStep(1);
      return;
    }

    setLoading(true);
    try {
      // 1. Authenticate user via Firebase Phone Auth
      const userCredential = await confirmationResult.confirm(otpCode.trim());
      const authenticatedUser = userCredential.user;

      if (!authenticatedUser || !authenticatedUser.uid) {
        throw new Error('Authentication failed. No user token returned.');
      }

      // 2. Call backend Cloud Function (Authoritative validation)
      const requestAccountDeletionFn = httpsCallable(functions, 'requestAccountDeletion');
      const response = await requestAccountDeletionFn({
        createdVia: 'web',
        targetUid: authenticatedUser.uid,
        role: accountType,
        societyName: societyName.trim(),
        flatDetails: flatDetails.trim(),
        reason: reason.trim(),
      });

      const data = response.data || {};
      setRequestResult({
        requestId: data.requestId || `DEL_REQ_${authenticatedUser.uid}`,
        requestedAt: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        scheduledDeletionAt: data.scheduledDeletionAt
          ? new Date(data.scheduledDeletionAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'In 7 days',
        idempotent: Boolean(data.idempotent),
      });

      setStep(3);
    } catch (err) {
      console.error('Account deletion error:', err);
      if (err.code === 'auth/invalid-verification-code') {
        setErrorMessage('Invalid OTP code. Please check the 6-digit code and try again.');
      } else if (err.code === 'auth/code-expired') {
        setErrorMessage('Verification code has expired. Please request a new OTP.');
      } else if (err.message && err.message.includes('not found')) {
        setErrorMessage('No active GateLink account was found matching this mobile number.');
      } else if (err.message && err.message.includes('Administrative')) {
        setErrorMessage('Administrative accounts cannot be self-deleted online. Please contact support@gatelink.in.');
      } else {
        setErrorMessage(err.message || 'An error occurred while processing your request. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const bgColor = darkMode ? '#0F172A' : '#F8FAFC';
  const cardBg = darkMode ? '#1E293B' : '#FFFFFF';
  const textColor = darkMode ? '#F8FAFC' : '#0F172A';
  const subTextColor = darkMode ? '#94A3B8' : '#64748B';
  const borderColor = darkMode ? '#334155' : '#E2E8F0';

  return (
    <div style={{ backgroundColor: bgColor, color: textColor, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      {/* Hidden reCAPTCHA container */}
      <div id="recaptcha-container"></div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 20px 80px' }}>
        
        {/* Header Badge */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#EF4444',
            padding: '6px 16px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '16px'
          }}>
            <ShieldAlert size={16} />
            Digital Personal Data Protection (DPDP) Compliance
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 800, color: textColor, margin: '0 0 12px' }}>
            Request Account Deletion
          </h1>
          <p style={{ fontSize: '15px', color: subTextColor, maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Submit an official request to delete or anonymize your GateLink Resident or Guard account data under India’s DPDP Act 2023.
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          backgroundColor: cardBg,
          border: `1px solid ${borderColor}`,
          borderRadius: '24px',
          padding: '36px',
          boxShadow: darkMode ? '0 20px 40px rgba(0,0,0,0.4)' : '0 20px 40px rgba(0,0,0,0.05)',
        }}>

          {/* STEP 1: ACCOUNT TYPE & PHONE NUMBER FORM */}
          {step === 1 && (
            <form onSubmit={handleSendOtp}>
              
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
                  <Lock size={16} /> Data Protection & Grace Period Disclosure
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
          )}

          {/* STEP 2: ENTER & VERIFY OTP CODE */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtpAndSubmit}>
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
                onClick={() => setStep(1)}
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
          )}

          {/* STEP 3: CONFIRMATION & REFERENCE ID */}
          {step === 3 && requestResult && (
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
          )}

        </div>
      </div>

      <FooterSection />
    </div>
  );
}
