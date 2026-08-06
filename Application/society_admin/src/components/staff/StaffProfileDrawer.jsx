import React from 'react';
import { X, Copy } from 'lucide-react';

/**
 * @component StaffProfileDrawer
 * @description Slide-over drawer modal displaying employee details, credentials, gate assignments, and status.
 *
 * @param {Object} props
 * @param {Object} props.staff Selected staff object to display
 * @param {Function} props.onClose Callback to close drawer
 */
export default function StaffProfileDrawer({ staff, onClose }) {
  if (!staff) return null;

  return (
    <div 
      style={{
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)', 
        backdropFilter: 'blur(4px)', 
        zIndex: 1000,
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '20px'
      }}
    >
      <div 
        className="card" 
        style={{ 
          width: '100%', 
          maxWidth: '520px', 
          borderRadius: '16px', 
          padding: '24px', 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' 
        }}
      >
        {/* Drawer Header */}
        <div 
          className="card-header" 
          style={{ 
            margin: '-24px -24px 20px -24px', 
            padding: '16px 24px', 
            borderBottom: '1px solid var(--border-color)', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}
        >
          <h3 className="card-title" style={{ fontSize: '18px', fontWeight: 800 }}>Staff Profile & Audit Trail</h3>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Profile Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Avatar Banner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--primary-light)', padding: '16px', borderRadius: '12px' }}>
            <div 
              style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--primary)', 
                color: '#ffffff', 
                fontSize: '20px', 
                fontWeight: 800, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              {staff.name ? staff.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>{staff.name}</h4>
              <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>
                <code>{staff.employeeId || 'EMP-2026-001'}</code> • {staff.role}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13px', background: 'var(--bg-color)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Department:</span> <br/>
              <strong>{staff.department}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Assigned Gate:</span> <br/>
              <strong>{staff.assignedGate || 'Gate 1'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Phone:</span> <br/>
              <strong>{staff.phone}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Joining Date:</span> <br/>
              <strong>{staff.joiningDate || 'Jan 2025'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Status:</span> <br/>
              <span className={`badge ${staff.status === 'Active' ? 'success' : 'danger'}`}>
                {staff.status || 'Active'}
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Emergency Contact:</span> <br/>
              <strong>{staff.emergencyContact || 'N/A'}</strong>
            </div>

            {/* Login Credentials Box */}
            <div style={{ gridColumn: 'span 2', paddingTop: '8px', borderTop: '1px dashed var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Login Password:</span> <br/>
                <code style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 800 }}>
                  {staff.password || 'SecGuard@2026'}
                </code>
              </div>
              <button 
                className="btn btn-outline" 
                style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                onClick={() => {
                  navigator.clipboard.writeText(staff.password || 'SecGuard@2026');
                  alert('Password copied to clipboard!');
                }}
              >
                <Copy size={12} /> Copy Password
              </button>
            </div>
          </div>

          {/* Close Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <button className="btn btn-primary" onClick={onClose}>Close Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
}
