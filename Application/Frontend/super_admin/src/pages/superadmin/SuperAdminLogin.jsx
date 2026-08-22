import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { setSuperAdminSession, performCentralizedLogout } from '../../services/sessionManager';
import GateLinkLogo from '../../components/ui/GateLinkLogo';
import SeoHead from '../../components/seo/SeoHead';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const SUPER_ADMIN_EMAIL = 'mohammedfaisalhasan@gmail.com';

export default function SuperAdminLogin() {
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    const targetEmail = (email.trim() || SUPER_ADMIN_EMAIL).toLowerCase();
    setError('');
    setResetSuccess('');
    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, targetEmail);
      setResetSuccess(`Password reset link sent to ${targetEmail}. Please check your inbox / spam folder.`);
    } catch (err) {
      console.error('Password reset error:', err);
      let msg = err.message || 'Failed to send password reset email.';
      if (err.code === 'auth/user-not-found') {
        msg = 'No account found with this email.';
      }
      setError(msg);
    } finally {
      setResetLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Authoritative Firebase Auth Sign In
      const res = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const uid = res.user?.uid;

      if (!uid) {
        throw new Error('Authentication failed: Invalid credentials.');
      }

      const isMaster = cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase();

      if (!isMaster) {
        // 2. Staff Account Authoritative Database Verification
        const staffDocSnap = await getDoc(doc(db, 'super_admin_team', uid));
        let isStaffAuthorized = false;

        if (staffDocSnap.exists()) {
          const staffData = staffDocSnap.data() || {};
          if (staffData.status === 'Suspended' || staffData.status === 'inactive' || staffData.status === 'deleted') {
            await performCentralizedLogout(auth);
            throw new Error('Account Suspended: Your staff access has been disabled by the Administrator.');
          }
          isStaffAuthorized = true;
        } else {
          // Fallback check in users collection
          const userDocSnap = await getDoc(doc(db, 'users', uid));
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data() || {};
            if (userData.status === 'deleted' || userData.status === 'suspended') {
              await performCentralizedLogout(auth);
              throw new Error('Account Suspended: Your account is no longer active.');
            }
            if (userData.role === 'super_admin' || userData.role === 'employee' || userData.role === 'staff') {
              isStaffAuthorized = true;
            }
          }
        }

        if (!isStaffAuthorized) {
          await performCentralizedLogout(auth);
          throw new Error('Access Denied: You do not have permission to access the Super Admin Portal.');
        }
      }

      setSuperAdminSession({ email: cleanEmail, token: uid });
      navigate('/');
    } catch (err) {
      await performCentralizedLogout(auth);
      let msg = err.message || 'Authentication failed.';
      if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email/Password sign-in is disabled in Firebase Console.';
      } else if (
        err.code === 'auth/invalid-credential' || 
        err.code === 'auth/wrong-password' || 
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/invalid-email'
      ) {
        msg = 'Invalid email or password. Please verify your credentials.';
      } else {
        msg = msg.replace('Firebase: ', '').replace(/\(.*\)\.?/, '').trim();
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <SeoHead title="Super Admin Portal Login - GateLink" description="Secure Executive Login for GateLink Super Administrators." canonicalUrl="https://admin.gatelink.in/super-admin/login" />

      {/* Top Header Logo */}
      <div style={{ marginBottom: '32px' }}>
        <a href={websiteUrl} style={{ textDecoration: 'none' }}>
          <GateLinkLogo isDark={isDark} size="large" />
        </a>
      </div>

      {/* Login Card */}
      <div style={{
        background: isDark ? '#1E293B' : '#FFFFFF',
        borderRadius: '8px',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '420px',
        padding: '36px'
      }}>
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 900, background: '#FEF2F2', color: '#DC2626', padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={13} /> EXECUTIVE PORTAL
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '12px 0 6px 0' }}>
            Super Admin Login
          </h2>
          <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#666666', margin: 0 }}>
            Master system control console & SaaS multi-tenant hub
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '12px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} flexShrink={0} />
            <span>{error}</span>
          </div>
        )}

        {resetSuccess && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '6px',
            padding: '12px 14px',
            marginBottom: '20px',
            color: '#16A34A',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0 }} />
            <span>{resetSuccess}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155', marginBottom: '6px' }}>
              Super Admin Email *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mohammedfaisalhasan@gmail.com"
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  borderRadius: '6px',
                  border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                  background: isDark ? '#0F172A' : '#FFFFFF',
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155' }}>
                Password *
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#DC2626',
                  cursor: resetLoading ? 'not-allowed' : 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {resetLoading ? 'Sending link...' : 'Forgot / Reset Password?'}
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  borderRadius: '6px',
                  border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                  background: isDark ? '#0F172A' : '#FFFFFF',
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '14px',
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '6px'
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In as Super Admin'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}
