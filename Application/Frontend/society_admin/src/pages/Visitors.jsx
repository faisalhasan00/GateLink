import React, { useState, useEffect } from 'react';
import { QrCode } from 'lucide-react';
import { getSocietyAdminSession } from '../services/sessionManager';
import { societyAdminService } from '../services/societyAdminService';
import GateQrGeneratorModal from '../components/gate/GateQrGeneratorModal';

export default function Visitors() {
  const session = getSocietyAdminSession();
  const societyId = session?.societyId || 'SOC-001';

  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    if (!societyId) {
      setLoading(false);
      return;
    }

    const unsubscribe = societyAdminService.subscribeVisitors(
      societyId,
      (data) => {
        setVisitors(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching visitors:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [societyId]);

  const formatTime = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading visitor logs...</div>;

  return (
    <div>
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="card-title">Live Visitor Logs</h3>
            <span className="badge success" style={{ fontSize: '12px', marginTop: '4px' }}>
              {visitors.filter(v => v.status === 'inside').length} Currently Inside
            </span>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowQrModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '13px', fontWeight: 800 }}
          >
            <QrCode size={18} /> Print Gate Standee QR
          </button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Visitor Name</th>
                <th>Type</th>
                <th>Host Flat</th>
                <th>Entry Time</th>
                <th>Exit Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visitors.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No visitors today.</td></tr>
              ) : (
                visitors.map((v) => (
                  <tr key={v.id}>
                    <td><strong>{v.name}</strong></td>
                    <td>{v.type}</td>
                    <td>{v.hostFlat}</td>
                    <td>{formatTime(v.entryTime)}</td>
                    <td>{formatTime(v.exitTime)}</td>
                    <td>
                      <span className={`badge ${v.status === 'inside' ? 'success' : 'primary'}`}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <GateQrGeneratorModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        societyId={societyId}
        societyName={session?.societyName || 'Palm Meadows Residency'}
        gateName="Main Gate 1"
      />
    </div>
  );
}
