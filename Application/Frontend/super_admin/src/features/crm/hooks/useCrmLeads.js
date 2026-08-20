import { useState, useEffect } from 'react';
import { superAdminService } from '../../../services/superAdminService';

export function useCrmLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    societyName: '',
    city: '',
    flatCount: '100-250',
    status: 'New'
  });

  const stages = ['New', 'Contacted', 'Demo Scheduled', 'Proposal Sent', 'Closed Won', 'Lost'];

  useEffect(() => {
    let unsub;
    const subLeadsFn = superAdminService?.subscribeLeads || superAdminService?.subscribeCrmLeads;
    if (typeof subLeadsFn === 'function') {
      unsub = subLeadsFn.call(
        superAdminService,
        (docs) => {
          setLeads(docs);
          setLoading(false);
        },
        (err) => {
          console.error('Real-time leads listener error:', err);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const handleStageChange = async (leadId, newStatus) => {
    try {
      await superAdminService.updateLeadStatus(leadId, newStatus);
    } catch (err) {
      console.error('Failed to update lead status:', err);
      alert('Could not update lead status.');
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await superAdminService.deleteLead(leadId);
    } catch (err) {
      console.error('Failed to delete lead:', err);
      alert('Could not delete lead.');
    }
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      await superAdminService.createLead({
        ...formData,
        source: 'Manual Super Admin Entry',
      });
      setIsModalOpen(false);
      setFormData({ name: '', phone: '', email: '', societyName: '', city: '', flatCount: '100-250', status: 'New' });
    } catch (err) {
      console.error('Failed to add manual lead:', err);
      alert('Failed to add lead.');
    }
  };

  return {
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
  };
}
