import { useState, useEffect } from 'react';
import { superAdminService } from '../../../services/superAdminService';

export function useSocieties() {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);
  const [selectedSocietyDetails, setSelectedSocietyDetails] = useState(null);
  const [selectedQrSociety, setSelectedQrSociety] = useState(null);

  useEffect(() => {
    const unsubscribe = superAdminService.subscribeSocieties(
      (data) => {
        setSocieties(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching societies:', err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      await superAdminService.updateSocietyStatus(id, newStatus);
    } catch (e) {
      alert('Error updating status: ' + e.message);
    }
  };

  const handleUpdatePlan = async (id, newPlan) => {
    try {
      const mrrMap = { Trial: 0, Standard: 5000, Premium: 10000, Enterprise: 25000 };
      await superAdminService.updateSocietyFeatures(id, {
        plan: newPlan,
        mrr: mrrMap[newPlan] || 10000
      });
      alert(`Updated subscription plan to ${newPlan}!`);
    } catch (e) {
      alert('Error updating subscription plan: ' + e.message);
    }
  };

  const handleDeleteSociety = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete society "${name}" (ID: ${id})?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      await superAdminService.updateSocietyStatus(id, 'Deleted');
      alert(`Successfully marked society "${name}" (${id}) as deleted!`);
    } catch (e) {
      console.error('Error deleting society:', e);
      alert('Error deleting society: ' + e.message);
    }
  };

  const handleWizardSuccess = (credentials) => {
    setShowWizard(false);
    setCreatedCredentials(credentials);
  };

  const handleCopyCredentials = () => {
    if (!createdCredentials) return;
    const text = `🏢 Society Sphere Credentials
Society: ${createdCredentials.societyName}
Society ID: ${createdCredentials.societyId}
Access Code: ${createdCredentials.accessCode}
Admin Email: ${createdCredentials.adminEmail}
Temp Password: ${createdCredentials.tempPassword}
Portal Link: http://localhost:3000/login`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return {
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
  };
}
