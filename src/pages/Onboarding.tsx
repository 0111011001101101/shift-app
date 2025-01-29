import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft, User } from "lucide-react";
import { motion } from "framer-motion";

type OnboardingStep = "name" | "personalization";

interface OnboardingForm {
  firstName: string;
  aiPreferences?: {
    age?: string;
    religion?: string;
    country?: string;
    culture?: string;
  };
}

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

  const onSubmit = async (data: OnboardingForm) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: data.firstName,
          ai_preferences: data.aiPreferences,
          onboarding_completed: true,
        })
        .eq("id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Welcome to SHIFT!",
        description: "Your preferences have been saved.",
      });

      navigate("/home");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
      });
    }
  };

  const nextStep = () => {
    if (step === "name") {
      setStep("personalization");
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 via-white to-primary-50/80 p-4">
      <div className="w-full max-w-md space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 via-primary-400 to-accent shadow-sm flex items-center justify-center">
            <User className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-secondary-800">
            {step === "name" ? "Welcome!" : "Personalize your experience"}
          </h2>
          <p className="text-secondary-600">
            {step === "name" 
              ? "Let's get to know you better"
              : "Optional: Help us tailor SHIFT to your needs"}
          </p>
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: step === "name" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {step === "name" ? (
                <FormField
                  control={form.control}
                  name="firstName"
                  rules={{ required: "Please enter your name" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="aiPreferences.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Your country (optional)" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="aiPreferences.age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age Range</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 25-34 (optional)" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aiPreferences.religion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Religious/Spiritual Background</FormLabel>
                        <FormControl>
                          <Input placeholder="Your background (optional)" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormDescription className="text-sm text-secondary-600">
                    You can always update these preferences later in your settings.
                  </FormDescription>
                </div>
              )}
            </motion.div>

            <div className="flex justify-between pt-4">
              {step !== "name" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("name")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              <Button
                type="button"
                className={step === "name" ? "w-full" : "ml-auto"}
                onClick={nextStep}
              >
                {step === "name" ? "Continue" : "Complete"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}