import React from 'react';
import { motion } from 'framer-motion';

const GlowCard = ({ children, className = '', isDark = false, ...props }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.005 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`${isDark ? 'glass-panel' : 'light-glass-panel'} rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
        isDark 
          ? 'hover:shadow-brand-500/10 hover:border-brand-500/30' 
          : 'hover:shadow-brand-500/10 hover:border-brand-500/20'
      } ${className}`}
      {...props}
    >
      {/* Ambient background soft spots */}
      <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-32 h-32 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlowCard;
