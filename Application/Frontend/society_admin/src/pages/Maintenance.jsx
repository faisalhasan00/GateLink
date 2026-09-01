import { CreditCard, Landmark, Zap } from 'lucide-react';
import { useMaintenance } from '../features/maintenance/hooks/useMaintenance';
import MaintenanceStatCards from '../features/maintenance/components/MaintenanceStatCards';
import MaintenanceTable from '../features/maintenance/components/MaintenanceTable';
import GenerateBillsModal from '../features/maintenance/components/GenerateBillsModal';
import RecordPaymentModal from '../features/maintenance/components/RecordPaymentModal';
import InvoiceDetailModal from '../features/maintenance/components/InvoiceDetailModal';
import AutoBillingConfigCard from '../features/maintenance/components/AutoBillingConfigCard';
import BankAccountCard from '../components/finance/BankAccountCard';

export default function Maintenance() {
  const {
    societyId,
    activeTab,
    setActiveTab,
    bills,
    residents,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    methodFilter,
    setMethodFilter,
    isGenerateModalOpen,
    setIsGenerateModalOpen,
    selectedInvoice,
    setSelectedInvoice,
    paymentModalBill,
    setPaymentModalBill,
    billingScope,
    setBillingScope,
    selectedResidentUid,
    setSelectedResidentUid,
    formData,
    setFormData,
    paymentData,
    setPaymentData,
    isSubmitting,
    calculateTotal,
    handleGenerateBills,
    handleSettlePayment,
    handleApproveVerification,
    handleRejectVerification,
    filteredBills,
    totalGeneratedAmount,
    totalCollectedAmount,
    pendingAmount,
    overdueAmount,
    paidBills,
    pendingBills,
    overdueBills,
    pendingVerifications,
    session
  } = useMaintenance();

  if (loading) {
    return <div style={{ padding: '32px', textAlign: 'center' }}>Loading maintenance register...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Metrics Cards */}
      <MaintenanceStatCards
        totalGeneratedAmount={totalGeneratedAmount}
        billsCount={bills.length}
        totalCollectedAmount={totalCollectedAmount}
        paidCount={paidBills.length}
        pendingAmount={pendingAmount}
        pendingCount={pendingBills.length}
        overdueAmount={overdueAmount}
        overdueCount={overdueBills.length}
      />

      {/* Tab Switcher Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('invoices')}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'invoices' ? '#1E3A8A' : 'transparent',
            color: activeTab === 'invoices' ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <CreditCard size={15} /> Invoices & Ledger
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('automation')}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'automation' ? '#1E3A8A' : 'transparent',
            color: activeTab === 'automation' ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Zap size={15} /> Billing Automation & Cron
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bank_account')}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'bank_account' ? '#1E3A8A' : 'transparent',
            color: activeTab === 'bank_account' ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Landmark size={15} /> Society Bank Account
        </button>
      </div>

      {activeTab === 'invoices' ? (
        <MaintenanceTable
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          methodFilter={methodFilter}
          setMethodFilter={setMethodFilter}
          pendingVerifications={pendingVerifications}
          filteredBills={filteredBills}
          onGenerateClick={() => setIsGenerateModalOpen(true)}
          onApproveVerification={handleApproveVerification}
          onRejectVerification={handleRejectVerification}
          onSelectInvoice={setSelectedInvoice}
          onOpenPaymentModal={setPaymentModalBill}
        />
      ) : activeTab === 'automation' ? (
        <AutoBillingConfigCard
          societyId={societyId}
          onBillingGenerated={() => setActiveTab('invoices')}
        />
      ) : (
        <BankAccountCard societyId={societyId} />
      )}

      {/* Generate Bills Modal */}
      <GenerateBillsModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        billingScope={billingScope}
        setBillingScope={setBillingScope}
        selectedResidentUid={selectedResidentUid}
        setSelectedResidentUid={setSelectedResidentUid}
        residents={residents}
        formData={formData}
        setFormData={setFormData}
        calculateTotal={calculateTotal}
        isSubmitting={isSubmitting}
        onSubmit={handleGenerateBills}
      />

      {/* Record Offline Settlement Modal */}
      <RecordPaymentModal
        bill={paymentModalBill}
        onClose={() => setPaymentModalBill(null)}
        paymentData={paymentData}
        setPaymentData={setPaymentData}
        onSubmit={handleSettlePayment}
      />

      {/* Invoice Breakdown Audit Modal */}
      <InvoiceDetailModal
        invoice={selectedInvoice}
        societyInfo={{ name: session?.societyName }}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
}
