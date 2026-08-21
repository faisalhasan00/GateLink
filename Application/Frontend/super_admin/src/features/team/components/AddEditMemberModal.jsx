import React from 'react';
import { Key, X, AlertTriangle } from 'lucide-react';
import { PERMISSION_MODULES, ROLE_PRESETS } from '../../../services/teamService';

export default function AddEditMemberModal({
  isDark,
  isOpen,
  onClose,
  editingMember,
  formData,
  setFormData,
  formError,
  formLoading,
  onSaveMember,
  onRoleChange,
  onSelectAllPermissions,
  onClearAllPermissions,
  onToggleSinglePermission,
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        borderRadius: '14px',
        maxWidth: '720px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(30, 58, 138, 0.1)', color: '#1E3A8A' }}>
              <Key size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {editingMember ? `Edit Permissions: ${editingMember.name}` : 'Create Staff Member'}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Configure specific module access and restrictions for this employee.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form Scrollable Body */}
        <form onSubmit={onSaveMember} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {formError && (
              <div style={{
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertTriangle size={18} />
                <span>{formError}</span>
              </div>
            )}

            {/* Basic Info Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Sarah Connor"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                    background: isDark ? '#0F172A' : '#FFFFFF',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Work Email *
                </label>
                <input
                  required
                  disabled={Boolean(editingMember)}
                  type="email"
                  placeholder="e.g. sarah@gatelink.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                    background: isDark ? '#0F172A' : '#FFFFFF',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    opacity: editingMember ? 0.7 : 1
                  }}
                />
              </div>
            </div>

            {!editingMember && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Temporary Login Password *
                </label>
                <input
                  required
                  type="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                    background: isDark ? '#0F172A' : '#FFFFFF',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}

            {/* Role Template Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Role Preset Template
              </label>
              <select
                value={formData.role}
                onChange={(e) => onRoleChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                  background: isDark ? '#0F172A' : '#FFFFFF',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  outline: 'none'
                }}
              >
                {Object.entries(ROLE_PRESETS).map(([key, item]) => (
                  <option key={key} value={key}>{item.label}</option>
                ))}
              </select>
            </div>

            {/* Granular Permission Control Section */}
            <div style={{
              backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
              borderRadius: '10px',
              padding: '16px',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Granular Permission Matrix
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Toggle specific modules this employee is authorized to access.
                  </div>
                </div>

                {/* Select All / Clear All Quick Toggles */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={onSelectAllPermissions}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backgroundColor: '#1E3A8A',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    ✓ Select All
                  </button>
                  <button
                    type="button"
                    onClick={onClearAllPermissions}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backgroundColor: isDark ? '#334155' : '#E2E8F0',
                      color: 'var(--text-primary)',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Permissions Checkbox Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                {PERMISSION_MODULES.map((mod) => {
                  const isChecked = Boolean(formData.permissions[mod.key]);
                  return (
                    <div
                      key={mod.key}
                      onClick={() => onToggleSinglePermission(mod.key)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        backgroundColor: isChecked 
                          ? (mod.isDangerous ? 'rgba(239, 68, 68, 0.08)' : 'rgba(30, 58, 138, 0.08)')
                          : (isDark ? '#1E293B' : '#FFFFFF'),
                        border: isChecked 
                          ? (mod.isDangerous ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(30, 58, 138, 0.4)')
                          : (isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0'),
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        transition: 'all 0.15s'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Controlled by wrapper div onClick
                        style={{ marginTop: '3px', cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {mod.label}
                          {mod.isDangerous && (
                            <span style={{ fontSize: '9px', background: '#FEE2E2', color: '#DC2626', padding: '1px 5px', borderRadius: '3px', fontWeight: 800 }}>
                              HIGH RISK
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.3 }}>
                          {mod.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div style={{
            padding: '16px 24px',
            borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            backgroundColor: isDark ? '#1E293B' : '#F8FAFC'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              style={{
                padding: '10px 22px',
                borderRadius: '8px',
                backgroundColor: '#1E3A8A',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                cursor: formLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {formLoading ? 'Saving...' : (editingMember ? 'Save Changes' : 'Create Staff Member')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
