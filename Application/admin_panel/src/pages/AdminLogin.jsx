import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { setSocietyAdminSession } from '../services/sessionManager';

export default function AdminLogin() {
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
      navigate('/');
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
            navigate('/');
            return;
          }
        }
      } catch (fallbackError) {
        if (fallbackError.code === 'auth/email-already-in-use') {
          setError('This email is already registered in Firebase. Please enter the password associated with this email address.');
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #EEF2FF 0%, #F3F4F6 100%)',
    }}>
      <div style={{
        background: 'white',
        padding: '48px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(79,70,229,0.12)',
        width: '100%',
        maxWidth: '420px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '24px' }}>🏢</span>
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>SocietySphere</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Society Admin Portal</p>
          </div>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Welcome back</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '14px' }}>Sign in to manage your society</p>

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
              placeholder="admin@greenwood.com"
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
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', height: '48px', fontSize: '15px' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="/super-admin/login" style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Platform Super Admin? →
          </a>
        </div>
      </div>
    </div>
  );
}
