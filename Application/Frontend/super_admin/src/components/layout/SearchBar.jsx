import React, { useState } from 'react';
import { Search } from 'lucide-react';
import GlobalSearchModal from '../GlobalSearchModal';

export default function SearchBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <GlobalSearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div 
        onClick={() => setIsModalOpen(true)}
        role="button"
        tabIndex={0}
        aria-label="Open Global Search (Ctrl + K)"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsModalOpen(true);
          }
        }}
        className="enterprise-search-container"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          height: '42px',
          borderRadius: '12px',
          backgroundColor: 'var(--search-bg, var(--bg-color))',
          border: '1px solid var(--border-color)',
          transition: 'all 0.2s ease',
          paddingLeft: '14px',
          paddingRight: '12px'
        }}
      >
        <Search size={18} color="var(--text-secondary)" style={{ marginRight: '10px', flexShrink: 0 }} />
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Search residents, visitors, bills...
        </span>

        <kbd style={{
          backgroundColor: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          padding: '2px 6px',
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--text-secondary)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          marginLeft: '8px',
          flexShrink: 0
        }}>
          Ctrl + K
        </kbd>
      </div>
    </>
  );
}
