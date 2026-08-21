import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import SeoHead from '../../components/seo/SeoHead';
import { useTeamManagement } from '../../features/team/hooks/useTeamManagement';
import TeamHeader from '../../features/team/components/TeamHeader';
import TeamMetrics from '../../features/team/components/TeamMetrics';
import TeamToolbar from '../../features/team/components/TeamToolbar';
import TeamTable from '../../features/team/components/TeamTable';
import AddEditMemberModal from '../../features/team/components/AddEditMemberModal';
import DeleteConfirmModal from '../../features/team/components/DeleteConfirmModal';

export default function TeamManagement() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const {
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
    // Modal State
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
    // Handlers
    handleOpenCreateModal,
    handleOpenEditModal,
    handleRoleChange,
    handleSelectAllPermissions,
    handleClearAllPermissions,
    handleToggleSinglePermission,
    handleSaveMember,
    handleToggleStatus,
    handleDeleteMember,
  } = useTeamManagement();

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

      {/* 1. Header Component */}
      <TeamHeader
        isMasterAdmin={isMasterAdmin}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* 2. Metrics Cards Component */}
      <TeamMetrics
        isDark={isDark}
        totalMembers={members.length}
        totalActive={totalActive}
        totalSuspended={totalSuspended}
      />

      {/* 3. Search & Filter Toolbar Component */}
      <TeamToolbar
        isDark={isDark}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      {/* 4. Staff Directory Table Component */}
      <TeamTable
        isDark={isDark}
        loading={loading}
        filteredMembers={filteredMembers}
        isMasterAdmin={isMasterAdmin}
        onOpenEditModal={handleOpenEditModal}
        onToggleStatus={handleToggleStatus}
        setDeleteConfirmMember={setDeleteConfirmMember}
      />

      {/* 5. Add / Edit Member Modal Component */}
      <AddEditMemberModal
        isDark={isDark}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingMember={editingMember}
        formData={formData}
        setFormData={setFormData}
        formError={formError}
        formLoading={formLoading}
        onSaveMember={handleSaveMember}
        onRoleChange={handleRoleChange}
        onSelectAllPermissions={handleSelectAllPermissions}
        onClearAllPermissions={handleClearAllPermissions}
        onToggleSinglePermission={handleToggleSinglePermission}
      />

      {/* 6. Delete Confirmation Modal Component */}
      <DeleteConfirmModal
        isDark={isDark}
        deleteConfirmMember={deleteConfirmMember}
        onClose={() => setDeleteConfirmMember(null)}
        onConfirmDelete={handleDeleteMember}
      />
    </div>
  );
}
