import React from 'react';
import { UserCheck, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PendingVisitorApprovals({
  pendingVisitors,
  onApprove,
  onDeny
}) {
  const navigate = useNavigate();

  if (pendingVisitors.length === 0) return null;

  return (
    <div
      className="card"
      style={{
        border: '1px solid var(--warning)',
        background: 'linear-gradient(180deg, var(--surface-color) 0%, rgba(245, 158, 11, 0.05) 100%)'
      }}
    >
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCheck size={20} color="var(--warning)" />
          <h3 className="card-title" style={{ color: 'var(--warning)', margin: 0 }}>
            Gate Entry Approvals Awaiting Clearance ({pendingVisitors.length})
          </h3>
        </div>
        <button
          className="btn btn-outline"
          style={{ fontSize: '12px', padding: '4px 10px' }}
          onClick={() => navigate('/visitors')}
        >
          View All Visitors
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Visitor Name</th>
              <th>Category</th>
              <th>Target Flat</th>
              <th>Host Resident</th>
              <th>Vehicle Plate</th>
              <th>Gate Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingVisitors.slice(0, 5).map((v) => (
              <tr key={v.id}>
                <td><strong>{v.name}</strong></td>
                <td><span className="badge warning">{v.type || 'Guest'}</span></td>
                <td><strong>{v.hostFlat}</strong></td>
                <td>{v.hostResidentName || 'Resident'}</td>
                <td><code>{v.vehicleNumber || 'Pedestrian'}</code></td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '4px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => onApprove(v.id)}
                    >
                      <CheckCircle size={14} /> Allow Entry
                    </button>
                    <button
                      className="btn btn-outline"
                      style={{ padding: '4px 10px', fontSize: '12px', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                      onClick={() => onDeny(v.id)}
                    >
                      Deny
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
