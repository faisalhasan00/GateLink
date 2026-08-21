import React from 'react';
import { QrCode, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { calculateSocietyMonthlyFee } from '../../../utils/pricingEngine';
import { useSuperAdminAuth } from '../../../context/SuperAdminAuthContext';

export default function SocietyListTable({
  societies,
  onOpenQrModal,
  onSelectDetails,
  onToggleStatus,
  onUpdatePlan,
  onDeleteSociety
}) {
  const { hasPermission } = useSuperAdminAuth();
  const canDelete = hasPermission('delete_society');
  return (
    <div className="card">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Society ID</th>
              <th>Society Name</th>
              <th>President / Manager</th>
              <th>Admin Email</th>
              <th>Access Code</th>
              <th>Monthly Fee</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {societies.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>
                  No societies onboarded yet. Click "Onboard New Society".
                </td>
              </tr>
            ) : (
              societies.map((soc) => (
                <tr key={soc.id}>
                  <td><code>{soc.id}</code></td>
                  <td>
                    <strong>{soc.name}</strong>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{soc.city} {soc.type ? `• ${soc.type}` : ''}</div>
                  </td>
                  <td>
                    <div>{soc.president}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{soc.phone}</div>
                  </td>
                  <td><span style={{ fontSize: '13px' }}>{soc.adminEmail || 'admin@society.com'}</span></td>
                  <td>
                    <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '6px 10px', borderRadius: '6px', fontWeight: 700, fontFamily: 'monospace' }}>
                      {soc.code}
                    </span>
                  </td>
                  <td>
                    <strong>₹{Number(soc.mrr || soc.monthlyFee || calculateSocietyMonthlyFee(soc.flatCount || 100)).toLocaleString()}</strong>
                  </td>
                  <td>
                    <span className={`badge ${soc.status === 'Active' ? 'success' : 'danger'}`}>
                      {soc.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '4px 8px', fontSize: '12px', color: '#1E3A8A', borderColor: '#1E3A8A' }}
                        onClick={() => onOpenQrModal(soc)}
                        title="Generate Gate QR Code"
                      >
                        <QrCode size={14} /> Gate QR
                      </button>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                        onClick={() => onSelectDetails(soc)}
                      >
                        View
                      </button>
                      {canDelete && (
                        <>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '4px 8px', fontSize: '12px', color: soc.status === 'Active' ? 'var(--warning)' : 'var(--secondary)' }}
                            onClick={() => onToggleStatus(soc.id, soc.status)}
                            title={canDelete ? "Toggle Active Status" : "Restricted: Requires Delete/Suspend Permission"}
                          >
                            {soc.status === 'Active' ? <XCircle size={14} /> : <CheckCircle size={14} />}
                          </button>
                          <button
                            className="btn-icon"
                            style={{ color: 'var(--danger)' }}
                            onClick={() => onDeleteSociety(soc.id, soc.name)}
                            title="Permanently Delete Society"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
