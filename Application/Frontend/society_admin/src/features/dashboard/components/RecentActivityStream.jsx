import React from 'react';
import { Activity, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RecentActivityStream({
  recentActivities,
  recentComplaints,
  stats
}) {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
      {/* Real-time Gate & Campus Telemetry */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="var(--primary)" />
            <h3 className="card-title">Live Gate Traffic Activity</h3>
          </div>
          <button
            className="btn btn-outline"
            style={{ fontSize: '11px', padding: '3px 8px' }}
            onClick={() => navigate('/visitors')}
          >
            Audit Log
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentActivities.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', margin: '20px 0', fontSize: '13px' }}>
              No gate entries recorded yet today.
            </p>
          ) : (
            recentActivities.slice(0, 7).map((act) => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'var(--bg-color)',
                  border: '1px solid var(--border-color)',
                  fontSize: '13px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{act.description}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Authorized by {act.user}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: `${act.badgeColor}15`,
                      color: act.badgeColor,
                      fontSize: '11px'
                    }}
                  >
                    {act.type}
                  </span>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end' }}>
                    <Clock size={10} /> {act.time}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Priority Complaint Helpdesk CRM */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Resident Complaints</h3>
          <button
            className="btn btn-outline"
            style={{ fontSize: '11px', padding: '3px 8px' }}
            onClick={() => navigate('/complaints')}
          >
            Ticket CRM
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentComplaints.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', margin: '20px 0', fontSize: '13px' }}>
              All resident tickets are resolved! No pending complaints.
            </p>
          ) : (
            recentComplaints.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                    {c.title || c.category || 'Maintenance Request'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Flat: <strong>{c.flatNumber || 'N/A'}</strong> • Category: {c.category || 'General'}
                  </div>
                </div>
                <div>
                  <span
                    className={`badge ${
                      c.status === 'resolved' || c.status === 'Closed'
                        ? 'success'
                        : c.status === 'in_progress'
                        ? 'primary'
                        : 'warning'
                    }`}
                  >
                    {c.status || 'Open'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
