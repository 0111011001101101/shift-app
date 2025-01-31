import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  const progress = (currentStep / (steps.length - 1)) * 100;
  
  return (
    <div className="w-full mb-4 px-2">
      <div className="relative h-1.5 bg-secondary-100/30 rounded-full overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-400 via-primary-500 to-accent 
                     rounded-full shadow-sm shadow-primary-500/10"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      
      {/* Step indicator */}
      <div className="mt-2 text-xs text-secondary-600 font-medium text-center">
        Step {currentStep + 1} of {steps.length}
      </div>
    </div>
  );
}