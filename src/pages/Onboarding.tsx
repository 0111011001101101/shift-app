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
import { ArrowRight, ArrowLeft, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type OnboardingStep = "name" | "personalization";

interface OnboardingForm {
  firstName: string;
  aiPreferences?: {
    age?: string;
    religion?: string;
    country?: string;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

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
      if (!form.getValues("firstName")) {
        form.setError("firstName", { message: "Please enter your name" });
        return;
      }
      setStep("personalization");
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-50/90 via-white to-primary-50/80">
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="min-h-screen flex flex-col items-center justify-center p-6"
        >
          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center gap-3"
            >
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-400 to-accent shadow-xl
                            hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 group">
                <ArrowUp className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-110" 
                        strokeWidth={2.5} />
              </div>
              <span className="text-3xl font-semibold tracking-tight text-secondary-800">SHIFT</span>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="text-center space-y-3"
            >
              <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent 
                           bg-gradient-to-r from-primary-600 via-primary-500 to-accent">
                {step === "name" ? "Welcome to SHIFT" : "Personalize your experience"}
              </h1>
              <p className="text-secondary-600 text-lg">
                {step === "name" 
                  ? "Let's start with your name"
                  : "Help us tailor SHIFT to your needs (optional)"}
              </p>
            </motion.div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <motion.div
                  variants={itemVariants}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-primary-100/20
                           hover:shadow-xl transition-all duration-300"
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
                              className="h-14 text-lg bg-white/50 rounded-xl"
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
                                className="h-12 bg-white/50 rounded-xl"
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
                                className="h-12 bg-white/50 rounded-xl"
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
                                className="h-12 bg-white/50 rounded-xl"
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
                  variants={itemVariants}
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
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}