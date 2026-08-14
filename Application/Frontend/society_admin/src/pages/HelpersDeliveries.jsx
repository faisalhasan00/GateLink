import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Truck, 
  Search, 
  UserCheck, 
  Package 
} from 'lucide-react';
import { getSocietyAdminSession } from '../services/sessionManager';
import { societyAdminService } from '../services/societyAdminService';

export default function HelpersDeliveries() {
  const session = getSocietyAdminSession();
  const societyId = session?.societyId;

  const [activeTab, setActiveTab] = useState('helpers');
  const [helpers, setHelpers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!societyId) {
      setLoading(false);
      return;
    }

    const unsubHelpers = societyAdminService.subscribeHelpers(
      societyId,
      (data) => {
        setHelpers(data);
        setLoading(false);
      },
      (err) => console.error('Error fetching helpers:', err)
    );

    const unsubDeliveries = societyAdminService.subscribeVisitors(
      societyId,
      (data) => {
        const deliv = data.filter(v => v.type === 'Delivery' || v.type === 'Cab' || v.company);
        setDeliveries(deliv);
      },
      (err) => console.error('Error fetching deliveries:', err)
    );

    return () => {
      if (unsubHelpers) unsubHelpers();
      if (unsubDeliveries) unsubDeliveries();
    };
  }, [societyId]);

  const filteredHelpers = helpers.filter(h => {
    const q = searchQuery.toLowerCase();
    return (h.name || '').toLowerCase().includes(q) ||
           (h.phone || '').toLowerCase().includes(q) ||
           (h.flatNumber || '').toLowerCase().includes(q);
  });

  const filteredDeliveries = deliveries.filter(d => {
    const q = searchQuery.toLowerCase();
    return (d.name || '').toLowerCase().includes(q) ||
           (d.company || '').toLowerCase().includes(q) ||
           (d.hostFlat || '').toLowerCase().includes(q);
  });

  if (loading) return <div style={{ padding: '32px', textAlign: 'center' }}>Loading Helpers & Deliveries...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)' }}>
            <Users size={22} color="var(--primary)" />
          </div>
          <div className="stat-info">
            <p>Registered Helpers</p>
            <h3>{helpers.length}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
            <UserCheck size={22} color="#10B981" />
          </div>
          <div className="stat-info">
            <p>Active Verified Helpers</p>
            <h3>{helpers.filter(h => h.status === 'Active' || h.status === 'active').length}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--secondary-light)' }}>
            <Truck size={22} color="var(--secondary)" />
          </div>
          <div className="stat-info">
            <p>Total Deliveries Today</p>
            <h3>{deliveries.length}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--warning-light)' }}>
            <Package size={22} color="var(--warning)" />
          </div>
          <div className="stat-info">
            <p>Active Inside Society</p>
            <h3>{deliveries.filter(d => d.status === 'inside' || d.status === 'approved').length}</h3>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className={`btn ${activeTab === 'helpers' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('helpers')}>
              Helpers ({helpers.length})
            </button>
            <button className={`btn ${activeTab === 'deliveries' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('deliveries')}>
              Deliveries ({deliveries.length})
            </button>
          </div>
          <input 
            type="text" 
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', width: '240px' }}
          />
        </div>
      </div>

      {activeTab === 'helpers' ? (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Helper Name</th>
                  <th>Category</th>
                  <th>Contact Number</th>
                  <th>Resident & Flat</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredHelpers.map((h) => (
                  <tr key={h.id}>
                    <td><strong>{h.name}</strong></td>
                    <td><span className="badge primary">{h.type || 'Maid'}</span></td>
                    <td>{h.phone}</td>
                    <td>{h.residentName} (Flat {h.flatNumber})</td>
                    <td><span className="badge success">{h.status || 'Active'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Delivery Partner</th>
                  <th>Executive Name</th>
                  <th>Target Flat</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map((d) => (
                  <tr key={d.id}>
                    <td><span className="badge warning">{d.company || 'Delivery'}</span></td>
                    <td><strong>{d.name}</strong></td>
                    <td>Flat {d.hostFlat || 'N/A'}</td>
                    <td><span className="badge success">{d.status || 'INSIDE'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
