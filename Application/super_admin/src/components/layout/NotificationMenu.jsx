import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Building2, CreditCard, Mail, ShieldAlert, X } from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New Society Onboarding Request',
    message: 'Skyline Heights registered for Enterprise Tier (120 flats).',
    time: '5 mins ago',
    read: false,
    type: 'society',
    icon: <Building2 size={16} color="#2563EB" />,
    bg: 'var(--primary-light)'
  },
  {
    id: 2,
    title: 'Subscription Payment Received',
    message: 'Green Valley Society processed annual renewal of ₹1,20,000.',
    time: '1 hr ago',
    read: false,
    type: 'payment',
    icon: <CreditCard size={16} color="#059669" />,
    bg: 'var(--secondary-light)'
  },
  {
    id: 3,
    title: 'Inbound Website CRM Lead',
    message: 'Arjun Kumar requested a demo for 150 flats in Bengaluru.',
    time: '3 hrs ago',
    read: false,
    type: 'lead',
    icon: <Mail size={16} color="#D97706" />,
    bg: 'var(--warning-light)'
  },
  {
    id: 4,
    title: 'Security Compliance Audit',
    message: 'Guard App API keys successfully rotated for all societies.',
    time: '1 day ago',
    read: true,
    type: 'security',
    icon: <ShieldAlert size={16} color="#7C3AED" />,
    bg: '#F3E8FF'
  }
];

export default function NotificationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const menuRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      {/* Bell Trigger Button */}
      <button 
        aria-label="View Notifications"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--surface-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          color: 'var(--text-primary)',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
        }}
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span 
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              backgroundColor: 'var(--danger)',
              color: '#FFFFFF',
              borderRadius: '10px',
              fontSize: '10px',
              fontWeight: 900,
              padding: '1px 5px',
              lineHeight: 1,
              border: '2px solid var(--surface-color)'
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Popover */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '52px',
            right: 0,
            width: '360px',
            maxHeight: '480px',
            backgroundColor: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>System Notifications</h4>
              {unreadCount > 0 && (
                <span style={{ fontSize: '11px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Filter Bar & Mark All Read */}
          <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-color)' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setFilter('all')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: filter === 'all' ? 'var(--primary)' : 'transparent',
                  color: filter === 'all' ? '#FFFFFF' : 'var(--text-secondary)'
                }}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: filter === 'unread' ? 'var(--primary)' : 'transparent',
                  color: filter === 'unread' ? '#FFFFFF' : 'var(--text-secondary)'
                }}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '11px',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
            {filteredNotifications.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px', fontStyle: 'italic' }}>
                🎉 No unread notifications!
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  style={{
                    padding: '12px 18px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    backgroundColor: n.read ? 'transparent' : 'var(--bg-color)',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--border-color)',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = n.read ? 'transparent' : 'var(--bg-color)'}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: n.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    {n.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: n.read ? 600 : 800, color: 'var(--text-primary)' }}>{n.title}</span>
                      {!n.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />}
                    </div>
                    <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.message}</p>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '4px', fontWeight: 600 }}>{n.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
