import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { setSocietyAdminSession } from '../services/sessionManager';
import GateLinkLogo from '../components/ui/GateLinkLogo';
import SeoHead from '../components/seo/SeoHead';
import { ShieldCheck, CheckCircle2, Lock, Mail, User, Phone, Building } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ActivateSociety() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const codeFromUrl = searchParams.get('code') || '';
  const refFromUrl = searchParams.get('ref') || '';

  const [activationCode, setActivationCode] = useState(codeFromUrl);
  const [loading, setLoading] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [provisionedSociety, setProvisionedSociety] = useState(null);
  const [error, setError] = useState('');

  // Form Fields for Password Setup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (codeFromUrl) {
      handleVerifyCode(codeFromUrl);
    }
  }, [codeFromUrl]);

  const handleVerifyCode = async (codeToVerify) => {
    const cleanCode = (codeToVerify || activationCode).trim().toUpperCase();
    if (!cleanCode) {
      setError('Please enter your secret RWA Activation Code.');
      return;
    }

    setVerifyingCode(true);
    setError('');
    setProvisionedSociety(null);

    try {
      const q = query(collection(db, 'societies'), where('activationCode', '==', cleanCode));
      const snap = await getDocs(q);

      if (snap.empty) {
        // Also try searching partner_leads
        const qLead = query(collection(db, 'partner_leads'), where('activationCode', '==', cleanCode));
        const leadSnap = await getDocs(qLead);
        if (leadSnap.empty) {
          throw new Error('Invalid or expired RWA Activation Code. Please check the code sent to your WhatsApp.');
        } else {
          const leadData = leadSnap.docs[0].data();
          setProvisionedSociety({
            id: leadSnap.docs[0].id,
            name: leadData.targetSocietyName,
            city: leadData.targetCity,
            contactPerson: leadData.contactPerson,
            contactPhone: leadData.contactPhone,
            flatCount: leadData.approxFlats || leadData.flatCount || 100,
            partnerLeadId: leadSnap.docs[0].id,
          });
          setEmail(leadData.contactEmail || `admin.${leadData.contactPhone}@gatelink.in`);
        }
      } else {
        const socDoc = snap.docs[0];
        const data = socDoc.data();
        setProvisionedSociety({ id: socDoc.id, ...data });
        setEmail(data.contactEmail || `admin.${data.contactPhone || 'society'}@gatelink.in`);
      }
    } catch (err) {
      console.error('Error verifying activation code:', err);
      setError(err.message || 'Verification failed.');
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleActivateAccount = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cleanEmail = email.trim().toLowerCase();

      // 1. Create Firebase Auth RWA Admin Account
      const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const uid = userCred.user.uid;

      const societyId = provisionedSociety.id;

      // 2. Provision User Document in Firestore
      await setDoc(doc(db, 'users', uid), {
        uid,
        email: cleanEmail,
        name: provisionedSociety.contactPerson || 'RWA Admin',
        phone: provisionedSociety.contactPhone || '',
        role: 'society_admin',
        societyId,
        societyName: provisionedSociety.name,
        status: 'active',
        createdAt: serverTimestamp(),
      });

      // 3. Update Society Status to Active & record Referral Code
      await setDoc(
        doc(db, 'societies', societyId),
        {
          name: provisionedSociety.name,
          city: provisionedSociety.city || '',
          flatCount: provisionedSociety.flatCount || 100,
          adminUid: uid,
          adminEmail: cleanEmail,
          status: 'active',
          referredByCode: refFromUrl || provisionedSociety.referredByCode || '',
          activatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // 4. Update Partner Lead Payout Trigger if linked
      if (provisionedSociety.partnerLeadId) {
        await updateDoc(doc(db, 'partner_leads', provisionedSociety.partnerLeadId), {
          status: 'won',
          referredByCode: refFromUrl || '',
          activatedAt: serverTimestamp(),
        });
      }

      // 5. Store Session & Navigate to Dashboard
      setSocietyAdminSession({
        uid,
        email: cleanEmail,
        role: 'society_admin',
        societyId,
        societyName: provisionedSociety.name,
      });

      navigate('/', { replace: true });
    } catch (err) {
      console.error('Activation error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please use a different email or log in.');
      } else {
        setError(err.message || 'Failed to activate society.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
      color: isDark ? '#FFFFFF' : '#1E293B',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <SeoHead title="Activate Society Admin Account - GateLink" />

      <div style={{ marginBottom: '28px' }}>
        <GateLinkLogo isDark={isDark} size="large" />
      </div>

      <div style={{
        maxWidth: '520px',
        width: '100%',
        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        borderRadius: '20px',
        padding: '36px',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
        boxShadow: '0 20px 40px rgba(0,0,0,0.06)'
      }}>
        {!provisionedSociety ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#ECFDF5', border: '2px solid #059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px auto' }}>
                <ShieldCheck size={28} color="#059669" />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 6px 0' }}>Activate Your Housing Society</h2>
              <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', margin: 0, lineHeight: 1.5 }}>
                Enter the secret 6-digit RWA Activation Code sent to your WhatsApp or mobile.
              </p>
            </div>

            {error && (
              <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#FEF2F2', border: '1px solid #F87171', color: '#991B1B', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
                {error}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleVerifyCode(); }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  RWA Secret Activation Code *
                </label>
                <input
                  type="text"
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SOC-362161"
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '2px solid #059669',
                    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                    color: '#059669',
                    fontSize: '20px',
                    fontWeight: 900,
                    letterSpacing: '2px',
                    textAlign: 'center',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={verifyingCode}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: '#1E3A8A',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: verifyingCode ? 'not-allowed' : 'pointer'
                }}
              >
                {verifyingCode ? 'Verifying Code...' : 'Verify Activation Code →'}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto' }}>
                <CheckCircle2 size={28} color="#059669" />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 900, margin: 0 }}>Code Verified!</h2>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#1E3A8A', marginTop: '4px' }}>
                {provisionedSociety.name}
              </div>
              <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>
                {provisionedSociety.city || 'India'} • {provisionedSociety.flatCount} Flats
              </div>
            </div>

            {error && (
              <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#FEF2F2', border: '1px solid #F87171', color: '#991B1B', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleActivateAccount} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Secretary Admin Email *</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="secretary@society.com"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px 12px 42px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1E293B', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Create Admin Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px 12px 42px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1E293B', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px 12px 42px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1E293B', fontSize: '14px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '10px'
                }}
              >
                {loading ? 'Activating Account...' : '🚀 Launch & Login to Society Admin'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
