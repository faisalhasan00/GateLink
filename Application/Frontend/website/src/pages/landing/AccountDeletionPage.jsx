import React from 'react';
import { ShieldAlert } from 'lucide-react';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import { useTheme } from '../../context/ThemeContext';
import { useAccountDeletion } from '../../features/account-deletion/hooks/useAccountDeletion';
import { DeletionRequestForm } from '../../features/account-deletion/components/DeletionRequestForm';
import { DeletionOtpVerification } from '../../features/account-deletion/components/DeletionOtpVerification';
import { DeletionSuccessView } from '../../features/account-deletion/components/DeletionSuccessView';

export default function AccountDeletionPage() {
  const { darkMode } = useTheme();

  const {
    accountType,
    setAccountType,
    phoneNumber,
    setPhoneNumber,
    otpCode,
    setOtpCode,
    societyName,
    setSocietyName,
    flatDetails,
    setFlatDetails,
    reason,
    setReason,
    step,
    setStep,
    loading,
    errorMessage,
    requestResult,
    formatPhoneNumber,
    handleSendOtp,
    handleVerifyOtpAndSubmit,
  } = useAccountDeletion();

  const bgColor = darkMode ? '#0F172A' : '#F8FAFC';
  const cardBg = darkMode ? '#1E293B' : '#FFFFFF';
  const textColor = darkMode ? '#F8FAFC' : '#0F172A';
  const subTextColor = darkMode ? '#94A3B8' : '#64748B';
  const borderColor = darkMode ? '#334155' : '#E2E8F0';

  return (
    <div style={{ backgroundColor: bgColor, color: textColor, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      {/* Hidden reCAPTCHA container for Firebase Phone Auth */}
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
            <DeletionRequestForm
              accountType={accountType}
              setAccountType={setAccountType}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              societyName={societyName}
              setSocietyName={setSocietyName}
              flatDetails={flatDetails}
              setFlatDetails={setFlatDetails}
              reason={reason}
              setReason={setReason}
              loading={loading}
              errorMessage={errorMessage}
              onSubmit={handleSendOtp}
              darkMode={darkMode}
              textColor={textColor}
              subTextColor={subTextColor}
              borderColor={borderColor}
            />
          )}

          {/* STEP 2: ENTER & VERIFY OTP CODE */}
          {step === 2 && (
            <DeletionOtpVerification
              phoneNumber={phoneNumber}
              formatPhoneNumber={formatPhoneNumber}
              otpCode={otpCode}
              setOtpCode={setOtpCode}
              loading={loading}
              errorMessage={errorMessage}
              onSubmit={handleVerifyOtpAndSubmit}
              onBack={() => setStep(1)}
              darkMode={darkMode}
              textColor={textColor}
              subTextColor={subTextColor}
              borderColor={borderColor}
            />
          )}

          {/* STEP 3: CONFIRMATION & REFERENCE ID */}
          {step === 3 && requestResult && (
            <DeletionSuccessView
              requestResult={requestResult}
              darkMode={darkMode}
              textColor={textColor}
              subTextColor={subTextColor}
              borderColor={borderColor}
            />
          )}

        </div>
      </div>

      <FooterSection />
    </div>
  );
}
