import React, { useState, useEffect } from 'react';
import { Plus, XCircle, CheckCircle } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getSocietyAdminSession } from '../services/sessionManager';

export default function Parking() {
  const session = getSocietyAdminSession();
  const societyId = session?.societyId || 'SOC-001';

  const [parkingSlots, setParkingSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ slot: '', level: 'Basement 1', number: '', type: 'Car', model: '', color: '', status: 'Active' });

  useEffect(() => {
    const q = query(collection(db, `societies/${societyId}/parking`), orderBy('slot'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setParkingSlots(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [societyId]);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    await updateDoc(doc(db, `societies/${societyId}/parking`, id), { status: newStatus });
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, `societies/${societyId}/parking`), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      setIsModalOpen(false);
      setFormData({ slot: '', level: 'Basement 1', number: '', type: 'Car', model: '', color: '', status: 'Active' });
    } catch (error) {
      alert("Error allocating parking: " + error.message);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading parking allocation...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><Plus size={18} /> Allocate Slot</button>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Parking Allocation</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{parkingSlots.length} total</span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Slot</th>
                <th>Level</th>
                <th>Vehicle Details</th>
                <th>Plate Number</th>
                <th>Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parkingSlots.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No parking slots allocated.</td></tr>
              ) : (
                parkingSlots.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.slot}</strong></td>
                    <td>{p.level}</td>
                    <td>{p.color} {p.model}</td>
                    <td><span style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>{p.number}</span></td>
                    <td>{p.type}</td>
                    <td>
                      <span className={`badge ${p.status === 'Active' ? 'success' : 'danger'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '4px 8px', fontSize: '12px', color: p.status === 'Active' ? 'var(--danger)' : 'var(--success)' }}
                        onClick={() => toggleStatus(p.id, p.status)}
                      >
                        {p.status === 'Active' ? <><XCircle size={14} /> Revoke</> : <><CheckCircle size={14} /> Activate</>}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allocate Parking Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Allocate Parking Slot</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}><XCircle size={20} /></button>
            </div>
            <form onSubmit={handleAllocate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Slot Number</label>
                  <input required type="text" value={formData.slot} onChange={e => setFormData({...formData, slot: e.target.value})} placeholder="e.g. A-101-P1" />
                </div>
                <div className="form-group">
                  <label>Level</label>
                  <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
                    <option value="Basement 1">Basement 1</option>
                    <option value="Basement 2">Basement 2</option>
                    <option value="Ground">Ground Level</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>License Plate</label>
                  <input required type="text" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} placeholder="e.g. MH 12 AB 1234" />
                </div>
                <div className="form-group">
                  <label>Vehicle Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Vehicle Model</label>
                  <input required type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} placeholder="e.g. Honda City" />
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <input required type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} placeholder="e.g. White" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Allocate Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
