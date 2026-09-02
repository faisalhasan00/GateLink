import React from 'react';
import { Vote, Plus, CheckCircle2, Users, Lock } from 'lucide-react';

export function PollsHeader({ metrics, onOpenCreateModal }) {
  const { totalPolls, activePolls, totalVotesCast, agmCount } = metrics;

  return (
    <>
      {/* Header Banner */}
      <div 
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '26px 30px',
          background: 'linear-gradient(135deg, var(--gl-navy, #1E3A8A) 0%, #0F172A 100%)',
          color: '#FFFFFF',
          borderRadius: '16px',
          border: 'none',
          boxShadow: '0 10px 25px rgba(30, 58, 138, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div 
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gl-sky, #0EA5E9)'
            }}
          >
            <Vote size={30} />
          </div>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: '#FFFFFF', fontFamily: 'var(--font-display, Manrope)' }}>
              AGM Voting &amp; Community Polls
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', margin: '4px 0 0 0' }}>
              Conduct official AGM resolutions, facility upgrades, and member surveys with 1-vote-per-flat rules.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="btn btn-primary"
          style={{
            backgroundColor: 'var(--gl-navy, #1E3A8A)',
            color: '#FFFFFF',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 700,
            borderRadius: '12px',
            boxShadow: '0 6px 18px rgba(30, 58, 138, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <Plus size={18} />
          Create New Poll
        </button>
      </div>

      {/* Metrics Row */}
      <div className="dashboard-grid">
        <div className="stat-card" style={{ borderRadius: '16px' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--gl-navy-light, #EFF6FF)' }}>
            <Vote size={24} color="var(--gl-navy, #1E3A8A)" />
          </div>
          <div className="stat-info">
            <p>Total Polls</p>
            <h3>{totalPolls}</h3>
          </div>
        </div>

        <div className="stat-card" style={{ borderRadius: '16px' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--gl-success-bg, #DCFCE7)' }}>
            <CheckCircle2 size={24} color="var(--gl-success, #16A34A)" />
          </div>
          <div className="stat-info">
            <p>Active Voting</p>
            <h3 style={{ color: 'var(--gl-success, #16A34A)' }}>{activePolls}</h3>
          </div>
        </div>

        <div className="stat-card" style={{ borderRadius: '16px' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--gl-sky-100, #E0F2FE)' }}>
            <Users size={24} color="var(--gl-sky, #0EA5E9)" />
          </div>
          <div className="stat-info">
            <p>Total Votes Cast</p>
            <h3 style={{ color: 'var(--gl-sky, #0EA5E9)' }}>{totalVotesCast}</h3>
          </div>
        </div>

        <div className="stat-card" style={{ borderRadius: '16px' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--gl-amber-100, #FEF3C7)' }}>
            <Lock size={24} color="var(--gl-amber, #F59E0B)" />
          </div>
          <div className="stat-info">
            <p>AGM Resolutions</p>
            <h3 style={{ color: 'var(--gl-amber-hover, #D97706)' }}>{agmCount}</h3>
          </div>
        </div>
      </div>
    </>
  );
}
