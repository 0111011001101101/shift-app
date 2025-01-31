import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <div className="relative flex justify-between items-center">
        {/* Background line */}
        <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-secondary-100/50 -translate-y-1/2 rounded-full" />
        
        {/* Progress line */}
        <motion.div 
          className="absolute top-1/2 left-0 h-[3px] bg-gradient-to-r from-primary-400 via-primary-500 to-accent 
                     -translate-y-1/2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        
        {/* Step indicators */}
        <div className="relative flex justify-between w-full">
          {steps.map((_, index) => (
            <motion.div 
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: index <= currentStep ? 1 : 0.8,
                opacity: 1
              }}
              transition={{ 
                duration: 0.3,
                delay: index * 0.1
              }}
              className="relative"
            >
              <div 
                className={cn(
                  "w-4 h-4 rounded-full transition-all duration-300",
                  index <= currentStep
                    ? "bg-gradient-to-r from-primary-400 to-primary-500 shadow-lg shadow-primary-400/30"
                    : "bg-secondary-100"
                )}
              />
              {index <= currentStep && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -inset-1 rounded-full bg-primary-400/20 animate-pulse"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}