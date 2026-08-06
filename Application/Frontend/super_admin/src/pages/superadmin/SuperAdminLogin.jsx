import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { setSuperAdminSession } from '../../services/sessionManager';
import HomeHniHoodLogo from '../../components/ui/HomeHniHoodLogo';
import SeoHead from '../../components/seo/SeoHead';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldAlert } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const SUPER_ADMIN_EMAIL = 'mohammedfaisalhasan@gmail.com';

export default function SuperAdminLogin() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 
    (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:5173'
      : 'https://society-sphere-two.vercel.app');
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

    // Enforce Super Admin email restriction
    if (cleanEmail !== SUPER_ADMIN_EMAIL.toLowerCase()) {
      setError('Access Denied: Unrecognized Super Admin email address.');
      setLoading(false);
      return;
    }

    try {
      // 1. Try standard Firebase Auth login
      const res = await signInWithEmailAndPassword(auth, cleanEmail, password);
      setSuperAdminSession({ email: cleanEmail, token: res.user?.uid });
      navigate('/');
    } catch (err) {
      // 2. Auto-create account in Firebase Auth on first initialization if password is strong (>= 6 chars)
      if (password.length >= 6) {
        try {
          const newRes = await createUserWithEmailAndPassword(auth, cleanEmail, password);
          setSuperAdminSession({ email: cleanEmail, token: newRes.user?.uid });
          navigate('/');
          return;
        } catch (innerErr) {
          if (innerErr.code === 'auth/email-already-in-use' || innerErr.code === 'auth/wrong-password') {
            setError('Invalid password. Please enter your correct Super Admin password.');
          } else {
            console.error("Super Admin auth setup error:", innerErr);
            setError(innerErr.message.replace('Firebase: ', '').replace(/\(.*\)\.?/, ''));
          }
        }
      } else {
        setError('Invalid credentials or password too short.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <SeoHead title="Super Admin Portal Login - HomeHni Hood" description="Secure Executive Login for HomeHni Hood Super Administrators." canonicalUrl="https://admin.societysphere.com/super-admin/login" />

      {/* Top Header Logo */}
      <div style={{ marginBottom: '32px' }}>
        <a href={websiteUrl} style={{ textDecoration: 'none' }}>
          <HomeHniHoodLogo isDark={isDark} size="large" />
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
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155', marginBottom: '6px' }}>
              Password *
            </label>
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
