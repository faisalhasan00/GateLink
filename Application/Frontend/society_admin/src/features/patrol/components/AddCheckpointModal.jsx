import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';

export default function AddCheckpointModal({
  isOpen,
  onClose,
  editingCheckpoint,
  onSubmit,
  isSubmitting
}) {
  const [formData, setFormData] = useState({
    code: 'CP-01',
    name: '',
    area: 'Main Entrance & Boom Barrier',
    order: 1,
    instructions: 'Check locks, verify CCTV operation, and ensure perimeter gate is secured.',
  });

  useEffect(() => {
    if (editingCheckpoint) {
      setFormData({
        code: editingCheckpoint.code || 'CP-01',
        name: editingCheckpoint.name || '',
        area: editingCheckpoint.area || '',
        order: editingCheckpoint.order || 1,
        instructions: editingCheckpoint.instructions || '',
      });
    } else {
      setFormData({
        code: `CP-0${Math.floor(1 + Math.random() * 9)}`,
        name: '',
        area: 'Main Entrance & Boom Barrier',
        order: 1,
        instructions: 'Check locks, verify CCTV operation, and ensure perimeter gate is secured.',
      });
    }
  }, [editingCheckpoint, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter checkpoint name');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <h3>{editingCheckpoint ? 'Edit Patrol Checkpoint' : 'Add New Patrol Checkpoint'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
            <div className="form-group">
              <label>Checkpoint Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. CP-01"
                required
              />
            </div>
            <div className="form-group">
              <label>Checkpoint Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. DG Generator & Pump Room"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Physical Area / Location *</label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="e.g. Basement 2 Rear Corner"
                required
              />
            </div>
            <div className="form-group">
              <label>Patrol Order #</label>
              <input
                type="number"
                min="1"
                max="99"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Guard Patrolling Instructions</label>
            <textarea
              rows="3"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="Specific items to inspect (e.g., Check fire extinguisher pressure gauge, verify rear exit lock)"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>

          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingCheckpoint ? 'Update Checkpoint' : 'Create & Generate QR'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
