import { useState, useEffect, useRef } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth, functions, httpsCallable } from '../../../firebase';

export function useAccountDeletion() {
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

  return {
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
  };
}
