import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  UserCheck, 
  Send, 
  Paperclip, 
  X, 
  MessageSquare, 
  ChevronRight,
  Activity
} from 'lucide-react';
import { getSocietyAdminSession } from '../services/sessionManager';
import { societyAdminService } from '../services/societyAdminService';

export default function Complaints() {
  const session = getSocietyAdminSession();
  const societyId = session?.societyId;

  const [complaints, setComplaints] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [commentText, setCommentText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [assignmentNote, setAssignmentNote] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (!societyId) {
      setLoading(false);
      return;
    }

    const unsubComplaints = societyAdminService.subscribeComplaints(
      societyId,
      (data) => {
        setComplaints(data);
        setLoading(false);
        if (selectedComplaint) {
          const updated = data.find(c => c.id === selectedComplaint.id);
          if (updated) setSelectedComplaint(updated);
        }
      },
      (err) => console.error('Error fetching complaints:', err)
    );

    const unsubStaff = societyAdminService.subscribeStaff(
      societyId,
      (data) => setStaffList(data),
      (err) => console.error('Error fetching staff:', err)
    );

    return () => {
      if (unsubComplaints) unsubComplaints();
      if (unsubStaff) unsubStaff();
    };
  }, [societyId, selectedComplaint?.id]);

  const handleUpdateStatus = async (complaintId, newStatus) => {
    try {
      await societyAdminService.updateComplaintStatus(societyId, complaintId, newStatus);
    } catch (e) {
      alert('Error updating status: ' + e.message);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const queryStr = searchQuery.toLowerCase();
    const idMatches = (c.id || '').toLowerCase().includes(queryStr);
    const residentMatches = (c.residentName || '').toLowerCase().includes(queryStr);
    const flatMatches = (c.flatNumber || c.hostFlat || '').toLowerCase().includes(queryStr);
    const categoryMatches = (c.category || '').toLowerCase().includes(queryStr);
    const titleMatches = (c.title || c.description || '').toLowerCase().includes(queryStr);
    const matchesSearch = idMatches || residentMatches || flatMatches || categoryMatches || titleMatches;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || (c.priority || 'Medium') === priorityFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const totalCount = complaints.length;
  const openCount = complaints.filter(c => !c.status || c.status === 'Open' || c.status === 'Pending').length;
  const assignedCount = complaints.filter(c => c.status === 'Assigned' || c.assignedStaffName).length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress' || c.status === 'in_progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Completed' || c.status === 'Resolved' || c.status === 'Closed').length;
  const highPriorityCount = complaints.filter(c => c.priority === 'High' || c.priority === 'Critical').length;

  if (loading) return <div style={{ padding: '32px', textAlign: 'center' }}>Loading complaint register...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)' }}>
            <ShieldAlert size={22} color="var(--primary)" />
          </div>
          <div className="stat-info">
            <p>Total Complaints</p>
            <h3>{totalCount}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--danger-light)' }}>
            <AlertTriangle size={22} color="var(--danger)" />
          </div>
          <div className="stat-info">
            <p>Open / Pending</p>
            <h3>{openCount}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--warning-light)' }}>
            <UserCheck size={22} color="var(--warning)" />
          </div>
          <div className="stat-info">
            <p>Assigned to Staff</p>
            <h3>{assignedCount}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--secondary-light)' }}>
            <Clock size={22} color="var(--secondary)" />
          </div>
          <div className="stat-info">
            <p>In Progress</p>
            <h3>{inProgressCount}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
            <CheckCircle size={22} color="#10B981" />
          </div>
          <div className="stat-info">
            <p>Resolved & Closed</p>
            <h3>{resolvedCount}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}>
            <AlertTriangle size={22} color="#EF4444" />
          </div>
          <div className="stat-info">
            <p>High / Critical</p>
            <h3>{highPriorityCount}</h3>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search by Ticket ID, Resident, Flat, Title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', width: '240px' }}
          />
          <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}>
            <option value="All">Status: All</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Society Complaint Register</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Resident & Flat</th>
                <th>Category</th>
                <th>Complaint Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>No complaints found.</td></tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr key={c.id}>
                    <td><code>#{c.id.substring(0, 7)}</code></td>
                    <td><strong>{c.residentName || 'Resident'}</strong> (Flat {c.flatNumber || c.hostFlat || 'N/A'})</td>
                    <td><span className="badge primary">{c.category || 'General'}</span></td>
                    <td><strong>{c.title || 'General Maintenance Issue'}</strong></td>
                    <td><span className={`badge ${c.priority === 'High' ? 'danger' : 'warning'}`}>{c.priority || 'Medium'}</span></td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        value={c.status || 'Open'}
                        onChange={(e) => handleUpdateStatus(c.id, e.target.value)}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => setSelectedComplaint(c)}>
                        Details <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
