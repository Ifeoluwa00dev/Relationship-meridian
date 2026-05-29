import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { supabase } from './lib/supabase';
import { OnboardingData, PartnerPreferences, CompromiseItem, MediaUrls, Profile } from './types';
import Landing from './components/Landing';
import StepTracker from './components/StepTracker';
import OnboardingForm from './components/OnboardingForm';
import PartnerForm from './components/PartnerForm';
import CompromiseForm from './components/CompromiseForm';
import MediaUpload from './components/MediaUpload';
import SuccessScreen from './components/SuccessScreen';
import ProfileLocked from './components/ProfileLocked';

import Auth from './components/Auth';

type Step = 'landing' | 'auth' | 'onboarding' | 'partner' | 'compromise' | 'media' | 'success' | 'locked';

export default function App() {
  const [step, setStep] = useState<Step>('landing');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleBegin = () => {
    if (currentUser) setStep('onboarding');
    else setStep('auth');
  };

  const handleAuthenticated = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
    setStep('onboarding');
  };
  
  // Form State
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  const [partnerData, setPartnerData] = useState<Partial<PartnerPreferences>>({});
  const [compromises, setCompromises] = useState<CompromiseItem[]>([]);
  const [mediaUrls, setMediaUrls] = useState<Partial<MediaUrls>>({});

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUser(user);
      // Fetch profile if exists
      const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .maybeSingle();

if (profile && !profileError) {
        const now = new Date();
        const lockedUntil = new Date(profile.locked_until);
        if (now < lockedUntil) {
          setStep('locked');
        } else {
          // If returning user, prepopulate or just stay at landing
          setOnboardingData(profile.form_data.onboarding);
          setPartnerData(profile.form_data.partner);
          setCompromises(profile.form_data.compromises);
          setMediaUrls(profile.media_urls);
        }
      }
    }
    setLoading(false);
  }

  const handleNext = () => {
    if (step === 'landing') handleBegin();
    else if (step === 'auth') setStep('onboarding');
    else if (step === 'onboarding') setStep('partner');
    else if (step === 'partner') setStep('compromise');
    else if (step === 'compromise') setStep('media');
    else if (step === 'media') handleSubmit();
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      // Typically we'd handle auth here or before
      return;
    }

    const lockedUntil = new Date();
    lockedUntil.setDate(lockedUntil.getDate() + 14);

    const profileData = {
      id: currentUser.id,
      email: currentUser.email,
      full_name: onboardingData.personal?.fullName,
      age: onboardingData.personal?.age,
      gender: onboardingData.personal?.gender,
      location: `${onboardingData.personal?.location.city}, ${onboardingData.personal?.location.country}`,
      form_data: {
        onboarding: onboardingData,
        partner: partnerData,
        compromises: compromises,
      },
      media_urls: mediaUrls,
      submitted_at: new Date().toISOString(),
      locked_until: lockedUntil.toISOString(),
      is_active: true,
      is_matched: false,
    };

    const { error } = await supabase.from('profiles').upsert(profileData);
    if (!error) {
      setStep('success');
    } else {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-meridian-black">
        <motion.div 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 border border-meridian-gold rounded-full"
        />
      </div>
    );
  }

  const renderSidebar = () => {
    const stageInfo = {
      onboarding: { stage: '01', title: 'The Self', quote: '"Knowing yourself is the beginning of all wisdom."' },
      partner: { stage: '02', title: 'The Vision', quote: '"What you seek is seeking you."' },
      compromise: { stage: '03', title: 'The Balance', quote: '"Harmony is not the absence of difference, but the alignment of intention."' },
      media: { stage: '04', title: 'The Presence', quote: '"Visibility is an act of trust."' },
    }[step as keyof typeof stageInfo] || { stage: '00', title: 'Meridian', quote: '' };

    return (
      <aside className="hidden lg:flex w-80 border-r border-white/5 flex-col justify-between p-12 bg-meridian-rail">
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-meridian-gold text-[10px] uppercase tracking-[0.3em] font-bold">Stage {stageInfo.stage}</p>
            <h1 className="font-serif text-4xl leading-tight text-meridian-text whitespace-pre-line">{stageInfo.title.replace(' ', '\n')}</h1>
          </div>
          <p className="text-sm text-white/50 leading-relaxed font-light italic">
            {stageInfo.quote}
          </p>
        </div>

        <nav className="flex flex-col gap-4">
          {['onboarding', 'partner', 'compromise', 'media'].map((s, idx) => {
            const isActive = step === s;
            const isCompleted = ['onboarding', 'partner', 'compromise', 'media'].indexOf(step) > idx;
            return (
              <div key={s} className={cn("context-rail-item", !isActive && !isCompleted && "opacity-30")}>
                <div className={cn("context-rail-dot", (isActive || isCompleted) ? "bg-meridian-gold" : "bg-white")}></div>
                <span className={cn("text-[11px] uppercase tracking-widest", isActive && "font-semibold text-meridian-gold")}>
                  0{idx +1}. {s === 'onboarding' ? 'Personal Information' : s === 'partner' ? 'Partner Vision' : s === 'compromise' ? 'The Balance' : 'Media Upload'}
                </span>
              </div>
            );
          })}
        </nav>
      </aside>
    );
  };

  return (
    <div className="min-h-screen bg-meridian-black text-meridian-text selection:bg-meridian-gold selection:text-meridian-black flex flex-col">
      <AnimatePresence mode="wait">
        {step === 'landing' || step === 'auth' || step === 'success' || step === 'locked' ? (
          <div className="flex-1 flex flex-col">
            {step === 'landing' && <Landing key="landing" onBegin={handleBegin} />}
            {step === 'auth' && <Auth key="auth" onAuthenticated={handleAuthenticated} />}
            {step === 'success' && <SuccessScreen key="success" />}
            {step === 'locked' && <ProfileLocked key="locked" />}
          </div>
        ) : (
          <div className="flex-1 flex flex-col max-h-screen">
            {/* Header */}
            <header className="h-20 flex items-center justify-between px-12 border-b border-white/5 bg-meridian-deep shrink-0">
              <div className="flex items-center gap-4">
                <span className="font-serif text-2xl tracking-widest text-meridian-gold uppercase">MERIDIAN</span>
                <div className="h-4 w-[1px] bg-white/20"></div>
                <span className="hidden md:block text-[11px] uppercase tracking-[0.2em] text-white/40">The point where everything aligns.</span>
              </div>
              <div className="flex items-center gap-8">
                <StepTracker currentStep={step} />
              </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
              {renderSidebar()}

              <main className="flex-1 overflow-y-auto bg-meridian-black p-8 md:p-16 flex flex-col">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-2xl w-full mx-auto"
                >
                  {step === 'onboarding' && (
                    <OnboardingForm 
                      data={onboardingData} 
                      updateData={setOnboardingData} 
                      onNext={handleNext} 
                    />
                  )}
                  {step === 'partner' && (
                    <PartnerForm 
                      data={partnerData} 
                      updateData={setPartnerData} 
                      onNext={handleNext} 
                      onBack={() => setStep('onboarding')}
                    />
                  )}
                  {step === 'compromise' && (
                    <CompromiseForm 
                      onboarding={onboardingData as OnboardingData}
                      partner={partnerData as PartnerPreferences}
                      items={compromises}
                      setItems={setCompromises}
                      onNext={handleNext}
                      onBack={() => setStep('partner')}
                    />
                  )}
                  {step === 'media' && (
                    <MediaUpload 
                      urls={mediaUrls}
                      setUrls={setMediaUrls}
                      onComplete={handleNext}
                      onBack={() => setStep('compromise')}
                    />
                  )}
                </motion.div>
              </main>
            </div>

            {/* Sub-footer */}
            <footer className="h-12 border-t border-white/5 bg-meridian-deep flex items-center px-12 justify-between shrink-0">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-green-500"></div>
                  <span className="text-[9px] uppercase tracking-tighter text-white/30">Matching Engine Active</span>
                </div>
                <span className="hidden sm:block text-[9px] uppercase tracking-tighter text-white/30">Privacy: Encrypted & Private</span>
              </div>
              <p className="text-[9px] text-white/20">© 2026 Meridian Compatibility. All rights reserved.</p>
            </footer>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
