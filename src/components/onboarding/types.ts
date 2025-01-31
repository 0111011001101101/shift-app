export type OnboardingStep = "name";

export interface OnboardingForm {
  firstName: string;
  aiPreferences?: {
    age?: string;
    gender?: string;
    ethnicity?: string;
    religion?: string;
    country?: string;
    workStyle?: string;
    communicationStyle?: string;
    primaryGoal?: string;
    description?: string;
    occupation?: string;
    fieldOfWork?: string;
  };
}