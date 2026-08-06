import React from 'react';
import { motion } from 'framer-motion';

export default function SkeletonLoader() {
  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', padding: '160px 24px 60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        <div style={{ height: '40px', width: '60%', backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: '12px', margin: '0 auto' }} />
        <div style={{ height: '20px', width: '40%', backgroundColor: 'rgba(30, 41, 59, 0.6)', borderRadius: '8px', margin: '0 auto' }} />
        <div style={{ height: '260px', width: '100%', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '20px', marginTop: '20px' }} />
      </motion.div>
    </div>
  );
}
