import React from 'react';
import { motion } from 'framer-motion';

export default function HeroVisualMockup({ isDark, isMobileScreen }) {
  if (isMobileScreen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}
    >
      <div style={{ position: 'relative', width: '100%', maxWidth: '560px' }}>
        <img
          src="/assets/hero_illustration.png"
          alt="GateLink Management App Illustration"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            borderRadius: '16px',
            boxShadow: 'none'
          }}
        />
      </div>
    </motion.div>
  );
}
