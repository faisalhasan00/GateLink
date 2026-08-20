import React from 'react';
import { RefreshCw, Copy, Eye, EyeOff } from 'lucide-react';
import { generateSecurePassword } from '../hooks/useResidents';

export default function AddResidentModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  showPassword,
  setShowPassword,
  onSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Resident Manually</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Arjun Kumar"
            />
          </div>
          <div className="form-group">
            <label>Flat Number *</label>
            <input
              required
              type="text"
              value={formData.flatNumber}
              onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })}
              placeholder="e.g. A-101"
            />
          </div>
          <div className="form-group">
            <label>Email Address *</label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="resident@email.com"
            />
          </div>
          <div className="form-group">
            <label>Mobile Number *</label>
            <input
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </div>

          <div style={{ background: 'var(--bg-color)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', marginTop: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Resident Login Password *
              </label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, password: generateSecurePassword() })}
                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <RefreshCw size={12} /> Auto-Generate Password
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter or generate resident password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{ width: '100%', padding: '10px 36px 10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(formData.password);
                  alert('Password copied to clipboard!');
                }}
                className="btn btn-outline"
                style={{ padding: '9px 12px', fontSize: '12px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Copy size={13} /> Copy
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Resident</button>
          </div>
        </form>
      </div>
    </div>
  );
}
