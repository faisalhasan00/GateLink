import React, { useState, useEffect } from 'react';
import { MapPin, Printer, History } from 'lucide-react';
import { getSocietyAdminSession } from '../services/sessionManager';
import { societyAdminService } from '../services/societyAdminService';
import AddCheckpointModal from '../features/patrol/components/AddCheckpointModal';
import PrintableQrTags from '../features/patrol/components/PrintableQrTags';
import IncidentDetailModal from '../features/patrol/components/IncidentDetailModal';
import PatrolStatOverview from '../features/patrol/components/PatrolStatOverview';
import CheckpointsTable from '../features/patrol/components/CheckpointsTable';
import LivePatrolAuditLogs from '../features/patrol/components/LivePatrolAuditLogs';

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
      <PatrolStatOverview
        checkpoints={checkpoints}
        patrolLogs={patrolLogs}
        incidents={incidents}
      />

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
        <CheckpointsTable
          checkpoints={checkpoints}
          onAddCheckpoint={() => {
            setEditingCheckpoint(null);
            setIsAddModalOpen(true);
          }}
          onEditCheckpoint={(cp) => {
            setEditingCheckpoint(cp);
            setIsAddModalOpen(true);
          }}
          onDeleteCheckpoint={handleDeleteCheckpoint}
        />
      )}

      {/* TAB 2: Printable QR Tags */}
      {activeTab === 'printable_qr' && (
        <PrintableQrTags checkpoints={checkpoints} societyName={societyName} />
      )}

      {/* TAB 3: Live Patrol Audit & Incidents */}
      {activeTab === 'logs' && (
        <LivePatrolAuditLogs
          patrolLogs={patrolLogs}
          incidents={incidents}
          onSelectIncident={(inc) => setSelectedIncident(inc)}
        />
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
