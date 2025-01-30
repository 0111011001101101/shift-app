import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { OnboardingContainer } from "@/components/onboarding/OnboardingContainer";
import { NameStep } from "@/components/onboarding/NameStep";
import { BasicInfoStep } from "@/components/onboarding/BasicInfoStep";
import { WorkInfoStep } from "@/components/onboarding/WorkInfoStep";
import { PreferencesStep } from "@/components/onboarding/PreferencesStep";
import { GoalsStep } from "@/components/onboarding/GoalsStep";
import { OnboardingStep, OnboardingForm } from "@/components/onboarding/types";

const steps = [
  "Name",
  "Basic Info",
  "Work",
  "Preferences",
  "Goals"
];

export default function Onboarding() {
  const [step, setStep] = useState<OnboardingStep>("name");
  const navigate = useNavigate();
  const form = useForm<OnboardingForm>({
    defaultValues: {
      firstName: "",
      aiPreferences: {},
    },
  });

  const getCurrentStepIndex = () => {
    switch (step) {
      case "name": return 0;
      case "basic_info": return 1;
      case "work_info": return 2;
      case "preferences": return 3;
      case "goals": return 4;
      default: return 0;
    }
  };

  const nextStep = () => {
    if (step === "name") {
      if (!form.getValues("firstName")) {
        form.setError("firstName", { message: "Please enter your name" });
        return;
      }
      setStep("basic_info");
    } else if (step === "basic_info") {
      setStep("work_info");
    } else if (step === "work_info") {
      setStep("preferences");
    } else if (step === "preferences") {
      setStep("goals");
    } else {
      navigate("/home");
    }
  };

  const prevStep = () => {
    if (step === "basic_info") {
      setStep("name");
    } else if (step === "work_info") {
      setStep("basic_info");
    } else if (step === "preferences") {
      setStep("work_info");
    } else if (step === "goals") {
      setStep("preferences");
    }
  };

  const skipPersonalization = () => {
    navigate("/home");
  };

  const renderStepContent = () => {
    switch (step) {
      case "name":
        return <NameStep form={form} />;
      case "basic_info":
        return <BasicInfoStep form={form} />;
      case "work_info":
        return <WorkInfoStep form={form} />;
      case "preferences":
        return <PreferencesStep form={form} />;
      case "goals":
        return <GoalsStep form={form} />;
      default:
        return null;
    }
  };

  return (
    <OnboardingContainer
      step={step}
      form={form}
      steps={steps}
      getCurrentStepIndex={getCurrentStepIndex}
      nextStep={nextStep}
      prevStep={prevStep}
      skipPersonalization={skipPersonalization}
    >
      {renderStepContent()}
    </OnboardingContainer>
  );
}