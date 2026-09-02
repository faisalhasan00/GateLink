import { useState, useEffect } from 'react';
import { getSocietyAdminSession } from '../../../services/sessionManager';
import { societyAdminService } from '../../../services/societyAdminService';

export function usePolls() {
  const session = getSocietyAdminSession();
  const societyId = session?.societyId;
  const adminUid = session?.uid || 'admin';

  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'AGM Resolution',
    votingRule: 'one_per_flat',
    isOwnerOnly: true,
    expiresAt: '',
    options: ['', ''],
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  useEffect(() => {
    if (!societyId) {
      setLoading(false);
      return;
    }

    const unsubscribe = societyAdminService.subscribePolls(
      societyId,
      (data) => {
        setPolls(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching polls:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [societyId]);

  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, ''],
    }));
  };

  const handleRemoveOption = (index) => {
    if (formData.options.length <= 2) return;
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleOptionChange = (index, value) => {
    const nextOptions = [...formData.options];
    nextOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: nextOptions }));
  };

  const openCreateModal = () => {
    const defaultExpiry = new Date();
    defaultExpiry.setDate(defaultExpiry.getDate() + 7);
    const expiryStr = defaultExpiry.toISOString().slice(0, 16);

    setFormData({
      title: '',
      description: '',
      category: 'AGM Resolution',
      votingRule: 'one_per_flat',
      isOwnerOnly: true,
      expiresAt: expiryStr,
      options: ['', ''],
    });
    setIsModalOpen(true);
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    if (!societyId) return;

    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      alert('Please enter a poll question / resolution title');
      return;
    }

    const validOptions = formData.options.map((o) => o.trim()).filter(Boolean);
    if (validOptions.length < 2) {
      alert('Please provide at least 2 non-empty poll options');
      return;
    }

    try {
      setIsSubmitting(true);
      await societyAdminService.createPoll(
        societyId,
        {
          title: trimmedTitle,
          description: formData.description.trim(),
          category: formData.category,
          votingRule: formData.votingRule,
          allowedRoles: formData.isOwnerOnly ? ['owner'] : ['owner', 'tenant', 'resident'],
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
          options: validOptions,
        },
        adminUid
      );

      setIsModalOpen(false);
      showToast('🎉 Poll created & broadcasted to all residents!');
    } catch (err) {
      console.error('Error creating poll:', err);
      alert('Failed to create poll: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClosePoll = async (pollId, title) => {
    if (!window.confirm(`Are you sure you want to close voting for "${title}" early?`)) return;
    try {
      await societyAdminService.closePoll(societyId, pollId);
      showToast('Voting closed for poll');
    } catch (err) {
      alert('Failed to close poll: ' + err.message);
    }
  };

  const handleDeletePoll = async (pollId, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete poll "${title}"?`)) return;
    try {
      await societyAdminService.deletePoll(societyId, pollId);
      showToast('Poll deleted successfully');
    } catch (err) {
      alert('Failed to delete poll: ' + err.message);
    }
  };

  const handleExportVotes = async (poll) => {
    try {
      const votes = await societyAdminService.getPollVotes(societyId, poll.id);
      if (!votes || votes.length === 0) {
        alert('No votes have been recorded for this poll yet.');
        return;
      }

      const headers = ['Voter Name', 'Flat Number', 'Role', 'Selected Option', 'Voted At'];
      const rows = votes.map((v) => {
        const selectedOpt = poll.options.find((o) => o.id === v.optionId)?.text || v.optionId;
        return [
          `"${v.voterName || 'N/A'}"`,
          `"${v.flatNumber || 'N/A'}"`,
          `"${v.userRole || 'resident'}"`,
          `"${selectedOpt}"`,
          `"${v.votedAt || ''}"`,
        ];
      });

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Poll_Audit_${poll.title.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('Failed to export votes: ' + err.message);
    }
  };

  // Metrics
  const activePolls = polls.filter((p) => p.status === 'active').length;
  const totalVotesCast = polls.reduce((acc, p) => acc + (p.totalVotes || 0), 0);
  const agmCount = polls.filter((p) => p.category === 'AGM Resolution').length;

  return {
    polls,
    loading,
    isModalOpen,
    setIsModalOpen,
    isSubmitting,
    toastMessage,
    formData,
    setFormData,
    openCreateModal,
    handleAddOption,
    handleRemoveOption,
    handleOptionChange,
    handleCreatePoll,
    handleClosePoll,
    handleDeletePoll,
    handleExportVotes,
    metrics: {
      activePolls,
      totalVotesCast,
      agmCount,
      totalPolls: polls.length,
    },
  };
}
