import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { OnboardingContainer } from "@/components/onboarding/OnboardingContainer";
import { NameStep } from "@/components/onboarding/NameStep";
import { OnboardingStep, OnboardingForm } from "@/components/onboarding/types";

export default function Onboarding() {
  const [step] = useState<OnboardingStep>("name");
  const navigate = useNavigate();
  const form = useForm<OnboardingForm>({
    defaultValues: {
      firstName: "",
      aiPreferences: {},
    },
  });

  const nextStep = () => {
    if (!form.getValues("firstName")) {
      form.setError("firstName", { message: "Please enter your name" });
      return;
    }
    navigate("/home");
  };

  return (
    <OnboardingContainer
      step={step}
      form={form}
      nextStep={nextStep}
    >
      <NameStep form={form} />
    </OnboardingContainer>
  );
}