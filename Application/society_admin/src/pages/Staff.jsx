import React, { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  deleteDoc, 
  addDoc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '../firebase';
import { getSocietyAdminSession } from '../services/sessionManager';

import StaffStatsCards from '../components/staff/StaffStatsCards';
import StaffFilterBar from '../components/staff/StaffFilterBar';
import StaffTable from '../components/staff/StaffTable';
import StaffOnboardModal from '../components/staff/StaffOnboardModal';
import StaffRoleRbacModal from '../components/staff/StaffRoleRbacModal';
import StaffProfileDrawer from '../components/staff/StaffProfileDrawer';

/**
 * Department to Roles Mapping Schema
 */
const DEPARTMENT_ROLES_MAP = {
  'Security': ['Security Guard', 'Security Supervisor', 'Head Security Officer', 'CCTV Monitor Operator'],
  'Housekeeping': ['Housekeeping Staff', 'Housekeeping Supervisor', 'Janitor & Cleaner', 'Waste Management Operator'],
  'Electrical': ['Electrician', 'Senior Electrical Engineer', 'Generator Operator'],
  'Plumbing': ['Plumber', 'Pump Room Operator', 'Sanitation Technician'],
  'Gardening': ['Gardener & Horticulturist', 'Lawn Maintenance Worker'],
  'Reception': ['Front Desk Executive', 'Receptionist', 'Concierge Desk Manager'],
  'Accounts': ['Accountant', 'Billing & Collections Executive', 'Audit Officer'],
  'Management': ['Facility Manager', 'Society Manager', 'Estate Officer', 'Operations Supervisor'],
  'Maintenance': ['Maintenance Technician', 'Lift & Elevator Technician', 'HVAC Technician', 'Building Maintenance Engineer']
};

const DEPARTMENTS = Object.keys(DEPARTMENT_ROLES_MAP);

/**
 * Module Permissions Matrix Schema
 */
const MODULE_PERMISSIONS = [
  { id: 'residents', label: 'Residents Directory', actions: ['View', 'Approve', 'Edit', 'Delete'] },
  { id: 'visitors', label: 'Visitor Logs & Gate Passes', actions: ['View', 'Create Pass', 'Approve Entry'] },
  { id: 'complaints', label: 'Helpdesk Complaints', actions: ['View', 'Assign', 'Resolve', 'Delete'] },
  { id: 'notices', label: 'Broadcast Notices', actions: ['View', 'Create', 'Delete'] },
  { id: 'maintenance', label: 'Maintenance & Billing', actions: ['View', 'Generate Bills', 'Record Payments'] },
  { id: 'staff', label: 'Staff & RBAC Permissions', actions: ['View', 'Create', 'Edit', 'Delete'] },
  { id: 'settings', label: 'Society Settings', actions: ['View', 'Modify'] }
];

/**
 * Helper: Generate Random Alphanumeric Password
 */
const generateSecurePassword = () => {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789@#$';
  let pass = '';
  for (let i = 0; i < 8; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

/**
 * @page Staff
 * @description Main Staff Directory & RBAC Management page for Society Admins.
 */
export default function Staff() {
  const session = getSocietyAdminSession();
  const societyId = session?.societyId || 'SOC-001';

  // 1. Data Streams State
  const [staffList, setStaffList] = useState([]);
  const [customRoles, setCustomRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // 3. Modals & Drawers State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedStaffProfile, setSelectedStaffProfile] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);

  // 4. Form State for Onboard / Edit Staff
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Security',
    role: 'Security Guard',
    customRoleText: '',
    password: generateSecurePassword(),
    assignedGate: 'Gate 1 — Main Entry',
    joiningDate: new Date().toISOString().split('T')[0],
    emergencyContact: '',
    status: 'Active',
    notes: ''
  });

  // 5. Role & RBAC State
  const [roleFormData, setRoleFormData] = useState({
    roleName: '',
    permissions: {}
  });

  const [submitting, setSubmitting] = useState(false);

  /**
   * Subscribe to Live Firestore Streams
   */
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

  /**
   * Automatically update available roles when department selection changes
   */
  const handleDepartmentChange = (newDept) => {
    const relatedRoles = DEPARTMENT_ROLES_MAP[newDept] || [];
    const defaultRole = relatedRoles.length > 0 ? relatedRoles[0] : '';
    setFormData(prev => ({
      ...prev,
      department: newDept,
      role: defaultRole
    }));
  };

  /**
   * Onboard New Staff Member or Update Existing Profile
   */
  const handleAddOrEditStaff = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const timestampStr = new Date().toISOString();
      const empId = editingStaff?.employeeId || `EMP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const finalRole = formData.role === 'Custom'
        ? (formData.customRoleText.trim() || 'Custom Role')
        : formData.role;

      const staffPayload = {
        employeeId: empId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        department: formData.department,
        role: finalRole,
        password: formData.password || generateSecurePassword(),
        assignedGate: formData.assignedGate || 'Gate 1 — Main Entry',
        joiningDate: formData.joiningDate,
        emergencyContact: formData.emergencyContact.trim(),
        status: formData.status,
        notes: formData.notes?.trim() || '',
        updatedAt: timestampStr
      };

      if (editingStaff) {
        await updateDoc(doc(db, `societies/${societyId}/staff`, editingStaff.id), staffPayload);
        alert(`Successfully updated staff record for ${formData.name}.`);
      } else {
        staffPayload.createdAt = timestampStr;
        const newRef = await addDoc(collection(db, `societies/${societyId}/staff`), staffPayload);

        // Add Audit Activity Log
        await addDoc(collection(db, `societies/${societyId}/staff/${newRef.id}/activity_logs`), {
          action: 'Staff Member Onboarded',
          description: `Onboarded as ${finalRole} in ${formData.department} department.`,
          timestamp: timestampStr
        });

        alert(`Successfully onboarded ${formData.name}!\n\nEmployee ID: ${empId}\nLogin Password: ${staffPayload.password}`);
      }

      setIsAddModalOpen(false);
      setEditingStaff(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'Security',
        role: 'Security Guard',
        customRoleText: '',
        password: generateSecurePassword(),
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

  /**
   * Delete Staff Record
   */
  const handleDeleteStaff = async (staffId, name) => {
    if (!window.confirm(`Are you sure you want to delete staff record for "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, `societies/${societyId}/staff`, staffId));
    } catch (e) {
      alert('Error deleting staff record: ' + e.message);
    }
  };

  /**
   * Toggle Active / Suspended Staff Status
   */
  const handleToggleStatus = async (staff) => {
    const newStatus = staff.status === 'Active' ? 'Suspended' : 'Active';
    try {
      await updateDoc(doc(db, `societies/${societyId}/staff`, staff.id), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      alert('Error updating status: ' + e.message);
    }
  };

  /**
   * Save Custom Role & Permission Matrix
   */
  const handleSaveRole = async (e) => {
    e.preventDefault();
    if (!roleFormData.roleName.trim()) {
      alert('Please enter a role name.');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, `societies/${societyId}/roles`), {
        roleName: roleFormData.roleName.trim(),
        permissions: roleFormData.permissions,
        createdAt: new Date().toISOString()
      });
      alert(`Created custom role "${roleFormData.roleName}"!`);
      setIsRoleModalOpen(false);
      setRoleFormData({ roleName: '', permissions: {} });
      setSubmitting(false);
    } catch (e) {
      setSubmitting(false);
      alert('Error creating role: ' + e.message);
    }
  };

  /**
   * Toggle Individual Module Permission Checkbox
   */
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
      {/* 1. Executive KPI Summary Cards */}
      <StaffStatsCards
        totalCount={totalCount}
        activeCount={activeCount}
        securityCount={securityCount}
        techCount={techCount}
        managerCount={managerCount}
      />

      {/* 2. Search & Filter Bar */}
      <StaffFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        departments={DEPARTMENTS}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onOpenAddModal={() => {
          setEditingStaff(null);
          setFormData({
            name: '',
            email: '',
            phone: '',
            department: 'Security',
            role: 'Security Guard',
            customRoleText: '',
            password: generateSecurePassword(),
            assignedGate: 'Gate 1 — Main Entry',
            joiningDate: new Date().toISOString().split('T')[0],
            emergencyContact: '',
            status: 'Active',
            notes: ''
          });
          setIsAddModalOpen(true);
        }}
      />

      {/* 3. Staff Directory Table Register */}
      <StaffTable
        filteredStaff={filteredStaff}
        totalStaffCount={totalCount}
        onSelectProfile={(staff) => setSelectedStaffProfile(staff)}
        onToggleStatus={handleToggleStatus}
        onDeleteStaff={handleDeleteStaff}
      />

      {/* 4. Onboard / Edit Staff Modal */}
      <StaffOnboardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        editingStaff={editingStaff}
        departments={DEPARTMENTS}
        departmentRolesMap={DEPARTMENT_ROLES_MAP}
        customRoles={customRoles}
        handleDepartmentChange={handleDepartmentChange}
        generateSecurePassword={generateSecurePassword}
        onSubmit={handleAddOrEditStaff}
        submitting={submitting}
      />

      {/* 5. Role & Permission Matrix (RBAC) Modal */}
      <StaffRoleRbacModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        roleFormData={roleFormData}
        setRoleFormData={setRoleFormData}
        modulePermissions={MODULE_PERMISSIONS}
        togglePermissionAction={togglePermissionAction}
        onSubmit={handleSaveRole}
        submitting={submitting}
      />

      {/* 6. Staff Profile Drawer */}
      <StaffProfileDrawer
        staff={selectedStaffProfile}
        onClose={() => setSelectedStaffProfile(null)}
      />
    </div>
  );
}
