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
          className="min-h-screen flex flex-col relative pb-[80px]"
        >
          <div className="flex-1 px-4 pt-8 max-w-md mx-auto w-full">
            <div className="mb-10">
              <ProgressIndicator 
                steps={steps} 
                currentStep={getCurrentStepIndex()} 
              />
            </div>
            
            <motion.div>
              <Form {...form}>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  {children}
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
            <div className="max-w-md mx-auto px-4 py-4 space-y-3">
              <div className="flex gap-2">
                {step !== "name" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="h-12 px-4 bg-white/80 text-sm font-medium flex-1
                             border-secondary-200/30 hover:bg-secondary-50
                             text-secondary-700 hover:text-secondary-800
                             shadow-sm hover:shadow-md transition-all rounded-xl"
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={nextStep}
                  className={`${step === "name" ? "w-full" : "flex-1"} h-12 w-12 px-4 
                            bg-gradient-to-r from-primary-600/90 to-accent/90 text-white 
                            hover:opacity-90 active:opacity-95
                            transition-all duration-300 shadow-sm hover:shadow-md
                            rounded-xl active:scale-[0.98] group`}
                >
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              {step !== "name" && skipPersonalization && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={skipPersonalization}
                  className="w-full h-10 px-4 bg-white/80 hover:bg-secondary-50 text-sm 
                           font-medium border-secondary-200/30 text-secondary-600 
                           hover:text-secondary-700 shadow-sm hover:shadow-md transition-all
                           rounded-xl active:scale-[0.98]"
                >
                  Skip for now
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};