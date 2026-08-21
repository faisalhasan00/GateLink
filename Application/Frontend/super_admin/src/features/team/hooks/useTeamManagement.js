import { useState, useEffect } from 'react';
import { useSuperAdminAuth } from '../../../context/SuperAdminAuthContext';
import { 
  subscribeToTeamMembers, 
  createTeamMember, 
  updateTeamMemberPermissions, 
  toggleTeamMemberStatus, 
  deleteTeamMember, 
  PERMISSION_MODULES, 
  ROLE_PRESETS 
} from '../../../services/teamService';

export function useTeamManagement() {
  const { isMasterAdmin, user } = useSuperAdminAuth();

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

  return {
    isMasterAdmin,
    members,
    filteredMembers,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    totalActive,
    totalSuspended,
    // Modal & Form State
    isModalOpen,
    setIsModalOpen,
    editingMember,
    deleteConfirmMember,
    setDeleteConfirmMember,
    formData,
    setFormData,
    formLoading,
    formError,
    toastMessage,
    // Actions
    handleOpenCreateModal,
    handleOpenEditModal,
    handleRoleChange,
    handleSelectAllPermissions,
    handleClearAllPermissions,
    handleToggleSinglePermission,
    handleSaveMember,
    handleToggleStatus,
    handleDeleteMember,
  };
}
