import React, { useState } from 'react';
import { Search, Building, CheckCircle2, Clock, DollarSign, AlertCircle, ShieldCheck } from 'lucide-react';
import { lookupPartnerLeads } from '../services/partnerService';
import { useTheme } from '../../../context/ThemeContext';

export default function PartnerStatusTracker() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError('Please enter your 10-digit Mobile Number or Lead ID.');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const leads = await lookupPartnerLeads(searchQuery);
      setResults(leads);
    } catch (err) {
      console.error('Error looking up partner leads:', err);
      setError('Failed to fetch status. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Compute Aggregates from results
  const totalEarned = results.reduce((acc, lead) => acc + (lead.payoutTotal || (lead.status === 'won' ? 500 : 0)), 0);
  const activeSocieties = results.filter((l) => l.status === 'won').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'won':
        return { label: '🟢 Active & Paying (Won)', bg: '#ECFDF5', color: '#059669' };
      case 'demo_scheduled':
        return { label: '🔵 Demo Scheduled', bg: '#E0F2FE', color: '#0284C7' };
      case 'contacted':
        return { label: '🟣 Contacted Committee', bg: '#F3E8FF', color: '#7E22CE' };
      case 'lost':
        return { label: '⚪ Closed / Not Interested', bg: '#F1F5F9', color: '#64748B' };
      default:
        return { label: '🟡 New Lead Under Review', bg: '#FEF3C7', color: '#B45309' };
    }
  };

  return (
    <section id="tracker" style={{ padding: '60px 0', maxWidth: '900px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
      <div style={{
        background: isDark ? '#1E293B' : '#FFFFFF',
        borderRadius: '16px',
        padding: '36px',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '1px' }}>
            TRANSPARENT STATUS & PAYOUT PORTAL
          </span>
          <h3 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '6px 0 8px 0' }}>
            Track Your Leads & Payout History
          </h3>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#555555', margin: 0 }}>
            Enter your registered Phone Number or Lead Reference ID to view live progress, confirmed deals, and UPI payment proofs.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', maxWidth: '600px', margin: '0 auto 30px auto' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter Phone (e.g. 9876543210) or Lead ID"
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '10px',
              border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #CCCCCC',
              backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
              color: isDark ? '#FFFFFF' : '#2C2C2C',
              fontSize: '14px'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              backgroundColor: '#1E3A8A',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Search size={16} />
            <span>{loading ? 'Checking...' : 'Check Status'}</span>
          </button>
        </form>

        {error && (
          <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#FEF2F2', border: '1px solid #F87171', color: '#991B1B', fontSize: '13px', fontWeight: 600, marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* Results View */}
        {hasSearched && !loading && (
          <div>
            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 20px', backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderRadius: '12px' }}>
                <AlertCircle size={32} color="#94A3B8" style={{ margin: '0 auto 10px auto' }} />
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '0 0 6px 0' }}>No Leads Found</h4>
                <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#666666', margin: 0 }}>
                  We could not find any submitted society leads matching "<strong>{searchQuery}</strong>". Check the phone number or submit a new society above.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Summary Banner */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '14px',
                  backgroundColor: isDark ? '#0F172A' : '#EFF6FF',
                  padding: '18px',
                  borderRadius: '12px',
                  border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #BFDBFE'
                }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94A3B8' : '#1E3A8A', textTransform: 'uppercase' }}>TOTAL EARNED TO DATE</div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#1E3A8A', marginTop: '2px' }}>₹{totalEarned.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94A3B8' : '#1E3A8A', textTransform: 'uppercase' }}>ACTIVE PAYING SOCIETIES</div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#059669', marginTop: '2px' }}>{activeSocieties} Society</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94A3B8' : '#1E3A8A', textTransform: 'uppercase' }}>RECURRING PAYOUT DATE</div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#2C2C2C', marginTop: '4px' }}>1st of every month</div>
                  </div>
                </div>

                {/* Individual Lead Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {results.map((lead) => {
                    const badge = getStatusBadge(lead.status);
                    return (
                      <div
                        key={lead.id}
                        style={{
                          background: isDark ? '#0F172A' : '#F8FAFC',
                          borderRadius: '12px',
                          padding: '20px',
                          border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E5E7EB'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#0EA5E9' }}>REF: {lead.referenceId || lead.id}</div>
                            <h4 style={{ fontSize: '17px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#2C2C2C', margin: '2px 0 0 0' }}>
                              {lead.targetSocietyName} ({lead.targetCity || 'India'})
                            </h4>
                            <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#666666', marginTop: '2px' }}>
                              Contact: {lead.contactPerson || 'Secretary'} • {lead.contactRole} • {lead.approxFlats} Flats
                            </div>
                          </div>

                          <div style={{
                            padding: '4px 12px',
                            borderRadius: '999px',
                            backgroundColor: badge.bg,
                            color: badge.color,
                            fontSize: '12px',
                            fontWeight: 800
                          }}>
                            {badge.label}
                          </div>
                        </div>

                        {/* Payout Details */}
                        <div style={{
                          paddingTop: '12px',
                          borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '8px',
                          fontSize: '12px'
                        }}>
                          <div style={{ color: isDark ? '#CBD5E1' : '#444444' }}>
                            <strong>Registered UPI:</strong> {lead.partnerUpi || 'Pending verification'}
                          </div>
                          <div style={{ color: '#059669', fontWeight: 700 }}>
                            {lead.status === 'won' ? '✓ Month 1 Bonus: ₹500 + 2% Monthly Recurring Active' : 'Commission calculated upon first monthly invoice clearance'}
                          </div>
                        </div>

                        {/* Bank UTR Proof (If available) */}
                        {lead.utrNumber && (
                          <div style={{ marginTop: '8px', fontSize: '11px', color: '#1E3A8A', backgroundColor: '#EFF6FF', padding: '6px 10px', borderRadius: '6px' }}>
                            🏦 Bank UTR Proof: <strong>{lead.utrNumber}</strong> (Verified by GateLink Accounts)
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
