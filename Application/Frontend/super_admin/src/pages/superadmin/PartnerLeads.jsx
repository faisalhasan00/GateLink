import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, addDoc, setDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Handshake, Plus, Sliders, Phone, Mail, Building, CheckCircle2, DollarSign, Search, Trash2, ArrowRight, ShieldCheck, X, Percent } from 'lucide-react';

export default function PartnerLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Dynamic Commission Rates State
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [commissionRates, setCommissionRates] = useState({
    tier1Month1Percent: 5,
    tier1MonthlyPercent: 2,
    tier2Month1Percent: 10,
    tier2MonthlyPercent: 2,
    tier3Month1Percent: 10,
    tier3MonthlyPercent: 2,
    promoterSubPartnerOverridePercent: 0.5,
    baseRatePerFlat: 25,
    minFlatsThreshold: 40,
  });
  const [savingConfig, setSavingConfig] = useState(false);

  // Manual Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLeadData, setNewLeadData] = useState({
    partnerName: '',
    partnerPhone: '',
    partnerEmail: '',
    partnerCity: '',
    partnerUpi: '',
    partnerType: 'broker',
    targetSocietyName: '',
    targetCity: '',
    contactPerson: '',
    contactRole: 'RWA Secretary',
    contactPhone: '',
    approxFlats: '100-250',
    assignedTier: 'growth',
    status: 'new',
    notes: '',
  });
  const [submittingLead, setSubmittingLead] = useState(false);

  // Payout Modal State
  const [selectedLeadForPayout, setSelectedLeadForPayout] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState('500');
  const [utrNumber, setUtrNumber] = useState('');
  const [payoutNotes, setPayoutNotes] = useState('');
  const [savingPayout, setSavingPayout] = useState(false);

  useEffect(() => {
    // 1. Listen to partner leads
    const q = query(collection(db, 'partner_leads'), orderBy('createdAt', 'desc'));
    const unsubLeads = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setLeads(fetched);
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to partner leads:', err);
        setLoading(false);
      }
    );

    // 2. Listen to dynamic commission config
    const configDocRef = doc(db, 'system_config', 'partner_program');
    const unsubConfig = onSnapshot(configDocRef, (snap) => {
      if (snap.exists()) {
        setCommissionRates((prev) => ({ ...prev, ...snap.data() }));
      }
    });

    return () => {
      unsubLeads();
      unsubConfig();
    };
  }, []);

  const handleSaveCommissionRates = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      await setDoc(
        doc(db, 'system_config', 'partner_program'),
        {
          ...commissionRates,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      alert('✓ Partner Commission Rates updated successfully in real-time!');
      setIsConfigModalOpen(false);
    } catch (err) {
      console.error('Failed to save commission config:', err);
      alert('Failed to save commission rates.');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await updateDoc(doc(db, 'partner_leads', leadId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Could not update lead status.');
    }
  };

  const handleDeleteLead = async (leadId, societyName) => {
    if (!window.confirm(`Are you sure you want to delete the lead for "${societyName}"?`)) return;
    try {
      await deleteDoc(doc(db, 'partner_leads', leadId));
    } catch (err) {
      console.error('Failed to delete lead:', err);
      alert('Could not delete lead.');
    }
  };

  const handleOpenPayoutModal = (lead) => {
    setSelectedLeadForPayout(lead);
    
    // Dynamically calculate recommended amount based on flat count and saved commission rate %
    let flats = 100;
    if (lead.approxFlats === '40-100') flats = 70;
    else if (lead.approxFlats === '100-250') flats = 175;
    else if (lead.approxFlats === '250-500') flats = 375;
    else if (lead.approxFlats === '500+') flats = 600;

    const tier = lead.assignedTier || 'growth';
    const month1Rate = tier === 'referral' 
      ? commissionRates.tier1Month1Percent 
      : (tier === 'onboarding' ? commissionRates.tier2Month1Percent : commissionRates.tier3Month1Percent);

    const calculatedBonus = Math.round(flats * (commissionRates.baseRatePerFlat || 25) * (month1Rate / 100));

    setPayoutAmount(String(calculatedBonus || 500));
    setUtrNumber('');
    setPayoutNotes(`Month 1 (${month1Rate}%) Commission for ${lead.targetSocietyName}`);
  };

  const handleSavePayout = async (e) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      alert('Please enter the 12-digit Bank / UPI Reference (UTR) Number.');
      return;
    }

    setSavingPayout(true);
    try {
      await updateDoc(doc(db, 'partner_leads', selectedLeadForPayout.id), {
        payoutTotal: Number(payoutAmount) || 500,
        payoutStatus: 'paid',
        utrNumber: utrNumber.trim(),
        payoutNotes: payoutNotes.trim(),
        lastPayoutAt: serverTimestamp(),
      });

      setSelectedLeadForPayout(null);
    } catch (err) {
      console.error('Failed to record payout:', err);
      alert('Failed to record payout.');
    } finally {
      setSavingPayout(false);
    }
  };

  const handleCreateManualLead = async (e) => {
    e.preventDefault();
    if (!newLeadData.partnerName.trim() || !newLeadData.partnerPhone.trim() || !newLeadData.targetSocietyName.trim()) {
      alert('Please fill Partner Name, Phone, and Society Name.');
      return;
    }

    setSubmittingLead(true);
    try {
      const generatedRef = `LEAD-${Date.now().toString().slice(-6)}`;
      await addDoc(collection(db, 'partner_leads'), {
        ...newLeadData,
        referenceId: generatedRef,
        source: 'super_admin_manual_entry',
        createdAt: serverTimestamp(),
      });

      setIsAddModalOpen(false);
      setNewLeadData({
        partnerName: '',
        partnerPhone: '',
        partnerEmail: '',
        partnerCity: '',
        partnerUpi: '',
        partnerType: 'broker',
        targetSocietyName: '',
        targetCity: '',
        contactPerson: '',
        contactRole: 'RWA Secretary',
        contactPhone: '',
        approxFlats: '100-250',
        assignedTier: 'growth',
        status: 'new',
        notes: '',
      });
    } catch (err) {
      console.error('Failed to create partner lead:', err);
      alert('Failed to create partner lead.');
    } finally {
      setSubmittingLead(false);
    }
  };

  // Filtered Leads
  const filteredLeads = leads.filter((item) => {
    const matchesSearch =
      (item.targetSocietyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.partnerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.partnerPhone || '').includes(searchTerm) ||
      (item.referenceId || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTier = filterTier === 'all' || item.assignedTier === filterTier;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;

    return matchesSearch && matchesTier && matchesStatus;
  });

  const totalCommissionsPaid = leads.reduce((acc, l) => acc + (l.payoutTotal || 0), 0);
  const totalSocietiesWon = leads.filter((l) => l.status === 'won').length;

  return (
    <div>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
            Partner & Referral Leads CRM
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>
            Track incoming society leads from property brokers, residents, and social media promoters, and approve UPI payouts.
          </p>
        </div>

        {/* Top Action & Aggregate Stats */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => setIsConfigModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#EFF6FF', color: '#1E3A8A', border: '1px solid #BFDBFE', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
          >
            <Sliders size={16} /> Edit Commission % Rates
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: '#1E3A8A', color: '#FFFFFF', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
          >
            <Plus size={18} /> Add Partner Lead
          </button>
          <div style={{ padding: '10px 18px', borderRadius: '12px', background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#065F46', textTransform: 'uppercase' }}>Won Societies</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#059669' }}>{totalSocietiesWon} Live</div>
          </div>
          <div style={{ padding: '10px 18px', borderRadius: '12px', background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#1E3A8A', textTransform: 'uppercase' }}>Commissions Paid</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#1E3A8A' }}>₹{totalCommissionsPaid.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        backgroundColor: '#FFFFFF',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid #E5E7EB'
      }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Society, Partner Name, Phone, or Lead ID..."
            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px 10px 36px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF' }}
        >
          <option value="all">All Pipeline Stages</option>
          <option value="new">New Leads</option>
          <option value="contacted">Contacted</option>
          <option value="demo_scheduled">Demo Scheduled</option>
          <option value="won">Closed Won / Active</option>
          <option value="lost">Lost</option>
        </select>

        <select
          value={filterTier}
          onChange={(e) => setFilterTier(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF' }}
        >
          <option value="all">All Partner Tiers</option>
          <option value="referral">Tier 1: Referral Partner (5%)</option>
          <option value="onboarding">Tier 2: Onboarding Partner (10%)</option>
          <option value="growth">Tier 3: Growth Partner (Lifetime)</option>
        </select>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading real-time partner leads...
        </div>
      ) : filteredLeads.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
          <Gift size={36} color="#94A3B8" style={{ margin: '0 auto 10px auto' }} />
          <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px 0' }}>No Partner Leads Found</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            No leads match your current search or filter criteria.
          </p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', overflowX: 'auto', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E5E7EB', color: '#475569', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '14px 16px' }}>Lead Ref</th>
                <th style={{ padding: '14px 16px' }}>Target Society</th>
                <th style={{ padding: '14px 16px' }}>RWA Contact</th>
                <th style={{ padding: '14px 16px' }}>Partner Details</th>
                <th style={{ padding: '14px 16px' }}>Tier</th>
                <th style={{ padding: '14px 16px' }}>Pipeline Stage</th>
                <th style={{ padding: '14px 16px' }}>Payout Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  {/* Ref */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontWeight: 800, color: '#1E3A8A' }}>{lead.referenceId || lead.id.slice(0, 8)}</span>
                    {lead.referredByCode && (
                      <div style={{ fontSize: '11px', color: '#0284C7', fontWeight: 600, marginTop: '2px' }}>
                        Ref: {lead.referredByCode}
                      </div>
                    )}
                  </td>

                  {/* Society */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{lead.targetSocietyName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {lead.targetCity || 'India'} • {lead.approxFlats} Flats
                    </div>
                  </td>

                  {/* Contact */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700 }}>{lead.contactPerson || 'Secretary'}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{lead.contactRole}</div>
                    {lead.contactPhone && (
                      <a href={`tel:${lead.contactPhone}`} style={{ fontSize: '12px', color: '#0EA5E9', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Phone size={11} /> {lead.contactPhone}
                      </a>
                    )}
                  </td>

                  {/* Partner */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{lead.partnerName}</div>
                    <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>UPI: {lead.partnerUpi || 'Not given'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{lead.partnerPhone} • {lead.partnerType}</div>
                  </td>

                  {/* Tier */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      backgroundColor: lead.assignedTier === 'growth' ? '#EFF6FF' : (lead.assignedTier === 'onboarding' ? '#E0F2FE' : '#ECFDF5'),
                      color: lead.assignedTier === 'growth' ? '#1E3A8A' : (lead.assignedTier === 'onboarding' ? '#0284C7' : '#059669')
                    }}>
                      {lead.assignedTier === 'growth' ? '🟣 Growth (Life)' : (lead.assignedTier === 'onboarding' ? '🔵 Onboarding' : '🟢 Referral')}
                    </span>
                  </td>

                  {/* Stage Dropdown */}
                  <td style={{ padding: '14px 16px' }}>
                    <select
                      value={lead.status || 'new'}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        backgroundColor: lead.status === 'won' ? '#ECFDF5' : '#FFFFFF',
                        border: lead.status === 'won' ? '1px solid #A7F3D0' : '1px solid #CBD5E1',
                        color: lead.status === 'won' ? '#065F46' : '#1E293B',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="new">🟡 New Lead</option>
                      <option value="contacted">🟣 Contacted</option>
                      <option value="demo_scheduled">🔵 Demo Scheduled</option>
                      <option value="won">🟢 Won / Active</option>
                      <option value="lost">⚪ Lost</option>
                    </select>
                  </td>

                  {/* Payout */}
                  <td style={{ padding: '14px 16px' }}>
                    {lead.payoutStatus === 'paid' ? (
                      <div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '6px', backgroundColor: '#ECFDF5', color: '#059669', fontSize: '11px', fontWeight: 800 }}>
                          <CheckCircle2 size={12} /> ₹{lead.payoutTotal || 500} Paid
                        </span>
                        {lead.utrNumber && (
                          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            UTR: {lead.utrNumber}
                          </div>
                        )}
                      </div>
                    ) : lead.status === 'won' ? (
                      <button
                        onClick={() => handleOpenPayoutModal(lead)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          backgroundColor: '#1E3A8A',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <DollarSign size={13} /> Pay Partner
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>On Close</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteLead(lead.id, lead.targetSocietyName)}
                      title="Delete Lead"
                      style={{ padding: '6px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── PAYOUT APPROVAL MODAL ────────────────────────────────────────── */}
      {selectedLeadForPayout && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '480px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedLeadForPayout(null)}
              style={{ position: 'absolute', top: '18px', right: '18px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={20} color="#1E3A8A" />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#1E293B' }}>Approve Partner Payout</h3>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Society: {selectedLeadForPayout.targetSocietyName}</div>
              </div>
            </div>

            <form onSubmit={handleSavePayout} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Partner UPI ID</label>
                <input
                  type="text"
                  readOnly
                  value={selectedLeadForPayout.partnerUpi || 'No UPI ID Provided'}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#059669', fontWeight: 700, fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Payout Amount (₹) *</label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="500"
                  required
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>12-Digit Bank / UPI Reference (UTR) Number *</label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. 628491028374"
                  required
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
                <span style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', display: 'block' }}>
                  This official proof will be displayed on the partner's status dashboard.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Notes / Description</label>
                <input
                  type="text"
                  value={payoutNotes}
                  onChange={(e) => setPayoutNotes(e.target.value)}
                  placeholder="e.g. Month 1 10% Onboarding Bonus"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedLeadForPayout(null)}
                  style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPayout}
                  style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#1E3A8A', color: '#FFFFFF', fontSize: '13px', fontWeight: 700, cursor: savingPayout ? 'not-allowed' : 'pointer' }}
                >
                  {savingPayout ? 'Recording...' : 'Confirm & Save Proof'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MANUAL ADD PARTNER LEAD MODAL ────────────────────────────────── */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '560px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsAddModalOpen(false)}
              style={{ position: 'absolute', top: '18px', right: '18px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Handshake size={20} color="#1E3A8A" />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#1E293B' }}>Add Manual Partner Lead</h3>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Register partner lead received via phone, WhatsApp, or direct meeting.</div>
              </div>
            </div>

            <form onSubmit={handleCreateManualLead} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Partner Name *</label>
                  <input
                    type="text"
                    required
                    value={newLeadData.partnerName}
                    onChange={(e) => setNewLeadData({ ...newLeadData, partnerName: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Partner Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newLeadData.partnerPhone}
                    onChange={(e) => setNewLeadData({ ...newLeadData, partnerPhone: e.target.value })}
                    placeholder="9876543210"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Partner UPI ID</label>
                  <input
                    type="text"
                    value={newLeadData.partnerUpi}
                    onChange={(e) => setNewLeadData({ ...newLeadData, partnerUpi: e.target.value })}
                    placeholder="e.g. rahul@okaxis"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Partner Type</label>
                  <select
                    value={newLeadData.partnerType}
                    onChange={(e) => setNewLeadData({ ...newLeadData, partnerType: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="broker">Property Broker / Agent</option>
                    <option value="resident">Society Resident</option>
                    <option value="creator">Social Influencer / Promoter</option>
                    <option value="independent">Independent Freelancer</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Target Society Name *</label>
                  <input
                    type="text"
                    required
                    value={newLeadData.targetSocietyName}
                    onChange={(e) => setNewLeadData({ ...newLeadData, targetSocietyName: e.target.value })}
                    placeholder="e.g. Palm Meadows"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Target City</label>
                  <input
                    type="text"
                    value={newLeadData.targetCity}
                    onChange={(e) => setNewLeadData({ ...newLeadData, targetCity: e.target.value })}
                    placeholder="e.g. Mumbai, Pune"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>RWA Contact Person</label>
                  <input
                    type="text"
                    value={newLeadData.contactPerson}
                    onChange={(e) => setNewLeadData({ ...newLeadData, contactPerson: e.target.value })}
                    placeholder="Secretary Name"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>RWA Phone</label>
                  <input
                    type="tel"
                    value={newLeadData.contactPhone}
                    onChange={(e) => setNewLeadData({ ...newLeadData, contactPhone: e.target.value })}
                    placeholder="Secretary Phone"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Approx Flat Count</label>
                  <select
                    value={newLeadData.approxFlats}
                    onChange={(e) => setNewLeadData({ ...newLeadData, approxFlats: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="40-100">40 - 100 Flats</option>
                    <option value="100-250">100 - 250 Flats</option>
                    <option value="250-500">250 - 500 Flats</option>
                    <option value="500+">500+ Flats</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Commission Tier</label>
                  <select
                    value={newLeadData.assignedTier}
                    onChange={(e) => setNewLeadData({ ...newLeadData, assignedTier: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="growth">Tier 3: Growth Partner (Lifetime)</option>
                    <option value="onboarding">Tier 2: Onboarding Partner (10%)</option>
                    <option value="referral">Tier 1: Referral Partner (5%)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingLead}
                  style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#1E3A8A', color: '#FFFFFF', fontSize: '13px', fontWeight: 700, cursor: submittingLead ? 'not-allowed' : 'pointer' }}
                >
                  {submittingLead ? 'Saving...' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DYNAMIC COMMISSION RATES & RULES MODAL ───────────────────────── */}
      {isConfigModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '560px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsConfigModalOpen(false)}
              style={{ position: 'absolute', top: '18px', right: '18px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sliders size={20} color="#1E3A8A" />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#1E293B' }}>Partner Commission Control</h3>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Adjust the payout percentages dynamically whenever you want.</div>
              </div>
            </div>

            <form onSubmit={handleSaveCommissionRates} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Tier 1 */}
              <div style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#059669', marginBottom: '8px' }}>
                  Tier 1: Referral Partner (Intro Only)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Month 1 Bonus (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={commissionRates.tier1Month1Percent}
                      onChange={(e) => setCommissionRates({ ...commissionRates, tier1Month1Percent: Number(e.target.value) })}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Monthly Recurring (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={commissionRates.tier1MonthlyPercent}
                      onChange={(e) => setCommissionRates({ ...commissionRates, tier1MonthlyPercent: Number(e.target.value) })}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
                    />
                  </div>
                </div>
              </div>

              {/* Tier 2 */}
              <div style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0284C7', marginBottom: '8px' }}>
                  Tier 2: Onboarding Partner (Assists Demo)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Month 1 Bonus (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={commissionRates.tier2Month1Percent}
                      onChange={(e) => setCommissionRates({ ...commissionRates, tier2Month1Percent: Number(e.target.value) })}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Monthly Recurring (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={commissionRates.tier2MonthlyPercent}
                      onChange={(e) => setCommissionRates({ ...commissionRates, tier2MonthlyPercent: Number(e.target.value) })}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
                    />
                  </div>
                </div>
              </div>

              {/* Tier 3 */}
              <div style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#1E3A8A', marginBottom: '8px' }}>
                  Tier 3: Growth Partner (Exclusive / Lifetime)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Month 1 Bonus (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={commissionRates.tier3Month1Percent}
                      onChange={(e) => setCommissionRates({ ...commissionRates, tier3Month1Percent: Number(e.target.value) })}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Monthly Recurring (%) [Lifetime]</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={commissionRates.tier3MonthlyPercent}
                      onChange={(e) => setCommissionRates({ ...commissionRates, tier3MonthlyPercent: Number(e.target.value) })}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
                    />
                  </div>
                </div>
              </div>

              {/* Base Platform Rates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Base SaaS Rate (₹/Flat/Mo)</label>
                  <input
                    type="number"
                    value={commissionRates.baseRatePerFlat}
                    onChange={(e) => setCommissionRates({ ...commissionRates, baseRatePerFlat: Number(e.target.value) })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Min Flat Threshold</label>
                  <input
                    type="number"
                    value={commissionRates.minFlatsThreshold}
                    onChange={(e) => setCommissionRates({ ...commissionRates, minFlatsThreshold: Number(e.target.value) })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingConfig}
                  style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#1E3A8A', color: '#FFFFFF', fontSize: '13px', fontWeight: 700, cursor: savingConfig ? 'not-allowed' : 'pointer' }}
                >
                  {savingConfig ? 'Saving...' : 'Save Commission Rates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
