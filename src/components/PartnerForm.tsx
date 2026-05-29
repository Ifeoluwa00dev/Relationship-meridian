import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PartnerPreferences } from '../types';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';

interface PartnerFormProps {
  data: Partial<PartnerPreferences>;
  updateData: (data: Partial<PartnerPreferences>) => void;
  onNext: () => void;
  onBack: () => void;
}

const TOP_VALUES = [
  'Integrity', 'Loyalty', 'Faith', 'Family', 'Ambition', 'Compassion', 
  'Honesty', 'Freedom', 'Growth', 'Service', 'Stability', 'Adventure', 
  'Creativity', 'Respect', 'Wisdom'
];

export default function PartnerForm({ data, updateData, onNext, onBack }: PartnerFormProps) {
  const [part, setPart] = useState(1);

  const update = (field: string, value: any) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <div className="space-y-12">
      {part === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <SectionHeader title="Basic Preferences" description="Who are you looking for?" />
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <Input 
                label="Age Min" 
                type="number" 
                value={data.ageRange?.min} 
                onChange={(v: any) => update('ageRange', { ...data.ageRange, min: parseInt(v) })} 
              />
              <Input 
                label="Age Max" 
                type="number" 
                value={data.ageRange?.max} 
                onChange={(v: any) => update('ageRange', { ...data.ageRange, max: parseInt(v) })} 
              />
            </div>
            <Input label="Location Preference" placeholder="Same city, country, or open?" value={data.locationPref} onChange={(v: any) => update('locationPref', v)} />
            <Textarea label="Character Description" placeholder="Describe the soul of the person you seek..." value={data.characterDescription} onChange={(v: any) => update('characterDescription', v)} />
          </div>
        </motion.div>
      )}

      {part === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <SectionHeader title="Lifestyle Compatibility" description="How will you live together?" />
          <div className="space-y-8">
            <Input label="Routine" placeholder="Early riser, night owl, or shared rhythm?" value={data.lifestyle?.routine} onChange={(v: any) => update('lifestyle', { ...data.lifestyle, routine: v })} />
            <Input label="Social Life Expectation" placeholder="Homebody, social, or balanced?" value={data.lifestyle?.socialLife} onChange={(v: any) => update('lifestyle', { ...data.lifestyle, socialLife: v })} />
            <Input label="Ambition Level" placeholder="What drive should they have?" value={data.lifestyle?.ambition} onChange={(v: any) => update('lifestyle', { ...data.lifestyle, ambition: v })} />
            <Input label="Communication Style" placeholder="Frequent check-ins, independent, balanced?" value={data.lifestyle?.communication} onChange={(v: any) => update('lifestyle', { ...data.lifestyle, communication: v })} />
          </div>
        </motion.div>
      )}

      {part === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <SectionHeader title="Non-Negotiables" description="What is essential to you?" />
          <div className="space-y-8">
            <div>
              <label className="form-label">Must Hold These Values (Min 3)</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {TOP_VALUES.map(val => (
                  <button
                    key={val}
                    onClick={() => {
                        const current = data.nonNegotiableValues || [];
                        if (current.includes(val)) {
                            update('nonNegotiableValues', current.filter(c => c !== val));
                        } else {
                            update('nonNegotiableValues', [...current, val]);
                        }
                    }}
                    className={cn(
                        "px-3 py-1 text-xs border border-meridian-ivory/20 transition-all",
                        data.nonNegotiableValues?.includes(val) ? "bg-meridian-gold text-meridian-navy border-meridian-gold" : "hover:border-meridian-gold"
                    )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
            <Textarea label="Dealbreakers" placeholder="What traits or behaviors will you absolutely NOT tolerate?" value={data.dealbreakers?.join('\n')} onChange={(v: any) => update('dealbreakers', v.split('\n').filter((l: string) => l.trim()))} />
          </div>
        </motion.div>
      )}

      <div className="flex justify-between pt-12 border-t border-meridian-ivory/10">
        <button onClick={part === 1 ? onBack : () => setPart(p => p - 1)} className="flex items-center text-meridian-ivory/60 hover:text-meridian-ivory transition-colors">
          <ChevronLeft size={18} className="mr-2" /> Back
        </button>
        
        {part < 3 ? (
          <button onClick={() => setPart(p => p + 1)} className="btn-primary flex items-center">
            Next <ChevronRight size={18} className="ml-2" />
          </button>
        ) : (
          <button onClick={onNext} className="btn-primary">
            Complete Step 2
          </button>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ title, description }: { title: string, description: string }) {
  return (
    <div className="mb-10">
      <h3 className="text-2xl mb-2">{title}</h3>
      <p className="text-sm text-meridian-ivory/40 font-light">{description}</p>
    </div>
  );
}

function Input({ label, type = "text", value = "", onChange, placeholder }: any) {
  return (
    <div className="w-full space-y-3">
      <label className="form-label">{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder}
        className="form-input" 
      />
    </div>
  );
}

function Textarea({ label, value = "", onChange, placeholder }: any) {
  return (
    <div className="w-full space-y-3">
      <label className="form-label">{label}</label>
      <textarea 
        rows={4}
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder}
        className="form-input resize-none" 
      />
    </div>
  );
}
