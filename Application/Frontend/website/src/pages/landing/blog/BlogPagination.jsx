import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BlogPagination({ currentPage, totalPages, onPageChange, isDark }) {
  if (totalPages <= 1) return null;

  const btnStyle = (disabled) => ({
    padding: '10px 16px',
    borderRadius: '10px',
    border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
    backgroundColor: isDark ? '#1E293B' : '#FFF',
    color: isDark ? '#F8FAFC' : '#1E293B',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        style={btnStyle(currentPage === 1)}
      >
        <ChevronLeft size={16} /> Previous
      </button>

      <span style={{ fontSize: '14px', fontWeight: '700', color: isDark ? '#CBD5E1' : '#475569' }}>
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        style={btnStyle(currentPage === totalPages)}
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
}
