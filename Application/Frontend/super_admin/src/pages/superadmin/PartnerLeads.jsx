import React from 'react';
import { usePartnerAdmin } from '../../features/partners/hooks/usePartnerAdmin';
import PartnerLeadsHeader from '../../features/partners/components/PartnerLeadsHeader';
import PartnerLeadsFilter from '../../features/partners/components/PartnerLeadsFilter';
import PartnerLeadsTable from '../../features/partners/components/PartnerLeadsTable';
import PayoutApprovalModal from '../../features/partners/components/PayoutApprovalModal';
import AddPartnerLeadModal from '../../features/partners/components/AddPartnerLeadModal';
import CommissionConfigModal from '../../features/partners/components/CommissionConfigModal';

export default function PartnerLeads() {
  const {
    filteredLeads,
    loading,
    searchTerm,
    setSearchTerm,
    filterTier,
    setFilterTier,
    filterStatus,
    setFilterStatus,
    totalCommissionsPaid,
    totalSocietiesWon,

    // Config Modal
    isConfigModalOpen,
    setIsConfigModalOpen,
    commissionRates,
    setCommissionRates,
    savingConfig,
    handleSaveCommissionRates,

    // Add Lead Modal
    isAddModalOpen,
    setIsAddModalOpen,
    newLeadData,
    setNewLeadData,
    submittingLead,
    handleCreateManualLead,

    // Payout Modal
    selectedLeadForPayout,
    setSelectedLeadForPayout,
    payoutAmount,
    setPayoutAmount,
    utrNumber,
    setUtrNumber,
    payoutNotes,
    setPayoutNotes,
    savingPayout,
    handleOpenPayoutModal,
    handleSavePayout,
    handleInstantCashfreePayout,

    // Actions
    handleStatusChange,
    handleDeleteLead,
  } = usePartnerAdmin();

  return (
    <div>
      {/* Header Banner & Global Aggregates */}
      <PartnerLeadsHeader
        totalSocietiesWon={totalSocietiesWon}
        totalCommissionsPaid={totalCommissionsPaid}
        onOpenConfig={() => setIsConfigModalOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Filter & Search Controls */}
      <PartnerLeadsFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterTier={filterTier}
        setFilterTier={setFilterTier}
      />

      {/* Main CRM Deals Table */}
      <PartnerLeadsTable
        loading={loading}
        filteredLeads={filteredLeads}
        onStatusChange={handleStatusChange}
        onOpenPayoutModal={handleOpenPayoutModal}
        onDeleteLead={handleDeleteLead}
      />

      {/* Payout Approval Modal */}
      <PayoutApprovalModal
        selectedLead={selectedLeadForPayout}
        payoutAmount={payoutAmount}
        setPayoutAmount={setPayoutAmount}
        utrNumber={utrNumber}
        setUtrNumber={setUtrNumber}
        payoutNotes={payoutNotes}
        setPayoutNotes={setPayoutNotes}
        savingPayout={savingPayout}
        onClose={() => setSelectedLeadForPayout(null)}
        onSubmit={handleSavePayout}
        onInstantCashfreePayout={handleInstantCashfreePayout}
      />

      {/* Manual Add Lead Modal */}
      <AddPartnerLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        newLeadData={newLeadData}
        setNewLeadData={setNewLeadData}
        submittingLead={submittingLead}
        onSubmit={handleCreateManualLead}
      />

      {/* Dynamic Commission Rates & Rules Modal */}
      <CommissionConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        commissionRates={commissionRates}
        setCommissionRates={setCommissionRates}
        savingConfig={savingConfig}
        onSubmit={handleSaveCommissionRates}
      />
    </div>
  );
}
