import React from 'react';
import { Vote, Plus, Trash2, X } from 'lucide-react';

const POLL_CATEGORIES = [
  'AGM Resolution',
  'Facility Upgrade',
  'Society Rule',
  'Maintenance Work',
  'General Poll',
];

export function CreatePollModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onAddOption,
  onRemoveOption,
  onOptionChange,
  onSubmit,
  isSubmitting,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px', borderRadius: '16px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Vote size={24} color="var(--gl-navy, #1E3A8A)" />
            <h3 className="card-title" style={{ fontFamily: 'var(--font-display, Manrope)' }}>Create Society Poll / Resolution</h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                onClick={onAddOption}
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
                    onChange={(e) => onOptionChange(idx, e.target.value)}
                    required
                  />
                  {formData.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => onRemoveOption(idx)}
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
              onClick={onClose}
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
  );
}
