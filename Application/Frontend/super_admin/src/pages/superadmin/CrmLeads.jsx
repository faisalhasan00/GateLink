import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Phone, Mail, MapPin, Building, Calendar, XCircle, Trash2, Tag, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

export default function CrmLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    societyName: '',
    city: '',
    flatCount: '100-250',
    status: 'New'
  });

  const stages = ['New', 'Contacted', 'Demo Scheduled', 'Proposal Sent', 'Closed Won', 'Lost'];

  // Subscribe to real-time Firebase Firestore leads collection
  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || data.fullName || 'Anonymous Lead',
          phone: data.phone || 'N/A',
          email: data.email || 'N/A',
          societyName: data.societyName || data.society || 'N/A',
          city: data.city || 'N/A',
          flatCount: data.flatCount || data.flats || 'N/A',
          source: data.source || 'Website Form',
          reason: data.reason || '',
          selectedModules: data.selectedModules || [],
          status: data.status || 'New',
          createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString() : 'Just now'
        };
      });
      setLeads(docs);
      setLoading(false);
    }, (err) => {
      console.error('Real-time leads listener error:', err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Update Lead Status Stage in Firebase
  const handleStageChange = async (leadId, newStatus) => {
    try {
      await updateDoc(doc(db, 'leads', leadId), { status: newStatus });
    } catch (err) {
      console.error('Failed to update lead status:', err);
      alert('Could not update lead status.');
    }
  };

  // Delete Lead from Firebase
  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await deleteDoc(doc(db, 'leads', leadId));
    } catch (err) {
      console.error('Failed to delete lead:', err);
      alert('Could not delete lead.');
    }
  };

  // Manually Add New Lead
  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        source: 'Manual Super Admin Entry',
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setFormData({ name: '', phone: '', email: '', societyName: '', city: '', flatCount: '100-250', status: 'New' });
    } catch (err) {
      console.error('Failed to add manual lead:', err);
      alert('Failed to add lead.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>Sales CRM & Real-Time Inbound Leads</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>
            Live leads submitted via website enrollment forms, proposal builder, and demo requests.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Sales Lead
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading real-time leads from Firebase...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'start' }}>
          {stages.map((stage) => {
            const stageLeads = leads.filter(item => item.status === stage);
            return (
              <div key={stage} style={{ background: '#F8FAFC', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stage}</h4>
                  <span className="badge primary" style={{ fontSize: '11px', fontWeight: 900, borderRadius: '12px', padding: '2px 8px' }}>
                    {stageLeads.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', minHeight: '120px' }}>
                  {stageLeads.length === 0 ? (
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: '30px 0', fontStyle: 'italic' }}>
                      No leads in {stage}
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div key={lead.id} className="card" style={{ padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <div style={{ fontWeight: 900, fontSize: '15px', color: 'var(--text-primary)' }}>{lead.name}</div>
                            {lead.societyName !== 'N/A' && (
                              <div style={{ fontSize: '13px', fontWeight: 700, color: '#00B589', marginTop: '2px' }}>
                                🏛️ {lead.societyName} {lead.city !== 'N/A' ? `(${lead.city})` : ''}
                              </div>
                            )}
                          </div>
                          <button onClick={() => handleDeleteLead(lead.id)} aria-label="Delete Lead" style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '2px' }}>
                            <Trash2 size={15} />
                          </button>
                        </div>

                        {/* Details Badges */}
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px', margin: '10px 0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Phone size={13} color="#00B589" />
                            <a href={`tel:${lead.phone}`} style={{ fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none' }}>
                              {lead.phone}
                            </a>
                          </div>
                          {lead.email !== 'N/A' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Mail size={13} color="#3B82F6" />
                              <a href={`mailto:${lead.email}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                                {lead.email}
                              </a>
                            </div>
                          )}
                          {lead.flatCount !== 'N/A' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Building size={13} color="#6366F1" />
                              <span>{lead.flatCount} Flats</span>
                            </div>
                          )}
                        </div>

                        {/* Source Badge & Modules */}
                        <div style={{ padding: '8px', background: '#F1F5F9', borderRadius: '4px', fontSize: '11px', color: '#475569', marginBottom: '12px' }}>
                          <div style={{ fontWeight: 700, color: '#0F172A' }}>Source: {lead.source}</div>
                          {lead.reason && <div>Reason: {lead.reason}</div>}
                          {lead.selectedModules.length > 0 && (
                            <div style={{ marginTop: '4px', fontStyle: 'italic' }}>
                              Modules: {lead.selectedModules.join(', ')}
                            </div>
                          )}
                          <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '4px' }}>
                            ⏰ {lead.createdAt}
                          </div>
                        </div>

                        {/* Move Stage Selector Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>Stage:</span>
                          <select
                            value={lead.status}
                            onChange={(e) => handleStageChange(lead.id, e.target.value)}
                            style={{
                              flex: 1,
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: '1px solid #CBD5E1',
                              fontSize: '12px',
                              fontWeight: 700,
                              background: '#FFFFFF',
                              color: '#0F172A',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            {stages.map(stg => (
                              <option key={stg} value={stg}>{stg}</option>
                            ))}
                          </select>
                        </div>

                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual Add Lead Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', width: '100%', padding: '28px' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontWeight: 900 }}>Add Sales Lead</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleAddLead} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 700, marginBottom: '4px', display: 'block' }}>Full Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Vikram Mehta" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 700, marginBottom: '4px', display: 'block' }}>Phone Number *</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 99887 11223" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 700, marginBottom: '4px', display: 'block' }}>Email Address</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="vikram@example.com" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 700, marginBottom: '4px', display: 'block' }}>Society Name</label>
                <input type="text" value={formData.societyName} onChange={e => setFormData({...formData, societyName: e.target.value})} placeholder="e.g. Emerald Heights" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 700, marginBottom: '4px', display: 'block' }}>City</label>
                <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="e.g. Hyderabad" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
