import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, XCircle, Copy, Check, Trash2 } from 'lucide-react';
import { collection, onSnapshot, query, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function SocietyManagement() {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    city: '', 
    flats: '', 
    president: '', 
    phone: '', 
    email: '',
    password: '',
    mrr: '10000' 
  });

  useEffect(() => {
    const q = query(collection(db, 'societies'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSocieties(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    await updateDoc(doc(db, 'societies', id), { status: newStatus });
  };

  const handleDeleteSociety = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete ${name} (${id})?`)) {
      await deleteDoc(doc(db, 'societies', id));
    }
  };

  const handleOnboard = async (e) => {
    e.preventDefault();
    try {
      const count = societies.length + 1;
      const id = `SOC-00${count}`;
      const code = `${formData.name.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const cleanName = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const adminEmail = formData.email ? formData.email.trim().toLowerCase() : `admin@${cleanName}.com`;
      const tempPassword = formData.password ? formData.password : `${formData.name.substring(0, 3).toUpperCase()}#${Math.floor(1000 + Math.random() * 9000)}`;

      await setDoc(doc(db, 'societies', id), {
        id,
        ...formData,
        code,
        adminEmail,
        status: 'Active',
        flats: Number(formData.flats),
        mrr: Number(formData.mrr),
        createdAt: new Date().toISOString()
      });

      setCreatedCredentials({
        societyName: formData.name,
        societyId: id,
        accessCode: code,
        adminEmail,
        tempPassword
      });

      setShowModal(false);
      setFormData({ name: '', city: '', flats: '', president: '', phone: '', email: '', password: '', mrr: '10000' });
    } catch (err) {
      alert("Error onboarding society: " + err.message);
    }
  };

  const handleCopyCredentials = () => {
    if (!createdCredentials) return;
    const text = `🏢 Society Sphere Credentials
Society: ${createdCredentials.societyName}
Society ID: ${createdCredentials.societyId}
Access Code: ${createdCredentials.accessCode}
Admin Email: ${createdCredentials.adminEmail}
Temp Password: ${createdCredentials.tempPassword}
Portal Link: http://localhost:3000/login`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading societies...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2>Manage Onboarded Societies</h2>
          <p>Generate access codes and control software licenses.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Onboard New Society
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Society ID</th>
                <th>Society Name</th>
                <th>President / Manager</th>
                <th>Admin Email</th>
                <th>Access Code</th>
                <th>Monthly Fee</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {societies.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No societies onboarded. Click "Onboard New Society".</td></tr>
              ) : (
                societies.map((soc) => (
                  <tr key={soc.id}>
                    <td><code>{soc.id}</code></td>
                    <td>
                      <strong>{soc.name}</strong>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{soc.city}</div>
                    </td>
                    <td>
                      <div>{soc.president}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{soc.phone}</div>
                    </td>
                    <td><span style={{ fontSize: '13px' }}>{soc.adminEmail || 'admin@society.com'}</span></td>
                    <td>
                      <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '6px 10px', borderRadius: '6px', fontWeight: 700, fontFamily: 'monospace' }}>
                        {soc.code}
                      </span>
                    </td>
                    <td><strong>₹{Number(soc.mrr || 0).toLocaleString()}</strong></td>
                    <td>
                      <span className={`badge ${soc.status === 'Active' ? 'success' : 'danger'}`}>
                        {soc.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '4px 8px', fontSize: '12px', color: soc.status === 'Suspended' ? 'var(--secondary)' : 'var(--warning)' }}
                          onClick={() => toggleStatus(soc.id, soc.status)}
                        >
                          {soc.status === 'Suspended' ? <><CheckCircle size={14} /> Activate</> : <><XCircle size={14} /> Suspend</>}
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '4px 8px', fontSize: '12px', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                          onClick={() => handleDeleteSociety(soc.id, soc.name)}
                          title="Delete Society"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Onboard New Society */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Onboard New Society</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}><XCircle size={20} /></button>
            </div>
            <form onSubmit={handleOnboard}>
              <div className="form-group">
                <label>Society Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Skyline Towers" />
              </div>
              <div className="form-group">
                <label>City</label>
                <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="e.g. Mumbai" />
              </div>
              <div className="form-group">
                <label>Total Number of Flats</label>
                <input required type="number" value={formData.flats} onChange={e => setFormData({...formData, flats: e.target.value})} placeholder="200" />
              </div>
              <div className="form-group">
                <label>President / Manager Name</label>
                <input required type="text" value={formData.president} onChange={e => setFormData({...formData, president: e.target.value})} placeholder="e.g. Rajesh Malhotra" />
              </div>
              <div className="form-group">
                <label>Admin Login Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="admin@skylinetowers.com" />
              </div>
              <div className="form-group">
                <label>Admin Password (Optional - auto-generated if empty)</label>
                <input type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="e.g. Skyline#2026" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 98201 12345" />
              </div>
              <div className="form-group">
                <label>Monthly Subscription Fee (₹)</label>
                <input required type="number" value={formData.mrr} onChange={e => setFormData({...formData, mrr: e.target.value})} placeholder="10000" />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Generate Credentials & Onboard</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Credentials Receipt Card */}
      {createdCredentials && (
        <div className="modal-overlay" onClick={() => setCreatedCredentials(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', background: 'var(--secondary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--secondary)' }}>
              <CheckCircle size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Society Successfully Onboarded!</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Send these generated login credentials to the Society Admin.
            </p>

            <div style={{ background: '#F9FAFB', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', marginBottom: '20px' }}>
              <div><strong>Society:</strong> {createdCredentials.societyName}</div>
              <div><strong>Society ID:</strong> <code>{createdCredentials.societyId}</code></div>
              <div><strong>Access Code:</strong> <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>{createdCredentials.accessCode}</span></div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}><strong>Admin Login Email:</strong> <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{createdCredentials.adminEmail}</span></div>
              <div><strong>Temporary Password:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{createdCredentials.tempPassword}</span></div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-outline" 
                style={{ flex: 1 }}
                onClick={handleCopyCredentials}
              >
                {copied ? <><Check size={16} color="var(--secondary)" /> Copied!</> : <><Copy size={16} /> Copy Credentials</>}
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }} 
                onClick={() => setCreatedCredentials(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
