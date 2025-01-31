import { motion, AnimatePresence } from "framer-motion";
import { ProgressIndicator } from "@/components/stand-up/ProgressIndicator";
import { containerVariants } from "./animations";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Form } from "@/components/ui/form";
import { OnboardingStep } from "./types";

interface OnboardingContainerProps {
  step: OnboardingStep;
  form: any;
  steps: string[];
  getCurrentStepIndex: () => number;
  nextStep: () => void;
  prevStep: () => void;
  skipPersonalization?: () => void;
  children: React.ReactNode;
}

export const OnboardingContainer = ({
  step,
  form,
  steps,
  getCurrentStepIndex,
  nextStep,
  prevStep,
  skipPersonalization,
  children,
}: OnboardingContainerProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900/5 via-white/90 to-primary-50/30">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="min-h-screen flex flex-col"
        >
          <ProgressIndicator 
            steps={steps} 
            currentStep={getCurrentStepIndex()} 
          />
          
          <div className="flex-1 px-4 pt-16 pb-24 max-w-md mx-auto w-full">
            <motion.div>
              <Form {...form}>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  {children}
                </form>
              </Form>
            </motion.div>
          </div>

          <motion.div 
            className="fixed bottom-4 right-4"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Button
              type="button"
              onClick={nextStep}
              className="h-12 w-12 rounded-full bg-gradient-to-r from-primary-600/90 to-accent/90 
                        text-white hover:opacity-90 active:opacity-95 transition-all duration-300 
                        shadow-lg hover:shadow-xl active:scale-[0.98] group p-0"
              size="icon"
            >
              <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </motion.div>

          {step !== "name" && skipPersonalization && (
            <div className="fixed bottom-4 left-4">
              <Button
                type="button"
                variant="outline"
                onClick={skipPersonalization}
                className="h-10 px-4 bg-white/80 hover:bg-secondary-50 text-sm 
                         font-medium border-secondary-200/30 text-secondary-600 
                         hover:text-secondary-700 shadow-sm hover:shadow-md transition-all
                         rounded-xl active:scale-[0.98]"
              >
                Skip for now
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};