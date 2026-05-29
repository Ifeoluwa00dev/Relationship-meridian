import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';

export default function Auth({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the login link.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-meridian-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-meridian-gold opacity-[0.02] blur-[100px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm w-full space-y-10 relative z-10"
      >
        <div className="text-center space-y-4">
            <span className="text-meridian-gold tracking-[0.4em] uppercase text-[10px] font-bold block mb-4">Verification</span>
            <h2 className="text-4xl font-serif">Identify Yourself</h2>
            <p className="text-sm text-white/40 font-light leading-relaxed">Magic links provide a secure, passwordless experience for intentional connections.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="form-label text-center">Email Address</label>
            <input
              type="email"
              placeholder="e.g. adrian@meridian.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input text-center"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Authenticating...' : 'Submit Credentials'}
          </button>
        </form>
        
        {message && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[11px] text-meridian-gold bg-meridian-gold/5 border border-meridian-gold/20 p-4 rounded-sm italic"
          >
            {message}
          </motion.p>
        )}

        <div className="pt-4">
          <button 
              onClick={() => onAuthenticated()} 
              className="text-[10px] uppercase tracking-[0.3em] text-white/10 w-full hover:text-white/30 transition-colors"
          >
              Bypass for development
          </button>
        </div>
      </motion.div>
    </div>
  );
}
