import React from 'react';
import { Plus } from 'lucide-react';
import SocietyOnboardingWizard from '../../components/superadmin/SocietyOnboardingWizard';
import GateQrGeneratorModal from '../../components/gate/GateQrGeneratorModal';
import { useSocieties } from '../../features/societies/hooks/useSocieties';
import SocietyListTable from '../../features/societies/components/SocietyListTable';
import CreatedCredentialsModal from '../../features/societies/components/CreatedCredentialsModal';
import SocietyDetailModal from '../../features/societies/components/SocietyDetailModal';

export default function SocietyManagement() {
  const {
    societies,
    loading,
    showWizard,
    setShowWizard,
    createdCredentials,
    setCreatedCredentials,
    copied,
    selectedSocietyDetails,
    setSelectedSocietyDetails,
    selectedQrSociety,
    setSelectedQrSociety,
    toggleStatus,
    handleUpdatePlan,
    handleDeleteSociety,
    handleWizardSuccess,
    handleCopyCredentials
  } = useSocieties();

  if (loading) return <div style={{ padding: '20px' }}>Loading societies...</div>;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2>Manage Onboarded Societies</h2>
          <p>Generate access codes, manage structure, and control software licenses.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowWizard(true)}>
          <Plus size={18} /> Onboard New Society
        </button>
      </div>

      {/* Society Table */}
      <SocietyListTable
        societies={societies}
        onOpenQrModal={setSelectedQrSociety}
        onSelectDetails={setSelectedSocietyDetails}
        onToggleStatus={toggleStatus}
        onUpdatePlan={handleUpdatePlan}
        onDeleteSociety={handleDeleteSociety}
      />

      {/* Onboarding Wizard Modal */}
      {showWizard && (
        <SocietyOnboardingWizard
          onClose={() => setShowWizard(false)}
          onSuccess={handleWizardSuccess}
        />
      )}

      {/* Created Credentials Modal */}
      <CreatedCredentialsModal
        credentials={createdCredentials}
        copied={copied}
        onCopy={handleCopyCredentials}
        onClose={() => setCreatedCredentials(null)}
      />

      {/* Society Details Modal */}
      <SocietyDetailModal
        society={selectedSocietyDetails}
        onClose={() => setSelectedSocietyDetails(null)}
        onUpdatePlan={handleUpdatePlan}
      />

      {/* Gate QR Code Generator Modal */}
      {selectedQrSociety && (
        <GateQrGeneratorModal
          society={selectedQrSociety}
          onClose={() => setSelectedQrSociety(null)}
        />
      )}
    </div>
  );
}
