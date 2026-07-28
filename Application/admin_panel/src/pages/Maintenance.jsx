import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, addDoc, getDocs, writeBatch, where } from 'firebase/firestore';
import { db } from '../firebase';

export default function Maintenance() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', amount: '', dueDate: '', month: '', status: 'pending' });

  const [isIssuing, setIsIssuing] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'societies/SOC-001/maintenance_bills'), orderBy('dueDate', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBills(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const markAsPaid = async (id) => {
    await updateDoc(doc(db, `societies/SOC-001/maintenance_bills`, id), { status: 'paid' });
  };

  const handleIssueBill = async (e) => {
    e.preventDefault();
    setIsIssuing(true);
    try {
      // 1. Fetch all residents
      const usersRef = collection(db, 'societies/SOC-001/users');
      const q = query(usersRef, where('role', '==', 'resident'));
      const snapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      const billsRef = collection(db, 'societies/SOC-001/maintenance_bills');
      
      let count = 0;
      snapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        const newBillRef = doc(billsRef); // auto-generate ID
        batch.set(newBillRef, {
          ...formData,
          amount: Number(formData.amount),
          residentUid: userDoc.id,
          residentName: userData.name || 'Unknown',
          flatNumber: userData.flatNumber || 'Unknown',
          createdAt: new Date().toISOString()
        });
        count++;
      });
      
      if (count > 0) {
        await batch.commit();
        alert(`Successfully issued bills to ${count} residents.`);
      } else {
        alert("No residents found to issue bills to.");
      }
      
      setIsIssuing(false);
      setIsModalOpen(false);
      setFormData({ title: '', amount: '', dueDate: '', month: '', status: 'pending' });
    } catch (error) {
      setIsIssuing(false);
      alert("Error issuing bill: " + error.message);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading maintenance bills...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><Plus size={18} /> Issue Bill</button>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Maintenance Bills</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{bills.length} total</span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Resident</th>
                <th>Flat</th>
                <th>Month</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bills.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No bills found.</td></tr>
              ) : (
                bills.map((b) => (
                  <tr key={b.id}>
                    <td><strong>{b.title}</strong></td>
                    <td>{b.residentName}</td>
                    <td>{b.flatNumber}</td>
                    <td>{b.month}</td>
                    <td>₹{b.amount}</td>
                    <td>{b.dueDate}</td>
                    <td>
                      <span className={`badge ${b.status === 'paid' ? 'success' : 'warning'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {b.status === 'pending' ? (
                        <button
                          className="btn btn-outline"
                          style={{ padding: '4px 8px', fontSize: '12px', color: 'var(--success)' }}
                          onClick={() => markAsPaid(b.id)}
                        >
                          <CheckCircle size={14} /> Mark Paid
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Settled</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Bill Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Issue Maintenance Bill</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}><XCircle size={20} /></button>
            </div>
            <form onSubmit={handleIssueBill}>
              <div className="form-group">
                <label>Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. July Maintenance" />
              </div>
              <div className="form-group">
                <label>Month</label>
                <input required type="text" value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} placeholder="e.g. July 2026" />
              </div>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} min="1" />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input required type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)} disabled={isIssuing}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isIssuing}>
                  {isIssuing ? 'Issuing...' : 'Issue to All Residents'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
