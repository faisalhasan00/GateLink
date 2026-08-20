import React from 'react';

export default function AddCrmLeadModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3>Record New Sales Lead</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Contact Name *</label>
            <input
              required
              type="text"
              placeholder="e.g. Ramesh Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Mobile Number *</label>
            <input
              required
              type="tel"
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="ramesh@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Society / Apartment Name</label>
            <input
              type="text"
              placeholder="e.g. Palm Meadows RWA"
              value={formData.societyName}
              onChange={(e) => setFormData({ ...formData, societyName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>City / Location</label>
            <input
              type="text"
              placeholder="e.g. Mumbai, Bengaluru, Pune"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Lead</button>
          </div>
        </form>
      </div>
    </div>
  );
}
