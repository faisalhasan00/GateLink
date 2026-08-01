import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Residents() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', flatNumber: '', phone: '', email: '', password: '', role: 'resident' });

  useEffect(() => {
    const q = query(collection(db, 'societies/SOC-001/users'), orderBy('flatNumber'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResidents(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'approved' ? 'suspended' : 'approved';
    await updateDoc(doc(db, `societies/SOC-001/users`, userId), { status: newStatus });
  };

  const handleAddResident = async (e) => {
    e.preventDefault();
    try {
      // In a real app, you'd use Firebase Admin SDK to create the Auth user.
      // Here we just create the Firestore document so it shows up in the app.
      const newId = `manual_${Date.now()}`;
      await setDoc(doc(db, 'societies/SOC-001/users', newId), {
        uid: newId,
        ...formData,
        status: 'approved',
        societyId: 'SOC-001',
        createdAt: new Date().toISOString()
      });
      setIsModalOpen(false);
      setFormData({ name: '', flatNumber: '', phone: '', email: '', password: '', role: 'resident' });
    } catch (error) {
      alert("Error adding resident: " + error.message);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading residents...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><Plus size={18} /> Add Resident</button>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Resident Directory</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{residents.length} total</span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Flat No.</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {residents.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No residents found.</td></tr>
              ) : (
                residents.map((r) => (
                  <tr key={r.id}>
                    <td><strong>{r.flatNumber || '-'}</strong></td>
                    <td>{r.name}</td>
                    <td>{r.phone}</td>
                    <td>
                      <span className={`badge ${r.role === 'guard' ? 'warning' : 'primary'}`}>
                        {r.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${r.status === 'approved' ? 'success' : 'danger'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '4px 8px', fontSize: '12px', color: r.status === 'approved' ? 'var(--danger)' : 'var(--secondary)' }}
                        onClick={() => toggleStatus(r.id, r.status)}
                      >
                        {r.status === 'approved' ? <><XCircle size={14} /> Suspend</> : <><CheckCircle size={14} /> Activate</>}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Resident Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Resident / Staff</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}><XCircle size={20} /></button>
            </div>
            <form onSubmit={handleAddResident}>
              <div className="form-group">
                <label>Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>Flat / Unit Number</label>
                <input required type="text" value={formData.flatNumber} onChange={e => setFormData({...formData, flatNumber: e.target.value})} placeholder="e.g. A-101" />
              </div>
              <div className="form-group">
                <label>Email (Optional)</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
              </div>
              <div className="form-group">
                <label>Initial Password (Optional)</label>
                <input type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="e.g. Welcome#123" />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 9876543210" />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="resident">Resident</option>
                  <option value="guard">Security Guard</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
