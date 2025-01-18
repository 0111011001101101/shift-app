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
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type OnboardingStep = "name" | "standUpTime" | "aiPreferences";

interface OnboardingForm {
  firstName: string;
  lastName: string;
  standUpTime: string;
  aiPreferences?: {
    tone?: string;
    gender?: string;
    age?: string;
    religion?: string;
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
      lastName: "",
      standUpTime: "09:00",
      aiPreferences: {},
    },
  });

  const onSubmit = async (data: OnboardingForm) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          stand_up_time: data.standUpTime,
          ai_preferences: data.aiPreferences,
          onboarding_completed: true,
        })
        .eq("id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Welcome to SHIFT!",
        description: "Your preferences have been saved.",
      });

      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
      });
    }
  };

  const nextStep = () => {
    switch (step) {
      case "name":
        setStep("standUpTime");
        break;
      case "standUpTime":
        setStep("aiPreferences");
        break;
      case "aiPreferences":
        form.handleSubmit(onSubmit)();
        break;
    }
  };

  const prevStep = () => {
    switch (step) {
      case "standUpTime":
        setStep("name");
        break;
      case "aiPreferences":
        setStep("standUpTime");
        break;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            {step === "name" && "Let's get to know you"}
            {step === "standUpTime" && "When do you start your day?"}
            {step === "aiPreferences" && "Personalize your AI coach"}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {step === "name" && "This helps us personalize your experience"}
            {step === "standUpTime" && "We'll send you a reminder for your daily stand-up"}
            {step === "aiPreferences" && "Optional: Help your AI coach understand you better"}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === "name" && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === "standUpTime" && (
              <FormField
                control={form.control}
                name="standUpTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stand-up Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {step === "aiPreferences" && (
              <div className="space-y-6">
                <p className="text-sm text-gray-500">
                  Share any preferences that would help your AI coach better understand and support you.
                  This is completely optional and can be updated later.
                </p>
                
                <FormField
                  control={form.control}
                  name="aiPreferences.tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Communication Style</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="friendly" id="friendly" />
                                <FormLabel htmlFor="friendly" className="font-normal">
                                  Friendly
                                </FormLabel>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="professional" id="professional" />
                                <FormLabel htmlFor="professional" className="font-normal">
                                  Professional
                                </FormLabel>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="direct" id="direct" />
                                <FormLabel htmlFor="direct" className="font-normal">
                                  Direct
                                </FormLabel>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="casual" id="casual" />
                                <FormLabel htmlFor="casual" className="font-normal">
                                  Casual
                                </FormLabel>
                              </div>
                            </FormControl>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aiPreferences.gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your gender" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aiPreferences.age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age Range (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 25-34" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aiPreferences.religion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Religious/Spiritual Background (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your religious/spiritual background" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aiPreferences.culture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cultural Background (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your cultural background" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex justify-between pt-4">
              {step !== "name" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              <Button
                type="button"
                className="ml-auto"
                onClick={nextStep}
              >
                {step === "aiPreferences" ? "Complete" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}