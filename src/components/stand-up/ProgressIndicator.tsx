import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-secondary-600">
          {steps[currentStep]}
        </span>
        <span className="text-sm font-medium text-primary-600">
          {progress.toFixed(0)}%
        </span>
      </div>
      
      <div className="relative h-1.5 bg-secondary-100/30 rounded-full overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-400 via-primary-500 to-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}