import React from 'react';
import Button from '../../../components/ui/Button';

export default function InvoiceDetailModal({ invoice, onClose }) {
  if (!invoice) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <h3>Invoice Breakdown & Audit</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '14px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>INVOICE NUMBER</span>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#1E3A8A' }}>
                {invoice.billNumber || invoice.id}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>STATUS</span>
              <div>
                <span className={`badge ${invoice.status === 'paid' ? 'success' : 'warning'}`}>
                  {invoice.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
            <div>Flat: <strong>{invoice.flatNumber || 'N/A'}</strong></div>
            <div>Resident: <strong>{invoice.residentName || 'N/A'}</strong></div>
            <div>Billing Month: <strong>{invoice.month}</strong></div>
            <div>Due Date: <strong>{invoice.dueDate}</strong></div>
          </div>

          <div style={{ background: 'var(--bg-color)', padding: '14px', borderRadius: '8px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Base Maintenance:</span>
              <span>₹{invoice.maintenanceCharge || invoice.amount}</span>
            </div>
            {invoice.parkingCharge > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Parking Fee:</span>
                <span>₹{invoice.parkingCharge}</span>
              </div>
            )}
            {invoice.waterCharge > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Water & Utility:</span>
                <span>₹{invoice.waterCharge}</span>
              </div>
            )}
            {invoice.sinkingFund > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Sinking Fund:</span>
                <span>₹{invoice.sinkingFund}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '6px', fontWeight: 800 }}>
              <span>Total Billable:</span>
              <span>₹{Number(invoice.amount).toLocaleString()}</span>
            </div>
          </div>

          {invoice.paymentMethod && (
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', background: '#ECFDF5', padding: '10px 14px', borderRadius: '6px' }}>
              Settled via <strong>{invoice.paymentMethod}</strong>
              {invoice.transactionId && <div>Txn Ref: <code>{invoice.transactionId}</code></div>}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button variant="primary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
