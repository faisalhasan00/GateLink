import React, { useState, useEffect } from 'react';
import { getSocietyAdminSession } from '../services/sessionManager';
import { societyAdminService } from '../services/societyAdminService';

import StaffStatsCards from '../components/staff/StaffStatsCards';
import StaffFilterBar from '../components/staff/StaffFilterBar';
import StaffTable from '../components/staff/StaffTable';
import StaffOnboardModal from '../components/staff/StaffOnboardModal';
import StaffRoleRbacModal from '../components/staff/StaffRoleRbacModal';
import StaffProfileDrawer from '../components/staff/StaffProfileDrawer';

const DEPARTMENT_ROLES_MAP = {
  'Security': ['Security Guard', 'Security Supervisor', 'Head Security Officer', 'CCTV Monitor Operator'],
  'Housekeeping': ['Housekeeping Staff', 'Housekeeping Supervisor', 'Janitor & Cleaner'],
  'Electrical': ['Electrician', 'Senior Electrical Engineer'],
  'Plumbing': ['Plumber', 'Pump Room Operator'],
  'Maintenance': ['Maintenance Technician', 'Building Maintenance Engineer']
};

const DEPARTMENTS = Object.keys(DEPARTMENT_ROLES_MAP);

const MODULE_PERMISSIONS = [
  { id: 'residents', label: 'Residents Directory', actions: ['View', 'Approve', 'Edit', 'Delete'] },
  { id: 'visitors', label: 'Visitor Logs & Gate Passes', actions: ['View', 'Create Pass', 'Approve Entry'] },
  { id: 'complaints', label: 'Helpdesk Complaints', actions: ['View', 'Assign', 'Resolve', 'Delete'] }
];

const generateSecurePassword = () => {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789@#$';
  let pass = '';
  for (let i = 0; i < 8; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

export default function Staff() {
  const session = getSocietyAdminSession();
  const societyId = session?.societyId;

  const [staffList, setStaffList] = useState([]);
  const [customRoles, setCustomRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedStaffProfile, setSelectedStaffProfile] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);

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

  const [roleFormData, setRoleFormData] = useState({
    roleName: '',
    permissions: {}
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!societyId) {
      setLoading(false);
      return;
    }

    const unsubStaff = societyAdminService.subscribeStaff(
      societyId,
      (data) => {
        setStaffList(data);
        setLoading(false);
      },
      (err) => console.error('Error fetching staff:', err)
    );

    return () => {
      if (unsubStaff) unsubStaff();
    };
  }, [societyId]);

  const handleDepartmentChange = (newDept) => {
    const relatedRoles = DEPARTMENT_ROLES_MAP[newDept] || [];
    const defaultRole = relatedRoles.length > 0 ? relatedRoles[0] : '';
    setFormData(prev => ({
      ...prev,
      department: newDept,
      role: defaultRole
    }));
  };

  const handleAddOrEditStaff = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await societyAdminService.addResident(societyId, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        department: formData.department,
        role: 'guard',
        status: formData.status
      });

      alert(`Successfully onboarded ${formData.name}!`);
      setIsAddModalOpen(false);
      setEditingStaff(null);
      setSubmitting(false);
    } catch (e) {
      setSubmitting(false);
      alert('Error saving staff record: ' + e.message);
    }
  };

  const handleDeleteStaff = async (staffId, name) => {
    if (!window.confirm(`Are you sure you want to delete staff record for "${name}"?`)) return;
    try {
      await societyAdminService.deleteResident(societyId, staffId);
    } catch (e) {
      alert('Error deleting staff record: ' + e.message);
    }
  };

  const handleToggleStatus = async (staff) => {
    const newStatus = staff.status === 'Active' ? 'Suspended' : 'Active';
    try {
      await societyAdminService.updateResidentStatus(societyId, staff.id, newStatus);
    } catch (e) {
      alert('Error updating status: ' + e.message);
    }
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    setIsRoleModalOpen(false);
  };

  const togglePermissionAction = (moduleId, action) => {
    setRoleFormData(prev => {
      const currentActions = prev.permissions[moduleId] || [];
      const updatedActions = currentActions.includes(action)
        ? currentActions.filter(a => a !== action)
        : [...currentActions, action];
      return {
        ...prev,
        permissions: { ...prev.permissions, [moduleId]: updatedActions }
      };
    });
  };

  const filteredStaff = staffList.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      (s.name || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q) ||
      (s.phone || '').toLowerCase().includes(q);
    const matchesDept = departmentFilter === 'All' || s.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesQuery && matchesDept && matchesStatus;
  });

  if (loading) return <div style={{ padding: '32px', textAlign: 'center' }}>Loading Staff Directory...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <StaffStatsCards
        totalCount={staffList.length}
        activeCount={staffList.filter(s => s.status === 'Active' || s.status === 'active').length}
        securityCount={staffList.length}
        techCount={0}
        managerCount={0}
      />

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
          setIsAddModalOpen(true);
        }}
      />

      <StaffTable
        filteredStaff={filteredStaff}
        totalStaffCount={staffList.length}
        onSelectProfile={(staff) => setSelectedStaffProfile(staff)}
        onToggleStatus={handleToggleStatus}
        onDeleteStaff={handleDeleteStaff}
      />

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

      <StaffProfileDrawer
        staff={selectedStaffProfile}
        onClose={() => setSelectedStaffProfile(null)}
      />
    </div>
  );
}
