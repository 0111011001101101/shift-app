import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { ArrowRight, ArrowLeft, ArrowUp, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type OnboardingStep = "name" | "personalization";

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

  const nextStep = () => {
    if (step === "name") {
      if (!form.getValues("firstName")) {
        form.setError("firstName", { message: "Please enter your name" });
        return;
      }
      setStep("personalization");
    } else {
      navigate("/home");
    }
  };

  const skipPersonalization = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50/80">
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="min-h-screen flex flex-col"
        >
          {/* Logo Section */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center justify-center pt-12 pb-6"
          >
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary-500 via-primary-400 to-accent/90 
                          shadow-lg hover:shadow-xl transition-all duration-300 
                          hover:-translate-y-0.5 group">
              <Sparkles className="w-5 h-5 text-white transition-transform duration-300 
                                group-hover:scale-110" strokeWidth={2.5} />
            </div>
            <span className="ml-2.5 text-xl font-semibold tracking-tight text-secondary-800">SHIFT</span>
          </motion.div>

          {/* Content Container */}
          <div className="flex-1 px-6 max-w-md mx-auto w-full">
            {/* Header Section */}
            <motion.div 
              variants={itemVariants}
              className="text-center space-y-3 mb-8"
            >
              <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent 
                           bg-gradient-to-r from-primary-600 via-primary-500 to-accent">
                {step === "name" ? "Welcome to SHIFT" : `Hi ${form.getValues("firstName")}!`}
              </h1>
              <p className="text-lg text-secondary-700">
                {step === "name" 
                  ? "Let's start with your name"
                  : "Help us personalize your experience"}
              </p>
              {step === "personalization" && (
                <p className="text-sm text-secondary-600">
                  All fields are optional and can be updated later in Settings
                </p>
              )}
            </motion.div>

            {/* Form Section */}
            <Form {...form}>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <motion.div
                  variants={itemVariants}
                  className={`space-y-6 ${step === "personalization" ? "pb-32" : "pb-24"}`}
                >
                  {step === "name" ? (
                    <FormField
                      control={form.control}
                      name="firstName"
                      rules={{ required: "Please enter your name" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-secondary-800">Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your name" 
                              {...field}
                              className="h-12 text-base bg-white/80 backdrop-blur-sm rounded-xl border-secondary-200
                                       focus:border-primary-400 focus:ring-primary-400/20
                                       placeholder:text-secondary-400"
                            />
                          </FormControl>
                          <FormMessage className="text-sm" />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <div className="space-y-8">
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
                        name="aiPreferences.religion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-secondary-800">Religion/Spirituality</FormLabel>
                            <FormDescription className="text-sm text-secondary-600">
                              Share your beliefs or spiritual practices
                            </FormDescription>
                            <FormControl>
                              <Input 
                                placeholder="E.g., Christianity, Buddhism, Spiritual but not religious..." 
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
                        name="aiPreferences.ethnicity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-secondary-800">Ethnicity</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your ethnicity" 
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
                  )}
                </motion.div>

                {/* Navigation Buttons */}
                <motion.div 
                  variants={itemVariants}
                  className="fixed bottom-0 left-0 right-0 w-full bg-white/80 backdrop-blur-sm border-t border-primary-100/30"
                >
                  <div className="max-w-md mx-auto px-6 py-4 space-y-3">
                    <div className="flex gap-3">
                      {step !== "name" && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep("name")}
                          className="h-12 px-4 bg-white text-base font-medium flex-1
                                   border-secondary-200 hover:bg-secondary-50
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
                        className={`${step === "name" ? "w-full" : "flex-1"} h-12 px-6 text-base font-medium
                                  bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700
                                  transition-all duration-300 text-white shadow-md hover:shadow-lg
                                  rounded-xl active:scale-[0.98]`}
                      >
                        {step === "name" ? "Continue" : "Complete Setup"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    {step === "personalization" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={skipPersonalization}
                        className="w-full h-12 px-4 bg-white hover:bg-secondary-50 text-base 
                                 font-medium border-secondary-200 text-secondary-600 
                                 hover:text-secondary-700 shadow-sm hover:shadow-md transition-all
                                 rounded-xl active:scale-[0.98]"
                      >
                        Skip for now
                      </Button>
                    )}
                  </div>
                </motion.div>
              </form>
            </Form>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
