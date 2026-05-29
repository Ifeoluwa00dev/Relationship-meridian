import React from 'react';
import { motion } from 'motion/react';

interface LandingProps {
  onBegin: () => void;
}

export default function Landing({ onBegin }: LandingProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-meridian-black relative overflow-hidden">
      {/* Background decorative element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-meridian-gold opacity-[0.03] blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10"
      >
        <span className="text-meridian-gold tracking-[0.4em] uppercase text-[10px] font-bold mb-6 block">Meridian</span>
        <h1 className="text-5xl md:text-8xl font-serif mb-8 leading-[1.1] text-meridian-text">
          The point where<br />everything aligns.
        </h1>
        <p className="max-w-lg mx-auto text-white/40 mb-14 font-light leading-relaxed text-sm tracking-wide">
          A sophisticated compatibility system for those seeking a life partner through deep value alignment and shared worldview.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBegin}
          className="btn-primary"
        >
          Begin The Alignment
        </motion.button>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1.5, duration: 2 }}
        className="absolute bottom-12 text-[10px] uppercase tracking-[0.4em] text-white/40"
      >
        Quietly finding what matters.
      </motion.div>
    </div>
  );
}
