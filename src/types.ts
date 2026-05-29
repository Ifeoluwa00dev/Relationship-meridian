export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

export interface PersonalInfo {
  fullName: string;
  age: number;
  gender: Gender;
  location: {
    city: string;
    country: string;
  };
  email: string;
}

export interface FamilyBackground {
  origin: string;
  structure: string;
  birthOrder: string;
  relationshipStatus: string;
  familyInvolvementPref: string;
}

export interface FaithSpiritual {
  faith: string;
  activePractice: string;
  sharedFaithRequired: boolean;
  roleInHome: string;
}

export interface HealthInfo {
  physicalHealth: string;
  chronicConditions?: string;
  mentalHealthAwareness: boolean;
  therapyStatus: string;
}

export interface ValuesWorldview {
  topValues: string[];
  conflictHandling: string;
  stressHandling: string;
  loyaltyMeaning: string;
  successDefinition: string;
}

export interface RelationshipContext {
  status: string;
  longestDuration: string;
  lastEndedReason?: string;
  learnedAboutSelf: string;
}

export interface NeedsBoundaries {
  bringToRelationship: string[];
  needFromPartner: string[];
  dealbreakers: string[];
  boundaries: string[];
}

export interface POVTopic {
  position: string;
  explanation: string;
}

export interface POVs {
  finances: POVTopic;
  children: POVTopic;
  relocation: POVTopic;
  roles: POVTopic;
  conflictResolution: POVTopic;
  inLaws: POVTopic;
  faithInHome: POVTopic;
  ambition: POVTopic;
  intimacy: POVTopic;
  socialLife: POVTopic;
}

export interface OnboardingData {
  personal: PersonalInfo;
  family: FamilyBackground;
  faith: FaithSpiritual;
  health: HealthInfo;
  values: ValuesWorldview;
  context: RelationshipContext;
  needs: NeedsBoundaries;
  povs: POVs;
}

export interface PartnerPreferences {
  ageRange: { min: number; max: number };
  gender: Gender[];
  locationPref: string;
  faithRequirement: string;
  familyBackgroundImportance: string;
  tribePreference: string;
  healthExpectation: string;
  mentalHealthImportance: string;
  nonNegotiableValues: string[];
  characterDescription: string;
  povRequirements: {
    [key in keyof POVs]: {
      expectedPosition: string;
      strictness: 'exact' | 'mostly' | 'open';
    }
  };
  lifestyle: {
    routine: string;
    socialLife: string;
    ambition: string;
    communication: string;
  };
  dealbreakers: string[];
  strongPreferences: string[];
}

export interface CompromiseItem {
  id: string;
  type: 'do' | 'dont' | 'requirement';
  text: string;
  isDealbreaker: boolean;
  note?: string;
}

export interface MediaUrls {
  facePhoto: string;
  bodyPhoto: string;
  casualPhoto?: string;
  video?: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  age: number;
  gender: string;
  location: string;
  form_data: {
    onboarding: OnboardingData;
    partner: PartnerPreferences;
    compromises: CompromiseItem[];
  };
  media_urls: MediaUrls;
  submitted_at: string;
  locked_until: string;
  reflection_note?: string;
  is_active: boolean;
  is_matched: boolean;
}

export interface Match {
  id: string;
  profile_a_id: string;
  profile_b_id: string;
  score_a_to_b: number;
  score_b_to_a: number;
  compatibility_brief: string;
  matched_at: string;
  notified_at?: string;
  status: 'pending' | 'notified' | 'mutual' | 'expired';
}
