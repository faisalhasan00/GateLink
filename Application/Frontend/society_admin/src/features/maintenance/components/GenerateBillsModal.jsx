import React from 'react';
import Button from '../../../components/ui/Button';

export default function GenerateBillsModal({
  isOpen,
  onClose,
  billingScope,
  setBillingScope,
  selectedResidentUid,
  setSelectedResidentUid,
  residents,
  formData,
  setFormData,
  calculateTotal,
  isSubmitting,
  onSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h3>Generate Maintenance Invoices</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Billing Target Scope</label>
            <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                <input
                  type="radio"
                  name="scope"
                  value="single"
                  checked={billingScope === 'single'}
                  onChange={() => setBillingScope('single')}
                />
                Single Flat Resident
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                <input
                  type="radio"
                  name="scope"
                  value="all"
                  checked={billingScope === 'all'}
                  onChange={() => {
                    setBillingScope('all');
                    setSelectedResidentUid('');
                  }}
                />
                All Registered Society Flats
              </label>
            </div>
          </div>

          {billingScope === 'single' && (
            <div className="form-group">
              <label>Select Resident / Flat *</label>
              <select
                required
                value={selectedResidentUid}
                onChange={(e) => setSelectedResidentUid(e.target.value)}
              >
                <option value="">-- Choose Flat --</option>
                {residents.map((r) => (
                  <option key={r.id || r.uid} value={r.id || r.uid}>
                    {r.flatNumber || 'Flat N/A'} - {r.name || r.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Invoice Title *</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Billing Month *</label>
              <input
                required
                type="text"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Payment Due Date *</label>
            <input
              required
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          {/* Fee Itemization Breakdown */}
          <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', margin: '14px 0' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text-primary)' }}>Fee Itemization & Slabs</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600 }}>Maintenance Base (₹)</label>
                <input
                  type="number"
                  value={formData.maintenanceCharge}
                  onChange={(e) => setFormData({ ...formData, maintenanceCharge: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600 }}>Parking Slot (₹)</label>
                <input
                  type="number"
                  value={formData.parkingCharge}
                  onChange={(e) => setFormData({ ...formData, parkingCharge: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600 }}>Water & Utility (₹)</label>
                <input
                  type="number"
                  value={formData.waterCharge}
                  onChange={(e) => setFormData({ ...formData, waterCharge: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600 }}>Sinking Fund (₹)</label>
                <input
                  type="number"
                  value={formData.sinkingFund}
                  onChange={(e) => setFormData({ ...formData, sinkingFund: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '13px' }}>Computed Total per Flat:</span>
              <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--primary)' }}>
                ₹{calculateTotal(formData).toLocaleString()}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '18px' }}>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Generating...' : 'Issue Invoice'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
