
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { OnboardingContainer } from "@/components/onboarding/OnboardingContainer";
import { NameStep } from "@/components/onboarding/NameStep";
import { OnboardingStep, OnboardingForm } from "@/components/onboarding/types";
import { useToast } from "@/hooks/use-toast";

export default function Onboarding() {
  const [step] = useState<OnboardingStep>("name");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<OnboardingForm>({
    defaultValues: {
      firstName: "",
      aiPreferences: {},
    },
  });

  const nextStep = async () => {
    if (!form.getValues("firstName")) {
      form.setError("firstName", { message: "Please enter your name" });
      return;
    }

    try {
      // Save user info to localStorage instead of Supabase
      localStorage.setItem('user_first_name', form.getValues("firstName"));
      localStorage.setItem('onboarding_completed', 'true');
      
      navigate("/home");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error saving your profile",
        description: "Please try again",
        variant: "destructive",
      });
    }
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
