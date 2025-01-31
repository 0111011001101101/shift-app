import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { OnboardingContainer } from "@/components/onboarding/OnboardingContainer";
import { NameStep } from "@/components/onboarding/NameStep";
import { WorkInfoStep } from "@/components/onboarding/WorkInfoStep";
import { GoalsStep } from "@/components/onboarding/GoalsStep";
import { PreferencesStep } from "@/components/onboarding/PreferencesStep";
import { OnboardingStep, OnboardingForm } from "@/components/onboarding/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function Onboarding() {
  const [step, setStep] = useState<OnboardingStep>("name");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<OnboardingForm>({
    defaultValues: {
      firstName: "",
      aiPreferences: {},
    },
  });

  const nextStep = async () => {
    const currentStep = step;
    
    if (currentStep === "name") {
      if (!form.getValues("firstName")) {
        form.setError("firstName", { message: "Please enter your name" });
        return;
      }
      setStep("work");
    } else if (currentStep === "work") {
      setStep("goals");
    } else if (currentStep === "goals") {
      setStep("preferences");
    } else {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user found");

        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: form.getValues("firstName"),
            ai_preferences: form.getValues("aiPreferences"),
            onboarding_completed: true,
          })
          .eq('id', user.id);

        if (error) throw error;

        toast({
          title: "Welcome to SHIFT!",
          description: "Your preferences have been saved.",
        });

        navigate("/home");
      } catch (error) {
        console.error("Error saving onboarding data:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Please try again.",
        });
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case "name":
        return <NameStep form={form} />;
      case "work":
        return <WorkInfoStep form={form} />;
      case "goals":
        return <GoalsStep form={form} />;
      case "preferences":
        return <PreferencesStep form={form} />;
      default:
        return null;
    }
  };

  return (
    <OnboardingContainer
      step={step}
      form={form}
      nextStep={nextStep}
    >
      {renderStep()}
    </OnboardingContainer>
  );
}