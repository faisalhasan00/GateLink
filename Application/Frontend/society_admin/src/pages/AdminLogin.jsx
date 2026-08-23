import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { setSocietyAdminSession, performCentralizedLogout } from '../services/sessionManager';
import GateLinkLogo from '../components/ui/GateLinkLogo';
import SeoHead from '../components/seo/SeoHead';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AdminLogin() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getWebsiteUrl = () => {
    if (import.meta.env.VITE_WEBSITE_URL) return import.meta.env.VITE_WEBSITE_URL;
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      if (host === 'localhost' || host === '127.0.0.1') return 'http://localhost:5173';
      if (host.includes('web.app') || host.includes('firebaseapp.com')) return 'https://gatelink-website-staging.web.app';
    }
    return 'https://gatelink.in';
  };

  const websiteUrl = getWebsiteUrl();
  const websiteContactUrl = `${websiteUrl}/contact`;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Authoritative Firebase Authentication
      const res = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const uid = res.user?.uid;

      if (!uid) {
        throw new Error('Authentication failed: Missing user credentials.');
      }

      // 2. Authoritative Server/Database Verification
      const userDocSnap = await getDoc(doc(db, 'users', uid));

      if (!userDocSnap.exists()) {
        await performCentralizedLogout(auth);
        throw new Error('Account not found or account is no longer active.');
      }

      const userData = userDocSnap.data() || {};
      const status = (userData.status || 'active').toLowerCase();
      const role = userData.role;

      // Check if user was deleted or suspended in database
      if (status === 'deleted' || status === 'suspended' || status === 'inactive') {
        await performCentralizedLogout(auth);
        throw new Error('Account not found or account is no longer active.');
      }

      if (role !== 'admin' && role !== 'society_admin' && role !== 'super_admin') {
        await performCentralizedLogout(auth);
        throw new Error('Unauthorized: Insufficient permissions for Society Admin Console.');
      }

      let resolvedSocietyId = userData.societyId;
      let resolvedSocietyName = userData.societyName || 'Society Management Committee';

      if (!resolvedSocietyId || resolvedSocietyId === 'SOC-ADMIN') {
        const socQuery = query(collection(db, 'societies'), where('adminEmail', '==', cleanEmail));
        const socSnap = await getDocs(socQuery);
        if (!socSnap.empty) {
          const matchedDoc = socSnap.docs[0];
          resolvedSocietyId = matchedDoc.id;
          resolvedSocietyName = matchedDoc.data()?.name || resolvedSocietyName;
        } else {
          await performCentralizedLogout(auth);
          throw new Error('Associated society account not found or has been deactivated.');
        }
      }

      // Verify society document actually exists in Firestore and is not deleted
      const socDocSnap = await getDoc(doc(db, 'societies', resolvedSocietyId));
      if (!socDocSnap.exists() || socDocSnap.data()?.status === 'deleted' || socDocSnap.data()?.status === 'suspended') {
        await performCentralizedLogout(auth);
        throw new Error('Associated society account not found or has been deactivated.');
      }

      resolvedSocietyName = socDocSnap.data()?.name || resolvedSocietyName;

      // 3. Session Initialization on Successful Authoritative Verification
      setSocietyAdminSession({ 
        email: cleanEmail, 
        token: uid, 
        societyId: resolvedSocietyId,
        societyName: resolvedSocietyName
      });

      navigate('/');
    } catch (err) {
      const errStr = `${err.code || ''} ${err.message || ''}`.toLowerCase();
      let msg = 'Invalid email or password. Please verify your credentials.';
      if (errStr.includes('operation-not-allowed')) {
        msg = 'Email/Password sign-in is disabled in Firebase Console.';
      } else if (
        errStr.includes('invalid-credential') || 
        errStr.includes('wrong-password') || 
        errStr.includes('user-not-found') ||
        errStr.includes('invalid-email')
      ) {
        msg = 'Invalid email or password. Please check your password or use "Forgot / Reset Password?".';
      } else if (err.message) {
        const cleaned = err.message.replace(/^Firebase:\s*/i, '').trim();
        if (cleaned && cleaned !== 'Error') {
          msg = cleaned;
        }
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <SeoHead title="Society Admin Login - GateLink" description="Login to GateLink Society Management Committee Console." canonicalUrl="https://gatelink.in/login" />

      <div style={{ marginBottom: '32px' }}>
        <a href={websiteUrl} style={{ textDecoration: 'none' }}>
          <GateLinkLogo isDark={isDark} size="large" />
        </a>
      </div>

      <div style={{
        background: isDark ? '#1E293B' : '#FFFFFF',
        borderRadius: '16px',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        width: '100%',
        maxWidth: '420px',
        padding: '36px'
      }}>
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 900, background: '#EFF6FF', color: '#1E3A8A', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            RWA COMMITTEE PORTAL
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '12px 0 6px 0' }}>
            Society Admin Login
          </h2>
          <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#666666', margin: 0 }}>
            Sign in to manage your residents, security gates, and ledgers
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '12px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#444444', display: 'block', marginBottom: '6px' }}>Admin Email Address</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={16} color={isDark ? '#94A3B8' : '#666666'} style={{ position: 'absolute', left: '12px' }} />
              <input
                type="email"
                required
                placeholder="admin@society.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 12px 12px 38px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#444444', display: 'block', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} color={isDark ? '#94A3B8' : '#666666'} style={{ position: 'absolute', left: '12px' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 12px 12px 38px', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: '#1E3A8A',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '8px',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#172554'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1E3A8A'}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #F1F5F9', marginTop: '24px', paddingTop: '16px', textAlign: 'center', fontSize: '13px', color: isDark ? '#94A3B8' : '#666666' }}>
          <span>Need to register your society? </span>
          <a href={websiteContactUrl} style={{ color: '#0EA5E9', textDecoration: 'none', fontWeight: 700 }}>Enroll Your Society</a>
        </div>
      </div>
    </div>
  );
}
