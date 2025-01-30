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
import { ArrowRight, ArrowLeft, Sparkles, Rocket, Target, Brain, User } from "lucide-react";
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
            className="w-full max-w-sm mx-auto space-y-6"
          >
            <div className="flex justify-center">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-secondary-50 to-secondary-100/50 text-secondary-600">
                <User className="w-8 h-8" />
              </div>
            </div>
            <FormField
              control={form.control}
              name="firstName"
              rules={{ required: "Please enter your name" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold text-secondary-800">
                    Hey there! What should we call you?
                  </FormLabel>
                  <FormDescription className="text-secondary-600">
                    We'll use your name to make your experience more personal
                  </FormDescription>
                  <FormControl>
                    <Input 
                      placeholder="Your name" 
                      {...field}
                      className="h-12 text-lg bg-white/80 backdrop-blur-sm rounded-xl border-secondary-200
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
          <div className="space-y-8 rounded-2xl bg-white/90 backdrop-blur-xl p-6 shadow-lg border border-primary-100/30">
            <div className="flex justify-center">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 text-primary-500">
                <Brain className="w-8 h-8" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-secondary-800">
                Hi {form.getValues("firstName")}! Tell us about yourself
              </h2>
              <p className="text-secondary-600">This helps us understand you better</p>
            </div>
            
            {/* Age Range - First question */}
            <FormField
              control={form.control}
              name="aiPreferences.age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-secondary-800">Age Range</FormLabel>
                  <FormDescription>Different life stages come with different challenges</FormDescription>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-white rounded-xl">
                        <SelectValue placeholder="Select your age range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border-secondary-200">
                      <SelectItem value="18-24">18-24 years</SelectItem>
                      <SelectItem value="25-34">25-34 years</SelectItem>
                      <SelectItem value="35-44">35-44 years</SelectItem>
                      <SelectItem value="45-54">45-54 years</SelectItem>
                      <SelectItem value="55+">55+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="aiPreferences.gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-secondary-800">Gender</FormLabel>
                  <FormDescription>Help us use appropriate pronouns</FormDescription>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-white rounded-xl">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border-secondary-200">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Location Information Group */}
            <div className="space-y-6 pt-4 border-t border-secondary-100">
              <FormField
                control={form.control}
                name="aiPreferences.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-secondary-800">Where are you based?</FormLabel>
                    <FormDescription>Cultural context helps us provide relevant support</FormDescription>
                    <FormControl>
                      <Input 
                        placeholder="Your country" 
                        {...field}
                        className="h-12 text-base bg-white rounded-xl"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aiPreferences.ethnicity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-secondary-800">Ethnicity</FormLabel>
                    <FormDescription>For culturally relevant support</FormDescription>
                    <FormControl>
                      <Input 
                        placeholder="Your ethnicity" 
                        {...field}
                        className="h-12 text-base bg-white rounded-xl"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Religion/Spirituality */}
            <div className="space-y-6 pt-4 border-t border-secondary-100">
              <FormField
                control={form.control}
                name="aiPreferences.religion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-secondary-800">Religion/Spirituality</FormLabel>
                    <FormDescription>For value-aligned guidance</FormDescription>
                    <FormControl>
                      <Input 
                        placeholder="Your religion or spiritual practice" 
                        {...field}
                        className="h-12 text-base bg-white rounded-xl"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        );
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
          <div className="space-y-8 rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-xl border border-primary-100/30">
            <div className="flex justify-center">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 text-primary-500">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-secondary-800">Almost there!</h2>
              <p className="text-secondary-600">Let's focus on what matters most to you</p>
            </div>
            <FormField
              control={form.control}
              name="aiPreferences.primaryGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-secondary-800">What's your main focus?</FormLabel>
                  <FormDescription>This helps us prioritize what's important to you</FormDescription>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-white rounded-xl">
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
                <FormItem>
                  <FormLabel className="text-base font-semibold text-secondary-800">Anything else we should know?</FormLabel>
                  <FormDescription>
                    Share any specific challenges or goals you'd like help with
                  </FormDescription>
                  <FormControl>
                    <Textarea 
                      placeholder="E.g., I want to grow my business while maintaining work-life balance..." 
                      {...field}
                      className="min-h-[100px] bg-white rounded-xl resize-none"
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
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50/50">
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="min-h-screen flex flex-col"
        >
          <div className="flex-1 px-6 pt-12 pb-32 max-w-lg mx-auto w-full">
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
                    <div className="max-w-lg mx-auto px-6 py-4 space-y-2.5">
                      <div className="flex gap-2">
                        {step !== "name" && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            className="h-11 px-4 bg-white text-sm font-medium flex-1
                                     border-secondary-200 hover:bg-secondary-50
                                     text-secondary-700 hover:text-secondary-800
                                     shadow-md hover:shadow-lg transition-all rounded-xl"
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                          </Button>
                        )}
                        <Button
                          type="button"
                          onClick={nextStep}
                          className={`${step === "name" ? "w-full" : "flex-1"} h-11 px-4 text-sm font-medium
                                    bg-gradient-to-r from-primary-600 to-accent text-white 
                                    hover:opacity-90 active:opacity-95
                                    transition-all duration-300 shadow-md hover:shadow-lg
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
                          className="w-full h-11 px-4 bg-white hover:bg-secondary-50 text-sm 
                                   font-medium border-secondary-200 text-secondary-600 
                                   hover:text-secondary-700 shadow-md hover:shadow-lg transition-all
                                   rounded-xl active:scale-[0.98]"
                        >
                          Skip for now
                        </Button>
                      )}
                      {step !== "name" && (
                        <p className="text-xs text-center text-secondary-500">
                          You can always update these preferences later in settings
                        </p>
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