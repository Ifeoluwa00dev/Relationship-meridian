import React, { useState } from 'react';
import { motion } from 'motion/react';
import { OnboardingData, Gender } from '../types';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingFormProps {
  data: Partial<OnboardingData>;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const TOP_VALUES = [
  'Integrity', 'Loyalty', 'Faith', 'Family', 'Ambition', 'Compassion', 
  'Honesty', 'Freedom', 'Growth', 'Service', 'Stability', 'Adventure', 
  'Creativity', 'Respect', 'Wisdom'
];

export default function OnboardingForm({ data, updateData, onNext }: OnboardingFormProps) {
  const [part, setPart] = useState(1);

  const update = (section: keyof OnboardingData, field: string, value: any) => {
    updateData({
      ...data,
      [section]: {
        ...(data[section] as any),
        [field]: value
      }
    });
  };

  const nextPart = () => setPart(p => p + 1);
  const prevPart = () => setPart(p => p - 1);

  return (
    <div className="space-y-12">
      {part === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <SectionHeader title="Personal" description="The basics of who you are." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input label="Full Name" value={data.personal?.fullName} onChange={v => update('personal', 'fullName', v)} />
            <Input label="Age" type="number" value={data.personal?.age} onChange={v => update('personal', 'age', parseInt(v))} />
            <div>
              <label className="form-label">Gender</label>
              <select 
                className="form-input bg-meridian-navy" 
                value={data.personal?.gender} 
                onChange={e => update('personal', 'gender', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
              </select>
            </div>
            <Input label="Email" type="email" value={data.personal?.email} onChange={v => update('personal', 'email', v)} />
            <Input label="City" value={data.personal?.location?.city} onChange={v => update('personal', 'location', { ...data.personal?.location, city: v })} />
            <Input label="Country" value={data.personal?.location?.country} onChange={v => update('personal', 'location', { ...data.personal?.location, country: v })} />
          </div>
        </motion.div>
      )}

      {part === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <SectionHeader title="Family & Background" description="Your roots and current dynamics." />
          <div className="space-y-8">
            <Input label="Country/Tribe of Origin" value={data.family?.origin} onChange={v => update('family', 'origin', v)} />
            <Input label="Family structure growing up" placeholder="e.g. Both parents, single parent..." value={data.family?.structure} onChange={v => update('family', 'structure', v)} />
            <Input label="Birth Order" placeholder="Firstborn, Middle, Last, Only" value={data.family?.birthOrder} onChange={v => update('family', 'birthOrder', v)} />
            <Input label="Current Relationship with Family" placeholder="Close, distant, complicated..." value={data.family?.relationshipStatus} onChange={v => update('family', 'relationshipStatus', v)} />
          </div>
        </motion.div>
      )}

      {part === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <SectionHeader title="Values & Worldview" description="What drives your life and choices." />
          <div className="space-y-8">
            <div>
              <label className="form-label">Top 5 Values</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {TOP_VALUES.map(val => (
                  <button
                    key={val}
                    onClick={() => {
                        const current = data.values?.topValues || [];
                        if (current.includes(val)) {
                            update('values', 'topValues', current.filter(c => c !== val));
                        } else if (current.length < 5) {
                            update('values', 'topValues', [...current, val]);
                        }
                    }}
                    className={cn(
                        "px-4 py-2 rounded-full text-xs transition-all border",
                        data.values?.topValues?.includes(val) 
                          ? "bg-meridian-gold/10 border-meridian-gold/30 text-meridian-gold" 
                          : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                    )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
            <Textarea label="How do you handle conflict?" value={data.values?.conflictHandling} onChange={v => update('values', 'conflictHandling', v)} />
            <Textarea label="What does loyalty mean to you?" value={data.values?.loyaltyMeaning} onChange={v => update('values', 'loyaltyMeaning', v)} />
          </div>
        </motion.div>
      )}

      {/* POV Sections - Step 4 */}
      {part === 4 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <SectionHeader title="Point Of View (1/2)" description="Where you stand on serious life topics." />
          <div className="space-y-12">
            <POVField 
                label="Finances" 
                description="Joint accounts, separate, or hybrid? Who provides?"
                value={data.povs?.finances}
                onChange={(v: any) => update('povs', 'finances', v)}
            />
            <POVField 
                label="Children" 
                description="Do you want them? How many? Timing?"
                value={data.povs?.children}
                onChange={(v: any) => update('povs', 'children', v)}
            />
            <POVField 
                label="Relocation" 
                description="Willing to move for a partner?"
                value={data.povs?.relocation}
                onChange={(v: any) => update('povs', 'relocation', v)}
            />
            <POVField 
                label="Roles" 
                description="Traditional, equal partnership, or fluid?"
                value={data.povs?.roles}
                onChange={(v: any) => update('povs', 'roles', v)}
            />
          </div>
        </motion.div>
      )}

      {part === 5 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <SectionHeader title="Point Of View (2/2)" description="Deepening the alignment." />
          <div className="space-y-12">
            <POVField 
                label="Conflict Resolution" 
                description="How do you fight? How do you reconcile?"
                value={data.povs?.conflictResolution}
                onChange={(v: any) => update('povs', 'conflictResolution', v)}
            />
            <POVField 
                label="In-laws & Family" 
                description="How involved should they be in your daily life?"
                value={data.povs?.inLaws}
                onChange={(v: any) => update('povs', 'inLaws', v)}
            />
            <POVField 
                label="Ambition & Career" 
                description="How does work fit into relationship priorities?"
                value={data.povs?.ambition}
                onChange={(v: any) => update('povs', 'ambition', v)}
            />
            <POVField 
                label="Intimacy & Affection" 
                description="Love languages — how do you give and receive?"
                value={data.povs?.intimacy}
                onChange={(v: any) => update('povs', 'intimacy', v)}
            />
            <POVField 
                label="Social Life" 
                description="Homebody, social, or balanced? Expectations?"
                value={data.povs?.socialLife}
                onChange={(v: any) => update('povs', 'socialLife', v)}
            />
          </div>
        </motion.div>
      )}

      <div className="flex justify-between pt-12 border-t border-meridian-ivory/10">
        {part > 1 ? (
          <button onClick={prevPart} className="flex items-center text-meridian-ivory/60 hover:text-meridian-ivory transition-colors">
            <ChevronLeft size={18} className="mr-2" /> Back
          </button>
        ) : <div />}
        
        {part < 5 ? (
          <button onClick={nextPart} className="btn-primary flex items-center">
            Next <ChevronRight size={18} className="ml-2" />
          </button>
        ) : (
          <button onClick={onNext} className="btn-primary">
            Complete Step 1
          </button>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ title, description }: { title: string, description: string }) {
  return (
    <div className="mb-12">
      <h3 className="text-3xl font-serif mb-3 text-white/90">{title}</h3>
      <p className="text-sm text-white/40 font-light leading-relaxed max-w-md">{description}</p>
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

function Textarea({ label, value = "", onChange }: any) {
  return (
    <div className="w-full space-y-3">
      <label className="form-label">{label}</label>
      <textarea 
        rows={3}
        value={value} 
        onChange={e => onChange(e.target.value)} 
        className="form-input resize-none" 
      />
    </div>
  );
}

function POVField({ label, description, value, onChange }: any) {
    return (
        <div className="space-y-4">
            <div>
                <h4 className="text-meridian-ivory font-medium">{label}</h4>
                <p className="text-xs text-meridian-ivory/40 mt-1">{description}</p>
            </div>
            <div className="space-y-4">
                <input 
                    placeholder="Your position..."
                    value={value?.position || ''} 
                    onChange={e => onChange({ ...value, position: e.target.value })}
                    className="form-input italic"
                />
                <textarea 
                    placeholder="Briefly explain your view..."
                    value={value?.explanation || ''} 
                    onChange={e => onChange({ ...value, explanation: e.target.value })}
                    className="form-input text-sm resize-none"
                    rows={2}
                />
            </div>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
