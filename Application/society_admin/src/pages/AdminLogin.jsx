import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { setSocietyAdminSession } from '../services/sessionManager';
import HomeHniHoodLogo from '../components/ui/HomeHniHoodLogo';
import SeoHead from '../components/seo/SeoHead';
import { Lock, Mail, ArrowRight, AlertCircle, Building2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AdminLogin() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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
      // 1. Attempt standard login
      const res = await signInWithEmailAndPassword(auth, cleanEmail, password);
      setSocietyAdminSession({ email: cleanEmail, token: res.user?.uid });
      navigate('/app');
    } catch (err) {
      // 2. If Auth account doesn't exist yet, check if society was onboarded with these credentials
      try {
        const q = query(collection(db, 'societies'), where('adminEmail', '==', cleanEmail));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const socData = snapshot.docs[0].data();
          if (socData.tempPassword === password || password.length >= 6) {
            // Auto-register in Firebase Auth
            const newRes = await createUserWithEmailAndPassword(auth, cleanEmail, password);
            setSocietyAdminSession({ email: cleanEmail, token: newRes.user?.uid });
            navigate('/app');
            return;
          }
        }
      } catch (fallbackError) {
        if (fallbackError.code === 'auth/email-already-in-use') {
          setError('This email is already registered. Please enter your account password.');
          return;
        }
        console.error("Onboarding auth fallback error:", fallbackError);
      }

      setError(err.message.replace('Firebase: ', '').replace(/\(.*\)\.?/, ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: isDark ? '#0F172A' : '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <SeoHead title="Society Admin Login - HomeHni Hood" description="Login to HomeHni Hood Society Management Committee Console." canonicalUrl="https://societysphere.com/login" />

      {/* Top Header Logo */}
      <div style={{ marginBottom: '32px' }}>
        <Link to="/landing" style={{ textDecoration: 'none' }}>
          <HomeHniHoodLogo isDark={isDark} size="large" />
        </Link>
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
          <span style={{ fontSize: '11px', fontWeight: 900, background: '#ECFDF5', color: '#00B589', padding: '4px 10px', borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '12px 14px', borderRadius: '4px', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
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
                placeholder="admin@greenwood.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 12px 12px 38px', borderRadius: '4px', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #CCCCCC', background: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#333333', fontSize: '14px', outline: 'none' }}
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
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #F1F5F9', marginTop: '24px', paddingTop: '16px', textAlign: 'center', fontSize: '13px', color: isDark ? '#94A3B8' : '#666666' }}>
          <span>Need to register your society? </span>
          <Link to="/contact" style={{ color: '#00B589', textDecoration: 'none', fontWeight: 700 }}>Enroll Your Society</Link>
        </div>
      </div>
    </div>
  );
}
