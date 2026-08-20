import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function LeadPipelineBreakdown({ leads }) {
  const stages = ['New', 'Contacted', 'Demo Scheduled', 'Proposal Sent', 'Closed Won'];

  return (
    <div className="card" style={{ padding: '20px', marginBottom: '24px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: 'white', borderRadius: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ fontSize: '15px', fontWeight: 800 }}>📊 Sales Lead Pipeline Breakdown</div>
        <Link to="/crm" style={{ color: '#00B589', textDecoration: 'none', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>Manage All Leads in CRM</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
        {stages.map((stage) => {
          const count = leads.filter((l) => l.status === stage).length;
          return (
            <div key={stage} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '6px', padding: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>{stage}</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: stage === 'New' ? '#38BDF8' : stage === 'Closed Won' ? '#34D399' : '#FFFFFF', marginTop: '4px' }}>
                {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
