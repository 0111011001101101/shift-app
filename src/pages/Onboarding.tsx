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
import { ArrowRight, ArrowLeft, ArrowUp } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50/90 via-white to-primary-50/80">
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="min-h-screen p-6 flex flex-col"
        >
          <div className="w-full max-w-md mx-auto flex-1 flex flex-col">
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center mb-8"
            >
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent shadow-xl
                            hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 group">
                <ArrowUp className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110" 
                        strokeWidth={2.5} />
              </div>
              <span className="ml-2 font-medium tracking-tight text-black">SHIFT</span>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="text-center space-y-3 mb-8"
            >
              <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent 
                           bg-gradient-to-r from-primary-600 via-primary-500 to-accent">
                {step === "name" ? "Welcome to SHIFT" : `Hi ${form.getValues("firstName")}!`}
              </h1>
              <p className="text-secondary-600 text-lg">
                {step === "name" 
                  ? "Let's start with your name"
                  : "Help us personalize your experience"}
              </p>
              {step === "personalization" && (
                <p className="text-sm text-muted-foreground">
                  All fields are optional and can be updated later in Settings
                </p>
              )}
            </motion.div>

            <Form {...form}>
              <form onSubmit={(e) => e.preventDefault()} className="flex-1 flex flex-col">
                <motion.div
                  variants={itemVariants}
                  className="flex-1 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-primary-100/20
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
                        name="aiPreferences.age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-secondary-800">Age</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Your age" 
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
                            <FormLabel className="text-secondary-800">Religion/Spirituality</FormLabel>
                            <FormDescription>Share your beliefs or spiritual practices</FormDescription>
                            <FormControl>
                              <Input 
                                placeholder="E.g., Christianity, Buddhism, Spiritual but not religious..." 
                                {...field}
                                className="h-12 bg-white/50 rounded-xl"
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
                            <FormLabel className="text-secondary-800">Ethnicity</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your ethnicity" 
                                {...field}
                                className="h-12 bg-white/50 rounded-xl"
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
                            <FormLabel className="text-secondary-800">Gender</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your gender identity" 
                                {...field}
                                className="h-12 bg-white/50 rounded-xl"
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
                            <FormLabel className="text-secondary-800">Occupation</FormLabel>
                            <FormDescription>Your current role or position</FormDescription>
                            <FormControl>
                              <Input 
                                placeholder="E.g., Entrepreneur, Manager, Developer..." 
                                {...field}
                                className="h-12 bg-white/50 rounded-xl"
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
                            <FormLabel className="text-secondary-800">Field of Work</FormLabel>
                            <FormDescription>Your industry or area of expertise</FormDescription>
                            <FormControl>
                              <Input 
                                placeholder="E.g., Technology, Healthcare, Education..." 
                                {...field}
                                className="h-12 bg-white/50 rounded-xl"
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
                            <FormLabel className="text-secondary-800">How do you prefer to work?</FormLabel>
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
                            <FormLabel className="text-secondary-800">What's your primary goal?</FormLabel>
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
                            <FormLabel className="text-secondary-800">Preferred communication style</FormLabel>
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
                            <FormLabel className="text-secondary-800">Tell more about yourself</FormLabel>
                            <FormDescription>
                              Share anything that would help us understand you better
                            </FormDescription>
                            <FormControl>
                              <Textarea 
                                placeholder="Share your story, goals, challenges, or anything else..." 
                                {...field}
                                className="min-h-[100px] bg-white/50 rounded-xl resize-none"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  className="mt-6 flex justify-between gap-4 sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pb-4 pt-8 -mx-6 px-6"
                >
                  {step !== "name" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("name")}
                      className="bg-white/80 hover:bg-white h-12"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  )}
                  {step === "personalization" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={skipPersonalization}
                      className="bg-white/80 hover:bg-white h-12"
                    >
                      Skip for now
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={nextStep}
                    className={`${step === "name" ? "w-full" : ""} h-12`}
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
