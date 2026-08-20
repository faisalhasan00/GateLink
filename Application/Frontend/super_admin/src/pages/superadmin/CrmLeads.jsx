import React from 'react';
import { Plus } from 'lucide-react';
import { useCrmLeads } from '../../features/crm/hooks/useCrmLeads';
import CrmKanbanBoard from '../../features/crm/components/CrmKanbanBoard';
import AddCrmLeadModal from '../../features/crm/components/AddCrmLeadModal';

export default function CrmLeads() {
  const {
    leads,
    loading,
    isModalOpen,
    setIsModalOpen,
    formData,
    setFormData,
    stages,
    handleStageChange,
    handleDeleteLead,
    handleAddLead
  } = useCrmLeads();

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>Sales CRM & Real-Time Inbound Leads</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>
            Live leads submitted via website enrollment forms, proposal builder, and demo requests.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Sales Lead
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading real-time leads...
        </div>
      ) : (
        <CrmKanbanBoard
          stages={stages}
          leads={leads}
          onStageChange={handleStageChange}
          onDeleteLead={handleDeleteLead}
        />
      )}

      {/* Add Lead Modal */}
      <AddCrmLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddLead}
      />
    </div>
  );
}
