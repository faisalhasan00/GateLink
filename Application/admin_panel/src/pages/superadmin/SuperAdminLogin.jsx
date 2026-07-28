import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { setSuperAdminSession } from '../../services/sessionManager';

const SUPER_ADMIN_EMAIL = 'mohammedfaisalhasan@gmail.com';
const SUPER_ADMIN_PASS = 'Raj786f@';

export default function SuperAdminLogin() {
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #3730A3 0%, #4F46E5 100%)',
    }}>
      <div style={{
        background: 'white',
        padding: '48px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '420px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ width: '48px', height: '48px', background: '#EEF2FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '24px' }}>👑</span>
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Owner Portal</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>SocietySphere Platform Admin</p>
          </div>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Platform Login</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '14px' }}>Restricted access — Super Admins only</p>

        {error && (
          <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="mohammedfaisalhasan@gmail.com"
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '48px',
              fontSize: '15px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #3730A3, #4F46E5)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="/login" style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            ← Back to Society Admin Login
          </a>
        </div>
      </div>
    </div>
  );
}
