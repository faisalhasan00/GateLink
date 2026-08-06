import React from 'react';
import { Search, Filter, Sliders, UserPlus } from 'lucide-react';

/**
 * @component StaffFilterBar
 * @description Search query input, department filter, status filter, and primary action buttons.
 *
 * @param {Object} props
 * @param {string} props.searchQuery Current search filter term
 * @param {Function} props.setSearchQuery State updater for search input
 * @param {string} props.departmentFilter Active department filter selection
 * @param {Function} props.setDepartmentFilter State updater for department dropdown
 * @param {string} props.statusFilter Active status filter selection
 * @param {Function} props.setStatusFilter State updater for status dropdown
 * @param {Array<string>} props.departments List of available departments
 * @param {Function} props.onOpenRoleModal Callback to open RBAC Matrix Modal
 * @param {Function} props.onOpenAddModal Callback to open Onboard Staff Modal
 */
export default function StaffFilterBar({
  searchQuery,
  setSearchQuery,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  departments = [],
  onOpenRoleModal,
  onOpenAddModal
}) {
  return (
    <div 
      className="card" 
      style={{ 
        padding: '16px 24px', 
        marginBottom: '24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '16px' 
      }}
    >
      {/* Left Controls: Search & Dropdown Filters */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
        {/* Search Field */}
        <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
          <Search 
            size={16} 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--text-muted)' 
            }} 
          />
          <input 
            type="text" 
            placeholder="Search staff by name, ID, phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '9px 12px 9px 36px', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)', 
              fontSize: '13px', 
              outline: 'none', 
              backgroundColor: 'var(--bg-color)', 
              color: 'var(--text-primary)' 
            }}
          />
        </div>

        {/* Department Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <select 
            className="form-select" 
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            style={{ 
              padding: '8px 12px', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)', 
              fontSize: '12px', 
              outline: 'none', 
              fontWeight: 600 
            }}
          >
            <option value="All">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <select 
          className="form-select" 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ 
            padding: '8px 12px', 
            borderRadius: '8px', 
            border: '1px solid var(--border-color)', 
            fontSize: '12px', 
            outline: 'none', 
            fontWeight: 600 
          }}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active Duty Only</option>
          <option value="Suspended">Suspended Personnel</option>
        </select>
      </div>

      {/* Right Controls: Action Triggers */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          className="btn btn-outline" 
          onClick={onOpenRoleModal}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
        >
          <Sliders size={16} /> Role & RBAC Manager
        </button>

        <button 
          className="btn btn-primary" 
          onClick={onOpenAddModal}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
        >
          <UserPlus size={18} /> Onboard Staff
        </button>
      </div>
    </div>
  );
}
