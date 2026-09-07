import React from 'react';
import { Plus, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function CheckpointsTable({
  checkpoints,
  onAddCheckpoint,
  onEditCheckpoint,
  onDeleteCheckpoint
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Patrol Perimeter Checkpoints
          </h3>
          <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0' }}>
            Defined physical points for guards to scan during scheduled patrol rounds
          </p>
        </div>

        <Button
          onClick={onAddCheckpoint}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} /> Add Checkpoint
        </Button>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B', fontWeight: 700 }}>
              <th style={{ padding: '12px 16px' }}>Order</th>
              <th style={{ padding: '12px 16px' }}>Code</th>
              <th style={{ padding: '12px 16px' }}>Checkpoint Name</th>
              <th style={{ padding: '12px 16px' }}>Area / Location</th>
              <th style={{ padding: '12px 16px' }}>Last Scanned</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {checkpoints.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>
                  No checkpoints configured yet. Click "Add Checkpoint" to create the first perimeter point.
                </td>
              </tr>
            ) : (
              checkpoints.map((cp, idx) => {
                const lastScanStr = cp.lastScannedAt 
                  ? new Date(cp.lastScannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                  : 'Never';

                return (
                  <tr key={cp.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 800, color: '#64748B' }}>
                      #{cp.order || idx + 1}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ backgroundColor: '#EFF6FF', color: '#1E3A8A', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', fontSize: '11.5px' }}>
                        {cp.code}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1E293B' }}>
                      {cp.name}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748B' }}>
                      📍 {cp.area}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {cp.lastScannedAt ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16A34A', fontWeight: 600, fontSize: '12px' }}>
                          <CheckCircle2 size={13} /> {lastScanStr} by {cp.lastScannedGuardName || 'Guard'}
                        </span>
                      ) : (
                        <span style={{ color: '#94A3B8', fontSize: '12px' }}>Not yet scanned</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={() => onEditCheckpoint(cp)}
                          style={{ padding: '6px', border: '1px solid #CBD5E1', borderRadius: '8px', background: 'none', cursor: 'pointer' }}
                          title="Edit Checkpoint"
                        >
                          <Edit3 size={14} color="#475569" />
                        </button>
                        <button
                          onClick={() => onDeleteCheckpoint(cp)}
                          style={{ padding: '6px', border: '1px solid #FECACA', borderRadius: '8px', backgroundColor: '#FEF2F2', cursor: 'pointer' }}
                          title="Delete Checkpoint"
                        >
                          <Trash2 size={14} color="#DC2626" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
