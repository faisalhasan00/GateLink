import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  Eye, 
  Lock, 
  CheckCircle, 
  XCircle, 
  Building2, 
  Phone, 
  Mail, 
  Calendar, 
  Shield, 
  Key, 
  Layers, 
  Clock, 
  X,
  UserPlus,
  Sliders,
  Check,
  AlertTriangle
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  deleteDoc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  writeBatch 
} from 'firebase/firestore';
import { db } from '../firebase';
import { getSocietyAdminSession } from '../services/sessionManager';

const DEPARTMENTS = [
  'Security',
  'Housekeeping',
  'Electrical',
  'Plumbing',
  'Gardening',
  'Reception',
  'Accounts',
  'Management',
  'Maintenance'
];

const PREDEFINED_ROLES = [
  'Security Guard',
  'Security Supervisor',
  'Receptionist',
  'Accountant',
  'Facility Manager',
  'Maintenance Technician',
  'Housekeeping Supervisor',
  'Custom Role'
];

const MODULE_PERMISSIONS = [
  { id: 'residents', label: 'Residents Directory', actions: ['View', 'Approve', 'Edit', 'Delete'] },
  { id: 'visitors', label: 'Visitor Logs & Gate Passes', actions: ['View', 'Create Pass', 'Approve Entry'] },
  { id: 'complaints', label: 'Helpdesk Complaints', actions: ['View', 'Assign', 'Resolve', 'Delete'] },
  { id: 'notices', label: 'Broadcast Notices', actions: ['View', 'Create', 'Delete'] },
  { id: 'maintenance', label: 'Maintenance & Billing', actions: ['View', 'Generate Bills', 'Record Payments'] },
  { id: 'staff', label: 'Staff & RBAC Permissions', actions: ['View', 'Create', 'Edit', 'Delete'] },
  { id: 'settings', label: 'Society Settings', actions: ['View', 'Modify'] }
];

export default function Staff() {
  const session = getSocietyAdminSession();
  const societyId = session?.societyId || 'SOC-001';

  const [staffList, setStaffList] = useState([]);
  const [customRoles, setCustomRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedStaffProfile, setSelectedStaffProfile] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);

  // Form State for Add/Edit Staff
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Security',
    role: 'Security Guard',
    assignedGate: 'Gate 1 — Main Entry',
    joiningDate: new Date().toISOString().split('T')[0],
    emergencyContact: '',
    status: 'Active',
    notes: ''
  });

  // Role & RBAC State
  const [roleFormData, setRoleFormData] = useState({
    roleName: '',
    permissions: {}
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // 1. Fetch Staff Directory Stream
    const qStaff = query(collection(db, `societies/${societyId}/staff`), orderBy('createdAt', 'desc'));
    const unsubStaff = onSnapshot(qStaff, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStaffList(data);
      setLoading(false);
    });

    // 2. Fetch Custom Roles Stream
    const qRoles = query(collection(db, `societies/${societyId}/roles`));
    const unsubRoles = onSnapshot(qRoles, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomRoles(data);
    });

    return () => {
      unsubStaff();
      unsubRoles();
    };
  }, [societyId]);

  const handleAddOrEditStaff = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const timestampStr = new Date().toISOString();
      const empId = editingStaff?.employeeId || `EMP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const staffPayload = {
        employeeId: empId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        department: formData.department,
        role: formData.role,
        assignedGate: formData.assignedGate || 'Gate 1 — Main Entry',
        joiningDate: formData.joiningDate,
        emergencyContact: formData.emergencyContact.trim(),
        status: formData.status,
        notes: formData.notes.trim(),
        updatedAt: timestampStr
      };

      if (editingStaff) {
        await updateDoc(doc(db, `societies/${societyId}/staff`, editingStaff.id), staffPayload);
        alert(`Successfully updated staff record for ${formData.name}.`);
      } else {
        staffPayload.createdAt = timestampStr;
        const newRef = await addDoc(collection(db, `societies/${societyId}/staff`), staffPayload);

        // Add Initial Audit Activity Log
        await addDoc(collection(db, `societies/${societyId}/staff/${newRef.id}/activity_logs`), {
          action: 'Staff Member Onboarded',
          description: `Onboarded as ${formData.role} in ${formData.department} department.`,
          timestamp: timestampStr
        });

        alert(`Successfully onboarded ${formData.name}! Employee ID: ${empId}`);
      }

      setIsAddModalOpen(false);
      setEditingStaff(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'Security',
        role: 'Security Guard',
        assignedGate: 'Gate 1 — Main Entry',
        joiningDate: new Date().toISOString().split('T')[0],
        emergencyContact: '',
        status: 'Active',
        notes: ''
      });
      setSubmitting(false);
    } catch (e) {
      setSubmitting(false);
      alert('Error saving staff record: ' + e.message);
    }
  };

  const handleToggleStatus = async (staffObj) => {
    const newStatus = staffObj.status === 'Active' ? 'Suspended' : 'Active';
    try {
      await updateDoc(doc(db, `societies/${societyId}/staff`, staffObj.id), { status: newStatus });
      
      // Log audit
      await addDoc(collection(db, `societies/${societyId}/staff/${staffObj.id}/activity_logs`), {
        action: `Status Changed to ${newStatus}`,
        description: `Staff account status changed from ${staffObj.status} to ${newStatus}.`,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      alert('Error updating status: ' + e.message);
    }
  };

  const handleDeleteStaff = async (id, name) => {
    if (window.confirm(`Are you sure you want to soft delete ${name} from staff directory?`)) {
      try {
        await deleteDoc(doc(db, `societies/${societyId}/staff`, id));
      } catch (e) {
        alert('Error deleting staff: ' + e.message);
      }
    }
  };

  // Create / Save RBAC Role & Permission Matrix
  const handleSaveRole = async (e) => {
    e.preventDefault();
    if (!roleFormData.roleName.trim()) {
      alert('Please enter a role name.');
      return;
    }

    setSubmitting(true);
    try {
      const roleRef = collection(db, `societies/${societyId}/roles`);
      await addDoc(roleRef, {
        roleName: roleFormData.roleName.trim(),
        permissions: roleFormData.permissions,
        createdAt: new Date().toISOString()
      });

      alert(`Custom role "${roleFormData.roleName}" created successfully!`);
      setIsRoleModalOpen(false);
      setRoleFormData({ roleName: '', permissions: {} });
      setSubmitting(false);
    } catch (e) {
      setSubmitting(false);
      alert('Error creating role: ' + e.message);
    }
  };

  const togglePermissionAction = (moduleId, action) => {
    setRoleFormData(prev => {
      const currentActions = prev.permissions[moduleId] || [];
      const updatedActions = currentActions.includes(action)
        ? currentActions.filter(a => a !== action)
        : [...currentActions, action];

      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [moduleId]: updatedActions
        }
      };
    });
  };

  // Filter & Search Logic
  const filteredStaff = staffList.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      (s.name || '').toLowerCase().includes(q) ||
      (s.employeeId || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q) ||
      (s.phone || '').toLowerCase().includes(q) ||
      (s.department || '').toLowerCase().includes(q);

    const matchesDept = departmentFilter === 'All' || s.department === departmentFilter;
    const matchesRole = roleFilter === 'All' || s.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;

    return matchesQuery && matchesDept && matchesRole && matchesStatus;
  });

  // Calculate Dashboard Counters
  const totalCount = staffList.length;
  const activeCount = staffList.filter(s => s.status === 'Active').length;
  const securityCount = staffList.filter(s => s.department === 'Security').length;
  const housekeepingCount = staffList.filter(s => s.department === 'Housekeeping').length;
  const techCount = staffList.filter(s => ['Electrical', 'Plumbing', 'Maintenance'].includes(s.department)).length;
  const managerCount = staffList.filter(s => ['Management', 'Accounts'].includes(s.department)).length;

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <div className="skeleton-loader" style={{ height: '100px', borderRadius: '12px', marginBottom: '24px' }}></div>
        <div className="skeleton-loader" style={{ height: '300px', borderRadius: '12px' }}></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* 1. Staff Statistics Grid */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)' }}>
            <UserCheck size={22} color="var(--primary)" />
          </div>
          <div className="stat-info">
            <p>Total Staff Members</p>
            <h3>{totalCount}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
            <CheckCircle size={22} color="#10B981" />
          </div>
          <div className="stat-info">
            <p>Active Personnel</p>
            <h3>{activeCount}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--secondary-light)' }}>
            <Shield size={22} color="var(--secondary)" />
          </div>
          <div className="stat-info">
            <p>Security Guards</p>
            <h3>{securityCount}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--warning-light)' }}>
            <Layers size={22} color="var(--warning)" />
          </div>
          <div className="stat-info">
            <p>Maintenance & Techs</p>
            <h3>{techCount}</h3>
          </div>
        </div>
      </div>

      {/* 2. Control Panel & Search Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 260px' }}>
              <Search size={18} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search by Employee ID, Name, Email, Dept..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 38px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                  fontSize: '13px'
                }}
              />
            </div>

            {/* Department Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} color="var(--text-secondary)" />
              <select 
                className="form-select" 
                value={departmentFilter} 
                onChange={(e) => setDepartmentFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
              >
                <option value="All">Dept: All</option>
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <select 
              className="form-select" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
            >
              <option value="All">Status: All</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Suspended">Suspended</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn btn-outline" 
              onClick={() => setIsRoleModalOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Sliders size={16} /> Role & RBAC Manager
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setEditingStaff(null);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  department: 'Security',
                  role: 'Security Guard',
                  assignedGate: 'Gate 1 — Main Entry',
                  joiningDate: new Date().toISOString().split('T')[0],
                  emergencyContact: '',
                  status: 'Active',
                  notes: ''
                });
                setIsAddModalOpen(true);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <UserPlus size={18} /> Onboard Staff
            </button>
          </div>

        </div>
      </div>

      {/* 3. Staff Register Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Society Staff Register</h3>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Showing {filteredStaff.length} of {staffList.length} personnel
          </span>
        </div>

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
                filteredStaff.map((s) => {
                  const isActive = s.status === 'Active';

                  return (
                    <tr key={s.id}>
                      <td>
                        <code style={{ background: 'var(--bg-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 800 }}>
                          {s.employeeId || `EMP-${s.id.substring(0,6)}`}
                        </code>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700 }}>{s.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{s.email || 'No Email'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge primary" style={{ marginBottom: '2px', display: 'inline-block' }}>{s.department}</span>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>{s.role}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '12px', fontWeight: 600 }}>{s.phone}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{s.assignedGate || 'Gate 1'}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '12px' }}>{s.joiningDate || 'Jan 2025'}</div>
                      </td>
                      <td>
                        <span className={`badge ${isActive ? 'success' : 'danger'}`}>
                          {s.status || 'Active'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            onClick={() => setSelectedStaffProfile(s)}
                          >
                            <Eye size={13} /> Profile
                          </button>

                          <button
                            className="btn btn-outline"
                            style={{ padding: '4px 8px', fontSize: '11px', color: isActive ? 'var(--warning)' : 'var(--secondary)' }}
                            onClick={() => handleToggleStatus(s)}
                          >
                            {isActive ? 'Suspend' : 'Activate'}
                          </button>

                          <button
                            className="btn-icon"
                            style={{ color: 'var(--danger)' }}
                            onClick={() => handleDeleteStaff(s.id, s.name)}
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

      {/* 4. Onboard / Edit Staff Modal */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '560px', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <div className="card-header" style={{ margin: '-24px -24px 20px -24px', padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="card-title" style={{ fontSize: '18px', fontWeight: 800 }}>{editingStaff ? 'Edit Staff Profile' : 'Onboard New Staff Member'}</h3>
              <button className="btn-icon" onClick={() => setIsAddModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddOrEditStaff} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Full Name *</label>
                <input required type="text" placeholder="e.g. Rajesh Kumar" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Mobile Phone *</label>
                  <input required type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Email Address</label>
                  <input type="email" placeholder="staff@society.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Department *</label>
                  <select className="form-select" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}>
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Assigned Role *</label>
                  <select className="form-select" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}>
                    {PREDEFINED_ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                    {customRoles.map(cr => (
                      <option key={cr.id} value={cr.roleName}>{cr.roleName} (Custom)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Assigned Gate / Block</label>
                  <input type="text" placeholder="Gate 1 — Main Entry" value={formData.assignedGate} onChange={e => setFormData({ ...formData, assignedGate: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Joining Date</label>
                  <input type="date" value={formData.joiningDate} onChange={e => setFormData({ ...formData, joiningDate: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Emergency Contact Phone</label>
                <input type="tel" placeholder="+91 91234 56789" value={formData.emergencyContact} onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1, padding: '10px' }} onClick={() => setIsAddModalOpen(false)} disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '10px' }} disabled={submitting}>
                  {submitting ? 'Saving...' : editingStaff ? 'Update Staff Record' : 'Complete Onboarding'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Role & Permission Manager (RBAC) Modal */}
      {isRoleModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '680px', maxHeight: '88vh', overflowY: 'auto', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div className="card-header" style={{ margin: '-24px -24px 20px -24px', padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="card-title" style={{ fontSize: '18px', fontWeight: 800 }}>RBAC Role & Permission Matrix</h3>
              <button className="btn-icon" onClick={() => setIsRoleModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveRole} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>New Custom Role Name *</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. Senior Security Supervisor"
                  value={roleFormData.roleName}
                  onChange={e => setRoleFormData({ ...roleFormData, roleName: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
                />
              </div>

              {/* Module Action Permission Matrix */}
              <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '12px', letterSpacing: '0.5px' }}>MODULE ACTION PERMISSIONS</div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {MODULE_PERMISSIONS.map(mod => {
                    const selectedActions = roleFormData.permissions[mod.id] || [];

                    return (
                      <div key={mod.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#ffffff', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700 }}>{mod.label}</span>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {mod.actions.map(act => {
                            const isChecked = selectedActions.includes(act);
                            return (
                              <button
                                key={act}
                                type="button"
                                onClick={() => togglePermissionAction(mod.id, act)}
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  border: isChecked ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                                  backgroundColor: isChecked ? 'var(--primary-light)' : 'transparent',
                                  color: isChecked ? 'var(--primary)' : 'var(--text-secondary)',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                {isChecked && <Check size={10} style={{ display: 'inline', marginRight: 2 }} />} {act}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1, padding: '10px' }} onClick={() => setIsRoleModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '10px' }} disabled={submitting}>
                  {submitting ? 'Creating...' : 'Save Custom Role & Matrix'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Staff Profile Drawer */}
      {selectedStaffProfile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '520px', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div className="card-header" style={{ margin: '-24px -24px 20px -24px', padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="card-title" style={{ fontSize: '18px', fontWeight: 800 }}>Staff Profile & Audit Trail</h3>
              <button className="btn-icon" onClick={() => setSelectedStaffProfile(null)}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--primary-light)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#ffffff', fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedStaffProfile.name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>{selectedStaffProfile.name}</h4>
                  <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>
                    <code>{selectedStaffProfile.employeeId || 'EMP-2026-001'}</code> • {selectedStaffProfile.role}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13px', background: 'var(--bg-color)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div><span style={{ color: 'var(--text-secondary)' }}>Department:</span> <br/><strong>{selectedStaffProfile.department}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Assigned Gate:</span> <br/><strong>{selectedStaffProfile.assignedGate || 'Gate 1'}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Phone:</span> <br/><strong>{selectedStaffProfile.phone}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Joining Date:</span> <br/><strong>{selectedStaffProfile.joiningDate || 'Jan 2025'}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Status:</span> <br/><span className={`badge ${selectedStaffProfile.status === 'Active' ? 'success' : 'danger'}`}>{selectedStaffProfile.status}</span></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Emergency Contact:</span> <br/><strong>{selectedStaffProfile.emergencyContact || 'N/A'}</strong></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button className="btn btn-primary" onClick={() => setSelectedStaffProfile(null)}>Close Profile</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
