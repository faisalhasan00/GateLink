import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import { collection, onSnapshot, query, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Amenities() {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', capacity: 10, timings: '', status: 'Available' });

  useEffect(() => {
    const q = query(collection(db, 'societies/SOC-001/amenities'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAmenities(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Available' ? 'Closed' : 'Available';
    await updateDoc(doc(db, `societies/SOC-001/amenities`, id), { status: newStatus });
  };

  const handleAddAmenity = async (e) => {
    e.preventDefault();
    try {
      const newId = formData.name.toLowerCase().replace(/\s+/g, '_');
      await setDoc(doc(db, 'societies/SOC-001/amenities', newId), {
        ...formData,
        capacity: Number(formData.capacity),
        icon: 'waves', // Default icon for now
        createdAt: new Date().toISOString()
      });
      setIsModalOpen(false);
      setFormData({ name: '', description: '', capacity: 10, timings: '', status: 'Available' });
    } catch (error) {
      alert("Error adding amenity: " + error.message);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading amenities...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><Plus size={18} /> Add Amenity</button>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Society Amenities</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{amenities.length} total</span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Capacity</th>
                <th>Timings</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {amenities.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No amenities found.</td></tr>
              ) : (
                amenities.map((a) => (
                  <tr key={a.id}>
                    <td><strong>{a.name}</strong></td>
                    <td><span style={{ maxWidth: '200px', display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.description}</span></td>
                    <td>{a.capacity}</td>
                    <td>{a.timings}</td>
                    <td>
                      <span className={`badge ${a.status === 'Available' ? 'success' : 'danger'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '4px 8px', fontSize: '12px', color: a.status === 'Available' ? 'var(--danger)' : 'var(--secondary)' }}
                        onClick={() => toggleStatus(a.id, a.status)}
                      >
                        {a.status === 'Available' ? <><XCircle size={14} /> Close</> : <><CheckCircle size={14} /> Open</>}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Amenity Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Amenity</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}><XCircle size={20} /></button>
            </div>
            <form onSubmit={handleAddAmenity}>
              <div className="form-group">
                <label>Amenity Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Swimming Pool" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input required type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Main pool area" />
              </div>
              <div className="form-group">
                <label>Capacity (Max people)</label>
                <input required type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} min="1" />
              </div>
              <div className="form-group">
                <label>Timings</label>
                <input required type="text" value={formData.timings} onChange={e => setFormData({...formData, timings: e.target.value})} placeholder="6:00 AM - 10:00 PM" />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Amenity</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
