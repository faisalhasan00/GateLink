import React from 'react';

export default function FullscreenDocViewer({ documentInfo, onClose }) {
  if (!documentInfo) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Close Preview ✕
        </button>
      </div>

      <div style={{ color: 'white', marginBottom: '12px', fontSize: '16px', fontWeight: 600 }}>
        {documentInfo.title || 'Residency Verification Proof'}
      </div>

      <img
        src={documentInfo.url}
        alt="Verification Document"
        style={{
          maxWidth: '90%',
          maxHeight: '80vh',
          objectFit: 'contain',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
