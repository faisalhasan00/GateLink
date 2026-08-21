import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  X, 
  Search, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useSuperAdminAuth, MASTER_SUPER_ADMIN_EMAIL } from '../../context/SuperAdminAuthContext';
import { 
  subscribeToTeamMembers, 
  createTeamMember, 
  updateTeamMemberPermissions, 
  toggleTeamMemberStatus, 
  deleteTeamMember, 
  PERMISSION_MODULES, 
  ROLE_PRESETS 
} from '../../services/teamService';
import SeoHead from '../../components/seo/SeoHead';

export default function TeamManagement() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { isMasterAdmin } = useSuperAdminAuth();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteConfirmMember, setDeleteConfirmMember] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Sales & Onboarding',
    permissions: { ...ROLE_PRESETS['Sales & Onboarding'].permissions },
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToTeamMembers((data) => {
      setMembers(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleOpenCreateModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'Sales & Onboarding',
      permissions: { ...ROLE_PRESETS['Sales & Onboarding'].permissions },
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      password: '',
      role: member.role || 'Custom Staff',
      permissions: member.permissions || {},
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleRoleChange = (selectedRole) => {
    const preset = ROLE_PRESETS[selectedRole];
    setFormData((prev) => ({
      ...prev,
      role: selectedRole,
      permissions: preset ? { ...preset.permissions } : prev.permissions,
    }));
  };

  const handleSelectAllPermissions = () => {
    const allTrue = {};
    PERMISSION_MODULES.forEach((mod) => {
      allTrue[mod.key] = true;
    });
    setFormData((prev) => ({ ...prev, permissions: allTrue, role: 'Custom Staff' }));
  };

  const handleClearAllPermissions = () => {
    const allFalse = {};
    PERMISSION_MODULES.forEach((mod) => {
      allFalse[mod.key] = false;
    });
    setFormData((prev) => ({ ...prev, permissions: allFalse, role: 'Custom Staff' }));
  };

  const handleToggleSinglePermission = (key) => {
    setFormData((prev) => ({
      ...prev,
      role: 'Custom Staff',
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key],
      },
    }));
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      if (editingMember) {
        // Edit Existing Member
        await updateTeamMemberPermissions(editingMember.id, {
          name: formData.name,
          phone: formData.phone,
          role: formData.role,
          permissions: formData.permissions,
        });
        showToast(`Permissions updated for ${formData.name}`);
      } else {
        // Create New Member
        if (!formData.password || formData.password.length < 6) {
          throw new Error('Please provide a secure password with at least 6 characters.');
        }
        await createTeamMember({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
          permissions: formData.permissions,
        });
        showToast(`Staff member ${formData.name} created successfully!`);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving team member:', err);
      setFormError(err.message || 'Failed to save staff member details.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (member) => {
    try {
      const newStatus = await toggleTeamMemberStatus(member.id, member.status);
      showToast(`${member.name} is now ${newStatus}`);
    } catch (err) {
      console.error('Error toggling status:', err);
      showToast('Error updating staff status');
    }
  };

  const handleDeleteMember = async () => {
    if (!deleteConfirmMember) return;
    try {
      await deleteTeamMember(deleteConfirmMember.id);
      showToast(`Removed ${deleteConfirmMember.name} from team directory.`);
      setDeleteConfirmMember(null);
    } catch (err) {
      console.error('Error deleting member:', err);
      showToast('Error deleting team member');
    }
  };

  // Filtered members list
  const filteredMembers = members.filter((m) => {
    const matchesSearch = 
      (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.role || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    const matchesRole = roleFilter === 'ALL' || m.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const totalActive = members.filter((m) => m.status === 'Active').length;
  const totalSuspended = members.filter((m) => m.status === 'Suspended').length;

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <SeoHead title="Team & Staff Management - GateLink Super Admin" description="Manage team members, staff roles, and granular system permissions." />

      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: '#0F172A',
          color: '#FFFFFF',
          border: '1px solid #10B981',
          padding: '14px 20px',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9999,
          fontSize: '14px',
          fontWeight: 600,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <CheckCircle2 size={18} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Team & Staff Management
            </h1>
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '999px',
              backgroundColor: 'rgba(14, 165, 233, 0.12)',
              color: '#0284C7',
              border: '1px solid rgba(14, 165, 233, 0.3)'
            }}>
              Role-Based Access Control
            </span>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '6px', marginBottom: 0 }}>
            Create employee accounts and configure granular permission restrictions across the SaaS portal.
          </p>
        </div>

        {isMasterAdmin && (
          <button
            onClick={handleOpenCreateModal}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              backgroundColor: '#1E3A8A',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(30, 58, 138, 0.25)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1E3A8A'}
          >
            <UserPlus size={18} />
            <span>Add Team Member</span>
          </button>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          padding: '20px',
          borderRadius: '12px',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(30, 58, 138, 0.1)', color: '#1E3A8A' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Staff
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {members.length + 1} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>(incl. Owner)</span>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          padding: '20px',
          borderRadius: '12px',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Active Members
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>
              {totalActive + 1}
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          padding: '20px',
          borderRadius: '12px',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Suspended Staff
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: totalSuspended > 0 ? '#EF4444' : 'var(--text-primary)', marginTop: '2px' }}>
              {totalSuspended}
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div style={{
        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        padding: '16px 20px',
        borderRadius: '12px',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <input
              type="text"
              placeholder="Search staff by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '8px',
                border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
                background: isDark ? '#0F172A' : '#F8FAFC',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Status Filter */}
          <div style={{ display: 'flex', background: isDark ? '#0F172A' : '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
            {['ALL', 'Active', 'Suspended'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: statusFilter === st ? 700 : 500,
                  cursor: 'pointer',
                  backgroundColor: statusFilter === st ? '#1E3A8A' : 'transparent',
                  color: statusFilter === st ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all 0.15s'
                }}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
              background: isDark ? '#0F172A' : '#F8FAFC',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: 600,
              outline: 'none'
            }}
          >
            <option value="ALL">All Roles</option>
            {Object.keys(ROLE_PRESETS).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Directory Table */}
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
                          onClick={() => handleToggleStatus(member)}
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
                              onClick={() => handleOpenEditModal(member)}
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

      {/* ADD / EDIT EMPLOYEE MODAL */}
      {isModalOpen && (
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
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Scrollable Body */}
            <form onSubmit={handleSaveMember} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
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
                    onChange={(e) => handleRoleChange(e.target.value)}
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
                        onClick={handleSelectAllPermissions}
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
                        onClick={handleClearAllPermissions}
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
                          onClick={() => handleToggleSinglePermission(mod.key)}
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
                  onClick={() => setIsModalOpen(false)}
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
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmMember && (
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
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '12px',
            maxWidth: '440px',
            width: '100%',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <AlertTriangle size={24} />
            </div>

            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Remove {deleteConfirmMember.name}?
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              This staff member will immediately lose access to the Super Admin portal.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteConfirmMember(null)}
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
                onClick={handleDeleteMember}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Yes, Remove Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
