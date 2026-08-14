import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Building2, 
  Lock, 
  Camera, 
  Activity, 
  Globe, 
  X,
  Clock
} from 'lucide-react';
import { auth, db } from '../../firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

export default function SuperAdminProfile() {
  const [profile, setProfile] = useState({
    name: 'Super System Administrator',
    email: auth.currentUser?.email || 'superadmin@gatelink.in',
    phone: '+91 99999 88888',
    role: 'Global System Administrator',
    organization: 'GateLink Corp',
    lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pwdData, setPwdData] = useState({ currentPwd: '', newPwd: '', confirmPwd: '' });
  const [submittingPwd, setSubmittingPwd] = useState(false);

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

        alert('Super Admin password updated successfully!');
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
      
      {/* Super Admin Identity Card */}
      <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, #312E81 0%, #4338CA 100%)', color: '#ffffff', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#818CF8', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 800 }}>
            SA
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>{profile.name}</h2>
            <div style={{ fontSize: '13px', color: '#C7D2FE', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span><Building2 size={14} style={{ display: 'inline', marginRight: 4 }} /> {profile.organization}</span>
              <span><ShieldCheck size={14} style={{ display: 'inline', marginRight: 4, color: '#A5B4FC' }} /> {profile.role}</span>
            </div>
          </div>

          <button className="btn btn-primary" style={{ backgroundColor: '#ffffff', color: '#4338CA', border: 'none', padding: '8px 16px', fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setIsPasswordModalOpen(true)}>
            <Lock size={15} /> Change Master Password
          </button>

        </div>
      </div>

      {/* Profile Details Panel */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 className="card-title" style={{ marginBottom: '16px' }}>Super Admin Account Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>ADMINISTRATOR NAME</label>
            <div style={{ fontWeight: 700 }}>{profile.name}</div>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>AUTHENTICATED EMAIL</label>
            <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{profile.email}</div>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>ORGANIZATION</label>
            <div style={{ fontWeight: 700 }}>{profile.organization}</div>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>LAST LOGIN SESSION</label>
            <div style={{ fontWeight: 700, color: '#10B981' }}>{profile.lastLogin} (Active Now)</div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPasswordModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3>Change Master Password</h3>
              <button className="btn-icon" onClick={() => setIsPasswordModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Current Password *</label>
                <input required type="password" className="form-input" value={pwdData.currentPwd} onChange={e => setPwdData({ ...pwdData, currentPwd: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>New Master Password (8+ chars) *</label>
                <input required type="password" className="form-input" value={pwdData.newPwd} onChange={e => setPwdData({ ...pwdData, newPwd: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Confirm New Password *</label>
                <input required type="password" className="form-input" value={pwdData.confirmPwd} onChange={e => setPwdData({ ...pwdData, confirmPwd: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsPasswordModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submittingPwd}>
                  {submittingPwd ? 'Updating...' : 'Update Master Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
