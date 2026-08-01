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
const SUPER_ADMIN_PASS = 'Raj786f@';

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

    // Enforce Super Admin credential restriction
    if (cleanEmail !== SUPER_ADMIN_EMAIL.toLowerCase() || password !== SUPER_ADMIN_PASS) {
      setError('Access Denied: Invalid Super Admin credentials.');
      setLoading(false);
      return;
    }

    try {
      // 1. Try standard Firebase Auth login
      const res = await signInWithEmailAndPassword(auth, cleanEmail, password);
      setSuperAdminSession({ email: cleanEmail, token: res.user?.uid });
      navigate('/super-admin');
    } catch (err) {
      // 2. Auto-create account in Firebase Auth on first login
      try {
        const newRes = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        setSuperAdminSession({ email: cleanEmail, token: newRes.user?.uid });
        navigate('/super-admin');
        return;
      } catch (innerErr) {
        console.error("Super Admin auth setup error:", innerErr);
        setError(innerErr.message.replace('Firebase: ', '').replace(/\(.*\)\.?/, ''));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <SeoHead title="Platform Owner Login - HomeHni Hood" description="Super Admin Portal Login for HomeHni Hood Platform Owner." canonicalUrl="https://societysphere.com/super-admin/login" />

      {/* Top Header Logo */}
      <div style={{ marginBottom: '32px' }}>
        <a href={websiteUrl} style={{ textDecoration: 'none' }}>
          <HomeHniHoodLogo isDark={isDark} size="large" />
        </a>
      </div>

      {/* Login Form Container */}
      <div style={{
        background: isDark ? '#1E293B' : '#FFFFFF',
        borderRadius: '4px',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        width: '100%',
        maxWidth: '420px',
        padding: '36px'
      }}>
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 900, background: '#FEF2F2', color: '#EF4444', padding: '4px 10px', borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            PLATFORM SUPER ADMIN
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '12px 0 6px 0' }}>
            Owner Control Console
          </h2>
          <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#666666', margin: 0 }}>
            Restricted access for system administrators & licensing managers
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '12px 14px', borderRadius: '4px', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#444444', display: 'block', marginBottom: '6px' }}>Super Admin Email</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={16} color={isDark ? '#94A3B8' : '#666666'} style={{ position: 'absolute', left: '12px' }} />
              <input
                type="email"
                required
                placeholder="mohammedfaisalhasan@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 12px 12px 38px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#444444', display: 'block', marginBottom: '6px' }}>Super Admin Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} color={isDark ? '#94A3B8' : '#666666'} style={{ position: 'absolute', left: '12px' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 12px 12px 38px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              borderRadius: '2px',
              backgroundColor: '#00B589',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '8px'
            }}
          >
            <span>{loading ? 'Verifying Credentials...' : 'Sign In as Super Admin'}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
