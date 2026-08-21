import React from 'react';
import { Send, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function NotificationComposer({
  form,
  setForm,
  societies,
  sending,
  lastResult,
  presetCategory,
  setPresetCategory,
  filteredPresets,
  applyPreset,
  handleSend,
}) {
  return (
    <div 
      style={{ 
        backgroundColor: 'var(--card-bg, #FFFFFF)', 
        borderRadius: '18px', 
        padding: '28px', 
        border: '1px solid var(--border-color, #E2E8F0)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#E0F2FE', color: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Send size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>Compose Notification</h3>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary, #64748B)' }}>Send festival greetings, offers, or platform announcements</p>
          </div>
        </div>
      </div>

      {/* Quick Presets Filter Tabs & Chips */}
      <div style={{ marginBottom: '24px', backgroundColor: 'var(--bg-secondary, #F8FAFC)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color, #E2E8F0)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary, #0F172A)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#F59E0B" /> QUICK TEMPLATES & FESTIVAL WISHES
          </div>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'all', label: 'All Presets' },
            { id: 'festival', label: '🪔 Festival Wishes' },
            { id: 'offer', label: '🎁 Offers & Promos' },
            { id: 'notice', label: '📢 Notices' },
            { id: 'emergency', label: '🚨 Alerts' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPresetCategory(tab.id)}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: presetCategory === tab.id ? '#1E3A8A' : '#E2E8F0',
                color: presetCategory === tab.id ? '#FFFFFF' : '#475569',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Preset chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {filteredPresets.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applyPreset(p)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1E3A8A'; e.currentTarget.style.backgroundColor = '#EFF6FF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Category Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
            Alert Category & Priority Icon
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' }}>
            {[
              { id: 'festival', label: '🪔 Festival', desc: 'Greetings' },
              { id: 'offer', label: '🎁 Offer / Ad', desc: 'Promotional' },
              { id: 'notice', label: '📢 Notice', desc: 'General Info' },
              { id: 'emergency', label: '🚨 Urgent', desc: 'High Priority' },
              { id: 'update', label: '⚡ Update', desc: 'New Version' },
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, category: cat.id }))}
                style={{
                  padding: '10px 12px',
                  borderRadius: '12px',
                  border: form.category === cat.id ? '2px solid #1E3A8A' : '1px solid var(--border-color, #E2E8F0)',
                  backgroundColor: form.category === cat.id ? 'rgba(30, 58, 138, 0.06)' : 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '13px', color: form.category === cat.id ? '#1E3A8A' : 'inherit' }}>{cat.label}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary, #64748B)' }}>{cat.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Target Scope */}
        <div style={{ display: 'grid', gridTemplateColumns: form.scope === 'society' ? '1fr 1fr' : '1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Target Audience
            </label>
            <select
              value={form.scope}
              onChange={(e) => setForm(prev => ({ ...prev, scope: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border-color, #CBD5E1)',
                backgroundColor: 'var(--input-bg, #FFFFFF)',
                fontSize: '14px',
                fontWeight: 600
              }}
            >
              <option value="all">🌍 All Platform Users (Residents + Guards)</option>
              <option value="residents">🏠 Residents & Owners Only</option>
              <option value="guards">🛡️ Security Guards Only</option>
              <option value="society">🏢 Specific Society</option>
            </select>
          </div>

          {form.scope === 'society' && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Select Society
              </label>
              <select
                value={form.societyId}
                onChange={(e) => setForm(prev => ({ ...prev, societyId: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color, #CBD5E1)',
                  backgroundColor: 'var(--input-bg, #FFFFFF)',
                  fontSize: '14px',
                  fontWeight: 600
                }}
                required={form.scope === 'society'}
              >
                <option value="">-- Choose Society --</option>
                {societies.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name || s.id} ({s.code || s.id})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Notification Title */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
            Notification Title
          </label>
          <input
            type="text"
            placeholder="e.g. Wishing You a Joyous & Prosperous Diwali! ✨"
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
            style={{
              width: '100%',
              padding: '11px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border-color, #CBD5E1)',
              backgroundColor: 'var(--input-bg, #FFFFFF)',
              fontSize: '14px',
              fontWeight: 600,
              boxSizing: 'border-box'
            }}
            required
          />
        </div>

        {/* Notification Message */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700 }}>
              Notification Message Body
            </label>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary, #64748B)' }}>
              {form.body.length} / 250 characters
            </span>
          </div>
          <textarea
            rows={3}
            placeholder="Write the heartfelt festive greetings or detailed message to appear on all lockscreens..."
            value={form.body}
            onChange={(e) => setForm(prev => ({ ...prev, body: e.target.value }))}
            style={{
              width: '100%',
              padding: '11px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border-color, #CBD5E1)',
              backgroundColor: 'var(--input-bg, #FFFFFF)',
              fontSize: '14px',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>

        {/* Dispatch Result Status */}
        {lastResult && (
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              backgroundColor: lastResult.success > 0 ? '#ECFDF5' : '#FEF2F2',
              border: `1px solid ${lastResult.success > 0 ? '#A7F3D0' : '#FECACA'}`,
              color: lastResult.success > 0 ? '#065F46' : '#991B1B',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
              fontWeight: 700
            }}
          >
            {lastResult.success > 0 ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>
              {lastResult.total === 0
                ? 'No registered active devices found for this target scope.'
                : `Dispatched successfully to ${lastResult.success} / ${lastResult.total} mobile devices!`}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '6px' }}>
          <Button
            type="submit"
            variant="primary"
            loading={sending}
            style={{ minWidth: '180px', fontWeight: 800 }}
          >
            <Send size={16} /> Broadcast Notification
          </Button>
        </div>
      </form>
    </div>
  );
}
