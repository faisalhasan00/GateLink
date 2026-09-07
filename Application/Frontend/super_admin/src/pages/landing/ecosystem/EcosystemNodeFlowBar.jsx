import React from 'react';
import { motion } from 'framer-motion';
import { ECOSYSTEM_NODES } from './ecosystemNodesData';

export default function EcosystemNodeFlowBar({ selectedNodeId, onSelectNode }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
      borderRadius: '24px',
      padding: '32px 24px',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)',
      marginBottom: '48px',
      position: 'relative'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <span style={{ fontSize: '11px', fontWeight: 900, color: '#818CF8', letterSpacing: '1px', textTransform: 'uppercase' }}>
          INTERACTIVE DATA PIPELINE (CLICK ANY NODE TO INSPECT)
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        gap: '12px',
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* Background Connecting Glow Line */}
        <div style={{
          position: 'absolute',
          top: '42px',
          left: '6%',
          right: '6%',
          height: '4px',
          background: 'linear-gradient(90deg, #818CF8 0%, #34D399 20%, #C084FC 40%, #FBBF24 60%, #F87171 80%, #38BDF8 100%)',
          borderRadius: '2px',
          zIndex: 1,
          opacity: 0.6
        }} />

        {/* Individual Node Cards */}
        {ECOSYSTEM_NODES.map((n, idx) => {
          const isSelected = selectedNodeId === n.id;
          return (
            <motion.div
              key={n.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => onSelectNode(n.id)}
              style={{
                zIndex: 2,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: isSelected ? n.color : 'rgba(15, 23, 42, 0.9)',
                border: `2px solid ${isSelected ? '#FFFFFF' : n.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isSelected ? `0 0 25px ${n.color}` : '0 8px 20px rgba(0,0,0,0.4)',
                transition: 'all 0.25s ease',
                marginBottom: '12px'
              }}>
                {React.cloneElement(n.icon, { color: isSelected ? '#FFFFFF' : n.color })}
              </div>

              <div style={{ fontSize: '14px', fontWeight: 800, color: isSelected ? '#FFFFFF' : '#CBD5E1', marginBottom: '2px' }}>
                {n.title}
              </div>
              <div style={{ fontSize: '10px', color: isSelected ? n.color : '#64748B', fontWeight: 700 }}>
                STEP 0{idx + 1}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
