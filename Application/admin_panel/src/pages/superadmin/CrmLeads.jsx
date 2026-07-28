import React, { useState } from 'react';
import { Plus, Phone, ArrowRight, XCircle } from 'lucide-react';

export default function CrmLeads() {
  const [pipeline, setPipeline] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ society: '', city: '', contact: '', phone: '', flats: '', stage: 'Prospect' });

  const stages = ['Prospect', 'Demo Scheduled', 'Proposal Sent', 'Closed Won'];

  const handleAddLead = (e) => {
    e.preventDefault();
    setPipeline([...pipeline, { id: Date.now(), ...formData }]);
    setIsModalOpen(false);
    setFormData({ society: '', city: '', contact: '', phone: '', flats: '', stage: 'Prospect' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2>Sales CRM & Society Leads</h2>
          <p>Track potential clients from first call to closed deal.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add Sales Lead
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {stages.map((stage) => {
          const stageLeads = pipeline.filter(item => item.stage === stage);
          return (
            <div key={stage} style={{ background: '#F9FAFB', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700 }}>{stage}</h4>
                <span className="badge primary" style={{ fontSize: '11px' }}>
                  {stageLeads.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '100px' }}>
                {stageLeads.length === 0 ? (
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: '20px 0' }}>
                    No leads in this stage
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div key={lead.id} className="card" style={{ padding: '16px', background: 'white' }}>
                      <div style={{ fontWeight: 700, marginBottom: '4px' }}>{lead.society}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{lead.city} • {lead.flats} Flats</div>
                      
                      <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <Phone size={12} color="var(--text-secondary)" /> {lead.contact} ({lead.phone})
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Sales Lead</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}><XCircle size={20} /></button>
            </div>
            <form onSubmit={handleAddLead}>
              <div className="form-group">
                <label>Society Name</label>
                <input required type="text" value={formData.society} onChange={e => setFormData({...formData, society: e.target.value})} placeholder="e.g. Emerald Heights" />
              </div>
              <div className="form-group">
                <label>City</label>
                <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="e.g. Mumbai" />
              </div>
              <div className="form-group">
                <label>Contact Person</label>
                <input required type="text" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} placeholder="e.g. Vikram Mehta" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 99887 11223" />
              </div>
              <div className="form-group">
                <label>Total Flats</label>
                <input required type="number" value={formData.flats} onChange={e => setFormData({...formData, flats: e.target.value})} placeholder="180" />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
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
