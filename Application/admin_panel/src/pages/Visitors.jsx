import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export default function Visitors() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'societies/SOC-001/visitors'),
      orderBy('entryTime', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVisitors(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatTime = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading visitor logs...</div>;

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Live Visitor Logs</h3>
          <span className="badge success" style={{ fontSize: '12px' }}>
            {visitors.filter(v => v.status === 'inside').length} Currently Inside
          </span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Visitor Name</th>
                <th>Type</th>
                <th>Host Flat</th>
                <th>Entry Time</th>
                <th>Exit Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visitors.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No visitors today.</td></tr>
              ) : (
                visitors.map((v) => (
                  <tr key={v.id}>
                    <td><strong>{v.name}</strong></td>
                    <td>{v.type}</td>
                    <td>{v.hostFlat}</td>
                    <td>{formatTime(v.entryTime)}</td>
                    <td>{formatTime(v.exitTime)}</td>
                    <td>
                      <span className={`badge ${v.status === 'inside' ? 'success' : 'primary'}`}>
                        {v.status}
                      </span>
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
