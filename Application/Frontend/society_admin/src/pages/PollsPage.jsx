import React, { useState, useEffect } from 'react';
import {
  Vote,
  Plus,
  XCircle,
  Trash2,
  Lock,
  Calendar,
  CheckCircle2,
  Users,
  Download,
  AlertCircle,
  Check,
  BarChart3,
  Building2,
  Layers,
  Clock,
  X
} from 'lucide-react';
import { getSocietyAdminSession } from '../services/sessionManager';
import { societyAdminService } from '../services/societyAdminService';

const POLL_CATEGORIES = [
  'AGM Resolution',
  'Facility Upgrade',
  'Society Rule',
  'Maintenance Work',
  'General Poll',
];

export default function PollsPage() {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: '#16A34A',
            color: '#FFFFFF',
            padding: '12px 22px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 700,
            fontSize: '14px'
          }}
        >
          <CheckCircle2 size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div 
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '26px 30px',
          background: 'linear-gradient(135deg, var(--gl-navy, #1E3A8A) 0%, #0F172A 100%)',
          color: '#FFFFFF',
          borderRadius: '16px',
          border: 'none',
          boxShadow: '0 10px 25px rgba(30, 58, 138, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div 
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gl-sky, #0EA5E9)'
            }}
          >
            <Vote size={30} />
          </div>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: '#FFFFFF', fontFamily: 'var(--font-display, Manrope)' }}>
              AGM Voting & Community Polls
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', margin: '4px 0 0 0' }}>
              Conduct official AGM resolutions, facility upgrades, and member surveys with 1-vote-per-flat rules.
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="btn btn-primary"
          style={{
            backgroundColor: 'var(--gl-navy, #1E3A8A)',
            color: '#FFFFFF',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 700,
            borderRadius: '12px',
            boxShadow: '0 6px 18px rgba(30, 58, 138, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <Plus size={18} />
          Create New Poll
        </button>
      </div>

      {/* Metrics Row */}
      <div className="dashboard-grid">
        <div className="stat-card" style={{ borderRadius: '16px' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--gl-navy-light, #EFF6FF)' }}>
            <Vote size={24} color="var(--gl-navy, #1E3A8A)" />
          </div>
          <div className="stat-info">
            <p>Total Polls</p>
            <h3>{polls.length}</h3>
          </div>
        </div>

        <div className="stat-card" style={{ borderRadius: '16px' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--gl-success-bg, #DCFCE7)' }}>
            <CheckCircle2 size={24} color="var(--gl-success, #16A34A)" />
          </div>
          <div className="stat-info">
            <p>Active Voting</p>
            <h3 style={{ color: 'var(--gl-success, #16A34A)' }}>{activePolls}</h3>
          </div>
        </div>

        <div className="stat-card" style={{ borderRadius: '16px' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--gl-sky-100, #E0F2FE)' }}>
            <Users size={24} color="var(--gl-sky, #0EA5E9)" />
          </div>
          <div className="stat-info">
            <p>Total Votes Cast</p>
            <h3 style={{ color: 'var(--gl-sky, #0EA5E9)' }}>{totalVotesCast}</h3>
          </div>
        </div>

        <div className="stat-card" style={{ borderRadius: '16px' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--gl-amber-100, #FEF3C7)' }}>
            <Lock size={24} color="var(--gl-amber, #F59E0B)" />
          </div>
          <div className="stat-info">
            <p>AGM Resolutions</p>
            <h3 style={{ color: 'var(--gl-amber-hover, #D97706)' }}>{agmCount}</h3>
          </div>
        </div>
      </div>

      {/* Polls Grid */}
      {loading ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)', borderRadius: '16px' }}>
          <p>Loading society polls & voting telemetry...</p>
        </div>
      ) : polls.length === 0 ? (
        <div className="card" style={{ padding: '54px 24px', textAlign: 'center', borderRadius: '16px' }}>
          <div 
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: 'var(--gl-navy-light, #EFF6FF)',
              color: 'var(--gl-navy, #1E3A8A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px auto'
            }}
          >
            <Vote size={34} />
          </div>
          <h3 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            No Polls Created Yet
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 24px auto' }}>
            Publish an AGM resolution, maintenance budget approval, or community poll for residents on the mobile app.
          </p>
          <button
            onClick={openCreateModal}
            className="btn btn-primary"
            style={{ padding: '12px 24px', fontWeight: 700, borderRadius: '12px' }}
          >
            <Plus size={18} /> Create First Poll
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
          {polls.map((poll) => {
            const isActive = poll.status === 'active';
            const isOwnerOnly =
              poll.allowedRoles &&
              poll.allowedRoles.length === 1 &&
              poll.allowedRoles[0].toLowerCase() === 'owner';

            return (
              <div
                key={poll.id}
                className="card hover-card-elevate"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  borderRadius: '16px',
                  border: isActive ? '1px solid var(--border-color)' : '1px dashed #CBD5E1',
                  opacity: isActive ? 1 : 0.85
                }}
              >
                <div>
                  {/* Category & Status Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="badge primary">
                        {poll.category || 'General Poll'}
                      </span>
                      {isOwnerOnly && (
                        <span className="badge warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Lock size={12} /> Owner Only
                        </span>
                      )}
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {poll.votingRule === 'one_per_flat' ? '1 vote / flat' : '1 vote / resident'}
                      </span>
                    </div>

                    <span className={`badge ${isActive ? 'success' : 'outline'}`} style={{ backgroundColor: isActive ? 'var(--gl-success-bg, #DCFCE7)' : '#F1F5F9', color: isActive ? 'var(--gl-success, #16A34A)' : '#64748B' }}>
                      {isActive ? '🟢 ACTIVE' : '⚪ CLOSED'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0', lineHeight: 1.35 }}>
                    {poll.title}
                  </h3>
                  {poll.description && (
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.45 }}>
                      {poll.description}
                    </p>
                  )}

                  {/* Options & Live Progress Bars */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
                    {(poll.options || []).map((opt) => {
                      const percentage = poll.totalVotes > 0
                        ? Math.round(((opt.voteCount || 0) / poll.totalVotes) * 100)
                        : 0;

                      return (
                        <div 
                          key={opt.id}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '12px',
                            backgroundColor: 'var(--bg-color)',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                            <span style={{ color: 'var(--text-primary)' }}>{opt.text}</span>
                            <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>
                              {opt.voteCount || 0} votes ({percentage}%)
                            </span>
                          </div>
                          {/* Progress bar */}
                          <div style={{ height: '7px', borderRadius: '999px', backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
                            <div 
                              style={{
                                width: `${percentage}%`,
                                height: '100%',
                                backgroundColor: 'var(--gl-navy, #1E3A8A)',
                                borderRadius: '999px',
                                transition: 'width 0.4s ease'
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Controls */}
                <div 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-color)',
                    fontSize: '12px',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    <span>
                      {poll.expiresAt ? `Ends ${new Date(poll.expiresAt).toLocaleDateString()}` : 'No expiration date'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => handleExportVotes(poll)}
                      title="Download Voters Audit CSV"
                      className="btn btn-outline"
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        borderRadius: '8px',
                        fontWeight: 700
                      }}
                    >
                      <Download size={14} /> CSV Audit
                    </button>

                    {isActive && (
                      <button
                        onClick={() => handleClosePoll(poll.id, poll.title)}
                        title="Close voting early"
                        style={{
                          background: 'var(--gl-amber-100, #FEF3C7)',
                          border: '1px solid #FCD34D',
                          color: '#B45309',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 700,
                          transition: 'all 0.2s'
                        }}
                      >
                        Close
                      </button>
                    )}

                    <button
                      onClick={() => handleDeletePoll(poll.id, poll.title)}
                      title="Delete poll"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--gl-danger, #DC2626)',
                        padding: '6px',
                        cursor: 'pointer',
                        borderRadius: '6px'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE POLL MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px', borderRadius: '16px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Vote size={24} color="var(--gl-navy, #1E3A8A)" />
                <h3 className="card-title" style={{ fontFamily: 'var(--font-display, Manrope)' }}>Create Society Poll / Resolution</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePoll} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Category */}
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {POLL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="form-group">
                <label>Poll Title / Resolution Question *</label>
                <input
                  type="text"
                  placeholder="e.g. Approve Club House Renovation Budget (₹5,00,000)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Description / Agenda Details</label>
                <textarea
                  rows="3"
                  placeholder="Provide background context, quotes, or meeting minutes..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Options */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ margin: 0 }}>Voting Options *</label>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--gl-navy, #1E3A8A)',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Plus size={15} /> Add Option
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {formData.options.map((opt, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder={`Option ${idx + 1} (e.g. Yes / No / Abstain)`}
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        required
                      />
                      {formData.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(idx)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--gl-danger, #DC2626)',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Expiry Date & Time */}
              <div className="form-group">
                <label>Voting End Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>

              {/* Voting Permissions & Rules */}
              <div 
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-color)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={formData.isOwnerOnly}
                    onChange={(e) => setFormData({ ...formData, isOwnerOnly: e.target.checked })}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Restrict voting to <strong>Flat Owners Only</strong> (recommended for AGM)</span>
                </label>

                <div style={{ display: 'flex', gap: '20px', fontSize: '13px', fontWeight: 600 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="votingRule"
                      value="one_per_flat"
                      checked={formData.votingRule === 'one_per_flat'}
                      onChange={(e) => setFormData({ ...formData, votingRule: e.target.value })}
                    />
                    <span>1 Vote per Flat</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="votingRule"
                      value="one_per_user"
                      checked={formData.votingRule === 'one_per_user'}
                      onChange={(e) => setFormData({ ...formData, votingRule: e.target.value })}
                    />
                    <span>1 Vote per Member</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ minWidth: '150px' }}
                >
                  {isSubmitting ? 'Publishing...' : 'Publish & Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
