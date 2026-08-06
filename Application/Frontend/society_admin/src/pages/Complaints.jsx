import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  Send, 
  Paperclip, 
  X, 
  MessageSquare, 
  UserCheck, 
  ExternalLink,
  ChevronRight,
  Activity
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  addDoc, 
  arrayUnion, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { getSocietyAdminSession } from '../services/sessionManager';

export default function Complaints() {
  const session = getSocietyAdminSession();
  const societyId = session?.societyId || 'SOC-001';

  const [complaints, setComplaints] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Interactive Modal State
  const [commentText, setCommentText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [assignmentNote, setAssignmentNote] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    // 1. Fetch Complaints Stream
    const qComplaints = query(collection(db, `societies/${societyId}/complaints`), orderBy('createdAt', 'desc'));
    const unsubComplaints = onSnapshot(qComplaints, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComplaints(data);
      setLoading(false);

      // Keep selected complaint updated in real-time
      if (selectedComplaint) {
        const updated = data.find(c => c.id === selectedComplaint.id);
        if (updated) setSelectedComplaint(updated);
      }
    });

    // 2. Fetch Real Society Staff Directory Stream
    const qStaff = query(collection(db, `societies/${societyId}/staff`));
    const unsubStaff = onSnapshot(qStaff, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name, role: doc.data().role }));
      setStaffList(data);
    });

    return () => {
      unsubComplaints();
      unsubStaff();
    };
  }, [societyId, selectedComplaint?.id]);

  // Status Machine update helper with audit log & resident notification
  const handleUpdateStatus = async (complaintId, newStatus, residentUid) => {
    try {
      const complaintRef = doc(db, `societies/${societyId}/complaints`, complaintId);
      const timestampStr = new Date().toLocaleString();

      await updateDoc(complaintRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
        timeline: arrayUnion({
          action: `Status changed to ${newStatus}`,
          user: 'Admin',
          timestamp: timestampStr,
          type: 'status'
        })
      });

      // Dispatch real-time resident notification
      if (residentUid) {
        await addDoc(collection(db, `societies/${societyId}/users/${residentUid}/notifications`), {
          title: `Complaint Status Updated: ${newStatus}`,
          body: `Your complaint #${complaintId.substring(0, 7)} status has been updated to "${newStatus}".`,
          createdAt: new Date().toISOString(),
          isRead: false,
          type: 'complaint'
        });
      }
    } catch (e) {
      alert('Error updating status: ' + e.message);
    }
  };

  // Staff assignment helper
  const handleAssignStaff = async (e) => {
    e.preventDefault();
    if (!selectedComplaint || !selectedStaff) return;

    try {
      const staffObj = staffList.find(s => s.name === selectedStaff);
      const timestampStr = new Date().toLocaleString();
      const complaintRef = doc(db, `societies/${societyId}/complaints`, selectedComplaint.id);

      await updateDoc(complaintRef, {
        assignedStaffName: selectedStaff,
        assignedStaffRole: staffObj?.role || 'Staff',
        assignedDate: new Date().toISOString(),
        assignmentNote: assignmentNote,
        status: selectedComplaint.status === 'Open' ? 'Assigned' : selectedComplaint.status,
        timeline: arrayUnion({
          action: `Assigned to ${selectedStaff} (${staffObj?.role || 'Staff'})`,
          user: 'Admin',
          timestamp: timestampStr,
          type: 'assignment',
          note: assignmentNote
        })
      });

      setAssignmentNote('');
      alert(`Assigned successfully to ${selectedStaff}!`);
    } catch (e) {
      alert('Error assigning staff: ' + e.message);
    }
  };

  // Post Comment Helper (Admin <-> Resident Communication)
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedComplaint) return;

    try {
      const timestampStr = new Date().toLocaleString();
      const complaintRef = doc(db, `societies/${societyId}/complaints`, selectedComplaint.id);

      const newComment = {
        id: Date.now().toString(),
        author: 'Admin',
        text: commentText.trim(),
        isInternal: isInternalNote,
        timestamp: timestampStr,
        createdAt: new Date().toISOString()
      };

      await updateDoc(complaintRef, {
        comments: arrayUnion(newComment),
        timeline: arrayUnion({
          action: isInternalNote ? 'Internal Admin Note Added' : 'Admin Response Posted',
          user: 'Admin',
          timestamp: timestampStr,
          type: 'comment'
        })
      });

      // Dispatch resident notification if message is public
      if (!isInternalNote && selectedComplaint.residentUid) {
        await addDoc(collection(db, `societies/${societyId}/users/${selectedComplaint.residentUid}/notifications`), {
          title: `New Response on Complaint #${selectedComplaint.id.substring(0, 7)}`,
          body: `Admin replied: "${commentText.substring(0, 45)}..."`,
          createdAt: new Date().toISOString(),
          isRead: false,
          type: 'complaint'
        });
      }

      setCommentText('');
    } catch (e) {
      alert('Error posting comment: ' + e.message);
    }
  };

  // Filter Logic
  const filteredComplaints = complaints.filter(c => {
    const queryStr = searchQuery.toLowerCase();
    const idMatches = (c.id || '').toLowerCase().includes(queryStr);
    const residentMatches = (c.residentName || '').toLowerCase().includes(queryStr);
    const flatMatches = (c.flatNumber || c.hostFlat || '').toLowerCase().includes(queryStr);
    const categoryMatches = (c.category || '').toLowerCase().includes(queryStr);
    const titleMatches = (c.title || c.description || '').toLowerCase().includes(queryStr);
    const staffMatches = (c.assignedStaffName || '').toLowerCase().includes(queryStr);

    const matchesSearch = idMatches || residentMatches || flatMatches || categoryMatches || titleMatches || staffMatches;

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter || (statusFilter === 'Open' && (!c.status || c.status === 'Pending'));
    const matchesPriority = priorityFilter === 'All' || (c.priority || 'Medium') === priorityFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Calculate Summary Statistics
  const totalCount = complaints.length;
  const openCount = complaints.filter(c => !c.status || c.status === 'Open' || c.status === 'Pending').length;
  const assignedCount = complaints.filter(c => c.status === 'Assigned' || c.assignedStaffName).length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress' || c.status === 'in_progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Completed' || c.status === 'Resolved' || c.status === 'Closed').length;
  const highPriorityCount = complaints.filter(c => c.priority === 'High' || c.priority === 'Critical').length;

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

      {/* 1. Complaint Dashboard Statistics Header */}
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

      {/* 2. Search & Multi-Filter Panel */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search by Ticket ID, Resident, Flat, Title, Staff..."
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

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="var(--text-secondary)" />
            <select 
              className="form-select" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
            >
              <option value="All">Status: All</option>
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed / Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <select 
            className="form-select" 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
          >
            <option value="All">Priority: All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          {/* Category Filter */}
          <select 
            className="form-select" 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
          >
            <option value="All">Category: All</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Lift">Lift & Elevator</option>
            <option value="Security">Security</option>
            <option value="Parking">Parking</option>
            <option value="Water">Water Supply</option>
            <option value="General">General</option>
          </select>

        </div>
      </div>

      {/* 3. Complaint Table / List View */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Society Complaint Register</h3>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Showing {filteredComplaints.length} of {complaints.length} tickets
          </span>
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
                <th>Assigned Staff</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    <ShieldAlert size={36} color="var(--border-color)" style={{ marginBottom: '8px' }} />
                    <div style={{ fontWeight: 600 }}>No complaints match your search or filter parameters.</div>
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => {
                  const isHigh = c.priority === 'High' || c.priority === 'Critical';
                  const isResolved = c.status === 'Completed' || c.status === 'Resolved' || c.status === 'Closed';

                  return (
                    <tr key={c.id}>
                      <td>
                        <code style={{ background: 'var(--bg-color)', padding: '4px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
                          #{c.id.substring(0, 7)}
                        </code>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{c.residentName || 'Resident'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          Flat {c.flatNumber || c.hostFlat || 'N/A'} {c.block ? `(${c.block})` : ''}
                        </div>
                      </td>
                      <td>
                        <span className="badge primary">{c.category || 'General'}</span>
                      </td>
                      <td style={{ maxWidth: '240px' }}>
                        <div style={{ fontWeight: 700, fontSize: '13px' }}>{c.title || 'General Maintenance Issue'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c.description || '-'}
                        </div>
                      </td>
                      <td>
                        <span style={{ 
                          padding: '3px 8px', 
                          borderRadius: '12px', 
                          fontSize: '11px', 
                          fontWeight: 700,
                          backgroundColor: isHigh ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: isHigh ? '#EF4444' : '#D97706'
                        }}>
                          {c.priority || 'Medium'}
                        </span>
                      </td>
                      <td>
                        {c.assignedStaffName ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <UserCheck size={14} color="#10B981" />
                            <span style={{ fontSize: '12px', fontWeight: 600 }}>{c.assignedStaffName}</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', italic: 'true' }}>Unassigned</span>
                        )}
                      </td>
                      <td>
                        <select
                          className="form-select"
                          style={{ 
                            padding: '4px 8px', 
                            fontSize: '11px', 
                            borderRadius: '6px', 
                            fontWeight: 700,
                            color: isResolved ? '#10B981' : '#3B82F6' 
                          }}
                          value={c.status || 'Open'}
                          onChange={(e) => handleUpdateStatus(c.id, e.target.value, c.residentUid)}
                        >
                          <option value="Open">Open</option>
                          <option value="Assigned">Assigned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="On Hold">On Hold</option>
                          <option value="Completed">Completed</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td>
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '4px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => setSelectedComplaint(c)}
                        >
                          Details <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Interactive Complaint Detail Drawer / Modal */}
      {selectedComplaint && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="card" style={{
            width: '100%',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: '16px',
            padding: '0',
            position: 'relative'
          }}>
            
            {/* Modal Header */}
            <div style={{ 
              padding: '20px 24px', 
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', 
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ margin: 0, color: '#ffffff', fontSize: '18px', fontWeight: 800 }}>
                    Complaint Ticket #{selectedComplaint.id.substring(0, 7)}
                  </h3>
                  <span className="badge primary">{selectedComplaint.category || 'General'}</span>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '10px', 
                    fontSize: '10px', 
                    fontWeight: 800, 
                    backgroundColor: 'rgba(239, 68, 68, 0.2)', 
                    color: '#F87171' 
                  }}>
                    {selectedComplaint.priority || 'Medium'} PRIORITY
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94A3B8' }}>
                  Created on {selectedComplaint.createdAt ? new Date(selectedComplaint.createdAt).toLocaleString() : 'Recent'}
                </p>
              </div>

              <button 
                onClick={() => setSelectedComplaint(null)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content Grid */}
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
              
              {/* Left Column: Complaint & Resident Info + Communication */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Resident Metadata */}
                <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Resident Details
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                    <div><strong>Name:</strong> {selectedComplaint.residentName || 'Resident'}</div>
                    <div><strong>Flat:</strong> Flat {selectedComplaint.flatNumber || selectedComplaint.hostFlat || 'N/A'}</div>
                    <div><strong>Mobile:</strong> {selectedComplaint.phone || 'N/A'}</div>
                    <div><strong>Society:</strong> {selectedComplaint.societyName || 'Housing Society'}</div>
                  </div>
                </div>

                {/* Complaint Title & Description */}
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 8px' }}>{selectedComplaint.title || 'General Helpdesk Issue'}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--bg-color)', padding: '14px', borderRadius: '10px' }}>
                    {selectedComplaint.description || 'No additional description provided.'}
                  </p>
                </div>

                {/* Photo Attachments Gallery */}
                {selectedComplaint.photoUrl && (
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Paperclip size={14} /> Attached Photo Documentation
                    </div>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img 
                        src={selectedComplaint.photoUrl} 
                        alt="Complaint Attachment" 
                        style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '10px', cursor: 'pointer', border: '1px solid var(--border-color)' }}
                        onClick={() => setPreviewImage(selectedComplaint.photoUrl)}
                      />
                      <a 
                        href={selectedComplaint.photoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ display: 'block', fontSize: '11px', color: 'var(--primary)', marginTop: '4px' }}
                      >
                        Open Full Image ↗
                      </a>
                    </div>
                  </div>
                )}

                {/* Admin & Resident Communication Thread */}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MessageSquare size={16} /> Communication & Updates Log
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto', marginBottom: '12px', paddingRight: '6px' }}>
                    {(!selectedComplaint.comments || selectedComplaint.comments.length === 0) ? (
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: '16px' }}>
                        No comments recorded yet.
                      </div>
                    ) : (
                      selectedComplaint.comments.map((cmt) => (
                        <div key={cmt.id} style={{ 
                          padding: '10px 12px', 
                          borderRadius: '10px',
                          backgroundColor: cmt.isInternal ? '#FEF3C7' : '#F0F9FF',
                          border: cmt.isInternal ? '1px solid #FDE68A' : '1px solid #BAE6FD'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: cmt.isInternal ? '#92400E' : '#0369A1' }}>
                              {cmt.author} {cmt.isInternal ? '(Internal Note)' : '(Public Update)'}
                            </span>
                            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{cmt.timestamp}</span>
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{cmt.text}</div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Post Comment Form */}
                  <form onSubmit={handlePostComment} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <textarea 
                      placeholder="Type official update or internal admin note..." 
                      rows={2}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '12px', outline: 'none' }}
                    ></textarea>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={isInternalNote} 
                          onChange={(e) => setIsInternalNote(e.target.checked)} 
                        />
                        Internal Admin Note Only
                      </label>

                      <button type="submit" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Send size={14} /> Send Message
                      </button>
                    </div>
                  </form>
                </div>

              </div>

              {/* Right Column: Staff Assignment & Activity Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Staff Assignment Section */}
                <div className="card" style={{ padding: '16px', background: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UserCheck size={16} color="var(--primary)" /> Staff Assignment
                  </div>

                  {selectedComplaint.assignedStaffName && (
                    <div style={{ marginBottom: '12px', padding: '8px 12px', background: '#ECFDF5', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#065F46' }}>Currently Assigned:</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#047857' }}>
                        {selectedComplaint.assignedStaffName} ({selectedComplaint.assignedStaffRole || 'Staff'})
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleAssignStaff} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <select 
                      className="form-select"
                      value={selectedStaff}
                      onChange={(e) => setSelectedStaff(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '12px' }}
                    >
                      <option value="">Select Maintenance Staff...</option>
                      {STAFF_LIST.map(s => (
                        <option key={s.id} value={s.name}>{s.name} ({s.role})</option>
                      ))}
                    </select>

                    <input 
                      type="text" 
                      placeholder="Assignment instructions or notes..."
                      value={assignmentNote}
                      onChange={(e) => setAssignmentNote(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '12px', outline: 'none' }}
                    />

                    <button type="submit" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
                      Assign / Reassign Staff
                    </button>
                  </form>
                </div>

                {/* Activity Timeline Section */}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Activity size={16} /> Ticket Activity Timeline
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: '2px solid var(--border-color)', paddingLeft: '14px', marginLeft: '6px' }}>
                    {(!selectedComplaint.timeline || selectedComplaint.timeline.length === 0) ? (
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        • Ticket created by resident
                      </div>
                    ) : (
                      selectedComplaint.timeline.map((item, idx) => (
                        <div key={idx} style={{ position: 'relative' }}>
                          <div style={{ 
                            position: 'absolute', 
                            left: '-20px', 
                            top: '4px', 
                            width: '10px', 
                            height: '10px', 
                            borderRadius: '50%', 
                            backgroundColor: 'var(--primary)' 
                          }}></div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.action}</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>By {item.user} • {item.timestamp}</div>
                          {item.note && <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Note: {item.note}</div>}
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* Full Screen Image Viewer Modal */}
      {previewImage && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          onClick={() => setPreviewImage(null)}
        >
          <img src={previewImage} alt="Attachment Full Screen" style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px' }} />
        </div>
      )}

    </div>
  );
}
