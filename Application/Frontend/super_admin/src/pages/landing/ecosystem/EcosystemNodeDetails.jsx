import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function EcosystemNodeDetails({ selectedNode, onOpenDemo }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedNode.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.35 }}
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
          borderRadius: '24px',
          padding: '40px',
          border: `1px solid ${selectedNode.color}40`,
          backdropFilter: 'blur(20px)',
          boxShadow: `0 20px 40px -15px ${selectedNode.color}20`,
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '40px',
          alignItems: 'center'
        }}
      >
        {/* Left Details */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: `${selectedNode.color}20`,
              border: `1px solid ${selectedNode.color}50`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {selectedNode.icon}
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 900, color: selectedNode.color, letterSpacing: '1px', textTransform: 'uppercase' }}>
                {selectedNode.role}
              </span>
              <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                {selectedNode.title} Node
              </h2>
            </div>
          </div>

          <p style={{ fontSize: '16px', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '28px' }}>
            {selectedNode.desc}
          </p>

          {/* Input & Output Telemetry Signals */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', marginBottom: '6px', letterSpacing: '0.5px' }}>
                📥 INPUT TELEMETRY SIGNAL
              </div>
              <div style={{ fontSize: '13px', color: '#E2E8F0', fontWeight: 600 }}>{selectedNode.dataInput}</div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: selectedNode.color, marginBottom: '6px', letterSpacing: '0.5px' }}>
                📤 OUTPUT BROADCAST SIGNAL
              </div>
              <div style={{ fontSize: '13px', color: '#E2E8F0', fontWeight: 600 }}>{selectedNode.dataOutput}</div>
            </div>
          </div>

          {/* Core Node Capabilities */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
            {selectedNode.details.map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#F1F5F9', fontWeight: 600 }}>
                <CheckCircle2 size={16} color={selectedNode.color} style={{ flexShrink: 0 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onOpenDemo}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${selectedNode.color} 0%, #4F46E5 100%)`,
              color: 'white',
              fontWeight: 800,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: `0 4px 20px ${selectedNode.color}40`
            }}
          >
            <span>Explore {selectedNode.title} Integration</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Right Live Stream Card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.95)',
          borderRadius: '20px',
          padding: '28px',
          border: `1px solid ${selectedNode.color}40`,
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: selectedNode.color }} />
              <span style={{ color: 'white', fontWeight: 800, fontSize: '13px' }}>REAL-TIME DATA SIGNAL</span>
            </div>
            <span style={{
              fontSize: '10px',
              fontWeight: 900,
              background: `${selectedNode.color}20`,
              color: selectedNode.color,
              padding: '3px 8px',
              borderRadius: '10px'
            }}>
              ACTIVE STREAM
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: 'monospace', fontSize: '12px' }}>
            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', color: '#A5B4FC' }}>
              event: <span style={{ color: '#FFFFFF' }}>"{selectedNode.id}_action_triggered"</span>
            </div>
            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', color: '#34D399' }}>
              status: <span style={{ color: '#FFFFFF' }}>"200 OK (0.04s latency)"</span>
            </div>
            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', color: '#CBD5E1' }}>
              encryption: <span style={{ color: '#FBBF24' }}>"AES-256 SSL TLS v1.3"</span>
            </div>
          </div>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', color: '#94A3B8', fontSize: '12px' }}>
            Seamlessly synchronized across iOS, Android & Web
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
