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
      options: ['Approve Proposal (Yes)', 'Reject Proposal (No)'],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanOptions = formData.options.map((o) => o.trim()).filter(Boolean);

    if (cleanOptions.length < 2) {
      alert('Please provide at least 2 voting options.');
      return;
    }

    setIsSubmitting(true);
    try {
      await societyAdminService.createPoll(
        societyId,
        {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          votingRule: formData.votingRule,
          allowedRoles: formData.isOwnerOnly ? ['owner'] : ['owner', 'tenant', 'resident'],
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
          options: cleanOptions,
        },
        adminUid
      );

      setIsModalOpen(false);
      showToast('🎉 New voting poll published & residents notified via broadcast!');
    } catch (err) {
      console.error('Error creating poll:', err);
      alert(err.message || 'Failed to create poll');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClosePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to close this poll early? No more votes will be accepted.')) {
      return;
    }
    try {
      await societyAdminService.closePoll(societyId, pollId);
      showToast('Poll marked as closed.');
    } catch (err) {
      alert('Failed to close poll: ' + err.message);
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to delete this poll and all its recorded votes?')) {
      return;
    }
    try {
      await societyAdminService.deletePoll(societyId, pollId);
      showToast('Poll removed successfully.');
    } catch (err) {
      alert('Failed to delete poll: ' + err.message);
    }
  };

  const handleExportVotes = async (poll) => {
    try {
      const votes = await societyAdminService.getPollVotes(societyId, poll.id);
      if (votes.length === 0) {
        alert('No votes recorded yet for this poll.');
        return;
      }

      // Generate CSV
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
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-700 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-slide-in">
          <CheckCircle2 size={18} />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
            <span className="p-2.5 bg-blue-50 text-blue-800 rounded-xl">
              <Vote size={26} />
            </span>
            AGM Voting & Community Polls
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Conduct constitutional AGM resolutions, facility upgrade voting, and member opinion polls with 1-vote-per-flat audit trails.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-800 hover:bg-blue-900 text-white text-sm font-bold rounded-xl transition shadow-md hover:shadow-lg"
        >
          <Plus size={18} />
          Create New Poll
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
            <Vote size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Polls</p>
            <p className="text-2xl font-extrabold text-slate-900">{polls.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Polls</p>
            <p className="text-2xl font-extrabold text-slate-900">{activePolls}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Votes Cast</p>
            <p className="text-2xl font-extrabold text-slate-900">{totalVotesCast}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Lock size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">AGM Resolutions</p>
            <p className="text-2xl font-extrabold text-slate-900">{agmCount}</p>
          </div>
        </div>
      </div>

      {/* Polls List / Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
          Loading society polls...
        </div>
      ) : polls.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Vote size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Polls Created Yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            Create an AGM resolution or community opinion poll to collect member votes from the GateLink Mobile App.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-800 text-white text-sm font-bold rounded-xl hover:bg-blue-900 transition"
          >
            <Plus size={18} />
            Create First Poll
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {polls.map((poll) => {
            const isActive = poll.status === 'active';
            const isOwnerOnly =
              poll.allowedRoles &&
              poll.allowedRoles.length === 1 &&
              poll.allowedRoles[0].toLowerCase() === 'owner';

            return (
              <div
                key={poll.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-800">
                        {poll.category || 'General Poll'}
                      </span>
                      {isOwnerOnly && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 text-amber-700">
                          <Lock size={12} />
                          Owner Only
                        </span>
                      )}
                      <span className="px-2 py-0.5 text-xs text-slate-500 font-medium">
                        {poll.votingRule === 'one_per_flat' ? '1 vote / flat' : '1 vote / resident'}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-1 text-xs font-extrabold rounded-lg ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isActive ? '🟢 ACTIVE' : '⚪ CLOSED'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-extrabold text-slate-900 mb-1">{poll.title}</h3>
                  {poll.description && (
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{poll.description}</p>
                  )}

                  {/* Options Progress Visualizer */}
                  <div className="space-y-3 my-4">
                    {poll.options?.map((opt) => {
                      const percentage =
                        poll.totalVotes > 0 ? Math.round((opt.voteCount / poll.totalVotes) * 100) : 0;

                      return (
                        <div key={opt.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                            <span>{opt.text}</span>
                            <span className="text-blue-800">
                              {percentage}% ({opt.voteCount} votes)
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-blue-800 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Calendar size={13} />
                    {poll.expiresAt ? `Closes ${new Date(poll.expiresAt).toLocaleDateString()}` : 'No Expiry'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExportVotes(poll)}
                      title="Download CSV Audit Report"
                      className="p-2 text-slate-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Download size={16} />
                    </button>
                    {isActive && (
                      <button
                        onClick={() => handleClosePoll(poll.id)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                      >
                        End Poll
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletePoll(poll.id)}
                      title="Delete Poll"
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
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

      {/* ── CREATE POLL MODAL ──────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Vote size={22} className="text-blue-800" />
                Publish New Society Poll
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <XCircle size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Poll / Resolution Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Approval for Solar Rooftop Installation (Phase 1)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain the background, budget, timeline or benefits for residents..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm bg-white"
                  >
                    {POLL_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Closing Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm"
                  />
                </div>
              </div>

              {/* Voting Permissions */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <p className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Voting Rules & Eligibility
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Restrict to Verified Flat Owners</p>
                    <p className="text-xs text-slate-500">Only Flat Owners can vote (Mandatory for AGM resolutions)</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isOwnerOnly}
                    onChange={(e) => setFormData({ ...formData, isOwnerOnly: e.target.checked })}
                    className="w-5 h-5 rounded text-blue-800 focus:ring-blue-800"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <div>
                    <p className="text-sm font-bold text-slate-800">1 Vote Per Flat</p>
                    <p className="text-xs text-slate-500">Only 1 submission allowed per unit (e.g. Flat A-402)</p>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-md">
                    Enabled
                  </span>
                </div>
              </div>

              {/* Dynamic Options List */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Voting Choices (At least 2)
                </label>
                <div className="space-y-2">
                  {formData.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 text-xs font-bold text-slate-400 text-center">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        required
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                      />
                      {formData.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(idx)}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddOption}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 hover:text-blue-900"
                >
                  <Plus size={14} /> Add Another Option
                </button>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-sm font-bold transition shadow-md disabled:opacity-50 flex items-center gap-2"
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
