import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, User, MapPin, Tag } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function IncidentDetailModal({ incident, onClose, onUpdateStatus }) {
  if (!incident) return null;

  const [status, setStatus] = useState(incident.status || 'open');
  const [notes, setNotes] = useState(incident.resolutionNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdateStatus(incident.id, status, notes);
      onClose();
    } catch (err) {
      alert('Error updating incident: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const severityColor = incident.severity === 'critical' ? '#EF4444' : incident.severity === 'medium' ? '#F59E0B' : '#10B981';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={20} color={severityColor} />
            <h3 style={{ margin: 0 }}>Patrol Incident Details</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '16px 0' }}>
          {/* Header Summary */}
          <div style={{
            padding: '14px 16px',
            backgroundColor: '#F8FAFC',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                {incident.category || 'Security Observation'}
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <Clock size={13} /> {incident.createdAt ? new Date(incident.createdAt).toLocaleString() : 'N/A'}
              </div>
            </div>

            <div style={{
              padding: '4px 12px',
              borderRadius: '999px',
              backgroundColor: `${severityColor}15`,
              color: severityColor,
              fontWeight: 800,
              fontSize: '12px',
              textTransform: 'uppercase'
            }}>
              {incident.severity} Severity
            </div>
          </div>

          {/* Location & Guard Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '10px 12px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} /> Checkpoint
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginTop: '2px' }}>
                {incident.checkpointCode ? `${incident.checkpointCode} - ${incident.checkpointName}` : 'General Perimeter'}
              </div>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={12} /> Reported By
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginTop: '2px' }}>
                {incident.guardName || 'Security Guard'}
              </div>
            </div>
          </div>

          {/* Incident Description */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Guard Observation / Description
            </label>
            <div style={{
              padding: '12px',
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              fontSize: '13.5px',
              lineHeight: 1.5,
              color: '#1E293B'
            }}>
              {incident.description || 'No detailed notes provided.'}
            </div>
          </div>

          {/* Status Update Form */}
          <form onSubmit={handleSubmit} style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
            <div className="form-group">
              <label>Resolution Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              >
                <option value="open">🔴 Open (Pending Action)</option>
                <option value="investigating">🟡 Under Investigation / Assigned</option>
                <option value="resolved">🟢 Resolved & Closed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Admin Action / Resolution Notes</label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Electrician fixed wiring at 09:30 AM. Checkpoint verified."
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
            </div>

            <div className="modal-actions" style={{ marginTop: '16px' }}>
              <Button type="button" variant="secondary" onClick={onClose}>Close</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Save Resolution'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
