import React, { useState } from 'react';
import { Bell } from 'lucide-react';

export default function NotificationMenu() {
  const [hasUnread, setHasUnread] = useState(true);

  return (
    <button 
      aria-label="View Notifications"
      onClick={() => setHasUnread(false)}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        color: 'var(--text-primary)',
        transition: 'all 0.2s ease',
        flexShrink: 0
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--bg-color)';
        e.currentTarget.style.borderColor = 'var(--primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#FFFFFF';
        e.currentTarget.style.borderColor = 'var(--border-color)';
      }}
    >
      <Bell size={19} />
      {hasUnread && (
        <span 
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '9px',
            height: '9px',
            backgroundColor: 'var(--danger)',
            borderRadius: '50%',
            border: '2px solid #FFFFFF'
          }}
        />
      )}
    </button>
  );
}
