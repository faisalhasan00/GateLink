
import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, XCircle, Copy, Check, Trash2, Building2 } from 'lucide-react';
import { collection, onSnapshot, query, doc, updateDoc, deleteDoc, getDocs, where } from 'firebase/firestore';
import { db } from '../../firebase';
import SocietyOnboardingWizard from '../../components/superadmin/SocietyOnboardingWizard';

export default function SocietyManagement() {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);
  const [selectedSocietyDetails, setSelectedSocietyDetails] = useState(null);

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

  const handleUpdatePlan = async (id, newPlan) => {
    try {
      const mrrMap = { Trial: 0, Standard: 5000, Premium: 10000, Enterprise: 25000 };
      await updateDoc(doc(db, 'societies', id), {
        plan: newPlan,
        mrr: mrrMap[newPlan] || 10000
      });
      alert(`Updated subscription plan to ${newPlan}!`);
    } catch (e) {
      alert('Error updating subscription plan: ' + e.message);
    }
  };

  const handleDeleteSociety = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete society "${name}" (ID: ${id})?\n\nThis action cannot be undone and will purge all associated residents, staff, and records.`)) {
      return;
    }

    try {
      // 1. Delete all nested subcollection documents
      const subcollections = [
        'users', 'staff', 'visitors', 'complaints', 'notices', 
        'maintenance', 'amenities', 'documents', 'helpers', 
        'sos_alerts', 'user_sessions', 'roles'
      ];

      for (const sub of subcollections) {
        try {
          const subSnap = await getDocs(collection(db, `societies/${id}/${sub}`));
          const deletePromises = subSnap.docs.map(document => deleteDoc(doc(db, `societies/${id}/${sub}`, document.id)));
          await Promise.all(deletePromises);
        } catch (subErr) {
          console.warn(`Subcollection cleanup notice for ${sub}:`, subErr);
        }
      }

      // 2. Delete top-level user documents associated with this society
      try {
        const topUsersSnap = await getDocs(query(collection(db, 'users'), where('societyId', '==', id)));
        const topUserDeletes = topUsersSnap.docs.map(uDoc => deleteDoc(doc(db, 'users', uDoc.id)));
        await Promise.all(topUserDeletes);
      } catch (topErr) {
        console.warn('Top-level user cleanup notice:', topErr);
      }

      // 2. Delete top-level society document
      await deleteDoc(doc(db, 'societies', id));
      alert(`Successfully deleted society "${name}" (${id})!`);
    } catch (e) {
      console.error('Error deleting society:', e);
      alert('Error deleting society: ' + e.message);
    }
  };

  const handleWizardSuccess = (credentials) => {
    setShowWizard(false);
    setCreatedCredentials(credentials);
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
          <p>Generate access codes, manage structure, and control software licenses.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowWizard(true)}>
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
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No societies onboarded yet. Click "Onboard New Society".</td></tr>
              ) : (
                societies.map((soc) => (
                  <tr key={soc.id}>
                    <td><code>{soc.id}</code></td>
                    <td>
                      <strong>{soc.name}</strong>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{soc.city} {soc.type ? `• ${soc.type}` : ''}</div>
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
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                          onClick={() => setSelectedSocietyDetails(soc)}
                        >
                          Details
                        </button>
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

      {/* Production-Grade Multi-Step Onboarding Wizard */}
      <SocietyOnboardingWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        existingSocieties={societies}
        onSuccess={handleWizardSuccess}
      />

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

      {/* Modal: Full Society Details & Plan Management */}
      {selectedSocietyDetails && (
        <div className="modal-overlay" onClick={() => setSelectedSocietyDetails(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>Society Profile & Plan Management</h3>
              <button className="btn-icon" onClick={() => setSelectedSocietyDetails(null)}><XCircle size={20} /></button>
            </div>

            <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{selectedSocietyDetails.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ID: <code>{selectedSocietyDetails.id}</code> • Code: <strong>{selectedSocietyDetails.code}</strong></div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>City: {selectedSocietyDetails.city || 'Mumbai'} • Type: {selectedSocietyDetails.type || 'Apartment'}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                <div><strong>President:</strong> {selectedSocietyDetails.president || 'Management Committee'}</div>
                <div><strong>Admin Email:</strong> {selectedSocietyDetails.adminEmail || 'admin@society.com'}</div>
                <div><strong>Total Flats:</strong> {selectedSocietyDetails.flats || 100}</div>
                <div><strong>Monthly Revenue:</strong> ₹{Number(selectedSocietyDetails.mrr || 10000).toLocaleString()}</div>
              </div>

              {/* Upgrade / Downgrade Subscription Plan */}
              <div style={{ background: 'var(--bg-color)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  CHANGE SUBSCRIPTION PLAN
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Trial', 'Standard', 'Premium', 'Enterprise'].map(plan => (
                    <button
                      key={plan}
                      className={`btn ${selectedSocietyDetails.plan === plan ? 'btn-primary' : 'btn-outline'}`}
                      style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: 700 }}
                      onClick={() => {
                        handleUpdatePlan(selectedSocietyDetails.id, plan);
                        setSelectedSocietyDetails(prev => ({ ...prev, plan: plan }));
                      }}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button className="btn btn-primary" onClick={() => setSelectedSocietyDetails(null)}>
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
