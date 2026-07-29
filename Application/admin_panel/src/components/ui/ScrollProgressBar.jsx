import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #6366F1 0%, #34D399 50%, #C084FC 100%)',
        transformOrigin: '0%',
        scaleX,
        zIndex: 9999,
        boxShadow: '0 0 10px rgba(99, 102, 241, 0.8)'
      }}
    />
  );
}
