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
    <div className="fixed inset-0 bg-gradient-to-b from-primary-50 via-white to-primary-50/80">
      <div className="min-h-screen flex items-center justify-center p-4 max-w-md mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full space-y-8"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center space-y-6"
          >
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-400 to-accent flex items-center justify-center shadow-xl">
              <User className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-secondary-800">
                {step === "name" ? "Welcome to SHIFT" : "Personalize your experience"}
              </h1>
              <p className="text-secondary-600 text-lg">
                {step === "name" 
                  ? "Let's get to know you better"
                  : "Help us tailor SHIFT to your needs"}
              </p>
            </div>
          </motion.div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: step === "name" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-primary-100/20"
              >
                {step === "name" ? (
                  <FormField
                    control={form.control}
                    name="firstName"
                    rules={{ required: "Please enter your name" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium text-secondary-800">Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your name" 
                            {...field}
                            className="h-12 text-lg bg-white/50"
                          />
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
                          <FormLabel className="text-secondary-800">Country</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your country" 
                              {...field}
                              className="h-12 bg-white/50"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="aiPreferences.age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-secondary-800">Age Range</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., 25-34" 
                              {...field}
                              className="h-12 bg-white/50"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aiPreferences.religion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-secondary-800">Religious/Spiritual Background</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your background" 
                              {...field}
                              className="h-12 bg-white/50"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormDescription className="text-sm text-secondary-600 bg-primary-50/50 p-4 rounded-xl">
                      All fields except name are optional. You can always update these preferences later in your settings.
                    </FormDescription>
                  </div>
                )}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex justify-between pt-4"
              >
                {step !== "name" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("name")}
                    className="bg-white/80 hover:bg-white"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
                <Button
                  type="button"
                  className={`${step === "name" ? "w-full" : "ml-auto"} h-12 text-lg`}
                  onClick={nextStep}
                >
                  {step === "name" ? "Continue" : "Complete Setup"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}