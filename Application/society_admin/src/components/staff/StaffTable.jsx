import React from 'react';
import { UserCheck, Eye, Trash2 } from 'lucide-react';

/**
 * @component StaffTable
 * @description Main directory register table displaying employee records and quick management actions.
 *
 * @param {Object} props
 * @param {Array<Object>} props.filteredStaff Filtered array of staff records
 * @param {number} props.totalStaffCount Total count of all staff records
 * @param {Function} props.onSelectProfile Callback when clicking "Profile" button
 * @param {Function} props.onToggleStatus Callback when clicking "Suspend/Activate" button
 * @param {Function} props.onDeleteStaff Callback when clicking Delete icon button
 */
export default function StaffTable({
  filteredStaff = [],
  totalStaffCount = 0,
  onSelectProfile,
  onToggleStatus,
  onDeleteStaff
}) {
  return (
    <div className="card">
      {/* Card Header & Counter */}
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="card-title">Society Staff Register</h3>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Showing {filteredStaff.length} of {totalStaffCount} personnel
        </span>
      </div>

      {/* Directory Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Staff Name</th>
              <th>Department & Role</th>
              <th>Contact & Gate</th>
              <th>Joining Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  <UserCheck size={36} color="var(--border-color)" style={{ marginBottom: '8px' }} />
                  <div style={{ fontWeight: 600 }}>No staff members found matching your search parameters.</div>
                </td>
              </tr>
            ) : (
              filteredStaff.map((staff) => {
                const isActive = staff.status === 'Active';

                return (
                  <tr key={staff.id}>
                    {/* Employee ID */}
                    <td>
                      <code style={{ background: 'var(--bg-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 800 }}>
                        {staff.employeeId || `EMP-${staff.id.substring(0, 6)}`}
                      </code>
                    </td>

                    {/* Staff Name & Email */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div 
                          style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%', 
                            backgroundColor: 'var(--primary-light)', 
                            color: 'var(--primary)', 
                            fontWeight: 800, 
                            fontSize: '13px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                          }}
                        >
                          {staff.name ? staff.name.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{staff.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{staff.email || 'No Email'}</div>
                        </div>
                      </div>
                    </td>

                    {/* Department & Assigned Role */}
                    <td>
                      <span className="badge primary" style={{ marginBottom: '2px', display: 'inline-block' }}>
                        {staff.department}
                      </span>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {staff.role}
                      </div>
                    </td>

                    {/* Contact & Gate */}
                    <td>
                      <div style={{ fontSize: '12px', fontWeight: 600 }}>{staff.phone}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{staff.assignedGate || 'Gate 1'}</div>
                    </td>

                    {/* Joining Date */}
                    <td>
                      <div style={{ fontSize: '12px' }}>{staff.joiningDate || 'Jan 2025'}</div>
                    </td>

                    {/* Status Badge */}
                    <td>
                      <span className={`badge ${isActive ? 'success' : 'danger'}`}>
                        {staff.status || 'Active'}
                      </span>
                    </td>

                    {/* Quick Action Buttons */}
                    <td>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {/* Profile Drawer */}
                        <button
                          className="btn btn-outline"
                          style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => onSelectProfile(staff)}
                        >
                          <Eye size={13} /> Profile
                        </button>

                        {/* Suspend / Activate Toggle */}
                        <button
                          className="btn btn-outline"
                          style={{ padding: '4px 8px', fontSize: '11px', color: isActive ? 'var(--warning)' : 'var(--secondary)' }}
                          onClick={() => onToggleStatus(staff)}
                        >
                          {isActive ? 'Suspend' : 'Activate'}
                        </button>

                        {/* Delete Record */}
                        <button
                          className="btn-icon"
                          style={{ color: 'var(--danger)' }}
                          onClick={() => onDeleteStaff(staff.id, staff.name)}
                          title="Delete staff record"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
