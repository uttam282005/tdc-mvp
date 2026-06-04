export type Gender = "Male" | "Female";
export type MaritalStatus = "Never Married" | "Divorced" | "Awaiting Divorce";
export type Preference = "Yes" | "No" | "Maybe";
export type StatusTag = "Onboarding" | "Searching" | "Matched";

export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dob: string;
  age: number;
  height: number;
  maritalStatus: MaritalStatus;
  country: string;
  city: string;
  religion: string;
  caste: string;
  siblings: number;
  wantKids: Preference;
  income: number;
  undergradCollege: string;
  degree: string;
  currentCompany: string;
  designation: string;
  openToRelocate: Preference;
  openToPets: Preference;
  languagesKnown: string[];
  statusTag: StatusTag;
  assignedClient?: boolean;
  diet?: string;
  familyType?: string;
  manglik?: Preference;
  values?: string[];
  bio?: string;
};

export type MatchSuggestion = Profile & {
  algorithmScore: number;
  matchReasons: string[];
};

export type AiMatchInsight = {
  compatibilityScore: number;
  reasoning: string;
  personalizedIntro: string;
};
