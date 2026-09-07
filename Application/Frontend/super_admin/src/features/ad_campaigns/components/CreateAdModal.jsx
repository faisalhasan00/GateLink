import React from 'react';
import { X } from 'lucide-react';

export default function CreateAdModal({
  form,
  setForm,
  onPublish,
  onClose,
  saving,
}) {
  return (
    <div
      className="sidebar-overlay"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="card"
        style={{ width: '500px', padding: '24px', background: 'white' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h3 style={{ margin: 0 }}>Create New Ad Campaign</h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 600,
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Campaign Title *
            </label>
            <input
              type="text"
              placeholder="e.g. 20% Off Urban Company"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '14px',
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 600,
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Sponsor / Client Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Urban Company"
              value={form.sponsor}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, sponsor: e.target.value }))
              }
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '14px',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={onPublish}
              disabled={saving}
            >
              {saving ? 'Publishing...' : 'Publish Ad Live'}
            </button>
            <button className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
