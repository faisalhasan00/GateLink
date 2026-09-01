import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Printer, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  User, 
  History, 
  RefreshCw 
} from 'lucide-react';
import { getSocietyAdminSession } from '../services/sessionManager';
import { societyAdminService } from '../services/societyAdminService';
import Button from '../components/ui/Button';
import AddCheckpointModal from '../features/patrol/components/AddCheckpointModal';
import PrintableQrTags from '../features/patrol/components/PrintableQrTags';
import IncidentDetailModal from '../features/patrol/components/IncidentDetailModal';

export default function PatrolManagement() {
  const session = getSocietyAdminSession();
  const societyId = session?.societyId;
  const societyName = session?.societyName || 'GateLink Community';

  const [activeTab, setActiveTab] = useState('checkpoints'); // 'checkpoints' | 'printable_qr' | 'logs'
  const [checkpoints, setCheckpoints] = useState([]);
  const [patrolLogs, setPatrolLogs] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCheckpoint, setEditingCheckpoint] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!societyId) {
      setLoading(false);
      return;
    }

    const unsubCP = societyAdminService.subscribeCheckpoints(
      societyId,
      (data) => {
        setCheckpoints(data);
        setLoading(false);
      },
      (err) => console.error('Error fetching checkpoints:', err)
    );

    const unsubLogs = societyAdminService.subscribePatrolLogs(
      societyId,
      (data) => setPatrolLogs(data),
      (err) => console.error('Error fetching patrol logs:', err)
    );

    const unsubIncidents = societyAdminService.subscribePatrolIncidents(
      societyId,
      (data) => setIncidents(data),
      (err) => console.error('Error fetching patrol incidents:', err)
    );

    return () => {
      if (unsubCP) unsubCP();
      if (unsubLogs) unsubLogs();
      if (unsubIncidents) unsubIncidents();
    };
  }, [societyId]);

  const handleSaveCheckpoint = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingCheckpoint) {
        await societyAdminService.updateCheckpoint(societyId, editingCheckpoint.id, formData);
      } else {
        await societyAdminService.createCheckpoint(societyId, formData);
      }
      setIsAddModalOpen(false);
      setEditingCheckpoint(null);
    } catch (err) {
      alert('Error saving checkpoint: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCheckpoint = async (cp) => {
    if (!window.confirm(`Are you sure you want to delete checkpoint ${cp.code} (${cp.name})?`)) return;
    try {
      await societyAdminService.deleteCheckpoint(societyId, cp.id, cp.code);
    } catch (err) {
      alert('Error deleting checkpoint: ' + err.message);
    }
  };

  const handleUpdateIncidentStatus = async (incidentId, status, notes) => {
    await societyAdminService.updateIncidentStatus(societyId, incidentId, status, notes);
  };

  if (loading) {
    return <div style={{ padding: '32px', textAlign: 'center' }}>Loading security patrol register...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Stat Overview Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '18px 20px', borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>TOTAL CHECKPOINTS</span>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#1E3A8A' }}>
              <MapPin size={18} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            {checkpoints.length}
          </div>
          <div style={{ fontSize: '11.5px', color: '#16A34A', fontWeight: 600, marginTop: '2px' }}>
            Perimeter points active
          </div>
        </div>

        <div style={{ padding: '18px 20px', borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>PATROL SCANS LOGGED</span>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#DCFCE7', color: '#166534' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            {patrolLogs.length}
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
            Guard checkpoint scans
          </div>
        </div>

        <div style={{ padding: '18px 20px', borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>PATROL INCIDENTS</span>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: incidents.length > 0 ? '#FEF2F2' : '#F8FAFC', color: incidents.length > 0 ? '#DC2626' : '#64748B' }}>
              <AlertCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: incidents.length > 0 ? '#DC2626' : '#0F172A', marginTop: '6px' }}>
            {incidents.filter(i => i.status !== 'resolved').length}
          </div>
          <div style={{ fontSize: '11.5px', color: '#DC2626', fontWeight: 600, marginTop: '2px' }}>
            Open security flags
          </div>
        </div>
      </div>

      {/* Tab Switcher Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('checkpoints')}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'checkpoints' ? '#1E3A8A' : 'transparent',
            color: activeTab === 'checkpoints' ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <MapPin size={15} /> Checkpoints Manager
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('printable_qr')}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'printable_qr' ? '#1E3A8A' : 'transparent',
            color: activeTab === 'printable_qr' ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Printer size={15} /> Printable QR Tags
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'logs' ? '#1E3A8A' : 'transparent',
            color: activeTab === 'logs' ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <History size={15} /> Live Patrol Audit & Incidents
        </button>
      </div>

      {/* TAB 1: Checkpoints Manager */}
      {activeTab === 'checkpoints' && (
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
              onClick={() => {
                setEditingCheckpoint(null);
                setIsAddModalOpen(true);
              }}
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
                    const lastScanStr = cp.lastScannedAt ? new Date(cp.lastScannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never';

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
                              onClick={() => {
                                setEditingCheckpoint(cp);
                                setIsAddModalOpen(true);
                              }}
                              style={{ padding: '6px', border: '1px solid #CBD5E1', borderRadius: '8px', background: 'none', cursor: 'pointer' }}
                              title="Edit Checkpoint"
                            >
                              <Edit3 size={14} color="#475569" />
                            </button>
                            <button
                              onClick={() => handleDeleteCheckpoint(cp)}
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
      )}

      {/* TAB 2: Printable QR Tags */}
      {activeTab === 'printable_qr' && (
        <PrintableQrTags checkpoints={checkpoints} societyName={societyName} />
      )}

      {/* TAB 3: Live Patrol Audit & Incidents */}
      {activeTab === 'logs' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {/* Live Scan Log Stream */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <History size={18} color="#1E3A8A" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Live Guard Scan Logs ({patrolLogs.length})
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto' }}>
              {patrolLogs.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                  No scans recorded yet today.
                </div>
              ) : (
                patrolLogs.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ backgroundColor: '#1E3A8A', color: '#FFFFFF', padding: '2px 6px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 800 }}>
                          {log.checkpointCode}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                          {log.checkpointName}
                        </span>
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={11} /> {log.guardName || 'Security Guard'} • 📍 {log.checkpointArea || 'Perimeter'}
                      </div>
                    </div>

                    <div style={{ fontSize: '11.5px', color: '#16A34A', fontWeight: 700, textAlign: 'right' }}>
                      {log.scannedAt ? new Date(log.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'N/A'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* On-Ground Incident Alerts */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <AlertCircle size={18} color="#DC2626" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Patrol Incident Alerts ({incidents.length})
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto' }}>
              {incidents.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                  No security or facility incidents reported.
                </div>
              ) : (
                incidents.map((inc) => {
                  const severityBg = inc.severity === 'critical' ? '#FEF2F2' : '#FFFBEB';
                  const severityBorder = inc.severity === 'critical' ? '#FECACA' : '#FDE68A';
                  const severityText = inc.severity === 'critical' ? '#DC2626' : '#D97706';

                  return (
                    <div
                      key={inc.id}
                      onClick={() => setSelectedIncident(inc)}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        backgroundColor: severityBg,
                        border: `1px solid ${severityBorder}`,
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>
                          {inc.category}
                        </span>
                        <span style={{ fontSize: '10.5px', fontWeight: 800, color: severityText, textTransform: 'uppercase' }}>
                          {inc.severity} Severity
                        </span>
                      </div>

                      <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px', lineHeight: 1.3 }}>
                        {inc.description}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#64748B' }}>
                        <span>📍 {inc.checkpointCode || 'Perimeter'} by {inc.guardName}</span>
                        <span style={{ fontWeight: 700, color: inc.status === 'resolved' ? '#16A34A' : '#DC2626' }}>
                          Status: {inc.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Checkpoint Modal */}
      <AddCheckpointModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingCheckpoint(null);
        }}
        editingCheckpoint={editingCheckpoint}
        onSubmit={handleSaveCheckpoint}
        isSubmitting={isSubmitting}
      />

      {/* Incident Detail / Resolution Modal */}
      <IncidentDetailModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onUpdateStatus={handleUpdateIncidentStatus}
      />
    </div>
  );
}
