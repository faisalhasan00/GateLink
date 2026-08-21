import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { MASTER_SUPER_ADMIN_EMAIL } from '../../../context/SuperAdminAuthContext';
import { PERMISSION_MODULES } from '../../../services/teamService';

export default function TeamTable({
  isDark,
  loading,
  filteredMembers,
  isMasterAdmin,
  onOpenEditModal,
  onToggleStatus,
  setDeleteConfirmMember
}) {
  return (
    <div style={{
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: '12px',
      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{
              backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
              borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <th style={{ padding: '14px 20px', fontWeight: 700 }}>Employee Name</th>
              <th style={{ padding: '14px 20px', fontWeight: 700 }}>Role</th>
              <th style={{ padding: '14px 20px', fontWeight: 700 }}>Allowed Modules</th>
              <th style={{ padding: '14px 20px', fontWeight: 700 }}>Status</th>
              <th style={{ padding: '14px 20px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* 1. Master Super Admin Row (Permanent) */}
            <tr style={{
              borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #F1F5F9',
              backgroundColor: isDark ? 'rgba(30, 58, 138, 0.08)' : 'rgba(224, 242, 254, 0.25)'
            }}>
              <td style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#1E3A8A',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '14px'
                  }}>
                    👑
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Master Administrator (You)
                      <span style={{ fontSize: '10px', background: '#F59E0B', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>OWNER</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{MASTER_SUPER_ADMIN_EMAIL}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: '16px 20px' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(30, 58, 138, 0.15)',
                  color: '#1E3A8A',
                  fontWeight: 700,
                  fontSize: '12px'
                }}>
                  Super Admin (Unrestricted)
                </span>
              </td>
              <td style={{ padding: '16px 20px' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10B981',
                  fontWeight: 700,
                  fontSize: '11px'
                }}>
                  Full Access (All Modules & Payouts)
                </span>
              </td>
              <td style={{ padding: '16px 20px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: '#10B981',
                  fontWeight: 700,
                  fontSize: '12px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  Active Permanent
                </span>
              </td>
              <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Primary Owner</span>
              </td>
            </tr>

            {/* 2. Employee Records */}
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Loading staff directory...
                </td>
              </tr>
            ) : filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No employee accounts found matching your filters.
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => {
                const allowedCount = Object.values(member.permissions || {}).filter(Boolean).length;
                const isSuspended = member.status === 'Suspended';

                return (
                  <tr 
                    key={member.id}
                    style={{
                      borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #F1F5F9',
                      opacity: isSuspended ? 0.7 : 1,
                      transition: 'background 0.15s'
                    }}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: isSuspended ? '#94A3B8' : '#0EA5E9',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '13px'
                        }}>
                          {member.name ? member.name.charAt(0).toUpperCase() : 'E'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{member.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{member.email}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                        fontSize: '12px'
                      }}>
                        {member.role || 'Staff Member'}
                      </span>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '340px' }}>
                        {PERMISSION_MODULES.map((mod) => {
                          const isGranted = Boolean(member.permissions && member.permissions[mod.key]);
                          if (!isGranted) return null;
                          return (
                            <span
                              key={mod.key}
                              style={{
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor: mod.isDangerous ? 'rgba(239, 68, 68, 0.1)' : 'rgba(14, 165, 233, 0.1)',
                                color: mod.isDangerous ? '#DC2626' : '#0284C7',
                                fontSize: '11px',
                                fontWeight: 600
                              }}
                            >
                              {mod.label}
                            </span>
                          );
                        })}
                        {allowedCount === 0 && (
                          <span style={{ fontSize: '11px', color: '#EF4444', fontStyle: 'italic' }}>No permissions assigned</span>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <button
                        onClick={() => onToggleStatus(member)}
                        disabled={!isMasterAdmin}
                        title={isMasterAdmin ? "Click to toggle status" : undefined}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          backgroundColor: isSuspended ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                          color: isSuspended ? '#EF4444' : '#10B981',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '12px',
                          cursor: isMasterAdmin ? 'pointer' : 'default'
                        }}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isSuspended ? '#EF4444' : '#10B981' }} />
                        {member.status || 'Active'}
                      </button>
                    </td>

                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      {isMasterAdmin && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => onOpenEditModal(member)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              backgroundColor: isDark ? '#334155' : '#F1F5F9',
                              color: 'var(--text-primary)',
                              border: 'none',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Edit3 size={14} />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => setDeleteConfirmMember(member)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              color: '#EF4444',
                              border: 'none',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title="Delete Member"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
