import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Building2, CreditCard, Mail, ShieldAlert, X, UserCheck, Inbox } from 'lucide-react';
import { superAdminService } from '../../services/superAdminService';

export default function NotificationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null);

  useEffect(() => {
    const unsubscribe = superAdminService.subscribeNotifications(
      (data) => {
        setNotifications(data);
        setLoading(false);
      },
      (err) => {
        console.error('Real-time notification snapshot error:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      await superAdminService.markAllNotificationsRead(unreadIds);
    } catch (e) {
      console.error('Error marking all notifications read:', e);
    }
  };

  const markAsRead = async (id, currentStatus) => {
    if (currentStatus) return;
    try {
      await superAdminService.markNotificationRead(id);
    } catch (e) {
      console.error('Error marking notification read:', e);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'society':
        return { icon: <Building2 size={16} color="#2563EB" />, bg: 'var(--primary-light)' };
      case 'payment':
        return { icon: <CreditCard size={16} color="#059669" />, bg: 'var(--secondary-light)' };
      case 'lead':
        return { icon: <Mail size={16} color="#D97706" />, bg: 'var(--warning-light)' };
      case 'resident':
        return { icon: <UserCheck size={16} color="#2563EB" />, bg: 'var(--primary-light)' };
      default:
        return { icon: <ShieldAlert size={16} color="#7C3AED" />, bg: '#F3E8FF' };
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'Just now';
    try {
      const d = new Date(timeStr);
      if (isNaN(d.getTime())) return 'Just now';
      const diffMs = Date.now() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    } catch {
      return 'Just now';
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
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
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.18)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
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

          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
            {loading ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                Loading live notifications...
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Inbox size={28} style={{ opacity: 0.4, marginBottom: '8px' }} />
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>No notifications yet</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Real-time alerts for sales leads, resident signups & onboarding will appear here.
                </div>
              </div>
            ) : (
              filteredNotifications.map((n) => {
                const { icon, bg } = getNotificationIcon(n.type);
                return (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id, n.read)}
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
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                      {icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: n.read ? 600 : 800, color: 'var(--text-primary)' }}>{n.title}</span>
                        {!n.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />}
                      </div>
                      <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.message}</p>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '4px', fontWeight: 600 }}>{formatTime(n.createdAt)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
