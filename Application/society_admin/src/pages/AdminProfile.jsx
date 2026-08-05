import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  ShieldCheck, 
  Lock, 
  Bell, 
  Globe, 
  Activity, 
  CheckCircle, 
  Camera, 
  X,
  Clock
} from 'lucide-react';
import { auth, db } from '../firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getSocietyAdminSession } from '../services/sessionManager';

export default function AdminProfile() {
  const session = getSocietyAdminSession();
  const societyId = session?.societyId || 'SOC-001';

  const [profile, setProfile] = useState({
    name: session?.adminEmail ? session.adminEmail.split('@')[0].replace('.', ' ') : 'Society Administrator',
    email: auth.currentUser?.email || session?.adminEmail || '',
    phone: session?.phone || 'Not configured',
    societyName: session?.societyName || 'Housing Society',
    societyId: societyId,
    role: 'Society Administrator',
    memberSince: new Date().getFullYear().toString()
  });

  const [activityLogs, setActivityLogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  // Edit Form State
  const [formData, setFormData] = useState({ name: '', email: '' });
  
  // Password Form State
  const [pwdData, setPwdData] = useState({ currentPwd: '', newPwd: '', confirmPwd: '' });
  const [submittingPwd, setSubmittingPwd] = useState(false);

  useEffect(() => {
    // 1. Fetch Profile Info
    const user = auth.currentUser;
    if (user) {
      getDoc(doc(db, `societies/${societyId}/users`, user.uid)).then(snap => {
        if (snap.exists()) {
          setProfile(prev => ({ ...prev, ...snap.data() }));
          setFormData({ name: snap.data().name || 'Society Administrator', email: user.email || '' });
        }
      }).catch(e => console.error(e));

      // 2. Fetch Activity Logs Stream
      const qLogs = query(collection(db, `societies/${societyId}/users/${user.uid}/activity_logs`), orderBy('timestamp', 'desc'));
      const unsub = onSnapshot(qLogs, (snap) => {
        const logs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setActivityLogs(logs);
      });
      return () => unsub();
    }
  }, [societyId]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, `societies/${societyId}/users`, user.uid), {
          name: formData.name,
          updatedAt: new Date().toISOString()
        });

        // Add Log
        await addDoc(collection(db, `societies/${societyId}/users/${user.uid}/activity_logs`), {
          action: 'Profile Updated',
          description: 'Updated administrator name and profile metadata.',
          timestamp: new Date().toISOString()
        });

        setProfile(prev => ({ ...prev, name: formData.name }));
        alert('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (e) {
      alert('Error updating profile: ' + e.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwdData.newPwd !== pwdData.confirmPwd) {
      alert('New password and confirmation do not match.');
      return;
    }

    if (pwdData.newPwd.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    setSubmittingPwd(true);

    try {
      const user = auth.currentUser;
      if (user && user.email) {
        const cred = EmailAuthProvider.credential(user.email, pwdData.currentPwd);
        await reauthenticateWithCredential(user, cred);
        await updatePassword(user, pwdData.newPwd);

        await addDoc(collection(db, `societies/${societyId}/users/${user.uid}/activity_logs`), {
          action: 'Password Changed',
          description: 'Administrator account password changed successfully.',
          timestamp: new Date().toISOString()
        });

        alert('Password updated successfully!');
        setIsPasswordModalOpen(false);
        setPwdData({ currentPwd: '', newPwd: '', confirmPwd: '' });
      }
    } catch (e) {
      alert('Error changing password: ' + e.message);
    } finally {
      setSubmittingPwd(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* 1. Header Profile Banner Card */}
      <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#ffffff', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          
          <div style={{ position: 'relative' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#38BDF8', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 800 }}>
              {profile.name.charAt(0)}
            </div>
            <button style={{ position: 'absolute', bottom: 0, right: 0, width: '28px', height: '28px', borderRadius: '50%', border: 'none', backgroundColor: '#ffffff', color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={15} />
            </button>
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>{profile.name}</h2>
            <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span><Building2 size={14} style={{ display: 'inline', marginRight: 4 }} /> {profile.societyName} ({profile.societyId})</span>
              <span><ShieldCheck size={14} style={{ display: 'inline', marginRight: 4, color: '#38BDF8' }} /> {profile.role}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-outline" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)', padding: '8px 16px', fontSize: '13px' }} onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
            <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setIsPasswordModalOpen(true)}>
              <Lock size={15} /> Change Password
            </button>
          </div>

        </div>
      </div>

      {/* 2. Main Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Profile Information Panel */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Administrator Account Details</h3>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>FULL NAME</label>
                <div style={{ fontWeight: 700 }}>{profile.name}</div>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>EMAIL ADDRESS (READ-ONLY)</label>
                <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{profile.email}</div>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>REGISTERED MOBILE</label>
                <div style={{ fontWeight: 700 }}>{profile.phone}</div>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>MEMBER SINCE</label>
                <div style={{ fontWeight: 700 }}>{profile.memberSince}</div>
              </div>
            </div>

            <div style={{ background: 'var(--primary-light)', padding: '14px', borderRadius: '10px', marginTop: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)' }}>SYSTEM PRIVILEGES & RBAC SCOPE</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Full Administrative Rights over <code>{profile.societyId}</code>. Authorized to generate billing, assign complaint staff, and upload society rules.
              </div>
            </div>

          </div>
        </div>

        {/* Activity & Audit Trail */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity Audit</h3>
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '320px', overflowY: 'auto' }}>
            {activityLogs.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                No recent activity logs recorded yet.
              </div>
            ) : (
              activityLogs.map((log) => (
                <div key={log.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{log.action}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{log.description}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    <Clock size={10} style={{ display: 'inline', marginRight: 3 }} /> {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3>Edit Admin Profile</h3>
              <button className="btn-icon" onClick={() => setIsEditing(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Full Name *</label>
                <input required type="text" className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Email Address (Verified)</label>
                <input disabled type="email" className="form-input" value={formData.email} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPasswordModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3>Change Password</h3>
              <button className="btn-icon" onClick={() => setIsPasswordModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Current Password *</label>
                <input required type="password" className="form-input" value={pwdData.currentPwd} onChange={e => setPwdData({ ...pwdData, currentPwd: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>New Password (8+ chars) *</label>
                <input required type="password" className="form-input" value={pwdData.newPwd} onChange={e => setPwdData({ ...pwdData, newPwd: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Confirm New Password *</label>
                <input required type="password" className="form-input" value={pwdData.confirmPwd} onChange={e => setPwdData({ ...pwdData, confirmPwd: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsPasswordModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submittingPwd}>
                  {submittingPwd ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
