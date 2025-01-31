import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="relative h-1 bg-secondary-100/30">
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