import React from 'react';

export default function SkeletonLoader() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '16px', opacity: 0.7 }}>
        <div style={{ height: '36px', width: '45%', backgroundColor: '#E2E8F0', borderRadius: '10px', margin: '0 auto' }} />
        <div style={{ height: '18px', width: '30%', backgroundColor: '#EDF2F7', borderRadius: '6px', margin: '0 auto' }} />
        <div style={{ height: '220px', width: '100%', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', marginTop: '16px' }} />
      </div>
    </div>
  );
}
