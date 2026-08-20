import React from 'react';
import { Plus } from 'lucide-react';
import { useResidents } from '../features/residents/hooks/useResidents';
import ResidentTable from '../features/residents/components/ResidentTable';
import ResidentProfileModal from '../features/residents/components/ResidentProfileModal';
import AddResidentModal from '../features/residents/components/AddResidentModal';
import FullscreenDocViewer from '../features/residents/components/FullscreenDocViewer';

export default function Residents() {
  const {
    societyId,
    loading,
    activeTab,
    setActiveTab,
    isModalOpen,
    setIsModalOpen,
    selectedResidentForView,
    setSelectedResidentForView,
    fullscreenImage,
    setFullscreenImage,
    showPassword,
    setShowPassword,
    formData,
    setFormData,
    handleApprove,
    handleReject,
    toggleStatus,
    handleDeleteResident,
    handleOpenDocument,
    handleAddResident,
    activeList,
    pendingList
  } = useResidents();

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading resident directory...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>Resident Directory & Access Control</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>
            Approve new self-registered residents, manage flat rosters, and control access permissions. (Society ID: <code>{societyId}</code>)
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Resident Manually
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('active')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'active' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'active' ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Active Roster ({activeList.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'pending' ? '#D97706' : pendingList.length > 0 ? '#FFFBEB' : 'transparent',
            color: activeTab === 'pending' ? '#FFFFFF' : pendingList.length > 0 ? '#B45309' : 'var(--text-secondary)',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>Pending Approvals</span>
          {pendingList.length > 0 && (
            <span style={{ background: activeTab === 'pending' ? '#FFFFFF' : '#D97706', color: activeTab === 'pending' ? '#D97706' : '#FFFFFF', borderRadius: '10px', padding: '2px 8px', fontSize: '11px', fontWeight: 900 }}>
              {pendingList.length}
            </span>
          )}
        </button>
      </div>

      {/* Resident Table Component */}
      <ResidentTable
        activeTab={activeTab}
        activeList={activeList}
        pendingList={pendingList}
        onSelectForView={setSelectedResidentForView}
        onToggleStatus={toggleStatus}
        onDeleteResident={handleDeleteResident}
        onApprove={handleApprove}
        onReject={handleReject}
        onOpenDocument={handleOpenDocument}
      />

      {/* Profile Details Modal */}
      <ResidentProfileModal
        resident={selectedResidentForView}
        onClose={() => setSelectedResidentForView(null)}
        onDelete={handleDeleteResident}
      />

      {/* Add Resident Modal */}
      <AddResidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onSubmit={handleAddResident}
      />

      {/* Fullscreen Document Viewer */}
      <FullscreenDocViewer
        documentInfo={fullscreenImage}
        onClose={() => setFullscreenImage(null)}
      />
    </div>
  );
}
