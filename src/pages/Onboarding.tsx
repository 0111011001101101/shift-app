import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProgressIndicator } from "@/components/stand-up/ProgressIndicator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, ArrowLeft, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type OnboardingStep = 
  | "name" 
  | "basic_info"
  | "work_info"
  | "preferences"
  | "goals";

interface OnboardingForm {
  firstName: string;
  aiPreferences?: {
    age?: string;
    religion?: string;
    ethnicity?: string;
    gender?: string;
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
        return (
          <motion.div
            variants={itemVariants}
            className="w-full max-w-sm mx-auto"
          >
            <FormField
              control={form.control}
              name="firstName"
              rules={{ required: "Please enter your name" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-secondary-800">
                    What's your name?
                  </FormLabel>
                  <FormDescription className="text-secondary-600">
                    This helps us personalize your experience
                  </FormDescription>
                  <FormControl>
                    <Input 
                      placeholder="Enter your name" 
                      {...field}
                      className="h-14 text-base bg-white/80 backdrop-blur-sm rounded-xl border-secondary-200
                               focus:border-primary-400 focus:ring-primary-400/20 shadow-lg
                               placeholder:text-secondary-400 transition-all duration-300"
                    />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />
          </motion.div>
        );
      case "basic_info":
        return (
          <div className="space-y-6 rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-xl border border-primary-100/30">
            <FormField
              control={form.control}
              name="aiPreferences.age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-secondary-800">Age</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Your age" 
                      {...field}
                      className="h-12 text-base bg-white rounded-xl border-secondary-200
                               focus:border-primary-400 focus:ring-primary-400/20
                               placeholder:text-secondary-400"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aiPreferences.gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-secondary-800">Gender</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your gender identity" 
                      {...field}
                      className="h-12 text-base bg-white rounded-xl border-secondary-200
                               focus:border-primary-400 focus:ring-primary-400/20
                               placeholder:text-secondary-400"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aiPreferences.country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-secondary-800">Country</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your country" 
                      {...field}
                      className="h-12 text-base bg-white rounded-xl border-secondary-200
                               focus:border-primary-400 focus:ring-primary-400/20
                               placeholder:text-secondary-400"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        );
      case "work_info":
        return (
          <div className="space-y-6 rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-xl border border-primary-100/30">
            <FormField
              control={form.control}
              name="aiPreferences.occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-secondary-800">Occupation</FormLabel>
                  <FormDescription>Your current role or position</FormDescription>
                  <FormControl>
                    <Input 
                      placeholder="E.g., Entrepreneur, Manager, Developer..." 
                      {...field}
                      className="h-12 text-base bg-white rounded-xl border-secondary-200
                               focus:border-primary-400 focus:ring-primary-400/20
                               placeholder:text-secondary-400"
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
                  <FormLabel className="text-base font-semibold text-secondary-800">Field of Work</FormLabel>
                  <FormDescription>Your industry or area of expertise</FormDescription>
                  <FormControl>
                    <Input 
                      placeholder="E.g., Technology, Healthcare, Education..." 
                      {...field}
                      className="h-12 text-base bg-white rounded-xl border-secondary-200
                               focus:border-primary-400 focus:ring-primary-400/20
                               placeholder:text-secondary-400"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        );
      case "preferences":
        return (
          <div className="space-y-6 rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-xl border border-primary-100/30">
            <FormField
              control={form.control}
              name="aiPreferences.workStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-secondary-800">How do you prefer to work?</FormLabel>
                  <FormDescription>This helps us tailor our suggestions</FormDescription>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-white rounded-xl">
                        <SelectValue placeholder="Select your work style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
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
                  <FormLabel className="text-base font-semibold text-secondary-800">Preferred communication style</FormLabel>
                  <FormDescription>How would you like SHIFT to communicate with you?</FormDescription>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-white rounded-xl">
                        <SelectValue placeholder="Select communication style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="direct">Direct and concise</SelectItem>
                      <SelectItem value="detailed">Detailed and thorough</SelectItem>
                      <SelectItem value="casual">Casual and friendly</SelectItem>
                      <SelectItem value="motivational">Motivational and encouraging</SelectItem>
                      <SelectItem value="analytical">Analytical and logical</SelectItem>
                      <SelectItem value="empathetic">Empathetic and understanding</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        );
      case "goals":
        return (
          <div className="space-y-6 rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-xl border border-primary-100/30">
            <FormField
              control={form.control}
              name="aiPreferences.primaryGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-secondary-800">What's your primary goal?</FormLabel>
                  <FormDescription>This helps us focus on what matters most to you</FormDescription>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-white rounded-xl">
                        <SelectValue placeholder="Select your main goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="productivity">Improve productivity</SelectItem>
                      <SelectItem value="balance">Better work-life balance</SelectItem>
                      <SelectItem value="growth">Personal/Professional growth</SelectItem>
                      <SelectItem value="stress">Stress management</SelectItem>
                      <SelectItem value="leadership">Leadership development</SelectItem>
                      <SelectItem value="purpose">Finding purpose/meaning</SelectItem>
                      <SelectItem value="relationships">Improving relationships</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aiPreferences.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-secondary-800">Tell more about yourself</FormLabel>
                  <FormDescription>
                    Share anything that would help us understand you better
                  </FormDescription>
                  <FormControl>
                    <Textarea 
                      placeholder="Share your story, goals, challenges, or anything else..." 
                      {...field}
                      className="min-h-[100px] bg-white rounded-xl resize-none border-secondary-200
                               focus:border-primary-400 focus:ring-primary-400/20
                               placeholder:text-secondary-400"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-accent/10">
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="min-h-screen flex flex-col"
        >
          <motion.nav 
            variants={itemVariants}
            className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-black/[0.02]"
          >
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary-500 to-accent text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <ArrowUp className="w-5 h-5" strokeWidth={2} />
              </div>
              <span className="font-medium tracking-tight text-black">SHIFT</span>
            </div>
          </motion.nav>

          <div className="flex-1 px-6 pt-24 pb-32 max-w-lg mx-auto w-full">
            <ProgressIndicator steps={steps} currentStep={getCurrentStepIndex()} />
            
            <motion.div 
              variants={itemVariants}
              className="text-center space-y-3 mb-12"
            >
              <Form {...form}>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                  <motion.div
                    variants={itemVariants}
                    className="space-y-6"
                  >
                    {renderStepContent()}
                  </motion.div>

                  <motion.div 
                    variants={itemVariants}
                    className="fixed bottom-0 left-0 right-0 w-full bg-white/80 backdrop-blur-xl border-t border-black/[0.02]"
                  >
                    <div className="max-w-lg mx-auto px-6 py-4 space-y-3">
                      <div className="flex gap-3">
                        {step !== "name" && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            className="h-14 px-4 bg-white text-base font-medium flex-1
                                     border-secondary-200 hover:bg-secondary-50
                                     text-secondary-700 hover:text-secondary-800
                                     shadow-lg hover:shadow-xl transition-all rounded-xl"
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                          </Button>
                        )}
                        <Button
                          type="button"
                          onClick={nextStep}
                          className={`${step === "name" ? "w-full" : "flex-1"} h-14 px-6 text-base font-medium
                                    bg-gradient-to-r from-primary-600 to-accent text-white 
                                    hover:opacity-90 active:opacity-95
                                    transition-all duration-300 shadow-lg hover:shadow-xl
                                    rounded-xl active:scale-[0.98]`}
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
                          className="w-full h-14 px-4 bg-white hover:bg-secondary-50 text-base 
                                   font-medium border-secondary-200 text-secondary-600 
                                   hover:text-secondary-700 shadow-lg hover:shadow-xl transition-all
                                   rounded-xl active:scale-[0.98]"
                        >
                          Skip for now
                        </Button>
                      )}
                    </div>
                  </motion.div>
                </form>
              </Form>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}