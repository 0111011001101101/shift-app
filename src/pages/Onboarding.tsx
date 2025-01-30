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

const containerVariants = {
  hidden: { 
    opacity: 0,
    y: 20 
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.15
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { 
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0,
    y: 15
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

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
        return (
          <motion.div
            variants={itemVariants}
            className="w-full max-w-sm mx-auto space-y-8"
          >
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-600 to-accent 
                          shadow-lg shadow-primary-500/20 animate-float">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            <FormField
              control={form.control}
              name="firstName"
              rules={{ required: "Please enter your name" }}
              render={({ field }) => (
                <FormItem className="space-y-6">
                  <div className="text-center space-y-2">
                    <FormLabel className="text-2xl font-semibold bg-clip-text text-transparent 
                                      bg-gradient-to-r from-primary-600 via-primary-500 to-accent">
                      Hey there! What should we call you?
                    </FormLabel>
                    <FormDescription className="text-base text-secondary-600/90">
                      We'll use your name to make your experience more personal
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="Your name" 
                      {...field}
                      className="h-12 text-base bg-secondary-900/5 backdrop-blur-sm rounded-xl 
                               border-secondary-200/30 focus:border-primary-400 focus:ring-primary-400/20 
                               shadow-sm placeholder:text-secondary-400/70 transition-all duration-300"
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
          <motion.div
            variants={itemVariants}
            className="space-y-8"
          >
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-600 to-accent 
                          shadow-lg shadow-primary-500/20 animate-float">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r 
                           from-primary-600 via-primary-500 to-accent">
                Hi {form.getValues("firstName")}! Tell us about yourself
              </h2>
              <p className="text-base text-secondary-600/90">This helps us understand you better</p>
            </div>
            
            <div className="space-y-6 rounded-2xl bg-secondary-900/5 backdrop-blur-sm p-6 
                           shadow-sm border border-secondary-200/30">
              <FormField
                control={form.control}
                name="aiPreferences.age"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-base font-medium text-secondary-800">Age Range</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-white/40 rounded-xl text-base border-secondary-200/30
                                                focus:border-primary-400 focus:ring-primary-400/20">
                          <SelectValue placeholder="Select your age range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white/95 backdrop-blur-sm border-secondary-200/30">
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

              <FormField
                control={form.control}
                name="aiPreferences.gender"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-base font-medium text-secondary-800">Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-white/90 rounded-xl text-base">
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white/95 backdrop-blur-sm border-secondary-200">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="aiPreferences.country"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-medium text-secondary-800">Where are you based?</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your country" 
                          {...field}
                          className="h-12 text-base bg-white/90 rounded-xl"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aiPreferences.ethnicity"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-medium text-secondary-800">Ethnicity</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your ethnicity" 
                          {...field}
                          className="h-12 text-base bg-white/90 rounded-xl"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="aiPreferences.religion"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-base font-medium text-secondary-800">Religion/Spirituality</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your religion or spiritual practice" 
                        {...field}
                        className="h-12 text-base bg-white/90 rounded-xl"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </motion.div>
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50/30">
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
            
            <motion.div 
              variants={itemVariants}
              className="mt-8"
            >
              <Form {...form}>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <motion.div
                    variants={itemVariants}
                    className="space-y-4"
                  >
                    {renderStepContent()}
                  </motion.div>
                </form>
              </Form>
            </motion.div>
          </div>

          <motion.div 
            variants={itemVariants}
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
                             shadow-sm hover:shadow-md transition-all rounded-xl"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={nextStep}
                  className={`${step === "name" ? "w-full" : "flex-1"} h-10 px-4 text-sm font-medium
                            bg-gradient-to-r from-primary-600 to-accent text-white 
                            hover:opacity-90 active:opacity-95
                            transition-all duration-300 shadow-sm hover:shadow-md
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
                  className="w-full h-9 px-4 bg-white/80 hover:bg-secondary-50 text-sm 
                           font-medium border-secondary-200/30 text-secondary-600 
                           hover:text-secondary-700 shadow-sm hover:shadow-md transition-all
                           rounded-xl active:scale-[0.98]"
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