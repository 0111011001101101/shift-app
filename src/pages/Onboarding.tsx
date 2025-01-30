import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ProgressIndicator } from "@/components/stand-up/ProgressIndicator";
import { ArrowRight, ArrowLeft, Sparkles, Rocket, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NameStep } from "@/components/onboarding/NameStep";
import { BasicInfoStep } from "@/components/onboarding/BasicInfoStep";
import { containerVariants } from "@/components/onboarding/animations";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type OnboardingStep = "name" | "basic_info" | "work_info" | "preferences" | "goals";

interface OnboardingForm {
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
        return (
          <div className="space-y-8 rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-xl border border-primary-100/30">
            <div className="flex justify-center">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 text-primary-500">
                <Rocket className="w-8 h-8" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-secondary-800">Your Professional World</h2>
              <p className="text-secondary-600">Understanding your work helps us provide relevant strategies</p>
            </div>
            <FormField
              control={form.control}
              name="aiPreferences.occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-secondary-800">What's your role?</FormLabel>
                  <FormDescription>Each role comes with its unique challenges</FormDescription>
                  <FormControl>
                    <Input 
                      placeholder="E.g., Entrepreneur, Manager, Developer..." 
                      {...field}
                      className="h-12 text-base bg-white rounded-xl"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aiPreferences.fieldOfWork"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-secondary-800">Your Industry</FormLabel>
                  <FormDescription>Different industries face different pressures</FormDescription>
                  <FormControl>
                    <Input 
                      placeholder="E.g., Technology, Healthcare, Education..." 
                      {...field}
                      className="h-12 text-base bg-white rounded-xl"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        );
      case "preferences":
        return (
          <div className="space-y-8 rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-xl border border-primary-100/30">
            <div className="flex justify-center">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 text-primary-500">
                <Target className="w-8 h-8" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-secondary-800">Your Work Style</h2>
              <p className="text-secondary-600">Help us match our approach to your preferences</p>
            </div>
            <FormField
              control={form.control}
              name="aiPreferences.workStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-secondary-800">How do you prefer to work?</FormLabel>
                  <FormDescription>We'll adapt our suggestions to match your style</FormDescription>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-white rounded-xl">
                        <SelectValue placeholder="Select your work style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border-secondary-200">
                      <SelectItem value="structured">I like structure and planning</SelectItem>
                      <SelectItem value="flexible">I prefer flexibility and adaptability</SelectItem>
                      <SelectItem value="balanced">I aim for a balance of both</SelectItem>
                      <SelectItem value="deadline">I work best under deadlines</SelectItem>
                      <SelectItem value="creative">I need creative freedom</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aiPreferences.communicationStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-secondary-800">Communication preference</FormLabel>
                  <FormDescription>How would you like SHIFT to interact with you?</FormDescription>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-white rounded-xl">
                        <SelectValue placeholder="Select communication style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border-secondary-200">
                      <SelectItem value="direct">Direct and concise</SelectItem>
                      <SelectItem value="detailed">Detailed and thorough</SelectItem>
                      <SelectItem value="casual">Casual and friendly</SelectItem>
                      <SelectItem value="motivational">Motivational and encouraging</SelectItem>
                      <SelectItem value="analytical">Analytical and logical</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        );
      case "goals":
        return (
          <div className="space-y-12">
            <div className="flex justify-center">
              <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary-400 via-primary-500 to-accent 
                            shadow-xl shadow-primary-500/20 animate-float">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
                           from-primary-600 via-primary-500 to-accent leading-tight tracking-tight">
                Almost there!
              </h2>
              <p className="text-xl text-secondary-600">Let's focus on what matters most to you</p>
            </div>
            <FormField
              control={form.control}
              name="aiPreferences.primaryGoal"
              render={({ field }) => (
                <FormItem className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl 
                                   border border-primary-100/30 space-y-6">
                  <FormLabel className="text-2xl font-bold text-secondary-800">
                    What's your main focus?
                  </FormLabel>
                  <FormDescription className="text-lg text-secondary-600">
                    This helps us prioritize what's important to you
                  </FormDescription>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-14 bg-white/90 rounded-xl text-base border-secondary-200
                                              focus:border-primary-400 focus:ring-primary-400/20">
                        <SelectValue placeholder="Select your main goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border-secondary-200">
                      <SelectItem value="productivity">Boost productivity & focus</SelectItem>
                      <SelectItem value="balance">Better work-life harmony</SelectItem>
                      <SelectItem value="growth">Accelerate personal growth</SelectItem>
                      <SelectItem value="stress">Master stress & energy</SelectItem>
                      <SelectItem value="leadership">Level up leadership</SelectItem>
                      <SelectItem value="purpose">Find deeper purpose</SelectItem>
                      <SelectItem value="relationships">Strengthen relationships</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aiPreferences.description"
              render={({ field }) => (
                <FormItem className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl 
                                   border border-primary-100/30 space-y-6">
                  <FormLabel className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
                                      from-primary-600 via-primary-500 to-accent leading-tight tracking-tight">
                    Other things about you that you want to share?
                  </FormLabel>
                  <FormDescription className="text-lg text-secondary-600">
                    Share any specific challenges or goals you'd like help with
                  </FormDescription>
                  <FormControl>
                    <Textarea 
                      placeholder="E.g., I want to grow my business while maintaining work-life balance..." 
                      {...field}
                      className="min-h-[140px] bg-white/90 rounded-xl resize-none border-secondary-200
                               focus:border-primary-400 focus:ring-primary-400/20 text-base"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900/5 via-white/90 to-primary-50/30">
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="min-h-screen flex flex-col relative pb-[80px]"
        >
          <div className="flex-1 px-4 pt-6 max-w-md mx-auto w-full">
            <ProgressIndicator steps={steps} currentStep={getCurrentStepIndex()} />
            
            <motion.div className="mt-8">
              <Form {...form}>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  {renderStepContent()}
                </form>
              </Form>
            </motion.div>
          </div>

          <motion.div 
            className="fixed bottom-0 left-0 right-0 w-full bg-white/60 backdrop-blur-md 
                      border-t border-secondary-200/30"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="max-w-md mx-auto px-4 py-3 space-y-2">
              <div className="flex gap-2">
                {step !== "name" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="h-10 px-4 bg-white/80 text-sm font-medium flex-1
                             border-secondary-200/30 hover:bg-secondary-50
                             text-secondary-700 hover:text-secondary-800
                             shadow-sm hover:shadow-md transition-all rounded-lg"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={nextStep}
                  className={`${step === "name" ? "w-full" : "flex-1"} h-10 px-4 text-sm font-medium
                            bg-gradient-to-r from-primary-600/90 to-accent/90 text-white 
                            hover:opacity-90 active:opacity-95
                            transition-all duration-300 shadow-sm hover:shadow-md
                            rounded-lg active:scale-[0.98]`}
                >
                  {step === "goals" ? "Complete Setup" : "Continue"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              {step !== "name" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={skipPersonalization}
                  className="w-full h-9 px-4 bg-white/80 hover:bg-secondary-50 text-sm 
                           font-medium border-secondary-200/30 text-secondary-600 
                           hover:text-secondary-700 shadow-sm hover:shadow-md transition-all
                           rounded-lg active:scale-[0.98]"
                >
                  Skip for now
                </Button>
              )}
              {step !== "name" && (
                <p className="text-xs text-center text-secondary-500/80">
                  You can always update these preferences later in settings
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}