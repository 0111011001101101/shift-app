import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  const progress = (currentStep / (steps.length - 1)) * 100;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pb-2 bg-gradient-to-b from-white via-white to-transparent">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-secondary-600">
          Step {currentStep + 1} of {steps.length}
        </span>
        <span className="text-xs font-medium text-primary-600">
          {steps[currentStep]}
        </span>
      </div>
      
      <div className="relative h-1 bg-secondary-100/30 rounded-full overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-400 via-primary-500 to-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}