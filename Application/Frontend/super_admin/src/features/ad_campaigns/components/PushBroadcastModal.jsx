import React from 'react';
import { Send, Megaphone, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function PushBroadcastModal({
  broadcastForm,
  setBroadcastForm,
  broadcastResult,
  sendingBroadcast,
  societies,
  onSend,
  onClose,
}) {
  return (
    <div
      className="sidebar-overlay"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        className="card"
        style={{
          width: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'var(--primary-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <Megaphone size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                Platform Push Broadcast
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                }}
              >
                Instantly wake up closed mobile apps with heads-up banners
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {broadcastResult && (
          <div
            style={{
              marginBottom: '16px',
              padding: '12px 16px',
              borderRadius: '10px',
              background:
                broadcastResult.success > 0 ? '#ECFDF5' : '#FEF2F2',
              border: `1px solid ${
                broadcastResult.success > 0 ? '#10B981' : '#EF4444'
              }`,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color:
                broadcastResult.success > 0 ? '#065F46' : '#991B1B',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            {broadcastResult.success > 0 ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>
              {broadcastResult.success > 0
                ? `Broadcast Delivered! Successfully reached ${broadcastResult.success} active device(s).`
                : 'Broadcast failed or no active devices registered.'}
            </span>
          </div>
        )}

        <form
          onSubmit={onSend}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <div>
            <label
              style={{
                fontSize: '13px',
                fontWeight: 700,
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Broadcast Category
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
              }}
            >
              {[
                { id: 'offer', label: '🎁 Offer' },
                { id: 'announcement', label: '📢 Notice' },
                { id: 'emergency', label: '🚨 Urgent' },
                { id: 'update', label: '⚡ Update' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setBroadcastForm((p) => ({ ...p, category: cat.id }))
                  }
                  style={{
                    padding: '10px 8px',
                    borderRadius: '10px',
                    border:
                      broadcastForm.category === cat.id
                        ? '2px solid var(--primary)'
                        : '1px solid var(--border-color)',
                    background:
                      broadcastForm.category === cat.id
                        ? 'var(--primary-surface)'
                        : 'white',
                    color:
                      broadcastForm.category === cat.id
                        ? 'var(--primary)'
                        : 'inherit',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '13px',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              style={{
                fontSize: '13px',
                fontWeight: 700,
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Target Audience
            </label>
            <select
              value={broadcastForm.scope}
              onChange={(e) =>
                setBroadcastForm((p) => ({ ...p, scope: e.target.value }))
              }
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '14px',
              }}
            >
              <option value="all">
                🌍 All Users Across All Societies (Residents & Guards)
              </option>
              <option value="residents">🏡 All Residents Only</option>
              <option value="guards">🛡️ All Security Guards Only</option>
              <option value="society">🏢 Specific Society</option>
            </select>
          </div>

          {broadcastForm.scope === 'society' && (
            <div>
              <label
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Select Society
              </label>
              <select
                value={broadcastForm.societyId}
                onChange={(e) =>
                  setBroadcastForm((p) => ({
                    ...p,
                    societyId: e.target.value,
                  }))
                }
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontSize: '14px',
                }}
                required
              >
                <option value="">-- Choose Society --</option>
                {societies.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name || s.societyName || s.id}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label
              style={{
                fontSize: '13px',
                fontWeight: 700,
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Notification Title *
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Exclusive Diwali Perk for Residents"
              value={broadcastForm.title}
              onChange={(e) =>
                setBroadcastForm((p) => ({ ...p, title: e.target.value }))
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
                fontSize: '13px',
                fontWeight: 700,
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Notification Message *
            </label>
            <textarea
              required
              rows={4}
              placeholder="e.g. Claim 25% cashback on home maintenance and deep cleaning this weekend."
              value={broadcastForm.body}
              onChange={(e) =>
                setBroadcastForm((p) => ({ ...p, body: e.target.value }))
              }
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Live Preview Card */}
          <div
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '14px',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                marginBottom: '8px',
              }}
            >
              📱 Live Mobile Heads-Up Preview
            </div>
            <div
              style={{
                background: 'white',
                borderRadius: '10px',
                padding: '12px 14px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#1E3A8A',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '16px',
                  flexShrink: 0,
                }}
              >
                GL
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#0F172A',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {broadcastForm.title
                    ? `${
                        broadcastForm.category === 'offer'
                          ? '🎁'
                          : broadcastForm.category === 'emergency'
                          ? '🚨'
                          : '📢'
                      } ${broadcastForm.title}`
                    : 'Notification Title Preview'}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#475569',
                    marginTop: '2px',
                    lineHeight: 1.4,
                  }}
                >
                  {broadcastForm.body ||
                    'Your notification message body will appear right here on the phone screen with high priority heads-up visibility.'}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{ flex: 1 }}
              onClick={onClose}
              disabled={sendingBroadcast}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                flex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              disabled={sendingBroadcast}
            >
              <Send size={16} />
              {sendingBroadcast
                ? 'Broadcasting via Google FCM...'
                : '🚀 Send Push Broadcast to All Devices'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
