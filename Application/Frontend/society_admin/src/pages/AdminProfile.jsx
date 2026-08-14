import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  Camera, 
  X,
  Clock
} from 'lucide-react';
import { auth } from '../firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { getSocietyAdminSession } from '../services/sessionManager';
import { societyAdminService } from '../services/societyAdminService';
import BankAccountCard from '../components/finance/BankAccountCard';

export default function AdminProfile() {
  const session = getSocietyAdminSession();
  const societyId = session?.societyId;

  const [profile, setProfile] = useState({
    name: session?.adminEmail ? session.adminEmail.split('@')[0].replace('.', ' ') : 'Society Administrator',
    email: auth.currentUser?.email || session?.adminEmail || '',
    phone: session?.phone || 'Not configured',
    societyName: session?.societyName || 'Housing Society',
    societyId: societyId || 'SOC-ADMIN',
    role: 'Society Administrator',
    memberSince: new Date().getFullYear().toString()
  });

  const [activityLogs, setActivityLogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [pwdData, setPwdData] = useState({ currentPwd: '', newPwd: '', confirmPwd: '' });
  const [submittingPwd, setSubmittingPwd] = useState(false);

  useEffect(() => {
    if (session?.adminEmail) {
      setFormData({ name: profile.name, email: session.adminEmail });
    }
  }, [session, profile.name]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setProfile(prev => ({ ...prev, name: formData.name }));
      await societyAdminService.logAuditAction(societyId, {
        action: 'Profile Updated',
        description: 'Updated administrator profile metadata.'
      });
      alert('Profile updated successfully!');
      setIsEditing(false);
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
      <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#ffffff', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#38BDF8', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 800 }}>
              {profile.name.charAt(0)}
            </div>
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

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Administrator Account Details</h3>
        </div>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700 }}>FULL NAME</label>
            <div style={{ fontWeight: 700 }}>{profile.name}</div>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700 }}>EMAIL ADDRESS</label>
            <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{profile.email}</div>
          </div>
        </div>
      </div>

      {/* Society Bank Account & Auto-Settlement Details */}
      <BankAccountCard societyId={societyId} />

      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button className="btn-icon" onClick={() => setIsEditing(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPasswordModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPasswordModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Password</h3>
              <button className="btn-icon" onClick={() => setIsPasswordModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label>Current Password</label>
                <input required type="password" value={pwdData.currentPwd} onChange={e => setPwdData({ ...pwdData, currentPwd: e.target.value })} />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input required type="password" value={pwdData.newPwd} onChange={e => setPwdData({ ...pwdData, newPwd: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input required type="password" value={pwdData.confirmPwd} onChange={e => setPwdData({ ...pwdData, confirmPwd: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsPasswordModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submittingPwd}>{submittingPwd ? 'Updating...' : 'Update'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
