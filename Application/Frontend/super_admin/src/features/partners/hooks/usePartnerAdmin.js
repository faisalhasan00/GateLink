import { useState, useEffect } from 'react';
import { partnerAdminService } from '../services/partnerAdminService';

export function usePartnerAdmin() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Dynamic Commission Rates State
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [commissionRates, setCommissionRates] = useState({
    tier1Month1Percent: 5,
    tier1MonthlyPercent: 2,
    tier2Month1Percent: 10,
    tier2MonthlyPercent: 2,
    tier3Month1Percent: 10,
    tier3MonthlyPercent: 2,
    promoterSubPartnerOverridePercent: 0.5,
    baseRatePerFlat: 25,
    minFlatsThreshold: 40,
  });
  const [savingConfig, setSavingConfig] = useState(false);

  // Manual Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLeadData, setNewLeadData] = useState({
    partnerName: '',
    partnerPhone: '',
    partnerEmail: '',
    partnerCity: '',
    partnerUpi: '',
    partnerType: 'broker',
    targetSocietyName: '',
    targetCity: '',
    contactPerson: '',
    contactRole: 'RWA Secretary',
    contactPhone: '',
    approxFlats: '100-250',
    assignedTier: 'growth',
    status: 'new',
    notes: '',
  });
  const [submittingLead, setSubmittingLead] = useState(false);

  // Payout Modal State
  const [selectedLeadForPayout, setSelectedLeadForPayout] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState('500');
  const [utrNumber, setUtrNumber] = useState('');
  const [payoutNotes, setPayoutNotes] = useState('');
  const [savingPayout, setSavingPayout] = useState(false);

  useEffect(() => {
    // 1. Listen to partner leads
    const unsubLeads = partnerAdminService.subscribePartnerLeads(
      (data) => {
        setLeads(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to partner leads:', err);
        setLoading(false);
      }
    );

    // 2. Listen to dynamic commission config
    const unsubConfig = partnerAdminService.subscribeCommissionConfig(
      (data) => {
        setCommissionRates((prev) => ({ ...prev, ...data }));
      },
      (err) => {
        console.warn('Notice: system_config/partner_program not initialized yet:', err);
      }
    );

    return () => {
      unsubLeads();
      unsubConfig();
    };
  }, []);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await partnerAdminService.updateLeadStatus(leadId, newStatus);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Could not update lead status.');
    }
  };

  const handleDeleteLead = async (leadId, societyName) => {
    if (!window.confirm(`Are you sure you want to delete the lead for "${societyName}"?`)) return;
    try {
      await partnerAdminService.deleteLead(leadId);
    } catch (err) {
      console.error('Failed to delete lead:', err);
      alert('Could not delete lead.');
    }
  };

  const handleOpenPayoutModal = (lead) => {
    setSelectedLeadForPayout(lead);

    let flats = 100;
    if (lead.approxFlats === '40-100') flats = 70;
    else if (lead.approxFlats === '100-250') flats = 175;
    else if (lead.approxFlats === '250-500') flats = 375;
    else if (lead.approxFlats === '500+') flats = 600;

    const tier = lead.assignedTier || 'growth';
    const month1Rate =
      tier === 'referral'
        ? commissionRates.tier1Month1Percent
        : tier === 'onboarding'
        ? commissionRates.tier2Month1Percent
        : commissionRates.tier3Month1Percent;

    const calculatedBonus = Math.round(flats * (commissionRates.baseRatePerFlat || 25) * (month1Rate / 100));

    setPayoutAmount(String(calculatedBonus || 500));
    setUtrNumber('');
    setPayoutNotes(`Month 1 (${month1Rate}%) Commission for ${lead.targetSocietyName}`);
  };

  const handleInstantCashfreePayout = async () => {
    if (!selectedLeadForPayout?.partnerUpi) {
      alert('Partner UPI ID is missing. Please enter partner UPI ID first.');
      return;
    }

    setSavingPayout(true);
    try {
      const res = await partnerAdminService.triggerCashfreeInstantPayout(
        selectedLeadForPayout.id,
        payoutAmount,
        selectedLeadForPayout.partnerUpi,
        payoutNotes
      );
      alert(res.message || '✓ Cashfree Instant UPI Transfer Success!');
      setSelectedLeadForPayout(null);
    } catch (err) {
      console.error('Instant payout failed:', err);
      alert(`Instant Cashfree Payout Failed: ${err.message || 'Unknown error'}`);
    } finally {
      setSavingPayout(false);
    }
  };

  const handleSavePayout = async (e) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      alert('Please enter the 12-digit Bank / UPI Reference (UTR) Number.');
      return;
    }

    setSavingPayout(true);
    try {
      await partnerAdminService.recordPayout(selectedLeadForPayout.id, {
        amount: payoutAmount,
        utrNumber,
        notes: payoutNotes,
      });
      setSelectedLeadForPayout(null);
    } catch (err) {
      console.error('Failed to record payout:', err);
      alert('Failed to record payout.');
    } finally {
      setSavingPayout(false);
    }
  };

  const handleCreateManualLead = async (e) => {
    e.preventDefault();
    if (!newLeadData.partnerName.trim() || !newLeadData.partnerPhone.trim() || !newLeadData.targetSocietyName.trim()) {
      alert('Please fill Partner Name, Phone, and Society Name.');
      return;
    }

    setSubmittingLead(true);
    try {
      await partnerAdminService.createManualLead(newLeadData);
      setIsAddModalOpen(false);
      setNewLeadData({
        partnerName: '',
        partnerPhone: '',
        partnerEmail: '',
        partnerCity: '',
        partnerUpi: '',
        partnerType: 'broker',
        targetSocietyName: '',
        targetCity: '',
        contactPerson: '',
        contactRole: 'RWA Secretary',
        contactPhone: '',
        approxFlats: '100-250',
        assignedTier: 'growth',
        status: 'new',
        notes: '',
      });
    } catch (err) {
      console.error('Failed to create partner lead:', err);
      alert('Failed to create partner lead.');
    } finally {
      setSubmittingLead(false);
    }
  };

  const handleSaveCommissionRates = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      await partnerAdminService.saveCommissionRates(commissionRates);
      alert('✓ Partner Commission Rates updated successfully in real-time!');
      setIsConfigModalOpen(false);
    } catch (err) {
      console.error('Failed to save commission config:', err);
      alert('Failed to save commission rates.');
    } finally {
      setSavingConfig(false);
    }
  };

  // Filtered Leads
  const filteredLeads = leads.filter((item) => {
    const matchesSearch =
      (item.targetSocietyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.partnerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.partnerPhone || '').includes(searchTerm) ||
      (item.referenceId || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTier = filterTier === 'all' || item.assignedTier === filterTier;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;

    return matchesSearch && matchesTier && matchesStatus;
  });

  const totalCommissionsPaid = leads.reduce((acc, l) => acc + (l.payoutTotal || 0), 0);
  const totalSocietiesWon = leads.filter((l) => l.status === 'won').length;

  return {
    leads,
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
  };
}
