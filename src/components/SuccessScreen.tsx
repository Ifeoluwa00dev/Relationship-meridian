import React from 'react';
import { motion } from 'motion/react';

export default function SuccessScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-serif mb-8 italic">You're in the pool.</h2>
        <p className="max-w-md mx-auto text-meridian-ivory/60 mb-12 font-light leading-relaxed">
          We'll reach out within 3 days if we find your match. Your profile is now locked for 2 weeks to preserve intentionality.<br /><br />
          In the meantime — live your life.
        </p>
        <div className="flex justify-center gap-8">
            <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-meridian-gold mb-2">Status</span>
                <span className="text-sm">Searching</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-meridian-gold mb-2">Unlock</span>
                <span className="text-sm">14 Days</span>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
