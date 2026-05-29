import React from 'react';

interface StepTrackerProps {
  currentStep: string;
}

export default function StepTracker({ currentStep }: StepTrackerProps) {
  const steps = ['onboarding', 'partner', 'compromise', 'media'];
  const currentIndex = steps.indexOf(currentStep);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="flex flex-col items-end">
      <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Total Progress</span>
      <div className="w-48 h-[2px] bg-white/10 overflow-hidden">
        <div 
          className="h-full bg-meridian-gold transition-all duration-700 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
