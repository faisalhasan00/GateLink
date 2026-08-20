import React from 'react';
import Button from '../../../components/ui/Button';

export default function RecordPaymentModal({
  bill,
  onClose,
  paymentData,
  setPaymentData,
  onSubmit
}) {
  if (!bill) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h3>Record Offline Payment Settlement</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        </div>

        <form onSubmit={onSubmit}>
          <div style={{ background: 'var(--bg-color)', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Settling Invoice:</div>
            <strong style={{ fontSize: '16px', color: '#1E3A8A' }}>
              {bill.billNumber || bill.id} (₹{Number(bill.amount).toLocaleString()})
            </strong>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
              Flat: <strong>{bill.flatNumber}</strong> | Resident: <strong>{bill.residentName}</strong>
            </div>
          </div>

          <div className="form-group">
            <label>Payment Channel *</label>
            <select
              value={paymentData.method}
              onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value })}
            >
              <option value="UPI / QR Transfer">Direct UPI Transfer (GPay/PhonePe)</option>
              <option value="NEFT / IMPS Bank Transfer">NEFT / IMPS Net Banking</option>
              <option value="Cheque / DD">Cheque / Demand Draft</option>
              <option value="Cash at Society Office">Cash Handover</option>
            </select>
          </div>

          <div className="form-group">
            <label>Bank Reference / UTR Number</label>
            <input
              type="text"
              placeholder="e.g. UTR1234567890 or Cheque #0045"
              value={paymentData.transactionId}
              onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Internal Audit Notes</label>
            <textarea
              rows={2}
              value={paymentData.notes}
              onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Mark as Settled
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
