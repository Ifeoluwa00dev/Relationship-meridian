import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { OnboardingData, PartnerPreferences, CompromiseItem } from '../types';
import { ChevronRight, ChevronLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface CompromiseFormProps {
  onboarding: OnboardingData;
  partner: PartnerPreferences;
  items: CompromiseItem[];
  setItems: (items: CompromiseItem[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function CompromiseForm({ onboarding, partner, items, setItems, onNext, onBack }: CompromiseFormProps) {
  
  useEffect(() => {
    // Generate items from previous steps if not already populated
    if (items.length === 0) {
      const newItems: CompromiseItem[] = [];
      
      // From partner requirements
      if (partner.dealbreakers) {
        partner.dealbreakers.forEach((db, i) => {
          newItems.push({ id: `db-${i}`, type: 'requirement', text: db, isDealbreaker: true });
        });
      }

      // Add core values
      if (partner.nonNegotiableValues) {
        partner.nonNegotiableValues.forEach((val, i) => {
          newItems.push({ id: `val-${i}`, type: 'requirement', text: `Must value ${val}`, isDealbreaker: true });
        });
      }

      setItems(newItems);
    }
  }, []);

  const toggleDealbreaker = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isDealbreaker: !item.isDealbreaker } : item
    ));
  };

  const updateNote = (id: string, note: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, note } : item
    ));
  };

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl mb-4 italic font-serif">The Balance</h3>
        <p className="text-sm text-meridian-ivory/60 leading-relaxed">
          For each item below, decide if it is a absolute non-negotiable (dealbreaker) or if you can be flexible under the right circumstances. This weights your matching logic.
        </p>
      </div>

      <div className="space-y-8">
        {items.map((item) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 border border-meridian-ivory/10 space-y-4"
          >
            <div className="flex justify-between items-start">
                <span className="text-sm font-medium pr-4">{item.text}</span>
                <div className="flex gap-2">
                    <button 
                        onClick={() => toggleDealbreaker(item.id)}
                        className={cn(
                            "px-3 py-1 text-[10px] uppercase tracking-widest transition-all border",
                            item.isDealbreaker ? "bg-red-900/20 border-red-500 text-red-400" : "border-meridian-ivory/20 text-meridian-ivory/40"
                        )}
                    >
                        Dealbreaker
                    </button>
                    <button 
                        onClick={() => toggleDealbreaker(item.id)}
                        className={cn(
                            "px-3 py-1 text-[10px] uppercase tracking-widest transition-all border",
                            !item.isDealbreaker ? "bg-green-900/20 border-green-500 text-green-400" : "border-meridian-ivory/20 text-meridian-ivory/40"
                        )}
                    >
                        Flexible
                    </button>
                </div>
            </div>
            
            <input 
                placeholder="Optional note on your position..."
                value={item.note || ''}
                onChange={e => updateNote(item.id, e.target.value)}
                className="w-full bg-transparent border-b border-meridian-ivory/10 py-1 text-sm italic outline-none focus:border-meridian-gold transition-colors"
            />

            <div className="flex items-center gap-2 text-[10px] uppercase tracking-tighter opacity-40">
                {item.isDealbreaker ? (
                    <><AlertCircle size={12} className="text-red-500" /> Claude will strictly filter this.</>
                ) : (
                    <><CheckCircle2 size={12} className="text-green-500" /> Claude will weigh this as a preference.</>
                )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between pt-12 border-t border-meridian-ivory/10">
        <button onClick={onBack} className="flex items-center text-meridian-ivory/60 hover:text-meridian-ivory transition-colors">
          <ChevronLeft size={18} className="mr-2" /> Back
        </button>
        <button onClick={onNext} className="btn-primary">
          Final Review
        </button>
      </div>
    </div>
  );
}
