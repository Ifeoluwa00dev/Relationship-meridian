import React from 'react';
import { motion } from 'motion/react';

export default function ProfileLocked() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="text-meridian-gold tracking-[0.3em] uppercase text-[10px] mb-4 block">Meridian</span>
        <h2 className="text-3xl font-serif mb-6 italic text-meridian-ivory/80">Stillness is intentional.</h2>
        <p className="max-w-md mx-auto text-meridian-ivory/60 mb-12 font-light leading-relaxed">
          Your profile is currently active in the pool. To maintain the depth of our matching process, you can only update your details once every two weeks.
        </p>
        <div className="p-12 border border-meridian-ivory/10 inline-block">
            <span className="text-4xl font-serif text-meridian-gold">Locked</span>
            <p className="text-[10px] uppercase tracking-widest mt-4 opacity-40">Check back in 12 days</p>
        </div>
      </motion.div>
    </div>
  );
}
