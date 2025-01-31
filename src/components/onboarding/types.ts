export type OnboardingStep = "name" | "work" | "goals" | "preferences";

export interface OnboardingForm {
  firstName: string;
  aiPreferences?: {
    occupation?: string;
    fieldOfWork?: string;
    opportunity?: string;
    workStyle?: string;
    communicationStyle?: string;
    primaryGoal?: string;
    description?: string;
  };
}