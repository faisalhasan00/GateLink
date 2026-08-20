import { useState, useEffect } from 'react';
import { superAdminService } from '../../../services/superAdminService';

export function useSuperAdminDashboard() {
  const [societies, setSocieties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    let unsubSoc;
    if (typeof superAdminService?.subscribeSocieties === 'function') {
      unsubSoc = superAdminService.subscribeSocieties(
        (data) => setSocieties(data),
        (err) => console.error(err)
      );
    }

    let unsubLeads;
    const subLeadsFn = superAdminService?.subscribeLeads || superAdminService?.subscribeCrmLeads;
    if (typeof subLeadsFn === 'function') {
      unsubLeads = subLeadsFn.call(
        superAdminService,
        (data) => setLeads(data),
        (err) => console.error(err)
      );
    }

    return () => {
      if (unsubSoc) unsubSoc();
      if (unsubLeads) unsubLeads();
    };
  }, []);

  const handleStatusUpdate = async (leadId, newStatus) => {
    try {
      await superAdminService.updateLeadStatus(leadId, newStatus);
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (err) {
      console.error('Lead status update error:', err);
    }
  };

  const totalMrr = societies
    .filter((s) => s.status === 'Active' || s.status === 'active')
    .reduce((sum, s) => sum + (s.mrr || 0), 0);
  const activeSocietiesCount = societies.filter((s) => s.status === 'Active' || s.status === 'active').length;
  const closedWonCount = leads.filter((l) => l.status === 'Closed Won').length;
  const conversionRate = leads.length > 0 ? Math.round((closedWonCount / leads.length) * 100) : 0;

  return {
    societies,
    leads,
    selectedLead,
    setSelectedLead,
    totalMrr,
    activeSocietiesCount,
    conversionRate,
    handleStatusUpdate
  };
}
