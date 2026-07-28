import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Truck, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building2, 
  Phone, 
  ShieldAlert, 
  Layers, 
  Plus, 
  UserCheck, 
  Package, 
  ArrowUpRight, 
  ArrowDownLeft 
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '../firebase';

export default function HelpersDeliveries() {
  const [activeTab, setActiveTab] = useState('helpers'); // 'helpers' or 'deliveries'
  const [helpers, setHelpers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    // 1. Fetch Domestic Helpers Stream
    const qHelpers = query(collection(db, 'societies/SOC-001/helpers'), orderBy('createdAt', 'desc'));
    const unsubHelpers = onSnapshot(qHelpers, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHelpers(data);
      setLoading(false);
    });

    // 2. Fetch Deliveries Stream
    const qDeliveries = query(collection(db, 'societies/SOC-001/visitors'), orderBy('createdAt', 'desc'));
    const unsubDeliveries = onSnapshot(qDeliveries, (snap) => {
      const data = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(v => v.type === 'Delivery' || v.type === 'Cab' || v.company);
      setDeliveries(data);
    });

    return () => {
      unsubHelpers();
      unsubDeliveries();
    };
  }, []);

  const handleToggleHelperStatus = async (helperObj) => {
    const newStatus = helperObj.status === 'Active' ? 'Suspended' : 'Active';
    try {
      await updateDoc(doc(db, 'societies/SOC-001/helpers', helperObj.id), { status: newStatus });
      alert(`Helper ${helperObj.name} status updated to ${newStatus}.`);
    } catch (e) {
      alert('Error updating status: ' + e.message);
    }
  };

  // Filter Logic for Helpers
  const filteredHelpers = helpers.filter(h => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = (h.name || '').toLowerCase().includes(q) ||
                          (h.phone || '').toLowerCase().includes(q) ||
                          (h.flatNumber || '').toLowerCase().includes(q) ||
                          (h.residentName || '').toLowerCase().includes(q);

    const matchesType = typeFilter === 'All' || h.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || h.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Filter Logic for Deliveries
  const filteredDeliveries = deliveries.filter(d => {
    const q = searchQuery.toLowerCase();
    return (d.name || '').toLowerCase().includes(q) ||
           (d.company || '').toLowerCase().includes(q) ||
           (d.hostFlat || '').toLowerCase().includes(q) ||
           (d.phone || '').toLowerCase().includes(q);
  });

  // Counters
  const totalHelpers = helpers.length;
  const activeHelpers = helpers.filter(h => h.status === 'Active').length;
  const totalDeliveries = deliveries.length;
  const insideDeliveries = deliveries.filter(d => d.status === 'checked_in' || d.status === 'approved').length;

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

      {/* 1. Statistics Grid */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)' }}>
            <Users size={22} color="var(--primary)" />
          </div>
          <div className="stat-info">
            <p>Registered Helpers</p>
            <h3>{totalHelpers}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
            <UserCheck size={22} color="#10B981" />
          </div>
          <div className="stat-info">
            <p>Active Verified Helpers</p>
            <h3>{activeHelpers}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--secondary-light)' }}>
            <Truck size={22} color="var(--secondary)" />
          </div>
          <div className="stat-info">
            <p>Total Deliveries Today</p>
            <h3>{totalDeliveries}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--warning-light)' }}>
            <Package size={22} color="var(--warning)" />
          </div>
          <div className="stat-info">
            <p>Active Inside Society</p>
            <h3>{insideDeliveries}</h3>
          </div>
        </div>
      </div>

      {/* 2. Mode Selector & Control Panel */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-color)', padding: '4px', borderRadius: '8px' }}>
            <button
              className={`btn ${activeTab === 'helpers' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '6px 14px', fontSize: '13px', border: 'none' }}
              onClick={() => setActiveTab('helpers')}
            >
              <Users size={15} style={{ display: 'inline', marginRight: 4 }} /> Domestic Helpers ({helpers.length})
            </button>
            <button
              className={`btn ${activeTab === 'deliveries' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '6px 14px', fontSize: '13px', border: 'none' }}
              onClick={() => setActiveTab('deliveries')}
            >
              <Truck size={15} style={{ display: 'inline', marginRight: 4 }} /> Delivery Passes ({deliveries.length})
            </button>
          </div>

          {/* Search & Filter */}
          <div style={{ display: 'flex', gap: '12px', flex: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={18} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder={activeTab === 'helpers' ? "Search Name, Phone, Flat..." : "Search Partner, Executive, Flat..."}
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
          </div>

        </div>
      </div>

      {/* 3. Register Tables */}
      {activeTab === 'helpers' ? (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Registered Domestic Helpers Directory</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Showing {filteredHelpers.length} of {helpers.length} personnel
            </span>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Helper Name</th>
                  <th>Category</th>
                  <th>Contact Number</th>
                  <th>Resident & Flat</th>
                  <th>Govt ID Verification</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHelpers.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                      <Users size={36} color="var(--border-color)" style={{ marginBottom: '8px' }} />
                      <div style={{ fontWeight: 600 }}>No domestic helpers found matching your search.</div>
                    </td>
                  </tr>
                ) : (
                  filteredHelpers.map((h) => {
                    const isActive = h.status === 'Active';

                    return (
                      <tr key={h.id}>
                        <td>
                          <div style={{ fontWeight: 700 }}>{h.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{h.workingDays || 'Mon - Sat'}</div>
                        </td>
                        <td>
                          <span className="badge primary">{h.type || 'Maid'}</span>
                        </td>
                        <td>
                          <div style={{ fontSize: '13px', fontWeight: 600 }}>{h.phone}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{h.residentName || 'Resident'}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Flat {h.flatNumber || 'N/A'}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '12px', fontWeight: 600 }}>{h.govtIdType || 'Aadhaar'}</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{h.govtIdNumber || 'Verified'}</div>
                        </td>
                        <td>
                          <span className={`badge ${isActive ? 'success' : 'danger'}`}>
                            {h.status || 'Active'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '4px 8px', fontSize: '11px', color: isActive ? 'var(--danger)' : 'var(--secondary)' }}
                            onClick={() => handleToggleHelperStatus(h)}
                          >
                            {isActive ? 'Suspend' : 'Activate'}
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
      ) : (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Delivery Personnel Entry Register</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Showing {filteredDeliveries.length} entries
            </span>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Delivery Partner</th>
                  <th>Executive Name</th>
                  <th>Contact</th>
                  <th>Target Flat</th>
                  <th>Entry Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                      <Truck size={36} color="var(--border-color)" style={{ marginBottom: '8px' }} />
                      <div style={{ fontWeight: 600 }}>No delivery personnel records found.</div>
                    </td>
                  </tr>
                ) : (
                  filteredDeliveries.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <span className="badge warning" style={{ fontWeight: 800 }}>{d.company || 'Delivery'}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{d.name}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '12px', fontWeight: 600 }}>{d.phone || 'N/A'}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{d.hostFlat || 'Tower A-101'}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '12px' }}>{d.entryTime ? new Date(d.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}</div>
                      </td>
                      <td>
                        <span className={`badge ${d.status === 'checked_out' ? 'secondary' : 'success'}`}>
                          {d.status === 'checked_out' ? 'EXITED' : 'INSIDE'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
