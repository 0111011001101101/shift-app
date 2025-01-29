import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
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
    country?: string;
    workStyle?: string;
    communicationStyle?: string;
    primaryGoal?: string;
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
      // Temporarily just navigate to home without saving
      navigate("/home");
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
              className="flex items-center justify-center"
            >
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 via-primary-400 to-accent shadow-xl
                            hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 group">
                <ArrowUp className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110" 
                        strokeWidth={2.5} />
              </div>
              <span className="ml-2 font-medium tracking-tight text-black">SHIFT</span>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="text-center space-y-3"
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
            </motion.div>

            <Form {...form}>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
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
                        name="aiPreferences.workStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-secondary-800">How do you prefer to work?</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-white/50 rounded-xl">
                                  <SelectValue placeholder="Select your work style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="structured">I like structure and planning</SelectItem>
                                <SelectItem value="flexible">I prefer flexibility and adaptability</SelectItem>
                                <SelectItem value="balanced">I aim for a balance of both</SelectItem>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-white/50 rounded-xl">
                                  <SelectValue placeholder="Select your main goal" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="productivity">Improve productivity</SelectItem>
                                <SelectItem value="balance">Better work-life balance</SelectItem>
                                <SelectItem value="growth">Personal/Professional growth</SelectItem>
                                <SelectItem value="stress">Stress management</SelectItem>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-white/50 rounded-xl">
                                  <SelectValue placeholder="Select communication style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="direct">Direct and concise</SelectItem>
                                <SelectItem value="detailed">Detailed and thorough</SelectItem>
                                <SelectItem value="casual">Casual and friendly</SelectItem>
                                <SelectItem value="motivational">Motivational and encouraging</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormDescription className="text-sm text-secondary-600 bg-primary-50/50 p-4 rounded-xl">
                        These preferences help us tailor SHIFT to your needs. You can always update them later in settings.
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