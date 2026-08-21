import React from 'react';
import { Search } from 'lucide-react';
import { ROLE_PRESETS } from '../../../services/teamService';

export default function TeamToolbar({
  isDark,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter
}) {
  return (
    <div style={{
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      padding: '16px 20px',
      borderRadius: '12px',
      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '14px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '260px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
          <input
            type="text"
            placeholder="Search staff by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
              background: isDark ? '#0F172A' : '#F8FAFC',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Status Filter */}
        <div style={{ display: 'flex', background: isDark ? '#0F172A' : '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
          {['ALL', 'Active', 'Suspended'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '12px',
                fontWeight: statusFilter === st ? 700 : 500,
                cursor: 'pointer',
                backgroundColor: statusFilter === st ? '#1E3A8A' : 'transparent',
                color: statusFilter === st ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all 0.15s'
              }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CBD5E1',
            background: isDark ? '#0F172A' : '#F8FAFC',
            color: 'var(--text-primary)',
            fontSize: '12px',
            fontWeight: 600,
            outline: 'none'
          }}
        >
          <option value="ALL">All Roles</option>
          {Object.keys(ROLE_PRESETS).map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
