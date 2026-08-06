import React, { useState } from 'react';
import { X, RefreshCw, Eye, EyeOff, Copy } from 'lucide-react';

/**
 * @component StaffOnboardModal
 * @description Modal dialog for onboarding new staff members or editing existing staff profiles.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen Controls modal visibility
 * @param {Function} props.onClose Callback to close modal
 * @param {Object} props.formData Form state data
 * @param {Function} props.setFormData State updater for form data
 * @param {Object} props.editingStaff Currently selected staff object if in edit mode
 * @param {Array<string>} props.departments List of available departments
 * @param {Object} props.departmentRolesMap Mapping of department to related roles
 * @param {Array<Object>} props.customRoles Custom RBAC roles
 * @param {Function} props.handleDepartmentChange Callback when changing department selection
 * @param {Function} props.generateSecurePassword Helper function to generate passwords
 * @param {Function} props.onSubmit Form submit handler callback
 * @param {boolean} props.submitting Loading flag during form submission
 */
export default function StaffOnboardModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  editingStaff = null,
  departments = [],
  departmentRolesMap = {},
  customRoles = [],
  handleDepartmentChange,
  generateSecurePassword,
  onSubmit,
  submitting = false
}) {
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)', 
        backdropFilter: 'blur(4px)', 
        zIndex: 1000,
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '20px'
      }}
    >
      <div 
        className="card" 
        style={{ 
          width: '100%', 
          maxWidth: '560px', 
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '16px', 
          padding: '24px', 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
        }}
      >
        {/* Modal Header */}
        <div 
          className="card-header" 
          style={{ 
            margin: '-24px -24px 20px -24px', 
            padding: '16px 24px', 
            borderBottom: '1px solid var(--border-color)', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}
        >
          <h3 className="card-title" style={{ fontSize: '18px', fontWeight: 800 }}>
            {editingStaff ? 'Edit Staff Profile' : 'Onboard New Staff Member'}
          </h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Onboarding Form */}
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Full Name */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Full Name *</label>
            <input 
              required 
              type="text" 
              placeholder="e.g. Rajesh Kumar" 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }} 
            />
          </div>

          {/* Contact Information (Phone & Email) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Mobile Phone *</label>
              <input 
                required 
                type="tel" 
                placeholder="+91 98765 43210" 
                value={formData.phone} 
                onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Email Address</label>
              <input 
                type="email" 
                placeholder="staff@society.com" 
                value={formData.email} 
                onChange={e => setFormData({ ...formData, email: e.target.value })} 
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }} 
              />
            </div>
          </div>

          {/* Department & Assigned Role */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Department *</label>
              <select 
                className="form-select" 
                value={formData.department} 
                onChange={e => handleDepartmentChange(e.target.value)} 
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Assigned Role *</label>
              <select 
                className="form-select" 
                value={formData.role} 
                onChange={e => setFormData({ ...formData, role: e.target.value })} 
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
              >
                <optgroup label={`Roles for ${formData.department}`}>
                  {(departmentRolesMap[formData.department] || []).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </optgroup>
                {customRoles.length > 0 && (
                  <optgroup label="Custom RBAC Roles">
                    {customRoles.map(cr => (
                      <option key={cr.id} value={cr.roleName}>{cr.roleName} (Custom)</option>
                    ))}
                  </optgroup>
                )}
                <optgroup label="Custom Option">
                  <option value="Custom">✏️ Type Custom Role Manually...</option>
                </optgroup>
              </select>

              {/* Custom Manual Role Text Input */}
              {formData.role === 'Custom' && (
                <div style={{ marginTop: '8px' }}>
                  <input 
                    required 
                    type="text" 
                    placeholder="Type custom role title (e.g. Night Patrol Lead)..." 
                    value={formData.customRoleText} 
                    onChange={e => setFormData({ ...formData, customRoleText: e.target.value })} 
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid var(--primary)', fontSize: '12px', outline: 'none' }} 
                  />
                </div>
              )}
            </div>
          </div>

          {/* Staff Login Password Section */}
          <div style={{ background: 'var(--bg-color)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Staff Login Password *
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
                  placeholder="Enter or generate staff password" 
                  value={formData.password} 
                  onChange={e => setFormData({ ...formData, password: e.target.value })} 
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

          {/* Assigned Gate & Joining Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Assigned Gate / Block</label>
              <input 
                type="text" 
                placeholder="Gate 1 — Main Entry" 
                value={formData.assignedGate} 
                onChange={e => setFormData({ ...formData, assignedGate: e.target.value })} 
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Joining Date</label>
              <input 
                type="date" 
                value={formData.joiningDate} 
                onChange={e => setFormData({ ...formData, joiningDate: e.target.value })} 
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }} 
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Emergency Contact Phone</label>
            <input 
              type="tel" 
              placeholder="+91 91234 56789" 
              value={formData.emergencyContact} 
              onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })} 
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }} 
            />
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <button 
              type="button" 
              className="btn btn-outline" 
              style={{ flex: 1, padding: '10px' }} 
              onClick={onClose} 
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ flex: 1, padding: '10px' }} 
              disabled={submitting}
            >
              {submitting ? 'Saving...' : editingStaff ? 'Update Staff Record' : 'Complete Onboarding'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
