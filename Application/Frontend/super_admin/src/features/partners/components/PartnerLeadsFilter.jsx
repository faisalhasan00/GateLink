import React from 'react';
import { Search } from 'lucide-react';

export default function PartnerLeadsFilter({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterTier,
  setFilterTier,
}) {
  return (
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
  );
}
