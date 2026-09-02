import React from 'react';
import { X } from 'lucide-react';

export function MediaLibraryModal({
  isOpen,
  onClose,
  isDark,
  mediaLibrary,
  onSelectMedia,
}) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ backgroundColor: isDark ? '#1E293B' : '#FFF', padding: '24px', borderRadius: '16px', maxWidth: '700px', width: '100%', maxHeight: '80vh', overflowY: 'auto', border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Media Library Selector</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
          {mediaLibrary.map((med) => (
            <div
              key={med.id}
              onClick={() => onSelectMedia(med.url)}
              style={{ border: `2px solid ${isDark ? '#334155' : '#E2E8F0'}`, borderRadius: '10px', overflow: 'hidden', cursor: 'pointer' }}
            >
              <img src={med.url} alt={med.filename} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
              <div style={{ padding: '6px', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {med.filename}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
