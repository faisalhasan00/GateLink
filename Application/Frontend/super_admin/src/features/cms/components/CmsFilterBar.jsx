import React from 'react';
import { Search } from 'lucide-react';

export default function CmsFilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  categories,
  onSearch,
  isDark
}) {
  return (
    <div style={{
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      padding: '16px 20px',
      borderRadius: '16px',
      border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
      marginBottom: '24px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap'
    }}>
      <form onSubmit={onSearch} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '260px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94A3B8'
            }}
          />
          <input
            type="text"
            placeholder="Search title, slug, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: '10px',
              border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
              backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
              color: isDark ? '#F8FAFC' : '#0F172A',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
            backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
            color: isDark ? '#F8FAFC' : '#0F172A',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <option value="ALL">All Statuses</option>
          <option value="Draft">Drafts</option>
          <option value="Review">In Review</option>
          <option value="Published">Published</option>
          <option value="Archived">Archived</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
            backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
            color: isDark ? '#F8FAFC' : '#0F172A',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <option value="ALL">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
