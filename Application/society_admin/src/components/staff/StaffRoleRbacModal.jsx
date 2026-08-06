import React from 'react';
import { X, Check } from 'lucide-react';

/**
 * @component StaffRoleRbacModal
 * @description Dialog modal for creating custom RBAC roles with granular module action permission matrices.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen Controls modal visibility
 * @param {Function} props.onClose Callback to close modal
 * @param {Object} props.roleFormData Form state for custom role name and module permissions
 * @param {Function} props.setRoleFormData State updater for roleFormData
 * @param {Array<Object>} props.modulePermissions List of system modules and allowed actions
 * @param {Function} props.togglePermissionAction Callback to toggle specific module action
 * @param {Function} props.onSubmit Form submit handler callback
 * @param {boolean} props.submitting Loading flag during submission
 */
export default function StaffRoleRbacModal({
  isOpen,
  onClose,
  roleFormData,
  setRoleFormData,
  modulePermissions = [],
  togglePermissionAction,
  onSubmit,
  submitting = false
}) {
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
          maxWidth: '680px', 
          maxHeight: '88vh', 
          overflowY: 'auto', 
          borderRadius: '16px', 
          padding: '24px', 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' 
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
          <h3 className="card-title" style={{ fontSize: '18px', fontWeight: 800 }}>RBAC Role & Permission Matrix</h3>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        {/* RBAC Form */}
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>New Custom Role Name *</label>
            <input 
              required 
              type="text" 
              placeholder="e.g. Senior Security Supervisor"
              value={roleFormData.roleName}
              onChange={e => setRoleFormData({ ...roleFormData, roleName: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
            />
          </div>

          {/* Module Action Permission Matrix */}
          <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '12px', letterSpacing: '0.5px' }}>
              MODULE ACTION PERMISSIONS
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {modulePermissions.map(mod => {
                const selectedActions = roleFormData.permissions[mod.id] || [];

                return (
                  <div key={mod.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#ffffff', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700 }}>{mod.label}</span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {mod.actions.map(act => {
                        const isChecked = selectedActions.includes(act);
                        return (
                          <button
                            key={act}
                            type="button"
                            onClick={() => togglePermissionAction(mod.id, act)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                              border: isChecked ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                              backgroundColor: isChecked ? 'var(--primary-light)' : 'transparent',
                              color: isChecked ? 'var(--primary)' : 'var(--text-secondary)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {isChecked && <Check size={10} style={{ display: 'inline', marginRight: 2 }} />} {act}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1, padding: '10px' }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '10px' }} disabled={submitting}>
              {submitting ? 'Creating...' : 'Save Custom Role & Matrix'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
